/**
 * useMarketData — GitHub Pagesに保存されたJSONを読み込む
 *
 * 優先順位：
 * 1. public/data/market.json（GitHub Actionsが生成・即時）
 * 2. LocalStorageキャッシュ（前回データ）
 * 3. Renderバックエンド（フォールバック）
 */
import { useState, useEffect, useCallback } from 'react'

const API          = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const DATA_URL     = '/data/market.json'
const CACHE_PREFIX = 'swjp_v2_'

function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    // 3時間以内のキャッシュを有効とする
    if (Date.now() - ts > 3 * 60 * 60 * 1000) return null
    return data
  } catch { return null }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

// market.json全体をシングルトンとして保持
let _marketJson      = null
let _marketJsonTs    = 0
let _fetchingPromise = null
const MARKET_JSON_TTL = 5 * 60 * 1000  // 5分間は再取得しない

async function fetchMarketJson() {
  // すでに取得済みかつ新鮮なら即返す
  if (_marketJson && Date.now() - _marketJsonTs < MARKET_JSON_TTL) {
    return _marketJson
  }
  // 取得中なら同じPromiseを返す（重複リクエスト防止）
  if (_fetchingPromise) return _fetchingPromise

  _fetchingPromise = fetch(`${DATA_URL}?t=${Date.now()}`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json()
    })
    .then(json => {
      _marketJson   = json
      _marketJsonTs = Date.now()
      _fetchingPromise = null
      return json
    })
    .catch(e => {
      _fetchingPromise = null
      throw e
    })

  return _fetchingPromise
}


/**
 * テーマデータを取得するフック
 * @param {string} period - '5d' | '1mo' | '3mo' | '6mo' | '1y'
 */
export function useThemes(period = '1mo') {
  const cacheKey = `themes_${period}`
  const [data,       setData]       = useState(() => readCache(cacheKey))
  const [loading,    setLoading]    = useState(!readCache(cacheKey))
  const [refreshing, setRefreshing] = useState(false)
  const [updatedAt,  setUpdatedAt]  = useState(null)

  const load = useCallback(async (isBackground = false) => {
    if (isBackground) setRefreshing(true)
    else              setLoading(true)

    try {
      // ① market.jsonから取得（高速）
      const json   = await fetchMarketJson()
      const result = json[cacheKey]
      if (result) {
        setData(result)
        writeCache(cacheKey, result)
        setUpdatedAt(result.updated_at || null)
        return
      }
    } catch {
      // market.jsonが存在しない場合はフォールバック
    }

    try {
      // ② フォールバック：Renderバックエンドから取得
      const period_param = period
      const res  = await fetch(`${API}/api/themes?period=${period_param}`)
      const json = await res.json()
      setData(json)
      writeCache(cacheKey, json)
    } catch {
      if (!isBackground) {
        setData(readCache(cacheKey)) // キャッシュがあれば表示
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [period, cacheKey])

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) {
      setData(cached)
      setLoading(false)
      load(true)   // バックグラウンド更新
    } else {
      load(false)
    }
  }, [period])

  return { data, loading, refreshing, updatedAt, refresh: () => load(false) }
}


/**
 * マクロデータを取得するフック
 */
export function useMacro(period = '1mo') {
  const cacheKey = `macro_${period}`
  const [data,    setData]    = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(!readCache(cacheKey))

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    fetchMarketJson()
      .then(json => {
        const result = json[`macro_${period}`]
        if (result) { setData(result); writeCache(cacheKey, result) }
      })
      .catch(() => {
        fetch(`${API}/api/macro?period=${period}`)
          .then(r => r.json())
          .then(json => { setData(json); writeCache(cacheKey, json) })
          .catch(() => {})
      })
      .finally(() => setLoading(false))
  }, [period])

  return { data, loading }
}


/**
 * ステータスを取得するフック
 */
export function useStatus() {
  const [status, setStatus] = useState({
    time: '--:--', is_open: false, label: '...'
  })

  useEffect(() => {
    const fetch_ = async () => {
      try {
        // market.jsonのstatusを優先
        const json = await fetchMarketJson()
        if (json.status) {
          setStatus({
            ...json.status,
            label: json.status.is_open ? '市場オープン中' : '市場クローズ中',
          })
          return
        }
      } catch {}
      // フォールバック：バックエンドAPI
      try {
        const res  = await fetch(`${API}/api/status`)
        const data = await res.json()
        setStatus({
          ...data,
          label: data.is_open ? '市場オープン中' : '市場クローズ中',
        })
      } catch {
        const now = new Date()
        const jst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000)
        setStatus({
          time: `${String(jst.getHours()).padStart(2,'0')}:${String(jst.getMinutes()).padStart(2,'0')} JST`,
          is_open: false, label: '接続エラー',
        })
      }
    }
    fetch_()
    const id = setInterval(fetch_, 60000)
    return () => clearInterval(id)
  }, [])

  return status
}


