import { useState, useEffect } from 'react'
import { useHeatmap, useMonthlyHeatmap } from '../../hooks/useMarketData'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y']

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
      <div style={{ marginTop: '12px', fontSize: '12px' }}>ヒートマップ生成中...（初回は時間がかかります）</div>
    </div>
  )
}

function colorForValue(v, absMax) {
  if (v === null || v === undefined) return '#1a1e30'
  const ratio = Math.min(Math.abs(v) / absMax, 1)
  if (v > 0) {
    const r = Math.round(255 * ratio)
    const g = Math.round(40 * (1 - ratio))
    return `rgb(${r}, ${g}, ${g})`
  } else {
    const g = Math.round(196 * ratio)
    const b = Math.round(140 * ratio)
    return `rgb(0, ${g}, ${b})`
  }
}

function HeatmapTable({ data, columns }) {
  if (!data || !Object.keys(data).length) return null

  const themes = Object.keys(data)
  const allVals = themes.flatMap(t => columns.map(c => data[t][c]).filter(v => v !== null && v !== undefined))
  const absMax = Math.max(...allVals.map(Math.abs), 1)

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse', fontSize: '12px',
        fontFamily: 'var(--font)',
      }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left', minWidth: '140px' }}>テーマ</th>
            {columns.map(c => (
              <th key={c} style={thStyle}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {themes.map((theme, i) => (
            <tr key={theme} style={{ animation: `fadeUp 0.2s ease ${i * 0.02}s both` }}>
              <td style={{
                padding: '6px 12px', color: '#c0d0e8', fontSize: '12px', fontWeight: 500,
                borderBottom: '1px solid rgba(74,120,200,0.06)', whiteSpace: 'nowrap',
              }}>
                {theme}
              </td>
              {columns.map(col => {
                const v = data[theme][col]
                const bg = colorForValue(v, absMax)
                return (
                  <td key={col} style={{
                    padding: '6px 8px', textAlign: 'center',
                    background: bg, borderBottom: '1px solid rgba(0,0,0,0.2)',
                    fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '11px',
                    color: v !== null ? '#fff' : 'var(--text3)',
                    minWidth: '60px',
                  }}>
                    {v !== null && v !== undefined ? `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` : '-'}
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

const thStyle = {
  padding: '8px 8px', textAlign: 'center',
  fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
  color: 'var(--text3)', textTransform: 'uppercase',
  borderBottom: '1px solid var(--border)',
}


function AutoComment({ lines }) {
  if (!lines?.length) return null
  return (
    <div style={{
      background:'rgba(74,158,255,0.04)', border:'1px solid rgba(74,158,255,0.12)',
      borderRadius:'10px', padding:'14px 18px', margin:'0 0 20px',
      fontSize:'12px', color:'var(--text2)', lineHeight:'1.9',
    }}>
      {lines.map((line, i) => (
        <p key={i} style={{ margin: i === 0 ? '0 0 8px' : '8px 0 0' }}>{line}</p>
      ))}
    </div>
  )
}

function genHeatmapComment(data, tab, months) {
  if (!data) return null
  const themes = Object.keys(data)
  if (!themes.length) return null
  const lines = []

  if (tab === 'period') {
    // 期間別ヒートマップ：各期間での強弱を分析
    const periods = ['1W','1M','3M','6M','1Y']
    const periodLabels = { '1W':'週間', '1M':'1ヶ月', '3M':'3ヶ月', '6M':'6ヶ月', '1Y':'1年' }

    // 全期間で上昇しているテーマ
    const bullAll = themes.filter(t =>
      periods.every(p => (data[t]?.[p] ?? 0) > 0)
    )
    // 全期間で下落しているテーマ
    const bearAll = themes.filter(t =>
      periods.every(p => (data[t]?.[p] ?? 0) < 0)
    )
    // 短期強・長期弱（上がり始め）
    const risingStart = themes.filter(t =>
      (data[t]?.['1W'] ?? 0) > 1 && (data[t]?.['1M'] ?? 0) > 0 &&
      (data[t]?.['3M'] ?? 0) < 0
    )
    // 短期弱・長期強（天井圏・調整）
    const topZone = themes.filter(t =>
      (data[t]?.['1W'] ?? 0) < -1 && (data[t]?.['1M'] ?? 0) < 0 &&
      (data[t]?.['3M'] ?? 0) > 5
    )
    // 1年間で最強テーマ
    const byYear = [...themes].sort((a,b) => (data[b]?.['1Y']||0) - (data[a]?.['1Y']||0))
    const topYear = byYear.slice(0, 3)
    const botYear = byYear.slice(-3).reverse()

    lines.push(`【期間別ヒートマップ分析】全${themes.length}テーマの短期〜長期騰落率を俯瞰すると、1年間で最も強いテーマは「${topYear[0]}」(+${data[topYear[0]]?.['1Y']?.toFixed(1)}%)、次いで「${topYear[1]}」「${topYear[2]}」。逆に最弱は「${botYear[0]}」(${data[botYear[0]]?.['1Y']?.toFixed(1)}%)。`)

    if (bullAll.length > 0) {
      lines.push(`✅ 全期間（週〜1年）で一貫上昇しているテーマ：「${bullAll.slice(0,4).join('」「')}」。強いトレンドが継続しており、モメンタム戦略に適した銘柄群を含む可能性が高い。`)
    }
    if (bearAll.length > 0) {
      lines.push(`⚠️ 全期間で一貫下落しているテーマ：「${bearAll.slice(0,4).join('」「')}」。長期的な構造問題を抱えているか、セクターローテーションで資金が流出している状態。底値確認には時間が必要な可能性がある。`)
    }
    if (risingStart.length > 0) {
      lines.push(`↗ 上がり始めのシグナル（短期プラス転換・中長期はまだマイナス）：「${risingStart.slice(0,3).join('」「')}」。長期下落からの底値反転初動の可能性があり、出来高増加を確認できれば仕込み場として注目できる。`)
    }
    if (topZone.length > 0) {
      lines.push(`↘ 天井圏・調整局面の可能性（短期急落・長期はまだ強い）：「${topZone.slice(0,3).join('」「')}」。長期上昇後の利益確定売りが出ている状態。押し目水準を見極めながら、次の上昇波を狙う戦略が有効。`)
    }
    lines.push(`💡 活用ポイント：全期間緑（下落）から週次・月次が赤（上昇）に転換したテーマは「底値から上がり始め」のシグナル。逆に全期間赤から直近が緑に転じたテーマは「高値から下落し始め」の注意サイン。ヒートマップの色変化パターンで次のトレンドを先読みできる。`)
  } else {
    // 月次ヒートマップ
    const recentMonths = months?.slice(-3) || []
    if (!recentMonths.length) return null

    // 直近3ヶ月で一貫上昇
    const streak3 = themes.filter(t =>
      recentMonths.every(m => (data[t]?.[m] ?? 0) > 0)
    )
    // 直近3ヶ月で一貫下落
    const fall3 = themes.filter(t =>
      recentMonths.every(m => (data[t]?.[m] ?? 0) < 0)
    )
    // 直近月のみプラス転換（前月まで下落）
    const lastMonth = recentMonths[recentMonths.length - 1]
    const prevMonth = recentMonths[recentMonths.length - 2]
    const freshRising = themes.filter(t =>
      (data[t]?.[lastMonth] ?? 0) > 1 && (data[t]?.[prevMonth] ?? 0) < 0
    )
    const freshFalling = themes.filter(t =>
      (data[t]?.[lastMonth] ?? 0) < -1 && (data[t]?.[prevMonth] ?? 0) > 0
    )

    const allLastMonthPct = themes.map(t => data[t]?.[lastMonth] ?? 0)
    const avgLastMonth = allLastMonthPct.reduce((s,v)=>s+v,0) / (allLastMonthPct.length||1)

    lines.push(`【月次ヒートマップ分析】直近月（${lastMonth}）の平均騰落率は${avgLastMonth >= 0 ? '+' : ''}${avgLastMonth.toFixed(1)}%。${streak3.length > 0 ? `直近3ヶ月連続上昇テーマ：「${streak3.slice(0,4).join('」「')}」が強いトレンドを示す。` : '3ヶ月連続上昇テーマは少なく、上昇は散発的。'}`)

    if (freshRising.length > 0) {
      lines.push(`↗ 今月プラス転換（前月まで下落していた）テーマ：「${freshRising.slice(0,4).join('」「')}」。下落から反転した初動の可能性があり、今後の継続性に注目。`)
    }
    if (freshFalling.length > 0) {
      lines.push(`↘ 今月マイナス転換（前月まで上昇していた）テーマ：「${freshFalling.slice(0,4).join('」「')}」。上昇トレンドが一服した可能性。調整か転換かを見極める必要がある。`)
    }
    if (fall3.length > 0) {
      lines.push(`⚠️ 直近3ヶ月連続下落テーマ：「${fall3.slice(0,4).join('」「')}」。中期的な下落トレンドが継続しており、反転サインが出るまでは慎重姿勢が望ましい。`)
    }
    lines.push(`💡 月次ヒートマップの見方：同じテーマで「緑→赤→赤」のパターンは上昇トレンドの初期段階を示すことが多い。逆に「赤→緑→緑」は調整入りのサインとして機能しやすい。`)
  }
  return lines
}

export default function Heatmap() {
  const [tab,           setTab]           = useState('period')
  const [heatmapData,   setHeatmapData]   = useState(null)
  const [monthlyData,   setMonthlyData]   = useState(null)
  const [months,        setMonths]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)

  useEffect(() => {
    const CACHE_KEY = `heatmap_${tab}`
    const fetch_ = async () => {
      // キャッシュから即時表示
      try {
        const cached = JSON.parse(localStorage.getItem('swjp_v2_' + CACHE_KEY) || 'null')
        if (cached?.data) {
          const d = cached.data
          if (tab === 'period') setHeatmapData(d.heatmap || d)
          else { setMonthlyData(d.heatmap || d); setMonths(d.months || []) }
          setLoading(false)
        }
      } catch {}

      // market.jsonから取得（GitHub Actions生成）
      try {
        const res  = await fetch('/data/market.json?t=' + Date.now())
        const json = await res.json()
        if (tab === 'period' && json.heatmap) {
          setHeatmapData(json.heatmap.data)
          localStorage.setItem('swjp_v2_' + CACHE_KEY, JSON.stringify({ data: { heatmap: json.heatmap.data }, ts: Date.now() }))
          setLoading(false); return
        }
      } catch {}

      // フォールバック：Render API
      setLoading(true); setError(null)
      try {
        if (tab === 'period') {
          const res  = await fetch(`${API}/api/heatmap`)
          const json = await res.json()
          setHeatmapData(json.data)
          localStorage.setItem('swjp_v2_' + CACHE_KEY, JSON.stringify({ data: { heatmap: json.data }, ts: Date.now() }))
        } else {
          const res  = await fetch(`${API}/api/heatmap/monthly`)
          const json = await res.json()
          setMonthlyData(json.data); setMonths(json.months)
          localStorage.setItem('swjp_v2_' + CACHE_KEY, JSON.stringify({ data: { heatmap: json.data, months: json.months }, ts: Date.now() }))
        }
      } catch {
        setError('データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [tab])

  const TABS = [
    { key: 'period',  label: '🟥 期間別ヒートマップ' },
    { key: 'monthly', label: '📅 月次推移' },
  ]

  const heatComment = genHeatmapComment(
    tab === 'period' ? heatmapData : monthlyData, tab, months
  )

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: '1280px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        ヒートマップ
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        テーマ別騰落率を色で直感的に把握。赤=上昇、緑=下落
      </p>
      <AutoComment lines={heatComment} />

      {/* タブ */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px',
        borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
            border: 'none', background: 'transparent',
            color: tab === t.key ? 'var(--text)' : 'var(--text2)',
            fontWeight: tab === t.key ? 600 : 400,
            fontFamily: 'var(--font)',
            borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 凡例 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '12px', color: 'var(--text3)' }}>
        <span>▲ 赤 = 上昇</span>
        <span>▼ 緑 = 下落</span>
        <span>■ 黒 = データなし</span>
      </div>

      {loading ? <Loading /> : error ? (
        <div style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</div>
      ) : (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '16px',
        }}>
          {tab === 'period' ? (
            <HeatmapTable data={heatmapData} columns={PERIODS} />
          ) : (
            <HeatmapTable data={monthlyData} columns={months.slice(-6)} />
          )}
        </div>
      )}
    </div>
  )
}
