import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1週間', value: '5d' },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]

function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '兆'
  if (n >= 1e8)  return Math.floor(n / 1e8) + '億'  // 億は整数表示
  if (n >= 1e4)  return Math.floor(n / 1e4) + '万'
  return n.toLocaleString()
}

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text3)' }}>
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} style={{
          display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent)', margin: '0 3px',
          animation: `pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}
      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text2)' }}>データ取得中...</div>
    </div>
  )
}

// セクション見出し（白・視認性重視）
function SectionHead({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0 14px' }}>
      <span style={{
        fontSize: '14px', fontWeight: 700, color: '#ffffff',
        letterSpacing: '0.02em', whiteSpace: 'nowrap',
      }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}

// KPIカード（ラベル白・視認性重視）
function KpiCard({ label, value, valueColor, sub, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '18px 20px', position: 'relative', overflow: 'hidden',
      animation: `fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      transition: 'border-color 0.2s, transform 0.15s', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74,158,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px',
        background: 'linear-gradient(90deg,transparent,rgba(74,158,255,0.5),transparent)' }} />
      {/* ラベルを白に */}
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#ffffff',
        textTransform: 'uppercase', marginBottom: '12px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '28px', fontWeight: 700,
        letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px', color: valueColor }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{sub}</div>
    </div>
  )
}

// ── ユーティリティ：目盛り計算 ──
// 目盛り幅を最大値から自動計算（騰落率用・きれいな数値）
function calcTickStep(maxAbs) {
  // 最大値に基づいてきれいな目盛り幅を選択
  // 例：max=3% → step=1%, max=8% → step=2%, max=15% → step=5%
  const raw = maxAbs / 4  // 4〜5分割を目安
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  let step
  if      (norm <= 1)   step = 1   * mag
  else if (norm <= 2)   step = 2   * mag
  else if (norm <= 2.5) step = 2.5 * mag
  else if (norm <= 5)   step = 5   * mag
  else                  step = 10  * mag
  return step
}

function calcGridLines(maxAbs, allPos, allNeg, PT, chartH, isPct) {
  const step  = calcTickStep(maxAbs)
  const lines = []
  // 小数点桁数：stepが1未満なら小数表示
  const dec = step < 1 ? 1 : (step < 10 ? 1 : 0)

  if (allPos) {
    const topVal = Math.ceil(maxAbs / step) * step
    for (let v = 0; v <= topVal + step * 0.01; v += step) {
      const y = PT + chartH - (v / topVal) * chartH
      const label = isPct ? (v === 0 ? '0%' : `+${v.toFixed(dec)}%`) : null
      lines.push({ y, value: v, label })
    }
  } else if (allNeg) {
    const botVal = Math.ceil(maxAbs / step) * step
    for (let v = botVal; v >= -step * 0.01; v -= step) {
      const y = PT + (v / botVal) * chartH
      const label = isPct ? (v === 0 ? '0%' : `-${v.toFixed(dec)}%`) : null
      lines.push({ y, value: -v, label })
    }
  } else {
    const range = Math.ceil(maxAbs / step) * step
    const yZero = PT + chartH / 2
    for (let v = range; v >= -range - step * 0.01; v -= step) {
      const y = yZero - (v / range) * (chartH / 2)
      const sign = v > 0 ? '+' : ''
      const label = isPct ? `${sign}${v.toFixed(dec)}%` : null
      lines.push({ y, value: v, label })
    }
  }
  return lines
}

// ── 数値フォーマット（売買代金・出来高用）──
// 億は小数点第1位まで、数千万は有効数字4桁
function smartFormat(v) {
  if (!v) return '0'
  if (v >= 1e12) {
    return (v / 1e12).toFixed(1) + '兆'
  }
  if (v >= 1e8) {
    // 億単位：小数点第1位まで（例：4519.5億→4520億、1.2億→1.2億）
    const oku = v / 1e8
    return oku >= 100
      ? Math.round(oku) + '億'          // 100億以上は整数
      : oku.toFixed(1) + '億'           // 100億未満は小数第1位
  }
  if (v >= 1e4) {
    // 万単位：有効数字4桁（例：4519.5万→4520万、12.3万→12.3万）
    const man = v / 1e4
    if (man >= 1000) return Math.round(man) + '万'
    if (man >= 100)  return man.toFixed(0) + '万'
    if (man >= 10)   return man.toFixed(1) + '万'
    return man.toFixed(2) + '万'
  }
  return v.toLocaleString()
}

