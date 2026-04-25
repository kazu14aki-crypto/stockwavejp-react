import { useState, useEffect } from 'react'

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px', fontSize:'13px' }}>読み込み中...</div>
    </div>
  )
}

function RenderMd({ text, onNavigate }) {
  if (!text) return null
  return (
    <div>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('# '))  return <h1 key={i} style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', margin:'24px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>{line.slice(2)}</h1>
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', margin:'18px 0 8px' }}>{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize:'14px', fontWeight:700, color:'var(--text2)', margin:'14px 0 6px' }}>{line.slice(4)}</h3>
        if (line.startsWith('- ') || line.startsWith('・')) return (
          <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'4px', paddingLeft:'8px' }}>
            <span style={{ color:'var(--accent)', flexShrink:0 }}>▸</span>
            <span style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.7 }}>{line.slice(2)}</span>
          </div>
        )
        if (line.startsWith('**') && line.endsWith('**')) return (
          <div key={i} style={{ fontWeight:700, color:'var(--text)', fontSize:'14px', margin:'8px 0 4px' }}>
            {line.slice(2,-2)}
          </div>
        )
        if (line.trim() === '---') return <hr key={i} style={{ border:'none', borderTop:'1px solid var(--border)', margin:'16px 0' }}/>
        if (line.trim() === '') return <div key={i} style={{ height:'6px' }}/>
        return <p key={i} style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.8, marginBottom:'4px' }}>{line}</p>
      })}
    </div>
  )
}

// ① レポートカード（コラム形式）
function ReportCard({ entry, isActive, onClick }) {
  const avg = entry.avg_pct_1w
  const col = avg >= 0 ? 'var(--red)' : 'var(--green)'
  // "2026-04-24" → "4/20〜4/24" の表示
  const weekLabel = (() => {
    try {
      const d = new Date(entry.week)
      const end = `${d.getMonth()+1}/${d.getDate()}`
      const start = new Date(d); start.setDate(d.getDate()-4)
      const s = `${start.getMonth()+1}/${start.getDate()}`
      return `${s}〜${end}`
    } catch { return entry.week }
  })()

  return (
    <div onClick={onClick} style={{
      background: isActive ? 'rgba(74,158,255,0.1)' : 'var(--bg2)',
      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius:'10px', padding:'14px 16px', cursor:'pointer',
      transition:'all 0.15s',
      borderLeft: `4px solid ${col}`,
    }}>
      <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px', letterSpacing:'0.06em' }}>
        📰 週次レポート
      </div>
      <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>
        {weekLabel} 週次レポート
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
        <span style={{ fontSize:'18px', fontWeight:800, fontFamily:'var(--mono)', color:col }}>
          {avg >= 0 ? '+' : ''}{avg?.toFixed(2)}%
        </span>
        <span style={{ fontSize:'10px', color:'var(--text3)' }}>週間テーマ平均</span>
        {entry.generated_at && (
          <span style={{ fontSize:'10px', color:'var(--text3)', marginLeft:'auto' }}>
            {entry.generated_at.slice(0, 10)}
          </span>
        )}
      </div>
      {entry.top_theme && (
        <div style={{ marginTop:'6px', fontSize:'11px', color:'var(--text3)' }}>
          🔥 TOP: <span style={{ color:'var(--red)', fontWeight:600 }}>{entry.top_theme}</span>
        </div>
      )}
    </div>
  )
}

