import { useState, useRef } from 'react'
import { useThemes } from '../../hooks/useMarketData'
import RefreshIndicator from '../RefreshIndicator'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1週間', value: '5d'  },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]

// ── フォーマット ──
function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '兆'
  if (n >= 1e8) {
    const v = n / 1e8
    return (v >= 100 ? Math.round(v) : v.toFixed(1)) + '億'
  }
  if (n >= 1e4) {
    const v = n / 1e4
    if (v >= 1000) return Math.round(v) + '万'
    if (v >= 100)  return v.toFixed(0) + '万'
    return v.toFixed(1) + '万'
  }
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

function KpiCard({ label, value, valueColor, sub, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '16px 18px',
      animation: `fadeUp 0.4s ease ${delay}s both`,
      transition: 'border-color 0.2s, transform 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(91,156,246,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, lineHeight: 1, marginBottom: '6px', color: valueColor || 'var(--text)' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{sub}</div>
    </div>
  )
}

// ── Chart.jsを使った縦棒グラフ ──
function BarChart({ items, valueKey = 'pct', formatFn, colorFn, height = 320, title }) {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!items || !items.length || !canvasRef.current) return

    // Chart.jsを動的import
    import('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js')
      .then(() => {
        const Chart = window.Chart
        if (!Chart) return

        // 既存チャートを破棄
        if (chartRef.current) {
          chartRef.current.destroy()
          chartRef.current = null
        }

        const vals   = items.map(t => t[valueKey] || 0)
        const colors = vals.map(v => colorFn(v))
        const borderColors = colors.map(c => c + 'ff')

        const ctx = canvasRef.current.getContext('2d')

        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: items.map(t => t.theme || t.name || ''),
            datasets: [{
              data: vals,
              backgroundColor: colors.map(c => c + 'cc'),
              borderColor: borderColors,
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(20,24,32,0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleColor: '#e8eaf0',
                bodyColor: '#9aa0b4',
                padding: 10,
                callbacks: {
                  label: (ctx) => {
                    const v = ctx.parsed.y
                    return formatFn
                      ? ` ${formatLarge(v)}`
                      : ` ${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
                  }
                }
              },
              datalabels: { display: false },
            },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                  color: 'rgba(180,190,210,0.8)',
                  font: { size: 10, family: "'Noto Sans JP', sans-serif" },
                  maxRotation: 45,
                  minRotation: 30,
                },
                border: { color: 'rgba(255,255,255,0.1)' },
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                ticks: {
                  color: 'rgba(150,160,180,0.8)',
                  font: { size: 10, family: "'DM Mono', monospace" },
                  callback: (v) => formatFn ? formatLarge(v) : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
                },
                border: { color: 'transparent' },
              },
            },
          }
        })
      })
      .catch(() => {
        // CDN読み込み失敗時はフォールバック表示
      })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [items, valueKey])

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '16px',
      position: 'relative',
    }}>
      {title && (
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', marginBottom: '12px', letterSpacing: '0.06em' }}>
          {title}
        </div>
      )}
      <div style={{ height: `${height}px`, position: 'relative' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

// ── TOP5比較グラフ（上昇・下落を並べて表示）──
function Top5Pair({ top5, bot5, topTitle, botTitle, topColorFn, botColorFn, valueKey, formatFn }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="top5-grid">
      <BarChart items={top5} valueKey={valueKey} formatFn={formatFn} colorFn={topColorFn} height={240} title={topTitle} />
      <BarChart items={bot5} valueKey={valueKey} formatFn={formatFn} colorFn={botColorFn} height={240} title={botTitle} />
    </div>
  )
}

export default function ThemeList() {
  const [period, setPeriod] = useState('1mo')
  const { data, loading, refreshing, updatedAt, refresh } = useThemes(period)
  const lastUpdate = updatedAt ? new Date(updatedAt.replace(/\//g, '-').replace(' JST','')) : null
  const error = null

  const themes   = data?.themes  ?? []
  const summary  = data?.summary ?? {}
  const byPctAsc = [...themes].sort((a, b) => a.pct - b.pct)
  const byVol    = [...themes].sort((a, b) => (b.volume || 0) - (a.volume || 0))
  const byTV     = [...themes].sort((a, b) => (b.trade_value || 0) - (a.trade_value || 0))
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

      <div style={{ padding: '20px 24px 48px', maxWidth: '100%', overflowX: 'hidden' }}>
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
            {/* ── KPIカード ── */}
            <div className="responsive-grid-4" style={{ marginBottom: '8px' }}>
              <KpiCard delay={0.05}
                label="上昇テーマ"
                value={<span>{summary.rise}<span style={{ fontSize: '16px', color: 'var(--text2)', fontWeight: 400 }}> / {summary.total}</span></span>}
                valueColor="var(--red)"
                sub={`下落: ${summary.fall}テーマ`} />
              <KpiCard delay={0.1}
                label="全テーマ平均騰落率"
                value={`${summary.avg >= 0 ? '+' : ''}${summary.avg?.toFixed(2)}%`}
                valueColor={summary.avg >= 0 ? 'var(--red)' : 'var(--green)'}
                sub={`期間: ${periodLabel}`} />
              <KpiCard delay={0.15}
                label="資金流入 TOP"
                value={<span style={{ fontSize: '17px', color: 'var(--red)', fontWeight: 700 }}>{summary.top?.theme}</span>}
                sub={<span style={{ color: 'var(--red)', fontWeight: 600 }}>+{summary.top?.pct?.toFixed(1)}%</span>} />
              <KpiCard delay={0.2}
                label="資金流出 TOP"
                value={<span style={{ fontSize: '17px', color: 'var(--green)', fontWeight: 700 }}>{summary.bot?.theme}</span>}
                sub={<span style={{ color: 'var(--green)', fontWeight: 600 }}>{summary.bot?.pct?.toFixed(1)}%</span>} />
            </div>

            {/* ── 騰落ランキング TOP5 ── */}
            <SectionHead title="📈 騰落ランキング TOP5" />
            <Top5Pair
              top5={themes.slice(0, 5)} bot5={byPctAsc.slice(0, 5)}
              topTitle="▲ 上昇テーマ TOP5" botTitle="▼ 下落テーマ TOP5"
              topColorFn={pctColor} botColorFn={pctColor}
              valueKey="pct" />

            {/* ── 出来高・売買代金 TOP5 ── */}
            <SectionHead title="💹 出来高・売買代金 TOP5" />
            <Top5Pair
              top5={byVol.slice(0, 5)} bot5={byTV.slice(0, 5)}
              topTitle="🔢 出来高 TOP5" botTitle="💴 売買代金 TOP5"
              topColorFn={blueColor} botColorFn={orangeColor}
              valueKey="volume" formatFn={true} />

            {/* ── 全テーマ 騰落率 ── */}
            <SectionHead title="📊 全テーマ 騰落率ランキング" />
            <BarChart items={themes} valueKey="pct" colorFn={pctColor} height={320} />

            {/* ── 全テーマ 出来高 ── */}
            <SectionHead title="🔢 全テーマ 出来高ランキング" />
            <BarChart items={byVol} valueKey="volume" colorFn={blueColor} formatFn={true} height={300} />

            {/* ── 全テーマ 売買代金 ── */}
            <SectionHead title="💴 全テーマ 売買代金ランキング" />
            <BarChart items={byTV} valueKey="trade_value" colorFn={orangeColor} formatFn={true} height={300} />
          </>
        )}
      </div>

      <style>{`
        .top5-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 700px) {
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
