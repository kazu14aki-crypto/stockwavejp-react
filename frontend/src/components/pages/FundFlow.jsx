import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label: '1週間', value: '5d' },
  { label: '1ヶ月', value: '1mo' },
  { label: '3ヶ月', value: '3mo' },
  { label: '6ヶ月', value: '6mo' },
  { label: '1年',   value: '1y'  },
]

function HBarChart({ items, color, maxAbs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {items.map((item, i) => {
        const w = Math.round(Math.abs(item.pct) / maxAbs * 100)
        return (
          <div key={item.theme} style={{
            display: 'grid', gridTemplateColumns: '130px 1fr 70px',
            alignItems: 'center', gap: '10px',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '8px 12px',
            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
          }}>
            <span style={{ fontSize: '12px', color: '#c0d0e8', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.theme}
            </span>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: '3px' }} />
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700, textAlign: 'right', color }}>
              {item.pct >= 0 ? '+' : ''}{item.pct.toFixed(1)}%
            </span>
          </div>
        )
      })}
    </div>
  )
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
      <div style={{ marginTop: '12px', fontSize: '12px' }}>データ取得中...</div>
    </div>
  )
}

export default function FundFlow() {
  const [period,  setPeriod]  = useState('1mo')
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true); setError(null)
      try {
        const res  = await fetch(`${API}/api/fund-flow?period=${period}`)
        const json = await res.json()
        setData(json)
      } catch {
        setError('データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [period])

  const allItems = data?.all ?? []
  const maxAbs   = allItems.length ? Math.max(...allItems.map(t => Math.abs(t.pct))) : 1

  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8f0ff', marginBottom: '4px' }}>
        資金フロー
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>
        上昇テーマ vs 下落テーマの騰落幅を比較。どのテーマに資金が集まっているか把握できます。
      </p>

      <select value={period} onChange={e => setPeriod(e.target.value)} style={selStyle}>
        {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {loading ? <Loading /> : error ? (
        <div style={{ color: 'var(--red)', fontSize: '13px', marginTop: '20px' }}>{error}</div>
      ) : (
        <>
          {/* TOP10 2カラム */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }} className="flow-grid">
            <div>
              <div style={sectionHead}>
                <span style={sectionTitle}>🔥 資金流入 TOP10</span>
                <div style={sectionLine} />
              </div>
              <HBarChart items={data?.gainers ?? []} color="var(--red)" maxAbs={maxAbs} />
            </div>
            <div>
              <div style={sectionHead}>
                <span style={sectionTitle}>❄️ 資金流出 TOP10</span>
                <div style={sectionLine} />
              </div>
              <HBarChart items={data?.losers ?? []} color="var(--green)" maxAbs={maxAbs} />
            </div>
          </div>

          {/* 全テーマ */}
          <div style={sectionHead}>
            <span style={sectionTitle}>全テーマ 騰落率一覧</span>
            <div style={sectionLine} />
          </div>
          <HBarChart items={allItems} color={undefined} maxAbs={maxAbs} />
        </>
      )}

      <style>{`
        @media (max-width: 768px) { .flow-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid rgba(74,120,200,0.2)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none', marginBottom: '4px',
}
const sectionHead  = { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 12px' }
const sectionTitle = { fontSize: '11px', fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }
const sectionLine  = { flex: 1, height: '1px', background: 'var(--border)' }
