import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label:'1週間',value:'5d'},{label:'1ヶ月',value:'1mo'},
  { label:'3ヶ月',value:'3mo'},{label:'6ヶ月',value:'6mo'},{label:'1年',value:'1y'},
]

const COLORS = [
  '#ff4560','#ff8c42','#ffd166','#06d6a0','#4a9eff',
  '#aa77ff','#ff77aa','#44dddd',
]

const STATE_COLORS = {
  '🔥加速':  '#ff4560',
  '↗転換↑': '#ff8c42',
  '→横ばい': '#4a6080',
  '↘転換↓': '#4a9eff',
  '❄️失速':  '#00c48c',
}

function formatLarge(n) {
  if (!n) return '0'
  if (n>=1e12) return (n/1e12).toFixed(1)+'兆'
  if (n>=1e8)  return (n/1e8).toFixed(1)+'億'
  if (n>=1e4)  return (n/1e4).toFixed(1)+'万'
  return n.toLocaleString()
}

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px', fontSize:'12px' }}>データ取得中...</div>
    </div>
  )
}

// ── niceScale：キリの良いY軸目盛り ──
function niceScale(yMin, yMax, count = 5) {
  const range = yMax - yMin || 1
  const rawStep = range / count
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)))
  const candidates = [1, 2, 2.5, 5, 10]
  const step = mag * (candidates.find(c => c * mag >= rawStep) || 1)
  const nMin = Math.floor(yMin / step) * step
  const nMax = Math.ceil(yMax / step) * step
  const ticks = []
  for (let v = nMin; v <= nMax + step * 0.01; v += step) {
    ticks.push(Math.round(v * 1000) / 1000)
  }
  return { ticks, nMin: nMin - step * 0.2, nMax: nMax + step * 0.2 }
}

