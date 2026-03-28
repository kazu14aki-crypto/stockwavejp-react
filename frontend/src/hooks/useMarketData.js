/**
 * useMarketData — market.json優先取得フック（キャッシュ拡大版）
 *
 * 優先順位:
 *   1. public/data/market.json（GitHub Actionsが定時生成・即時）
 *   2. LocalStorageキャッシュ（有効期限3時間）
 *   3. Renderバックエンド（フォールバック）
 *
 * market.jsonに含まれるキー一覧（キャッシュ拡大後）:
 *   themes_{5d/1mo/3mo/6mo/1y}         テーマ一覧
 *   macro_{1mo/1y}                     マクロ指標
 *   heatmap                            期間別ヒートマップ
 *   heatmap_monthly                    月次ヒートマップ
 *   momentum_{1mo/3mo}                 騰落モメンタム
 *   theme_detail_{テーマ名}_{period}   テーマ別詳細★
 *   seg_{セグメント名}_{period}        市場別銘柄詳細★
 *   market_rank_{period}               市場別ランキング一覧★
 *   status / theme_names
 */
import { useState, useEffect, useCallback } from 'react'

const API          = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const DATA_URL     = '/data/market.json'
const CACHE_PREFIX = 'swjp_v2_'
const CACHE_TTL    = 3 * 60 * 60 * 1000   // 3時間

// ── LocalStorage ─────────────────────────────
function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch { return null }
}
function writeCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

// ── market.json シングルトン ──────────────────
let _marketJson      = null
let _marketJsonTs    = 0
let _fetchingPromise = null
const MARKET_JSON_TTL = 5 * 60 * 1000  // 5分

async function fetchMarketJson() {
  if (_marketJson && Date.now() - _marketJsonTs < MARKET_JSON_TTL) return _marketJson
  if (_fetchingPromise) return _fetchingPromise
  _fetchingPromise = fetch(`${DATA_URL}?t=${Date.now()}`)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
    .then(json => { _marketJson = json; _marketJsonTs = Date.now(); _fetchingPromise = null; return json })
    .catch(e  => { _fetchingPromise = null; throw e })
  return _fetchingPromise
}

// ── 汎用フック：market.json → LocalStorage → Render の順で取得 ──
function useMarketJsonKey(jsonKey, apiFallback, deps = []) {
  const [data,    setData]    = useState(() => readCache(jsonKey))
  const [loading, setLoading] = useState(!readCache(jsonKey))

  useEffect(() => {
    let cancelled = false
    const cached = readCache(jsonKey)
    if (cached) { setData(cached); setLoading(false) }

    ;(async () => {
      try {
        const json   = await fetchMarketJson()
        const result = json[jsonKey]
        if (result && !cancelled) {
          setData(result); writeCache(jsonKey, result); setLoading(false)
          return
        }
      } catch {}
      // フォールバック
      if (apiFallback) {
        try {
          const r    = await fetch(`${API}${apiFallback}`)
          const json = await r.json()
          if (!cancelled) { setData(json); writeCache(jsonKey, json) }
        } catch {}
      }
      if (!cancelled) setLoading(false)
    })()

    return () => { cancelled = true }
  }, deps)

  return { data, loading }
}


// ════════════════════════════════════════════════════════
//  公開フック
// ════════════════════════════════════════════════════════

/**
 * useThemes — テーマ一覧
 */
export function useThemes(period = '1mo') {
  const cacheKey = `themes_${period}`
  const [data,       setData]       = useState(() => readCache(cacheKey))
  const [loading,    setLoading]    = useState(!readCache(cacheKey))
  const [refreshing, setRefreshing] = useState(false)
  const [updatedAt,  setUpdatedAt]  = useState(null)

  const load = useCallback(async (isBackground = false) => {
    if (isBackground) setRefreshing(true); else setLoading(true)
    try {
      const json   = await fetchMarketJson()
      const result = json[cacheKey]
      if (result) {
        setData(result); writeCache(cacheKey, result)
        setUpdatedAt(result.updated_at || null); return
      }
    } catch {}
    try {
      const res  = await fetch(`${API}/api/themes?period=${period}`)
      const json = await res.json()
      setData(json); writeCache(cacheKey, json)
    } catch {
      if (!isBackground) setData(readCache(cacheKey))
    } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [period, cacheKey])

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) { setData(cached); setLoading(false); load(true) }
    else        { load(false) }
  }, [period])

  return { data, loading, refreshing, updatedAt, refresh: () => load(false) }
}


/**
 * useMacro — マクロ指標
 */