export default function WeeklyReport({ onNavigate }) {
  const [report,    setReport]    = useState(null)
  const [index,     setIndex]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [selWeek,   setSelWeek]   = useState(null)
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    fetch('/data/weekly_report.json?t=' + Date.now())
      .then(r => { if (!r.ok) throw new Error('レポートがありません'); return r.json() })
      .then(d => { setReport(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
    fetch('/data/weekly_reports/index.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : [])
      .then(d => setIndex(d))
      .catch(() => {})
  }, [])

  const loadArchive = (week) => {
    setSelWeek(week)
    setLoading(true)
    setShowReport(true)
    fetch(`/data/weekly_reports/${week}.json?t=` + Date.now())
      .then(r => r.json())
      .then(d => { setReport(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const loadLatest = () => {
    setSelWeek(null)
    setLoading(true)
    setShowReport(true)
    fetch('/data/weekly_report.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { setReport(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  if (loading && index.length === 0) return <Loading />

  // レポート本文表示モード
  if (showReport) {
    const { summary } = report || {}
    return (
      <div style={{ padding:'20px 24px 80px', maxWidth:'860px', margin:'0 auto' }}>
        {/* 戻るボタン */}
        <button onClick={() => setShowReport(false)} style={{
          display:'flex', alignItems:'center', gap:'6px', marginBottom:'16px',
          background:'transparent', border:'1px solid var(--border)', borderRadius:'6px',
          color:'var(--text2)', cursor:'pointer', fontSize:'12px', padding:'6px 12px',
          fontFamily:'var(--font)',
        }}>
          ← レポート一覧に戻る
        </button>

        {/* ヘッダー */}
        <div style={{ background:'linear-gradient(135deg,rgba(91,156,246,0.1),rgba(170,119,255,0.08))',
          border:'1px solid var(--border)', borderRadius:'12px', padding:'20px 24px', marginBottom:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            📰 週次マーケットレポート
          </div>
          <h1 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
            {report?.title || 'レポートなし'}
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap', fontSize:'11px', color:'var(--text3)' }}>
            <span>作成: {report?.generated_at}</span>
            {report?.next_report_at && (
              <span style={{ color:'var(--accent)' }}>📅 {report.next_report_at}</span>
            )}
          </div>

          {summary && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'8px', marginTop:'14px' }}>
              <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>週間平均</div>
                <div style={{ fontSize:'17px', fontWeight:700, fontFamily:'var(--mono)',
                  color: summary.avg_pct_1w >= 0 ? 'var(--red)' : 'var(--green)' }}>
                  {summary.avg_pct_1w >= 0 ? '+' : ''}{summary.avg_pct_1w}%
                </div>
              </div>
              <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>上昇テーマ</div>
                <div style={{ fontSize:'17px', fontWeight:700, color:'var(--red)' }}>{summary.rise_count}</div>
              </div>
              <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>下落テーマ</div>
                <div style={{ fontSize:'17px', fontWeight:700, color:'var(--green)' }}>{summary.fall_count}</div>
              </div>
            </div>
          )}

          {summary && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px' }}>
              <div>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'5px', fontWeight:600 }}>🔥 週間TOP5テーマ</div>
                {summary.top5_themes?.map((t,i) => (
                  <div key={t.theme} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    fontSize:'11px', marginBottom:'3px', padding:'3px 8px',
                    background:'rgba(255,83,112,0.06)', borderRadius:'4px', cursor: onNavigate ? 'pointer' : 'default' }}
                    onClick={() => onNavigate?.('テーマ別詳細', t.theme)}>
                    <span style={{ color:'var(--text2)' }}>{i+1}. {t.theme}</span>
                    <span style={{ color:'var(--red)', fontFamily:'var(--mono)', fontWeight:700, marginLeft:'6px', flexShrink:0 }}>
                      {t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'5px', fontWeight:600 }}>❄️ 週間BOT5テーマ</div>
                {summary.bot5_themes?.map((t,i) => (
                  <div key={t.theme} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    fontSize:'11px', marginBottom:'3px', padding:'3px 8px',
                    background:'rgba(0,196,140,0.06)', borderRadius:'4px', cursor: onNavigate ? 'pointer' : 'default' }}
                    onClick={() => onNavigate?.('テーマ別詳細', t.theme)}>
                    <span style={{ color:'var(--text2)' }}>{i+1}. {t.theme}</span>
                    <span style={{ color:'var(--green)', fontFamily:'var(--mono)', fontWeight:700, marginLeft:'6px', flexShrink:0 }}>
                      {t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary?.top5_themes && onNavigate && (
            <div style={{ marginTop:'12px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
              <span style={{ fontSize:'10px', color:'var(--text3)', alignSelf:'center' }}>注目テーマを確認:</span>
              {summary.top5_themes.slice(0,3).map(t => (
                <button key={t.theme} onClick={() => onNavigate('テーマ別詳細', t.theme)}
                  style={{ padding:'4px 10px', borderRadius:'5px', fontSize:'11px', fontFamily:'var(--font)',
                    background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                    color:'#aa77ff', cursor:'pointer', fontWeight:600 }}>
                  📊 {t.theme}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? <Loading /> : (
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'24px 28px' }}>
            <RenderMd text={report?.report} onNavigate={onNavigate} />
          </div>
        )}

        <div style={{ marginTop:'14px', padding:'10px 14px', background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.05)', borderRadius:'8px', fontSize:'11px', color:'var(--text3)', lineHeight:1.7 }}>
          ⚠️ 本レポートはStockWaveJPの市場データをもとに作成した参考情報です。特定銘柄の購入・売却を推奨するものではなく、
          <strong style={{ color:'var(--text2)' }}>投資の最終判断はご自身の責任でお願いします。</strong>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}`}</style>
      </div>
    )
  }

  // ① カード一覧モード（コラム形式）
  return (
    <div style={{ padding:'20px 24px 80px', maxWidth:'960px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>📰 週次レポート</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'20px' }}>
        毎週末更新予定。各カードをクリックしてレポート全文を確認できます。
      </p>

      {error && index.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
          <div style={{ color:'var(--text2)', fontSize:'15px' }}>レポートがまだありません</div>
          <div style={{ color:'var(--text3)', fontSize:'12px', marginTop:'4px' }}>毎週末 更新予定</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'12px' }}>
          {/* 最新レポートを先頭に */}
          {index.map((entry, i) => (
            <ReportCard
              key={entry.week}
              entry={{
                ...entry,
                top_theme: entry.top5_themes?.[0]?.theme ?? null,
                generated_at: entry.generated_at,
              }}
              isActive={i === 0 && !selWeek}
              onClick={() => {
                if (i === 0) loadLatest()
                else loadArchive(entry.week)
              }}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}`}</style>
    </div>
  )
}
