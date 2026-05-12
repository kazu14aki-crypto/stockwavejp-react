import { useState, useEffect, useCallback } from 'react'

// ── EDINET 大量保有報告書ビューア ────────────────────────────────
// CORS制限のためバックエンド（Render.com）経由でEDINET APIにアクセス
// バックエンドに /api/edinet/large-holdings エンドポイントを追加してください

const API_BASE = import.meta.env.VITE_API_URL || 'https://stockwavejp-api.onrender.com'

// 主要機関投資家の参考リスト
const MAJOR_INSTITUTIONS = [
  '三菱UFJフィナンシャル・グループ', 'ブラックロック', 'バンガード',
  'フィデリティ', 'ノルウェー政府年金基金', '日本生命', '三井住友銀行',
  '野村アセットマネジメント', '大和アセットマネジメント', '三菱UFJ信託銀行',
]

// 保有目的の英語対応
const PURPOSE_MAP = {
  '純投資': '📈 純投資（価格上昇益目的）',
  '政策投資': '🤝 政策投資（事業関係強化）',
  '投資': '📊 投資',
  '重要提案行為等': '⚡ 重要提案行為等（経営参画）',
}
const formatPurpose = (p) => {
  if (!p) return '-'
  for (const [k, v] of Object.entries(PURPOSE_MAP)) {
    if (p.includes(k)) return v
  }
  return p
}

// 株数フォーマット
const fmtShares = (n) => {
  if (!n) return '-'
  if (n >= 1e8) return (n/1e8).toFixed(2) + '億株'
  if (n >= 1e4) return (n/1e4).toFixed(1) + '万株'
  return n.toLocaleString() + '株'
}