export function useMacro(period = '1mo') {
  return useMarketJsonKey(
    `macro_${period}`,
    `/api/macro?period=${period}`,
    [period]
  )
}


/**
 * useStatus — 市場ステータス
 */
export function useStatus() {
  const [status, setStatus] = useState({ time: '--:--', is_open: false, label: '...' })

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const json = await fetchMarketJson()
        if (json.status) {
          setStatus({ ...json.status, label: json.status.is_open ? '市場オープン中' : '市場クローズ中' })
          return
        }
      } catch {}
      try {
        const res  = await fetch(`${API}/api/status`)
        const data = await res.json()
        setStatus({ ...data, label: data.is_open ? '市場オープン中' : '市場クローズ中' })
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
 * useTrends — テーマ比較グラフ（常にRender）
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
 * useThemeNames — テーマ名一覧
 */
export function useThemeNames() {
  const cacheKey = 'theme_names'
  const [names, setNames] = useState(() => {
    const c = readCache(cacheKey)
    return c?.themes || []
  })

  useEffect(() => {
    fetchMarketJson()
      .then(json => {
        const fromNames  = json['theme_names']?.themes || []
        const fromThemes = json['themes_1mo']?.themes?.map(t => t.theme) || []
        const themes = fromNames.length > 0 ? fromNames : fromThemes
        if (themes.length > 0) { setNames(themes); writeCache(cacheKey, { themes }) }
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
 * useHeatmap — 期間別ヒートマップ
 */
export function useHeatmap() {
  return useMarketJsonKey('heatmap', '/api/heatmap')
}


/**
 * useMonthlyHeatmap — 月次ヒートマップ ★market.json優先に変更
 */
export function useMonthlyHeatmap() {
  return useMarketJsonKey('heatmap_monthly', '/api/heatmap/monthly')
}


/**
 * useMomentum — 騰落モメンタム ★market.json優先に変更
 */
export function useMomentum(period = '1mo') {
  return useMarketJsonKey(
    `momentum_${period}`,
    `/api/momentum?period=${period}`,
    [period]
  )
}


/**
 * useSegmentDetail — 市場別銘柄詳細 ★market.json優先に変更（最重要）
 */
export function useSegmentDetail(segName, period) {
  const jsonKey = `seg_${segName}_${period}`
  const [data,    setData]    = useState(() => readCache(jsonKey))
  const [loading, setLoading] = useState(!readCache(jsonKey))

  useEffect(() => {
    if (!segName) return
    let cancelled = false
    const cached = readCache(jsonKey)
    if (cached) { setData(cached); setLoading(false) }

    ;(async () => {
      try {
        const json   = await fetchMarketJson()
        const result = json[jsonKey]
        if (result && !cancelled) {
          setData(result); writeCache(jsonKey, result); setLoading(false); return
        }
      } catch {}
      // フォールバック: Render API
      try {
        const r    = await fetch(`${API}/api/market-rank/${encodeURIComponent(segName)}?period=${period}`)
        const json = await r.json()
        if (!cancelled) { setData(json); writeCache(jsonKey, json) }
      } catch {}
      if (!cancelled) setLoading(false)
    })()

    return () => { cancelled = true }
  }, [segName, period])

  return { data, loading }
}


/**
 * useThemeDetail — テーマ別詳細 ★market.json優先に変更（最重要）
 */
export function useThemeDetail(themeName, period) {
  const jsonKey = `theme_detail_${themeName}_${period}`
  const [data,    setData]    = useState(() => readCache(jsonKey))
  const [loading, setLoading] = useState(!readCache(jsonKey))

  useEffect(() => {
    if (!themeName) return
    let cancelled = false
    const cached = readCache(jsonKey)
    if (cached) { setData(cached); setLoading(false) }

    ;(async () => {
      try {
        const json   = await fetchMarketJson()
        const result = json[jsonKey]
        if (result && !cancelled) {
          setData(result); writeCache(jsonKey, result); setLoading(false); return
        }
      } catch {}
      // フォールバック: Render API
      try {
        const r    = await fetch(`${API}/api/theme-detail/${encodeURIComponent(themeName)}?period=${period}`)
        const json = await r.json()
        if (!cancelled) { setData(json); writeCache(jsonKey, json) }
      } catch {}
      if (!cancelled) setLoading(false)
    })()

    return () => { cancelled = true }
  }, [themeName, period])

  return { data, loading }
}


/**
 * useMarketRankList — 市場別ランキング一覧 ★market.json優先に変更
 */
export function useMarketRankList(period = '1mo') {
  return useMarketJsonKey(
    `market_rank_${period}`,
    `/api/market-rank-list?period=${period}`,
    [period]
  )
}
