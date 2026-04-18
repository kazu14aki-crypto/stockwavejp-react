import { useState, useEffect } from 'react'
import AddToThemeModal from '../AddToThemeModal'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  {label:'1日',value:'1d'},{ label:'1週間',value:'5d'},{label:'1ヶ月',value:'1mo'},
  { label:'3ヶ月',value:'3mo'},{label:'6ヶ月',value:'6mo'},{label:'1年',value:'1y'},
]

const COLORS = [
  '#ff4560','#ff8c42','#ffd166','#06d6a0','#4a9eff',
  '#aa77ff','#ff77aa','#44dddd',
]

const STATE_COLORS = {
  '🔥加速':  '#ff4560',
  '↗転換↑': '#ff8c42',
  '→横ばい': '#4a6080',
  '↘転換↓': '#4a9eff',
  '❄️失速':  '#00c48c',
}

function formatLarge(n) {
  if (!n) return '0'
  if (n>=1e12) return (n/1e12).toFixed(1)+'兆'
  if (n>=1e8)  return (n/1e8).toFixed(1)+'億'
  if (n>=1e4)  return (n/1e4).toFixed(1)+'万'
  return n.toLocaleString()
}

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px', fontSize:'12px' }}>データ取得中...</div>
    </div>
  )
}

// ── niceScale：キリの良いY軸目盛り ──
function niceScale(yMin, yMax, count = 5) {
  const range = yMax - yMin || 1
  const rawStep = range / count
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)))
  const candidates = [1, 2, 2.5, 5, 10]
  const step = mag * (candidates.find(c => c * mag >= rawStep) || 1)
  const nMin = Math.floor(yMin / step) * step
  const nMax = Math.ceil(yMax / step) * step
  const ticks = []
  for (let v = nMin; v <= nMax + step * 0.01; v += step) {
    ticks.push(Math.round(v * 1000) / 1000)
  }
  return { ticks, nMin: nMin - step * 0.2, nMax: nMax + step * 0.2 }
}

