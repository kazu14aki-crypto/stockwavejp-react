import { useState, useEffect, useRef } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1騾ｱ髢・, value: '5d' },
  { label: '1繝ｶ譛・, value: '1mo' },
  { label: '3繝ｶ譛・, value: '3mo' },
  { label: '6繝ｶ譛・, value: '6mo' },
  { label: '1蟷ｴ',   value: '1y'  },
]
const COLORS = [
  '#ff4560','#ff8c42','#ffd166','#06d6a0','#4a9eff',
  '#aa77ff','#ff77aa','#44dddd','#aaddff','#ffaa77',
]
const MODES = ['醇 荳贋ｽ・・倶ｸ倶ｽ・', '笨・謇句虚驕ｸ謚・, '投 蜈ｨ繝・・繝・]

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} style={{
          display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent)', margin: '0 3px',
          animation: `pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}
      <div style={{ marginTop: '12px', fontSize: '12px' }}>譌･谺｡繝・・繧ｿ蜿門ｾ嶺ｸｭ...・亥・蝗槭・譎る俣縺後°縺九ｊ縺ｾ縺呻ｼ・/div>
    </div>
  )
}

// SVG繝吶・繧ｹ縺ｮ霆ｽ驥乗釜繧檎ｷ壹げ繝ｩ繝・function LineChart({ trends, selected }) {
  const svgRef = useRef(null)

  if (!selected.length) return null

  // 蜈ｨ繝・・繧ｿ繧呈ｭ｣隕丞喧
  const allDates = new Set()
  selected.forEach(theme => {
    const data = trends[theme] ?? []
    data.forEach(d => allDates.add(d.date))
  })
  const dates = [...allDates].sort()
  if (!dates.length) return null

  const W = 800, H = 300, PL = 50, PR = 20, PT = 20, PB = 40

  // Y霆ｸ遽・峇
  let yMin = Infinity, yMax = -Infinity
  selected.forEach(theme => {
    const data = trends[theme] ?? []
    data.forEach(d => {
      if (d.pct < yMin) yMin = d.pct
      if (d.pct > yMax) yMax = d.pct
    })
  })
  const yPad = Math.max(Math.abs(yMax - yMin) * 0.1, 1)
  yMin -= yPad; yMax += yPad

  const xScale = (i) => PL + (i / (dates.length - 1)) * (W - PL - PR)
  const yScale = (v) => PT + (1 - (v - yMin) / (yMax - yMin)) * (H - PT - PB)

  // X霆ｸ繝ｩ繝吶Ν・・轤ｹ遞句ｺｦ・・  const xLabels = []
  const step = Math.max(1, Math.floor(dates.length / 6))
  for (let i = 0; i < dates.length; i += step) xLabels.push({ i, date: dates[i] })

  // Y霆ｸ繝ｩ繝吶Ν・・轤ｹ・・  const yLabels = []
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * (i / 4)
    yLabels.push({ v, y: yScale(v) })
  }

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '16px', overflowX: 'auto',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', minWidth: '400px' }}>
        {/* 繧ｰ繝ｪ繝・ラ */}
        {yLabels.map(({ v, y }) => (
          <g key={v}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="rgba(74,120,200,0.08)" strokeWidth="1"/>
            <text x={PL - 6} y={y + 4} textAnchor="end" fill="var(--text3)" fontSize="10" fontFamily="DM Mono, monospace">
              {v.toFixed(1)}%
            </text>
          </g>
        ))}
        {/* 0繝ｩ繧､繝ｳ */}
        {yMin < 0 && yMax > 0 && (
          <line x1={PL} y1={yScale(0)} x2={W - PR} y2={yScale(0)}
            stroke="rgba(74,120,200,0.3)" strokeWidth="1" strokeDasharray="4,4"/>
        )}
        {/* X霆ｸ繝ｩ繝吶Ν */}
        {xLabels.map(({ i, date }) => (
          <text key={date} x={xScale(i)} y={H - 8} textAnchor="middle"
            fill="var(--text3)" fontSize="10" fontFamily="DM Sans, sans-serif">
            {date.slice(2, 7)}
          </text>
        ))}
        {/* 謚倥ｌ邱・*/}
        {selected.map((theme, ti) => {
          const data = trends[theme] ?? []
          if (!data.length) return null
          const points = data.map(d => {
            const xi = dates.indexOf(d.date)
            return xi >= 0 ? `${xScale(xi)},${yScale(d.pct)}` : null
          }).filter(Boolean)
          if (!points.length) return null
          const last = data[data.length - 1]
          const lastXi = dates.indexOf(last.date)
          return (
            <g key={theme}>
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke={COLORS[ti % COLORS.length]}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* 邨らせ縺ｮ蛟､繝ｩ繝吶Ν */}
              <text
                x={xScale(lastXi) + 4}
                y={yScale(last.pct) + 4}
                fill={COLORS[ti % COLORS.length]}
                fontSize="10"
                fontFamily="DM Mono, monospace"
              >
                {last.pct >= 0 ? '+' : ''}{last.pct.toFixed(1)}%
              </text>
            </g>
          )
        })}
      </svg>

      {/* 蜃｡萓・*/}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
        {selected.map((theme, ti) => {
          const data   = trends[theme] ?? []
          const last   = data[data.length - 1]
          const color  = COLORS[ti % COLORS.length]
          return (
            <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '2px', background: color, borderRadius: '1px' }} />
              <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{theme}</span>
              {last && (
                <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color, fontWeight: 600 }}>
                  {last.pct >= 0 ? '+' : ''}{last.pct.toFixed(1)}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Trend() {
  const [period,   setPeriod]   = useState('1y')
  const [mode,     setMode]     = useState('醇 荳贋ｽ・・倶ｸ倶ｽ・')
  const [trends,   setTrends]   = useState({})
  const [themeNames, setThemeNames] = useState([])
  const [selected, setSelected] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  // 繝・・繝槫錐荳隕ｧ蜿門ｾ・  useEffect(() => {
    fetch(`${API}/api/theme-names`)
      .then(r => r.json())
      .then(d => setThemeNames(d.themes))
      .catch(() => {})
  }, [])

  // 蜈ｨ繝・・繝槭・謗ｨ遘ｻ蜿門ｾ・  useEffect(() => {
    if (!themeNames.length) return
    const fetch_ = async () => {
      setLoading(true); setError(null)
      try {
        const themes = themeNames.join(',')
        const res  = await fetch(`${API}/api/trends?themes=${encodeURIComponent(themes)}&period=${period}`)
        const json = await res.json()
        const t = json.trends

        // 譛邨ょ､縺ｧ繧ｽ繝ｼ繝・        const sorted = Object.entries(t)
          .map(([name, data]) => ({ name, last: data[data.length - 1]?.pct ?? 0 }))
          .sort((a, b) => b.last - a.last)

        setTrends(t)

        // 繝・ヵ繧ｩ繝ｫ繝磯∈謚橸ｼ壻ｸ贋ｽ・+荳倶ｽ・
        const top5   = sorted.slice(0, 5).map(x => x.name)
        const bot5   = sorted.slice(-5).map(x => x.name)
        setSelected([...new Set([...top5, ...bot5])])
      } catch {
        setError('繝・・繧ｿ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [period, themeNames])

  // 繝｢繝ｼ繝牙､画峩
  useEffect(() => {
    if (!Object.keys(trends).length) return
    const sorted = Object.entries(trends)
      .map(([name, data]) => ({ name, last: data[data.length - 1]?.pct ?? 0 }))
      .sort((a, b) => b.last - a.last)

    if (mode === '醇 荳贋ｽ・・倶ｸ倶ｽ・') {
      const top5 = sorted.slice(0, 5).map(x => x.name)
      const bot5 = sorted.slice(-5).map(x => x.name)
      setSelected([...new Set([...top5, ...bot5])])
    } else if (mode === '投 蜈ｨ繝・・繝・) {
      setSelected(Object.keys(trends))
    }
  }, [mode])

  const toggleTheme = (t) =>
    setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        鬨ｰ關ｽ謗ｨ遘ｻ
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        yfinance縺ｮ譌･谺｡邨ょ､縺九ｉ邂怜・縺励◆繝・・繝槫挨邏ｯ遨埼ｨｰ關ｽ邇・・謗ｨ遘ｻ
      </p>

      {/* 繧ｳ繝ｳ繝医Ο繝ｼ繝ｫ */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        {MODES.map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
            border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
            background: mode === m ? 'rgba(74,158,255,0.12)' : 'transparent',
            color: mode === m ? 'var(--accent)' : 'var(--text2)',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}>
            {m}
          </button>
        ))}
      </div>

      {/* 謇句虚驕ｸ謚・*/}
      {mode === '笨・謇句虚驕ｸ謚・ && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {themeNames.map(t => (
            <button key={t} onClick={() => toggleTheme(t)} style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
              border: `1px solid ${selected.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
              background: selected.includes(t) ? 'rgba(74,158,255,0.12)' : 'transparent',
              color: selected.includes(t) ? 'var(--accent)' : 'var(--text3)',
              fontFamily: 'var(--font)', transition: 'all 0.15s',
            }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {loading ? <Loading /> : error ? (
        <div style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</div>
      ) : (
        <LineChart trends={trends} selected={selected} />
      )}
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none',
}
