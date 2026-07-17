import { useState, useEffect } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'

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
  // テーマ名を抽出するためのパターン（### X位: テーマ名 形式）
  const lines = text.split('\n')
  const result = []
  let currentTheme = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // ### 1位: SaaS のような行からテーマ名を抽出
    const themeMatch = line.match(/^###?\s*(?:\d+位[：:]\s*)?(.+?)(?:（.+）)?$/)

    if (line.startsWith('# ')) {
      result.push(<h1 key={i} style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', margin:'24px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      result.push(<h2 key={i} style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', margin:'18px 0 8px' }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      const title = line.slice(4)
      // テーマ名を「位：」の後ろから抽出
      const m = title.match(/\d+位[：:]\s*(.+?)(?:\s*（|$)/)
      currentTheme = m ? m[1].trim() : null
      result.push(<h3 key={i} style={{ fontSize:'14px', fontWeight:700, color:'var(--text2)', margin:'14px 0 6px' }}>{title}</h3>)
    } else if (line.startsWith('- ') || line.startsWith('・')) {
      result.push(
        <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'4px', paddingLeft:'8px' }}>
          <span style={{ color:'var(--accent)', flexShrink:0 }}>▸</span>
          <span style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.7 }}>{line.slice(2)}</span>
        </div>
      )
    } else if (line.trim() === '---') {
      result.push(<hr key={i} style={{ border:'none', borderTop:'1px solid var(--border)', margin:'16px 0' }}/>)
    } else if (line.trim() === '') {
      if (currentTheme && i > 0 && lines[i-1].trim() !== '') {
        const nextNonEmpty = lines.slice(i+1).find(l => l.trim() !== '')
        if (nextNonEmpty && (nextNonEmpty.startsWith('##') || nextNonEmpty.startsWith('---') || i === lines.length-1)) {
          // ★ クロージャ問題防止: constで固定
          const capturedTheme = currentTheme
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
            'SaaS':'saas-dx-theme','DX':'saas-dx-theme',
            'EV・電気自動車':'ev-green-theme','光ファイバー・光部品':'optical-communication',
            'MLCC・電子部品':'mlcc-murata-analysis',
          }
          const colId = THEME_COL_MAP[capturedTheme] || null
          result.push(
            <div key={`btn-${i}`} style={{ display:'flex', gap:'8px', flexWrap:'wrap', margin:'8px 0 12px' }}>
              {onNavigate && (
                <>
                  <button onClick={() => onNavigate('テーマ別詳細', capturedTheme)}
                    style={{ padding:'5px 14px', borderRadius:'6px', fontSize:'11px', fontWeight:600,
                      cursor:'pointer', fontFamily:'var(--font)',
                      background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.3)',
                      color:'var(--accent)' }}>
                    📊 {capturedTheme}の詳細 →
                  </button>
                  {colId && (
                    <button onClick={() => onNavigate('コラム・解説', colId)}
                      style={{ padding:'5px 14px', borderRadius:'6px', fontSize:'11px', fontWeight:600,
                        cursor:'pointer', fontFamily:'var(--font)',
                        background:'rgba(170,119,255,0.08)', border:'1px solid rgba(170,119,255,0.25)',
                        color:'#aa77ff' }}>
                      📖 コラムを読む →
                    </button>
                  )}
                </>
              )}
            </div>
          )
          currentTheme = null
        } else {
          result.push(<div key={`space2-${i}`} style={{ height:'6px' }}/>)
        }
      } else {
        result.push(<div key={i} style={{ height:'6px' }}/>)
      }
    } else {
      result.push(<p key={i} style={{ color:'var(--text)', fontSize:'13px', lineHeight:1.8, margin:'4px 0' }}>{line}</p>)
    }
  }
  return <div>{result}</div>
}

