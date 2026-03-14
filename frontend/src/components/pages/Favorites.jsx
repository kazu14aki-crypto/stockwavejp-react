import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const STORAGE_KEY = 'swjp_favorites'

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} style={{
          display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent)', margin: '0 3px',
          animation: `pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}
      <div style={{ marginTop: '12px', fontSize: '12px' }}>チE�Eタ取得中...</div>
    </div>
  )
}

export default function Favorites() {
  const [themeNames,  setThemeNames]  = useState([])
  const [favorites,   setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
  })
  const [themeData,   setThemeData]   = useState([])
  const [period,      setPeriod]      = useState('1mo')
  const [loading,     setLoading]     = useState(false)

  const PERIODS = [
    { label: '1週閁E, value: '5d' },
    { label: '1ヶ朁E, value: '1mo' },
    { label: '3ヶ朁E, value: '3mo' },
    { label: '1年',   value: '1y'  },
  ]

  useEffect(() => {
    fetch(`${API}/api/theme-names`).then(r => r.json()).then(d => setThemeNames(d.themes)).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!favorites.length) return
    setLoading(true)
    fetch(`${API}/api/themes?period=${period}`)
      .then(r => r.json())
      .then(d => {
        const filtered = d.themes.filter(t => favorites.includes(t.theme))
        setThemeData(filtered)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [favorites, period])

  const toggleFav = (t) =>
    setFavorites(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t])

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        お気に入めE      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        注目チE�Eマを登録して素早くチェチE��
      </p>

      {/* チE�Eマ選抁E*/}
      <div style={sHead}>
        <span style={sTitle}>チE�Eマを選抁E/span>
        <div style={sLine} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {themeNames.map(t => (
          <button key={t} onClick={() => toggleFav(t)} style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
            border: `1px solid ${favorites.includes(t) ? 'var(--red)' : 'var(--border)'}`,
            background: favorites.includes(t) ? 'rgba(255,69,96,0.12)' : 'transparent',
            color: favorites.includes(t) ? 'var(--red)' : 'var(--text3)',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}>
            {favorites.includes(t) ? '⭁E' : ''}{t}
          </button>
        ))}
      </div>

      {/* お気に入りデータ */}
      {favorites.length === 0 ? (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '40px', textAlign: 'center',
          color: 'var(--text3)', fontSize: '13px',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭁E/div>
          上�Eボタンからお気に入りテーマを追加してください
        </div>
      ) : (
        <>
          <div style={sHead}>
            <span style={sTitle}>お気に入りテーチE({favorites.length}件)</span>
            <div style={sLine} />
            <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
              {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {loading ? <Loading /> : (
            themeData.map((t, i) => (
              <div key={t.theme} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '14px 16px', marginBottom: '6px',
                display: 'flex', alignItems: 'center', gap: '16px',
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <button onClick={() => toggleFav(t.theme)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '16px', lineHeight: 1,
                }}>⭁E/button>
                <span style={{ flex: 1, fontSize: '14px', color: '#c0d0e8', fontWeight: 500 }}>
                  {t.theme}
                </span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700,
                  color: t.pct >= 0 ? 'var(--red)' : 'var(--green)',
                }}>
                  {t.pct >= 0 ? '+' : ''}{t.pct.toFixed(2)}%
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  {PERIODS.find(p => p.value === period)?.label}
                </span>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}

const sHead  = { display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 12px' }
const sTitle = { fontSize: '11px', fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }
const sLine  = { flex: 1, height: '1px', background: 'var(--border)' }
const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '12px',
  padding: '4px 10px', cursor: 'pointer', outline: 'none',
}
