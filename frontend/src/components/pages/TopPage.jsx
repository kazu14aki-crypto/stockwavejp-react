import { useState, useEffect } from 'react'

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

function KpiCard({ label, value, valueColor, sub, delay=0, loading=false }) {
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

function SHead({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', margin:'20px 0 12px' }}>
      <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text2)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{title}</span>
      <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
    </div>
  )
}

export default function TopPage() {
  const [themes,  setThemes]  = useState(null)
  const [macro,   setMacro]   = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    ;(async()=>{
      setLoading(true)
      try {
        const [tRes,mRes] = await Promise.all([
          fetch(`${API}/api/themes?period=1mo`),
          fetch(`${API}/api/macro?period=1mo`),
        ])
        setThemes(await tRes.json())
        setMacro((await mRes.json()).data || {})
      } catch {}
      setLoading(false)
    })()
  },[])

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
          value={s?`${s.rise} / ${s.total}`:'-'} valueColor="var(--red)" sub="全テーマ中"/>
        <KpiCard delay={0.1} loading={loading} label="平均騰落率"
          value={s?`${s.avg>=0?'+':''}${s.avg?.toFixed(2)}%`:'-'}
          valueColor={s?.avg>=0?'var(--red)':'var(--green)'} sub="期間:1ヶ月"/>
        {/* 資金流入TOP：赤フォント */}
        <KpiCard delay={0.15} loading={loading} label="資金流入TOP"
          value={<span style={{ fontSize:'14px', color:'var(--red)', fontWeight:700 }}>{s?.top?.theme||'-'}</span>}
          sub={s?.top?<span style={{ color:'var(--red)', fontWeight:600 }}>+{s.top.pct.toFixed(1)}%</span>:'-'}/>
        {/* 資金流出TOP：黄緑フォント */}
        <KpiCard delay={0.2} loading={loading} label="資金流出TOP"
          value={<span style={{ fontSize:'14px', color:'var(--green)', fontWeight:700 }}>{s?.bot?.theme||'-'}</span>}
          sub={s?.bot?<span style={{ color:'var(--green)', fontWeight:600 }}>{s.bot.pct.toFixed(1)}%</span>:'-'}/>
      </div>

      {/* マクロ指標 */}
      <SHead title="📈 マクロ指標（1ヶ月）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0' }}><Dots /></div>
      ) : (
        <div className="responsive-grid-3">
          {Object.entries(macro).map(([name,data])=>(
            <MacroCard key={name} name={name} data={data}/>
          ))}
        </div>
      )}

      <style>{`
        .hero-desc { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (max-width:900px) {
          .hero-desc { white-space:normal !important; overflow:visible !important; text-overflow:unset !important; }
        }
      `}</style>
    </div>
  )
}
