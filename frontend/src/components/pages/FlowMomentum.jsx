/**
 * FlowMomentum.jsx — 資金フロー＋騰落モメンタム統合ページ
 */
import { useState, useEffect } from 'react'
import { useFundFlow, useMomentum } from '../../hooks/useMarketData'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1日',  value: '1d'  },
  { label: '1週間', value: '5d'  },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]
const SORT_KEYS = ['騰落率（降順）', '騰落率（昇順）']
const STATE_COLORS = {
  '🔥加速':  '#ff4560',
  '↗転換↑': '#ff8c42',
  '→横ばい': '#4a6080',
  '↘転換↓': '#4a9eff',
  '❄️失速':  '#00c48c',
}

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i) => (
        <span key={i} style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}} />
      ))}
      <div style={{ marginTop:'12px', fontSize:'12px' }}>データ取得中...</div>
    </div>
  )
}

// ── 水平バー（資金フロー用）──
function HBar({ item, maxAbs }) {
  const w = Math.round(Math.abs(item.pct) / maxAbs * 100)
  const c = item.pct >= 0 ? 'var(--red)' : 'var(--green)'
  return (
    <div style={{ display:'grid', gridTemplateColumns:'130px 1fr 70px',
      alignItems:'center', gap:'10px',
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'6px', padding:'7px 12px' }}>
      <span style={{ fontSize:'12px', color:'#c0d0e8', fontWeight:500,
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {item.theme}
      </span>
      <div style={{ height:'5px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${w}%`, background:c, borderRadius:'3px' }} />
      </div>
      <span style={{ fontFamily:'var(--mono)', fontSize:'12px', fontWeight:700, textAlign:'right', color:c }}>
        {item.pct >= 0 ? '+' : ''}{item.pct.toFixed(1)}%
      </span>
    </div>
  )
}


// 自動コメント生成
function AutoComment({ lines }) {
  if (!lines?.length) return null
  return (
    <div style={{
      background:'rgba(74,158,255,0.04)', border:'1px solid rgba(74,158,255,0.12)',
      borderRadius:'10px', padding:'14px 18px', margin:'0 0 20px',
      fontSize:'12px', color:'var(--text2)', lineHeight:'1.9',
    }}>
      {lines.map((line, i) => (
        <p key={i} style={{ margin: i === 0 ? '0 0 8px' : '8px 0 0' }}>{line}</p>
      ))}
    </div>
  )
}

function genFlowComment(allItems, momentumData, period) {
  if (!allItems?.length) return null
  const periodLabel = { '1d':'本日', '5d':'週間', '1mo':'1ヶ月', '3mo':'3ヶ月', '6mo':'6ヶ月', '1y':'1年間' }[period] || period
  const rising  = allItems.filter(t => t.pct > 0)
  const falling = allItems.filter(t => t.pct < 0)
  const sorted  = [...allItems].sort((a,b) => b.pct - a.pct)
  const top3    = sorted.slice(0, 3)
  const bot3    = sorted.slice(-3).reverse()

  // 出来高増加上位
  const volUp = [...allItems].sort((a,b) => (b.volume_chg||0)-(a.volume_chg||0)).slice(0,3)

  // モメンタム
  const accel = momentumData?.filter(t => t.state?.includes('加速'))?.slice(0,4) || []
  const decel = momentumData?.filter(t => t.state?.includes('失速'))?.slice(0,4) || []
  const turn_up = momentumData?.filter(t => t.state?.includes('転換↑'))?.slice(0,3) || []
  const turn_dn = momentumData?.filter(t => t.state?.includes('転換↓'))?.slice(0,3) || []

  const lines = []
  const avg = allItems.length ? (allItems.reduce((s,t)=>s+t.pct,0)/allItems.length) : 0

  // 資金フロー概況
  lines.push(`【${periodLabel}の資金フロー概況】${rising.length}テーマに資金が流入、${falling.length}テーマから流出。平均騰落率${avg >= 0 ? '+' : ''}${avg.toFixed(2)}%で${avg > 1 ? 'リスクオン局面が続いている' : avg < -1 ? 'リスクオフ傾向が強まっている' : '方向感が定まっていない'}。`)

  // 資金流入上位
  lines.push(`▲ 資金流入が目立つテーマ：「${top3.map(t=>`${t.theme}(${t.pct>0?'+':''}${t.pct.toFixed(1)}%)`).join('」「')}」。${top3[0]?.volume_chg > 20 ? `特に「${top3[0].theme}」は出来高も前期比+${top3[0].volume_chg.toFixed(0)}%と急増しており、機関投資家の本格参入を示唆している可能性がある。` : ''}`)

  // 資金流出下位
  lines.push(`▼ 資金流出が目立つテーマ：「${bot3.map(t=>`${t.theme}(${t.pct.toFixed(1)}%)`).join('」「')}」。${decel.length > 0 && decel.some(d => bot3.some(b => b.theme === d.theme)) ? '失速モメンタムと重なるテーマは底入れ確認まで慎重な姿勢が求められる。' : '下落幅が限定的であれば、押し目買いの機会となりうる水準に近づいている可能性もある。'}`)

  // 出来高急増（価格と乖離）
  if (volUp[0]?.volume_chg > 15) {
    lines.push(`📊 出来高が急増しているテーマ：「${volUp.filter(t=>t.volume_chg>15).map(t=>`${t.theme}(+${t.volume_chg?.toFixed(0)}%)`).join('」「')}」。出来高の先行増加は株価に先立つ大口の動きを示すことが多い。上昇テーマでは追随、下落テーマでは底値模索のシグナルと解釈できる。`)
  }

  // モメンタム分析
  if (accel.length > 0) {
    lines.push(`🔥 加速モメンタム（短中期ともに騰勢が加速中）：「${accel.map(t=>t.theme).join('」「')}」。トレンドフォロー戦略が有効な局面。高値追いにはなるが、勢いが続く可能性が高い。`)
  }
  if (turn_up.length > 0) {
    lines.push(`↗ 転換シグナル（下落から上昇へ転換の兆し）：「${turn_up.map(t=>t.theme).join('」「')}」。底値圏からの反転初動である可能性があり、中長期の仕込み場として注目できる。`)
  }
  if (turn_dn.length > 0) {
    lines.push(`↘ 転換シグナル（上昇から失速へ転換の兆し）：「${turn_dn.map(t=>t.theme).join('」「')}」。高値警戒が必要で、利益確定や新規参入の見送りを検討すべき局面。`)
  }
  if (decel.length > 0) {
    lines.push(`❄️ 失速モメンタム（騰落率がマイナスで加速中）：「${decel.map(t=>t.theme).join('」「')}」。下落が加速しており、いったん下げ止まりのサインを待ちたい。過度な逆張りは禁物。`)
  }

  lines.push(`💡 投資判断のポイント：加速テーマと転換↑テーマの組み合わせに注目。特に出来高増加を伴うテーマは資金の本格流入が始まっている可能性が高い。一方、転換↓・失速テーマは売り圧力が続く可能性があり、リバウンドを狙う場合でも確認シグナルを待つことが重要。`)

  return lines
}

export default function FlowMomentum() {
  const [period,  setPeriod]  = useState('1d')
  const [sortKey, setSortKey] = useState('騰落率（降順）')
  const [tab,     setTab]     = useState('flow')  // 'flow' | 'momentum'

  // 資金フロー
  const { data: flowData, loading: loadingF } = useFundFlow(period)

  // 騰落モメンタム ★market.json優先（キャッシュ拡大後は即時表示）
  const { data: momentumRaw, loading: loadingM } = useMomentum(period)
  const momentumData = momentumRaw?.data || []

  const allItems = flowData?.all ?? []
  const maxAbs   = allItems.length ? Math.max(...allItems.map(t => Math.abs(t.pct))) : 1

  let sorted = [...momentumData]
  if (sortKey === '騰落率（降順）') sorted.sort((a, b) => b.pct - a.pct)
  if (sortKey === '騰落率（昇順）') sorted.sort((a, b) => a.pct - b.pct)
  const pctColor = v => v >= 0 ? 'var(--red)' : 'var(--green)'
  const pctSign  = v => v >= 0 ? '+' : ''
  const flowComment = genFlowComment(allItems, momentumData, period)

  return (
    <div style={{ padding:'28px 32px 48px', maxWidth:'1280px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'4px' }}>
        資金フロー・騰落モメンタム
      </h1>

      {/* コントロール */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px', alignItems:'center' }}>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        {tab === 'momentum' && (
          <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={selStyle}>
            {SORT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {/* 自動コメント */}
      <AutoComment lines={flowComment} />

      {/* 自動コメント */}
      <AutoComment lines={flowComment} />

      {/* タブ切替 */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'24px',
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'8px', padding:'4px', width:'fit-content' }}>
        {[['flow','💹 資金フロー'],['momentum','📡 騰落モメンタム']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding:'6px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
            cursor:'pointer', border:'none', fontFamily:'var(--font)',
            background: tab === key ? 'var(--accent)' : 'transparent',
            color: tab === key ? '#fff' : 'var(--text3)',
            transition:'all 0.15s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── 資金フロー ── */}
      {tab === 'flow' && (
        loadingF ? <Loading /> : (
          <>
            {(() => {
              const allItems2 = flowData?.all ?? []
              const risers  = allItems2.filter(t => t.pct > 0).sort((a,b) => b.pct - a.pct).slice(0,5)
              const fallers = allItems2.filter(t => t.pct < 0).sort((a,b) => a.pct - b.pct).slice(0,5)
              const riseCount = allItems2.filter(t => t.pct > 0).length
              const fallCount = allItems2.filter(t => t.pct < 0).length
              return (
                <>
                  <div style={{ display:'flex', gap:'16px', marginBottom:'12px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'12px', color:'var(--red)', fontWeight:600 }}>
                      ▲ {riseCount}テーマ上昇
                    </span>
                    <span style={{ fontSize:'12px', color:'var(--green)', fontWeight:600 }}>
                      ▼ {fallCount}テーマ下落
                    </span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }} className="flow-grid">
                    <div>
                      <SectionHead title={`🔥 資金流入 TOP5（${riseCount}テーマ上昇）`} />
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        {risers.length > 0
                          ? risers.map(item => <HBar key={item.theme} item={item} maxAbs={maxAbs} />)
                          : <div style={{ fontSize:'12px', color:'var(--text3)', padding:'12px' }}>上昇テーマなし</div>
                        }
                      </div>
                    </div>
                    <div>
                      <SectionHead title={`❄️ 資金流出 TOP5（${fallCount}テーマ下落）`} />
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        {fallers.length > 0
                          ? fallers.map(item => <HBar key={item.theme} item={item} maxAbs={maxAbs} />)
                          : <div style={{ fontSize:'12px', color:'var(--text3)', padding:'12px' }}>下落テーマなし</div>
                        }
                      </div>
                    </div>
                  </div>
                </>
              )
            })()}
            <SectionHead title="全テーマ 騰落率一覧" />
            <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
              {allItems.map(item => <HBar key={item.theme} item={item} maxAbs={maxAbs} />)}
            </div>
          </>
        )
      )}

      {/* ── 騰落モメンタム ── */}
      {tab === 'momentum' && (
        loadingM ? <Loading /> : (
          <>
            {/* ヘッダー行 */}
            <div style={{ ...rowStyle, background:'transparent', border:'none',
              padding:'4px 16px', marginBottom:'4px' }}>
              <span style={hdrStyle}>テーマ名</span>
              <span style={{ ...hdrStyle, textAlign:'right' }}>騰落率</span>
              <span style={{ ...hdrStyle, textAlign:'right' }}>先週比</span>
              <span style={{ ...hdrStyle, textAlign:'center' }}>状態</span>
            </div>
            {sorted.map((d, i) => (
              <div key={d.theme} style={{
                ...rowStyle,
                animation:`fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) ${i*0.02}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background='#0e1e32'; e.currentTarget.style.borderColor='rgba(74,158,255,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.borderColor='var(--border)' }}
              >
                <span style={{ fontSize:'13px', color:'#c0d0e8', fontWeight:500 }}>
                  <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)', marginRight:'8px' }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  {d.theme}
                </span>
                <span style={{ fontFamily:'var(--mono)', fontSize:'14px', fontWeight:700, textAlign:'right', color:pctColor(d.pct) }}>
                  {pctSign(d.pct)}{d.pct.toFixed(1)}%
                </span>
                <span style={{ fontFamily:'var(--mono)', fontSize:'13px', textAlign:'right', color:pctColor(d.week_diff) }}>
                  {pctSign(d.week_diff)}{d.week_diff.toFixed(1)}pt
                </span>
                <span style={{ fontSize:'12px', fontWeight:600, textAlign:'center',
                  color: STATE_COLORS[d.state] ?? 'var(--text2)' }}>
                  {d.state}
                </span>
              </div>
            ))}
            <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'12px' }}>
              💡 🔥加速=騰落率↑&先週比↑ / ❄️失速=両方↓ / ↗↘=どちらか転換
            </p>
          </>
        )
      )}

      <style>{`
        @media (max-width:768px) { .flow-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0 10px' }}>
      <span style={{ fontSize:'11px', fontWeight:600, color:'var(--text2)', letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{title}</span>
      <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
    </div>
  )
}

const selStyle = {
  background:'var(--bg3)', color:'var(--text)',
  border:'1px solid rgba(74,120,200,0.2)', borderRadius:'6px',
  fontFamily:'var(--font)', fontSize:'13px',
  padding:'6px 12px', cursor:'pointer', outline:'none',
}
const rowStyle = {
  background:'var(--bg2)', border:'1px solid var(--border)',
  borderRadius:'6px', padding:'8px 12px', marginBottom:'2px',
  display:'grid', gridTemplateColumns:'1fr 74px 74px 86px',
  alignItems:'center', gap:'6px', transition:'background 0.12s, border-color 0.12s',
}
const hdrStyle = { fontSize:'10px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)', textTransform:'uppercase' }
