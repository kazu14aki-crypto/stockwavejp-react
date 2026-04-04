/**
 * FlowMomentum.jsx — 資金フロー＋騰落モメンタム統合ページ
 */
import { useState, useEffect } from 'react'
import { useMomentum } from '../../hooks/useMarketData'

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
      <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500,
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
  // 防御的処理: null/undefined/空/文字列に対応
  let safeLines = lines
  if (!safeLines) return null
  if (typeof safeLines === 'string') safeLines = safeLines.split('\n').filter(Boolean)
  if (!Array.isArray(safeLines) || !safeLines.length) return null

  const rendered = safeLines.map((line, i) => {
    if (typeof line !== 'string') return null
    if (line.startsWith('【')) {
      const e = line.indexOf('】')
      if (e < 0) return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
      const h = line.slice(1, e), r = line.slice(e + 1).trim()
      return (
        <div key={i} style={{ marginBottom:'10px', marginTop: i > 0 ? '14px' : '0' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--accent)', letterSpacing:'0.04em', marginBottom:'4px', borderLeft:'3px solid var(--accent)', paddingLeft:'8px' }}>{h}</div>
          {r && <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', paddingLeft:'11px' }}>{r}</div>}
        </div>
      )
    }
    const icons = ['▲','▼','📊','🔥','❄️','↗','↘','💡','✅','⚠️','📉']
    if (icons.some(ic => line.startsWith(ic))) {
      const si = line.indexOf(' '), icon = si > 0 ? line.slice(0, si) : line[0]
      const text = si > 0 ? line.slice(si + 1) : ''
      const ci = text.indexOf('：'), label = ci > 0 ? text.slice(0, ci) : null, body = ci > 0 ? text.slice(ci + 1).trim() : text
      return (
        <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'7px', paddingLeft:'4px', alignItems:'flex-start' }}>
          <span style={{ fontSize:'13px', flexShrink:0, marginTop:'1px', lineHeight:1.5 }}>{icon}</span>
          <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', flex:1 }}>
            {label && <span style={{ fontWeight:600, color:'var(--text)' }}>{label}：</span>}{body}
          </div>
        </div>
      )
    }
    return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
  }).filter(Boolean)

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 18px', marginBottom:'20px' }}>
      {rendered}
    </div>
  )
}


function genMomentumComment(momentumData, period) {
  const data = momentumData?.data || momentumData || []
  if (!data.length) return null
  const periodLabel = { '1d':'本日', '5d':'週間', '1mo':'1ヶ月', '3mo':'3ヶ月', '6mo':'6ヶ月', '1y':'1年間' }[period] || period

  const accel   = data.filter(t => t.state?.includes('加速'))
  const decel   = data.filter(t => t.state?.includes('失速'))
  const turnUp  = data.filter(t => t.state?.includes('転換↑'))
  const turnDn  = data.filter(t => t.state?.includes('転換↓'))
  const flat    = data.filter(t => t.state?.includes('横ばい'))
  const rising  = data.filter(t => t.pct > 0)
  const falling = data.filter(t => t.pct < 0)
  const avg     = data.length ? data.reduce((s,t)=>s+(t.pct||0),0)/data.length : 0

  const lines = []

  lines.push(`【${periodLabel}の騰落モメンタム概況】全${data.length}テーマ中、上昇${rising.length}・下落${falling.length}テーマ。平均騰落率${avg>=0?'+':''}${avg.toFixed(2)}%。モメンタム別では加速${accel.length}・転換↑${turnUp.length}・横ばい${flat.length}・転換↓${turnDn.length}・失速${decel.length}テーマ。`)

  if (accel.length > 0) {
    const top = accel.slice(0,4).map(t=>t.theme).join('」「')
    lines.push(`🔥 加速モメンタム（${accel.length}テーマ）：「${top}」など。短中期ともに上昇が加速中。トレンドフォロー戦略が有効で、高値でも追随資金が集まりやすい局面。`)
  }
  if (turnUp.length > 0) {
    const top = turnUp.slice(0,3).map(t=>t.theme).join('」「')
    lines.push(`↗ 転換↑（${turnUp.length}テーマ）：「${top}」など。下落から上昇への転換初動の可能性。出来高増加を確認できれば底値仕込みのチャンスになりうる。`)
  }
  if (flat.length > 0) {
    const top = flat.slice(0,3).map(t=>t.theme).join('」「')
    lines.push(`→ 横ばい（${flat.length}テーマ）：「${top}」など。方向感が定まらない状態。ブレイクの方向を見極めてから参入するのが無難。`)
  }
  if (turnDn.length > 0) {
    const top = turnDn.slice(0,3).map(t=>t.theme).join('」「')
    lines.push(`↘ 転換↓（${turnDn.length}テーマ）：「${top}」など。上昇トレンドが失速し始めたシグナル。利益確定や新規参入の見送りを検討する局面。`)
  }
  if (decel.length > 0) {
    const top = decel.slice(0,4).map(t=>t.theme).join('」「')
    lines.push(`❄️ 失速モメンタム（${decel.length}テーマ）：「${top}」など。下落が継続・加速中。反転サインが出るまでは慎重姿勢が望ましく、過度な逆張りは禁物。`)
  }

  lines.push(`💡 活用ポイント：「加速」と「転換↑」の組み合わせが最も強い買いシグナル。「転換↓」と「失速」の組み合わせは売り圧力が継続中のサイン。週次で状態変化を追うことで、トレンド転換のタイミングを先読みできる。`)

  return lines
}

