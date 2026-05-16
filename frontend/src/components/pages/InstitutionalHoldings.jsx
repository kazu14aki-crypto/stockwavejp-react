import { useState, useEffect, useCallback } from 'react'

// ── 機関投資家 大量保有情報 ───────────────────────────────────────
// GitHub Actions が毎日 EDINET から取得し
// /public/data/edinet_holdings.json に保存したデータを表示
// → バックエンドもCORSも不要・高速・安定

const DATA_PATH = '/data/edinet_holdings.json'

// 主要機関投資家の参考リスト
const MAJOR_INSTITUTIONS = [
  '三菱UFJフィナンシャル', 'ブラックロック', 'バンガード',
  'フィデリティ', '野村アセットマネジメント', '大和アセットマネジメント',
  '三菱UFJ信託銀行', '日本生命', '三井住友銀行', 'ノルウェー政府年金基金',
]

const fmtRatio = (r) => r ? parseFloat(r).toFixed(2) + '%' : '-'

function RatioBar({ ratio }) {
  const r = parseFloat(ratio) || 0
  const color = r >= 10 ? '#ff5370' : r >= 5 ? '#ff8c42' : '#4a9eff'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ width:'80px', height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', flexShrink:0 }}>
        <div style={{ width:`${Math.min(r*5,100)}%`, height:'100%', background:color, borderRadius:'3px', transition:'width 0.3s' }} />
      </div>
      <span style={{ fontSize:'13px', fontWeight:700, color, fontFamily:'var(--mono)', minWidth:'44px' }}>
        {r.toFixed(2)}%
      </span>
    </div>
  )
}

