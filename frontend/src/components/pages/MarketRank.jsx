import { useState, useEffect } from 'react'
import AddToThemeModal from '../AddToThemeModal'
import { useSegmentDetail, useMarketRankList, useMacro } from '../../hooks/useMarketData'

const PERIODS = [
  {label:'1日',value:'1d'},{ label:'1週間',value:'5d'},{label:'1ヶ月',value:'1mo'},
  { label:'3ヶ月',value:'3mo'},{label:'6ヶ月',value:'6mo'},{label:'1年',value:'1y'},
]

function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n/1e12).toFixed(1)+'兆'
  if (n >= 1e8)  return (n/1e8).toFixed(1)+'億'
  if (n >= 1e4)  return (n/1e4).toFixed(1)+'万'
  return n.toLocaleString()
}

function Loading({ msg='データ取得中...' }) {
  return (
    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px', fontSize:'12px' }}>{msg}</div>
    </div>
  )
}

function Top5Bar({ items, title, colorFn, emptyMsg }) {
  if (!items||!items.length) return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px',
      padding:'12px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{title}</div>
      {emptyMsg || 'データなし'}
    </div>
  )
  const maxAbs = Math.max(...items.map(s=>Math.abs(s.pct)), 0.01)
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

// スパークライン（銘柄の6ヶ月騰落率推移）
function Sparkline({ data }) {
  if (!data || data.length < 3) return null
  const W = 64, H = 24
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const color = data[data.length - 1] >= data[0] ? '#ff5370' : '#00c48c'
  const zeroY = Math.max(0, Math.min(H, H - ((0 - min) / range) * H))
  return (
    <svg width='100%' height='100%' viewBox={`0 0 ${W} ${H}`} preserveAspectRatio='none' style={{ display:'block' }}>
      <line x1={0} y1={zeroY} x2={W} y2={zeroY}
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
      <polyline
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`${color}18`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function StockTable({ stocks, onAddToTheme }) {
  if (!stocks||!stocks.length) return null
  const headers = ['株価','騰落率','時価総額','寄与度%','出来高増減','出来高','出来高順位','売買代金','売買代金順位','追加']
  return (
    <div className="sticky-table">
      <table style={{ borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font)', width:'100%' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            <th style={{ ...thStyle, textAlign:'center', width:'32px', minWidth:'32px', maxWidth:'32px', padding:'8px 4px', background:'var(--bg3)', position:'sticky', left:0, zIndex:3 }}>順</th>
            <th style={{ ...thStyle, textAlign:'left', minWidth:'120px', background:'var(--bg3)', position:'sticky', left:'32px', zIndex:3 }}>銘柄名</th>
            {headers.map(h => (
              <th key={h} style={{ ...thStyle, minWidth: h==='株価'||h==='騰落率'?'70px':'80px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s,i)=>{
            const pColor = s.pct>=0?'var(--red)':'var(--green)'
            const cColor = s.contribution>=0?'var(--red)':'var(--green)'
            return (
              <tr key={s.ticker} style={{ borderBottom:'1px solid var(--border)' }}>
                <td style={{ ...tdC, fontFamily:'var(--mono)', fontSize:'11px', fontWeight:700, color:'var(--text3)',
                  background: i%2===0?'var(--bg2)':'var(--bg3)', position:'sticky', left:0, zIndex:2, width:'32px', minWidth:'32px', maxWidth:'32px', padding:'8px 4px' }}>
                  {i+1}
                </td>
                <td style={{ ...tdL, fontWeight:600, color:'var(--text)', minWidth:'120px', background: i%2===0?'var(--bg2)':'var(--bg3)', position:'sticky', left:'32px', zIndex:2 }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', marginBottom:'1px' }}>{s.ticker.replace('.T','')}</div>
<div style={{ display:'flex', alignItems:'center', gap:'6px', width:'100%', minWidth:0 }}>
  <span style={{ flex:1, fontSize:'13px', overflow:'hidden',
    textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0 }}>{s.name}</span>
  <span style={{ display:'inline-block', width:'64px', minWidth:'64px',
    height:'22px', flexShrink:0, verticalAlign:'middle' }}>
    <Sparkline data={s.spark} />
  </span>
</div>
                </td>
                <td style={tdR}><span style={{ fontFamily:'var(--mono)', color:'var(--text2)' }}>¥{s.price?.toLocaleString()}</span></td>
                <td style={{ ...tdR, color:pColor, fontWeight:700, fontFamily:'var(--mono)' }}>{s.pct>=0?'+':''}{s.pct?.toFixed(1)}%</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{s.market_cap > 0 ? formatLarge(s.market_cap) : '-'}</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)',
  color: (s.contribution ?? 0) >= 0.5 ? '#ff5370' :
         (s.contribution ?? 0) >= 0.1 ? '#ff8c42' :
         (s.contribution ?? 0) > -0.1 ? 'var(--text2)' : '#4a9eff' }}
  title="寄与度: この銘柄がセグメント騰落率に貢献した割合（%）">
  {s.contribution != null ? (s.contribution >= 0 ? '+' : '') + s.contribution.toFixed(2) + '%' : '-'}
</td>
                <td style={{ ...tdR, color:s.volume_chg>=0?'var(--red)':'var(--green)', fontFamily:'var(--mono)' }}>{s.volume_chg>=0?'+':''}{s.volume_chg?.toFixed(1)}%</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.volume)}</td>
                <td style={tdC}>{s.vol_rank}位</td>
                <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.trade_value)}</td>
                <td style={tdC}>{s.tv_rank}位</td>
                <td style={tdC}>
                  <button
                    onClick={() => onAddToTheme && onAddToTheme({ ticker: s.ticker, name: s.name, price: s.price })}
                    title="カスタムテーマに追加"
                    style={{ background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.25)',
                      borderRadius:'4px', color:'var(--accent)', cursor:'pointer', fontSize:'13px',
                      padding:'3px 7px', fontFamily:'var(--font)', lineHeight:1 }}>
                    ＋
                  </button>
                </td>
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
const tdL = { padding:'8px 12px', textAlign:'left' }


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

function MacroCard({ name, data, color }) {
  if (!data||!data.length) return null
  const last  = data[data.length-1]
  const pctColor = last.pct>=0 ? 'var(--red)' : 'var(--green)'
  const lineColor = color || pctColor
  const vals  = data.map(d=>d.pct)
  const min   = Math.min(...vals), max = Math.max(...vals)
  const W=120, H=44
  // 各指標独立スケールでスパークライン描画
  const pts = vals.map((v,i)=>`${2+(i/Math.max(vals.length-1,1))*(W-4)},${2+(1-((v-min)/(max-min||0.01)))*(H-4)}`).join(' ')
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px',
      padding:'10px 12px', display:'flex', flexDirection:'column', gap:'6px', minWidth:0 }}>
      <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, letterSpacing:'0.05em',
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'8px' }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:'16px', fontWeight:700, color:pctColor, lineHeight:1 }}>
          {last.pct>=0?'+':''}{last.pct.toFixed(1)}%
        </div>
        <div style={{ width:`${W}px`, height:`${H}px`, flexShrink:0, overflow:'hidden', maxWidth:'45%' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display:'block', overflow:'hidden' }}>
            <polyline points={pts} fill="none" stroke={lineColor} strokeWidth="1.8"
              strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </div>
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

  const W = 800, H = 160, PL = 46, PR = 16, PT = 12, PB = 28

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
            {fmtDate(date)}
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

