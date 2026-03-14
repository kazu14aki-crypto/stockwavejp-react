import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label:'1騾ｱ髢・,value:'5d'},{label:'1繝ｶ譛・,value:'1mo'},
  { label:'3繝ｶ譛・,value:'3mo'},{label:'6繝ｶ譛・,value:'6mo'},{label:'1蟷ｴ',value:'1y'},
]

function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n/1e12).toFixed(1)+'蜈・
  if (n >= 1e8)  return (n/1e8).toFixed(1)+'蜆・
  if (n >= 1e4)  return (n/1e4).toFixed(1)+'荳・
  return n.toLocaleString()
}

function Loading({ msg='繝・・繧ｿ蜿門ｾ嶺ｸｭ...' }) {
  return (
    <div style={{ textAlign:'center',padding:'40px',color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block',width:'6px',height:'6px',borderRadius:'50%',
          background:'var(--accent)',margin:'0 3px',animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px',fontSize:'12px' }}>{msg}</div>
    </div>
  )
}

// TOP5邵ｦ譽偵げ繝ｩ繝包ｼ・VG・・function Top5Bar({ items, title, colorFn }) {
  if (!items || !items.length) return null
  const maxAbs = Math.max(...items.map(s=>Math.abs(s.pct)),1)
  const W=280, H=160, PL=8, PR=8, PT=20, PB=36
  const bW = (W-PL-PR)/items.length - 4
  return (
    <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px' }}>
      <div style={{ fontSize:'11px',fontWeight:700,color:'var(--text2)',marginBottom:'8px' }}>{title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block' }}>
        {items.map((s,i)=>{
          const h = Math.round(Math.abs(s.pct)/maxAbs*(H-PT-PB))
          const x = PL + i*((W-PL-PR)/items.length) + 2
          const y = H-PB-h
          const c = colorFn(s.pct)
          return (
            <g key={s.ticker}>
              <rect x={x} y={y} width={bW} height={h} rx="2" fill={c} opacity="0.85"/>
              <text x={x+bW/2} y={y-3} textAnchor="middle" fill={c} fontSize="9" fontFamily="DM Mono">{s.pct>=0?'+':''}{s.pct.toFixed(1)}%</text>
              <text x={x+bW/2} y={H-PB+12} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans"
                style={{ overflow:'hidden' }}>{s.name.length>4?s.name.slice(0,4)+'窶ｦ':s.name}</text>
            </g>
          )
        })}
        <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke="rgba(74,120,200,0.2)" strokeWidth="1"/>
      </svg>
    </div>
  )
}

// 讒区・驫俶氛荳隕ｧ繝・・繝悶Ν
function StockTable({ stocks }) {
  if (!stocks || !stocks.length) return null
  return (
    <div style={{ overflowX:'auto',marginTop:'16px' }}>
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
              <tr key={s.ticker} style={{
                borderBottom:'1px solid rgba(74,120,200,0.06)',
                background:i%2===0?'transparent':'rgba(74,120,200,0.02)',
                animation:`fadeUp 0.2s ease ${i*0.02}s both`,
              }}>
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

export default function MarketRank() {
  const [period,   setPeriod]   = useState('1mo')
  const [summary,  setSummary]  = useState(null)
  const [groups,   setGroups]   = useState({})
  const [activeGroup, setActiveGroup] = useState('譌･邨・25')
  const [activeSeg,   setActiveSeg]   = useState(null)
  const [detail,   setDetail]   = useState(null)
  const [loadingS, setLoadingS] = useState(true)
  const [loadingD, setLoadingD] = useState(false)

  useEffect(()=>{
    setLoadingS(true)
    fetch(`${API}/api/market-rank?period=${period}`)
      .then(r=>r.json()).then(d=>{
        setSummary(d.data); setGroups(d.groups||{})
        if (!activeSeg && d.groups['譌･邨・25']?.length) setActiveSeg(d.groups['譌･邨・25'][0])
      }).catch(()=>{}).finally(()=>setLoadingS(false))
  },[period])

  useEffect(()=>{
    if (!activeSeg) return
    setLoadingD(true); setDetail(null)
    fetch(`${API}/api/market-rank/${encodeURIComponent(activeSeg)}?period=${period}`)
      .then(r=>r.json()).then(d=>setDetail(d.data))
      .catch(()=>{}).finally(()=>setLoadingD(false))
  },[activeSeg, period])

  const pctColor = (v) => v>=0?'var(--red)':'var(--green)'
  const stocks   = detail?.stocks ?? []
  const top5     = stocks.slice(0,5)
  const bot5     = [...stocks].sort((a,b)=>a.pct-b.pct).slice(0,5)

  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px',fontWeight:700,letterSpacing:'-0.02em',color:'#e8f0ff',marginBottom:'4px' }}>蟶ょｴ蛻･繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ</h1>
      <p style={{ fontSize:'12px',color:'var(--text3)',marginBottom:'20px' }}>譌･邨・25繝ｻTOPIX繝ｻ蟶ょｴ蛹ｺ蛻・＃縺ｨ縺ｮ鬨ｰ關ｽ邇・Λ繝ｳ繧ｭ繝ｳ繧ｰ</p>

      <select value={period} onChange={e=>setPeriod(e.target.value)} style={selStyle}>
        {PERIODS.map(p=><option key={p.value} value={p.value} style={{ background:'var(--bg3)' }}>{p.label}</option>)}
      </select>

      {/* 繧ｰ繝ｫ繝ｼ繝励ち繝・*/}
      <div style={{ display:'flex',gap:'4px',borderBottom:'1px solid var(--border)',marginTop:'16px',paddingBottom:'0' }}>
        {Object.keys(groups).map(g=>(
          <button key={g} onClick={()=>{ setActiveGroup(g); setActiveSeg(groups[g][0]) }} style={{
            padding:'8px 16px',fontSize:'13px',cursor:'pointer',border:'none',background:'transparent',
            color:activeGroup===g?'var(--text)':'var(--text2)',fontWeight:activeGroup===g?600:400,
            fontFamily:'var(--font)',borderBottom:activeGroup===g?'2px solid var(--accent)':'2px solid transparent',
            marginBottom:'-1px',transition:'all 0.15s',
          }}>{g}</button>
        ))}
      </div>

      {loadingS ? <Loading /> : (
        <>
          {/* 繧ｻ繧ｰ繝｡繝ｳ繝磯∈謚・*/}
          <div style={{ display:'flex',gap:'4px',flexWrap:'wrap',padding:'12px 0',borderBottom:'1px solid var(--border)' }}>
            {(groups[activeGroup]||[]).map(seg=>{
              const avg = summary?.[seg]?.avg
              return (
                <button key={seg} onClick={()=>setActiveSeg(seg)} style={{
                  padding:'6px 12px',borderRadius:'6px',fontSize:'12px',cursor:'pointer',
                  border:`1px solid ${activeSeg===seg?'var(--accent)':'var(--border)'}`,
                  background:activeSeg===seg?'rgba(74,158,255,0.1)':'transparent',
                  color:activeSeg===seg?'var(--accent)':'var(--text2)',
                  fontFamily:'var(--font)',transition:'all 0.15s',whiteSpace:'nowrap',
                }}>
                  {seg.split('・・)[1]||seg.split('・・)[1]?.replace(')','').replace('・・,'')||seg}
                  {avg!=null&&<span style={{ marginLeft:'6px',fontSize:'11px',fontFamily:'var(--mono)',
                    color:avg>=0?'var(--red)':'var(--green)',fontWeight:600 }}>
                    {avg>=0?'+':''}{avg.toFixed(1)}%
                  </span>}
                </button>
              )
            })}
          </div>

          {/* 隧ｳ邏ｰ繧ｨ繝ｪ繧｢ */}
          {loadingD ? <Loading msg="蛟句挨譬ｪ繝・・繧ｿ蜿門ｾ嶺ｸｭ..." /> : detail && (
            <>
              <div style={{ display:'flex',alignItems:'center',gap:'16px',margin:'20px 0 16px' }}>
                <span style={{ fontSize:'16px',fontWeight:700,color:'#e8f0ff' }}>{activeSeg}</span>
                <span style={{ fontSize:'15px',fontFamily:'var(--mono)',fontWeight:700,
                  color:detail.avg>=0?'var(--red)':'var(--green)' }}>
                  蟷ｳ蝮・{detail.avg>=0?'+':''}{detail.avg.toFixed(1)}%
                </span>
                <span style={{ fontSize:'12px',color:'var(--text3)' }}>{stocks.length}驫俶氛</span>
              </div>

              {/* TOP5繧ｰ繝ｩ繝・*/}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px' }} className="top5g">
                <Top5Bar items={top5} title="笆ｲ 荳頑・TOP5" colorFn={pctColor}/>
                <Top5Bar items={bot5} title="笆ｼ 荳玖誠TOP5" colorFn={pctColor}/>
              </div>

              {/* 讒区・驫俶氛繝・・繝悶Ν */}
              <div style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'var(--text3)',textTransform:'uppercase',marginBottom:'8px' }}>讒区・驫俶氛荳隕ｧ</div>
              <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'8px' }}>
                <StockTable stocks={stocks}/>
              </div>
            </>
          )}
        </>
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