// ── TOP5横棒グラフ（小型・見やすい）──
function Top5Bar({ items, title, colorFn, emptyMsg }) {
  if (!items || !items.length) return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'8px', padding:'20px', textAlign:'center',
      color:'var(--text3)', fontSize:'12px' }}>
      <div style={{ fontSize:'11px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{title}</div>
      {emptyMsg || 'データなし'}
    </div>
  )
  const maxAbs = Math.max(...items.map(s => Math.abs(s.pct)), 0.01)

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

// ── 複数折れ線グラフ（Compare移植）──
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
      {/* ゼロライン */}
      <line x1={0} y1={zeroY} x2={W} y2={zeroY}
        stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="2,2" />
      {/* 塗りつぶし */}
      <polyline
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`${color}18`} stroke="none" />
      {/* 折れ線 */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function VolTvChart({ selTheme }) {
  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selTheme) return
    setLoading(true); setData(null)
    ;(async () => {
      // 1. market.json から取得
      try {
        const mj = await fetch('/data/market.json?t=' + Date.now()).then(r => r.json())
        const d = mj[`vol_trend_${selTheme}`]
        if (d && d.dates && d.dates.length > 0) { setData(d); setLoading(false); return }
      } catch {}
      // 2. Render API にフォールバック
      try {
        const d = await fetch(`${API}/api/vol-trend/${encodeURIComponent(selTheme)}`).then(r => r.json())
        if (d && d.dates && d.dates.length > 0) { setData(d); setLoading(false); return }
      } catch {}
      setLoading(false)
    })()
  }, [selTheme])

  if (loading) return <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'13px' }}>データ読み込み中...</div>
  if (!data || !data.dates || data.dates.length === 0)
    return <div style={{ textAlign:'center', padding:'32px', color:'var(--text3)', fontSize:'12px' }}>推移データがありません（GitHub Actionsの次回実行後に表示されます）</div>

  const { dates, volumes, trade_values } = data
  const W = 900, H = 300, PL = 72, PR = 72, PT = 24, PB = 40
  const GW = W - PL - PR, GH = H - PT - PB
  const n = dates.length

  const maxVol = Math.max(...volumes, 1)
  const maxTV  = Math.max(...trade_values, 1)
  const minVol = Math.min(...volumes, 0)
  const minTV  = Math.min(...trade_values, 0)

  const xPos = (i) => PL + (i / Math.max(n - 1, 1)) * GW
  const yVol = (v) => PT + GH - ((v - minVol) / (maxVol - minVol || 1)) * GH
  const yTV  = (v) => PT + GH - ((v - minTV)  / (maxTV  - minTV  || 1)) * GH

  // 折れ線（出来高）
  const linePts = volumes.map((v, i) => `${xPos(i)},${yVol(v)}`).join(' ')

  // 目盛り表示
  const fmtLarge = (v) => {
    if (v === 0) return '0'
    if (Math.abs(v) >= 1e12) return (v / 1e12).toFixed(1) + '兆'
    if (Math.abs(v) >= 1e8)  return (v / 1e8).toFixed(1)  + '億'
    if (Math.abs(v) >= 1e4)  return (v / 1e4).toFixed(1)  + '万'
    return v.toLocaleString()
  }

  const volTicks = [0, 0.25, 0.5, 0.75, 1].map(r => minVol + r * (maxVol - minVol))
  const tvTicks  = [0, 0.25, 0.5, 0.75, 1].map(r => minTV  + r * (maxTV  - minTV))

  // X軸ラベル（月初のみ）
  const xLabels = []
  let lastMonth = null
  dates.forEach((d, i) => {
    const m = d.slice(0, 7)
    if (m !== lastMonth) { xLabels.push({ i, label: d.slice(5, 7) + '月' }); lastMonth = m }
  })

  // 縦棒の幅
  const barW = Math.max(2, GW / n * 0.6)

  return (
    <div style={{ width:'100%', overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display:'block', minWidth:'320px', fontFamily:'var(--font)' }}>
        {/* グリッド */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <line key={r} x1={PL} y1={PT + GH - r * GH} x2={PL + GW} y2={PT + GH - r * GH}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}

        {/* 縦棒（売買代金・右軸） */}
        {trade_values.map((v, i) => {
          const bh = yTV(minTV) - yTV(v)
          if (bh <= 0) return null
          return (
            <rect key={i}
              x={xPos(i) - barW / 2} y={yTV(v)}
              width={barW} height={bh}
              fill="rgba(255,140,66,0.45)" rx="1" />
          )
        })}

        {/* 折れ線（出来高・左軸） */}
        <polyline points={linePts} fill="none" stroke="#4a9eff" strokeWidth="1.8" strokeLinejoin="round" />
        {volumes.map((v, i) => (
          <circle key={i} cx={xPos(i)} cy={yVol(v)} r="2" fill="#4a9eff" />
        ))}

        {/* X軸ベース */}
        <line x1={PL} y1={PT + GH} x2={PL + GW} y2={PT + GH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* X軸ラベル */}
        {xLabels.map(({ i, label }) => (
          <text key={i} x={xPos(i)} y={H - 4} textAnchor="middle"
            fontSize="9" fill="rgba(255,255,255,0.35)">{label}</text>
        ))}

        {/* 左軸ラベル（出来高） */}
        <text x={4} y={PT - 4} fontSize="9" fill="#4a9eff">出来高</text>
        {volTicks.map((v, i) => (
          <text key={i} x={PL - 4} y={yVol(v) + 3} textAnchor="end"
            fontSize="8" fill="rgba(74,158,255,0.7)">{fmtLarge(v)}</text>
        ))}

        {/* 右軸ラベル（売買代金） */}
        <text x={W - 4} y={PT - 4} fontSize="9" fill="#ff8c42" textAnchor="end">売買代金</text>
        {tvTicks.map((v, i) => (
          <text key={i} x={PL + GW + 4} y={yTV(v) + 3} textAnchor="start"
            fontSize="8" fill="rgba(255,140,66,0.7)">{fmtLarge(v)}</text>
        ))}

        {/* 凡例 */}
        <circle cx={PL + 10} cy={PT - 5} r="4" fill="#4a9eff" />
        <text x={PL + 18} y={PT - 1} fontSize="9" fill="#4a9eff">出来高（折れ線・左軸）</text>
        <rect x={PL + 140} y={PT - 10} width="10" height="8" fill="rgba(255,140,66,0.6)" rx="1" />
        <text x={PL + 154} y={PT - 1} fontSize="9" fill="#ff8c42">売買代金（棒グラフ・右軸）</text>
      </svg>
    </div>
  )
}


