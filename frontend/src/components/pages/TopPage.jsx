import { useState } from 'react'
import { useThemes, useMacro } from '../../hooks/useMarketData'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const NEWS_LIST = [
  { date:'2026/03/15', tag:'NEW',    title:'React版リリース' },
  { date:'2026/03/01', tag:'UPDATE', title:'出来高・売買代金ランキング追加' },
  { date:'2026/02/15', tag:'UPDATE', title:'市場別ランキング拡充' },
]
const TAG_COLORS = {
  'NEW':    { bg:'rgba(255,83,112,0.15)', color:'var(--red)',    border:'rgba(255,83,112,0.3)' },
  'UPDATE': { bg:'rgba(91,156,246,0.12)', color:'var(--accent)', border:'rgba(91,156,246,0.25)' },
  'INFO':   { bg:'rgba(76,175,130,0.12)', color:'var(--green)',  border:'rgba(76,175,130,0.25)' },
}

function Dots() {
  return (
    <span style={{ display:'inline-flex', gap:'3px', alignItems:'center' }}>
      {[0,0.15,0.3].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%',
          background:'var(--accent)', animation:`pulse 1.2s ease-in-out ${d}s infinite` }}/>
      ))}
    </span>
  )
}

function KpiCard({ label, value, valueColor, sub, delay=0, loading=false, arrow=null }) {
  const ArrowIcon = () => {
    if (!arrow) return null
    return (
      <span style={{
        fontSize:'18px', marginLeft:'4px', lineHeight:1,
        color: arrow === 'up' ? 'var(--red)' : 'var(--green)',
        display:'inline-block',
      }}>
        {arrow === 'up' ? '↗' : '↘'}
      </span>
    )
  }
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'16px 18px',
      animation:`fadeUp 0.4s ease ${delay}s both`,
      transition:'border-color 0.2s, transform 0.15s',
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(91,156,246,0.3)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}
    >
      <div style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'10px' }}>{label}</div>
      <div style={{ fontFamily:'var(--mono)', fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, marginBottom:'6px', color:valueColor||'var(--text)' }}>
        {loading ? <Dots /> : value}
      </div>
      <div style={{ fontSize:'11px', color:'var(--text3)' }}>{sub}</div>
    </div>
  )
}