// ── TOP5横棒グラフ（小型・見やすい）──
function Top5Bar({ items, title, colorFn, emptyMsg }) {
  if (!items || !items.length) return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'8px', padding:'20px', textAlign:'center',
      color:'var(--text3)', fontSize:'12px' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{title}</div>
      {emptyMsg || 'データなし'}
    </div>
  )
  const maxAbs = Math.max(...items.map(s => Math.abs(s.pct)), 0.01)

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'10px 12px' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
        {items.map((s, i) => {
          const c = colorFn(s.pct)
          const w = Math.abs(s.pct) / maxAbs * 100
          return (
            <div key={s.ticker} style={{
              display:'grid', gridTemplateColumns:'90px 1fr 60px',
              alignItems:'center', gap:'6px',
            }}>
              <span style={{ fontSize:'11px', color:'var(--text2)', overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap', textAlign:'right' }}>
                {s.name}
              </span>
              <div style={{ height:'12px', background:'rgba(255,255,255,0.04)', borderRadius:'3px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${w}%`, background:c, borderRadius:'3px', opacity:0.85 }} />
              </div>
              <span style={{ fontFamily:'var(--mono)', fontSize:'11px', fontWeight:700, textAlign:'right', color:c, whiteSpace:'nowrap' }}>
                {s.pct>=0?'+':''}{s.pct.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 複数折れ線グラフ（Compare移植）──
function MultiLineChart({ trends, selected, title }) {
  if (!selected.length) return (
    <div style={{ textAlign:'center', padding:'30px', color:'var(--text3)', fontSize:'13px' }}>
      テーマを1つ以上選択してください
    </div>
  )

  const allDates = new Set()
  selected.forEach(theme => (trends[theme] ?? []).forEach(d => allDates.add(d.date)))
  const dates = [...allDates].sort()
  if (!dates.length) return (
    <div style={{ textAlign:'center', padding:'30px', color:'var(--text3)', fontSize:'13px' }}>
      データを取得中...
    </div>
  )

  const W = 800, H = 220, PL = 46, PR = 16, PT = 16, PB = 32

  let yMin = Infinity, yMax = -Infinity
  selected.forEach(theme => {
    ;(trends[theme] ?? []).forEach(d => {
      if (d.pct < yMin) yMin = d.pct
      if (d.pct > yMax) yMax = d.pct
    })
  })
  if (yMin === Infinity) { yMin = -1; yMax = 1 }

  const { ticks, nMin, nMax } = niceScale(yMin, yMax)
  const xS = (i) => PL + (i / Math.max(dates.length - 1, 1)) * (W - PL - PR)
  const yS = (v) => PT + (1 - (v - nMin) / (nMax - nMin)) * (H - PT - PB)

  const xLabels = []
  const step = Math.max(1, Math.floor(dates.length / 5))
  for (let i = 0; i < dates.length; i += step) xLabels.push({ i, date: dates[i] })

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px', overflowX:'auto' }}>
      {title && <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'320px' }}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="rgba(74,120,200,0.08)" strokeWidth="1"/>
            <text x={PL-4} y={yS(v)+3} textAnchor="end" fill="var(--text3)" fontSize="9" fontFamily="DM Mono">
              {Number.isInteger(v) ? v+'%' : v.toFixed(1)+'%'}
            </text>
          </g>
        ))}
        {yMin < 0 && yMax > 0 && (
          <line x1={PL} y1={yS(0)} x2={W-PR} y2={yS(0)} stroke="rgba(74,120,200,0.3)" strokeWidth="1" strokeDasharray="4,4"/>
        )}
        {xLabels.map(({ i, date }) => (
          <text key={date} x={xS(i)} y={H-6} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">{date.slice(2,7)}</text>
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
      {/* 凡例 */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginTop:'8px' }}>
        {selected.map((theme, ti) => {
          const data = trends[theme] ?? []
          const last = data[data.length - 1]
          const color = COLORS[ti % COLORS.length]
          return (
            <div key={theme} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <div style={{ width:'16px', height:'2px', background:color }} />
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{theme}</span>
              {last && <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color, fontWeight:600 }}>
                {last.pct >= 0 ? '+' : ''}{last.pct.toFixed(1)}%
              </span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 銘柄テーブル ──
function StockTable({ stocks }) {
  if (!stocks || !stocks.length) return null
  const headers = ['株価','騰落率','寄与度','寄与順位','出来高増減','出来高','出来高順位','売買代金','売買代金順位']
  return (
    <div className="sticky-table">
      <table style={{ borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font)', width:'100%' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            <th style={{ ...thStyle, textAlign:'center', minWidth:'40px', background:'var(--bg3)' }}>順位</th>
            <th style={{ ...thStyle, textAlign:'left', minWidth:'120px', background:'var(--bg3)' }}>銘柄名</th>
            {headers.map(h => <th key={h} style={{ ...thStyle, minWidth:'80px' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => {
            const pColor = s.pct >= 0 ? 'var(--red)' : 'var(--green)'
            const cColor = s.contribution >= 0 ? 'var(--red)' : 'var(--green)'
            return (
              <tr key={s.ticker} style={{
                borderBottom:'1px solid rgba(255,255,255,0.04)',
                background: i%2===0?'transparent':'rgba(255,255,255,0.02)',
              }}>
                <td style={{ ...tdC, fontFamily:'var(--mono)', fontSize:'12px', fontWeight:700, color:'var(--text3)',
                  background: i%2===0?'var(--bg2)':'var(--bg3)' }}>
                  {String(i+1).padStart(2,'0')}
                </td>
                <td style={{ ...tdL, fontWeight:600, color:'var(--text)', background: i%2===0?'var(--bg2)':'var(--bg3)' }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', marginBottom:'1px' }}>{s.ticker.replace('.T','')}</div>
                  <div style={{ fontSize:'13px' }}>{s.name}</div>
                </td>
                <td style={tdR}><span style={{ fontFamily:'var(--mono)', color:'var(--text2)' }}>¥{s.price?.toLocaleString()}</span></td>
                <td style={{ ...tdR, color:pColor, fontWeight:700, fontFamily:'var(--mono)' }}>{s.pct>=0?'+':''}{s.pct?.toFixed(1)}%</td>
                <td style={{ ...tdR, color:cColor, fontFamily:'var(--mono)' }}>{s.contribution>=0?'+':''}{s.contribution?.toFixed(1)}%</td>
                <td style={tdC}>{i+1}位</td>
                <td style={{ ...tdR, color:s.volume_chg>=0?'var(--red)':'var(--green)', fontFamily:'var(--mono)' }}>{s.volume_chg>=0?'+':''}{s.volume_chg?.toFixed(1)}%</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.volume)}</td>
                <td style={tdC}>{s.vol_rank}位</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.trade_value)}</td>
                <td style={tdC}>{s.tv_rank}位</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const thStyle = { padding:'6px 8px', textAlign:'right', fontSize:'10px', fontWeight:600, letterSpacing:'0.06em', color:'var(--text3)', textTransform:'uppercase', whiteSpace:'nowrap', background:'var(--bg3)' }
const tdC = { padding:'8px 10px', textAlign:'center', whiteSpace:'nowrap', color:'var(--text2)' }
const tdR = { padding:'8px 10px', textAlign:'right', whiteSpace:'nowrap' }
const tdL = { padding:'8px 12px', textAlign:'left', minWidth:'120px' }

export default function ThemeDetail() {
  const [period,      setPeriod]      = useState('1mo')
  const [themeNames,  setThemeNames]  = useState([])
  const [selTheme,    setSelTheme]    = useState('')
  const [detail,      setDetail]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [momentum,    setMomentum]    = useState(null)

  // テーマ別詳細比較（Compare移植）
  const [selThemes,    setSelThemes]    = useState([])
  const [themeTrends,  setThemeTrends]  = useState({})
  const [macroData,    setMacroData]    = useState({})
  // マクロは全指標をデフォルト表示（選択不可）
  const selMacro = Object.keys(macroData)
  const [loadingT,     setLoadingT]     = useState(false)
  const [loadingM,     setLoadingM]     = useState(false)
  const [comparePeriod, setComparePeriod] = useState('1y')

  // テーマ名一覧取得
  useEffect(() => {
    fetch('/data/market.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => {
        const names = json['theme_names']?.themes || json['themes_1mo']?.themes?.map(t => t.theme) || []
        if (names.length > 0) return { themes: names }
        throw new Error('no names')
      })
      .catch(() => fetch(`${API}/api/theme-names`).then(r => r.json()))
      .then(d => {
        setThemeNames(d.themes || [])
        if (d.themes?.length) {
          setSelTheme(d.themes[0])
          setSelThemes(d.themes.slice(0, 3))
        }
      })
      .catch(() => {})
  }, [])

  // テーマ別詳細取得
  useEffect(() => {
    if (!selTheme) return
    setLoading(true); setDetail(null); setMomentum(null)
    Promise.all([
      fetch(`${API}/api/theme-detail/${encodeURIComponent(selTheme)}?period=${period}`).then(r => r.json()),
      fetch(`${API}/api/momentum?period=1mo`).then(r => r.json()),  // 前月比は1mo固定
    ])
      .then(([detailRes, momentumRes]) => {
        setDetail(detailRes.data)
        const m = (momentumRes.data || []).find(d => d.theme === selTheme)
        setMomentum(m || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selTheme, period])

  // テーマ比較データ取得
  useEffect(() => {
    if (!selThemes.length) return
    setLoadingT(true)
    fetch(`${API}/api/trends?themes=${encodeURIComponent(selThemes.join(','))}&period=${comparePeriod}`)
      .then(r => r.json())
      .then(d => setThemeTrends(d.trends || {}))
      .catch(() => {})
      .finally(() => setLoadingT(false))
  }, [selThemes, comparePeriod])

  // マクロデータ取得
  useEffect(() => {
    setLoadingM(true)
    // market.jsonのマクロを優先
    fetch('/data/market.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => {
        const key = `macro_${comparePeriod}`
        if (json[key]?.data) { setMacroData(json[key].data); return }
        throw new Error('no macro')
      })
      .catch(() =>
        fetch(`${API}/api/macro?period=${comparePeriod}`)
          .then(r => r.json())
          .then(d => setMacroData(d.data || {}))
          .catch(() => {})
      )
      .finally(() => setLoadingM(false))
  }, [comparePeriod])

  const toggleTheme = (t) =>
    setSelThemes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])
  const toggleMacro = (t) =>
    setSelMacro(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  const pctColor = (v) => v >= 0 ? 'var(--red)' : 'var(--green)'
  const stocks = detail?.stocks ?? []
  // 上昇のみ・下落のみでフィルタリング
  const top5   = stocks.filter(s => s.pct > 0).slice(0, 5)
  const bot5   = [...stocks].sort((a, b) => a.pct - b.pct).filter(s => s.pct < 0).slice(0, 5)
  const macroNames = Object.keys(macroData)

  return (
    <div>
      {/* 固定ヘッダー */}
      <div className="page-header-sticky">
        <h1 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap' }}>テーマ別詳細</h1>
        <select value={selTheme} onChange={e => setSelTheme(e.target.value)} style={selStyle}>
          {themeNames.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div style={{ padding:'20px 32px 48px' }}>
        {loading ? <Loading /> : detail ? (
          <>
            {/* ── サマリーヘッダー（先月比・状態含む）── */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap',
              background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 18px' }}>
              <span style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>{selTheme}</span>
              <span style={{ fontSize:'16px', fontFamily:'var(--mono)', fontWeight:700,
                color: detail.avg >= 0 ? 'var(--red)' : 'var(--green)' }}>
                平均 {detail.avg >= 0 ? '+' : ''}{detail.avg?.toFixed(1)}%
              </span>
              {momentum && (
                <>
                  <div style={{ width:'1px', height:'20px', background:'var(--border)' }} />
                  <span style={{ fontSize:'12px', color:'var(--text3)' }}>先月比</span>
                  <span style={{ fontSize:'13px', fontFamily:'var(--mono)', fontWeight:600,
                    color: momentum.month_diff >= 0 ? 'var(--red)' : 'var(--green)' }}>
                    {momentum.month_diff >= 0 ? '+' : ''}{momentum.month_diff?.toFixed(1)}pt
                  </span>
                  <span style={{ fontSize:'12px', fontWeight:600, padding:'2px 10px', borderRadius:'20px',
                    color: STATE_COLORS[momentum.state] ?? 'var(--text2)',
                    background: `${STATE_COLORS[momentum.state] ?? '#4a6080'}18`,
                    border: `1px solid ${STATE_COLORS[momentum.state] ?? 'var(--border)'}40`,
                  }}>
                    {momentum.state}
                  </span>
                </>
              )}
              <span style={{ fontSize:'11px', color:'var(--text3)', marginLeft:'auto' }}>
                {stocks.length}銘柄構成 ／ {PERIODS.find(p => p.value === period)?.label}
              </span>
            </div>

            {/* ── TOP5グラフ（小型）── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }} className="top5g">
              <Top5Bar items={top5} title={`▲ 上昇TOP5（${stocks.filter(s=>s.pct>0).length}銘柄上昇）`} colorFn={pctColor} emptyMsg="上昇銘柄なし"/>
              <Top5Bar items={bot5} title={`▼ 下落TOP5（${stocks.filter(s=>s.pct<0).length}銘柄下落）`} colorFn={pctColor} emptyMsg="下落銘柄なし"/>
            </div>

            {/* ── 構成銘柄テーブル ── */}
            <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)',
              textTransform:'uppercase', marginBottom:'8px' }}>
              構成銘柄一覧 <span style={{ color:'var(--text3)', fontSize:'10px', fontWeight:400 }}>← 横にスワイプで詳細確認</span>
            </div>
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', marginBottom:'32px' }}>
              <StockTable stocks={stocks}/>
            </div>

            {/* ── テーマ・マクロ比較（旧Compare移植）── */}
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:'28px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                  <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>テーマ・マクロ比較</div>
                  <select value={comparePeriod} onChange={e => setComparePeriod(e.target.value)} style={selStyle}>
                    {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>テーマ騰落率の比較 ＋ マーケット指標との対比（ETFベース）</div>
              </div>

              {/* テーマ比較 */}
              <div style={sHead}><span style={sTitle}>テーマ比較</span><div style={sLine}/></div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' }}>
                {themeNames.map(t => (
                  <button key={t} onClick={() => toggleTheme(t)} style={{
                    padding:'3px 9px', borderRadius:'20px', fontSize:'11px', cursor:'pointer',
                    border:`1px solid ${selThemes.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
                    background: selThemes.includes(t) ? 'rgba(74,158,255,0.12)' : 'transparent',
                    color: selThemes.includes(t) ? 'var(--accent)' : 'var(--text3)',
                    fontFamily:'var(--font)', transition:'all 0.15s',
                  }}>
                    {t}
                  </button>
                ))}
              </div>
              {loadingT ? <Loading /> : <MultiLineChart trends={themeTrends} selected={selThemes} />}

              {/* マクロ比較（全指標・選択不可） */}
              <div style={{ ...sHead, marginTop:'24px' }}><span style={sTitle}>マーケット指標比較（全指標）</span><div style={sLine}/></div>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>
                ETFベースの独自指標 — 商標権の関係から指数そのものではなく連動ETFを使用しています
              </p>
              {loadingM ? <Loading /> : <MultiLineChart trends={macroData} selected={selMacro} />}
            </div>
          </>
        ) : (
          <div style={{ color:'var(--text3)', fontSize:'13px' }}>テーマを選択してください</div>
        )}
      </div>
      <style>{`
        @media (max-width:640px){.top5g{grid-template-columns:1fr !important;}}
      `}</style>
    </div>
  )
}

const selStyle = {
  background:'var(--bg3)', color:'var(--text)',
  border:'1px solid var(--border)', borderRadius:'6px',
  fontFamily:'var(--font)', fontSize:'13px',
  padding:'6px 12px', cursor:'pointer', outline:'none',
}
const sHead  = { display:'flex', alignItems:'center', gap:'12px', margin:'16px 0 10px' }
const sTitle = { fontSize:'11px', fontWeight:600, color:'var(--text2)', letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap' }
const sLine  = { flex:1, height:'1px', background:'var(--border)' }
