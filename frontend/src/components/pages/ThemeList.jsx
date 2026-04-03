import { useState } from 'react'
import { useThemes, useCustomThemeStats, useMacro } from '../../hooks/useMarketData'
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
function CustomThemeRow({ ct, period, pctColor }) {
  const tickers = (ct.stocks || []).map(s => s.ticker)
  const { data, loading } = useCustomThemeStats(tickers, period)
  const pct = data?.pct ?? null
  const maxAbs = 10  // バー最大幅の基準（固定）

  return (
    <div style={{
      background:'rgba(170,119,255,0.06)',
      border:'1px solid rgba(170,119,255,0.25)',
      borderRadius:'8px', padding:'8px 14px',
      display:'grid', gridTemplateColumns:'140px 1fr 64px',
      alignItems:'center', gap:'8px',
    }}>
      <span style={{ fontSize:'12px', color:'#c8a8ff', fontWeight:700,
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textAlign:'right' }}>
        🎨 {ct.name}
      </span>
      <div style={{ height:'14px', background:'rgba(255,255,255,0.04)', borderRadius:'3px', overflow:'hidden' }}>
        {pct !== null && (
          <div style={{
            height:'100%',
            width:`${Math.min(Math.abs(pct) / maxAbs * 100, 100)}%`,
            background: pct >= 0 ? 'var(--red)' : 'var(--green)',
            borderRadius:'3px', opacity:0.8,
          }} />
        )}
      </div>
      <span style={{ fontFamily:'var(--mono)', fontSize:'12px', fontWeight:700,
        textAlign:'right', color: pct === null ? 'var(--text3)' : pctColor(pct ?? 0), whiteSpace:'nowrap' }}>
        {loading ? '…' : pct === null ? '-' : `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`}
      </span>
    </div>
  )
}

function CustomThemeRows({ themes, period, pctColor }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
      {themes.map((ct, i) => (
        <CustomThemeRow key={i} ct={ct} period={period} pctColor={pctColor} />
      ))}
      <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
        💡 詳細データはサイドメニュー「カスタムテーマ」から確認できます
      </div>
    </div>
  )
}


// ⑤ カードグリッド用ThemeCard（案X: 左端順位バッジ）
function ThemeCard({ item, rank, maxAbs, valueKey='pct', barColor, pctColor }) {
  const fmt = (n) => {
    if (!n) return '0'
    if (n >= 1e12) return (n/1e12).toFixed(1)+'兆'
    if (n >= 1e8)  return (n/1e8).toFixed(1)+'億'
    if (n >= 1e4)  return (n/1e4).toFixed(1)+'万'
    return n.toLocaleString()
  }
  const pct  = item.pct ?? 0
  const val  = item[valueKey] ?? 0
  const barW = maxAbs ? Math.min(Math.abs(val) / maxAbs * 100, 100) : Math.min(Math.abs(pct) / 25 * 100, 100)
  const col  = pctColor(pct)
  // 順位バッジの色: 上位は濃く、下位は薄く
  const badgeOpacity = Math.max(1 - (rank - 1) * 0.028, 0.25)
  const isUp = pct >= 0
  const badgeColor = valueKey === 'pct'
    ? (isUp ? `rgba(226,75,74,${badgeOpacity})` : `rgba(29,158,117,${badgeOpacity})`)
    : (barColor || '#378ADD')
  const isTopBadge = rank <= 3
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'8px', padding:'8px 10px',
      display:'flex', gap:'8px', alignItems:'flex-start',
    }}>
      {/* 順位バッジ */}
      <div style={{
        minWidth:'22px', height:'22px', borderRadius:'5px',
        background: isTopBadge ? badgeColor : 'rgba(120,130,150,0.15)',
        color: isTopBadge ? '#fff' : 'var(--text3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'11px', fontWeight:700, fontFamily:'var(--mono)',
        flexShrink:0, marginTop:'1px',
      }}>
        {rank}
      </div>
      {/* 内容 */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text)',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'3px' }}>
          {item.theme}
        </div>
        {/* メイン数値 */}
        {valueKey === 'pct' ? (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color:col, fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${Math.min(Math.abs(pct)/25*100,100)}%`, height:'100%', background:col, borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', lineHeight:1.5 }}>
              出来高 {fmt(item.volume)}<br/>売買代金 {fmt(item.trade_value)}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:'15px', fontWeight:700, color: barColor||'#378ADD', fontFamily:'var(--mono)', lineHeight:1.2 }}>
              {fmt(val)}
            </div>
            <div style={{ height:'3px', background:'rgba(128,128,128,0.15)', borderRadius:'2px', margin:'4px 0' }}>
              <div style={{ width:`${barW}%`, height:'100%', background: barColor||'#378ADD', borderRadius:'2px' }}/>
            </div>
            <div style={{ fontSize:'10px', color:col, fontFamily:'var(--mono)', lineHeight:1.5 }}>
              騰落率 {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ThemeCardGrid({ items, pctColor, valueKey='pct', barColor }) {
  const maxVal = valueKey === 'pct' ? 0 : Math.max(...items.map(t => Math.abs(t[valueKey] || 0)))
  return (
    <div className="theme-card-grid">
      {items.map((item, idx) => (
        <ThemeCard key={item.theme} item={item} rank={idx+1}
          maxAbs={maxVal} valueKey={valueKey}
          barColor={barColor} pctColor={pctColor} />
      ))}
    </div>
  )
}


export default function ThemeList() {
  const [period, setPeriod] = useState('1d')
  const { themes: customThemes } = useCustomThemes()
  const { data: macroRaw } = useMacro('1mo')  // 指数参照は1mo固定
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
          borderRadius:'8px', padding:'12px 16px', marginBottom:'12px', fontSize:'13px', color:'#e8f0ff', lineHeight:1.9 }}>
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

            {/* 全テーマ 騰落率ランキング（カードグリッド） */}
            <SectionHead title="📊 全テーマ 騰落率ランキング" />
            <ThemeCardGrid items={themes} pctColor={pctColor} />

            {/* マイカスタムテーマ（騰落率つき） */}
            {customThemes.length > 0 && (
              <>
                <SectionHead title="🎨 マイカスタムテーマ" />
                <CustomThemeRows themes={customThemes} period={period} pctColor={pctColor} />
              </>
            )}

            {/* 全テーマ 出来高ランキング（カードグリッド） */}
            <SectionHead title="🔢 全テーマ 出来高ランキング" />
            <ThemeCardGrid items={byVol} pctColor={pctColor} valueKey="volume" barColor="#378ADD" />

            {/* 全テーマ 売買代金ランキング（カードグリッド） */}
            <SectionHead title="💴 全テーマ 売買代金ランキング" />
            <ThemeCardGrid items={byTV} pctColor={pctColor} valueKey="trade_value" barColor="#ff8c42" />

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