// ── スパークライン（保有率推移） ─────────────────────────────────
function HoldingSparkline({ history }) {
  if (!history || history.length < 2) return null
  const vals = history.map(h => parseFloat(h.ratio) || 0)
  const min = Math.min(...vals), max = Math.max(...vals)
  const W = 120, H = 36, PAD = 4
  const gw = W - PAD*2, gh = H - PAD*2
  const pts = vals.map((v, i) => {
    const x = PAD + (i / (vals.length - 1)) * gw
    const y = PAD + (1 - (max === min ? 0.5 : (v - min) / (max - min))) * gh
    return `${x},${y}`
  }).join(' ')
  const last = vals[vals.length - 1]
  const prev = vals[vals.length - 2]
  const color = last >= prev ? '#ff5370' : '#00c48c'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
      <svg width={W} height={H} style={{ flexShrink:0 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        {vals.map((v, i) => {
          const x = PAD + (i / (vals.length - 1)) * gw
          const y = PAD + (1 - (max === min ? 0.5 : (v - min) / (max - min))) * gh
          return <circle key={i} cx={x} cy={y} r="2" fill={color} />
        })}
      </svg>
      <span style={{ fontSize:'10px', color, fontFamily:'var(--mono)', fontWeight:700 }}>
        {last.toFixed(2)}%
      </span>
    </div>
  )
}

// ── 保有率バー ────────────────────────────────────────────────────
function RatioBar({ ratio }) {
  const r = parseFloat(ratio) || 0
  const color = r >= 10 ? '#ff5370' : r >= 5 ? '#ff8c42' : '#4a9eff'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ width:'80px', height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', flexShrink:0 }}>
        <div style={{ width:`${Math.min(r * 5, 100)}%`, height:'100%', background:color, borderRadius:'3px', transition:'width 0.4s' }} />
      </div>
      <span style={{ fontSize:'13px', fontWeight:700, color, fontFamily:'var(--mono)', minWidth:'42px' }}>
        {r.toFixed(2)}%
      </span>
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export default function InstitutionalHoldings() {
  const [searchQuery, setSearchQuery]   = useState('')
  const [ticker,      setTicker]        = useState('')
  const [filings,     setFilings]       = useState([])
  const [history,     setHistory]       = useState({}) // holder → [{date,ratio,shares}]
  const [loading,     setLoading]       = useState(false)
  const [error,       setError]         = useState('')
  const [sortKey,     setSortKey]       = useState('ratio')   // ratio | date | holder
  const [sortDesc,    setSortDesc]      = useState(true)
  const [selectedDoc, setSelectedDoc]   = useState(null)
  const [tab,         setTab]           = useState('list')    // list | chart | guide

  // ── EDINET API: 大量保有報告書検索（バックエンドプロキシ経由）────
  const searchFilings = useCallback(async (q) => {
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setFilings([])
    setHistory({})
    try {
      // バックエンド経由でEDINETにアクセス（CORS回避）
      const res = await fetch(
        `${API_BASE}/api/edinet/large-holdings?q=${encodeURIComponent(q.trim())}&days=60`,
        { signal: AbortSignal.timeout(30000) }
      )
      if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`)
      const data = await res.json()
      const results = data.results || []

      setFilings(results)
      if (results.length === 0) {
        setError('該当する大量保有報告書が見つかりませんでした。銘柄名・証券コード・保有者名で検索できます。')
      }

      // 保有者別の推移データを構築
      const hist = {}
      results.forEach(doc => {
        const holder = doc.filerName || '不明'
        if (!hist[holder]) hist[holder] = []
        hist[holder].push({
          date: doc.submitDate || doc.submitDateTime?.slice(0, 10),
          ratio: doc.holdingRatio || doc.otherExplanatoryStatement || null,
          docID: doc.docID,
          docType: doc.docTypeCode === '28' ? '新規' : doc.docTypeCode === '29' ? '変更' : '一部免除',
        })
      })
      Object.keys(hist).forEach(k => {
        hist[k].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      })
      setHistory(hist)

    } catch (e) {
      if (e.name === 'TimeoutError') {
        setError('タイムアウトしました。EDINETが一時的に利用不可の可能性があります。しばらく後に再試行してください。')
      } else {
        setError(`検索エラー: ${e.message}。バックエンドサービスの起動に少し時間がかかる場合があります（15〜30秒）。`)
      }
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── 書類詳細取得（EDINETサイトへ直接リンク）────────────────────
  const openDetail = (doc) => {
    setSelectedDoc({ ...doc, loading: false, detail: null })
  }

  // ── ソート済みfilingsを返す ────────────────────────────────────
  const sorted = [...filings].sort((a, b) => {
    if (sortKey === 'ratio') {
      const ra = parseFloat(a.holdingRatio || a.otherExplanatoryStatement) || 0
      const rb = parseFloat(b.holdingRatio || b.otherExplanatoryStatement) || 0
      return sortDesc ? rb - ra : ra - rb
    }
    if (sortKey === 'date') {
      const da = a.submitDate || a.submitDateTime || ''
      const db = b.submitDate || b.submitDateTime || ''
      return sortDesc ? db.localeCompare(da) : da.localeCompare(db)
    }
    if (sortKey === 'holder') {
      const ha = a.filerName || ''
      const hb = b.filerName || ''
      return sortDesc ? hb.localeCompare(ha) : ha.localeCompare(hb)
    }
    return 0
  })

  const sortToggle = (key) => {
    if (sortKey === key) setSortDesc(d => !d)
    else { setSortKey(key); setSortDesc(true) }
  }

  const SortIcon = ({ k }) => sortKey === k
    ? <span style={{ color:'var(--accent)', marginLeft:'3px' }}>{sortDesc ? '↓' : '↑'}</span>
    : <span style={{ color:'var(--text3)', marginLeft:'3px' }}>↕</span>

  return (
    <div style={{ padding:'24px 20px 60px', maxWidth:'1000px', margin:'0 auto' }}>
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>
          🏦 機関投資家 大量保有情報
        </h1>
        <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7 }}>
          金融庁EDINET（電子開示システム）の大量保有報告書データベースを参照。
          上場株式の5%超を保有した機関投資家は5日以内に提出が義務付けられています。
        </p>
      </div>

      {/* タブ */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'20px', borderBottom:'1px solid var(--border)', paddingBottom:'0' }}>
        {[['list','📋 保有一覧'], ['chart','📈 推移グラフ'], ['guide','💡 読み方ガイド']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'8px 16px', border:'none', cursor:'pointer',
            background: tab === k ? 'var(--accent)' : 'transparent',
            color: tab === k ? '#fff' : 'var(--text3)',
            borderRadius:'6px 6px 0 0', fontFamily:'var(--font)', fontSize:'13px', fontWeight: tab === k ? 700 : 400,
            borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      {/* ── 保有一覧タブ ── */}
      {tab === 'list' && (
        <>
          {/* 検索バー */}
          <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
            <input
              type="text"
              placeholder="銘柄名・証券コード・保有者名で検索（例：トヨタ、7203、ブラックロック）"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchFilings(searchQuery)}
              style={{
                flex:'1', minWidth:'280px', padding:'10px 14px',
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'8px', color:'var(--text)', fontSize:'13px',
                fontFamily:'var(--font)', outline:'none',
              }}
            />
            <button onClick={() => searchFilings(searchQuery)} style={{
              padding:'10px 20px', background:'var(--accent)', color:'#fff',
              border:'none', borderRadius:'8px', cursor:'pointer',
              fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
              flexShrink:0,
            }}>
              {loading ? '⏳ 検索中（最大30秒）...' : '🔍 検索'}
            </button>
          </div>

          {/* 主要機関投資家クイック選択 */}
          <div style={{ marginBottom:'16px' }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>主要機関投資家：</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {MAJOR_INSTITUTIONS.map(inst => (
                <button key={inst} onClick={() => { setSearchQuery(inst); searchFilings(inst) }}
                  style={{
                    padding:'4px 10px', background:'var(--bg2)',
                    border:'1px solid var(--border)', borderRadius:'20px',
                    color:'var(--text2)', fontSize:'11px', cursor:'pointer',
                    fontFamily:'var(--font)',
                  }}>
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {/* バックエンド注記 */}
          <div style={{ padding:'10px 14px', background:'rgba(74,158,255,0.08)',
            border:'1px solid rgba(74,158,255,0.2)', borderRadius:'8px',
            fontSize:'12px', color:'var(--text3)', marginBottom:'14px', lineHeight:1.7 }}>
            📡 データはバックエンドサーバー経由でEDINET（金融庁）から取得します。<br/>
            <strong style={{ color:'var(--text2)' }}>初回検索：15〜30秒</strong>かかります（Render.comの無料プランはスリープ状態から起動に時間がかかります）。<br/>
            <strong style={{ color:'#00c48c' }}>2回目以降：1時間キャッシュにより即座に表示</strong>されます。
          </div>

          {error && (
            <div style={{ padding:'12px 16px', background:'rgba(255,83,112,0.1)', borderRadius:'8px',
              border:'1px solid rgba(255,83,112,0.3)', color:'#ff5370', fontSize:'13px', marginBottom:'16px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* 結果件数 */}
          {filings.length > 0 && (
            <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'10px' }}>
              {filings.length}件の大量保有報告書が見つかりました
              <span style={{ marginLeft:'8px', fontSize:'11px' }}>（過去60日分を検索）</span>
            </div>
          )}

          {/* 保有一覧テーブル */}
          {sorted.length > 0 && (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr style={{ background:'var(--bg2)' }}>
                    {[
                      ['date','報告日', '110px'],
                      ['holder','保有者（機関投資家名）', '200px'],
                      ['issuer','対象銘柄', '160px'],
                      ['ratio','保有割合', '140px'],
                      ['shares','保有株数', '120px'],
                      ['type','報告種別', '80px'],
                    ].map(([k, label, w]) => (
                      <th key={k} onClick={() => sortToggle(k)} style={{
                        padding:'10px 12px', textAlign:'left', cursor:'pointer',
                        color:'var(--text3)', fontWeight:600, fontSize:'11px',
                        borderBottom:'2px solid var(--border)', minWidth:w,
                        textTransform:'uppercase', letterSpacing:'0.05em',
                        userSelect:'none',
                      }}>
                        {label}<SortIcon k={k} />
                      </th>
                    ))}
                    <th style={{ padding:'10px 12px', color:'var(--text3)', fontWeight:600, fontSize:'11px', borderBottom:'2px solid var(--border)' }}>詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((doc, i) => {
                    const ratio = parseFloat(doc.otherExplanatoryStatement) || null
                    const docTypeLabel = doc.docTypeCode === '28' ? '🆕 新規' : doc.docTypeCode === '29' ? '🔄 変更' : '⚡ 特例'
                    return (
                      <tr key={doc.docID} style={{
                        borderBottom:'1px solid var(--border)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                        cursor:'pointer',
                      }}
                        onClick={() => openDetail(doc)}
                      >
                        <td style={{ padding:'10px 12px', color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'11px' }}>
                          {doc.submitDateTime?.slice(0, 10) || '-'}
                        </td>
                        <td style={{ padding:'10px 12px', color:'var(--text)', fontWeight:500 }}>
                          {doc.filerName || '-'}
                        </td>
                        <td style={{ padding:'10px 12px' }}>
                          <div style={{ color:'var(--text)', fontWeight:600 }}>{doc.issuerName || '-'}</div>
                          <div style={{ color:'var(--text3)', fontSize:'10px', fontFamily:'var(--mono)' }}>
                            {doc.secCode || doc.issuerEdinetCode || ''}
                          </div>
                        </td>
                        <td style={{ padding:'10px 12px' }}>
                          {ratio !== null
                            ? <RatioBar ratio={ratio} />
                            : <span style={{ color:'var(--text3)' }}>-</span>}
                        </td>
                        <td style={{ padding:'10px 12px', color:'var(--text2)', fontFamily:'var(--mono)', fontSize:'11px' }}>
                          {doc.repPeriodFrom ? fmtShares(null) : '-'}
                        </td>
                        <td style={{ padding:'10px 12px' }}>
                          <span style={{ fontSize:'11px' }}>{docTypeLabel}</span>
                        </td>
                        <td style={{ padding:'10px 12px' }}>
                          <button style={{
                            padding:'3px 10px', background:'rgba(74,158,255,0.1)',
                            border:'1px solid rgba(74,158,255,0.3)',
                            borderRadius:'4px', color:'#4a9eff',
                            fontSize:'11px', cursor:'pointer', fontFamily:'var(--font)',
                          }}>
                            PDF →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 詳細モーダル */}
          {selectedDoc && (
            <div style={{
              position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
              display:'flex', alignItems:'center', justifyContent:'center',
              zIndex:1000, padding:'20px',
            }} onClick={() => setSelectedDoc(null)}>
              <div style={{
                background:'var(--bg2)', borderRadius:'12px',
                padding:'28px', maxWidth:'560px', width:'100%',
                border:'1px solid var(--border)',
              }} onClick={e => e.stopPropagation()}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                  <h3 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)' }}>
                    📄 書類詳細
                  </h3>
                  <button onClick={() => setSelectedDoc(null)} style={{
                    background:'transparent', border:'none', color:'var(--text3)',
                    cursor:'pointer', fontSize:'18px',
                  }}>✕</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'130px 1fr', gap:'8px 12px', fontSize:'13px', marginBottom:'16px' }}>
                  {[
                    ['対象銘柄', selectedDoc.issuerName],
                    ['証券コード', selectedDoc.secCode || '-'],
                    ['保有者', selectedDoc.filerName],
                    ['報告日', selectedDoc.submitDateTime?.slice(0, 10)],
                    ['書類種別', selectedDoc.docTypeCode === '28' ? '大量保有報告書（新規）' : '変更報告書'],
                    ['EDINET書類ID', selectedDoc.docID],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display:'contents' }}>
                      <span style={{ color:'var(--text3)', fontWeight:600, fontSize:'11px' }}>{label}</span>
                      <span style={{ color:'var(--text)' }}>{value || '-'}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://disclosure2.edinet-fsa.go.jp/webd/detail/${selectedDoc.docID}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display:'block', textAlign:'center',
                    padding:'10px', background:'var(--accent)',
                    color:'#fff', borderRadius:'8px',
                    textDecoration:'none', fontSize:'13px', fontWeight:600,
                  }}
                >
                  📄 EDINETで書類を確認（PDF）
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── 推移グラフタブ ── */}
      {tab === 'chart' && (
        <div>
          {Object.keys(history).length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text3)' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px' }}>📊</div>
              <p>まず「保有一覧」タブで検索を実行してください。<br/>保有者別の推移グラフが表示されます。</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {Object.entries(history).map(([holder, records]) => (
                <div key={holder} style={{
                  background:'var(--bg2)', border:'1px solid var(--border)',
                  borderRadius:'10px', padding:'16px 20px',
                }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{holder}</div>
                      <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>
                        報告回数: {records.length}回
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      {records.map((r, i) => (
                        <div key={i} style={{ fontSize:'10px', textAlign:'center', color:'var(--text3)' }}>
                          <div style={{ fontFamily:'var(--mono)', color: i === records.length-1 ? 'var(--accent)' : 'var(--text2)', fontWeight: i === records.length-1 ? 700 : 400 }}>
                            {r.docType}
                          </div>
                          <div>{r.date?.slice(5)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <HoldingSparkline history={records} />
                  <div style={{ marginTop:'10px', display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {records.map((r, i) => (
                      <div key={i} style={{
                        padding:'4px 10px', background:'var(--bg3)',
                        borderRadius:'6px', fontSize:'11px',
                        fontFamily:'var(--mono)', color:'var(--text2)',
                      }}>
                        {r.date}: {r.ratio ? parseFloat(r.ratio).toFixed(2)+'%' : '-'}
                        <span style={{ marginLeft:'6px', fontSize:'10px', color:'var(--text3)' }}>({r.docType})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 読み方ガイドタブ ── */}
      {tab === 'guide' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {[
            {
              icon: '📋', title: '大量保有報告書とは',
              body: '上場株式の5%超を取得した投資家（機関投資家・外国人投資家等）は、金融商品取引法により5営業日以内に金融庁のEDINETシステムへ報告書を提出する義務があります。この報告書を「大量保有報告書」といい、「変更報告書」は保有割合が1%以上変動した際に追加で提出されます。',
            },
            {
              icon: '📈', title: '保有割合の見方',
              body: '保有割合が高いほど機関投資家の影響力が強く、株主総会での議決権行使等でも発言力を持ちます。特に10%超は経営に対する重大な影響力の指標です。保有割合の増加（買い増し）は強気サイン、減少（売却）は弱気サインとして参考になります。',
              list: [
                '5〜7%：新規大量保有。注目度が上がるきっかけ',
                '7〜10%：かなりの影響力。組織的な買い集めの可能性',
                '10%超：経営参画・提案行為も視野に入る水準',
                '33.3%超：株主総会での特別決議を単独否決できる水準',
              ],
            },
            {
              icon: '🎯', title: '保有目的の解釈',
              body: '保有目的は投資スタンスの把握に重要です。',
              list: [
                '純投資：株価上昇・配当収益目的。経営への介入は少ない',
                '政策投資：事業上の取引関係・安定株主構築が目的',
                '重要提案行為等：経営改善要求・株主提案等を行うアクティビスト',
              ],
            },
            {
              icon: '⚠️', title: '投資判断への活用上の注意',
              body: 'EDINETのデータは提出から数日の遅延があります（5営業日以内の提出義務）。また5%未満の保有は開示されないため、全機関投資家の動向を網羅するものではありません。本ページの情報は参考情報であり、投資判断はご自身の責任で行ってください。',
            },
          ].map(({ icon, title, body, list }) => (
            <div key={title} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'18px 20px',
            }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>
                {icon} {title}
              </h3>
              <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, margin:0 }}>{body}</p>
              {list && (
                <ul style={{ paddingLeft:'18px', marginTop:'10px', marginBottom:0 }}>
                  {list.map(item => (
                    <li key={item} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div style={{ padding:'12px 16px', background:'rgba(74,158,255,0.08)', borderRadius:'8px',
            border:'1px solid rgba(74,158,255,0.2)', fontSize:'12px', color:'var(--text2)' }}>
            📌 データソース: 金融庁 EDINET（電子開示システム）
            <a href="https://disclosure2.edinet-fsa.go.jp/" target="_blank" rel="noopener noreferrer"
              style={{ color:'var(--accent)', marginLeft:'8px' }}>
              disclosure2.edinet-fsa.go.jp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
