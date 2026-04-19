import { useState, useEffect } from 'react'

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px', animation:`pulse 1.2s ease-in-out ${d}s infinite`}}/>
      ))}
      <div style={{ marginTop:'12px', fontSize:'13px' }}>レポート読み込み中...</div>
    </div>
  )
}

export default function WeeklyReport() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/weekly_report.json?t=' + Date.now())
      .then(r => { if (!r.ok) throw new Error('レポートがありません'); return r.json() })
      .then(d => { setReport(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return <Loading />

  if (error || !report) return (
    <div style={{ padding:'40px 24px', textAlign:'center' }}>
      <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
      <div style={{ color:'var(--text2)', fontSize:'15px', marginBottom:'8px' }}>
        今週のレポートはまだ生成されていません
      </div>
      <div style={{ color:'var(--text3)', fontSize:'12px' }}>
        毎週金曜日 16:00 JST 頃に自動生成されます
      </div>
    </div>
  )

  // Markdownを簡易HTMLに変換
  const renderMd = (md) => {
    if (!md) return null
    return md
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# '))  return <h1 key={i} style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', margin:'24px 0 12px' }}>{line.slice(2)}</h1>
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', margin:'20px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize:'15px', fontWeight:700, color:'var(--text2)', margin:'16px 0 8px' }}>{line.slice(4)}</h3>
        if (line.startsWith('- ') || line.startsWith('・')) return (
          <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'4px', paddingLeft:'8px' }}>
            <span style={{ color:'var(--accent)', flexShrink:0 }}>▸</span>
            <span style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.7 }}>{line.slice(2)}</span>
          </div>
        )
        if (line.match(/^\d+\./)) return (
          <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'4px', paddingLeft:'8px' }}>
            <span style={{ color:'var(--accent)', flexShrink:0, fontWeight:700 }}>{line.split('.')[0]}.</span>
            <span style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.7 }}>{line.split('.').slice(1).join('.').trim()}</span>
          </div>
        )
        if (line.startsWith('**') && line.endsWith('**')) return (
          <div key={i} style={{ fontWeight:700, color:'var(--text)', fontSize:'14px', margin:'8px 0 4px' }}>
            {line.slice(2,-2)}
          </div>
        )
        if (line.trim() === '') return <div key={i} style={{ height:'8px' }} />
        return <p key={i} style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.8, marginBottom:'6px' }}>{line}</p>
      })
  }

  const { summary } = report

  return (
    <div style={{ padding:'20px 24px 80px', maxWidth:'860px', margin:'0 auto' }}>
      {/* ヘッダー */}
      <div style={{ background:'linear-gradient(135deg,rgba(91,156,246,0.1),rgba(170,119,255,0.08))',
        border:'1px solid var(--border)', borderRadius:'12px', padding:'20px 24px', marginBottom:'24px' }}>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px',
          letterSpacing:'0.1em', textTransform:'uppercase' }}>
          📰 週次マーケットレポート
        </div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', marginBottom:'12px' }}>
          {report.title}
        </h1>
        <div style={{ fontSize:'11px', color:'var(--text3)' }}>
          生成日時: {report.generated_at}
        </div>

        {/* サマリーカード */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',
          gap:'8px', marginTop:'16px' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'10px 14px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px' }}>週間平均</div>
            <div style={{ fontSize:'18px', fontWeight:700, fontFamily:'var(--mono)',
              color: summary.avg_pct_1w >= 0 ? 'var(--red)' : 'var(--green)' }}>
              {summary.avg_pct_1w >= 0 ? '+' : ''}{summary.avg_pct_1w}%
            </div>
          </div>
          <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'10px 14px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px' }}>上昇テーマ</div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'var(--red)' }}>{summary.rise_count}</div>
          </div>
          <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'10px 14px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px' }}>下落テーマ</div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'var(--green)' }}>{summary.fall_count}</div>
          </div>
        </div>

        {/* TOP5/BOT5 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'16px' }}>
          <div>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px', fontWeight:600 }}>🔥 週間TOP5テーマ</div>
            {summary.top5_themes.map((t,i) => (
              <div key={t.theme} style={{ display:'flex', justifyContent:'space-between',
                fontSize:'11px', marginBottom:'3px', padding:'3px 6px',
                background:'rgba(255,83,112,0.06)', borderRadius:'4px' }}>
                <span style={{ color:'var(--text2)' }}>{i+1}. {t.theme}</span>
                <span style={{ color:'var(--red)', fontFamily:'var(--mono)', fontWeight:700 }}>
                  {t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px', fontWeight:600 }}>❄️ 週間BOTTOM5テーマ</div>
            {summary.bot5_themes.map((t,i) => (
              <div key={t.theme} style={{ display:'flex', justifyContent:'space-between',
                fontSize:'11px', marginBottom:'3px', padding:'3px 6px',
                background:'rgba(0,196,140,0.06)', borderRadius:'4px' }}>
                <span style={{ color:'var(--text2)' }}>{i+1}. {t.theme}</span>
                <span style={{ color:'var(--green)', fontFamily:'var(--mono)', fontWeight:700 }}>
                  {t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* レポート本文 */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'12px', padding:'24px 28px' }}>
        {renderMd(report.report)}
      </div>

      {/* 免責事項 */}
      <div style={{ marginTop:'16px', padding:'12px 16px', background:'rgba(255,255,255,0.02)',
        border:'1px solid rgba(255,255,255,0.05)', borderRadius:'8px',
        fontSize:'11px', color:'var(--text3)', lineHeight:1.7 }}>
        ⚠️ 本レポートはAIが市場データを自動分析して生成したものです。
        特定銘柄の購入・売却を推奨するものではなく、
        <strong style={{ color:'var(--text2)' }}>投資の最終判断はご自身の責任でお願いします。</strong>
      </div>

      <style>{\`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      \`}</style>
    </div>
  )
}
