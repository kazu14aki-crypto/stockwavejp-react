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

// ── 市場コメント自動生成 ──
function generateMarketComment(themeData, macro) {
  if (!themeData || !themeData.themes) return null
  const s = themeData.summary
  if (!s) return null
  const t = themeData.themes

  // 上昇・下落数
  const riseCount = s.rise
  const fallCount = s.fall
  const total     = s.total
  const avg       = s.avg ?? 0

  // 市場全体の状態
  let marketState = ''
  if (riseCount >= total * 0.7) marketState = '広範な上昇相場'
  else if (riseCount >= total * 0.5) marketState = '上昇優勢の相場'
  else if (fallCount >= total * 0.7) marketState = '広範な下落相場'
  else if (fallCount >= total * 0.5) marketState = '下落優勢の相場'
  else marketState = '方向感が定まらない相場'

  // 上位・下位テーマ
  const top3 = [...t].sort((a, b) => b.pct - a.pct).slice(0, 3)
  const bot3 = [...t].sort((a, b) => a.pct - b.pct).slice(0, 3)

  // 出来高増加テーマ
  const volUp = [...t].filter(x => (x.volume_chg || 0) > 20)
    .sort((a, b) => (b.volume_chg || 0) - (a.volume_chg || 0)).slice(0, 2)

  // コメント生成
  const lines = []

  // 全体概況
  lines.push(`現在の日本株テーマ相場は${marketState}となっています。全${total}テーマ中${riseCount}テーマが上昇、${fallCount}テーマが下落しており、テーマ平均騰落率は${avg >= 0 ? '+' : ''}${avg.toFixed(2)}%です。`)

  // 上昇テーマ
  if (top3.length && top3[0].pct > 0) {
    const names = top3.filter(x => x.pct > 0).map(x => `${x.theme}（${x.pct >= 0 ? '+' : ''}${x.pct.toFixed(1)}%）`).join('、')
    lines.push(`上昇が目立つテーマは${names}です。`)
  }

  // 下落テーマ
  if (bot3.length && bot3[0].pct < 0) {
    const names = bot3.filter(x => x.pct < 0).map(x => `${x.theme}（${x.pct.toFixed(1)}%）`).join('、')
    lines.push(`一方、${names}は軟調な動きとなっています。`)
  }

  // 出来高増加テーマ
  if (volUp.length > 0) {
    const names = volUp.map(x => x.theme).join('・')
    lines.push(`${names}は出来高が増加しており、特に市場参加者の関心が高まっています。`)
  }

  return lines.join(' ')
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

function MacroCard({ name, data, color }) {
  if (!data||!data.length) return null
  const last  = data[data.length-1]
  const pctColor = last.pct>=0 ? 'var(--red)' : 'var(--green)'
  const lineColor = color || pctColor
  const vals  = data.map(d=>d.pct)
  const min   = Math.min(...vals), max = Math.max(...vals)
  const W=120, H=44
  // 各指標独立スケールでスパークライン描画
  const pts = vals.map((v,i)=>`${(i/Math.max(vals.length-1,1))*W},${H-((v-min)/(max-min||0.01))*H}`).join(' ')
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px',
      padding:'10px 12px', display:'flex', flexDirection:'column', gap:'6px', minWidth:0 }}>
      <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, letterSpacing:'0.05em',
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'8px' }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:'16px', fontWeight:700, color:pctColor, lineHeight:1 }}>
          {last.pct>=0?'+':''}{last.pct.toFixed(1)}%
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ flexShrink:0, display:'block' }}>
          <polyline points={pts} fill="none" stroke={lineColor} strokeWidth="1.8"
            strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}

