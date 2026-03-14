import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = ['1W', '1M', '3M', '6M', '1Y']

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

export default function Heatmap() {
  const [tab,           setTab]           = useState('period')
  const [heatmapData,   setHeatmapData]   = useState(null)
  const [monthlyData,   setMonthlyData]   = useState(null)
  const [months,        setMonths]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true); setError(null)
      try {
        if (tab === 'period') {
          const res  = await fetch(`${API}/api/heatmap`)
          const json = await res.json()
          setHeatmapData(json.data)
        } else {
          const res  = await fetch(`${API}/api/heatmap/monthly`)
          const json = await res.json()
          setMonthlyData(json.data)
          setMonths(json.months)
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

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        ヒートマップ
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        テーマ別騰落率を色で直感的に把握。赤=上昇、緑=下落
      </p>

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