export default function FlowMomentum() {
  const [period,  setPeriod]  = useState('1d')
  const [sortKey, setSortKey] = useState('騰落率（降順）')

  const { data: momentumRaw, loading: loadingM } = useMomentum(period)
  const momentumData = momentumRaw?.data || []

  let sorted = [...momentumData]
  if (sortKey === '騰落率（降順）') sorted.sort((a, b) => b.pct - a.pct)
  if (sortKey === '騰落率（昇順）') sorted.sort((a, b) => a.pct - b.pct)
  const pctColor = v => v >= 0 ? 'var(--red)' : 'var(--green)'
  const pctSign  = v => v >= 0 ? '+' : ''
  const flowComment = genMomentumComment(momentumData, period)

  return (
    <div style={{ padding:'28px 32px 48px', maxWidth:'1280px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'4px' }}>
        騰落モメンタム
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'20px' }}>
        テーマ別の騰落モメンタム（加速・転換・横ばい・失速）を確認できます。
      </p>

      {/* コントロール */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px', alignItems:'center' }}>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={selStyle}>
          {SORT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* 自動コメント */}
      <AutoComment lines={flowComment} />

      {/* モメンタム一覧 */}
      {loadingM ? <Loading /> : (
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
              onMouseEnter={e => { e.currentTarget.style.background='rgba(74,158,255,0.04)'; e.currentTarget.style.borderColor='rgba(74,158,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.borderColor='var(--border)' }}
            >
              <span style={{ fontSize:'13px', color:'var(--text2)', fontWeight:500 }}>
                <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)', marginRight:'8px' }}>
                  {String(i+1).padStart(2,'0')}
                </span>
                {d.theme}
              </span>
              <span style={{ fontFamily:'var(--mono)', fontSize:'14px', fontWeight:700, textAlign:'right', color:pctColor(d.pct) }}>
                {pctSign(d.pct)}{d.pct?.toFixed(1)}%
              </span>
              <span style={{ fontFamily:'var(--mono)', fontSize:'13px', textAlign:'right', color:pctColor(d.week_diff) }}>
                {pctSign(d.week_diff)}{d.week_diff?.toFixed(1)}pt
              </span>
              <span style={{ fontSize:'12px', fontWeight:600, textAlign:'center',
                color: STATE_COLORS[d.state] || 'var(--text3)', padding:'2px 10px',
                background:'rgba(128,128,128,0.08)', borderRadius:'20px', whiteSpace:'nowrap' }}>
                {d.state || '—'}
              </span>
            </div>
          ))}
          {sorted.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'13px' }}>
              データがありません
            </div>
          )}
        </>
      )}
    </div>
  )
}
