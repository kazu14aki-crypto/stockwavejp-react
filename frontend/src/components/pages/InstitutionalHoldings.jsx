import { useState, useEffect, useCallback, useMemo } from 'react'

const DATA_PATH = '/data/edinet_holdings.json'

// ── ユーティリティ ────────────────────────────────────────────────
function RatioBar({ ratio, max = 20 }) {
  const r = parseFloat(ratio) || 0
  const color = r >= 10 ? '#ff5370' : r >= 7 ? '#ff8c42' : r >= 5 ? '#4a9eff' : '#8b949e'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ width:'80px', height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', flexShrink:0 }}>
        <div style={{ width:`${Math.min(r/max*100,100)}%`, height:'100%', background:color, borderRadius:'3px' }} />
      </div>
      <span style={{ fontSize:'13px', fontWeight:700, color, fontFamily:'var(--mono)', minWidth:'44px' }}>
        {r.toFixed(2)}%
      </span>
    </div>
  )
}

// 保有率推移スパークライン
function RatioSparkline({ records }) {
  const vals = records.map(r => parseFloat(r.holdingRatio) || 0).filter(v => v > 0)
  if (vals.length < 2) return null
  const min = Math.min(...vals), max = Math.max(...vals)
  const W = 100, H = 30, P = 4
  const pts = vals.map((v, i) => {
    const x = P + (i / (vals.length - 1)) * (W - P * 2)
    const y = P + (1 - (max === min ? 0.5 : (v - min) / (max - min))) * (H - P * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = vals[vals.length - 1], prev = vals[vals.length - 2]
  const color = last >= prev ? '#ff5370' : '#00c48c'
  return (
    <svg width={W} height={H} style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {vals.map((v, i) => {
        const x = P + (i / (vals.length - 1)) * (W - P * 2)
        const y = P + (1 - (max === min ? 0.5 : (v - min) / (max - min))) * (H - P * 2)
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />
      })}
    </svg>
  )
}

// ── 銘柄詳細ページ ────────────────────────────────────────────────
function IssuerDetailPage({ issuerName, secCode, docs, onBack }) {
  // 機関投資家ごとにグループ化
  const holderMap = {}
  docs.forEach(doc => {
    const h = doc.filerName || '不明'
    if (!holderMap[h]) holderMap[h] = []
    holderMap[h].push(doc)
  })

  const holders = Object.entries(holderMap).map(([name, records]) => {
    const sorted = [...records].sort((a, b) => (a.submitDate || '').localeCompare(b.submitDate || ''))
    const latest = sorted[sorted.length - 1]
    const first  = sorted[0]
    const latestRatio = parseFloat(latest.holdingRatio) || 0
    const firstRatio  = parseFloat(first.holdingRatio) || 0
    const trend = latestRatio > firstRatio ? 'up' : latestRatio < firstRatio ? 'down' : 'flat'
    return { name, records: sorted, latest, latestRatio, trend, changeCount: records.length }
  }).sort((a, b) => b.latestRatio - a.latestRatio)

  // 集計
  const totalInstitutional = holders.reduce((sum, h) => sum + h.latestRatio, 0)
  const holderCount = holders.length
  const maxRatio = holders[0]?.latestRatio || 0
  const latestDate = docs.reduce((max, d) => (d.submitDate || '') > max ? (d.submitDate || '') : max, '')

  // 浮動株概算（5%超株主合計から推算）
  const floatEstimate = Math.max(0, 100 - totalInstitutional)

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'860px', margin:'0 auto' }}>
      {/* 戻るボタン */}
      <button onClick={onBack} style={{
        display:'flex', alignItems:'center', gap:'6px',
        background:'transparent', border:'none', cursor:'pointer',
        color:'var(--text3)', fontSize:'13px', fontFamily:'var(--font)',
        marginBottom:'18px', padding:0,
      }}>
        ← 銘柄一覧に戻る
      </button>

      {/* 銘柄ヘッダー */}
      <div style={{ marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', margin:0 }}>
            {issuerName}
          </h1>
          {secCode && (
            <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)',
              background:'var(--bg3)', padding:'3px 8px', borderRadius:'4px' }}>
              {secCode}
            </span>
          )}
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'6px' }}>
          最終更新: {latestDate}　　データ期間: 過去60日間のEDINET開示情報
        </div>
      </div>

      {/* サマリーカード */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)',
        gap:'10px', marginBottom:'20px',
      }}>
        {[
          { label:'報告機関投資家数', value:`${holderCount}社`, color:'#4a9eff',
            desc:'5%超を保有する機関' },
          { label:'最大単独保有率', value:`${maxRatio.toFixed(2)}%`, color:maxRatio>=10?'#ff5370':'#ff8c42',
            desc:'最大の単独機関の保有割合' },
          { label:'大株主合計保有率', value:`${totalInstitutional.toFixed(1)}%`, color:'#aa77ff',
            desc:'5%超株主の合計（概算）' },
        ].map(({ label, value, color, desc }) => (
          <div key={label} style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'10px', padding:'14px 16px',
          }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>{label}</div>
            <div style={{ fontSize:'22px', fontWeight:800, color, fontFamily:'var(--mono)', marginBottom:'4px' }}>{value}</div>
            <div style={{ fontSize:'10px', color:'var(--text3)' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* 保有構成の概算バー */}
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'10px', padding:'16px 20px', marginBottom:'16px',
      }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'12px' }}>
          📊 大株主保有率の内訳（概算）
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>
          ※ EDINETに開示された5%超の株主のみ。実際の機関投資家保有比率はこれより高い場合があります。
        </div>

        {/* 積み上げバー */}
        <div style={{ height:'28px', borderRadius:'6px', overflow:'hidden',
          display:'flex', marginBottom:'10px' }}>
          {holders.map((h, i) => {
            const colors = ['#ff5370','#ff8c42','#4a9eff','#aa77ff','#00c48c','#ffd700','#ff69b4','#20b2aa']
            const w = Math.max(0.5, h.latestRatio / Math.max(totalInstitutional + floatEstimate, 100) * 100)
            return (
              <div key={i} title={`${h.name}: ${h.latestRatio.toFixed(2)}%`}
                style={{ width:`${w}%`, background:colors[i % colors.length], minWidth:'2px' }} />
            )
          })}
          {floatEstimate > 0 && (
            <div title={`その他（推定浮動株等）: ${floatEstimate.toFixed(1)}%`}
              style={{ flex:1, background:'rgba(255,255,255,0.08)' }} />
          )}
        </div>

        {/* 凡例 */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {holders.slice(0, 6).map((h, i) => {
            const colors = ['#ff5370','#ff8c42','#4a9eff','#aa77ff','#00c48c','#ffd700','#ff69b4','#20b2aa']
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'var(--text3)' }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'2px', background:colors[i], flexShrink:0 }} />
                <span>{h.name}</span>
                <span style={{ color:colors[i], fontFamily:'var(--mono)', fontWeight:600 }}>{h.latestRatio.toFixed(2)}%</span>
              </div>
            )
          })}
          <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'var(--text3)' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'2px', background:'rgba(255,255,255,0.15)', flexShrink:0 }} />
            <span>その他（推定）</span>
            <span style={{ color:'var(--text3)', fontFamily:'var(--mono)' }}>
              準備中
            </span>
          </div>
        </div>
      </div>

      {/* 機関投資家別詳細 */}
      <div style={{ marginBottom:'16px' }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'12px' }}>
          🏦 機関投資家別 保有状況・変遷
        </div>
        {holders.map((h, i) => {
          const colors = ['#ff5370','#ff8c42','#4a9eff','#aa77ff','#00c48c','#ffd700','#ff69b4','#20b2aa']
          const color = colors[i % colors.length]
          const trendIcon = h.trend === 'up' ? '↑ 増加' : h.trend === 'down' ? '↓ 減少' : '→ 横ばい'
          const trendColor = h.trend === 'up' ? '#ff5370' : h.trend === 'down' ? '#00c48c' : 'var(--text3)'
          return (
            <div key={i} style={{
              background:'var(--bg2)', border:`1px solid ${color}30`,
              borderLeft:`3px solid ${color}`,
              borderRadius:'8px', padding:'14px 16px', marginBottom:'10px',
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                <div style={{ flex:1, minWidth:'160px' }}>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
                    {h.name}
                  </div>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', color:'var(--text3)' }}>
                      報告{h.changeCount}回
                    </span>
                    <span style={{ fontSize:'11px', color:trendColor, fontWeight:600 }}>
                      {trendIcon}
                    </span>
                    <span style={{ fontSize:'10px', padding:'2px 6px',
                      background:'rgba(74,158,255,0.1)', color:'#4a9eff', borderRadius:'3px' }}>
                      {h.latest.docTypeName}
                    </span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <RatioSparkline records={h.records} />
                  <RatioBar ratio={h.latestRatio} />
                </div>
              </div>

              {/* 変更履歴 */}
              {h.changeCount > 0 && (
                <div style={{ marginTop:'10px', paddingTop:'10px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>変更履歴（古い順）</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {h.records.map((rec, ri) => {
                      const r = parseFloat(rec.holdingRatio) || 0
                      const prev = ri > 0 ? parseFloat(h.records[ri-1].holdingRatio) || 0 : r
                      const diff = r - prev
                      return (
                        <div key={ri} style={{
                          padding:'4px 10px', background:'var(--bg3)',
                          borderRadius:'6px', fontSize:'11px',
                          fontFamily:'var(--mono)',
                        }}>
                          <span style={{ color:'var(--text3)', marginRight:'6px' }}>{rec.submitDate}</span>
                          <span style={{ color: r >= 10 ? '#ff5370' : r >= 5 ? '#4a9eff' : 'var(--text2)', fontWeight:600 }}>
                            {r.toFixed(2)}%
                          </span>
                          {ri > 0 && diff !== 0 && (
                            <span style={{ marginLeft:'4px', fontSize:'10px',
                              color: diff > 0 ? '#ff5370' : '#00c48c' }}>
                              {diff > 0 ? '▲' : '▼'}{Math.abs(diff).toFixed(2)}%
                            </span>
                          )}
                          <span style={{ marginLeft:'5px', fontSize:'9px', color:'var(--text3)', opacity:0.7 }}>
                            ({rec.docTypeName})
                          </span>
                          {rec.docID && (
                            <a href={`https://disclosure2.edinet-fsa.go.jp/webd/detail/${rec.docID}`}
                              target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ marginLeft:'6px', color:'#4a9eff', fontSize:'9px', textDecoration:'none' }}>
                              PDF
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 浮動株 準備中 */}
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'10px', padding:'16px 20px', opacity:0.7,
      }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
          📈 浮動株・発行済株式総数（準備中）
        </div>
        <div style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.8 }}>
          発行済株式総数・浮動株比率・外国人持株比率などのデータは今後追加予定です。<br />
          現在表示しているのはEDINETに開示された5%超の大量保有情報のみです。
        </div>
      </div>
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export default function InstitutionalHoldings() {
  const [allData,        setAllData]        = useState([])
  const [query,          setQuery]          = useState('')
  const [searchQ,        setSearchQ]        = useState('')
  const [loading,        setLoading]        = useState(true)
  const [updatedAt,      setUpdatedAt]      = useState('')
  const [tab,            setTab]            = useState('issuer')
  const [selectedIssuer, setSelectedIssuer] = useState(null)  // 詳細ページ用

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
    return Object.values(groups).sort((a, b) => {
      const aH = new Set(a.docs.map(d => d.filerName)).size
      const bH = new Set(b.docs.map(d => d.filerName)).size
      return bH - aH
    })
  }, [allData, searchQ])

  // 機関投資家ごとにグループ化
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

  // 詳細ページが選択されている場合
  if (selectedIssuer) {
    return (
      <IssuerDetailPage
        issuerName={selectedIssuer.issuerName}
        secCode={selectedIssuer.secCode}
        docs={selectedIssuer.docs}
        onBack={() => setSelectedIssuer(null)}
      />
    )
  }

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
          金融庁EDINETの大量保有報告書データ。5%超を保有した機関投資家は5日以内に提出が義務付けられています。
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

      {/* 検索バー */}
      {tab !== 'guide' && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input
            type="text"
            placeholder={tab==='issuer'
              ? '銘柄名・証券コードで検索（例：トヨタ、7203）'
              : '機関投資家名・銘柄名で検索'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key==='Enter' && doSearch()}
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
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>⏳ データを読み込み中...</div>
        ) : allData.length === 0 ? (
          <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)',
            fontSize:'13px', color:'var(--text2)', lineHeight:1.8 }}>
            <strong>📋 データを準備中です</strong><br/>
            大量保有報告書データは毎日自動更新されます。
          </div>
        ) : (
          <>
            {searchQ && (
              <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'12px' }}>
                「{searchQ}」: <strong style={{ color:'var(--text)' }}>{issuerGroups.length}銘柄</strong>
              </div>
            )}
            {issuerGroups.length === 0 ? (
              <div style={{ padding:'16px', background:'rgba(255,83,112,0.08)',
                borderRadius:'8px', fontSize:'13px', color:'#ff5370' }}>
                ⚠️ 「{searchQ}」に該当する銘柄が見つかりませんでした。
              </div>
            ) : (
              issuerGroups.slice(0, 50).map((group, i) => {
                const holderCount = new Set(group.docs.map(d => d.filerName)).size
                const maxRatio = Math.max(...group.docs.map(d => parseFloat(d.holdingRatio)||0))
                const latestDate = group.docs.reduce((max,d)=>(d.submitDate||'')>max?(d.submitDate||''):max,'')
                return (
                  <div key={i}
                    onClick={() => setSelectedIssuer(group)}
                    style={{
                      background:'var(--bg2)', border:'1px solid var(--border)',
                      borderRadius:'10px', padding:'14px 18px', marginBottom:'8px',
                      cursor:'pointer', transition:'border-color 0.15s, transform 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'; e.currentTarget.style.transform='translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}
                  >
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                          <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>{group.issuerName}</span>
                          {group.secCode && (
                            <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)',
                              background:'var(--bg3)', padding:'2px 6px', borderRadius:'3px' }}>
                              {group.secCode}
                            </span>
                          )}
                        </div>
                        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', fontSize:'12px', color:'var(--text3)' }}>
                          <span>🏦 {holderCount}社保有</span>
                          <span>📊 最大 <strong style={{ color:'#4a9eff' }}>{maxRatio.toFixed(2)}%</strong></span>
                          <span>📅 {latestDate}</span>
                          <span>📋 {group.docs.length}件</span>
                        </div>
                      </div>
                      <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
                    </div>
                  </div>
                )
              })
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
            borderRadius:'8px', fontSize:'13px', color:'var(--text2)' }}>
            📋 データを準備中です。
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {holderGroups.slice(0, 30).map((h, i) => (
              <div key={i} style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'10px', padding:'14px 18px',
              }}>
                <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>{h.name}</div>
                <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'8px' }}>
                  保有銘柄: <strong style={{ color:'var(--text2)' }}>{h.issuerCount}社</strong>
                  　報告件数: <strong style={{ color:'var(--text2)' }}>{h.docs.length}件</strong>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {[...new Set(h.docs.map(d => d.issuerName))].filter(Boolean).slice(0, 8).map((issuer, ii) => {
                    const latestDoc = h.docs.filter(d => d.issuerName === issuer)
                      .sort((a,b) => (b.submitDate||'').localeCompare(a.submitDate||''))[0]
                    const issuerGroup = { issuerName: issuer, secCode: latestDoc?.secCode, docs: allData.filter(d => d.issuerName === issuer) }
                    return (
                      <div key={ii}
                        onClick={() => setSelectedIssuer(issuerGroup)}
                        style={{
                          padding:'4px 10px', background:'var(--bg3)',
                          borderRadius:'6px', fontSize:'11px', color:'var(--text2)',
                          cursor:'pointer',
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

      {/* ── ガイドタブ ── */}
      {tab === 'guide' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[
            { icon:'📋', title:'大量保有報告書とは',
              body:'上場株式の5%超を取得した投資家は、金融商品取引法により5営業日以内に金融庁のEDINETシステムへ報告書を提出する義務があります。保有割合が1%以上変動した際は変更報告書を追加提出します。' },
            { icon:'🔍', title:'銘柄詳細ページの見方',
              body:'銘柄をクリックすると詳細ページに移動します。詳細ページでは機関投資家別の保有割合、変更履歴（増加・減少トレンド）、保有構成の積み上げグラフを確認できます。' },
            { icon:'📈', title:'保有割合の見方',
              body:'保有割合の意味と投資判断への活用方法。',
              list:[
                '5〜7%：新規大量保有。機関投資家の注目サイン',
                '7〜10%：強い影響力。組織的な買い集めの可能性',
                '10%超：アクティビスト・経営参画も視野に',
                '変更報告書で増加トレンド → 積み増し中のサイン',
              ]},
            { icon:'⚠️', title:'注意事項',
              body:'EDINETのデータは最大5営業日の遅延があります。5%未満の保有は開示されません。本情報は参考情報であり、投資判断はご自身の責任で行ってください。' },
          ].map(({ icon, title, body, list }) => (
            <div key={title} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 20px' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{icon} {title}</h3>
              <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, margin:0 }}>{body}</p>
              {list && <ul style={{ paddingLeft:'18px', marginTop:'8px', marginBottom:0 }}>
                {list.map(item => <li key={item} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>{item}</li>)}
              </ul>}
            </div>
          ))}
          <div style={{ padding:'10px 14px', background:'rgba(74,158,255,0.08)',
            borderRadius:'8px', border:'1px solid rgba(74,158,255,0.2)', fontSize:'12px', color:'var(--text2)' }}>
            📌 データソース: 金融庁 EDINET（電子開示システム）
          </div>
        </div>
      )}
    </div>
  )
}