function HoldingSparkline({ history }) {
  if (!history || history.length < 2) return null
  const vals = history.map(h => parseFloat(h.ratio) || 0)
  const min = Math.min(...vals), max = Math.max(...vals)
  const W = 100, H = 32, P = 4
  const pts = vals.map((v, i) => {
    const x = P + (i / (vals.length-1)) * (W-P*2)
    const y = P + (1 - (max===min ? 0.5 : (v-min)/(max-min))) * (H-P*2)
    return `${x},${y}`
  }).join(' ')
  const color = vals[vals.length-1] >= vals[vals.length-2] ? '#ff5370' : '#00c48c'
  return (
    <svg width={W} height={H} style={{ flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {vals.map((v, i) => {
        const x = P + (i/(vals.length-1))*(W-P*2)
        const y = P + (1-(max===min?.5:(v-min)/(max-min)))*(H-P*2)
        return <circle key={i} cx={x} cy={y} r="2" fill={color}/>
      })}
    </svg>
  )
}

export default function InstitutionalHoldings() {
  const [allData,   setAllData]   = useState([])   // 全データ
  const [filtered,  setFiltered]  = useState([])   // フィルタ後
  const [query,     setQuery]     = useState('')
  const [loading,   setLoading]   = useState(true)
  const [updatedAt, setUpdatedAt] = useState('')
  const [sortKey,   setSortKey]   = useState('date')
  const [sortDesc,  setSortDesc]  = useState(true)
  const [tab,       setTab]       = useState('list')
  const [history,   setHistory]   = useState({})   // 保有者 → 変遷

  // ── 静的JSONを読み込む ────────────────────────────────────────
  useEffect(() => {
    fetch(`${DATA_PATH}?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        const results = d.results || []
        setAllData(results)
        setFiltered(results)
        setUpdatedAt(d.updated_at || '')
        // 保有者別の変遷を構築
        const hist = {}
        results.forEach(doc => {
          const holder = doc.filerName || '不明'
          if (!hist[holder]) hist[holder] = []
          hist[holder].push({
            date:    doc.submitDate,
            ratio:   doc.holdingRatio,
            docType: doc.docTypeName || (doc.docTypeCode === '28' ? '新規' : '変更'),
            docID:   doc.docID,
          })
        })
        Object.keys(hist).forEach(k => hist[k].sort((a,b) => (a.date||'').localeCompare(b.date||'')))
        setHistory(hist)
      })
      .catch(e => {
        console.error('EDINET data load error:', e)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── 検索フィルタ ──────────────────────────────────────────────
  const search = useCallback((q) => {
    const ql = (q || '').trim().toLowerCase()
    if (!ql) { setFiltered(allData); return }
    setFiltered(allData.filter(doc =>
      (doc.issuerName || '').toLowerCase().includes(ql) ||
      (doc.secCode    || '').toLowerCase().includes(ql) ||
      (doc.filerName  || '').toLowerCase().includes(ql)
    ))
  }, [allData])

  // ── ソート ───────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'ratio') {
      const ra = parseFloat(a.holdingRatio)||0, rb = parseFloat(b.holdingRatio)||0
      return sortDesc ? rb-ra : ra-rb
    }
    if (sortKey === 'date') {
      return sortDesc
        ? (b.submitDate||'').localeCompare(a.submitDate||'')
        : (a.submitDate||'').localeCompare(b.submitDate||'')
    }
    if (sortKey === 'holder') {
      return sortDesc
        ? (b.filerName||'').localeCompare(a.filerName||'')
        : (a.filerName||'').localeCompare(b.filerName||'')
    }
    return 0
  })

  const SH = ({ k }) => sortKey===k
    ? <span style={{ color:'var(--accent)', marginLeft:'3px' }}>{sortDesc?'↓':'↑'}</span>
    : <span style={{ color:'var(--text3)', marginLeft:'3px' }}>↕</span>

  const thStyle = (k) => ({
    padding:'10px 12px', textAlign:'left', cursor:'pointer',
    color:'var(--text3)', fontWeight:600, fontSize:'11px',
    borderBottom:'2px solid var(--border)',
    textTransform:'uppercase', letterSpacing:'0.05em', userSelect:'none',
  })

  const tabs = [['list','📋 保有一覧'],['chart','📈 変遷グラフ'],['guide','💡 読み方ガイド']]

  return (
    <div style={{ padding:'24px 20px 60px', maxWidth:'1000px', margin:'0 auto' }}>
      <div style={{ marginBottom:'16px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
          🏦 機関投資家 大量保有情報
        </h1>
        <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7 }}>
          金融庁EDINET（電子開示システム）の大量保有報告書データ。
          上場株式の5%超を保有した機関投資家は5日以内に提出が義務付けられています。
        </p>
        {updatedAt && updatedAt !== '未取得' && (
          <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>
            📅 データ更新日: {updatedAt}
          </div>
        )}
      </div>

      {/* タブ */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'20px', borderBottom:'1px solid var(--border)' }}>
        {tabs.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'8px 16px', border:'none', cursor:'pointer',
            background: tab===k ? 'var(--accent)' : 'transparent',
            color: tab===k ? '#fff' : 'var(--text3)',
            borderRadius:'6px 6px 0 0', fontFamily:'var(--font)',
            fontSize:'13px', fontWeight: tab===k ? 700 : 400,
            borderBottom: tab===k ? '2px solid var(--accent)' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      {/* ── 保有一覧タブ ── */}
      {tab === 'list' && (
        <>
          {/* 検索バー */}
          <div style={{ display:'flex', gap:'10px', marginBottom:'12px', flexWrap:'wrap' }}>
            <input
              type="text"
              placeholder="銘柄名・証券コード・保有者名で検索（例：トヨタ、7203、ブラックロック）"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search(query)}
              style={{
                flex:'1', minWidth:'280px', padding:'10px 14px',
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'8px', color:'var(--text)', fontSize:'13px',
                fontFamily:'var(--font)', outline:'none',
              }}
            />
            <button onClick={() => search(query)} style={{
              padding:'10px 20px', background:'var(--accent)', color:'#fff',
              border:'none', borderRadius:'8px', cursor:'pointer',
              fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, flexShrink:0,
            }}>🔍 検索</button>
            {filtered.length < allData.length && (
              <button onClick={() => { setQuery(''); setFiltered(allData) }} style={{
                padding:'10px 14px', background:'var(--bg3)',
                border:'1px solid var(--border)', borderRadius:'8px',
                color:'var(--text2)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px',
              }}>クリア</button>
            )}
          </div>

          {/* 主要機関投資家クイック選択 */}
          <div style={{ marginBottom:'16px' }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>主要機関投資家：</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {MAJOR_INSTITUTIONS.map(inst => (
                <button key={inst} onClick={() => search(inst)}
                  style={{
                    padding:'4px 10px', borderRadius:'20px', cursor:'pointer',
                    background: query === inst ? 'rgba(74,158,255,0.15)' : 'var(--bg2)',
                    border: `1px solid ${query === inst ? 'var(--accent)' : 'var(--border)'}`,
                    color: query === inst ? 'var(--accent)' : 'var(--text2)',
                    fontSize:'11px', fontFamily:'var(--font)',
                  }}>
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
              <div style={{ fontSize:'24px', marginBottom:'8px' }}>⏳</div>
              <p>データを読み込み中...</p>
            </div>
          ) : allData.length === 0 ? (
            <div style={{ padding:'20px', background:'rgba(74,158,255,0.08)',
              borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)',
              fontSize:'13px', color:'var(--text2)', lineHeight:1.8 }}>
              <strong>📋 データを準備中です</strong><br/>
              大量保有報告書データは毎日自動更新されます。<br/>
              しばらくしてからページを再読み込みしてください。
            </div>
          ) : (
            <>
              <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'8px' }}>
                {filtered.length}件 / 全{allData.length}件
                {query && <span style={{ marginLeft:'8px' }}>（「{query}」で絞り込み）</span>}
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                  <thead>
                    <tr style={{ background:'var(--bg2)' }}>
                      <th onClick={() => { if(sortKey==='date') setSortDesc(d=>!d); else {setSortKey('date');setSortDesc(true)} }}
                        style={{...thStyle('date'), minWidth:'100px'}}>
                        報告日<SH k="date"/>
                      </th>
                      <th onClick={() => { if(sortKey==='holder') setSortDesc(d=>!d); else {setSortKey('holder');setSortDesc(true)} }}
                        style={{...thStyle('holder'), minWidth:'180px'}}>
                        保有者（機関投資家）<SH k="holder"/>
                      </th>
                      <th style={{...thStyle('issuer'), minWidth:'160px', cursor:'default'}}>対象銘柄</th>
                      <th onClick={() => { if(sortKey==='ratio') setSortDesc(d=>!d); else {setSortKey('ratio');setSortDesc(true)} }}
                        style={{...thStyle('ratio'), minWidth:'140px'}}>
                        保有割合<SH k="ratio"/>
                      </th>
                      <th style={{...thStyle('type'), minWidth:'80px', cursor:'default'}}>種別</th>
                      <th style={{...thStyle('link'), minWidth:'60px', cursor:'default'}}>書類</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.slice(0, 200).map((doc, i) => (
                      <tr key={doc.docID || i} style={{
                        borderBottom:'1px solid var(--border)',
                        background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      }}>
                        <td style={{ padding:'9px 12px', color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'11px' }}>
                          {doc.submitDate || '-'}
                        </td>
                        <td style={{ padding:'9px 12px', color:'var(--text)', fontWeight:500 }}>
                          {doc.filerName || '-'}
                        </td>
                        <td style={{ padding:'9px 12px' }}>
                          <div style={{ color:'var(--text)', fontWeight:600 }}>{doc.issuerName || '-'}</div>
                          {doc.secCode && (
                            <div style={{ color:'var(--text3)', fontSize:'10px', fontFamily:'var(--mono)' }}>{doc.secCode}</div>
                          )}
                        </td>
                        <td style={{ padding:'9px 12px' }}>
                          {doc.holdingRatio
                            ? <RatioBar ratio={doc.holdingRatio}/>
                            : <span style={{ color:'var(--text3)' }}>-</span>}
                        </td>
                        <td style={{ padding:'9px 12px', fontSize:'11px' }}>
                          {doc.docTypeName === '新規' ? '🆕 新規'
                           : doc.docTypeName === '変更' ? '🔄 変更' : '⚡ 特例'}
                        </td>
                        <td style={{ padding:'9px 12px' }}>
                          {doc.docID && (
                            <a href={`https://disclosure2.edinet-fsa.go.jp/webd/detail/${doc.docID}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{
                                padding:'3px 8px',
                                background:'rgba(74,158,255,0.1)',
                                border:'1px solid rgba(74,158,255,0.3)',
                                borderRadius:'4px', color:'#4a9eff',
                                fontSize:'11px', textDecoration:'none',
                              }}>
                              PDF
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sorted.length > 200 && (
                  <div style={{ textAlign:'center', padding:'12px', fontSize:'12px', color:'var(--text3)' }}>
                    ※ 表示は上位200件まで。絞り込みで件数を減らしてください。
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ── 変遷グラフタブ ── */}
      {tab === 'chart' && (
        <div>
          {Object.keys(history).length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text3)' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px' }}>📊</div>
              <p>データがまだありません。<br/>「保有一覧」タブでデータを確認してください。</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {Object.entries(history)
                .sort((a,b) => b[1].length - a[1].length)  // 変更回数が多い順
                .slice(0, 20)  // 上位20社
                .map(([holder, records]) => (
                  <div key={holder} style={{
                    background:'var(--bg2)', border:'1px solid var(--border)',
                    borderRadius:'10px', padding:'14px 18px',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                      <div>
                        <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>{holder}</div>
                        <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'2px' }}>
                          報告{records.length}回
                        </div>
                      </div>
                      <HoldingSparkline history={records}/>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {records.map((r, i) => (
                        <div key={i} style={{
                          padding:'3px 8px', background:'var(--bg3)',
                          borderRadius:'4px', fontSize:'10px',
                          fontFamily:'var(--mono)', color:'var(--text2)',
                        }}>
                          {r.date}: {r.ratio ? parseFloat(r.ratio).toFixed(2)+'%' : '-'}
                          <span style={{ marginLeft:'4px', color:'var(--text3)', fontSize:'9px' }}>({r.docType})</span>
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
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[
            { icon:'📋', title:'大量保有報告書とは',
              body:'上場株式の5%超を取得した投資家（機関投資家・外国人投資家等）は、金融商品取引法により5営業日以内に金融庁のEDINETシステムへ報告書を提出する義務があります。保有割合が1%以上変動した際は変更報告書を追加提出します。' },
            { icon:'📈', title:'保有割合の見方',
              body:'保有割合が高いほど機関投資家の影響力が強くなります。',
              list:[
                '5〜7%：新規大量保有。注目度が上がるきっかけ',
                '7〜10%：かなりの影響力。組織的な買い集めの可能性',
                '10%超：経営参画・提案行為も視野に入る水準',
                '33.3%超：株主総会の特別決議を単独否決できる水準',
              ]},
            { icon:'🎯', title:'保有目的の解釈',
              body:'保有目的は投資スタンスの把握に重要です。',
              list:[
                '純投資：株価上昇・配当収益目的。経営への介入は少ない',
                '政策投資：事業上の取引関係・安定株主構築が目的',
                '重要提案行為等：経営改善要求を行うアクティビスト',
              ]},
            { icon:'⚠️', title:'投資判断への活用上の注意',
              body:'EDINETのデータは提出から数日の遅延があります（5営業日以内の提出義務）。また5%未満の保有は開示されないため全体を網羅するものではありません。本ページの情報は参考情報であり、投資判断はご自身の責任で行ってください。' },
          ].map(({ icon, title, body, list }) => (
            <div key={title} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'16px 20px',
            }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
                {icon} {title}
              </h3>
              <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, margin:0 }}>{body}</p>
              {list && (
                <ul style={{ paddingLeft:'18px', marginTop:'8px', marginBottom:0 }}>
                  {list.map(item => (
                    <li key={item} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div style={{ padding:'10px 14px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)',
            fontSize:'12px', color:'var(--text2)' }}>
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