// 縦棒グラフ（SVG）- 改善版
function VBarChart({ items, colorFn, valueKey = 'pct', formatFn, height = 280 }) {
  if (!items || !items.length) return null

  const isPct = !formatFn  // 騰落率グラフかどうか

  // バー幅を固定して横スクロール可能に
  const BAR_W   = 32
  const BAR_GAP = 18
  const PL = 50, PR = 16, PT = 32, PB = 96
  const UNIT  = BAR_W + BAR_GAP
  const W     = PL + items.length * UNIT + PR
  const chartH = height - PT - PB

  const vals   = items.map(t => t[valueKey] || 0)
  const maxVal = Math.max(...vals, 0)
  const minVal = Math.min(...vals, 0)
  const maxAbs = Math.max(Math.abs(maxVal), Math.abs(minVal), 0.01)

  const allPos = minVal >= 0
  const allNeg = maxVal <= 0

  // Y軸スケール
  const topRange = allPos ? Math.ceil(maxVal * 1.05) : maxAbs
  const botRange = allNeg ? Math.ceil(Math.abs(minVal) * 1.05) : maxAbs

  const yZero = allPos ? PT + chartH
    : allNeg  ? PT
    : PT + (maxAbs / (maxAbs + maxAbs)) * chartH

  const yOf = (v) => {
    if (allPos) return PT + chartH - (v / topRange) * chartH
    if (allNeg) return PT + (Math.abs(v) / botRange) * chartH
    // 混在
    const range = Math.ceil(maxAbs * 1.05 / calcTickStep(maxAbs)) * calcTickStep(maxAbs)
    return (PT + chartH / 2) - (v / range) * (chartH / 2)
  }

  // グリッドライン（自動目盛り）
  const gridLines = calcGridLines(maxAbs, allPos, allNeg, PT, chartH, isPct)

  const xOf = (i) => PL + i * UNIT

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '12px 8px', overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <svg
        width={Math.max(W, 320)}
        height={height}
        style={{ display: 'block', minWidth: `${Math.max(W, 320)}px` }}
      >
        {/* グリッドライン */}
        {gridLines.map(({ y, label }, gi) => (
          <g key={gi}>
            <line x1={PL} y1={y} x2={W - PR} y2={y}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {label && (
              <text x={PL - 5} y={y + 4} textAnchor="end"
                fill="var(--text3)" fontSize="9" fontFamily="DM Mono, monospace">
                {label}
              </text>
            )}
          </g>
        ))}

        {/* 0ライン */}
        <line x1={PL} y1={yOf(0)} x2={W - PR} y2={yOf(0)}
          stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />

        {/* バー */}
        {items.map((item, i) => {
          const v  = item[valueKey] || 0
          const c  = colorFn(v, item)
          const x  = xOf(i)
          const y0 = yOf(0)
          const yv = yOf(v)
          const barY = v >= 0 ? yv : y0
          const barH = Math.max(2, Math.abs(yv - y0))

          // 値ラベル：重なり防止のため隣との間隔があれば表示
          const lv = isPct
            ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
            : smartFormat(v)

          // ラベルY位置：バーの外側（上下）
          const labelY = v >= 0 ? barY - 5 : barY + barH + 13

          return (
            <g key={item.theme + i}>
              {/* バー本体 */}
              <rect x={x} y={barY} width={BAR_W} height={barH}
                rx="3" fill={c} opacity="0.88" />

              {/* 値ラベル（コンパクト・重なり防止：縦書きで回転表示） */}
              <text
                x={x + BAR_W / 2}
                y={v >= 0 ? barY - 4 : barY + barH + 4}
                textAnchor={v >= 0 ? 'end' : 'start'}
                fill={c}
                fontSize="9"
                fontFamily="DM Mono, monospace"
                fontWeight="700"
                transform={`rotate(-90, ${x + BAR_W / 2}, ${v >= 0 ? barY - 4 : barY + barH + 4})`}
              >
                {lv}
              </text>

              {/* X軸テーマ名（90度回転・全文表示） */}
              <text
                x={x + BAR_W / 2}
                y={height - PB + 8}
                textAnchor="end"
                fill="var(--text2)"
                fontSize="10"
                fontFamily="DM Sans, Noto Sans JP, sans-serif"
                transform={`rotate(-90, ${x + BAR_W / 2}, ${height - PB + 8})`}
              >
                {item.theme}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// TOP5 縦棒グラフ 2カラム
function Top5Grid({ top5, bot5, topTitle, botTitle, topColorFn, botColorFn, valueKey, formatFn }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="top5-grid">
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{topTitle}</div>
        <VBarChart items={top5} colorFn={topColorFn} valueKey={valueKey} formatFn={formatFn} height={200} />
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{botTitle}</div>
        <VBarChart items={bot5} colorFn={botColorFn} valueKey={valueKey} formatFn={formatFn} height={200} />
      </div>
    </div>
  )
}

export default function ThemeList() {
  const [period,  setPeriod]  = useState('1mo')
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null)
      try {
        const res  = await fetch(`${API}/api/themes?period=${period}`)
        const json = await res.json()
        setData(json)
      } catch {
        setError('データの取得に失敗しました。バックエンドが起動しているか確認してください。')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [period])

  const themes  = data?.themes  ?? []
  const summary = data?.summary ?? {}
  const periodLabel = PERIODS.find(p => p.value === period)?.label ?? period

  const byPctAsc = [...themes].sort((a, b) => a.pct - b.pct)
  const byVol    = [...themes].sort((a, b) => (b.volume || 0) - (a.volume || 0))
  const byTV     = [...themes].sort((a, b) => (b.trade_value || 0) - (a.trade_value || 0))

  // カラー定義
  const redColor    = () => '#ff4560'   // 上昇：赤
  const greenColor  = () => '#7ed957'   // 下落：黄緑
  const blueColor   = () => '#4a9eff'   // 出来高：青
  const orangeColor = () => '#ff8c42'   // 売買代金：オレンジ
  const pctColor    = (v) => v >= 0 ? '#ff4560' : '#7ed957'

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      {/* ページタイトル */}
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
        テーマ一覧
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--text2)' }}>日本株テーマ別の騰落率・資金動向</span>
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px',
          background: 'rgba(74,158,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(74,158,255,0.2)' }}>
          {periodLabel}
        </span>
        {summary.rise != null && (
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px',
            background: 'rgba(255,69,96,0.12)', color: '#ff4560', border: '1px solid rgba(255,69,96,0.2)' }}>
            {summary.rise} / {summary.total} 上昇
          </span>
        )}
      </div>

      {/* 期間選択 */}
      <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
        {PERIODS.map(p => <option key={p.value} value={p.value} style={{ background: 'var(--bg3)' }}>{p.label}</option>)}
      </select>

      {loading ? <Loading /> : error ? (
        <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.2)',
          borderRadius: '8px', padding: '16px 20px', color: '#ff4560', fontSize: '13px', marginTop: '20px' }}>
          {error}
        </div>
      ) : (
        <>
          {/* ── KPIカード ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '32px' }}
            className="kpi-grid">
            {/* 「上昇テーマ」に名称変更 */}
            <KpiCard delay={0.05}
              label="上昇テーマ"
              value={
                <span>
                  {summary.rise}
                  <span style={{ fontSize: '16px', color: 'var(--text2)', fontWeight: 400 }}> / {summary.total}</span>
                </span>
              }
              valueColor="#ff4560"
              sub={`下落: ${summary.fall}テーマ`} />
            <KpiCard delay={0.1}
              label="全テーマ 平均騰落率"
              value={`${summary.avg >= 0 ? '+' : ''}${summary.avg?.toFixed(2)}%`}
              valueColor={summary.avg >= 0 ? '#ff4560' : '#7ed957'}
              sub={`期間: ${periodLabel}`} />
            <KpiCard delay={0.15}
              label="資金流入 TOP"
              value={<span style={{ fontSize: '20px' }}>{summary.top?.theme}</span>}
              valueColor="#ffffff"
              sub={<span style={{ color: '#ff4560', fontWeight: 600 }}>+{summary.top?.pct?.toFixed(1)}%</span>} />
            <KpiCard delay={0.2}
              label="資金流出 TOP"
              value={<span style={{ fontSize: '20px' }}>{summary.bot?.theme}</span>}
              valueColor="#ffffff"
              sub={<span style={{ color: '#7ed957', fontWeight: 600 }}>{summary.bot?.pct?.toFixed(1)}%</span>} />
          </div>

          {/* ── 株価騰落ランキング TOP5（縦棒） ── */}
          <SectionHead title="📈 株価騰落ランキング TOP5" />
          <Top5Grid
            top5={themes.slice(0, 5)} bot5={byPctAsc.slice(0, 5)}
            topTitle="▲ 上昇テーマ TOP5" botTitle="▼ 下落テーマ TOP5"
            topColorFn={redColor} botColorFn={greenColor}
            valueKey="pct"
          />

          {/* ── 出来高・売買代金 TOP5（縦棒） ── */}
          <SectionHead title="💹 出来高・売買代金 TOP5" />
          <Top5Grid
            top5={byVol.slice(0, 5)} bot5={byTV.slice(0, 5)}
            topTitle="🔢 出来高 TOP5" botTitle="💴 売買代金 TOP5"
            topColorFn={blueColor} botColorFn={orangeColor}
            valueKey="volume"
            formatFn={(v) => formatLarge(v)}
          />

          {/* ── 全テーマ 騰落率ランキング（縦棒） ── */}
          <SectionHead title="📊 全テーマ 騰落率ランキング" />
          <VBarChart items={themes} colorFn={pctColor} valueKey="pct" height={280} />

          {/* ── 全テーマ 出来高ランキング（縦棒・青） ── */}
          <SectionHead title="🔢 全テーマ 出来高ランキング" />
          <VBarChart items={byVol} colorFn={blueColor} valueKey="volume"
            formatFn={(v) => formatLarge(v)} height={280} />

          {/* ── 全テーマ 売買代金ランキング（縦棒・オレンジ） ── */}
          <SectionHead title="💴 全テーマ 売買代金ランキング" />
          <VBarChart items={byTV} colorFn={orangeColor} valueKey="trade_value"
            formatFn={(v) => formatLarge(v)} height={280} />
        </>
      )}

      <style>{`
        .kpi-grid { grid-template-columns: repeat(4,1fr) !important; }
        .top5-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 900px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .top5-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', marginBottom: '24px',
  outline: 'none', appearance: 'none', WebkitAppearance: 'none',
}
