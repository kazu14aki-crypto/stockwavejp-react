import { useState } from 'react'
import { useThemes, useCustomThemeStats, useMacro, useMomentum } from '../../hooks/useMarketData'
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
  if (!lines?.length) return null

  const rendered = lines.map((line, i) => {
    if (line.startsWith('【')) {
      const bracketEnd = line.indexOf('】')
      const header = line.slice(1, bracketEnd)
      const rest   = line.slice(bracketEnd + 1).trim()
      return (
        <div key={i} style={{ marginBottom:'10px', marginTop: i > 0 ? '14px' : '0' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--accent)',
            letterSpacing:'0.04em', marginBottom:'4px',
            borderLeft:'3px solid var(--accent)', paddingLeft:'8px' }}>
            {header}
          </div>
          {rest && <div style={{ fontSize:'12px', color:'var(--text2)',
            lineHeight:'1.8', paddingLeft:'11px' }}>{rest}</div>}
        </div>
      )
    }
    const icons = ['▲','▼','📊','🔥','❄️','↗','↘','💡','✅','⚠️','📉']
    const startsWithIcon = icons.some(ic => line.startsWith(ic))
    if (startsWithIcon) {
      const spaceIdx = line.indexOf(' ')
      const icon = spaceIdx > 0 ? line.slice(0, spaceIdx) : line[0]
      const text = spaceIdx > 0 ? line.slice(spaceIdx + 1) : line.slice(icon.length)
      const colonIdx = text.indexOf('：')
      const label = colonIdx > 0 ? text.slice(0, colonIdx) : null
      const body  = colonIdx > 0 ? text.slice(colonIdx + 1).trim() : text
      return (
        <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'7px',
          paddingLeft:'4px', alignItems:'flex-start' }}>
          <span style={{ fontSize:'13px', flexShrink:0, marginTop:'1px', lineHeight:1.5 }}>{icon}</span>
          <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', flex:1 }}>
            {label && <span style={{ fontWeight:600, color:'var(--text)' }}>{label}：</span>}
            {body}
          </div>
        </div>
      )
    }
    return (
      <div key={i} style={{ fontSize:'12px', color:'var(--text2)',
        lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
    )
  })

  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'10px', padding:'16px 18px', marginBottom:'20px',
    }}>
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
function ThemeCard({ item, rank, maxAbs, valueKey='pct', barColor, pctColor, pctRank, volRank, tvRank }) {
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
        <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text)',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'3px' }}>
          {item.theme}
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


function ThemeCardGrid({ items, pctColor, valueKey='pct', barColor, pctRankMap, volRankMap, tvRankMap }) {
  const maxVal = valueKey === 'pct' ? 0 : Math.max(...items.map(t => Math.abs(t[valueKey] || 0)))
  return (
    <div className="theme-card-grid">
      {items.map((item, idx) => (
        <ThemeCard key={item.theme} item={item} rank={idx+1}
          maxAbs={maxVal} valueKey={valueKey}
          barColor={barColor} pctColor={pctColor}
          pctRank={pctRankMap?.get(item.theme)}
          volRank={volRankMap?.get(item.theme)}
          tvRank={tvRankMap?.get(item.theme)} />
      ))}
    </div>
  )
}


export default function ThemeList() {
  const [period, setPeriod] = useState('1mo')
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
          日本株の主要30テーマについて、騰落率・出来高・売買代金を一覧で比較できます。
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

            {/* 全テーマ 騰落率ランキング（カードグリッド） */}
            <SectionHead title="📊 全テーマ 騰落率ランキング" />
            <ThemeCardGrid items={themes} pctColor={pctColor} valueKey="pct" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} />

            {/* マイカスタムテーマ（騰落率つき） */}
            {customThemes.length > 0 && (
              <>
                <SectionHead title="🎨 マイカスタムテーマ" />
                <CustomThemeRows themes={customThemes} period={period} pctColor={pctColor} />
              </>
            )}

            {/* 全テーマ 出来高ランキング（カードグリッド） */}
            <SectionHead title="🔢 全テーマ 出来高ランキング" />
            <ThemeCardGrid items={byVol} pctColor={pctColor} valueKey="volume" barColor="#378ADD" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} />

            {/* 全テーマ 売買代金ランキング（カードグリッド） */}
            <SectionHead title="💴 全テーマ 売買代金ランキング" />
            <ThemeCardGrid items={byTV} pctColor={pctColor} valueKey="trade_value" barColor="#ff8c42" pctRankMap={pctRankMap} volRankMap={volRankMap} tvRankMap={tvRankMap} />

          </>
        )}
      </div>

      <style>{`
        .responsive-grid-6 { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
        @media (max-width:1024px) { .responsive-grid-6 { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .responsive-grid-6 { grid-template-columns:repeat(2,1fr); } }
        .theme-card-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        @media (max-width:1024px) { .theme-card-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:640px)  { .theme-card-grid { grid-template-columns:repeat(2,1fr); } }
        .top5-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 640px) {
          .top5-grid { grid-template-columns: 1fr !important; }
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
