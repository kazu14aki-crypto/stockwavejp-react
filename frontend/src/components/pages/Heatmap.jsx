import React, { useEffect, useState } from 'react'
import { useMomentum } from '../../hooks/useMarketData'
import { useSubscription } from '../../hooks/useSubscription.jsx'
import StockWaveScoreCard from '../StockWaveScoreCard'
import { calculateStockWaveScore } from '../../utils/stockWaveScore'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const THEME_ARTICLE_MAP = {
  '半導体製造装置':    'semiconductor-theme',
  '半導体検査装置':    'semiconductor-theme',
  '半導体材料':        'semiconductor-theme',
  'メモリ':            'semiconductor-theme',
  'パワー半導体':      'power-semiconductor',
  '次世代半導体':      'next-generation-semiconductors-history-present-future',
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
  '核融合発電':        'fusion-power-history-present-future',
  '原子力発電':        'nuclear-power-history-present-future',
  '電力会社':          'renewable-energy-theme',
  'LNG':               'inpex-analysis',
  '石油':              'inpex-analysis',
  '蓄電池':            'ev-green-theme',
  '資源（水素・ヘリウム・水）': 'rare-earth-resources-theme',
  'IOWN':              'optical-communication',
  '光ファイバー・光部品':            'optical-communication',
  '通信':              'telecom-theme',
  '量子コンピューター':'quantum-computing-history-present-future',
  'SaaS':              'fintech-theme',
  'ウェアラブル端末':  'wearable-devices-history-present-future',
  '仮想通貨':          'fintech-theme',
  'ネット銀行':        'banking-finance-theme',
  '鉄鋼・素材':        'steel-materials-theme',
  '化学':              'chemical-theme',
  '建築資材':          'construction-infra-theme',
  '塗料':              'coatings-industry-history-present-future',
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
  '警備':              'security-services-history-present-future',
  '電線・銅':          'wires-copper-history-present-future',
  '先端パッケージング・基板': 'advanced-packaging-substrates-history-present-future',
  'データセンター電力・冷却': 'data-center-power-cooling-history-present-future',
  'M&A・事業承継':      'ma-business-succession-history-present-future',
  '脱炭素・ESG':       'ev-green-theme',
  '教育・HR・人材':    'education-hr-theme',
  '人材派遣':          'education-hr-theme',
  'ゲーム・エンタメ':  'game-entertainment-theme',
}