function MacroCard({ name, data }) {
  if (!data||!data.length) return null
  const last  = data[data.length-1]
  const color = last.pct>=0 ? 'var(--red)' : 'var(--green)'
  const vals  = data.map(d=>d.pct)
  const min   = Math.min(...vals), max = Math.max(...vals)
  const W=100, H=32
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*W},${H-((v-min)/(max-min||1))*H}`).join(' ')
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'12px 14px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px',
      minWidth:0, /* 見切れ防止 */ }}>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:'15px', fontWeight:700, color }}>{last.pct>=0?'+':''}{last.pct.toFixed(1)}%</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ flexShrink:0 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

const MACRO_COLORS = ['#ff4560','#ff8c42','#ffd166','#06d6a0','#4a9eff','#aa77ff']

// niceScale
function niceScaleTop(yMin, yMax, count=5) {
  if (yMin === yMax) { yMin -= 1; yMax += 1 }
  const range = yMax - yMin
  const rawStep = range / count
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)))
  const step = mag * ([1,2,2.5,5,10].find(c => c*mag >= rawStep) || 1)
  const nMin = Math.floor(yMin / step) * step
  const nMax = Math.ceil(yMax / step) * step
  const ticks = []
  for (let v = nMin; v <= nMax + step*0.01; v += step)
    ticks.push(Math.round(v*1000)/1000)
  return { ticks, nMin, nMax }
}

function MacroLineChart({ macro }) {
  const names = Object.keys(macro)
  if (!names.length) return null

  const allDates = new Set()
  names.forEach(n => (macro[n] || []).forEach(d => allDates.add(d.date)))
  const dates = [...allDates].sort()
  if (!dates.length) return null

  const W = 800, H = 220, PL = 46, PR = 16, PT = 16, PB = 32

  let yMin = Infinity, yMax = -Infinity
  names.forEach(n => {
    ;(macro[n] || []).forEach(d => {
      if (d.pct < yMin) yMin = d.pct
      if (d.pct > yMax) yMax = d.pct
    })
  })
  if (yMin === Infinity) { yMin = -1; yMax = 1 }

  const { ticks, nMin, nMax } = niceScaleTop(yMin, yMax)
  const xS = i => PL + (i / Math.max(dates.length-1, 1)) * (W-PL-PR)
  const yS = v => PT + (1 - (v-nMin)/(nMax-nMin)) * (H-PT-PB)

  const xStep = Math.max(1, Math.floor(dates.length / 5))
  const xLabels = []
  for (let i = 0; i < dates.length; i += xStep) xLabels.push({ i, date: dates[i] })

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px', overflowX:'auto' }}>
      <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>
        ETFベースの独自指標 — 商標権の関係から指数そのものではなく連動ETFを使用しています
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'320px' }}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="rgba(74,120,200,0.08)" strokeWidth="1"/>
            <text x={PL-4} y={yS(v)+3} textAnchor="end" fill="var(--text3)" fontSize="9" fontFamily="DM Mono">
              {Number.isInteger(v) ? v+'%' : v.toFixed(1)+'%'}
            </text>
          </g>
        ))}
        {nMin < 0 && nMax > 0 && (
          <line x1={PL} y1={yS(0)} x2={W-PR} y2={yS(0)} stroke="rgba(74,120,200,0.3)" strokeWidth="1" strokeDasharray="4,4"/>
        )}
        {xLabels.map(({i, date}) => (
          <text key={date} x={xS(i)} y={H-6} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">
            {date.slice(2,7)}
          </text>
        ))}
        {names.map((name, ti) => {
          const data = macro[name] || []
          if (!data.length) return null
          const pts = data.map(d => {
            const xi = dates.indexOf(d.date)
            return xi >= 0 ? `${xS(xi)},${yS(d.pct)}` : null
          }).filter(Boolean)
          return pts.length ? (
            <polyline key={name} points={pts.join(' ')} fill="none"
              stroke={MACRO_COLORS[ti % MACRO_COLORS.length]} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round"/>
          ) : null
        })}
      </svg>
      {/* 凡例：名称＋最新騰落率 */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginTop:'10px' }}>
        {names.map((name, ti) => {
          const data = macro[name] || []
          const last = data[data.length-1]
          const color = MACRO_COLORS[ti % MACRO_COLORS.length]
          return (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <div style={{ width:'16px', height:'2px', background:color, borderRadius:'1px' }} />
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{name}</span>
              {last && (
                <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color, fontWeight:700 }}>
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

function SHead({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'20px 0 12px' }}>
      <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text2)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{title}</span>
      <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
    </div>
  )
}

export default function TopPage() {
  const { data: themes,  loading: loadingT } = useThemes('1mo')
  const { data: macroRaw, loading: loadingM } = useMacro('1mo')
  const macro   = macroRaw?.data || {}
  const loading = loadingT || loadingM

  const s = themes?.summary

  return (
    <div style={{ padding:'20px 24px 48px', maxWidth:'100%', overflowX:'hidden' }}>

      {/* ヒーロー */}
      <div style={{
        background:'linear-gradient(135deg,rgba(91,156,246,0.07) 0%,rgba(255,83,112,0.05) 100%)',
        border:'1px solid var(--border)', borderRadius:'var(--radius)',
        padding:'20px 24px', marginBottom:'16px', animation:'fadeUp 0.5s ease both',
      }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'8px' }}>
          <span style={{ color:'var(--logo-red)' }}>Stock</span>Wave
          <span style={{ color:'var(--logo-red)', fontSize:'13px' }}>JP</span>
        </h1>
        {/* PC:1行 / SP:折り返し */}
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.7 }} className="hero-desc">
          日本株テーマ別の騰落率・出来高・売買代金をリアルタイムで追跡。どのテーマに資金が集まっているかを視覚的に把握できます。
        </p>
      </div>

      {/* お知らせ（小見出しのみ・コンパクト） */}
      <SHead title="📣 お知らせ" />
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginBottom:'4px' }}>
        {NEWS_LIST.map((n,i)=>{
          const tc = TAG_COLORS[n.tag]||TAG_COLORS['INFO']
          return (
            <div key={i} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'6px', padding:'7px 12px',
              display:'flex', alignItems:'center', gap:'8px',
              animation:`fadeUp 0.25s ease ${i*0.05}s both`,
              minWidth:0,
            }}>
              <span style={{ fontSize:'9px', fontWeight:700, padding:'1px 7px', borderRadius:'20px', flexShrink:0,
                background:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }}>{n.tag}</span>
              <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</span>
              <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', whiteSpace:'nowrap', flexShrink:0 }}>{n.date}</span>
            </div>
          )
        })}
      </div>

      {/* KPIカード */}
      <SHead title="📊 マーケットサマリー（1ヶ月）" />
      <div className="responsive-grid-4" style={{ marginBottom:'4px' }}>
        <KpiCard delay={0.05} loading={loading} label="上昇テーマ"
          value={<span>{s?s.rise:'-'}<span style={{ fontSize:'14px', color:'var(--text3)', fontWeight:400 }}>{s?` / ${s.total}`:''}</span></span>}
          valueColor="var(--red)"
          arrow={s ? (s.rise > s.fall ? 'up' : s.rise < s.fall ? 'down' : null) : null}
          sub="全テーマ中"/>
        <KpiCard delay={0.1} loading={loading} label="平均騰落率"
          value={s?`${s.avg>=0?'+':''}${s.avg?.toFixed(2)}%`:'-'}
          valueColor={s?.avg>=0?'var(--red)':'var(--green)'}
          arrow={s ? (s.avg >= 0 ? 'up' : 'down') : null}
          sub="期間:1ヶ月"/>
        <KpiCard delay={0.15} loading={loading} label="資金流入TOP"
          value={<span style={{ fontSize:'14px', color:'var(--red)', fontWeight:700 }}>{s?.top?.theme||'-'}</span>}
          arrow="up"
          sub={s?.top?<span style={{ color:'var(--red)', fontWeight:600 }}>+{s.top.pct.toFixed(1)}%</span>:'-'}/>
        <KpiCard delay={0.2} loading={loading} label="資金流出TOP"
          value={<span style={{ fontSize:'14px', color:'var(--green)', fontWeight:700 }}>{s?.bot?.theme||'-'}</span>}
          arrow="down"
          sub={s?.bot?<span style={{ color:'var(--green)', fontWeight:600 }}>{s.bot.pct.toFixed(1)}%</span>:'-'}/>
      </div>

      {/* マクロ指標 */}
      <SHead title="📈 マーケット指標（1ヶ月）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0' }}><Dots /></div>
      ) : (
        <div className="responsive-grid-3">
          {Object.entries(macro).map(([name,data])=>(
            <MacroCard key={name} name={name} data={data}/>
          ))}
        </div>
      )}

      {/* マクロ比較グラフ（全指標・選択不可）*/}
      <SHead title="📈 マーケット指標比較（1ヶ月・全指標）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0' }}><Dots /></div>
      ) : (
        <MacroLineChart macro={macro} />
      )}

      <style>{`
        .col-quick-grid { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width:640px) { .col-quick-grid { grid-template-columns: 1fr !important; } }
        .hero-desc { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (max-width:900px) {
          .hero-desc { white-space:normal !important; overflow:visible !important; text-overflow:unset !important; }
        }
      `}</style>
    </div>
  )
}