// ── 注目銘柄ピックアップ ──────────────────────────────
function PickupStocks({ stocks, period }) {
  if (!stocks || stocks.length === 0) return null

  const fmtL = (v) => {
    if (!v || v === 0) return '-'
    if (v >= 1e12) return (v / 1e12).toFixed(1) + '兆'
    if (v >= 1e8)  return (v / 1e8).toFixed(1) + '億'
    if (v >= 1e4)  return (v / 1e4).toFixed(1) + '万'
    return v.toLocaleString()
  }

  const scored = stocks.map(s => {
    const pct    = s.pct ?? 0
    const volChg = s.volume_chg ?? 0
    const tv     = s.trade_value ?? 0

    const pctScore = Math.min(40, Math.max(0, pct * 2))
    const volScore = Math.min(25, Math.max(0, volChg * 0.5))
    const tvScore  = tv > 0 ? Math.min(15, Math.log10(tv) * 1.5) : 0

    let sparkScore = 0
    let sparkAccel = 0
    if (s.spark && s.spark.length >= 6) {
      const sp = s.spark, n = sp.length
      const h  = Math.floor(n / 2)
      const avgFirst = sp.slice(0, h).reduce((a, b) => a + b, 0) / h
      const avgLast  = sp.slice(h).reduce((a, b) => a + b, 0) / (n - h)
      sparkAccel = avgLast - avgFirst
      sparkScore = Math.min(20, Math.max(0, sparkAccel * 3))
    }

    const totalScore = pctScore + volScore + sparkScore + tvScore

    const buildReason = () => {
      const parts = []
      if (pct >= 10)       parts.push('この期間の騰落率は+' + pct.toFixed(1) + '%と大幅上昇しており、テーマ全体を牽引する動きを見せています')
      else if (pct >= 5)   parts.push('この期間の騰落率は+' + pct.toFixed(1) + '%と堅調で、テーマ内の上位上昇銘柄です')
      else if (pct >= 2)   parts.push('+' + pct.toFixed(1) + '%の上昇でテーマ平均を上回っています')
      else if (pct > 0)    parts.push('+' + pct.toFixed(1) + '%と小幅ながらプラスを維持しています')

      if (volChg >= 50)      parts.push('出来高が+' + volChg.toFixed(0) + '%と急増しており、機関投資家・外国人投資家の大口資金の流入が強く示唆されます')
      else if (volChg >= 20) parts.push('出来高が+' + volChg.toFixed(0) + '%増加しており、市場参加者の注目が高まっています')

      if (sparkAccel > 3)    parts.push('直近の価格推移が後半にかけて加速（後半平均+' + sparkAccel.toFixed(1) + '%）しており、モメンタムが強まっています')
      else if (sparkAccel > 1) parts.push('価格推移が後半にかけてやや改善（後半+' + sparkAccel.toFixed(1) + '%）しています')

      if (tv >= 5e9)       parts.push('売買代金は' + fmtL(tv) + 'と非常に大きく、流動性が高い主力銘柄として積極的に売買されています')
      else if (tv >= 1e9)  parts.push('売買代金は' + fmtL(tv) + 'と十分な規模があり、積極的な売買が行われています')

      if (parts.length === 0) parts.push('騰落率・出来高・価格推移・売買代金の総合評価で、このテーマ内での注目度が高い銘柄として選定されました')
      return parts.join('。') + '。'
    }

    return { ...s, _score: totalScore, _reason: buildReason() }
  })
  .filter(s => (s.pct ?? 0) > 0 && s._score > 3)
  .sort((a, b) => b._score - a._score)
  .slice(0, 3)

  if (scored.length === 0) return null

  const medals      = ['🥇', '🥈', '🥉']
  const medalColors = ['#ffd166', 'rgba(192,192,192,0.7)', 'rgba(205,127,50,0.7)']

  return (
    <div style={{ marginBottom:'20px' }}>
      {/* PickupStocksヘッダー: スマホで1行目タイトル/2行目説明 */}
      <div style={{ marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
          <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap' }}>
            🔎 注目銘柄ピックアップ
          </span>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
        </div>
        <span style={{ fontSize:'10px', color:'var(--text3)', display:'block', paddingLeft:'2px' }}>
          騰落率・出来高・勢い・売買代金を総合スコアで機械的に集計した参考情報です
        </span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}
        className="pickup-grid">
        {scored.map((s, i) => {
          const upColor   = (s.pct ?? 0) >= 0 ? '#ff5370' : '#00c48c'
          const scoreNum  = Math.min(100, Math.round(s._score))
          const scoreColor = scoreNum >= 60 ? '#ff5370' : scoreNum >= 35 ? '#ff8c42' : '#ffd166'
          return (
            <div key={s.ticker} style={{
              background:'var(--bg2)', borderRadius:'8px', padding:'12px 14px',
              border:'1px solid var(--border)',
              borderTop:'3px solid ' + medalColors[i],
              display:'flex', flexDirection:'column', gap:'6px',
            }}>
              {/* 順位 + ティッカー + 騰落率 */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ fontSize:'14px' }}>{medals[i]}</span>
                <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)' }}>
                  {s.ticker.replace('.T', '')}
                </span>
                <span style={{ marginLeft:'auto', fontSize:'13px', fontWeight:700,
                  color:upColor, fontFamily:'var(--mono)' }}>
                  {(s.pct ?? 0) >= 0 ? '+' : ''}{s.pct?.toFixed(1)}%
                </span>
              </div>
              {/* 銘柄名（必ず表示） */}
              <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)',
                lineHeight:1.4 }}>
                {s.name || s.ticker.replace('.T', '')}
              </div>
              {/* スパークライン */}
              {s.spark && s.spark.length >= 3 && (
                <span style={{ display:'inline-block', width:'100%', height:'24px' }}>
                  <Sparkline data={s.spark} />
                </span>
              )}
              {/* 株価 + 売買代金 */}
              <div style={{ display:'flex', gap:'10px', fontSize:'10px',
                fontFamily:'var(--mono)', color:'var(--text3)' }}>
                {'¥' + (s.price?.toLocaleString() || '-')}
                {(s.trade_value ?? 0) > 0 && (
                  <span>{'売買代金 ' + fmtL(s.trade_value)}</span>
                )}
              </div>
              {/* 注目度スコア */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ fontSize:'9px', color:'var(--text3)', fontWeight:600,
                  textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>
                  注目度
                </span>
                <span style={{ fontSize:'15px', fontWeight:800, fontFamily:'var(--mono)',
                  color:scoreColor, lineHeight:1 }}>
                  {scoreNum}
                </span>
                <span style={{ fontSize:'9px', color:'var(--text3)', marginRight:'4px' }}>/100</span>
                <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,0.06)',
                  borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ width:scoreNum + '%', height:'100%',
                    background:scoreColor, borderRadius:'2px' }} />
                </div>
              </div>
              {/* 根拠文章 */}
              <p style={{ fontSize:'10px', color:'var(--text2)', lineHeight:1.75, margin:0 }}>
                {s._reason}
              </p>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop:'8px', padding:'7px 12px',
        background:'rgba(255,255,255,0.02)', borderRadius:'5px',
        border:'1px solid rgba(255,255,255,0.05)', fontSize:'10px',
        color:'var(--text3)', lineHeight:1.7 }}>
        ⚠️ 上記は騰落率・出来高・価格推移・売買代金を独自スコアで機械的に集計したものです。
        特定銘柄の購入・売却を推奨するものではなく、
        <strong style={{ color:'var(--text2)' }}>投資の最終判断はご自身の責任でお願いします</strong>。
      </div>
    </div>
  )
}