const STATE_COLORS = {
  '🔥加速':  '#ff4560',
  '↗転換↑': '#ff8c42',
  '→横ばい': 'var(--text3)',
  '↘転換↓': '#4a9eff',
  '❄️失速':  '#00c48c',
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none',
}

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i) => (
        <span key={i} style={{
          display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px',
          animation:`pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}

          </div>
  )
}

function pctColor(v) {
  if (v === null || v === undefined) return 'var(--text3)'
  return v > 0 ? '#ff5370' : v < 0 ? '#4caf82' : 'var(--text3)'
}

function cellBg(v) {
  if (v === null || v === undefined) return 'transparent'
  const ratio = Math.min(Math.abs(v) / 10, 1)
  if (v > 0) { const r = Math.round(255*ratio); const g = Math.round(40*(1-ratio)); return `rgb(${r},${g},${g})` }
  const g = Math.round(196*ratio); const b = Math.round(140*ratio); return `rgb(0,${g},${b})`
}

function HeatmapTable({ data, columns }) {
  if (!data || !columns?.length) return null
  const themes = Object.keys(data)
  return (
    <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
      <table style={{ borderCollapse:'collapse', fontSize:'11px', minWidth:'600px', width:'100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left', padding:'6px 10px', color:'var(--text3)', fontWeight:600, position:'sticky', left:0, background:'var(--bg3)', minWidth:'120px' }}>テーマ</th>
            {columns.map(col => (
              <th key={col} style={{ textAlign:'center', padding:'6px 8px', color:'var(--text3)', fontWeight:600, minWidth:'56px' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {themes.map(theme => (
            <tr key={theme}>
              <td style={{ padding:'5px 10px', color:'var(--text2)', fontWeight:500, position:'sticky', left:0, background:'var(--bg2)', borderBottom:'1px solid var(--border)' }}>{theme}</td>
              {columns.map(col => {
                const v = data[theme]?.[col]
                return (
                  <td key={col} style={{
                    textAlign:'center', padding:'5px 4px',
                    background: cellBg(v), color:'#fff',
                    fontFamily:'var(--mono)', fontWeight:600,
                    borderBottom:'1px solid rgba(255,255,255,0.05)',
                  }}>
                    {v != null ? `${v>0?'+':''}${v.toFixed(1)}` : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

function AutoComment({ lines }) {
  let safeLines = lines
  if (!safeLines) return null
  if (typeof safeLines === 'string') safeLines = safeLines.split('\n').filter(Boolean)
  if (!Array.isArray(safeLines) || !safeLines.length) return null
  const rendered = safeLines.map((line, i) => {
    if (typeof line !== 'string') return null
    if (line.startsWith('【')) {
      const e = line.indexOf('】')
      if (e < 0) return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
      const h = line.slice(1, e), r = line.slice(e+1).trim()
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
      const text = si > 0 ? line.slice(si+1) : ''
      const ci = text.indexOf('：'), label = ci > 0 ? text.slice(0, ci) : null, body = ci > 0 ? text.slice(ci+1).trim() : text
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


const PERIOD_LABELS = {
  '1d':'1日', '5d':'1週間', '1mo':'1ヶ月', '3mo':'3ヶ月', '6mo':'6ヶ月', '1y':'1年',
}

function formatCompact(value, unit='') {
  if (value == null || !Number.isFinite(Number(value))) return '—'
  const n = Number(value)
  const abs = Math.abs(n)
  if (unit === '円') {
    if (abs >= 1e12) return `${(n/1e12).toFixed(1)}兆円`
    if (abs >= 1e8) return `${(n/1e8).toFixed(1)}億円`
    if (abs >= 1e4) return `${(n/1e4).toFixed(0)}万円`
    return `${Math.round(n).toLocaleString()}円`
  }
  if (abs >= 1e12) return `${(n/1e12).toFixed(1)}兆${unit}`
  if (abs >= 1e8) return `${(n/1e8).toFixed(1)}億${unit}`
  if (abs >= 1e4) return `${(n/1e4).toFixed(0)}万${unit}`
  return `${Math.round(n).toLocaleString()}${unit}`
}

function normalizeTrendRows(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((row, index) => {
      if (typeof row === 'number') return { label:String(index+1), value:row }
      return {
        label: row.date || row.label || row.time || row.period || String(index+1),
        value: Number(row.value ?? row.pct ?? row.return ?? row.avg ?? 0),
      }
    }).filter(row => Number.isFinite(row.value))
  }
  if (Array.isArray(raw.dates)) {
    const values = raw.values || raw.pcts || raw.data || []
    return raw.dates.map((date, index) => ({
      label: date,
      value: Number(values[index]),
    })).filter(row => Number.isFinite(row.value))
  }
  if (raw.dates && raw.series) {
    return raw.dates.map((date, index) => ({
      label: date,
      value: Number(raw.series[index]),
    })).filter(row => Number.isFinite(row.value))
  }
  return []
}

function TrendChart({ title, rows, suffix='', compactUnit='', tone='accent' }) {
  const W = 420, H = 180, PL = 42, PR = 16, PT = 24, PB = 30
  const values = rows.map(row => Number(row.value)).filter(Number.isFinite)
  if (!values.length) {
    return (
      <div className="heatmap-trend-card">
        <div className="heatmap-trend-title">{title}</div>
        <div className="heatmap-empty-chart">推移データを取得できませんでした</div>
      </div>
    )
  }
  const minRaw = Math.min(...values), maxRaw = Math.max(...values)
  const spread = Math.max(maxRaw - minRaw, Math.abs(maxRaw) * 0.08, 1)
  const min = minRaw - spread * 0.12
  const max = maxRaw + spread * 0.12
  const x = i => PL + (rows.length <= 1 ? 0 : i / (rows.length - 1)) * (W - PL - PR)
  const y = v => PT + (H - PT - PB) - ((v - min) / Math.max(max - min, 1)) * (H - PT - PB)
  const points = rows.map((row, i) => `${x(i)},${y(row.value)}`).join(' ')
  const last = rows[rows.length - 1]?.value
  const first = rows[0]?.value
  const delta = Number(last) - Number(first)
  const stroke = tone === 'volume' ? '#ff8c42' : tone === 'trade' ? '#aa77ff' : '#4a9eff'
  const display = value => compactUnit ? formatCompact(value, compactUnit) : `${Number(value).toFixed(2)}${suffix}`
  const tickIndexes = [...new Set([0, Math.floor((rows.length-1)/2), rows.length-1])].filter(i => i >= 0)

  return (
    <div className="heatmap-trend-card">
      <div className="heatmap-trend-head">
        <div>
          <div className="heatmap-trend-title">{title}</div>
          <div className="heatmap-trend-latest">{display(last)}</div>
        </div>
        <div className="heatmap-trend-delta" style={{ color: delta > 0 ? 'var(--red)' : delta < 0 ? 'var(--green)' : 'var(--text3)' }}>
          {delta > 0 ? '+' : ''}{compactUnit ? formatCompact(delta, compactUnit) : `${delta.toFixed(2)}${suffix}`}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="heatmap-mini-chart" role="img" aria-label={`${title}の推移`}>
        {[0, .5, 1].map(rate => {
          const gy = PT + rate * (H - PT - PB)
          return <line key={rate} x1={PL} y1={gy} x2={W-PR} y2={gy} stroke="rgba(255,255,255,.08)" strokeWidth="1" />
        })}
        {min < 0 && max > 0 && (
          <line x1={PL} y1={y(0)} x2={W-PR} y2={y(0)} stroke="rgba(255,255,255,.2)" strokeDasharray="4 3" />
        )}
        <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {rows.map((row, i) => (
          <circle key={i} cx={x(i)} cy={y(row.value)} r={i === rows.length-1 ? 3.8 : 1.7} fill={stroke}>
            <title>{`${row.label}: ${display(row.value)}`}</title>
          </circle>
        ))}
        {tickIndexes.map(i => (
          <text key={i} x={x(i)} y={H-8} textAnchor={i === 0 ? 'start' : i === rows.length-1 ? 'end' : 'middle'} fontSize="9" fill="rgba(255,255,255,.4)">
            {String(rows[i]?.label || '').replace(/^\d{4}-/, '')}
          </text>
        ))}
      </svg>
    </div>
  )
}

function StockRankList({ title, rows, positive=true, onNavigate }) {
  return (
    <div className="heatmap-stock-list">
      <div className="heatmap-stock-list-title" style={{ color: positive ? 'var(--red)' : 'var(--green)' }}>
        {positive ? '▲' : '▼'} {title}
      </div>
      {rows.length ? rows.map((stock, index) => (
        <button key={stock.ticker || stock.name || index}
          className="heatmap-stock-row"
          onClick={() => stock.ticker && onNavigate?.('銘柄詳細', stock.ticker)}>
          <span className="heatmap-stock-rank">{index+1}</span>
          <span className="heatmap-stock-name">
            <strong>{stock.name || stock.ticker}</strong>
            <small>{String(stock.ticker || '').replace('.T','')}</small>
          </span>
          <span className="heatmap-stock-pct" style={{ color: Number(stock.pct) >= 0 ? 'var(--red)' : 'var(--green)' }}>
            {Number(stock.pct) >= 0 ? '+' : ''}{Number(stock.pct || 0).toFixed(2)}%
          </span>
        </button>
      )) : <div className="heatmap-empty-list">構成銘柄データがありません</div>}
    </div>
  )
}

function SelectedThemePanel({ theme, period, bubble, onNavigate }) {
  const [trendRows, setTrendRows] = React.useState([])
  const [volumeRows, setVolumeRows] = React.useState([])
  const [tradeRows, setTradeRows] = React.useState([])
  const [stocks, setStocks] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [mobileMetric, setMobileMetric] = React.useState('pct')

  React.useEffect(() => {
    if (!theme) return
    let cancelled = false
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        let staticJson = null
        try {
          const response = await fetch(`/data/market.json?t=${Date.now()}`)
          if (response.ok) staticJson = await response.json()
        } catch {}

        const staticTrend = staticJson?.[`trends_1y`]?.data?.[theme]
          || staticJson?.[`trends_1y`]?.trends?.[theme]
        let pctRows = normalizeTrendRows(staticTrend)

        let detail = staticJson?.[`theme_detail_${theme}_${period}`]
        detail = detail?.data || detail

        let volData = null
        if (!pctRows.length) {
          try {
            const response = await fetch(`${API}/api/trends?themes=${encodeURIComponent(theme)}&period=1y`)
            if (response.ok) {
              const json = await response.json()
              pctRows = normalizeTrendRows(json?.trends?.[theme] || json?.data?.[theme] || json?.[theme])
            }
          } catch {}
        }

        try {
          const response = await fetch(`${API}/api/vol-trend/${encodeURIComponent(theme)}`)
          if (response.ok) volData = await response.json()
        } catch {}

        if (!detail?.stocks?.length) {
          try {
            const response = await fetch(`${API}/api/theme-detail/${encodeURIComponent(theme)}?period=${period}`)
            if (response.ok) {
              const json = await response.json()
              detail = json?.data || json
            }
          } catch {}
        }

        const dates = Array.isArray(volData?.dates) ? volData.dates : []
        const volRows = dates.map((date, index) => ({ label:date, value:Number(volData?.volumes?.[index]) }))
          .filter(row => Number.isFinite(row.value))
        const tvRows = dates.map((date, index) => ({ label:date, value:Number(volData?.trade_values?.[index]) }))
          .filter(row => Number.isFinite(row.value))

        if (!cancelled) {
          setTrendRows(pctRows)
          setVolumeRows(volRows)
          setTradeRows(tvRows)
          setStocks(Array.isArray(detail?.stocks) ? detail.stocks : [])
          setError(!pctRows.length && !volRows.length && !(detail?.stocks?.length) ? '詳細データを取得できませんでした。' : null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [theme, period])

  if (!theme) {
    return (
      <div className="heatmap-selected-empty">
        <div>ヒートマップ上のテーマを選択してください</div>
        <span>PCはバブルへカーソルを合わせる、スマートフォンはバブルをタップすると、ここに推移と構成銘柄が表示されます。</span>
      </div>
    )
  }

  const sorted = [...stocks].filter(stock => Number.isFinite(Number(stock.pct)))
    .sort((a,b) => Number(b.pct) - Number(a.pct))
  const top = sorted.slice(0,3)
  const worst = sorted.slice(-3).reverse()
  const pctValues = sorted.map(stock => Number(stock.pct))
  const median = pctValues.length
    ? [...pctValues].sort((a,b)=>a-b)[Math.floor(pctValues.length/2)]
    : null
  const upCount = pctValues.filter(v => v > 0).length
  const totalTrade = stocks.reduce((sum, stock) => sum + Number(stock.trade_value || 0), 0)
  const totalVolume = stocks.reduce((sum, stock) => sum + Number(stock.volume || 0), 0)
  const stockWaveScore = calculateStockWaveScore(stocks, bubble?.pct)

  return (
    <section className="heatmap-selected-panel" aria-live="polite">
      <div className="heatmap-selected-header">
        <div>
          <div className="heatmap-selected-eyebrow">選択中のテーマ</div>
          <h2>{theme}</h2>
          <div className="heatmap-selected-sub">{PERIOD_LABELS[period] || period}のテーマ分析</div>
        </div>
        <div className="heatmap-selected-actions">
          <button onClick={() => onNavigate?.('テーマ別詳細', theme)}>テーマ詳細 →</button>
          {THEME_ARTICLE_MAP[theme] && (
            <button className="secondary" onClick={() => onNavigate?.('コラム・解説', THEME_ARTICLE_MAP[theme])}>関連コラム →</button>
          )}
        </div>
      </div>

      <StockWaveScoreCard result={stockWaveScore} locale="ja" compact />

      <div className="heatmap-kpi-grid">
        <div><span>テーマ騰落率</span><strong style={{color:pctColor(bubble?.pct)}}>{Number(bubble?.pct)>=0?'+':''}{Number(bubble?.pct || 0).toFixed(2)}%</strong></div>
        <div><span>構成銘柄</span><strong>{stocks.length || '—'}社</strong></div>
        <div><span>上昇銘柄</span><strong>{stocks.length ? `${upCount}/${stocks.length}` : '—'}</strong></div>
        <div><span>中央値</span><strong style={{color:pctColor(median)}}>{median == null ? '—' : `${median>=0?'+':''}${median.toFixed(2)}%`}</strong></div>
        <div><span>合計出来高</span><strong>{totalVolume ? formatCompact(totalVolume) : formatCompact(bubble?.volume)}</strong></div>
        <div><span>合計売買代金</span><strong>{totalTrade ? formatCompact(totalTrade,'円') : formatCompact(bubble?.trade_value,'円')}</strong></div>
      </div>

      {loading && <div className="heatmap-panel-loading">分析データを読み込んでいます…</div>}
      {error && <div className="heatmap-panel-error">{error}</div>}

      <div className="heatmap-mobile-metric-tabs">
        {[['pct','騰落'],['volume','出来高'],['trade','売買代金']].map(([key,label]) => (
          <button key={key} className={mobileMetric===key?'active':''} onClick={() => setMobileMetric(key)}>{label}</button>
        ))}
      </div>

      <div className="heatmap-trend-grid">
        <div className={mobileMetric==='pct'?'mobile-active':''}><TrendChart title="テーマ騰落推移" rows={trendRows} suffix="%" /></div>
        <div className={mobileMetric==='volume'?'mobile-active':''}><TrendChart title="出来高推移" rows={volumeRows} compactUnit="" tone="volume" /></div>
        <div className={mobileMetric==='trade'?'mobile-active':''}><TrendChart title="売買代金推移" rows={tradeRows} compactUnit="円" tone="trade" /></div>
      </div>

      <div className="heatmap-ranking-grid">
        <StockRankList title="騰落率トップ3" rows={top} positive onNavigate={onNavigate} />
        <StockRankList title="騰落率ワースト3" rows={worst} positive={false} onNavigate={onNavigate} />
      </div>

      <div className="heatmap-reading-guide">
        <strong>確認ポイント</strong>
        <span>テーマ平均だけでなく、中央値と上昇銘柄数で値動きの広がりを確認します。出来高・売買代金が増えながら上昇している場合は資金流入の可能性がありますが、トップ3だけが平均を押し上げている場合は一部銘柄への集中に注意が必要です。</span>
      </div>
    </section>
  )
}


function BubbleScatter({ data, mPeriod, setMPeriod, onNavigate, canAccessPeriod }) {
  const [popupTheme, setPopupTheme] = React.useState(null)
  const [popupPos,   setPopupPos]   = React.useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [selectedTheme, setSelectedTheme] = useState(() => data?.[0] || null)

  React.useEffect(() => {
    if (!selectedTheme && data?.length) setSelectedTheme(data[0])
    if (selectedTheme && data?.length && !data.some(row => row.theme === selectedTheme.theme)) {
      setSelectedTheme(data[0])
    }
  }, [data, selectedTheme])

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
        データを読み込み中...
      </div>
    )
  }
  // ── レイアウト定数 ──────────────────────────────
  const W = 800, H = 400
  const PL = 60, PR = 28, PT = 40, PB = 48
  const GW = W - PL - PR
  const GH = H - PT - PB

  // ── データ準備 ──────────────────────────────────
  const filtered = data.filter(d => d.pct != null && !isNaN(d.pct))

  // Y軸: volume_chgが有効データ（0以外が1つでもある）なら出来高急増率、なければweek_diff
  const volChgValues = filtered.map(d => typeof d.volume_chg === 'number' ? d.volume_chg : null)
  const hasRealVolChg = volChgValues.some(v => v !== null && v !== 0)

  const getY = d => {
    if (hasRealVolChg && typeof d.volume_chg === 'number') return d.volume_chg
    if (typeof d.week_diff === 'number') return d.week_diff
    return 0
  }
  const yAxisLabel = hasRealVolChg ? '出来高急増率 (%)' : '先週比 (pt)'

  // Y軸: trade_valueが有効かどうか
  const tvValues = filtered.map(d => d.trade_value ?? 0)
  const hasRealTV = tvValues.some(v => v > 0)

  const getSizeVal = d => hasRealTV ? (d.trade_value ?? 0) : Math.abs(d.pct ?? 0) * 10e8

  const pcts    = filtered.map(d => d.pct)
  const volChgs = filtered.map(d => getY(d))
  const tvs     = filtered.map(d => getSizeVal(d))

  // 軸の範囲（ゼロ除算防止）
  const rawXMin = pcts.length ? Math.min(...pcts) : -5
  const rawXMax = pcts.length ? Math.max(...pcts) : 5
  const rawYMin = volChgs.length ? Math.min(...volChgs) : -10
  const rawYMax = volChgs.length ? Math.max(...volChgs) : 10
  // Y軸が全て同じ値の場合は強制的に範囲を広げる
  const xMargin = Math.max((rawXMax - rawXMin) * 0.15, 1.5)
  const yMargin = Math.max((rawYMax - rawYMin) * 0.15, 2)
  const xMin = rawXMin - xMargin
  const xMax = rawXMax + xMargin
  const yMin = rawYMin - yMargin
  const yMax = rawYMax + yMargin
  const tvMax = Math.max(...tvs.filter(v => v > 0), 1)

  // データが不足している場合（GitHub Actions未実行等）はフォールバック表示
  if (filtered.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text3)',
        background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
        <div style={{ fontSize:'24px', marginBottom:'12px' }}>📊</div>
        <div style={{ fontSize:'13px', marginBottom:'6px', color:'var(--text2)' }}>
          散布図データを準備中です
        </div>
        <div style={{ fontSize:'11px' }}>
          GitHub Actions「Fetch Market Data」を手動実行すると表示されます
        </div>
      </div>
    )
  }

  // スケール関数（ゼロ除算ガード付き）
  const xRange = (xMax - xMin) || 1
  const yRange = (yMax - yMin) || 1
  const xS = v => PL + ((v - xMin) / xRange) * GW
  const yS = v => PT + GH - ((v - yMin) / yRange) * GH

  // 円サイズ（売買代金に比例、最小8・最大40px）
  const rS = tv => {
    if (!tv || tv === 0) return 7
    const ratio = tv / tvMax
    return 8 + ratio * 34
  }

  // 色（騰落率）サイトのred/green変数に合わせる
  const bColor = pct => {
    if (pct >= 8)   return '#ff2244'
    if (pct >= 4)   return '#ff5370'
    if (pct >= 1.5) return '#ff8c42'
    if (pct >= 0)   return '#e8a040'
    if (pct >= -1.5)return '#3db88a'
    if (pct >= -4)  return '#00c48c'
    return '#00a878'
  }

  // ゼロライン位置
  const x0 = xS(0)
  const y0 = yS(0)

  // ── ゾーン定義（サイトカラーに合わせた暗いトーン）──
  const zones = [
    { label:'注目ゾーン 上昇+出来高増',  x:x0, y:PT,  w:PL+GW-x0, h:y0-PT,    bg:'rgba(255,83,112,0.22)', border:'rgba(255,83,112,0.60)' },
    { label:'売り圧力 下落+出来高増',    x:PL, y:PT,  w:x0-PL,    h:y0-PT,    bg:'rgba(0,196,140,0.18)',  border:'rgba(0,196,140,0.55)'  },
    { label:'静かな上昇 出来高少',       x:x0, y:y0,  w:PL+GW-x0, h:PT+GH-y0, bg:'rgba(255,140,66,0.15)', border:'rgba(255,140,66,0.50)' },
    { label:'静かな下落',                x:PL, y:y0,  w:x0-PL,    h:PT+GH-y0, bg:'rgba(74,158,255,0.13)', border:'rgba(74,158,255,0.45)' },
  ]

  // 目盛り生成
  const xTicks = []
  const xStep = Math.ceil((xMax - xMin) / 7)
  for (let v = Math.ceil(xMin); v <= xMax; v += xStep || 1) xTicks.push(v)

  const yTicks = []
  const yStep = Math.ceil((yMax - yMin) / 6)
  for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep || 1) yTicks.push(v)

  const fmtL = tv => {
    if (!tv) return '-'
    if (tv >= 1e8) return (tv/1e8).toFixed(0) + '億'
    if (tv >= 1e4) return (tv/1e4).toFixed(0) + '万'
    return tv.toLocaleString()
  }

  return (
    <div onClick={() => setPopupTheme(null)}>
      {/* ⑥ バブルタップポップアップ */}
      {popupTheme && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position:'fixed',
            left: Math.min(popupPos.x + 12, (typeof window !== 'undefined' ? window.innerWidth : 400) - 230),
            top:  Math.min(popupPos.y + 12, (typeof window !== 'undefined' ? window.innerHeight : 600) - 220),
            zIndex: 2000,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 18px',
            minWidth: '210px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>
            {popupTheme.theme}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
              <span style={{ color:'var(--text3)' }}>騰落率</span>
              <span style={{ fontFamily:'var(--mono)', fontWeight:700,
                color: popupTheme.pct >= 0 ? 'var(--red)' : 'var(--green)' }}>
                {popupTheme.pct >= 0 ? '+' : ''}{popupTheme.pct?.toFixed(2)}%
              </span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
              <span style={{ color:'var(--text3)' }}>出来高</span>
              <span style={{ fontFamily:'var(--mono)', color:'var(--text2)' }}>
                {popupTheme.volume ? (popupTheme.volume >= 1e6
                  ? (popupTheme.volume/1e6).toFixed(1)+'M'
                  : popupTheme.volume.toLocaleString()) : '-'}
              </span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
              <span style={{ color:'var(--text3)' }}>売買代金</span>
              <span style={{ fontFamily:'var(--mono)', color:'var(--text2)' }}>
                {popupTheme.trade_value ? (popupTheme.trade_value >= 1e8
                  ? (popupTheme.trade_value/1e8).toFixed(1)+'億'
                  : (popupTheme.trade_value/1e6).toFixed(0)+'百万') : '-'}
              </span>
            </div>
          </div>
          <button
            onClick={() => { onNavigate?.('テーマ別詳細', popupTheme.theme); setPopupTheme(null) }}
            style={{
              marginTop:'14px', width:'100%', padding:'8px',
              background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.3)',
              borderRadius:'8px', color:'var(--accent)', cursor:'pointer',
              fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
            }}
          >
            📊 テーマ別詳細を見る →
          </button>
          {/* コラムボタン */}
          {(() => {
            const THEME_COL_MAP = {
              '半導体製造装置':'semiconductor-theme','半導体検査装置':'semiconductor-theme',
              '半導体材料':'semiconductor-theme','メモリ':'semiconductor-theme',
              'パワー半導体':'power-semiconductor','次世代半導体':'semiconductor-theme',
              '生成AI':'ai-cloud-theme','AIデータセンター':'ai-cloud-theme',
              'フィジカルAI':'physical-ai-edge-ai','AI半導体':'semiconductor-theme',
              'エッジAI':'physical-ai-edge-ai','防衛・航空':'defense-theme',
              '防衛・セキュリティ':'defense-theme','宇宙・衛星':'defense-theme',
              'サイバーセキュリティ':'defense-theme','インバウンド':'inbound-theme',
              '観光・ホテル・レジャー':'inbound-theme','銀行':'banking-finance-theme',
              '銀行・金融':'banking-finance-theme','SaaS':'saas-dx-theme',
              'DX':'saas-dx-theme','EV・電気自動車':'ev-green-theme',
              '光ファイバー・光部品':'optical-communication','量子コンピューター':'quantum-computing-history-present-future',
              'ロボット・自動化':'robot-automation-theme','医薬品・バイオ':'pharma-bio-theme',
              'ヘルスケア・介護':'healthcare-nursing-theme','不動産':'real-estate-theme',
              '建設・インフラ':'construction-infra-theme','食品・飲料':'food-beverage-theme',
            }
            const colId = THEME_COL_MAP[popupTheme?.theme]
            if (!colId) return null
            return (
              <button
                onClick={() => { onNavigate?.('コラム・解説', colId); setPopupTheme(null) }}
                style={{
                  marginTop:'6px', width:'100%', padding:'8px',
                  background:'rgba(170,119,255,0.08)', border:'1px solid rgba(170,119,255,0.25)',
                  borderRadius:'8px', color:'#aa77ff', cursor:'pointer',
                  fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
                }}
              >
                📖 コラムを読む →
              </button>
            )
          })()}
          <button
            onClick={() => setPopupTheme(null)}
            style={{
              marginTop:'6px', width:'100%', padding:'6px',
              background:'transparent', border:'none',
              color:'var(--text3)', cursor:'pointer',
              fontFamily:'var(--font)', fontSize:'11px',
            }}
          >
            閉じる
          </button>
        </div>
      )}
      {/* 期間セレクタ */}
      <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'16px' }}>
        <select value={mPeriod} onChange={e => setMPeriod(e.target.value)}
          style={{ background:'var(--bg3)', color:'var(--text)',
            border:'1px solid var(--border)', borderRadius:'6px',
            fontFamily:'var(--font)', fontSize:'13px',
            padding:'6px 12px', cursor:'pointer', outline:'none' }}>
          {[{v:'1d',l:'1日'},{v:'5d',l:'1週間'},{v:'1mo',l:'1ヶ月'},{v:'3mo',l:'3ヶ月'},{v:'6mo',l:'6ヶ月'}].map(p => (
            <option key={p.v} value={p.v} disabled={!canAccessPeriod(p.v)}>{p.l}{!canAccessPeriod(p.v)?' 🔒':''}</option>
          ))}
        </select>
        <span style={{ fontSize:'11px', color:'var(--text3)' }}>
          X軸=騰落率　Y軸={yAxisLabel}　円サイズ=売買代金
        </span>
      </div>

      {/* ゾーン説明 */}
      <div className="scatter-zone-desc">
        {[
          { label:'🔥 注目ゾーン（右上）', desc:'上昇＋出来高急増＝最強シグナル', color:'#ff5370' },
          { label:'⚠️ 売り圧力（左上）',   desc:'下落＋出来高急増＝強い売り',    color:'#00c48c' },
          { label:'📈 静かな上昇（右下）',  desc:'上昇＋出来高少＝じわり上昇',    color:'#ff8c42' },
          { label:'❄️ 静かな下落（左下）',  desc:'弱含みだが動意なし',             color:'#4a9eff' },
        ].map(z => (
          <div key={z.label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:z.color, flexShrink:0 }} />
            <span style={{ color:'var(--text3)' }}>{z.label}：</span>
            <span style={{ color:'var(--text2)' }}>{z.desc}</span>
          </div>
        ))}
      </div>

      {/* SVGチャート */}
      <div className="heatmap-chart-shell">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="heatmap-main-svg"
          style={{ width:'100%', display:'block',
            background:'var(--bg2)', borderRadius:'12px',
            border:'1px solid var(--border)' }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* ゾーン背景 */}
          {zones.map((z, i) => (
            <g key={i}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h}
                fill={z.bg} rx="4"
                stroke={z.border || 'none'} strokeWidth={z.border ? 0.8 : 0}
                strokeDasharray="4,3" />
            </g>
          ))}

          {/* グリッド線 */}
          {xTicks.map(v => (
            <line key={v} x1={xS(v)} y1={PT} x2={xS(v)} y2={PT+GH}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,4" />
          ))}
          {yTicks.map(v => (
            <line key={v} x1={PL} y1={yS(v)} x2={PL+GW} y2={yS(v)}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,4" />
          ))}

          {/* ゼロライン */}
          <line x1={x0} y1={PT} x2={x0} y2={PT+GH}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5,3" />
          <line x1={PL} y1={y0} x2={PL+GW} y2={y0}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5,3" />

          {/* ゾーンラベル */}
          <text x={x0+8} y={PT+16} fontSize="11" fill="rgba(255,83,112,0.85)" fontWeight="700">🔥 注目ゾーン</text>
          <text x={PL+6} y={PT+16} fontSize="11" fill="rgba(0,196,140,0.8)" fontWeight="700">⚠️ 売り圧力</text>
          <text x={x0+8} y={PT+GH-8} fontSize="11" fill="rgba(255,140,66,0.7)" fontWeight="600">📈 静かな上昇</text>
          <text x={PL+6} y={PT+GH-8} fontSize="11" fill="rgba(74,158,255,0.65)" fontWeight="600">❄️ 静かな下落</text>

          {/* バブル（ホバーされていないものを先に描画） */}
          {filtered
            .filter(d => d.theme !== hovered?.theme)
            .map(d => {
              const cx = xS(d.pct)
              const cy = yS(d.volume_chg ?? 0)
              const r  = rS(d.trade_value)
              const col = bColor(d.pct)
              return (
                <g key={d.theme}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    const svg = e.currentTarget.closest('svg')
                    const rect = svg.getBoundingClientRect()
                    const scaleX = W / rect.width
                    setHovered(d)
                    setSelectedTheme(d)
                    setTooltipPos({
                      x: cx,
                      y: cy - r - 6,
                    })
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedTheme(d); setPopupTheme(d); setPopupPos({ x: e.clientX, y: e.clientY }) }}
                >
                  {selectedTheme?.theme === d.theme && (
                    <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
                  )}
                  <circle cx={cx} cy={cy} r={r}
                    fill={col} fillOpacity="0.75"
                    stroke={col} strokeWidth="1.2" strokeOpacity="0.9" />
                  {r >= 16 && (
                    <text x={cx} y={cy+3} textAnchor="middle"
                      fontSize={Math.min(10, r * 0.55)} fill="white"
                      fontWeight="600" style={{ pointerEvents:'none' }}>
                      {d.theme.length > 6 ? d.theme.slice(0, 6) + '…' : d.theme}
                    </text>
                  )}
                </g>
              )
            })
          }

          {/* ホバー中のバブル（最前面） */}
          {hovered && (() => {
            const d = hovered
            const cx = xS(d.pct)
            const cy = yS(d.volume_chg ?? 0)
            const r  = rS(d.trade_value)
            const col = bColor(d.pct)
            return (
              <g key="hovered"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHovered(d); setSelectedTheme(d) }}
                onClick={(e) => { e.stopPropagation(); setSelectedTheme(d); setPopupTheme(d); setPopupPos({ x: e.clientX, y: e.clientY }) }}
              >
                <circle cx={cx} cy={cy} r={r + 3}
                  fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
                <circle cx={cx} cy={cy} r={r}
                  fill={col} fillOpacity="0.9"
                  stroke={col} strokeWidth="1.5" />
                <text x={cx} y={cy+4} textAnchor="middle"
                  fontSize="10" fill="white" fontWeight="700"
                  style={{ pointerEvents:'none' }}>
                  {d.theme.length > 8 ? d.theme.slice(0,8)+'…' : d.theme}
                </text>

                {/* ⑥ ツールチップ（大きく表示） */}
                {(() => {
                  const TW = 210, TH = 90
                  const tx = cx + r + 8 > W - TW ? cx - TW - r - 4 : cx + r + 4
                  const ty = Math.max(PT, Math.min(PT + GH - TH, cy - TH/2))
                  return (
                    <g style={{ pointerEvents:'none' }}>
                      <rect x={tx} y={ty} width={TW} height={TH}
                        rx="8" fill="#1a1f2e" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                      <text x={tx+12} y={ty+20} fontSize="13" fill="#e8f0ff" fontWeight="700">
                        {d.theme}
                      </text>
                      <text x={tx+12} y={ty+38} fontSize="12" fill={bColor(d.pct)}>
                        {'騰落率: ' + (d.pct >= 0 ? '+' : '') + (d.pct?.toFixed(2) ?? '-') + '%'}
                      </text>
                      <text x={tx+12} y={ty+56} fontSize="12" fill={(d.volume_chg ?? 0) >= 0 ? '#ff8c42' : '#4a9eff'}>
                        {(yAxisLabel + ': ') + (getY(d) >= 0 ? '+' : '') + getY(d).toFixed(1) + '%'}
                      </text>
                      <text x={tx+12} y={ty+74} fontSize="12" fill="#8b949e">
                        {'売買代金: ' + fmtL(d.trade_value)}
                      </text>
                    </g>
                  )
                })()}
              </g>
            )
          })()}

          {/* X軸ラベル */}
          {xTicks.map(v => (
            <text key={v} x={xS(v)} y={PT+GH+16}
              textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">
              {v >= 0 ? '+' : ''}{v}%
            </text>
          ))}
          <text x={PL + GW/2} y={H-4}
            textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)">
            ← 下落　　騰落率　　上昇 →
          </text>

          {/* Y軸ラベル */}
          {yTicks.map(v => (
            <text key={v} x={PL-6} y={yS(v)+4}
              textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.4)">
              {v >= 0 ? '+' : ''}{v}%
            </text>
          ))}
          <text x={16} y={PT + GH/2}
            textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)"
            transform={`rotate(-90, 16, ${PT + GH/2})`}>
            {yAxisLabel}
          </text>

          {/* 凡例（売買代金バブルサイズ） */}
          {[{tv:500e8,l:'5000億'},{tv:100e8,l:'1000億'},{tv:20e8,l:'200億'}].map((item, i) => {
            const r = rS(item.tv)
            const bx = PL + GW + PR - 24
            const by = PT + 20 + i * 44
            return (
              <g key={i}>
                <circle cx={bx} cy={by + r} r={r}
                  fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <text x={bx} y={by + r*2 + 12}
                  textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.4)">
                  {item.l}
                </text>
              </g>
            )
          })}

          {/* クリック誘導 */}
          {onNavigate && (
            <text x={PL + GW/2} y={PT - 12}
              textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">
              バブルをタップ → 詳細ポップアップ表示
            </text>
          )}
        </svg>
      </div>

      {/* 上位テーマリスト（注目ゾーン） */}
      {(() => {
        const hot = filtered
          .filter(d => d.pct > 0 && (d.volume_chg ?? 0) > 0)
          .sort((a, b) => (b.pct * 0.6 + (b.volume_chg ?? 0) * 0.4) - (a.pct * 0.6 + (a.volume_chg ?? 0) * 0.4))
          .slice(0, 5)
        if (!hot.length) return null
        return (
          <div style={{ marginTop:'16px', padding:'14px 18px',
            background:'rgba(220,60,60,0.06)', border:'1px solid rgba(220,60,60,0.15)',
            borderRadius:'8px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(220,80,80,0.9)',
              marginBottom:'10px', letterSpacing:'0.08em' }}>
              🔥 注目ゾーン上位（上昇＋出来高増加）
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {hot.map(d => (
                <div key={d.theme} style={{
                  background:'var(--bg2)', border:'1px solid rgba(220,60,60,0.2)',
                  borderRadius:'6px', padding:'6px 12px',
                  display:'flex', alignItems:'center', gap:'8px',
                }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text)' }}>{d.theme}</span>
                  <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color:'#ff5370', fontWeight:700 }}>
                    {d.pct >= 0 ? '+' : ''}{d.pct?.toFixed(1)}%
                  </span>
                  <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color:'#ff8c42' }}>
                    {'出来高' + (d.volume_chg >= 0 ? '+' : '') + d.volume_chg?.toFixed(0) + '%'}
                  </span>
                  {onNavigate && (
                    <button onClick={() => onNavigate('テーマ別詳細', d.theme)}
                      style={{ padding:'2px 8px', borderRadius:'4px', fontSize:'10px',
                        background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                        color:'#aa77ff', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                      詳細 →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      <SelectedThemePanel
        theme={selectedTheme?.theme}
        period={mPeriod}
        bubble={selectedTheme}
        onNavigate={onNavigate}
      />
    </div>
  )
}



export default function Heatmap({ onNavigate }) {
  const { canAccessPeriod } = useSubscription()
  const [mPeriod, setMPeriod] = useState('3mo')
  useEffect(() => { if (!canAccessPeriod(mPeriod)) setMPeriod('3mo') }, [mPeriod, canAccessPeriod])
  const { data: momentumRaw, loading: loadingM } = useMomentum(mPeriod)
  const momentumData = momentumRaw?.data || []

  return (
    <div style={{ padding:'20px 24px 48px', maxWidth:'1280px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
        テーマヒートマップ
      </h1>

      {/* ⑥ タブ削除・散布図を直接表示 */}
      <BubbleScatter data={momentumData} mPeriod={mPeriod} setMPeriod={setMPeriod} onNavigate={onNavigate} canAccessPeriod={canAccessPeriod} />

      <style>{`
        /* ⑥ PC版：注目ゾーン説明を横並び4列 */
        .scatter-zone-desc {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .scatter-zone-desc > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .heatmap-chart-shell {
          width:100%;
          overflow:hidden;
          position:relative;
        }
        .heatmap-main-svg {
          min-height:390px;
          touch-action:manipulation;
        }
        .heatmap-selected-empty {
          margin-top:18px;
          padding:30px 18px;
          text-align:center;
          border:1px dashed var(--border);
          border-radius:12px;
          background:var(--bg2);
          color:var(--text2);
          font-weight:700;
        }
        .heatmap-selected-empty span {
          display:block;
          margin-top:7px;
          font-size:11px;
          font-weight:400;
          color:var(--text3);
        }
        .heatmap-selected-panel {
          margin-top:20px;
          padding:20px;
          background:linear-gradient(180deg,rgba(31,45,66,.96),rgba(20,31,48,.98));
          border:1px solid var(--border);
          border-radius:14px;
          box-shadow:0 14px 34px rgba(0,0,0,.18);
        }
        .heatmap-selected-header {
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:16px;
          margin-bottom:16px;
        }
        .heatmap-selected-eyebrow {
          font-size:10px;
          color:var(--accent);
          font-weight:800;
          letter-spacing:.08em;
        }
        .heatmap-selected-header h2 {
          margin:4px 0 2px;
          font-size:21px;
          color:var(--text);
        }
        .heatmap-selected-sub { font-size:11px;color:var(--text3); }
        .heatmap-selected-actions { display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end; }
        .heatmap-selected-actions button {
          padding:8px 12px;
          border-radius:8px;
          border:1px solid rgba(74,158,255,.3);
          background:rgba(74,158,255,.09);
          color:var(--accent);
          font-family:var(--font);
          font-size:11px;
          font-weight:700;
          cursor:pointer;
        }
        .heatmap-selected-actions button.secondary {
          border-color:rgba(170,119,255,.3);
          background:rgba(170,119,255,.08);
          color:#aa77ff;
        }
        .heatmap-kpi-grid {
          display:grid;
          grid-template-columns:repeat(6,minmax(0,1fr));
          gap:8px;
          margin-bottom:14px;
        }
        .heatmap-kpi-grid > div {
          min-width:0;
          padding:10px 11px;
          background:rgba(8,18,34,.4);
          border:1px solid rgba(255,255,255,.07);
          border-radius:9px;
        }
        .heatmap-kpi-grid span { display:block;font-size:9px;color:var(--text3);margin-bottom:5px; }
        .heatmap-kpi-grid strong { display:block;font-size:13px;color:var(--text);font-family:var(--mono);overflow:hidden;text-overflow:ellipsis; }
        .heatmap-trend-grid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:10px;
        }
        .heatmap-trend-card {
          height:100%;
          padding:12px;
          border:1px solid rgba(255,255,255,.07);
          border-radius:10px;
          background:rgba(8,18,34,.35);
        }
        .heatmap-trend-head { display:flex;justify-content:space-between;gap:8px;align-items:flex-start; }
        .heatmap-trend-title { font-size:10px;font-weight:700;color:var(--text3); }
        .heatmap-trend-latest { font-size:14px;font-weight:800;color:var(--text);font-family:var(--mono);margin-top:3px; }
        .heatmap-trend-delta { font-size:10px;font-family:var(--mono); }
        .heatmap-mini-chart { width:100%;height:auto;display:block;margin-top:4px; }
        .heatmap-empty-chart { min-height:145px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text3);text-align:center; }
        .heatmap-ranking-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px; }
        .heatmap-stock-list { padding:12px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(8,18,34,.35); }
        .heatmap-stock-list-title { font-size:11px;font-weight:800;margin-bottom:7px; }
        .heatmap-stock-row { width:100%;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:7px;padding:7px 5px;border:0;border-top:1px solid rgba(255,255,255,.05);background:transparent;color:var(--text);cursor:pointer;text-align:left;font-family:var(--font); }
        .heatmap-stock-row:first-of-type { border-top:0; }
        .heatmap-stock-rank { width:21px;height:21px;border-radius:6px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--text3);font-family:var(--mono); }
        .heatmap-stock-name { min-width:0;display:flex;align-items:baseline;gap:7px; }
        .heatmap-stock-name strong { overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px; }
        .heatmap-stock-name small { color:var(--text3);font-family:var(--mono);font-size:9px; }
        .heatmap-stock-pct { font-family:var(--mono);font-size:11px;font-weight:700; }
        .heatmap-empty-list { padding:20px 8px;text-align:center;font-size:10px;color:var(--text3); }
        .heatmap-reading-guide { display:flex;gap:10px;margin-top:10px;padding:11px 13px;border-radius:9px;background:rgba(74,158,255,.05);border:1px solid rgba(74,158,255,.16);font-size:10px;line-height:1.7;color:var(--text2); }
        .heatmap-reading-guide strong { flex:0 0 auto;color:var(--accent); }
        .heatmap-mobile-metric-tabs { display:none; }
        .heatmap-panel-loading,.heatmap-panel-error { margin:8px 0;padding:9px 11px;border-radius:8px;font-size:10px; }
        .heatmap-panel-loading { color:var(--text3);background:rgba(255,255,255,.03); }
        .heatmap-panel-error { color:#ff8c42;background:rgba(255,140,66,.07);border:1px solid rgba(255,140,66,.18); }

        @media (max-width: 900px) {
          .heatmap-kpi-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .heatmap-trend-grid { grid-template-columns:1fr 1fr; }
          .heatmap-trend-grid > div:last-child { grid-column:1 / -1; }
        }
        @media (max-width: 640px) {
          .scatter-zone-desc {
            grid-template-columns: 1fr 1fr;
            font-size: 9px;
            gap:5px;
          }
          .scatter-zone-desc > div span:last-child { display:none; }
          .heatmap-chart-shell {
            overflow-x:auto;
            margin-left:-4px;
            margin-right:-4px;
            width:calc(100% + 8px);
            -webkit-overflow-scrolling:touch;
          }
          .heatmap-main-svg {
            min-width:620px;
            min-height:auto;
          }
          .heatmap-selected-panel { padding:14px 10px;margin-top:14px;border-radius:11px; }
          .heatmap-selected-header { display:block;margin-bottom:12px; }
          .heatmap-selected-header h2 { font-size:18px; }
          .heatmap-selected-actions { margin-top:9px;justify-content:flex-start; }
          .heatmap-selected-actions button { flex:1;padding:9px 7px; }
          .heatmap-kpi-grid { grid-template-columns:repeat(3,minmax(0,1fr));gap:5px; }
          .heatmap-kpi-grid > div { padding:8px 7px; }
          .heatmap-kpi-grid strong { font-size:11px; }
          .heatmap-mobile-metric-tabs { display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:10px 0 7px; }
          .heatmap-mobile-metric-tabs button { padding:8px 4px;border-radius:7px;border:1px solid var(--border);background:var(--bg3);color:var(--text3);font-family:var(--font);font-size:10px; }
          .heatmap-mobile-metric-tabs button.active { color:var(--accent);border-color:rgba(74,158,255,.35);background:rgba(74,158,255,.09);font-weight:700; }
          .heatmap-trend-grid { display:block; }
          .heatmap-trend-grid > div { display:none; }
          .heatmap-trend-grid > div.mobile-active { display:block; }
          .heatmap-ranking-grid { grid-template-columns:1fr;gap:7px; }
          .heatmap-reading-guide { display:block; }
          .heatmap-reading-guide strong { display:block;margin-bottom:4px; }
          .heatmap-stock-row { padding:8px 4px; }
        }
      `}</style>
    </div>
  )
}
