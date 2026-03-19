/**
 * useStaleData — Stale-While-Revalidate パターン
 *
 * 動作フロー：
 * 1. LocalStorageに前回データがあれば即座に表示（stale=古いデータ）
 * 2. バックグラウンドで最新データをfetch
 * 3. 取得完了後に画面を更新
 * 4. 新しいデータをLocalStorageに保存（次回用）
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const CACHE_PREFIX  = 'swjp_cache_'
const CACHE_MAX_AGE = 2 * 60 * 60 * 1000  // 2時間

function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_MAX_AGE) return null
    return data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      ts: Date.now(),
    }))
  } catch {}
}

/**
 * @param {string} url         - fetchするURL
 * @param {string} cacheKey    - LocalStorageのキー
 * @param {*}      defaultData - データがない場合のデフォルト値
 * @returns {{ data, loading, refreshing, error, refresh, lastUpdate }}
 */
export function useStaleData(url, cacheKey, defaultData = null) {
  const [data,       setData]       = useState(() => readCache(cacheKey) ?? defaultData)
  const [loading,    setLoading]    = useState(() => !readCache(cacheKey))
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const abortRef = useRef(null)

  const fetchData = useCallback(async (isBackground = false) => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    if (isBackground) {
      setRefreshing(true)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const res = await fetch(url, { signal: abortRef.current.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      writeCache(cacheKey, json)
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      if (e.name === 'AbortError') return
      if (!isBackground) {
        setError('データの取得に失敗しました')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [url, cacheKey])

  useEffect(() => {
    const cached = readCache(cacheKey)
    if (cached) {
      setData(cached)
      setLoading(false)
      fetchData(true)
    } else {
      fetchData(false)
    }
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [url, cacheKey])

  const refresh = useCallback(() => fetchData(false), [fetchData])

  return { data, loading, refreshing, error, refresh, lastUpdate }
}
