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