// ① レポートカード（コラム形式）
function ReportCard({ entry, isActive, onClick, isLocked, onUpgrade }) {
  const avg = entry.avg_pct_1w
  const col = avg >= 0 ? 'var(--red)' : 'var(--green)'
  // "2026-04-24" → "4/20〜4/24" の表示
  const weekLabel = (() => {
    // titleから「5/11〜5/15」の形式を抽出（最優先）
    if (entry.title) {
      const m = entry.title.match(/([\d/〜]+(?:〜[\d/]+)?)/)
      if (m && m[1].includes('〜')) return m[1]
    }
    // dateフィールドが「2026/05/15」形式なら「5/11〜5/15」を計算
    if (entry.date) {
      const d = new Date(entry.date.replace(/\//g, '-'))
      if (!isNaN(d)) {
        const end = `${d.getMonth()+1}/${d.getDate()}`
        const start = new Date(d); start.setDate(d.getDate()-4)
        const s = `${start.getMonth()+1}/${start.getDate()}`
        return `${s}〜${end}`
      }
    }
    // weekがISO形式「2026-W21」→ 週番号から計算
    if (entry.week && entry.week.match(/\d{4}-W\d{2}/)) {
      const [yr, wk] = entry.week.split('-W').map(Number)
      const jan4 = new Date(yr, 0, 4)
      const d = new Date(jan4)
      d.setDate(jan4.getDate() + (wk - 1) * 7 - jan4.getDay() + 5)
      if (!isNaN(d)) {
        const end = `${d.getMonth()+1}/${d.getDate()}`
        const start = new Date(d); start.setDate(d.getDate()-4)
        return `${start.getMonth()+1}/${start.getDate()}〜${end}`
      }
    }
    return entry.week || ''
  })()

  if (isLocked) return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px',
      padding:'14px 18px', marginBottom:'8px', opacity:0.7, cursor:'pointer' }}
      onClick={onUpgrade}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
            🔒 {entry.title}
          </div>
          <div style={{ fontSize:'11px', color:'var(--text3)' }}>{entry.date}</div>
        </div>
        <div style={{ padding:'5px 12px', background:'rgba(74,158,255,0.1)',
          border:'1px solid rgba(74,158,255,0.3)', borderRadius:'6px',
          fontSize:'11px', color:'var(--accent)', fontWeight:600, flexShrink:0 }}>
          スタンダード以上で全期間閲覧
        </div>
      </div>
    </div>
  )

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
          {Number.isFinite(avg) ? `${avg >= 0 ? '+' : ''}${avg.toFixed(2)}%` : '未集計'}
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
  const { isStandard, isDev } = useSubscription()
  const canViewRecent = isStandard || isDev  // Freeは1ヶ月以上前のみ閲覧可
  const [report,    setReport]    = useState(null)
  const [index,     setIndex]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [selWeek,   setSelWeek]   = useState(null)
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    // index.jsonを取得し、最新（先頭）のレポートを自動選択
    fetch('/data/weekly_reports/index.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        setIndex(d)
        // 最新レポートを自動的に取得して表示
        if (d.length > 0 && !selWeek) {
          const latest = d[0]
          // 最新レポートをプリフェッチ（表示はユーザーのクリック後）
          fetch(`/data/weekly_reports/${latest.week}.json?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(rd => { if (rd) setReport(rd) })
            .catch(() => {})
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
      .catch(e => { setError(e.message); setLoading(false) })
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
                  {Number.isFinite(summary.avg_pct_1w) ? `${summary.avg_pct_1w >= 0 ? '+' : ''}${summary.avg_pct_1w}%` : '未集計'}
                </div>
              </div>
              <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>上昇テーマ</div>
                <div style={{ fontSize:'17px', fontWeight:700, color:'var(--red)' }}>{Number.isFinite(summary.rise_count) ? summary.rise_count : '未集計'}</div>
              </div>
              <div style={{ background:'var(--bg2)', borderRadius:'8px', padding:'8px 12px', textAlign:'center' }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>下落テーマ</div>
                <div style={{ fontSize:'17px', fontWeight:700, color:'var(--green)' }}>{Number.isFinite(summary.fall_count) ? summary.fall_count : '未集計'}</div>
              </div>
            </div>
          )}

          {summary?.data_status && (
            <div style={{ marginTop:'10px', padding:'7px 10px', borderRadius:'6px',
              background:'rgba(255,184,77,0.08)', border:'1px solid rgba(255,184,77,0.22)',
              color:'var(--text2)', fontSize:'10px', lineHeight:1.6 }}>
              ⚠️ {summary.data_status}
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
                      {Number.isFinite(t.pct) ? `${t.pct >= 0 ? '+' : ''}${t.pct.toFixed(1)}%` : '定性'}
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
                      {Number.isFinite(t.pct) ? `${t.pct >= 0 ? '+' : ''}${t.pct.toFixed(1)}%` : '定性'}
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

        {/* ④ 最下部に一覧に戻るボタン */}
        <div style={{ textAlign:'center', marginTop:'24px' }}>
          <button onClick={() => setShowReport(false)} style={{
            padding:'10px 28px', borderRadius:'8px', fontSize:'13px', fontWeight:600,
            cursor:'pointer', fontFamily:'var(--font)',
            background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.3)',
            color:'var(--accent)',
          }}>
            ← レポート一覧に戻る
          </button>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}`}</style>
      </div>
    )
  }

  // ① カード一覧モード（コラム形式）
  return (
    <div style={{ padding:'20px 24px 80px', maxWidth:'960px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>📰 週次レポート</h1>

      {error && index.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
          <div style={{ color:'var(--text2)', fontSize:'15px' }}>レポートがまだありません</div>
          <div style={{ color:'var(--text3)', fontSize:'12px', marginTop:'4px' }}>毎週末 更新予定</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'12px' }}>
          {/* 最新レポートを先頭に */}
          {[...index].sort((a, b) => {
            // dateフィールド優先、なければweekで比較
            const da = a.date ? a.date.replace(/\//g, '-') : a.week
            const db = b.date ? b.date.replace(/\//g, '-') : b.week
            return db.localeCompare(da)
          }).map((entry, i) => {
            // ③ Free制限: 2週間以内の記事はStandard以上のみ閲覧可
            const entryDate = entry.date ? new Date(entry.date.replace(/\//g, '-')) : null
            const oneMonthAgo = new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
            const isRecent = entryDate && entryDate > oneMonthAgo
            const isLocked = isRecent && !canViewRecent
            return (
            <ReportCard
              key={entry.week}
              entry={{
                ...entry,
                top_theme: entry.top5_themes?.[0]?.theme ?? null,
                generated_at: entry.generated_at,
              }}
              isActive={entry.week === selWeek}
              onClick={() => {
                loadArchive(entry.week)
              }}
            isLocked={isLocked}
            onUpgrade={() => onNavigate?.('プラン・料金')}
            />
            )
          })}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}`}</style>
    </div>
  )
}
