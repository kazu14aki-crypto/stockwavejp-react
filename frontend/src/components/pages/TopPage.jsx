import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const NEWS_LIST = [
  { date: '2026/03/15', tag: 'NEW',    title: 'React版リリース',          body: 'StockWaveJPがReact+FastAPIに移行。デザイン・モバイル対応が大幅に改善されました。' },
  { date: '2026/03/01', tag: 'UPDATE', title: '出来高・売買代金ランキング追加', body: 'テーマ一覧ページに出来高・売買代金のランキンググラフを追加しました。' },
  { date: '2026/02/15', tag: 'UPDATE', title: '市場別ランキング拡充',        body: '日経225を6分類、TOPIX Core30/Large70、プライム/スタンダード/グロース市場を追加しました。' },
]

const TAG_COLORS = {
  'NEW':    { bg: 'rgba(255,83,112,0.15)', color: 'var(--red)',    border: 'rgba(255,83,112,0.3)' },
  'UPDATE': { bg: 'rgba(91,156,246,0.12)', color: 'var(--accent)', border: 'rgba(91,156,246,0.25)' },
  'INFO':   { bg: 'rgba(76,175,130,0.12)', color: 'var(--green)',  border: 'rgba(76,175,130,0.25)' },
}

function Loading() {
  return (
    <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
      {[0,0.15,0.3].map((d,i) => (
        <span key={i} style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%',
          background:'var(--accent)', animation:`pulse 1.2s ease-in-out ${d}s infinite` }} />
      ))}
    </div>
  )
}

function KpiCard({ label, value, valueColor, sub, delay=0, loading=false }) {
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'20px 22px',
      animation:`fadeUp 0.4s ease ${delay}s both`,
      transition:'border-color 0.2s, transform 0.15s',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(91,156,246,0.3)'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text2)', textTransform:'uppercase', marginBottom:'12px' }}>{label}</div>
      <div style={{ fontFamily:'var(--mono)', fontSize:'26px', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, marginBottom:'6px', color:valueColor||'var(--text)' }}>
        {loading ? <Loading /> : value}
      </div>
      <div style={{ fontSize:'12px', color:'var(--text3)' }}>{sub}</div>
    </div>
  )
}

function MacroCard({ name, data }) {
  if (!data||!data.length) return null
  const last  = data[data.length-1]
  const color = last.pct>=0 ? 'var(--red)' : 'var(--green)'
  const vals  = data.map(d=>d.pct)
  const min   = Math.min(...vals), max = Math.max(...vals)
  const W=120, H=36
  const pts = vals.map((v,i)=>{
    const x=(i/(vals.length-1))*W
    const y=H-((v-min)/(max-min||1))*H
    return `${x},${y}`
  }).join(' ')
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', padding:'14px 16px',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
      <div>
        <div style={{ fontSize:'12px', color:'var(--text2)', marginBottom:'4px' }}>{name}</div>
        <div style={{ fontFamily:'var(--mono)', fontSize:'16px', fontWeight:700, color }}>
          {last.pct>=0?'+':''}{last.pct.toFixed(1)}%
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ flexShrink:0 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'0 0 14px' }}>
      <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap' }}>{title}</span>
      <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
    </div>
  )
}

