import { useState, useEffect } from 'react'
import { useThemeNames, useTrends, useMacro } from '../../hooks/useMarketData'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1週間', value: '5d' },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]
const COLORS = [
  '#ff4560','#ff8c42','#ffd166','#06d6a0','#4a9eff',
  '#aa77ff','#ff77aa','#44dddd',
]

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
      <div style={{ marginTop: '12px', fontSize: '12px' }}>データ取得中...</div>
    </div>
  )
}

function MultiLineChart({ trends, selected }) {
  if (!selected.length) return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '13px' }}>
      テーマを1つ以上選択してください
    </div>
  )

  const allDates = new Set()
  selected.forEach(theme => (trends[theme] ?? []).forEach(d => allDates.add(d.date)))
  const dates = [...allDates].sort()
  if (!dates.length) return null

  const W = 800, H = 280, PL = 50, PR = 20, PT = 20, PB = 40
  let yMin = Infinity, yMax = -Infinity
  selected.forEach(theme => {
    ;(trends[theme] ?? []).forEach(d => {
      if (d.pct < yMin) yMin = d.pct
      if (d.pct > yMax) yMax = d.pct
    })
  })
  const yPad = Math.max(Math.abs(yMax - yMin) * 0.1, 1)
  yMin -= yPad; yMax += yPad

  const xS = (i) => PL + (i / (dates.length - 1)) * (W - PL - PR)
  const yS = (v) => PT + (1 - (v - yMin) / (yMax - yMin)) * (H - PT - PB)

  const xLabels = []
  const step = Math.max(1, Math.floor(dates.length / 5))
  for (let i = 0; i < dates.length; i += step) xLabels.push({ i, date: dates[i] })

  const yLabels = Array.from({ length: 5 }, (_, i) => {
    const v = yMin + (yMax - yMin) * (i / 4)
    return { v, y: yS(v) }
  })

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '16px', overflowX: 'auto',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', minWidth: '400px' }}>
        {yLabels.map(({ v, y }) => (
          <g key={v}>
            <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="rgba(74,120,200,0.08)" strokeWidth="1"/>
            <text x={PL-6} y={y+4} textAnchor="end" fill="var(--text3)" fontSize="10" fontFamily="DM Mono">{v.toFixed(1)}%</text>
          </g>
        ))}
        {yMin < 0 && yMax > 0 && (
          <line x1={PL} y1={yS(0)} x2={W-PR} y2={yS(0)} stroke="rgba(74,120,200,0.3)" strokeWidth="1" strokeDasharray="4,4"/>
        )}
        {xLabels.map(({ i, date }) => (
          <text key={date} x={xS(i)} y={H-8} textAnchor="middle" fill="var(--text3)" fontSize="10" fontFamily="DM Sans">{date.slice(2,7)}</text>
        ))}
        {selected.map((theme, ti) => {
          const data = trends[theme] ?? []
          if (!data.length) return null
          const pts = data.map(d => {
            const xi = dates.indexOf(d.date)
            return xi >= 0 ? `${xS(xi)},${yS(d.pct)}` : null
          }).filter(Boolean)
          return pts.length ? (
            <polyline key={theme} points={pts.join(' ')} fill="none"
              stroke={COLORS[ti % COLORS.length]} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round"/>
          ) : null
        })}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
        {selected.map((theme, ti) => {
          const data = trends[theme] ?? []
          const last = data[data.length - 1]
          const color = COLORS[ti % COLORS.length]
          return (
            <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '2px', background: color }} />
              <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{theme}</span>
              {last && <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color, fontWeight: 600 }}>
                {last.pct >= 0 ? '+' : ''}{last.pct.toFixed(1)}%
              </span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Compare() {
  const [period,     setPeriod]     = useState('1y')
  const [themeNames, setThemeNames] = useState([])
  const [selThemes,  setSelThemes]  = useState([])
  const [themeTrends, setThemeTrends] = useState({})
  const [macroData,  setMacroData]  = useState({})
  const [selMacro,   setSelMacro]   = useState(['国内株(ETF)', '米国株(ETF)', 'ドル円'])
  const [loadingT,   setLoadingT]   = useState(false)
  const [loadingM,   setLoadingM]   = useState(false)

  useEffect(() => {
    fetch(`${API}/api/theme-names`).then(r => r.json()).then(d => {
      setThemeNames(d.themes)
      setSelThemes(d.themes.slice(0, 3))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selThemes.length) return
    setLoadingT(true)
    fetch(`${API}/api/trends?themes=${encodeURIComponent(selThemes.join(','))}&period=${period}`)
      .then(r => r.json())
      .then(d => setThemeTrends(d.trends))
      .catch(() => {})
      .finally(() => setLoadingT(false))
  }, [selThemes, period])

  useEffect(() => {
    setLoadingM(true)
    fetch(`${API}/api/macro?period=${period}`)
      .then(r => r.json())
      .then(d => setMacroData(d.data))
      .catch(() => {})
      .finally(() => setLoadingM(false))
  }, [period])

  const toggleTheme = (t) =>
    setSelThemes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])
  const toggleMacro = (t) =>
    setSelMacro(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  const macroNames = Object.keys(macroData)

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        テーマ・マクロ比較
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        テーマ騰落率の比較 ＋ マクロ指標との対比
      </p>

      {/* 期間選択 */}
      <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
        {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* テーマ比較 */}
      <div style={sHead}>
        <span style={sTitle}>テーマ比較</span>
        <div style={sLine} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {themeNames.map(t => (
          <button key={t} onClick={() => toggleTheme(t)} style={{
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
            border: `1px solid ${selThemes.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
            background: selThemes.includes(t) ? 'rgba(74,158,255,0.12)' : 'transparent',
            color: selThemes.includes(t) ? 'var(--accent)' : 'var(--text3)',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>
      {loadingT ? <Loading /> : <MultiLineChart trends={themeTrends} selected={selThemes} />}

      {/* マクロ比較 */}
      <div style={{ ...sHead, marginTop: '32px' }}>
        <span style={sTitle}>マクロ比較</span>
        <div style={sLine} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {macroNames.map(t => (
          <button key={t} onClick={() => toggleMacro(t)} style={{
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
            border: `1px solid ${selMacro.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
            background: selMacro.includes(t) ? 'rgba(74,158,255,0.12)' : 'transparent',
            color: selMacro.includes(t) ? 'var(--accent)' : 'var(--text3)',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>
      {loadingM ? <Loading /> : <MultiLineChart trends={macroData} selected={selMacro} />}
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none', marginBottom: '4px',
}
const sHead  = { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 12px' }
const sTitle = { fontSize: '11px', fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }
const sLine  = { flex: 1, height: '1px', background: 'var(--border)' }
