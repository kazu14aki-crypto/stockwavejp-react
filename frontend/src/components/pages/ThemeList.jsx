import React, { useState } from 'react'
import { useThemes, useCustomThemeStats, useMacro, useMomentum, useMonthlyHeatmap } from '../../hooks/useMarketData'
import { useCustomThemes } from '../../hooks/useCustomThemes'
import RefreshIndicator from '../RefreshIndicator'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1日',  value: '1d'  },
  { label: '1週間', value: '5d'  },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]

function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '兆'
  if (n >= 1e8)  return (n / 1e8).toFixed(1) + '億'
  if (n >= 1e4)  return (n / 1e4).toFixed(1) + '万'
  return n.toLocaleString()
}

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
      {[0, 0.15, 0.3].map((d, i) => (
        <span key={i} style={{
          display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
          background: 'var(--accent)', margin: '0 3px',
          animation: `pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}
      <div style={{ marginTop: '14px', fontSize: '13px' }}>データ取得中...</div>
    </div>
  )
}



// コメントボックスコンポーネント

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


// ③ 自動コメント生成（テーマ一覧）
function genThemeComment(themes, summary, period, momentum) {
  if (!themes || !themes.length) return null
  const periodLabel = { '1d':'本日', '5d':'週間', '1mo':'1ヶ月', '3mo':'3ヶ月', '6mo':'6ヶ月', '1y':'1年間' }[period] || period
  const rising  = themes.filter(t => t.pct > 0)
  const falling = themes.filter(t => t.pct < 0)
  const avg     = summary?.avg ?? 0
  const top     = themes[0]
  const bot     = themes[themes.length - 1]

  // 急騰・急落テーマ
  const hotThemes  = themes.filter(t => t.pct >= 5).map(t => t.theme)
  const coldThemes = themes.filter(t => t.pct <= -5).map(t => t.theme)

  // 出来高急増テーマ（前期比+30%以上）
  const volSurge = themes.filter(t => (t.volume_chg || 0) >= 30).map(t => t.theme)

  // モメンタム（加速・失速）
  const accel = momentum?.filter(t => t.state?.includes('加速')).map(t => t.theme) || []
  const decel = momentum?.filter(t => t.state?.includes('失速')).map(t => t.theme) || []

  const lines = []

  // 全体相場概況
  const mktTone = avg >= 2 ? '強気' : avg >= 0.5 ? 'やや強気' : avg <= -2 ? '弱気' : avg <= -0.5 ? 'やや弱気' : '中立'
  lines.push(`【${periodLabel}の全体概況】${periodLabel}の全30テーマを見ると、上昇${rising.length}テーマ・下落${falling.length}テーマで平均騰落率は${avg >= 0 ? '+' : ''}${avg.toFixed(2)}%（${mktTone}）。`)

  // トップ・ボトム
  lines.push(`最高騰テーマは「${top?.theme}」(${top?.pct >= 0 ? '+' : ''}${top?.pct?.toFixed(2)}%)、最大下落テーマは「${bot?.theme}」(${bot?.pct?.toFixed(2)}%)で、その差は${(top?.pct - bot?.pct)?.toFixed(1)}ptと${Math.abs(top?.pct - bot?.pct) > 15 ? 'テーマ間の格差が大きい' : 'テーマ間のばらつきは比較的小さい'}。`)

  // 急騰テーマ
  if (hotThemes.length > 0) {
    lines.push(`▲ +5%超の急騰テーマ：「${hotThemes.slice(0, 3).join('」「')}」${hotThemes.length > 3 ? `など${hotThemes.length}テーマ` : ''}。強いトレンドが継続しており、資金集中が進んでいる可能性がある。`)
  }

  // 急落テーマ
  if (coldThemes.length > 0) {
    lines.push(`▼ -5%超の下落テーマ：「${coldThemes.slice(0, 3).join('」「')}」${coldThemes.length > 3 ? `など${coldThemes.length}テーマ` : ''}。過熱感の解消か、外部環境の悪化が影響している可能性がある。`)
  }

  // 出来高急増
  if (volSurge.length > 0) {
    lines.push(`📊 出来高が前期比+30%超の急増テーマ：「${volSurge.slice(0, 3).join('」「')}」。価格変動に先立つ出来高増加は、大口資金の流入を示唆することが多い。`)
  }

  // モメンタム
  if (accel.length > 0) {
    lines.push(`🔥 加速モメンタム（短期・中期ともに上昇が加速）：「${accel.slice(0, 4).join('」「')}」。既存トレンドが強まっており、追随資金が流入しやすい局面。`)
  }
  if (decel.length > 0) {
    lines.push(`❄️ 失速モメンタム（騰勢が鈍化または反転）：「${decel.slice(0, 4).join('」「')}」。天井形成の可能性を示す場合があるが、底値からの反発を見極める必要もある。`)
  }

  // 総合判断
  const netBias = rising.length - falling.length
  const sentiment = netBias > 10 ? '広範な買い優勢で市場全体にリスクオンムードが漂う。' :
                    netBias < -10 ? '広範な売り優勢でリスクオフ傾向が強い。特定セクターへの集中も見られる。' :
                    '上昇・下落がまちまちで、個別テーマの選別が重要な局面。'
  lines.push(`💡 総合：${sentiment}${hotThemes.length > 0 && coldThemes.length > 0 ? `一方で「${hotThemes[0]}」と「${coldThemes[0]}」の間に明確な強弱格差が生じており、テーマ選択の重要性が高まっている。` : ''}`)

  return lines
}


// テーマ名→関連コラムIDのマッピング
const THEME_ARTICLE_MAP = {
  '半導体製造装置':    'semiconductor-theme',
  '半導体検査装置':    'semiconductor-theme',
  '半導体材料':        'semiconductor-theme',
  'メモリ':            'semiconductor-theme',
  'パワー半導体':      'power-semiconductor',
  '次世代半導体':      'semiconductor-theme',
  '生成AI':            'ai-cloud-theme',
  'AIデータセンター':  'ai-cloud-theme',
  'フィジカルAI':      'physical-ai-edge-ai',
  'AI半導体':          'semiconductor-theme',
  'AI人材':            'education-hr-theme',
  'エッジAI':          'physical-ai-edge-ai',
  'EV・電気自動車':    'ev-green-theme',
  '全固体電池':        'ev-green-theme',
  '自動運転':          'ev-green-theme',
  'ドローン':          'drone-theme',
  '輸送・物流':        'transport-logistics-theme',
  '造船':              'shipbuilding-theme',
  '再生可能エネルギー':'renewable-energy-theme',
  '太陽光発電':        'renewable-energy-theme',
  '核融合発電':        'renewable-energy-theme',
  '原子力発電':        'renewable-energy-theme',
  '電力会社':          'renewable-energy-theme',
  'LNG':               'inpex-analysis',
  '石油':              'inpex-analysis',
  '蓄電池':            'ev-green-theme',
  '資源（水素・ヘリウム・水）': 'rare-earth-resources-theme',
  'IOWN':              'optical-communication',
  '光通信':            'optical-communication',
  '通信':              'telecom-theme',
  '量子コンピューター':'ai-cloud-theme',
  'SaaS':              'fintech-theme',
  'ウェアラブル端末':  'game-entertainment-theme',
  '仮想通貨':          'fintech-theme',
  'ネット銀行':        'banking-finance-theme',
  '鉄鋼・素材':        'steel-materials-theme',
  '化学':              'chemical-theme',
  '建築資材':          'construction-infra-theme',
  '塗料':              'chemical-theme',
  '医薬品・バイオ':    'pharma-bio-theme',
  'ヘルスケア・介護':  'healthcare-nursing-theme',
  '薬局・ドラッグストア': 'healthcare-nursing-theme',
  '銀行・金融':        'banking-finance-theme',
  '地方銀行':          'regional-bank-theme',
  '保険':              'insurance-theme',
  'フィンテック':      'fintech-theme',
  '不動産':            'real-estate-theme',
  '建設・インフラ':    'construction-infra-theme',
  '国土強靭化計画':    'national-resilience',
  '下水道':            'construction-infra-theme',
  '食品・飲料':        'food-beverage-theme',
  '農業・フードテック':'agritech-foodtech-theme',
  '小売・EC':          'retail-ec-theme',
  '観光・ホテル・レジャー': 'tourism-hotel-theme',
  'インバウンド':      'inbound-theme',
  'リユース・中古品':  'retail-ec-theme',
  '防衛・航空':        'defense-theme',
  '宇宙・衛星':        'space-satellite-theme',
  'ロボット・自動化':  'robot-automation-theme',
  'レアアース・資源':  'rare-earth-resources-theme',
  'バフェット銘柄':    'sogo-shosha-analysis',
  'サイバーセキュリティ': 'cybersecurity-theme',
  '警備':              'cybersecurity-theme',
  '脱炭素・ESG':       'ev-green-theme',
  '教育・HR・人材':    'education-hr-theme',
  '人材派遣':          'education-hr-theme',
  'ゲーム・エンタメ':  'game-entertainment-theme',
}

// ヒートマップゾーン説明（拡大時に表示）
const ZONE_DESCS = [
  { label:'🔥 注目ゾーン（右上）', desc:'上昇＋出来高急増＝最強シグナル', color:'#ff5370' },
  { label:'⚠️ 売り圧力（左上）',   desc:'下落＋出来高急増＝強い売り',    color:'#00c48c' },
  { label:'📈 静かな上昇（右下）',  desc:'上昇＋出来高少＝じわり上昇',    color:'#ff8c42' },
  { label:'❄️ 静かな下落（左下）',  desc:'弱含みだが動意なし',             color:'#4a9eff' },
]

function ExpandableChart({ title, children, showZoneDesc = false }) {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <>
      <div className="expandable-chart-wrap">
        {/* PC版: 縮小表示 */}
        <div className="expandable-chart-preview">
          <div style={{ pointerEvents:'none', transformOrigin:'top left' }}>
            {children}
          </div>
        </div>
        {/* PC版: クリックで拡大ボタン（グラフ下部） */}
        <button className="expandable-chart-btn" onClick={() => setExpanded(true)}>
          🔍 クリックで拡大
        </button>
        {/* スマホ版: 通常表示 */}
        <div className="expandable-chart-mobile">
          {children}
        </div>
      </div>

      {/* 拡大モーダル */}
      {expanded && (
        <div onClick={() => setExpanded(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
          zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'20px', backdropFilter:'blur(4px)',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:'var(--bg)', borderRadius:'12px', border:'1px solid var(--border)',
            padding:'20px', width:'min(92vw, 1200px)', maxHeight:'90vh',
            overflowY:'auto', position:'relative',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
              <span style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{title}</span>
              <button onClick={() => setExpanded(false)} style={{
                background:'rgba(255,255,255,0.08)', border:'1px solid var(--border)',
                borderRadius:'6px', color:'var(--text2)', cursor:'pointer',
                fontSize:'13px', padding:'4px 12px', fontFamily:'var(--font)',
              }}>✕ 閉じる</button>
            </div>
            {/* ヒートマップ拡大時のみゾーン説明を表示 */}
            {showZoneDesc && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px', marginBottom:'12px' }}>
                {ZONE_DESCS.map(z => (
                  <div key={z.label} style={{ display:'flex', alignItems:'center', gap:'5px',
                    background:'var(--bg2)', borderRadius:'6px', padding:'6px 8px',
                    border:'1px solid var(--border)' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:z.color, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:'10px', fontWeight:600, color:'var(--text)' }}>{z.label}</div>
                      <div style={{ fontSize:'9px', color:'var(--text3)' }}>{z.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </>
  )
}

// BubbleScatterのミニ版（ThemeList内埋め込み用・useMomentumを使用）
function BubbleScatterMini({ onNavigate }) {
  const [mPeriod, setMPeriod] = React.useState('1mo')
  const { data: momentumRaw } = useMomentum(mPeriod)
  const data = momentumRaw?.data || []
  if (!data.length) return <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'12px' }}>データ読み込み中...</div>

  const filtered = data.filter(d => d.pct != null && !isNaN(d.pct))
  const W=800, H=380, PL=54, PR=24, PT=32, PB=44
  const GW=W-PL-PR, GH=H-PT-PB
  const pcts=filtered.map(d=>d.pct), volChgs=filtered.map(d=>d.volume_chg??d.week_diff??0)
  const tvs=filtered.map(d=>d.trade_value??0), tvMax=Math.max(...tvs.filter(v=>v>0),1)
  const rSt=Math.max((Math.max(...pcts)-Math.min(...pcts))*0.15,1.5)
  const rSy=Math.max((Math.max(...volChgs)-Math.min(...volChgs))*0.15,2)
  const xMin=Math.min(...pcts)-rSt, xMax=Math.max(...pcts)+rSt
  const yMin=Math.min(...volChgs)-rSy, yMax=Math.max(...volChgs)+rSy
  const xS=v=>PL+((v-xMin)/(xMax-xMin||1))*GW
  const yS=v=>PT+GH-((v-yMin)/(yMax-yMin||1))*GH
  const rS=tv=>tv>0?8+(tv/tvMax)*30:6
  const bC=pct=>pct>=8?'#ff2244':pct>=4?'#ff5370':pct>=1.5?'#ff8c42':pct>=0?'#e8a040':pct>=-1.5?'#3db88a':pct>=-4?'#00c48c':'#00a878'
  const x0=xS(0), y0=yS(0)
  return (
    <div>
      <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
        <select value={mPeriod} onChange={e=>setMPeriod(e.target.value)} style={{
          background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)',
          borderRadius:'6px', fontFamily:'var(--font)', fontSize:'12px', padding:'4px 10px', cursor:'pointer' }}>
          {[{v:'1d',l:'1日'},{v:'5d',l:'1週間'},{v:'1mo',l:'1ヶ月'},{v:'3mo',l:'3ヶ月'}].map(p=>(
            <option key={p.v} value={p.v}>{p.l}</option>
          ))}
        </select>
        <span style={{ fontSize:'10px', color:'var(--text3)' }}>X=騰落率 Y=出来高急増率 円=売買代金</span>
      </div>
      <div style={{ width:'100%', overflowX:'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', minWidth:'320px', display:'block',
          background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}
          onClick={e=>{
            const svg=e.currentTarget, rect=svg.getBoundingClientRect()
            const mx=(e.clientX-rect.left)*(W/rect.width), my=(e.clientY-rect.top)*(H/rect.height)
            let closest=null, minD=Infinity
            filtered.forEach(d=>{const cx=xS(d.pct),cy=yS(d.volume_chg??d.week_diff??0),dd=Math.hypot(mx-cx,my-cy);if(dd<minD){minD=dd;closest=d}})
            if(closest&&minD<30&&onNavigate) onNavigate('テーマ別詳細', closest.theme)
          }} style={{ cursor:'pointer' }}>
          {/* ゾーン背景 */}
          <rect x={x0} y={PT} width={PL+GW-x0} height={y0-PT} fill="rgba(255,83,112,0.07)" rx="3"/>
          <rect x={PL} y={PT} width={x0-PL} height={y0-PT} fill="rgba(0,196,140,0.06)" rx="3"/>
          <rect x={x0} y={y0} width={PL+GW-x0} height={PT+GH-y0} fill="rgba(255,140,66,0.04)" rx="3"/>
          <line x1={x0} y1={PT} x2={x0} y2={PT+GH} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="5,3"/>
          <line x1={PL} y1={y0} x2={PL+GW} y2={y0} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="5,3"/>
          <text x={x0+6} y={PT+14} fontSize="10" fill="rgba(255,83,112,0.8)" fontWeight="700">🔥 注目</text>
          <text x={PL+6} y={PT+14} fontSize="10" fill="rgba(0,196,140,0.75)" fontWeight="700">⚠️ 売圧</text>
          <text x={x0+6} y={PT+GH-6} fontSize="10" fill="rgba(255,140,66,0.7)">📈 静上昇</text>
          <text x={PL+6} y={PT+GH-6} fontSize="10" fill="rgba(74,158,255,0.65)">❄️ 静下落</text>
          {filtered.map(d=>{
            const cx=xS(d.pct), cy=yS(d.volume_chg??d.week_diff??0), r=rS(d.trade_value), col=bC(d.pct)
            return (
              <g key={d.theme}>
                <circle cx={cx} cy={cy} r={r} fill={col} opacity="0.75" stroke={col} strokeWidth="0.5"/>
                {r>14&&<text x={cx} y={cy+3} textAnchor="middle" fontSize="7" fill="white" fontWeight="600"
                  style={{ pointerEvents:'none' }}>{d.theme.slice(0,5)}</text>}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '28px 0 14px' }}>
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}

function KpiCard({ label, value, valueColor, sub, delay = 0, arrow = null }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '16px 18px',
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, lineHeight: 1, marginBottom: '6px', color: valueColor || 'var(--text)', display: 'flex', alignItems: 'center' }}>
        {value}
        {arrow && <span style={{ fontSize: '18px', marginLeft: '4px', color: arrow === 'up' ? 'var(--red)' : 'var(--green)' }}>{arrow === 'up' ? '↗' : '↘'}</span>}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{sub}</div>
    </div>
  )
}

// ── 横棒グラフ（C案：テーマ名をY軸に水平表示）──
function HBarChart({ items, valueKey = 'pct', formatFn, colorFn, title, emptyMsg }) {
  if (!items || !items.length) return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'20px', textAlign:'center',
      color:'var(--text3)', fontSize:'12px' }}>
      {emptyMsg || 'データなし'}
    </div>
  )

  const vals   = items.map(t => t[valueKey] || 0)
  const maxAbs = Math.max(...vals.map(Math.abs), 0.01)
  const fmt    = (v) => formatFn ? formatLarge(v) : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '12px 14px',
    }}>
      {title && (
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '10px', letterSpacing: '0.06em' }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {items.map((item, i) => {
          const v     = item[valueKey] || 0
          const color = colorFn(v)
          // 幅は最大値基準で0〜100%
          const w = Math.abs(v) / maxAbs * 100

          return (
            <div key={item.theme || item.name || i} style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 68px',
              alignItems: 'center',
              gap: '8px',
              animation: `fadeUp 0.25s ease ${i * 0.02}s both`,
            }}>
              {/* テーマ名 */}
              <span style={{
                fontSize: '11px', color: 'var(--text2)', fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                textAlign: 'right',
              }}>
                {item.theme || item.name}
              </span>
              {/* バー */}
              <div style={{ height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  height: '100%',
                  width: `${w}%`,
                  // 正値は左から、負値も左から（絶対値で幅）
                  left: 0,
                  background: color,
                  borderRadius: '3px',
                  opacity: 0.85,
                }} />
              </div>
              {/* 値 */}
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
                textAlign: 'right', color, whiteSpace: 'nowrap',
              }}>
                {fmt(v)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── TOP5横棒（上昇・下落を2列）──
function Top5Pair({ top5, bot5, topTitle, botTitle, topColorFn, botColorFn, valueKey, bot5ValueKey, formatFn }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="top5-grid">
      <HBarChart items={top5} valueKey={valueKey} formatFn={formatFn} colorFn={topColorFn} title={topTitle} emptyMsg="上昇テーマなし" />
      <HBarChart items={bot5} valueKey={bot5ValueKey || valueKey} formatFn={formatFn} colorFn={botColorFn} title={botTitle} emptyMsg="下落テーマなし" />
    </div>
  )
}

// カスタムテーマ1行ずつ騰落率を取得して表示
function CustomThemeRow({ ct, period, pctColor, rank, volRankMap, tvRankMap }) {
  const tickers = (ct.stocks || []).map(s => s.ticker)
  const { data, loading } = useCustomThemeStats(tickers, period)
  const pct = data?.pct ?? null
  const fmt = (n) => {
    if (!n && n !== 0) return '—'
    if (n >= 1e12) return (n/1e12).toFixed(1)+'兆'
    if (n >= 1e8)  return (n/1e8).toFixed(1)+'億'
    if (n >= 1e4)  return (n/1e4).toFixed(1)+'万'
    return n.toLocaleString()
  }
  const col = pct !== null ? pctColor(pct) : 'var(--text3)'
  const badgeColor = pct !== null && pct >= 0 ? 'rgba(226,75,74,0.85)' : 'rgba(29,158,117,0.85)'

  return (
    <div style={{
      background:'rgba(170,119,255,0.06)',
      border:'1px solid rgba(170,119,255,0.25)',
      borderRadius:'8px', padding:'8px 10px',
      display:'flex', gap:'8px', alignItems:'flex-start',
    }}>
      <div style={{
        minWidth:'22px', height:'22px', borderRadius:'5px',
        background: rank <= 3 ? 'rgba(170,119,255,0.7)' : 'rgba(120,130,150,0.15)',
        color: rank <= 3 ? '#fff' : 'var(--text3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'11px', fontWeight:700, fontFamily:'var(--mono)', flexShrink:0, marginTop:'1px',
      }}>🎨</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'11px', fontWeight:600, color:'#c8a8ff',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'3px' }}>
          {ct.name}
        </div>
        {loading ? (
          <div style={{ fontSize:'11px', color:'var(--text3)' }}>取得中...</div>
        ) : pct !== null ? (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color:col, fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${Math.min(Math.abs(pct)/25*100,100)}%`, height:'100%', background:col, borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', lineHeight:1.7 }}>
              <span style={{ display:'flex', justifyContent:'space-between' }}>
                <span>出来高 {fmt(data?.volume)}</span>
                {data?.vol_rank && <span style={{ color:'#378ADD' }}>#{data.vol_rank}</span>}
              </span>
              <span style={{ display:'flex', justifyContent:'space-between' }}>
                <span>売買代金 {fmt(data?.trade_value)}</span>
                {data?.tv_rank && <span style={{ color:'#ff8c42' }}>#{data.tv_rank}</span>}
              </span>
            </div>
          </>
        ) : (
          <div style={{ fontSize:'11px', color:'var(--text3)' }}>データなし</div>
        )}
      </div>
    </div>
  )
}

function CustomThemeRows({ themes, period, pctColor }) {
  return (
    <>
      <div className="theme-card-grid">
        {themes.map((ct, i) => (
          <CustomThemeRow key={i} ct={ct} period={period} pctColor={pctColor} rank={i+1} />
        ))}
      </div>
      <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px' }}>
        💡 詳細データはサイドメニュー「カスタムテーマ」から確認できます
      </div>
    </>
  )
}


// ⑤ カードグリッド用ThemeCard（順位バッジ＋各ランク表示）
function ThemeCard({ item, rank, maxAbs, valueKey='pct', barColor, pctColor, pctRank, volRank, tvRank, onNavigate, momentumState, momentumPct }) {
  const fmt = (n) => {
    if (!n) return '0'
    if (n >= 1e12) return (n/1e12).toFixed(1)+'兆'
    if (n >= 1e8)  return (n/1e8).toFixed(1)+'億'
    if (n >= 1e4)  return (n/1e4).toFixed(1)+'万'
    return n.toLocaleString()
  }
  const rankTag = (r, color) => r ? (
    <span style={{ fontSize:'9px', color: color||'var(--text3)', fontFamily:'var(--mono)',
      background:'rgba(128,128,128,0.1)', borderRadius:'3px', padding:'1px 4px', marginLeft:'4px' }}>
      #{r}
    </span>
  ) : null

  const pct  = item.pct ?? 0
  const val  = item[valueKey] ?? 0
  const barW = maxAbs ? Math.min(Math.abs(val) / maxAbs * 100, 100) : Math.min(Math.abs(pct) / 25 * 100, 100)
  const col  = pctColor(pct)
  const badgeOpacity = Math.max(1 - (rank - 1) * 0.028, 0.25)
  const isUp = pct >= 0
  const badgeColor = valueKey === 'pct'
    ? (isUp ? `rgba(226,75,74,${badgeOpacity})` : `rgba(29,158,117,${badgeOpacity})`)
    : barColor || '#378ADD'
  const isTopBadge = rank <= 3

  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'8px', padding:'8px 10px',
      display:'flex', gap:'8px', alignItems:'flex-start',
    }}>
      <div style={{
        minWidth:'22px', height:'22px', borderRadius:'5px',
        background: isTopBadge ? badgeColor : 'rgba(120,130,150,0.15)',
        color: isTopBadge ? '#fff' : 'var(--text3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'11px', fontWeight:700, fontFamily:'var(--mono)',
        flexShrink:0, marginTop:'1px',
      }}>{rank}</div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'3px', minWidth:0 }}>
          <span style={{ fontSize:'11px', fontWeight:600, color:'var(--text)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, minWidth:0 }}>
            {item.theme}
          </span>
          {valueKey === 'pct' && momentumState && (() => {
            const stateColors = { '🔥加速':'#ff4560','↗転換↑':'#ff8c42','→横ばい':'var(--text3)','↘転換↓':'#4a9eff','❄️失速':'#4a9eff' }
            const sc = stateColors[momentumState] || 'var(--text3)'
            return (
              <span style={{ fontSize:'8px', fontWeight:700, color:sc, flexShrink:0,
                background:`${sc}18`, borderRadius:'8px', padding:'1px 5px',
                border:`1px solid ${sc}40`, whiteSpace:'nowrap' }}>
                {momentumState}
              </span>
            )
          })()}
        </div>

        {valueKey === 'pct' ? (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color:col, fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${Math.min(Math.abs(pct)/25*100,100)}%`, height:'100%', background:col, borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', lineHeight:1.7 }}>
              <span style={{ display:'flex', justifyContent:'space-between' }}>
                <span>出来高 {fmt(item.volume)}</span>
                {rankTag(volRank, '#378ADD')}
              </span>
              <span style={{ display:'flex', justifyContent:'space-between' }}>
                <span>売買代金 {fmt(item.trade_value)}</span>
                {rankTag(tvRank, '#ff8c42')}
              </span>
            </div>
            {/* テーマ詳細ボタン + 関連コラムリンク */}
            {onNavigate && (
              <button
                onClick={e => { e.stopPropagation(); onNavigate('テーマ別詳細', item.theme) }}
                style={{ marginTop:'6px', width:'100%', padding:'4px 0',
                  background:'rgba(170,119,255,0.08)', border:'1px solid rgba(170,119,255,0.25)',
                  borderRadius:'4px', color:'#aa77ff', cursor:'pointer',
                  fontSize:'10px', fontFamily:'var(--font)', fontWeight:600,
                }}>
                📊 テーマ詳細を確認
              </button>
            )}
            {THEME_ARTICLE_MAP[item.theme] && onNavigate && (
              <button
                onClick={e => { e.stopPropagation(); onNavigate('コラム・解説', THEME_ARTICLE_MAP[item.theme]) }}
                style={{ marginTop:'4px', width:'100%', padding:'4px 0',
                  background:'rgba(74,158,255,0.07)', border:'1px solid rgba(74,158,255,0.2)',
                  borderRadius:'4px', color:'var(--accent)', cursor:'pointer',
                  fontSize:'10px', fontFamily:'var(--font)', fontWeight:600,
                }}>
                📖 関連コラムを読む
              </button>
            )}
          </>
        ) : valueKey === 'volume' ? (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#378ADD', fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {fmt(val)}
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${barW}%`, height:'100%', background:'#378ADD', borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', fontFamily:'var(--mono)', lineHeight:1.7 }}>
              <span style={{ display:'flex', justifyContent:'space-between', color:col }}>
                <span>騰落率 {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</span>
                {rankTag(pctRank, col)}
              </span>
              <span style={{ display:'flex', justifyContent:'space-between', color:'#ff8c42' }}>
                <span>売買代金 {fmt(item.trade_value)}</span>
                {rankTag(tvRank, '#ff8c42')}
              </span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#ff8c42', fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {fmt(val)}
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${barW}%`, height:'100%', background:'#ff8c42', borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', fontFamily:'var(--mono)', lineHeight:1.7 }}>
              <span style={{ display:'flex', justifyContent:'space-between', color:col }}>
                <span>騰落率 {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</span>
                {rankTag(pctRank, col)}
              </span>
              <span style={{ display:'flex', justifyContent:'space-between', color:'#378ADD' }}>
                <span>出来高 {fmt(item.volume)}</span>
                {rankTag(volRank, '#378ADD')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


function ThemeCardGrid({ items, pctColor, valueKey='pct', barColor, pctRankMap, volRankMap, tvRankMap, onNavigate, momentumMap }) {
  // ② デフォルト4件、TOP10・全件ボタン横並び
  const [displayMode, setDisplayMode] = useState('top4') // 'top4' | 'top10' | 'all'
  const DEFAULT_LIMIT = 4
  const TOP10_LIMIT = 10
  const displayed = displayMode === 'all' ? items
    : displayMode === 'top10' ? items.slice(0, TOP10_LIMIT)
    : items.slice(0, DEFAULT_LIMIT)
  const maxVal = valueKey === 'pct' ? 0 : Math.max(...displayed.map(t => Math.abs(t[valueKey] || 0)), 0)
  return (
    <>
    <div className="theme-card-grid">
      {displayed.map((item, idx) => (
        <ThemeCard key={item.theme} item={item} rank={idx+1}
          maxAbs={maxVal} valueKey={valueKey}
          barColor={barColor} pctColor={pctColor}
          pctRank={pctRankMap?.get(item.theme)}
          volRank={volRankMap?.get(item.theme)}
          tvRank={tvRankMap?.get(item.theme)}
          onNavigate={onNavigate}
          momentumState={momentumMap?.get(item.theme)?.state}
          momentumPct={momentumMap?.get(item.theme)?.pct} />
      ))}
    </div>
    {/* ② 展開ボタン横並び */}
    <div style={{ display:'flex', gap:'8px', marginTop:'12px', marginBottom:'4px', justifyContent:'center', flexWrap:'wrap' }}>
      {displayMode !== 'top4' && (
        <button onClick={() => setDisplayMode('top4')} style={{
          padding:'7px 18px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
          cursor:'pointer', fontFamily:'var(--font)',
          background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'var(--text3)',
        }}>▲ トップ4に戻す</button>
      )}
      {displayMode !== 'top10' && items.length > DEFAULT_LIMIT && (
        <button onClick={() => setDisplayMode('top10')} style={{
          padding:'7px 18px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
          cursor:'pointer', fontFamily:'var(--font)',
          background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.3)', color:'var(--accent)',
        }}>トップ10を表示</button>
      )}
      {displayMode !== 'all' && items.length > TOP10_LIMIT && (
        <button onClick={() => setDisplayMode('all')} style={{
          padding:'7px 18px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
          cursor:'pointer', fontFamily:'var(--font)',
          background:'rgba(255,140,66,0.08)', border:'1px solid rgba(255,140,66,0.3)', color:'#ff8c42',
        }}>全{items.length}テーマを表示</button>
      )}
    </div>
    </>
  )
}


// ── 月次テーマ別折れ線グラフ ─────────────────────────────────
const MONTHLY_COLORS = [
  '#4a9eff', '#ff5370', '#00c48c', '#ffd166',
  '#aa77ff', '#ff8c42', '#4ecdc4', '#ff6b6b',
]

// 月次チャートの共通テーマ選択UI（騰落率・出来高・売買代金で共有）
function MonthlyThemePicker({ allThemes, selected, setSelected }) {
  const [showPicker, setShowPicker] = React.useState(false)
  const toggleTheme = t =>
    setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  return (
    <div style={{ marginBottom:'12px' }}>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', alignItems:'center', marginBottom:'8px' }}>
        {selected.map((t, si) => {
          const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
          return (
            <span key={t} style={{
              display:'inline-flex', alignItems:'center', gap:'4px',
              padding:'3px 8px 3px 10px', borderRadius:'20px', fontSize:'11px',
              fontWeight:600, border:'1.5px solid ' + col,
              background: col + '22', color: col,
            }}>
              {t}
              <button onClick={() => toggleTheme(t)}
                style={{ background:'none', border:'none', cursor:'pointer',
                  color: col, fontSize:'12px', lineHeight:1, padding:'0 2px',
                  fontFamily:'var(--font)' }}>
                ×
              </button>
            </span>
          )
        })}
        <button onClick={() => setShowPicker(s => !s)}
          style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px',
            cursor:'pointer', fontFamily:'var(--font)', fontWeight:600,
            border:'1px dashed var(--accent)', background:'rgba(74,158,255,0.06)',
            color:'var(--accent)', transition:'all 0.15s' }}>
          {showPicker ? '▲ 閉じる' : '＋ テーマを追加する'}
        </button>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])}
            style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'10px',
              cursor:'pointer', fontFamily:'var(--font)',
              border:'1px solid var(--border)', background:'transparent',
              color:'var(--text3)', transition:'all 0.15s' }}>
            すべて解除
          </button>
        )}
      </div>
      {showPicker && (
        <div style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'10px', padding:'12px 14px', marginBottom:'8px',
          maxHeight:'200px', overflowY:'auto',
        }}>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'8px',
            letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:600 }}>
            テーマを選択（複数可）
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
            {allThemes.map((t) => {
              const isOn = selected.includes(t)
              const col  = isOn ? MONTHLY_COLORS[selected.indexOf(t) % MONTHLY_COLORS.length] : null
              return (
                <button key={t} onClick={() => toggleTheme(t)}
                  style={{
                    padding:'3px 9px', borderRadius:'16px', fontSize:'10px',
                    cursor:'pointer', fontFamily:'var(--font)', fontWeight: isOn ? 600 : 400,
                    border: isOn ? '1.5px solid ' + col : '1px solid var(--border)',
                    background: isOn ? col + '22' : 'transparent',
                    color: isOn ? col : 'var(--text3)',
                    transition:'all 0.12s',
                  }}>
                  {isOn ? '✓ ' : ''}{t}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function MonthlyLineChart({ data, months, onNavigate }) {
  const allThemes = data ? Object.keys(data) : []
  const [selected, setSelected] = React.useState(() => allThemes.slice(0, 3))

  React.useEffect(() => {
    if (allThemes.length > 0 && selected.length === 0) {
      setSelected(allThemes.slice(0, 3))
    }
  }, [allThemes.length])

  if (!data || !months || months.length === 0) {
    return <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>データを読み込み中...</div>
  }

  const dispMonths = months.slice(-12)
  const allVals = selected.flatMap(t =>
    dispMonths.map(m => data[t]?.[m]).filter(v => v != null)
  )
  const rawMin = allVals.length ? Math.min(...allVals) : -10
  const rawMax = allVals.length ? Math.max(...allVals) : 10
  const yStep  = 5
  const yMin   = Math.floor(rawMin / yStep) * yStep - yStep
  const yMax   = Math.ceil(rawMax / yStep)  * yStep + yStep

  const W = 900, H = 400
  const PL = 52, PR = 20, PT = 32, PB = 56
  const GW = W - PL - PR
  const GH = H - PT - PB

  const xS = i => PL + (i / Math.max(dispMonths.length - 1, 1)) * GW
  const yS = v => PT + GH - ((v - yMin) / (yMax - yMin || 1)) * GH

  const yTicks = []
  for (let y = yMin; y <= yMax; y += yStep) yTicks.push(y)

  const shortMonth = m => {
    const parts = m.split('/')
    return parts.length >= 2 ? parts[0].slice(2) + '/' + parts[1] : m
  }

  return (
    <div>
      <MonthlyThemePicker allThemes={allThemes} selected={selected} setSelected={setSelected} />
      {selected.length > 0 ? (
        <div style={{ width:'100%', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <svg viewBox={'0 0 ' + W + ' ' + H}
            style={{ width:'100%', minWidth:'480px', display:'block',
              background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
            {yTicks.includes(0) && (
              <line x1={PL} y1={yS(0)} x2={PL+GW} y2={yS(0)}
                stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="4,3" />
            )}
            {yTicks.map(y => (
              <g key={y}>
                <line x1={PL} y1={yS(y)} x2={PL+GW} y2={yS(y)}
                  stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                <text x={PL-6} y={yS(y)+4} textAnchor="end"
                  fontSize="10" fill="rgba(255,255,255,0.45)">
                  {y >= 0 ? '+' : ''}{y}%
                </text>
              </g>
            ))}
            {dispMonths.map((m, i) => (
              <text key={m} x={xS(i)} y={PT+GH+18} textAnchor="middle"
                fontSize="9" fill="rgba(255,255,255,0.4)">
                {shortMonth(m)}
              </text>
            ))}
            {selected.map((t, si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              const pts = dispMonths
                .map((m, i) => ({ i, v: data[t]?.[m] }))
                .filter(p => p.v != null)
              if (pts.length < 2) return null
              const pathD = pts.map((p, pi) =>
                (pi === 0 ? 'M' : 'L') + xS(p.i).toFixed(1) + ',' + yS(p.v).toFixed(1)
              ).join(' ')
              return (
                <g key={t}>
                  <path d={pathD} fill="none" stroke={col} strokeWidth="2"
                    strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
                  {pts.map(p => (
                    <circle key={p.i} cx={xS(p.i)} cy={yS(p.v)} r="3"
                      fill={col} stroke="var(--bg2)" strokeWidth="1.5" />
                  ))}
                </g>
              )
            })}
            {selected.map((t, si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              return (
                <g key={t}>
                  <rect x={PL + si * 160} y={PT - 22} width="12" height="12" rx="2" fill={col} opacity="0.85" />
                  <text x={PL + si * 160 + 16} y={PT - 12} fontSize="10" fill="rgba(255,255,255,0.75)">
                    {t.length > 12 ? t.slice(0, 12) + '…' : t}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)',
          background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
          上のボタンでテーマを選択してください
        </div>
      )}
    </div>
  )
}

// 出来高月次グラフ本体
function MonthlyVolChart({ volTrendData, allThemeNames, months }) {
  const [selected, setSelected] = React.useState(() => (allThemeNames || []).slice(0, 3))
  React.useEffect(() => {
    if (allThemeNames?.length > 0 && selected.length === 0) setSelected(allThemeNames.slice(0, 3))
  }, [allThemeNames?.length])

  if (!volTrendData || !allThemeNames) return null

  // 週次→月次変換
  const monthlyByTheme = {}
  allThemeNames.forEach(t => {
    const d = volTrendData[`vol_trend_${t}`]
    if (!d?.dates) return
    const monthly = {}
    d.dates.forEach((date, i) => {
      const m = date.slice(0, 7).replace('-', '/')
      if (!monthly[m]) monthly[m] = 0
      monthly[m] += (d.volumes?.[i] || 0)
    })
    monthlyByTheme[t] = monthly
  })

  const dispMonths = months.slice(-12)
  const allVals = selected.flatMap(t => dispMonths.map(m => monthlyByTheme[t]?.[m] || 0))
  const maxV = Math.max(...allVals, 1)

  const W=900, H=340, PL=80, PR=20, PT=32, PB=48
  const GW=W-PL-PR, GH=H-PT-PB
  const xS = i => PL + (i / Math.max(dispMonths.length-1, 1)) * GW

  // ③ 5億刻みでY軸目盛りを生成
  const OKU5 = 5e8  // 5億
  const volStep = maxV < 5e9 ? OKU5 : maxV < 5e10 ? 5e9 : 5e10
  const nVolTicks = Math.ceil(maxV / volStep)
  const volAxisMax = nVolTicks * volStep
  const yTicks = Array.from({ length: nVolTicks + 1 }, (_, i) => i * volStep)
  const yS = v => PT + GH - (v / volAxisMax) * GH

  const fmtL = v => {
    if (!v) return '0'
    if (Math.abs(v) >= 1e12) return (v/1e12).toFixed(v%1e12===0?0:1)+'兆'
    if (Math.abs(v) >= 1e8) return (v/1e8).toFixed(v%1e8===0?0:1)+'億'
    if (Math.abs(v) >= 1e4) return (v/1e4).toFixed(0)+'万'
    return v.toLocaleString()
  }
  const shortMonth = m => { const p=m.split('/'); return p.length>=2?p[0].slice(2)+'/'+p[1]:m }

  return (
    <div>
      <MonthlyThemePicker allThemes={allThemeNames} selected={selected} setSelected={setSelected} />
      {selected.length > 0 ? (
        <div style={{ width:'100%', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', minWidth:'480px', display:'block',
            background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
            {/* グリッド */}
            {[0.25,0.5,0.75,1].map(r => (
              <line key={r} x1={PL} y1={yS(maxV*r)} x2={PL+GW} y2={yS(maxV*r)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
            ))}
            {/* Y軸ラベル */}
            {yTicks.map((v,i) => (
              <text key={i} x={PL-6} y={yS(v)+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.45)">
                {fmtL(v)}
              </text>
            ))}
            {/* X軸ラベル */}
            {dispMonths.map((m,i) => (
              <text key={m} x={xS(i)} y={PT+GH+18} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                {shortMonth(m)}
              </text>
            ))}
            {/* 折れ線 */}
            {selected.map((t,si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              const pts = dispMonths.map((m,i) => ({ i, v: monthlyByTheme[t]?.[m] || 0 }))
              const pathD = pts.map((p,pi) => (pi===0?'M':'L') + xS(p.i).toFixed(1)+','+yS(p.v).toFixed(1)).join(' ')
              return (
                <g key={t}>
                  <path d={pathD} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" opacity="0.9"/>
                  {pts.map(p => <circle key={p.i} cx={xS(p.i)} cy={yS(p.v)} r="3" fill={col} stroke="var(--bg2)" strokeWidth="1.5"/>)}
                </g>
              )
            })}
            {/* 凡例 */}
            {selected.map((t,si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              return (
                <g key={t}>
                  <rect x={PL+si*160} y={PT-22} width="12" height="12" rx="2" fill={col} opacity="0.85"/>
                  <text x={PL+si*160+16} y={PT-12} fontSize="10" fill="rgba(255,255,255,0.75)">
                    {t.length > 12 ? t.slice(0,12)+'…' : t}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)',
          background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
          上のボタンでテーマを選択してください
        </div>
      )}
    </div>
  )
}

// 売買代金月次グラフ本体
function MonthlyTVChart({ volTrendData, allThemeNames, months }) {
  const [selected, setSelected] = React.useState(() => (allThemeNames || []).slice(0, 3))
  React.useEffect(() => {
    if (allThemeNames?.length > 0 && selected.length === 0) setSelected(allThemeNames.slice(0, 3))
  }, [allThemeNames?.length])

  if (!volTrendData || !allThemeNames) return null

  const tvByTheme = {}
  allThemeNames.forEach(t => {
    const d = volTrendData[`vol_trend_${t}`]
    if (!d?.dates) return
    const monthly = {}
    d.dates.forEach((date, i) => {
      const m = date.slice(0, 7).replace('-', '/')
      if (!monthly[m]) monthly[m] = 0
      monthly[m] += (d.trade_values?.[i] || 0)
    })
    tvByTheme[t] = monthly
  })

  const dispMonths = months.slice(-12)
  const allVals = selected.flatMap(t => dispMonths.map(m => tvByTheme[t]?.[m] || 0))
  const maxV = Math.max(...allVals, 1)

  const W=900, H=340, PL=80, PR=20, PT=32, PB=48
  const GW=W-PL-PR, GH=H-PT-PB
  const xS = i => PL + (i / Math.max(dispMonths.length-1, 1)) * GW

  // ③ 5兆刻みでY軸目盛りを生成（売買代金は大きい値）
  const CHO5 = 5e12  // 5兆
  const tvStep = maxV < 5e11 ? 5e10 : maxV < 5e12 ? 5e11 : CHO5
  const nTvTicks = Math.ceil(maxV / tvStep)
  const tvAxisMax = nTvTicks * tvStep
  const yTicks = Array.from({ length: nTvTicks + 1 }, (_, i) => i * tvStep)
  const yS = v => PT + GH - (v / tvAxisMax) * GH

  const fmtL = v => {
    if (!v) return '0'
    if (Math.abs(v) >= 1e12) return (v/1e12).toFixed(v%1e12===0?0:1)+'兆'
    if (Math.abs(v) >= 1e8) return (v/1e8).toFixed(v%1e8===0?0:1)+'億'
    if (Math.abs(v) >= 1e4) return (v/1e4).toFixed(0)+'万'
    return v.toLocaleString()
  }
  const shortMonth = m => { const p=m.split('/'); return p.length>=2?p[0].slice(2)+'/'+p[1]:m }

  return (
    <div>
      <MonthlyThemePicker allThemes={allThemeNames} selected={selected} setSelected={setSelected} />
      {selected.length > 0 ? (
        <div style={{ width:'100%', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', minWidth:'480px', display:'block',
            background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
            {[0.25,0.5,0.75,1].map(r => (
              <line key={r} x1={PL} y1={yS(maxV*r)} x2={PL+GW} y2={yS(maxV*r)}
                stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
            ))}
            {yTicks.map((v,i) => (
              <text key={i} x={PL-6} y={yS(v)+4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.45)">
                {fmtL(v)}
              </text>
            ))}
            {dispMonths.map((m,i) => (
              <text key={m} x={xS(i)} y={PT+GH+18} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">
                {shortMonth(m)}
              </text>
            ))}
            {selected.map((t,si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              const pts = dispMonths.map((m,i) => ({ i, v: tvByTheme[t]?.[m] || 0 }))
              const pathD = pts.map((p,pi) => (pi===0?'M':'L') + xS(p.i).toFixed(1)+','+yS(p.v).toFixed(1)).join(' ')
              return (
                <g key={t}>
                  <path d={pathD} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" opacity="0.9"/>
                  {pts.map(p => <circle key={p.i} cx={xS(p.i)} cy={yS(p.v)} r="3" fill={col} stroke="var(--bg2)" strokeWidth="1.5"/>)}
                </g>
              )
            })}
            {selected.map((t,si) => {
              const col = MONTHLY_COLORS[si % MONTHLY_COLORS.length]
              return (
                <g key={t}>
                  <rect x={PL+si*160} y={PT-22} width="12" height="12" rx="2" fill={col} opacity="0.85"/>
                  <text x={PL+si*160+16} y={PT-12} fontSize="10" fill="rgba(255,255,255,0.75)">
                    {t.length > 12 ? t.slice(0,12)+'…' : t}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)',
          background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
          上のボタンでテーマを選択してください
        </div>
      )}
    </div>
  )
}

export default function ThemeList({ onNavigate }) {
  const [period, setPeriod] = useState('1mo')
  const { data: monthlyRaw } = useMonthlyHeatmap()
  const monthlyData = monthlyRaw?.data || null
  const months = monthlyRaw?.months || []
  // ③ vol_trendデータをmarket.jsonから取得
  const [volTrendData, setVolTrendData] = React.useState({})
  React.useEffect(() => {
    fetch('/data/market.json?t=' + Date.now())
      .then(r => r.json())
      .then(mj => {
        const vtKeys = Object.keys(mj).filter(k => k.startsWith('vol_trend_'))
        const vtData = {}
        vtKeys.forEach(k => { vtData[k] = mj[k] })
        setVolTrendData(vtData)
      })
      .catch(() => {})
  }, [])
  const { themes: customThemes } = useCustomThemes()
  const { data: macroRaw } = useMacro('1mo')  // 指数参照は1mo固定
  const { data: momentumData } = useMomentum(period)
  const macro = macroRaw?.data || {}
  // 1321・1306の直近騰落率を取得
  const get1321pct = () => {
    const arr = macro['国内主要株(1321)'] || []
    if (arr.length < 2) return null
    const last = arr[arr.length - 1]
    return last?.pct ?? null
  }
  const get1306pct = () => {
    const arr = macro['TOPIX連動型上場投信(1306)'] || []
    if (arr.length < 2) return null
    const last = arr[arr.length - 1]
    return last?.pct ?? null
  }
  const pct1321 = get1321pct()
  const pct1306 = get1306pct()
  const { data, loading, refreshing, updatedAt, refresh } = useThemes(period)
  const lastUpdate = updatedAt ? new Date(updatedAt.replace(/\//g, '-').replace(' JST','')) : null
  const error = null

  const themes   = data?.themes  ?? []
  const summary  = data?.summary ?? {}
  const byPctAsc = [...themes].sort((a, b) => a.pct - b.pct)
  const byVol    = [...themes].sort((a, b) => (b.volume || 0) - (a.volume || 0))
  const byTV     = [...themes].sort((a, b) => (b.trade_value || 0) - (a.trade_value || 0))
  // ランクマップ（テーマ名→順位）
  const pctRankMap = new Map(themes.map((t, i) => [t.theme, i + 1]))
  const volRankMap = new Map(byVol.map((t, i) => [t.theme, i + 1]))
  const tvRankMap  = new Map(byTV.map((t, i) => [t.theme, i + 1]))
  const momentum1mo  = momentumData?.data || []
  const momentumMap  = new Map(momentum1mo.map(d => [d.theme, d]))
  const themeComment = genThemeComment(themes, summary, period, momentum1mo)
  // 上昇・下落それぞれでフィルタリング（マイナスを上昇TOP5に混在させない）
  const risingTop5  = themes.filter(t => t.pct > 0).slice(0, 5)
  const fallingTop5 = byPctAsc.filter(t => t.pct < 0).slice(0, 5)
  const periodLabel = PERIODS.find(p => p.value === period)?.label ?? period

  const pctColor    = v => v >= 0 ? '#ff5370' : '#4caf82'
  const blueColor   = () => '#5b9cf6'
  const orangeColor = () => '#ff8c42'

  return (
    <div>
      {/* 固定ヘッダー */}
      <div className="page-header-sticky">
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>テーマ一覧</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <RefreshIndicator refreshing={refreshing} lastUpdate={lastUpdate} onRefresh={refresh} />
        </div>
      </div>

      <div style={{ padding: '20px 24px 48px', maxWidth: '1280px', margin: '0 auto', overflowX: 'hidden' }}>

        {/* 説明文 */}
        <div style={{ background:'rgba(74,158,255,0.05)', border:'1px solid rgba(74,158,255,0.15)',
          borderRadius:'8px', padding:'12px 16px', marginBottom:'12px', fontSize:'13px', color:'var(--text)', lineHeight:1.9 }}>
          日本株の主要67テーマについて、騰落率・出来高・売買代金を一覧で比較できます。
          期間（1週間〜1年）を切り替えることで、短期的な資金流入テーマと長期トレンドの両方を確認できます。
          <br />
          <span style={{ fontSize:'11px', color:'var(--text2)' }}>
            💡 活用ポイント：「上昇TOP5」に連続して登場するテーマは強いトレンドの可能性があります。
            出来高・売買代金も同時に確認し、資金の本気度を判断しましょう。
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
          日本株テーマ別の騰落率・資金動向 — {periodLabel}
        </p>

        {loading ? <Loading /> : error ? (
          <div style={{ background: 'rgba(255,83,112,0.1)', border: '1px solid rgba(255,83,112,0.2)',
            borderRadius: '8px', padding: '16px 20px', color: 'var(--red)', fontSize: '13px' }}>
            {error}
          </div>
        ) : (
          <>
            {/* KPIカード */}
            <div className="responsive-grid-6" style={{ marginBottom: '8px' }}>
              <KpiCard delay={0.05}
                label="上昇テーマ"
                value={<span>{summary.rise}<span style={{ fontSize: '16px', color: 'var(--text2)', fontWeight: 400 }}> / {summary.total}</span></span>}
                valueColor="var(--red)"
                arrow={summary.rise > summary.fall ? 'up' : summary.rise < summary.fall ? 'down' : null}
                sub={`下落: ${summary.fall}テーマ`} />
              <KpiCard delay={0.1}
                label="全テーマ平均騰落率"
                value={`${summary.avg >= 0 ? '+' : ''}${summary.avg?.toFixed(2)}%`}
                valueColor={summary.avg >= 0 ? 'var(--red)' : 'var(--green)'}
                arrow={summary.avg >= 0 ? 'up' : 'down'}
                sub={`期間: ${periodLabel}`} />
              <KpiCard delay={0.15}
                label="資金流入 TOP"
                value={<span style={{ fontSize: '17px', color: 'var(--red)', fontWeight: 700 }}>{summary.top?.theme}</span>}
                arrow="up"
                sub={<span style={{ color: 'var(--red)', fontWeight: 600 }}>+{summary.top?.pct?.toFixed(1)}%</span>} />
              <KpiCard delay={0.2}
                label="資金流出 TOP"
                value={<span style={{ fontSize: '17px', color: 'var(--green)', fontWeight: 700 }}>{summary.bot?.theme}</span>}
                arrow="down"
                sub={<span style={{ color: 'var(--green)', fontWeight: 600 }}>{summary.bot?.pct?.toFixed(1)}%</span>} />
              <KpiCard delay={0.25}
                label="日経225連動型(1321)"
                value={pct1321 !== null ? `${pct1321 >= 0 ? '+' : ''}${pct1321.toFixed(2)}%` : '-'}
                valueColor={pct1321 === null ? 'var(--text3)' : pct1321 >= 0 ? 'var(--red)' : 'var(--green)'}
                arrow={pct1321 === null ? null : pct1321 >= 0 ? 'up' : 'down'}
                sub={`期間: ${periodLabel}`} />
              <KpiCard delay={0.3}
                label="TOPIX連動型(1306)"
                value={pct1306 !== null ? `${pct1306 >= 0 ? '+' : ''}${pct1306.toFixed(2)}%` : '-'}
                valueColor={pct1306 === null ? 'var(--text3)' : pct1306 >= 0 ? 'var(--red)' : 'var(--green)'}
                arrow={pct1306 === null ? null : pct1306 >= 0 ? 'up' : 'down'}
                sub="参照: 1ヶ月" />
            </div>

            {/* 騰落ランキング TOP5 */}
            <SectionHead title="📈 騰落ランキング TOP5" />
            <Top5Pair
              top5={risingTop5} bot5={fallingTop5}
              topTitle={`▲ 上昇テーマ TOP5（${themes.filter(t=>t.pct>0).length}テーマ上昇）`}
              botTitle={`▼ 下落テーマ TOP5（${themes.filter(t=>t.pct<0).length}テーマ下落）`}
              topColorFn={pctColor} botColorFn={pctColor}
              valueKey="pct" />

            {/* 出来高・売買代金 TOP5 */}
            <SectionHead title="💹 出来高・売買代金 TOP5" />
            <Top5Pair
              top5={byVol.slice(0, 5)} bot5={byTV.slice(0, 5)}
              topTitle="🔢 出来高 TOP5" botTitle="💴 売買代金 TOP5"
              topColorFn={blueColor} botColorFn={orangeColor}
              valueKey="volume" bot5ValueKey="trade_value" formatFn={true} />

            {/* ③ 自動コメント */}
            <AutoComment lines={themeComment} />
            {onNavigate && (
              <div style={{ textAlign:'right', marginTop:'-4px', marginBottom:'8px' }}>
                <button onClick={() => onNavigate('週次レポート')}
                  style={{ padding:'5px 14px', borderRadius:'6px', fontSize:'11px',
                    background:'rgba(255,140,66,0.1)', border:'1px solid rgba(255,140,66,0.3)',
                    color:'#ff8c42', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                  📰 詳細な週次レポートを読む →
                </button>
              </div>
            )}

            {/* 全テーマ 騰落率ランキング（カードグリッド） */}
            <SectionHead title="📊 全テーマ 騰落率ランキング" />
            <ThemeCardGrid items={themes} pctColor={pctColor} valueKey="pct" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} onNavigate={onNavigate} momentumMap={momentumMap} />


            {/* マイカスタムテーマ（騰落率つき） */}
            {customThemes.length > 0 && (
              <>
                <SectionHead title="🎨 マイカスタムテーマ" />
                <CustomThemeRows themes={customThemes} period={period} pctColor={pctColor} />
              </>
            )}

            {/* 全テーマ 出来高ランキング（カードグリッド） */}
            <SectionHead title="🔢 全テーマ 出来高ランキング" />
            <ThemeCardGrid items={byVol} pctColor={pctColor} valueKey="volume" barColor="#378ADD" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} onNavigate={onNavigate} />

            {/* 全テーマ 売買代金ランキング（カードグリッド） */}
            <SectionHead title="💴 全テーマ 売買代金ランキング" />
            <ThemeCardGrid items={byTV} pctColor={pctColor} valueKey="trade_value" barColor="#ff8c42" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} onNavigate={onNavigate} />

            {/* 📅 月次グラフ ＋ ヒートマップ: PC版2×2グリッド */}
            {Object.keys(volTrendData).length > 0 && months.length > 0 && (() => {
              const allThemeNames = Object.keys(volTrendData).map(k => k.replace('vol_trend_', ''))
              return (
                <div className="monthly-chart-grid">
                  {/* 月次騰落率 */}
                  <div className="monthly-chart-cell">
                    <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>📅 月次テーマ別騰落率推移</div>
                    <ExpandableChart title="月次テーマ別騰落率推移">
                      <MonthlyLineChart data={monthlyData} months={months} onNavigate={onNavigate} />
                    </ExpandableChart>
                  </div>
                  {/* 月次出来高 */}
                  <div className="monthly-chart-cell">
                    <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>📊 月次テーマ別出来高推移</div>
                    <ExpandableChart title="月次テーマ別出来高推移">
                      <MonthlyVolChart volTrendData={volTrendData} allThemeNames={allThemeNames} months={months} />
                    </ExpandableChart>
                  </div>
                  {/* 月次売買代金 */}
                  <div className="monthly-chart-cell">
                    <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>💴 月次テーマ別売買代金推移</div>
                    <ExpandableChart title="月次テーマ別売買代金推移">
                      <MonthlyTVChart volTrendData={volTrendData} allThemeNames={allThemeNames} months={months} />
                    </ExpandableChart>
                  </div>
                  {/* テーマヒートマップ（BubbleScatter） */}
                  <div className="monthly-chart-cell">
                    <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>🔥 テーマヒートマップ</div>
                    <ExpandableChart title="テーマヒートマップ（資金フロー）" showZoneDesc>
                      <BubbleScatterMini onNavigate={onNavigate} />
                    </ExpandableChart>
                  </div>
                </div>
              )
            })()}

          </>
        )}
      </div>

      <style>{`
        /* ② 月次グラフ2×2グリッド */
        .monthly-chart-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 8px;
        }
        @media (min-width: 900px) {
          .monthly-chart-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .monthly-chart-cell {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
        }
        /* ExpandableChart: PC=縮小+ボタン下部 / スマホ=通常 */
        .expandable-chart-preview {
          display: none;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          max-height: 200px;
        }
        .expandable-chart-preview > div {
          transform: scale(0.52);
          transform-origin: top left;
          width: 192%;
          pointer-events: none;
        }
        .expandable-chart-btn {
          display: none;
          width: 100%;
          margin-top: 6px;
          padding: 6px 0;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: rgba(74,158,255,0.06);
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font);
          transition: background 0.15s;
        }
        .expandable-chart-btn:hover { background: rgba(74,158,255,0.14); }
        .expandable-chart-mobile { display: block; }
        @media (min-width: 769px) {
          .expandable-chart-preview { display: block; }
          .expandable-chart-btn    { display: block; }
          .expandable-chart-mobile { display: none; }
        }
        .responsive-grid-6 { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
        @media (max-width:1024px) { .responsive-grid-6 { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .responsive-grid-6 { grid-template-columns:repeat(2,1fr); } }
        .theme-card-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .momentum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
        @media (max-width:1024px) { .momentum-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .momentum-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:1024px) { .theme-card-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .theme-card-grid { grid-template-columns:repeat(2,1fr); } }
        .top5-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 640px) {
          .top5-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <style>{`
        @media (max-width: 640px) {
          .mobile-hidden-card { display: none !important; }
        }
      `}</style>
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none',
}