// 横軸日付フォーマット：日付の重複を避けるためユニーク表示
function fmtDate(dateStr) {
  if (!dateStr) return ''
  // 'YYYY-MM-DD' または 'YYYY/MM/DD' 形式に対応
  const sep = dateStr.includes('-') ? '-' : '/'
  const parts = dateStr.split(sep)
  if (parts.length < 3) return dateStr
  const y = parts[0].slice(2) // '26'
  const m = parts[1]          // '03'
  const d = parts[2]          // '28'
  return `${y}.${m}/${d}`
}


export default function MarketRank() {
  const [modalStock,  setModalStock]  = useState(null)
  const [period,      setPeriod]      = useState('1mo')
  const [summary,     setSummary]     = useState(null)
  const [groups,      setGroups]      = useState({})
  const [activeGroup, setActiveGroup] = useState('国内主要株')
  const [activeSeg,   setActiveSeg]   = useState(null)
  const [detail,      setDetail]      = useState(null)

  const { data: marketData, loading: loadingS } = useMarketRankList(period)
  const { data: macroRaw } = useMacro(period)
  const macro = macroRaw?.data || {}

  useEffect(()=>{
    if (!marketData) return
    setSummary(marketData.data); setGroups(marketData.groups||{})
    const firstSeg = (marketData.groups?.['国内主要株'] || Object.values(marketData.groups||{})[0] || [])[0]
    if (firstSeg && !activeSeg) setActiveSeg(firstSeg)
  },[marketData])

  const { data: segDetailRaw, loading: loadingD } = useSegmentDetail(activeSeg, period)
  useEffect(()=>{
    if (!segDetailRaw) return
    if (Array.isArray(segDetailRaw)) {
      setDetail({ stocks: segDetailRaw, avg: segDetailRaw.length ? segDetailRaw.reduce((s,x)=>s+x.pct,0)/segDetailRaw.length : 0 })
    } else {
      setDetail(segDetailRaw)
    }
  },[segDetailRaw])

  const pctColor = (v) => v>=0 ? 'var(--red)' : 'var(--green)'
  const rawStocks = detail?.stocks ?? []
  const volSorted = [...rawStocks].sort((a,b) => (b.volume||0)-(a.volume||0))
  const tvSorted  = [...rawStocks].sort((a,b) => (b.trade_value||0)-(a.trade_value||0))
  const volRankMap = new Map(volSorted.map((s,i) => [s.ticker, i+1]))
  const tvRankMap  = new Map(tvSorted.map((s,i) => [s.ticker, i+1]))
  // 時価総額グループは市価総額降順、それ以外は騰落率降順
  const isTVGroup = activeGroup === '国内全般' && activeSeg?.includes('時価総額')
  const mappedStocks = rawStocks.map(s => ({
    ...s,
    vol_rank: volRankMap.get(s.ticker) ?? s.vol_rank,
    tv_rank:  tvRankMap.get(s.ticker)  ?? s.tv_rank,
  }))
  const stocks = isTVGroup
    ? [...mappedStocks].sort((a,b) => (b.market_cap||0) - (a.market_cap||0))
    : [...mappedStocks].sort((a,b) => b.pct - a.pct)
  const detailAvg = detail?.avg ?? 0
  const top5      = stocks.filter(s => s.pct > 0).slice(0, 5)
  const bot5      = [...stocks].sort((a,b) => a.pct - b.pct).filter(s => s.pct < 0).slice(0, 5)

  return (
    <div>
      {modalStock && (
        <AddToThemeModal stock={modalStock} onClose={() => setModalStock(null)} />
      )}

      <div className="page-header-sticky">
        <h1 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap' }}>市場別詳細</h1>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div style={{ padding:'20px 32px 48px', maxWidth:'1280px', margin:'0 auto' }}>
        <div style={{ background:'rgba(6,214,160,0.05)', border:'1px solid rgba(6,214,160,0.15)',
          borderRadius:'8px', padding:'12px 16px', marginBottom:'16px', fontSize:'12px',
          color:'var(--text)', lineHeight:1.8 }}>
          <span style={{ fontWeight:700, color:'#06d6a0' }}>📋 このページについて：</span>
          日経225採用銘柄・時価総額上位150銘柄・市場区分（プライム・スタンダード・グロース）ごとに、
          構成銘柄の騰落率ランキングと詳細データを確認できます。
          上部のタブで「国内主要株」「国内全般」「市場区分」を切り替え、各グループ内のセグメントを選択してください。
          <br/>
          <span style={{ fontSize:'11px', color:'var(--text3)' }}>
            💡 活用ポイント：「テクノロジー」セグメントが強い時はテーマ一覧の「半導体」「AI・クラウド」も
            チェックしましょう。セグメントとテーマの同時確認で資金の流れをより精度高く把握できます。
          </span>
        </div>

        <div style={{ display:'flex', gap:'4px', borderBottom:'1px solid var(--border)', marginBottom:'0' }}>
          {Object.keys(groups).map(g=>(
            <button key={g} onClick={()=>{ setActiveGroup(g); setActiveSeg(groups[g][0]) }} style={{
              padding:'8px 16px', fontSize:'13px', cursor:'pointer', border:'none', background:'transparent',
              color: activeGroup===g ? 'var(--text)' : 'var(--text3)',
              fontWeight: activeGroup===g ? 700 : 400,
              fontFamily:'var(--font)',
              borderBottom: activeGroup===g ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom:'-1px', transition:'all 0.15s',
            }}>{g}</button>
          ))}
        </div>

        {loadingS ? <Loading /> : (
          <div>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', padding:'12px 0', borderBottom:'1px solid var(--border)', marginBottom:'20px' }}>
              {(groups[activeGroup]||[]).map(seg=>{
                const avg = summary?.[seg]?.pct
                const shortName = seg.split('｜')[1] || seg.split('（')[0]
                return (
                  <button key={seg} onClick={()=>setActiveSeg(seg)} style={{
                    padding:'6px 14px', borderRadius:'6px', fontSize:'12px', cursor:'pointer',
                    border:`1px solid ${activeSeg===seg?'var(--accent)':'var(--border)'}`,
                    background: activeSeg===seg?'rgba(91,156,246,0.12)':'transparent',
                    color: activeSeg===seg?'var(--accent)':'var(--text2)',
                    fontFamily:'var(--font)', transition:'all 0.15s', whiteSpace:'nowrap',
                  }}>
                    {shortName}
                    {avg!=null && (
                      <span style={{ marginLeft:'6px', fontSize:'11px', fontFamily:'var(--mono)',
                        color:avg>=0?'var(--red)':'var(--green)', fontWeight:700 }}>
                        {avg>=0?'+':''}{avg.toFixed(1)}%
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {loadingD ? (
              <Loading msg="個別株データ取得中..." />
            ) : detail ? (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'16px', fontWeight:700, color:'var(--text)' }}>{activeSeg ? (activeSeg.split('｜')[1] || activeSeg) : ''}</span>
                  <span style={{ fontSize:'15px', fontFamily:'var(--mono)', fontWeight:700,
                    color:detailAvg>=0?'var(--red)':'var(--green)' }}>
                    平均 {detailAvg>=0?'+':''}{detailAvg.toFixed(1)}%
                  </span>
                  <span style={{ fontSize:'12px', color:'var(--text3)' }}>{stocks.length}銘柄</span>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' }} className="top5g">
                  <Top5Bar items={top5} title={`▲ 上昇TOP5（${stocks.filter(s=>s.pct>0).length}銘柄上昇）`} colorFn={pctColor} emptyMsg="上昇銘柄なし"/>
                  <Top5Bar items={bot5} title={`▼ 下落TOP5（${stocks.filter(s=>s.pct<0).length}銘柄下落）`} colorFn={pctColor} emptyMsg="下落銘柄なし"/>
                </div>

                <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'8px' }}>
                  構成銘柄一覧 <span style={{ color:'var(--text3)', fontSize:'10px', fontWeight:400 }}>← 横にスワイプで詳細確認</span>
                </div>
                <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                  <StockTable stocks={stocks} onAddToTheme={setModalStock} />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* マーケット指標（コンパクト） */}
      {Object.keys(macro).length > 0 && (
        <div style={{ marginTop:'32px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
          <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>
            📈 マーケット指標（{PERIODS.find(p=>p.value===period)?.label}）
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'8px', marginBottom:'4px' }}>
            {Object.entries(macro).map(([name, data]) => {
              if (!data?.length) return null
              const last = data[data.length-1]
              const pct = last?.pct ?? 0
              const col = pct >= 0 ? 'var(--red)' : 'var(--green)'
              const shortName = name.replace(/\(.*?\)/g,'').trim()
              return (
                <div key={name} style={{
                  background:'var(--bg2)', border:'1px solid var(--border)',
                  borderRadius:'8px', padding:'8px 12px',
                }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'2px',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {shortName}
                  </div>
                  <div style={{ fontSize:'15px', fontWeight:700, fontFamily:'var(--mono)', color:col }}>
                    {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                  </div>
                </div>
              )
            })}
          </div>
          <MacroLineChart macro={macro} />
        </div>
      )}
      <style>{`@media (max-width:640px){.top5g{grid-template-columns:1fr !important;}}`}</style>
    </div>
  )
}

const selStyle = {
  background:'var(--bg3)', color:'var(--text)',
  border:'1px solid var(--border)', borderRadius:'6px',
  fontFamily:'var(--font)', fontSize:'13px',
  padding:'6px 12px', cursor:'pointer', outline:'none',
}
