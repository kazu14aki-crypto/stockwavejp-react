import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const PERIODS = [
  { label: '1週間', value: '5d' },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]

const SORT_KEYS = ['騰落率（降順）', '騰落率（昇順）']

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
      <div style={{ marginTop: '12px', fontSize: '12px' }}>データ取得中...</div>
    </div>
  )
}

export default function Momentum() {
  const [period,  setPeriod]  = useState('1mo')
  const [sortKey, setSortKey] = useState('騰落率（降順）')
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true); setError(null)
    fetch(`${API}/api/momentum?period=${period}`)
      .then(r => r.json())
      .then(json => setData(json.data || []))
      .catch(() => setError('データ取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [period])

  let sorted = [...data]
  if (sortKey === '騰落率（降順）') sorted.sort((a, b) => b.pct - a.pct)
  if (sortKey === '騰落率（昇順）') sorted.sort((a, b) => a.pct - b.pct)

  const pctColor = (v) => v >= 0 ? 'var(--red)' : 'var(--green)'
  const pctSign  = (v) => v >= 0 ? '+' : ''

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        騰落モメンタム
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        選択期間のテーマ別騰落率ランキング。先月比・状態はテーマ別詳細で確認できます。
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={selStyle}>
          {SORT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loading /> : error ? (
        <div style={{ color: 'var(--red)', fontSize: '13px' }}>{error}</div>
      ) : (
        <>
          {/* ヘッダー */}
          <div style={{ ...rowStyle, background: 'transparent', border: 'none',
            padding: '4px 16px', marginBottom: '4px' }}>
            <span style={hdrStyle}>テーマ名</span>
            <span style={{ ...hdrStyle, textAlign: 'right' }}>騰落率</span>
            <span style={{ ...hdrStyle, textAlign: 'right' }}>先週比</span>
          </div>

          {sorted.map((d, i) => (
            <div key={d.theme} style={{
              ...rowStyle,
              animation: `fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) ${i * 0.02}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0e1e32'; e.currentTarget.style.borderColor = 'rgba(74,158,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <span style={{ fontSize: '13px', color: '#c0d0e8', fontWeight: 500 }}>
                <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', marginRight: '8px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {d.theme}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, textAlign: 'right', color: pctColor(d.pct) }}>
                {pctSign(d.pct)}{d.pct.toFixed(1)}%
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', textAlign: 'right', color: pctColor(d.week_diff) }}>
                {pctSign(d.week_diff)}{d.week_diff.toFixed(1)}pt
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none',
}

const rowStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '11px 16px', marginBottom: '3px',
  display: 'grid', gridTemplateColumns: '1fr 80px 80px',
  alignItems: 'center', gap: '12px', transition: 'background 0.12s, border-color 0.12s',
}

const hdrStyle = {
  fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
  color: 'var(--text3)', textTransform: 'uppercase',
}