/**
 * useTrends — 騰落推移データ（Renderフォールバック付き）
 */
export function useTrends(themes, period) {
  const cacheKey = `trends_${themes}_${period}`
  const [data,       setData]       = useState(() => readCache(cacheKey))
  const [loading,    setLoading]    = useState(!readCache(cacheKey))
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!themes) return
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    setRefreshing(true)
    fetch(`${API}/api/trends?themes=${encodeURIComponent(themes)}&period=${period}`)
      .then(r => r.json())
      .then(json => { setData(json); writeCache(cacheKey, json) })
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [themes, period])

  return { data, loading, refreshing }
}


/**
 * useThemeNames — テーマ名一覧（market.json優先）
 */
export function useThemeNames() {
  const cacheKey = 'theme_names'
  const [names, setNames] = useState(() => {
    const cached = readCache(cacheKey)
    // market.jsonのtheme_namesかthemes_1moから取得
    if (cached?.themes) return cached.themes
    return []
  })

  useEffect(() => {
    fetchMarketJson()
      .then(json => {
        // market.jsonにtheme_namesがあればそれを使う
        const fromNames  = json['theme_names']?.themes || []
        const fromThemes = json['themes_1mo']?.themes?.map(t => t.theme) || []
        const themes = fromNames.length > 0 ? fromNames : fromThemes
        if (themes.length > 0) {
          setNames(themes)
          writeCache(cacheKey, { themes })
        }
      })
      .catch(() => {
        fetch(`${API}/api/theme-names`)
          .then(r => r.json())
          .then(d => { setNames(d.themes || []); writeCache(cacheKey, d) })
          .catch(() => {})
      })
  }, [])

  return names
}


/**
 * useHeatmap — ヒートマップデータ（market.json優先）
 */
export function useHeatmap() {
  const cacheKey = 'heatmap'
  const [data,    setData]    = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(!readCache(cacheKey))

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    fetchMarketJson()
      .then(json => {
        if (json.heatmap) {
          setData(json.heatmap)
          writeCache(cacheKey, json.heatmap)
          setLoading(false)
          return
        }
        throw new Error('no heatmap in market.json')
      })
      .catch(() => {
        fetch(`${API}/api/heatmap`)
          .then(r => r.json())
          .then(json => { setData(json); writeCache(cacheKey, json) })
          .catch(() => {})
          .finally(() => setLoading(false))
      })
  }, [])

  return { data, loading }
}


/**
 * useMonthlyHeatmap — 月別ヒートマップ（キャッシュ付き）
 */
export function useMonthlyHeatmap() {
  const cacheKey = 'monthly_heatmap'
  const [data,    setData]    = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(!readCache(cacheKey))

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    fetch(`${API}/api/heatmap/monthly`)
      .then(r => r.json())
      .then(json => { setData(json); writeCache(cacheKey, json) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}


/**
 * useSegmentDetail — 市場別詳細（キャッシュ付き）
 */
export function useSegmentDetail(segName, period) {
  const cacheKey = `seg_${segName}_${period}`
  const [data,    setData]    = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(!readCache(cacheKey))

  useEffect(() => {
    if (!segName) return
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    fetch(`${API}/api/market-rank/${encodeURIComponent(segName)}?period=${period}`)
      .then(r => r.json())
      .then(json => { setData(json); writeCache(cacheKey, json) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [segName, period])

  return { data, loading }
}


/**
 * useThemeDetail — テーマ別詳細（キャッシュ付き）
 */
export function useThemeDetail(themeName, period) {
  const cacheKey = `theme_detail_${themeName}_${period}`
  const [data,    setData]    = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(!readCache(cacheKey))

  useEffect(() => {
    if (!themeName) return
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false) }

    fetch(`${API}/api/theme-detail/${encodeURIComponent(themeName)}?period=${period}`)
      .then(r => r.json())
      .then(json => { setData(json); writeCache(cacheKey, json) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [themeName, period])

  return { data, loading }
}