// APIから来るキー名をそのまま表示（バックエンドのMACRO_TICKERSと一致させる）
// キー名はdata.pyのMACRO_TICKERSで管理
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

  // 各指標を独立スケールで正規化（0基準→期間内の相対変化を均等表示）
  // Y軸は「相対騰落率（各指標の期間内変化幅を揃える）」
  const scaledData = {}
  names.forEach(n => {
    const data = macro[n] || []
    if (!data.length) return
    const vals = data.map(d => d.pct)
    const dataMin = Math.min(...vals)
    const dataMax = Math.max(...vals)
    const range = dataMax - dataMin || 0.01
    // 各指標を-50〜+50の共通レンジに正規化して表示
    scaledData[n] = data.map(d => ({
      date: d.date,
      pct: d.pct,  // 実際の%（凡例表示用）
      scaled: ((d.pct - dataMin) / range) * 80 - 40  // -40〜+40に正規化
    }))
  })

  // 正規化後のスケール（固定 -50〜+50）
  const nMin = -45, nMax = 45
  const xS = i => PL + (i / Math.max(dates.length-1, 1)) * (W-PL-PR)
  const yS = v => PT + (1 - (v-nMin)/(nMax-nMin)) * (H-PT-PB)

  // Y軸ラベル（相対変化を示す）
  const ticks = [-40, -20, 0, 20, 40]

  const xStep = Math.max(1, Math.floor(dates.length / 5))
  const xLabels = []
  for (let i = 0; i < dates.length; i += xStep) xLabels.push({ i, date: dates[i] })

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px', overflowX:'auto' }}>
      {/* ミニチャートカード（各指標の実際の騰落率）*/}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', marginBottom:'14px' }} className="macro-mini-grid">
        {names.map((name, ti) => (
          <MacroCard key={name} name={name} data={macro[name] || []} color={MACRO_COLORS[ti % MACRO_COLORS.length]} />
        ))}
      </div>

      {/* 折れ線グラフ（各指標の相対変化を均等スケールで表示）*/}
      <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>
        ▼ 期間内の相対変化トレンド（各指標の変動幅を均等に正規化）
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'320px' }}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="rgba(74,120,200,0.07)" strokeWidth="1"/>
            {v === 0 && (
              <line x1={PL} y1={yS(0)} x2={W-PR} y2={yS(0)} stroke="rgba(74,120,200,0.25)" strokeWidth="1" strokeDasharray="4,4"/>
            )}
            <text x={PL-4} y={yS(v)+3} textAnchor="end" fill="var(--text3)" fontSize="8" fontFamily="DM Mono">
              {v > 0 ? `+${v}` : v}
            </text>
          </g>
        ))}
        {xLabels.map(({i, date}) => (
          <text key={date} x={xS(i)} y={H-4} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">
            {date.slice(2,7)}
          </text>
        ))}
        {names.map((name, ti) => {
          const data = scaledData[name] || []
          if (!data.length) return null
          const color = MACRO_COLORS[ti % MACRO_COLORS.length]
          const pts = data.map(d => {
            const xi = dates.indexOf(d.date)
            return xi >= 0 ? `${xS(xi)},${yS(d.scaled)}` : null
          }).filter(Boolean)
          return pts.length ? (
            <polyline key={name} points={pts.join(' ')} fill="none"
              stroke={color} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" opacity="0.85"/>
          ) : null
        })}
      </svg>
      {/* 凡例 */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginTop:'8px' }}>
        {names.map((name, ti) => {
          const data = macro[name] || []
          const last = data[data.length-1]
          const color = MACRO_COLORS[ti % MACRO_COLORS.length]
          return (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <div style={{ width:'14px', height:'2px', background:color, borderRadius:'1px' }} />
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
      <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'6px' }}>
        ※ETFベースの独自指標。Y軸は各指標の変動幅を正規化した相対値（実際の騰落率はカード参照）
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

      {/* 市場コメント自動生成 */}
      {!loading && themes && (
        <div style={{
          background:'rgba(74,158,255,0.05)', border:'1px solid rgba(74,158,255,0.18)',
          borderRadius:'8px', padding:'12px 16px', marginBottom:'4px',
          animation:'fadeUp 0.4s ease 0.25s both',
        }}>
          <div style={{ fontSize:'10px', fontWeight:700, color:'var(--accent)',
            letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'6px' }}>
            📝 本日のマーケットコメント（自動生成・1ヶ月集計）
          </div>
          <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.9 }}>
            {generateMarketComment(themes, macro)}
          </div>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'6px' }}>
            ※ 本コメントはデータに基づき自動生成されたものです。投資助言ではありません。
          </div>
        </div>
      )}

      {/* マーケット指標（ミニカード＋比較グラフ統合）*/}
      <SHead title="📈 マーケット指標・比較（1ヶ月）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0' }}><Dots /></div>
      ) : (
        <MacroLineChart macro={macro} />
      )}

      <style>{`
        .col-quick-grid { grid-template-columns: 1fr 1fr 1fr; }
        .macro-mini-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width:640px) {
          .col-quick-grid { grid-template-columns: 1fr !important; }
          .macro-mini-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .hero-desc { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (max-width:900px) {
          .hero-desc { white-space:normal !important; overflow:visible !important; text-overflow:unset !important; }
        }
      `}</style>
    </div>
  )
}