export default function TopPage({ onNavigate }) {
  const [themes,  setThemes]  = useState(null)
  const [macro,   setMacro]   = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [tRes, mRes] = await Promise.all([
          fetch(`${API}/api/themes?period=1mo`),
          fetch(`${API}/api/macro?period=1mo`),
        ])
        setThemes(await tRes.json())
        setMacro((await mRes.json()).data || {})
      } catch {}
      setLoading(false)
    }
    fetchAll()
  },[])

  const s = themes?.summary

  return (
    <div style={{ padding:'28px 32px 48px' }}>

      {/* ── ヒーロー ── */}
      <div style={{
        background:'linear-gradient(135deg, rgba(91,156,246,0.08) 0%, rgba(255,83,112,0.06) 100%)',
        border:'1px solid var(--border)', borderRadius:'var(--radius)',
        padding:'28px 32px', marginBottom:'24px',
        animation:'fadeUp 0.5s ease both',
      }}>
        <h1 style={{ fontSize:'26px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'10px' }}>
          <span style={{ color:'var(--logo-red)' }}>Stock</span>Wave<span style={{ color:'var(--logo-red)', fontSize:'16px' }}>JP</span>
        </h1>

        {/* PC版：1行 / スマホ版：折り返し */}
        <p className="hero-desc" style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.7 }}>
          日本株テーマ別の騰落率・出来高・売買代金をリアルタイムで追跡。どのテーマに資金が集まっているかを視覚的に把握できます。
        </p>

        {/* ボタン */}
        <div style={{ display:'flex', gap:'10px', marginTop:'20px', flexWrap:'wrap' }}>
          <button onClick={()=>onNavigate('テーマ一覧')} style={btnPrimary}>
            📊 テーマ一覧を見る →
          </button>
          <button onClick={()=>onNavigate('市場別ランキング')} style={btnSecondary}>
            📋 市場別ランキング
          </button>
        </div>
      </div>

      {/* ── お知らせ（最新3件）── */}
      <SectionHead title="📣 最新のお知らせ" />
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'28px' }}>
        {NEWS_LIST.slice(0,3).map((n,i)=>{
          const tc = TAG_COLORS[n.tag] || TAG_COLORS['INFO']
          return (
            <div key={i} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'8px', padding:'12px 16px',
              display:'flex', alignItems:'flex-start', gap:'14px',
              animation:`fadeUp 0.3s ease ${i*0.06}s both`,
            }}>
              <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'20px',
                background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`,
                whiteSpace:'nowrap', marginTop:'2px' }}>{n.tag}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'3px' }}>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{n.title}</span>
                  <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>{n.date}</span>
                </div>
                <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.6 }}>{n.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── KPIカード ── */}
      <SectionHead title="📊 マーケットサマリー（1ヶ月）" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'28px' }} className="top-kpi">
        <KpiCard delay={0.05} loading={loading} label="上昇テーマ"
          value={s ? `${s.rise} / ${s.total}` : '-'}
          valueColor="var(--red)" sub="全テーマ中" />
        <KpiCard delay={0.1} loading={loading} label="平均騰落率"
          value={s ? `${s.avg>=0?'+':''}${s.avg?.toFixed(2)}%` : '-'}
          valueColor={s?.avg>=0?'var(--red)':'var(--green)'} sub="1ヶ月" />
        <KpiCard delay={0.15} loading={loading} label="資金流入TOP"
          value={<span style={{ fontSize:'16px' }}>{s?.top?.theme||'-'}</span>}
          sub={s?.top?<span style={{ color:'var(--red)', fontWeight:600 }}>+{s.top.pct.toFixed(1)}%</span>:'-'} />
        <KpiCard delay={0.2} loading={loading} label="資金流出TOP"
          value={<span style={{ fontSize:'16px' }}>{s?.bot?.theme||'-'}</span>}
          sub={s?.bot?<span style={{ color:'var(--green)', fontWeight:600 }}>{s.bot.pct.toFixed(1)}%</span>:'-'} />
      </div>

      {/* ── マクロ指標 ── */}
      <SectionHead title="📈 マクロ指標（1ヶ月）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'20px 0' }}>取得中...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }} className="macro-grid">
          {Object.entries(macro).map(([name,data])=>(
            <MacroCard key={name} name={name} data={data}/>
          ))}
        </div>
      )}

      <style>{`
        .top-kpi    { grid-template-columns: repeat(4,1fr) !important; }
        .macro-grid { grid-template-columns: repeat(3,1fr) !important; }
        /* PC版：説明1行 */
        .hero-desc  { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 900px) {
          .top-kpi    { grid-template-columns: repeat(2,1fr) !important; }
          .macro-grid { grid-template-columns: repeat(2,1fr) !important; }
          /* スマホ版：折り返し */
          .hero-desc  { white-space: normal !important; overflow: visible !important; text-overflow: unset !important; }
        }
        @media (max-width: 480px) {
          .top-kpi    { grid-template-columns: 1fr 1fr !important; }
          .macro-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const btnPrimary = {
  padding:'10px 20px', borderRadius:'8px', fontSize:'13px', cursor:'pointer',
  background:'rgba(91,156,246,0.15)', color:'var(--accent)',
  border:'1px solid rgba(91,156,246,0.3)',
  fontFamily:'var(--font)', fontWeight:600, transition:'all 0.15s', whiteSpace:'nowrap',
}
const btnSecondary = {
  padding:'10px 20px', borderRadius:'8px', fontSize:'13px', cursor:'pointer',
  background:'transparent', color:'var(--text2)',
  border:'1px solid var(--border)',
  fontFamily:'var(--font)', fontWeight:400, transition:'all 0.15s', whiteSpace:'nowrap',
}
