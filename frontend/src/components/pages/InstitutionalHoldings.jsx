import { useState, useEffect, useCallback, useMemo } from 'react'

// ── 機関投資家 大量保有情報 ───────────────────────────────────────
const DATA_PATH = '/data/edinet_holdings.json'

function RatioBar({ ratio }) {
  const r = parseFloat(ratio) || 0
  const color = r >= 10 ? '#ff5370' : r >= 7 ? '#ff8c42' : r >= 5 ? '#4a9eff' : '#8b949e'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ width:'70px', height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', flexShrink:0 }}>
        <div style={{ width:`${Math.min(r*5,100)}%`, height:'100%', background:color, borderRadius:'3px' }} />
      </div>
      <span style={{ fontSize:'13px', fontWeight:700, color, fontFamily:'var(--mono)', minWidth:'44px' }}>
        {r.toFixed(2)}%
      </span>
    </div>
  )
}

// 銘柄カード（銘柄ごとの機関投資家保有状況）
function IssuerCard({ issuerName, secCode, docs }) {
  const [open, setOpen] = useState(false)

  // 機関投資家ごとの最新保有状況
  const holderMap = {}
  docs.forEach(doc => {
    const h = doc.filerName || '不明'
    if (!holderMap[h]) holderMap[h] = []
    holderMap[h].push(doc)
  })

  // 機関投資家ごとの最新報告を取得
  const holders = Object.entries(holderMap).map(([name, records]) => {
    const sorted = [...records].sort((a, b) => (b.submitDate || '').localeCompare(a.submitDate || ''))
    const latest = sorted[0]
    return {
      name,
      latestRatio: latest.holdingRatio,
      latestDate: latest.submitDate,
      docType: latest.docTypeName,
      docID: latest.docID,
      changeCount: records.length,
      history: sorted,
    }
  }).sort((a, b) => (parseFloat(b.latestRatio) || 0) - (parseFloat(a.latestRatio) || 0))

  const totalHolders = holders.length
  const maxRatio = Math.max(...holders.map(h => parseFloat(h.latestRatio) || 0))
  const latestDate = docs.reduce((max, d) => (d.submitDate || '') > max ? (d.submitDate || '') : max, '')

  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'10px', marginBottom:'10px', overflow:'hidden',
    }}>
      {/* ヘッダー */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding:'14px 18px', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background: open ? 'rgba(74,158,255,0.05)' : 'transparent',
        }}
      >
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>{issuerName}</span>
            {secCode && (
              <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)',
                background:'var(--bg3)', padding:'2px 7px', borderRadius:'4px' }}>
                {secCode}
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:'14px', marginTop:'6px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>
              🏦 機関投資家 <strong style={{ color:'var(--text2)' }}>{totalHolders}社</strong>
            </span>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>
              📊 最大保有 <strong style={{ color:'#4a9eff' }}>{maxRatio.toFixed(2)}%</strong>
            </span>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>
              📅 最終更新 <strong style={{ color:'var(--text2)' }}>{latestDate}</strong>
            </span>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>
              📋 報告件数 <strong style={{ color:'var(--text2)' }}>{docs.length}件</strong>
            </span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
          {/* 機関投資家ミニバー */}
          <div style={{ display:'flex', gap:'3px', alignItems:'flex-end', height:'24px' }}>
            {holders.slice(0, 5).map((h, i) => {
              const r = parseFloat(h.latestRatio) || 0
              const color = r >= 10 ? '#ff5370' : r >= 7 ? '#ff8c42' : '#4a9eff'
              return (
                <div key={i} title={`${h.name}: ${r.toFixed(2)}%`}
                  style={{ width:'6px', height:`${Math.max(4, r*2.4)}px`, background:color, borderRadius:'2px', maxHeight:'24px' }} />
              )
            })}
          </div>
          <span style={{ fontSize:'18px', color:'var(--text3)', transition:'transform 0.2s',
            transform: open ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
        </div>
      </div>

      {/* 展開コンテンツ */}
      {open && (
        <div style={{ padding:'0 18px 16px', borderTop:'1px solid var(--border)' }}>
          <div style={{ paddingTop:'14px' }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'10px',
              textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>
              機関投資家別 保有状況
            </div>
            {holders.map((h, i) => (
              <div key={i} style={{
                padding:'10px 12px', background:'var(--bg3)', borderRadius:'8px',
                marginBottom:'8px',
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                  <div style={{ flex:1, minWidth:'160px' }}>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>
                      {h.name}
                    </div>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'10px', color:'var(--text3)' }}>
                        最終報告: {h.latestDate}
                      </span>
                      <span style={{ fontSize:'10px', padding:'1px 6px',
                        background:'rgba(74,158,255,0.1)', color:'#4a9eff', borderRadius:'3px' }}>
                        {h.docType}
                      </span>
                      {h.changeCount > 1 && (
                        <span style={{ fontSize:'10px', color:'var(--text3)' }}>
                          変更{h.changeCount}回
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <RatioBar ratio={h.latestRatio}/>
                    {h.docID && (
                      <a href={`https://disclosure2.edinet-fsa.go.jp/webd/detail/${h.docID}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          padding:'3px 8px', background:'rgba(74,158,255,0.1)',
                          border:'1px solid rgba(74,158,255,0.3)',
                          borderRadius:'4px', color:'#4a9eff',
                          fontSize:'10px', textDecoration:'none', flexShrink:0,
                        }}>
                        PDF
                      </a>
                    )}
                  </div>
                </div>
                {/* 変更履歴（複数報告がある場合） */}
                {h.changeCount > 1 && (
                  <div style={{ marginTop:'8px', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'5px' }}>変更履歴：</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                      {h.history.map((rec, ri) => (
                        <div key={ri} style={{
                          fontSize:'10px', padding:'2px 8px',
                          background:'var(--bg2)', borderRadius:'4px',
                          color:'var(--text3)', fontFamily:'var(--mono)',
                        }}>
                          {rec.submitDate}:
                          <span style={{ color: parseFloat(rec.holdingRatio) >= 5 ? '#4a9eff' : 'var(--text2)',
                            marginLeft:'4px', fontWeight:600 }}>
                            {rec.holdingRatio ? parseFloat(rec.holdingRatio).toFixed(2)+'%' : '-'}
                          </span>
                          <span style={{ marginLeft:'4px', opacity:0.6 }}>({rec.docTypeName})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InstitutionalHoldings() {
  const [allData,   setAllData]   = useState([])
  const [query,     setQuery]     = useState('')
  const [searchQ,   setSearchQ]   = useState('')  // 実際に検索されたクエリ
  const [loading,   setLoading]   = useState(true)
  const [updatedAt, setUpdatedAt] = useState('')
  const [tab,       setTab]       = useState('issuer')  // issuer | holder | guide

  useEffect(() => {
    fetch(`${DATA_PATH}?t=${Date.now()}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => {
        setAllData(d.results || [])
        setUpdatedAt(d.updated_at || '')
      })
      .catch(e => console.error('EDINET data load error:', e))
      .finally(() => setLoading(false))
  }, [])

  // 銘柄ごとにグループ化
  const issuerGroups = useMemo(() => {
    const ql = searchQ.trim().toLowerCase()
    const filtered = ql
      ? allData.filter(doc =>
          (doc.issuerName || '').toLowerCase().includes(ql) ||
          (doc.secCode    || '').toLowerCase().includes(ql) ||
          (doc.filerName  || '').toLowerCase().includes(ql)
        )
      : allData

    const groups = {}
    filtered.forEach(doc => {
      const key = doc.issuerName || doc.secCode || '不明'
      if (!groups[key]) groups[key] = { issuerName: doc.issuerName || key, secCode: doc.secCode, docs: [] }
      groups[key].docs.push(doc)
    })
    // 機関投資家数が多い順にソート
    return Object.values(groups).sort((a, b) => {
      const aHolders = new Set(a.docs.map(d => d.filerName)).size
      const bHolders = new Set(b.docs.map(d => d.filerName)).size
      return bHolders - aHolders
    })
  }, [allData, searchQ])

  // 機関投資家ごとにグループ化（保有者タブ用）
  const holderGroups = useMemo(() => {
    const ql = searchQ.trim().toLowerCase()
    const filtered = ql
      ? allData.filter(doc =>
          (doc.filerName  || '').toLowerCase().includes(ql) ||
          (doc.issuerName || '').toLowerCase().includes(ql) ||
          (doc.secCode    || '').toLowerCase().includes(ql)
        )
      : allData

    const groups = {}
    filtered.forEach(doc => {
      const key = doc.filerName || '不明'
      if (!groups[key]) groups[key] = []
      groups[key].push(doc)
    })
    return Object.entries(groups)
      .map(([name, docs]) => ({ name, docs, issuerCount: new Set(docs.map(d => d.issuerName)).size }))
      .sort((a, b) => b.issuerCount - a.issuerCount)
  }, [allData, searchQ])

  const doSearch = useCallback(() => setSearchQ(query), [query])

  const tabs = [
    ['issuer', '🏢 銘柄から探す（推奨）'],
    ['holder', '🏦 機関投資家から探す'],
    ['guide',  '💡 読み方ガイド'],
  ]

  return (
    <div style={{ padding:'24px 20px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <div style={{ marginBottom:'16px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
          🏦 機関投資家 大量保有情報
        </h1>
        <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7 }}>
          金融庁EDINETの大量保有報告書データ。
          上場株式の5%超を保有した機関投資家は5日以内に提出が義務付けられています。
        </p>
        {updatedAt && updatedAt !== '未取得' && (
          <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
            📅 データ更新日: {updatedAt}　全{allData.length}件
          </div>
        )}
      </div>

      {/* タブ */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'18px', borderBottom:'1px solid var(--border)' }}>
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'8px 14px', border:'none', cursor:'pointer',
            background: tab===k ? 'var(--accent)' : 'transparent',
            color: tab===k ? '#fff' : 'var(--text3)',
            borderRadius:'6px 6px 0 0', fontFamily:'var(--font)',
            fontSize:'12px', fontWeight: tab===k ? 700 : 400,
            borderBottom: tab===k ? '2px solid var(--accent)' : '2px solid transparent',
            whiteSpace:'nowrap',
          }}>{label}</button>
        ))}
      </div>

      {/* 検索バー（ガイド以外で表示） */}
      {tab !== 'guide' && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input
            type="text"
            placeholder={tab === 'issuer'
              ? '銘柄名・証券コードで検索（例：トヨタ、7203）'
              : '機関投資家名・銘柄名で検索（例：ブラックロック）'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            style={{
              flex:'1', minWidth:'260px', padding:'10px 14px',
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'8px', color:'var(--text)', fontSize:'13px',
              fontFamily:'var(--font)', outline:'none',
            }}
          />
          <button onClick={doSearch} style={{
            padding:'10px 20px', background:'var(--accent)', color:'#fff',
            border:'none', borderRadius:'8px', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, flexShrink:0,
          }}>🔍 検索</button>
          {searchQ && (
            <button onClick={() => { setQuery(''); setSearchQ('') }} style={{
              padding:'10px 14px', background:'var(--bg3)',
              border:'1px solid var(--border)', borderRadius:'8px',
              color:'var(--text2)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px',
            }}>クリア</button>
          )}
        </div>
      )}

      {/* ── 銘柄から探すタブ ── */}
      {tab === 'issuer' && (
        loading ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
            ⏳ データを読み込み中...
          </div>
        ) : allData.length === 0 ? (
          <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)',
            fontSize:'13px', color:'var(--text2)', lineHeight:1.8 }}>
            <strong>📋 データを準備中です</strong><br/>
            大量保有報告書データは毎日自動更新されます。しばらくしてから再読み込みしてください。
          </div>
        ) : (
          <>
            {searchQ && (
              <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'12px' }}>
                「{searchQ}」の検索結果: <strong style={{ color:'var(--text)' }}>{issuerGroups.length}銘柄</strong>
              </div>
            )}
            {issuerGroups.length === 0 ? (
              <div style={{ padding:'18px', background:'rgba(255,83,112,0.08)',
                borderRadius:'8px', border:'1px solid rgba(255,83,112,0.2)',
                fontSize:'13px', color:'#ff5370' }}>
                ⚠️ 「{searchQ}」に該当する銘柄が見つかりませんでした。
              </div>
            ) : (
              issuerGroups.slice(0, 50).map((group, i) => (
                <IssuerCard key={i}
                  issuerName={group.issuerName}
                  secCode={group.secCode}
                  docs={group.docs}
                />
              ))
            )}
          </>
        )
      )}

      {/* ── 機関投資家から探すタブ ── */}
      {tab === 'holder' && (
        loading ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>⏳ データを読み込み中...</div>
        ) : allData.length === 0 ? (
          <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)',
            fontSize:'13px', color:'var(--text2)' }}>
            📋 データを準備中です。しばらくしてから再読み込みしてください。
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {searchQ && (
              <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'4px' }}>
                「{searchQ}」の検索結果: <strong style={{ color:'var(--text)' }}>{holderGroups.length}社</strong>
              </div>
            )}
            {holderGroups.slice(0, 30).map((h, i) => (
              <div key={i} style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'10px', padding:'14px 18px',
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                  <div>
                    <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize:'12px', color:'var(--text3)' }}>
                      保有銘柄: <strong style={{ color:'var(--text2)' }}>{h.issuerCount}社</strong>
                      　報告件数: <strong style={{ color:'var(--text2)' }}>{h.docs.length}件</strong>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop:'10px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {[...new Set(h.docs.map(d => d.issuerName))].filter(Boolean).slice(0, 10).map((issuer, ii) => {
                    const latestDoc = h.docs.filter(d => d.issuerName === issuer)
                      .sort((a, b) => (b.submitDate||'').localeCompare(a.submitDate||''))[0]
                    return (
                      <div key={ii} style={{
                        padding:'4px 10px', background:'var(--bg3)',
                        borderRadius:'6px', fontSize:'11px', color:'var(--text2)',
                      }}>
                        {issuer}
                        {latestDoc?.holdingRatio && (
                          <span style={{ marginLeft:'5px', color:'#4a9eff', fontFamily:'var(--mono)', fontWeight:700 }}>
                            {parseFloat(latestDoc.holdingRatio).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── 読み方ガイドタブ ── */}
      {tab === 'guide' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[
            { icon:'📋', title:'大量保有報告書とは',
              body:'上場株式の5%超を取得した投資家（機関投資家・外国人投資家等）は、金融商品取引法により5営業日以内に金融庁のEDINETシステムへ報告書を提出する義務があります。保有割合が1%以上変動した際は変更報告書を追加提出します。' },
            { icon:'🔍', title:'このページの使い方',
              body:'「銘柄から探す」タブでは、投資したい銘柄名や証券コードを入力して、その銘柄をどの機関投資家がどれだけ保有しているかを確認できます。複数の機関投資家が同時に保有している場合は注目度が高い銘柄といえます。' },
            { icon:'📈', title:'保有割合の見方',
              body:'保有割合が高いほど機関投資家の影響力が強くなります。',
              list:[
                '5〜7%：新規大量保有。機関投資家が注目し始めたサイン',
                '7〜10%：かなりの影響力。組織的な買い集めの可能性',
                '10%超：経営参画・提案行為も視野に入る水準（アクティビスト）',
                '変更報告書（350）：保有割合が1%以上変動した際に提出。増加は強気サイン',
              ]},
            { icon:'🎯', title:'投資判断への活用',
              body:'複数の機関投資家が同じ銘柄に新規大量保有報告書を出している場合は、その銘柄への関心が高まっているサインです。変更報告書で保有割合が増加しているトレンドも強気サインとして参考になります。',
              list:[
                '新規（340）：初めて5%超を取得。新規の機関買いサイン',
                '変更（350）：保有割合が変動。増加なら積み増し、減少なら利益確定',
                '訂正（360）：過去の報告書を訂正。内容に注意',
              ]},
            { icon:'⚠️', title:'注意事項',
              body:'EDINETのデータは提出から最大5営業日の遅延があります。5%未満の保有は開示義務がないため全体を網羅するものではありません。本ページの情報は参考情報であり、投資判断はご自身の責任で行ってください。' },
          ].map(({ icon, title, body, list }) => (
            <div key={title} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 20px' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{icon} {title}</h3>
              <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, margin:0 }}>{body}</p>
              {list && (
                <ul style={{ paddingLeft:'18px', marginTop:'8px', marginBottom:0 }}>
                  {list.map(item => <li key={item} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
          <div style={{ padding:'10px 14px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)', fontSize:'12px', color:'var(--text2)' }}>
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