// ── 銘柄テーブル ──
function StockTable({ stocks }) {
  if (!stocks || !stocks.length) return null
  const [modalStock, setModalStock] = useState(null)
  const headers = ['ミニチャート','株価','騰落率','時価総額','寄与度%','出来高増減','出来高','出来高順位','売買代金','売買代金順位']
  return (
    <>
      {modalStock && <AddToThemeModal stock={modalStock} onClose={() => setModalStock(null)} />}
      <div className="sticky-table">
        <table style={{ borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font)', width:'100%' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              <th className="sticky-col1" style={{ ...thStyle, textAlign:'center', width:'32px', minWidth:'32px', maxWidth:'32px', padding:'8px 4px', background:'var(--bg3)', position:'sticky', left:0, zIndex:3 }}>順</th>
              <th className="sticky-col2" style={{ ...thStyle, textAlign:'left', minWidth:'120px', background:'var(--bg3)', position:'sticky', left:'32px', zIndex:3 }}>銘柄名</th>
              {headers.map(h => (
                <th key={h} style={{ ...thStyle, minWidth: h === 'ミニチャート' ? '72px' : '80px',
                  width: h === 'ミニチャート' ? '72px' : undefined }}>{h}</th>
              ))}
              <th style={{ ...thStyle, minWidth:'60px', background:'var(--bg3)' }}>追加</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => {
              const pColor = s.pct >= 0 ? 'var(--red)' : 'var(--green)'
              const cColor = s.contribution >= 0 ? 'var(--red)' : 'var(--green)'
              return (
                <tr key={s.ticker} style={{
                  borderBottom:'1px solid rgba(255,255,255,0.04)',
                  background: i%2===0?'transparent':'rgba(255,255,255,0.02)',
                }}>
                  <td style={{ ...tdC, fontFamily:'var(--mono)', fontSize:'11px', fontWeight:700, color:'var(--text3)',
                    background: i%2===0?'var(--bg2)':'var(--bg3)', position:'sticky', left:0, zIndex:2, minWidth:'32px', width:'32px', maxWidth:'32px', padding:'8px 4px' }}>
                    {i+1}
                  </td>
                  <td style={{ ...tdL, fontWeight:600, color:'var(--text)',
                    background: i%2===0?'var(--bg2)':'var(--bg3)', position:'sticky',
                    left:'32px', zIndex:2, minWidth:'160px', maxWidth:'220px' }}>
                    <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', marginBottom:'1px' }}>{s.ticker.replace('.T','')}</div>
                    <div style={{ display:'flex', alignItems:'center' }}>
                      <span style={{ fontSize:'13px', overflow:'hidden',
                        textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ ...tdC, padding:'4px 8px', minWidth:'72px', width:'72px' }}>
                    <span style={{ display:'inline-block', width:'64px', height:'22px', verticalAlign:'middle' }}>
                      <Sparkline data={s.spark} />
                    </span>
                  </td>
                  <td style={tdR}><span style={{ fontFamily:'var(--mono)', color:'var(--text2)' }}>¥{s.price?.toLocaleString()}</span></td>
                  <td style={{ ...tdR, color:pColor, fontWeight:700, fontFamily:'var(--mono)' }}>{s.pct>=0?'+':''}{s.pct?.toFixed(1)}%</td>
                  <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{s.market_cap > 0 ? formatLarge(s.market_cap) : '-'}</td>
                  <td style={{ ...tdR, fontFamily:'var(--mono)', color:
                    (s.contribution ?? 0) >= 70 ? '#ff5370' :
                    (s.contribution ?? 0) >= 40 ? '#ff8c42' :
                    (s.contribution ?? 0) >= 0  ? 'var(--text2)' : '#4a9eff' }}
                    title="寄与度: この銘柄がテーマ騰落率に貢献した割合（%）">
                    {s.contribution != null ? (s.contribution >= 0 ? '+' : '') + s.contribution.toFixed(2) + '%' : '-'}
                  </td>
                  <td style={{ ...tdR, color:s.volume_chg>=0?'var(--red)':'var(--green)', fontFamily:'var(--mono)' }}>{s.volume_chg>=0?'+':''}{s.volume_chg?.toFixed(1)}%</td>
                  <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.volume)}</td>
                  <td style={tdC}>{s.vol_rank}位</td>
                  <td style={{ ...tdR, fontFamily:'var(--mono)', color:'var(--text2)' }}>{formatLarge(s.trade_value)}</td>
                  <td style={tdC}>{s.tv_rank}位</td>
                  <td style={tdC}>
                    <button onClick={() => setModalStock({ ticker: s.ticker, name: s.name, price: s.price })}
                      title="カスタムテーマに追加"
                      style={{ background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.25)',
                        borderRadius:'4px', color:'var(--accent)', cursor:'pointer', fontSize:'13px',
                        padding:'3px 7px', fontFamily:'var(--font)', lineHeight:1,
                        transition:'all 0.12s' }}>＋</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

const thStyle = { padding:'6px 8px', textAlign:'right', fontSize:'10px', fontWeight:600, letterSpacing:'0.06em', color:'var(--text3)', textTransform:'uppercase', whiteSpace:'nowrap', background:'var(--bg3)' }
const tdC = { padding:'8px 10px', textAlign:'center', whiteSpace:'nowrap', color:'var(--text2)' }
const tdR = { padding:'8px 10px', textAlign:'right', whiteSpace:'nowrap' }
const tdL = { padding:'8px 12px', textAlign:'left', minWidth:'120px' }

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

export default function ThemeDetail({ onNavigate, initialTheme }) {
  const [period,      setPeriod]      = useState('1mo')
  const [themeNames,  setThemeNames]  = useState([])
  const [selTheme,    setSelTheme]    = useState(initialTheme || '')
  const [detail,      setDetail]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [momentum,    setMomentum]    = useState(null)

  // テーマ別詳細比較（Compare移植）
  const [selThemes,    setSelThemes]    = useState([])
  const [themeTrends,  setThemeTrends]  = useState({})
  const [macroData,    setMacroData]    = useState({})
  // マクロは全指標をデフォルト表示（選択不可）
  const selMacro = Object.keys(macroData)
  const [loadingT,     setLoadingT]     = useState(false)
  const [loadingM,     setLoadingM]     = useState(false)
  const [comparePeriod, setComparePeriod] = useState('1y')

  // テーマ名一覧取得
  useEffect(() => {
    fetch('/data/market.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => {
        const names = json['theme_names']?.themes || json['themes_1mo']?.themes?.map(t => t.theme) || []
        if (names.length > 0) return { themes: names }
        throw new Error('no names')
      })
      .catch(() => fetch(`${API}/api/theme-names`).then(r => r.json()))
      .then(d => {
        setThemeNames(d.themes || [])
        if (d.themes?.length) {
          // initialThemeが指定されていればそれを優先、なければ先頭テーマ
          const preferred = initialTheme && d.themes.includes(initialTheme)
            ? initialTheme : d.themes[0]
          setSelTheme(s => s || preferred)
          setSelThemes(d.themes.slice(0, 3))
        }
      })
      .catch(() => {})
  }, [])

  // initialThemeが変わった場合にselThemeを更新
  useEffect(() => {
    if (initialTheme) setSelTheme(initialTheme)
  }, [initialTheme])

  // テーマ別詳細取得（market.json優先）
  useEffect(() => {
    if (!selTheme) return
    setLoading(true); setDetail(null); setMomentum(null)

    ;(async () => {
      try {
        // market.jsonから取得を試みる
        const mj = await fetch('/data/market.json?t=' + Date.now()).then(r => r.json())
        const detailKey = `theme_detail_${selTheme}_${period}`
        const momentumKey = `momentum_1mo`
        const detailData  = mj[detailKey]
        const momentumData = mj[momentumKey]?.data || []

        if (detailData) {
          setDetail(detailData)  // {stocks:[], avg:X, updated_at:...}
          const m = momentumData.find(d => d.theme === selTheme)
          setMomentum(m || null)
          setLoading(false)
          return
        }
      } catch {}

      // 1moでのフォールバック（1dがmarket.jsonにない場合）
      try {
        const mj2 = await fetch('/data/market.json?t=' + Date.now()).then(r => r.json())
        const fallbackKey = `theme_detail_${selTheme}_1mo`
        const fallbackData = mj2[fallbackKey]
        const momentumData2 = mj2['momentum_1mo']?.data || []
        if (fallbackData) {
          setDetail(fallbackData)
          const m2 = momentumData2.find(d => d.theme === selTheme)
          setMomentum(m2 || null)
          setLoading(false)
          return
        }
      } catch {}

      // 最終フォールバック: Render API
      try {
        const [detailRes, momentumRes] = await Promise.all([
          fetch(`${API}/api/theme-detail/${encodeURIComponent(selTheme)}?period=${period}`).then(r => r.json()),
          fetch(`${API}/api/momentum?period=1mo`).then(r => r.json()),
        ])
        setDetail(detailRes.data)
        const m = (momentumRes.data || []).find(d => d.theme === selTheme)
        setMomentum(m || null)
      } catch {}
      setLoading(false)
    })()
  }, [selTheme, period])

  // テーマ比較データ取得（market.json優先）
  useEffect(() => {
    if (!selThemes.length) return
    setLoadingT(true)
    ;(async () => {
      try {
        const mj = await fetch('/data/market.json?t=' + Date.now()).then(r => r.json())
        const key = `trends_${comparePeriod}`
        const trendsObj = mj[key]?.data || {}
        const found = selThemes.some(t => trendsObj[t])
        if (found) {
          const result = {}
          selThemes.forEach(t => { if (trendsObj[t]) result[t] = trendsObj[t] })
          setThemeTrends(result)
          setLoadingT(false)
          return
        }
      } catch {}
      try {
        const d = await fetch(`${API}/api/trends?themes=${encodeURIComponent(selThemes.join(','))}&period=${comparePeriod}`).then(r => r.json())
        setThemeTrends(d.trends || {})
      } catch {}
      setLoadingT(false)
    })()
  }, [selThemes, comparePeriod])

  // マクロデータ取得
  useEffect(() => {
    setLoadingM(true)
    // market.jsonのマクロを優先
    fetch('/data/market.json?t=' + Date.now())
      .then(r => r.json())
      .then(json => {
        const key = `macro_${comparePeriod}`
        if (json[key]?.data) { setMacroData(json[key].data); return }
        throw new Error('no macro')
      })
      .catch(() =>
        fetch(`${API}/api/macro?period=${comparePeriod}`)
          .then(r => r.json())
          .then(d => setMacroData(d.data || {}))
          .catch(() => {})
      )
      .finally(() => setLoadingM(false))
  }, [comparePeriod])

  const toggleTheme = (t) =>
    setSelThemes(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])
  const pctColor = (v) => v >= 0 ? 'var(--red)' : 'var(--green)'
  // vol_rank・tv_rankをフロントで再計算（market.jsonの値を上書き）
  const rawStocks = detail?.stocks ?? []
  const volSorted = [...rawStocks].sort((a,b) => (b.volume||0)-(a.volume||0))
  const tvSorted  = [...rawStocks].sort((a,b) => (b.trade_value||0)-(a.trade_value||0))
  const volRankMap = new Map(volSorted.map((s,i) => [s.ticker, i+1]))
  const tvRankMap  = new Map(tvSorted.map((s,i) => [s.ticker, i+1]))
  const stocks = rawStocks.map(s => ({
    ...s,
    vol_rank: volRankMap.get(s.ticker) ?? s.vol_rank,
    tv_rank:  tvRankMap.get(s.ticker) ?? s.tv_rank,
  }))
  // 上昇のみ・下落のみでフィルタリング
  const top5   = stocks.filter(s => s.pct > 0).slice(0, 5)
  const bot5   = [...stocks].sort((a, b) => a.pct - b.pct).filter(s => s.pct < 0).slice(0, 5)
  const macroNames = Object.keys(macroData)

  return (
    <div>
      {/* 固定ヘッダー */}
      <div className="page-header-sticky" style={{ flexWrap:'wrap', gap:'6px' }}>
        <h1 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', flexShrink:0 }}>テーマ別詳細</h1>
        <select value={selTheme} onChange={e => setSelTheme(e.target.value)} style={{ ...selStyle, maxWidth:'160px', flex:'1 1 120px' }}>
          {themeNames.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ ...selStyle, flexShrink:0 }}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="theme-detail-body" style={{ padding:'20px 32px 80px' }}>
        {loading ? <Loading /> : detail ? (
          <>
            {/* ── サマリーヘッダー（PC: 従来1行 / スマホ: 2行） ── */}
            <div className="theme-summary-card" style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'12px 16px', marginBottom:'16px' }}>
              {/* PC版: 1行横並び（従来デザイン） */}
              <div className="theme-summary-pc" style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>{selTheme}</span>
                <span style={{ fontSize:'16px', fontFamily:'var(--mono)', fontWeight:700,
                  color: (detail?.avg ?? 0) >= 0 ? 'var(--red)' : 'var(--green)' }}>
                  平均 {(detail?.avg ?? 0) >= 0 ? '+' : ''}{detail?.avg?.toFixed(1)}%
                </span>
                {momentum && (
                  <>
                    <div style={{ width:'1px', height:'20px', background:'var(--border)' }} />
                    <span style={{ fontSize:'12px', color:'var(--text3)' }}>先月比</span>
                    <span style={{ fontSize:'13px', fontFamily:'var(--mono)', fontWeight:600,
                      color: momentum.month_diff >= 0 ? 'var(--red)' : 'var(--green)' }}>
                      {momentum.month_diff >= 0 ? '+' : ''}{momentum.month_diff?.toFixed(1)}pt
                    </span>
                    <span style={{ fontSize:'12px', fontWeight:600, padding:'2px 10px', borderRadius:'20px',
                      color: STATE_COLORS[momentum.state] ?? 'var(--text2)',
                      background: (STATE_COLORS[momentum.state] ?? '#4a6080') + '18',
                      border: '1px solid ' + (STATE_COLORS[momentum.state] ?? 'var(--border)') + '40' }}>
                      {momentum.state}
                    </span>
                  </>
                )}
                <span style={{ fontSize:'11px', color:'var(--text3)', marginLeft:'auto' }}>
                  {stocks.length}銘柄構成 ／ {PERIODS.find(p => p.value === period)?.label}
                </span>
                {THEME_ARTICLE_MAP[selTheme] && onNavigate && (
                  <button onClick={() => onNavigate('コラム・解説', THEME_ARTICLE_MAP[selTheme])}
                    style={{ padding:'6px 14px', background:'rgba(74,158,255,0.08)',
                      border:'1px solid rgba(74,158,255,0.3)', borderRadius:'6px',
                      color:'var(--accent)', cursor:'pointer', fontSize:'11px',
                      fontFamily:'var(--font)', fontWeight:600, whiteSpace:'nowrap',
                      transition:'all 0.15s', flexShrink:0 }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(74,158,255,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(74,158,255,0.08)'}
                  >
                    📖 解説記事を読む
                  </button>
                )}
              </div>
              {/* スマホ版: 2行レイアウト */}
              <div className="theme-summary-mobile">
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                  {THEME_ARTICLE_MAP[selTheme] && onNavigate && (
                    <button onClick={() => onNavigate('コラム・解説', THEME_ARTICLE_MAP[selTheme])}
                      style={{ padding:'4px 10px', flexShrink:0,
                        background:'rgba(74,158,255,0.08)',
                        border:'1px solid rgba(74,158,255,0.3)', borderRadius:'5px',
                        color:'var(--accent)', cursor:'pointer', fontSize:'11px',
                        fontFamily:'var(--font)', fontWeight:600, whiteSpace:'nowrap' }}>
                      📖 解説記事
                    </button>
                  )}
                  <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text)',
                    flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {selTheme}
                  </span>
                  <span style={{ fontSize:'16px', fontFamily:'var(--mono)', fontWeight:700, flexShrink:0,
                    color: (detail?.avg ?? 0) >= 0 ? 'var(--red)' : 'var(--green)' }}>
                    {(detail?.avg ?? 0) >= 0 ? '+' : ''}{detail?.avg?.toFixed(1)}%
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                  {momentum && (
                    <>
                      <span style={{ fontSize:'10px', color:'var(--text3)' }}>先月比</span>
                      <span style={{ fontSize:'11px', fontFamily:'var(--mono)', fontWeight:600,
                        color: momentum.month_diff >= 0 ? 'var(--red)' : 'var(--green)' }}>
                        {momentum.month_diff >= 0 ? '+' : ''}{momentum.month_diff?.toFixed(1)}pt
                      </span>
                      <span style={{ fontSize:'10px', fontWeight:600, padding:'2px 7px', borderRadius:'20px',
                        color: STATE_COLORS[momentum.state] ?? 'var(--text2)',
                        background: (STATE_COLORS[momentum.state] ?? '#4a6080') + '18',
                        border: '1px solid ' + (STATE_COLORS[momentum.state] ?? 'var(--border)') + '40' }}>
                        {momentum.state}
                      </span>
                      <span style={{ width:'1px', height:'10px', background:'var(--border)' }} />
                    </>
                  )}
                  <span style={{ fontSize:'10px', color:'var(--text3)' }}>
                    {stocks.length}銘柄 ／ {PERIODS.find(p => p.value === period)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ── TOP5グラフ（小型）── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }} className="top5g">
              <Top5Bar items={top5} title={`▲ 上昇TOP5（${stocks.filter(s=>s.pct>0).length}銘柄上昇）`} colorFn={pctColor} emptyMsg="上昇銘柄なし"/>
              <Top5Bar items={bot5} title={`▼ 下落TOP5（${stocks.filter(s=>s.pct<0).length}銘柄下落）`} colorFn={pctColor} emptyMsg="下落銘柄なし"/>
            </div>

            {/* ── 注目銘柄ピックアップ ── */}
            <PickupStocks stocks={stocks} period={period} />

            {/* ── 構成銘柄テーブル ── */}
            <div style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)',
              textTransform:'uppercase', marginBottom:'8px' }}>
              構成銘柄一覧 <span style={{ color:'var(--text3)', fontSize:'10px', fontWeight:400 }}>← 横にスワイプで詳細確認</span>
            </div>
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', marginBottom:'32px' }}>
              <StockTable stocks={stocks}/>
            </div>

            {/* ── 出来高・売買代金 1年推移 ── */}
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:'20px', paddingBottom:'100px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px', flexWrap:'wrap' }}>
                <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>出来高・売買代金 推移（1年間・週次）</div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>テーマ構成銘柄の合計値</div>
              </div>
              <div className="voltv-chart-wrap" style={{ height:'200px' }}>
                <VolTvChart selTheme={selTheme} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ color:'var(--text3)', fontSize:'13px' }}>テーマを選択してください</div>
        )}
      </div>
      <style>{`
        /* PC版: PCヘッダー表示 / スマホヘッダー非表示 */
        .theme-summary-pc     { display: flex; }
        .theme-summary-mobile { display: none; }
        @media (max-width:640px) {
          .top5g { grid-template-columns: 1fr !important; }
          .pickup-grid { grid-template-columns: 1fr !important; }
          .voltv-chart-wrap { height: 360px !important; }
          .theme-detail-body { padding: 12px 12px 80px !important; }
          /* スマホ版: PCヘッダー非表示 / スマホヘッダー表示 */
          .theme-summary-pc     { display: none !important; }
          .theme-summary-mobile { display: block !important; }
        }
      `}</style>
    </div>
  )
}

const selStyle = {
  background:'var(--bg3)', color:'var(--text)',
  border:'1px solid var(--border)', borderRadius:'6px',
  fontFamily:'var(--font)', fontSize:'13px',
  padding:'6px 12px', cursor:'pointer', outline:'none',
}
const sHead  = { display:'flex', alignItems:'center', gap:'12px', margin:'16px 0 10px' }
const sTitle = { fontSize:'11px', fontWeight:600, color:'var(--text2)', letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap' }
const sLine  = { flex:1, height:'1px', background:'var(--border)' }
