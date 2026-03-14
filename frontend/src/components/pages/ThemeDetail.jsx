import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label:'1騾ｱ髢・,value:'5d'},{label:'1繝ｶ譛・,value:'1mo'},
  { label:'3繝ｶ譛・,value:'3mo'},{label:'6繝ｶ譛・,value:'6mo'},{label:'1蟷ｴ',value:'1y'},
]

function formatLarge(n) {
  if (!n) return '0'
  if (n>=1e12) return (n/1e12).toFixed(1)+'蜈・
  if (n>=1e8)  return (n/1e8).toFixed(1)+'蜆・
  if (n>=1e4)  return (n/1e4).toFixed(1)+'荳・
  return n.toLocaleString()
}

function Loading() {
  return (
    <div style={{ textAlign:'center',padding:'40px',color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block',width:'6px',height:'6px',borderRadius:'50%',
          background:'var(--accent)',margin:'0 3px',animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px',fontSize:'12px' }}>蛟句挨譬ｪ繝・・繧ｿ蜿門ｾ嶺ｸｭ...</div>
    </div>
  )
}

function Top5Bar({ items, title, colorFn }) {
  if (!items||!items.length) return null
  const maxAbs = Math.max(...items.map(s=>Math.abs(s.pct)),1)
  const W=280,H=160,PL=8,PR=8,PT=20,PB=36
  const bW = (W-PL-PR)/items.length-4
  return (
    <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px' }}>
      <div style={{ fontSize:'11px',fontWeight:700,color:'var(--text2)',marginBottom:'8px' }}>{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block' }}>
        {items.map((s,i)=>{
          const h = Math.round(Math.abs(s.pct)/maxAbs*(H-PT-PB))
          const x = PL+i*((W-PL-PR)/items.length)+2
          const y = H-PB-h
          const c = colorFn(s.pct)
          return (
            <g key={s.ticker}>
              <rect x={x} y={y} width={bW} height={h} rx="2" fill={c} opacity="0.85"/>
              <text x={x+bW/2} y={y-3} textAnchor="middle" fill={c} fontSize="9" fontFamily="DM Mono">{s.pct>=0?'+':''}{s.pct.toFixed(1)}%</text>
              <text x={x+bW/2} y={H-PB+12} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">{s.name.length>4?s.name.slice(0,4)+'窶ｦ':s.name}</text>
            </g>
          )
        })}
        <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="rgba(74,120,200,0.2)" strokeWidth="1"/>
      </svg>
    </div>
  )
}

function StockTable({ stocks }) {
  if (!stocks||!stocks.length) return null
  return (
    <div style={{ overflowX:'auto',marginTop:'8px' }}>
      <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'12px',fontFamily:'var(--font)' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            {['鬆・ｽ・,'繧ｳ繝ｼ繝・,'驫俶氛蜷・,'譬ｪ萓｡','鬨ｰ關ｽ邇・,'蟇・ｸ主ｺｦ','蟇・ｸ朱・ｽ・,'蜃ｺ譚･鬮伜｢玲ｸ・,'蜃ｺ譚･鬮・,'蜃ｺ譚･鬮倬・ｽ・,'螢ｲ雋ｷ莉｣驥・,'螢ｲ雋ｷ莉｣驥鷹・ｽ・].map(h=>(
              <th key={h} style={{ padding:'6px 8px',textAlign:h==='驫俶氛蜷・?'left':'right',
                fontSize:'10px',fontWeight:600,letterSpacing:'0.06em',color:'var(--text3)',
                textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s,i)=>{
            const pColor = s.pct>=0?'var(--red)':'var(--green)'
            const cColor = s.contribution>=0?'var(--red)':'var(--green)'
            return (
              <tr key={s.ticker} style={{ borderBottom:'1px solid rgba(74,120,200,0.06)',
                background:i%2===0?'transparent':'rgba(74,120,200,0.02)',
                animation:`fadeUp 0.2s ease ${i*0.02}s both` }}>
                <td style={tdC}>{String(i+1).padStart(2,'0')}</td>
                <td style={tdC}><code style={{ fontSize:'11px',color:'var(--text3)',fontFamily:'var(--mono)' }}>{s.ticker.replace('.T','')}</code></td>
                <td style={{ ...tdL,color:'#c0d0e8',fontWeight:500 }}>{s.name}</td>
                <td style={tdR}><span style={{ fontFamily:'var(--mono)' }}>ﾂ･{s.price?.toLocaleString()}</span></td>
                <td style={{ ...tdR,color:pColor,fontWeight:700,fontFamily:'var(--mono)' }}>{s.pct>=0?'+':''}{s.pct?.toFixed(1)}%</td>
                <td style={{ ...tdR,color:cColor,fontFamily:'var(--mono)' }}>{s.contribution>=0?'+':''}{s.contribution?.toFixed(1)}%</td>
                <td style={tdC}>{i+1}菴・/td>
                <td style={{ ...tdR,color:s.volume_chg>=0?'var(--red)':'var(--green)',fontFamily:'var(--mono)' }}>{s.volume_chg>=0?'+':''}{s.volume_chg?.toFixed(1)}%</td>
                <td style={{ ...tdR,fontFamily:'var(--mono)' }}>{formatLarge(s.volume)}</td>
                <td style={tdC}>{s.vol_rank}菴・/td>
                <td style={{ ...tdR,fontFamily:'var(--mono)' }}>{formatLarge(s.trade_value)}</td>
                <td style={tdC}>{s.tv_rank}菴・/td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const tdC = { padding:'7px 8px',textAlign:'center',whiteSpace:'nowrap' }
const tdR = { padding:'7px 8px',textAlign:'right',whiteSpace:'nowrap' }
const tdL = { padding:'7px 8px',textAlign:'left' }

export default function ThemeDetail() {
  const [period,     setPeriod]     = useState('1mo')
  const [themeNames, setThemeNames] = useState([])
  const [selTheme,   setSelTheme]   = useState('')
  const [detail,     setDetail]     = useState(null)
  const [loading,    setLoading]    = useState(false)

  useEffect(()=>{
    fetch(`${API}/api/theme-names`).then(r=>r.json()).then(d=>{
      setThemeNames(d.themes)
      if (d.themes.length) setSelTheme(d.themes[0])
    }).catch(()=>{})
  },[])

  useEffect(()=>{
    if (!selTheme) return
    setLoading(true); setDetail(null)
    fetch(`${API}/api/theme-detail/${encodeURIComponent(selTheme)}?period=${period}`)
      .then(r=>r.json()).then(d=>setDetail(d.data))
      .catch(()=>{}).finally(()=>setLoading(false))
  },[selTheme, period])

  const pctColor = (v) => v>=0?'var(--red)':'var(--green)'
  const stocks   = detail?.stocks ?? []
  const top5     = stocks.slice(0,5)
  const bot5     = [...stocks].sort((a,b)=>a.pct-b.pct).slice(0,5)

  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px',fontWeight:700,letterSpacing:'-0.02em',color:'#e8f0ff',marginBottom:'4px' }}>繝・・繝槫挨隧ｳ邏ｰ</h1>
      <p style={{ fontSize:'12px',color:'var(--text3)',marginBottom:'20px' }}>繝・・繝槭ｒ驕ｸ謚槭＠縺ｦ讒区・驫俶氛縺ｮ隧ｳ邏ｰ繧堤｢ｺ隱・/p>

      <div style={{ display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'20px' }}>
        <select value={selTheme} onChange={e=>setSelTheme(e.target.value)} style={selStyle}>
          {themeNames.map(t=><option key={t} value={t} style={{ background:'var(--bg3)' }}>{t}</option>)}
        </select>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p=><option key={p.value} value={p.value} style={{ background:'var(--bg3)' }}>{p.label}</option>)}
        </select>
      </div>

      {loading ? <Loading /> : detail ? (
        <>
          {/* 繧ｵ繝槭Μ繝ｼ */}
          <div style={{ display:'flex',alignItems:'center',gap:'16px',marginBottom:'20px',flexWrap:'wrap' }}>
            <span style={{ fontSize:'18px',fontWeight:700,color:'#e8f0ff' }}>{selTheme}</span>
            <span style={{ fontSize:'16px',fontFamily:'var(--mono)',fontWeight:700,
              color:detail.avg>=0?'var(--red)':'var(--green)' }}>
              蟷ｳ蝮・{detail.avg>=0?'+':''}{detail.avg.toFixed(1)}%
            </span>
            <span style={{ fontSize:'12px',color:'var(--text3)' }}>{stocks.length}驫俶氛讒区・</span>
            <span style={{ fontSize:'11px',padding:'2px 8px',borderRadius:'20px',
              background:'rgba(74,158,255,0.1)',color:'var(--accent)',border:'1px solid rgba(74,158,255,0.2)' }}>
              {PERIODS.find(p=>p.value===period)?.label}
            </span>
          </div>

          {/* TOP5繧ｰ繝ｩ繝・*/}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px' }} className="top5g">
            <Top5Bar items={top5} title="笆ｲ 荳頑・TOP5" colorFn={pctColor}/>
            <Top5Bar items={bot5} title="笆ｼ 荳玖誠TOP5" colorFn={pctColor}/>
          </div>

          {/* 讒区・驫俶氛繝・・繝悶Ν */}
          <div style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'var(--text3)',textTransform:'uppercase',marginBottom:'8px' }}>讒区・驫俶氛荳隕ｧ</div>
          <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'8px' }}>
            <StockTable stocks={stocks}/>
          </div>
        </>
      ) : (
        <div style={{ color:'var(--text3)',fontSize:'13px' }}>繝・・繝槭ｒ驕ｸ謚槭＠縺ｦ縺上□縺輔＞</div>
      )}

      <style>{`
        @media (max-width:640px) { .top5g { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  )
}

const selStyle = {
  background:'var(--bg3)',color:'var(--text)',
  border:'1px solid rgba(74,120,200,0.2)',borderRadius:'6px',
  fontFamily:'var(--font)',fontSize:'13px',
  padding:'6px 12px',cursor:'pointer',outline:'none',
}
