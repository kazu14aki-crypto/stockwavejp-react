import { useState, useEffect, useCallback, useMemo } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const DATA_PATH = API + '/api/edinet/holdings'

function RatioBar({ ratio }) {
  const r = parseFloat(ratio) || 0
  const color = r >= 10 ? '#ff5370' : r >= 7 ? '#ff8c42' : r >= 5 ? '#4a9eff' : '#8b949e'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ width:'80px', height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', flexShrink:0 }}>
        <div style={{ width:`${Math.min(r*5,100)}%`, height:'100%', background:color, borderRadius:'3px' }}/>
      </div>
      <span style={{ fontSize:'13px', fontWeight:700, color, fontFamily:'var(--mono)', minWidth:'44px' }}>
        {r.toFixed(2)}%
      </span>
    </div>
  )
}

function RatioSparkline({ records }) {
  const vals = records.map(r => parseFloat(r.holdingRatio)||0).filter(v => v > 0)
  if (vals.length < 2) return null
  const W=100, H=30, P=4
  const min=Math.min(...vals), max=Math.max(...vals), range=max-min||1
  const pts = vals.map((v,i) => {
    const x = P + (i/(vals.length-1))*(W-P*2)
    const y = P + (1-(v-min)/range)*(H-P*2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last=vals[vals.length-1], prev=vals[vals.length-2]
  const color = last >= prev ? '#ff5370' : '#00c48c'
  return (
    <svg width={W} height={H} style={{ flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {vals.map((v,i) => {
        const x = P+(i/(vals.length-1))*(W-P*2)
        const y = P+(1-(v-min)/range)*(H-P*2)
        return <circle key={i} cx={x} cy={y} r="2" fill={color}/>
      })}
    </svg>
  )
}

// ── 大株主の属性分類メタ（バックエンドfetch_edinet_holders.pyのcategoryと対応） ──
const CATEGORY_META = {
  individual: { label:'個人',       color:'#ffd700', desc:'創業者・役員・個人投資家' },
  treasury:   { label:'自己株式',   color:'#8b949e', desc:'自社保有分' },
  employee:   { label:'持株会',     color:'#aa77ff', desc:'従業員持株会' },
  trust:      { label:'信託口',     color:'#4a9eff', desc:'国内機関（年金・投信の名義）' },
  foreign:    { label:'外国機関',   color:'#00c48c', desc:'海外機関投資家・カストディ' },
  financial:  { label:'銀行・保険', color:'#5ab0ff', desc:'金融機関の政策保有等' },
  securities: { label:'証券',       color:'#7ac0ff', desc:'証券会社' },
  government: { label:'政府系',     color:'#ff8c42', desc:'公的機関' },
  foundation: { label:'財団等',     color:'#c9a0ff', desc:'財団・学校法人' },
  corporate:  { label:'事業法人',   color:'#ff5370', desc:'取引先・親会社等の政策保有' },
  other:      { label:'その他',     color:'#8b949e', desc:'' },
}

function CategoryBadge({ category, isFounder }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.other
  return (
    <span style={{ display:'inline-flex', gap:'4px', flexShrink:0 }}>
      <span style={{ fontSize:'10px', fontWeight:700, color:meta.color, background:`${meta.color}18`, border:`1px solid ${meta.color}40`, padding:'1px 6px', borderRadius:'4px', whiteSpace:'nowrap' }}>{meta.label}</span>
      {isFounder && <span style={{ fontSize:'10px', fontWeight:700, color:'#ffd700', background:'rgba(255,215,0,0.12)', border:'1px solid rgba(255,215,0,0.35)', padding:'1px 6px', borderRadius:'4px', whiteSpace:'nowrap' }}>創業家?</span>}
    </span>
  )
}

// 属性別構成バー（上位10名の内訳を1本のスタックバーで可視化）
function OwnershipCompositionBar({ summary }) {
  if (!summary?.by_category) return null
  const entries = Object.entries(summary.by_category).sort((a,b) => b[1]-a[1])
  const total = summary.top10_total || entries.reduce((s,[,v])=>s+v,0)
  if (!total) return null
  return (
    <div style={{ marginBottom:'14px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'var(--text3)', marginBottom:'4px' }}>
        <span>上位10名の属性構成</span><span>合計 <strong style={{ color:'var(--text)', fontFamily:'var(--mono)' }}>{total.toFixed(1)}%</strong></span>
      </div>
      <div style={{ display:'flex', height:'10px', borderRadius:'5px', overflow:'hidden', background:'rgba(255,255,255,0.06)' }}>
        {entries.map(([cat,v]) => (
          <div key={cat} title={`${(CATEGORY_META[cat]||CATEGORY_META.other).label} ${v.toFixed(1)}%`}
            style={{ width:`${(v/total)*100}%`, background:(CATEGORY_META[cat]||CATEGORY_META.other).color }}/>
        ))}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'6px' }}>
        {entries.map(([cat,v]) => (
          <span key={cat} style={{ fontSize:'10px', color:'var(--text3)', display:'inline-flex', alignItems:'center', gap:'4px' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'2px', background:(CATEGORY_META[cat]||CATEGORY_META.other).color, display:'inline-block' }}/>
            {(CATEGORY_META[cat]||CATEGORY_META.other).label} {v.toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  )
}

// 大株主詳細モーダル（属性バッジ・前期比増減つき）
function ShareholderModal({ data, onClose }) {
  const latest = data.latest || []
  const prev = (data.history || [])[1]?.shareholders || []
  const prevMap = {}
  prev.forEach(sh => { prevMap[sh.name] = sh.ratio })
  const diagnosis = (() => {
    const s = data.latestSummary?.by_category || {}
    const ind = (s.individual||0), inst = (s.trust||0)+(s.foreign||0)+(s.financial||0)+(s.securities||0)
    if (ind >= 30) return { text:'オーナー系企業：創業者・個人の支配力が強く、経営の安定性が高い一方、少数株主の発言力は限定的です', color:'#ffd700' }
    if (inst >= 30) return { text:'機関投資家主導：流動性が高くガバナンス圧力が働きやすい一方、需給は機関のフローに左右されます', color:'#4a9eff' }
    if ((s.corporate||0) >= 25) return { text:'政策保有・親会社色が強い株主構成：安定株主が多く、TOB・再編の思惑が出やすい構造です', color:'#ff5370' }
    return { text:'分散型の株主構成：特定株主への依存度は低めです', color:'#8b949e' }
  })()
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'var(--bg2)', borderRadius:'12px', padding:'24px', maxWidth:'680px', width:'92%', maxHeight:'84vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', margin:0 }}>{data.issuerName} <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>{data.secCode}</span></h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'18px' }}>✕</button>
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'12px' }}>出典: 有価証券報告書（EDINET）　提出日: {data.latestDate}{prev.length > 0 && '　※増減は前期報告書との比較'}</div>
        <OwnershipCompositionBar summary={data.latestSummary}/>
        <div style={{ padding:'10px 14px', background:`${diagnosis.color}10`, border:`1px solid ${diagnosis.color}30`, borderRadius:'8px', fontSize:'12px', color:'var(--text2)', lineHeight:1.7, marginBottom:'14px' }}>
          💡 {diagnosis.text}
        </div>
        {latest.map((sh,i) => {
          const prevRatio = prevMap[sh.name]
          const diff = (sh.ratio != null && prevRatio != null) ? +(sh.ratio - prevRatio).toFixed(2) : null
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border)', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', flex:1, minWidth:0 }}>
                <span style={{ fontSize:'11px', color:'var(--text3)', width:'20px', flexShrink:0, fontFamily:'var(--mono)' }}>{sh.rank}.</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'13px', color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sh.name}</div>
                  <CategoryBadge category={sh.category} isFounder={sh.is_founder_family}/>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
                {diff != null && diff !== 0 && (
                  <span style={{ fontSize:'11px', fontWeight:700, fontFamily:'var(--mono)', color:diff>0?'#ff5370':'#00c48c' }}>{diff>0?'▲':'▼'}{Math.abs(diff).toFixed(2)}</span>
                )}
                {prevRatio == null && prev.length > 0 && <span style={{ fontSize:'10px', fontWeight:700, color:'#ff8c42' }}>NEW</span>}
                {sh.shares != null && <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>{sh.shares >= 1000000 ? (sh.shares/1000000).toFixed(1)+'百万株' : (sh.shares/1000).toFixed(0)+'千株'}</span>}
                {sh.ratio != null && <span style={{ fontSize:'13px', fontWeight:700, color:'#4a9eff', fontFamily:'var(--mono)', minWidth:'52px', textAlign:'right' }}>{sh.ratio.toFixed(2)}%</span>}
              </div>
            </div>
          )
        })}
        <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'12px', lineHeight:1.7 }}>
          ※「信託口」は年金基金・投資信託等が信託銀行名義で保有する分で、実質的な機関投資家保有です。「創業家?」は姓と社名の一致による推定であり、確実な判定ではありません。
        </div>
      </div>
    </div>
  )
}

function IssuerDetailPage({ issuerName, secCode, docs, allData, onBack }) {
  const holderMap = {}
  docs.forEach(doc => {
    const h = doc.filerName || '不明'
    if (!holderMap[h]) holderMap[h] = []
    holderMap[h].push(doc)
  })
  const holders = Object.entries(holderMap).map(([name, records]) => {
    const sorted = [...records].sort((a,b) => (a.submitDate||'').localeCompare(b.submitDate||''))
    const latest = sorted[sorted.length-1]
    return { name, records:sorted, latest, latestRatio:parseFloat(latest.holdingRatio)||0, changeCount:records.length }
  }).sort((a,b) => b.latestRatio - a.latestRatio)

  const totalInstitutional = holders.reduce((s,h) => s + h.latestRatio, 0)
  const maxRatio = holders[0]?.latestRatio || 0
  const latestDate = docs.reduce((max,d) => (d.submitDate||'') > max ? (d.submitDate||'') : max, '')
  const colors = ['#ff5370','#ff8c42','#4a9eff','#aa77ff','#00c48c','#ffd700']

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', marginBottom:'18px', padding:0 }}>← 銘柄一覧に戻る</button>
      <div style={{ marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', margin:0 }}>{issuerName}</h1>
          {secCode && <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)', background:'var(--bg3)', padding:'3px 8px', borderRadius:'4px' }}>{secCode}</span>}
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'6px' }}>最終更新: {latestDate}　データ期間: 直近60日間のEDINET開示情報</div>
      </div>

      {/* サマリー */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'報告機関投資家数', value:`${holders.length}社`, color:'#4a9eff' },
          { label:'最大単独保有率', value:`${maxRatio.toFixed(2)}%`, color:maxRatio>=10?'#ff5370':'#ff8c42' },
          { label:'大株主合計保有率', value:`${totalInstitutional.toFixed(1)}%`, color:'#aa77ff' },
        ].map(({label,value,color}) => (
          <div key={label} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 16px' }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>{label}</div>
            <div style={{ fontSize:'22px', fontWeight:800, color, fontFamily:'var(--mono)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 機関別詳細 */}
      <div style={{ marginBottom:'16px' }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'12px' }}>🏦 機関投資家別 保有状況・変遷</div>
        {holders.map((h,i) => {
          const color = colors[i % colors.length]
          const trend = h.records.length > 1 ? (h.latestRatio >= (parseFloat(h.records[0].holdingRatio)||0) ? '↑ 増加' : '↓ 減少') : '→ 初回報告'
          const trendColor = trend.startsWith('↑') ? '#ff5370' : trend.startsWith('↓') ? '#00c48c' : 'var(--text3)'
          return (
            <div key={i} style={{ background:'var(--bg2)', border:`1px solid ${color}30`, borderLeft:`3px solid ${color}`, borderRadius:'8px', padding:'14px 16px', marginBottom:'10px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                <div style={{ flex:1, minWidth:'160px' }}>
                  <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>{h.name}</div>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', color:'var(--text3)' }}>報告{h.changeCount}回</span>
                    <span style={{ fontSize:'11px', color:trendColor, fontWeight:600 }}>{trend}</span>
                    <span style={{ fontSize:'10px', padding:'1px 6px', background:'rgba(74,158,255,0.1)', color:'#4a9eff', borderRadius:'3px' }}>{h.latest.docTypeName}</span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <RatioSparkline records={h.records}/>
                  <RatioBar ratio={h.latestRatio}/>
                </div>
              </div>
              {h.changeCount > 1 && (
                <div style={{ marginTop:'10px', paddingTop:'10px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>変更履歴（古い順）</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {h.records.map((rec,ri) => {
                      const r = parseFloat(rec.holdingRatio)||0
                      const prev = ri > 0 ? parseFloat(h.records[ri-1].holdingRatio)||0 : r
                      const diff = r - prev
                      return (
                        <div key={ri} style={{ padding:'4px 10px', background:'var(--bg3)', borderRadius:'6px', fontSize:'11px', fontFamily:'var(--mono)' }}>
                          <span style={{ color:'var(--text3)', marginRight:'6px' }}>{rec.submitDate}</span>
                          <span style={{ color:r>=10?'#ff5370':r>=5?'#4a9eff':'var(--text2)', fontWeight:600 }}>{r.toFixed(2)}%</span>
                          {ri>0 && diff!==0 && <span style={{ marginLeft:'4px', fontSize:'10px', color:diff>0?'#ff5370':'#00c48c' }}>{diff>0?'▲':'▼'}{Math.abs(diff).toFixed(2)}%</span>}
                          <span style={{ marginLeft:'5px', fontSize:'9px', color:'var(--text3)', opacity:0.7 }}>({rec.docTypeName})</span>
                          {rec.docID && <a href={`https://disclosure2.edinet-fsa.go.jp/webd/detail/${rec.docID}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ marginLeft:'6px', color:'#4a9eff', fontSize:'9px', textDecoration:'none' }}>PDF</a>}
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
    </div>
  )
}

export default function InstitutionalHoldings() {
  const [allData, setAllData] = useState([])
  const [query, setQuery] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState('')
  const [tab, setTab] = useState('issuer')
  const [shData, setShData] = useState({})
  const [shQuery, setShQuery] = useState('')
  const [shSearchQ, setShSearchQ] = useState('')
  const [shLoading, setShLoading] = useState(false)
  const [selectedIssuer, setSelectedIssuer] = useState(null)

  useEffect(() => {
    // 大株主データを取得
    fetch('/data/stockholders/index.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => setShData(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setAllData([])
    fetch(`${DATA_PATH}?query=${encodeURIComponent(searchQ)}&t=${Date.now()}`)
      .then(r => { if(!r.ok) throw new Error(); return r.json() })
      .then(d => { setAllData(d.results||[]); setUpdatedAt(d.updated_at||'') })
      .catch(e => console.error('[InstitutionalHoldings] fetch error:', e))
      .finally(() => setLoading(false))
  }, [searchQ])

  const issuerGroups = useMemo(() => {
    const ql = searchQ.trim().toLowerCase()
    const filtered = ql ? allData.filter(doc =>
      (doc.issuerName||'').toLowerCase().includes(ql) ||
      (doc.secCode||'').toLowerCase().includes(ql) ||
      (doc.filerName||'').toLowerCase().includes(ql)
    ) : allData
    const groups = {}
    filtered.forEach(doc => {
      const key = doc.issuerName || doc.secCode || '不明'
      if (!groups[key]) groups[key] = { issuerName:doc.issuerName||key, secCode:doc.secCode, docs:[] }
      groups[key].docs.push(doc)
    })
    return Object.values(groups).sort((a,b) => {
      const aH = new Set(a.docs.map(d=>d.filerName)).size
      const bH = new Set(b.docs.map(d=>d.filerName)).size
      return bH - aH
    })
  }, [allData, searchQ])

  const holderGroups = useMemo(() => {
    const ql = searchQ.trim().toLowerCase()
    const filtered = ql ? allData.filter(doc =>
      (doc.filerName||'').toLowerCase().includes(ql) ||
      (doc.issuerName||'').toLowerCase().includes(ql)
    ) : allData
    const groups = {}
    filtered.forEach(doc => {
      const key = doc.filerName || '不明'
      if (!groups[key]) groups[key] = []
      groups[key].push(doc)
    })
    return Object.entries(groups).map(([name,docs]) => ({ name, docs, issuerCount: new Set(docs.map(d=>d.issuerName)).size })).sort((a,b) => b.issuerCount - a.issuerCount)
  }, [allData, searchQ])

  const doSearch = useCallback(() => setSearchQ(query), [query])

  if (selectedIssuer) return <IssuerDetailPage {...selectedIssuer} allData={allData} onBack={() => setSelectedIssuer(null)}/>

  const tabs = [['issuer','🏢 銘柄で探す（5%超）'],['shareholder','📋 大株主（有報）'],['holder','🏦 機関投資家'],['guide','💡 ガイド']]

  return (
    <div style={{ padding:'24px 20px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>🏦 機関投資家 大量保有情報</h1>
      {updatedAt && <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>📅 データ更新日: {updatedAt}　全{allData.length}件</div>}

      <div style={{ display:'flex', gap:'4px', marginBottom:'18px', borderBottom:'1px solid var(--border)', marginTop:'16px', overflowX:'auto' }}>
        {tabs.map(([k,label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding:'8px 14px', border:'none', cursor:'pointer', background:tab===k?'var(--accent)':'transparent', color:tab===k?'#fff':'var(--text3)', borderRadius:'6px 6px 0 0', fontFamily:'var(--font)', fontSize:'12px', fontWeight:tab===k?700:400, borderBottom:tab===k?'2px solid var(--accent)':'2px solid transparent', whiteSpace:'nowrap' }}>{label}</button>
        ))}
      </div>

      {tab !== 'guide' && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input type="text" placeholder={tab==='issuer'?'銘柄名または証券コードを入力':'機関投資家名を入力'} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} style={{ flex:'1', minWidth:'260px', padding:'10px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', fontFamily:'var(--font)', outline:'none' }}/>
          <button onClick={doSearch} style={{ padding:'10px 20px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, flexShrink:0 }}>🔍 検索</button>
          {searchQ && <button onClick={()=>{setQuery('');setSearchQ('')}} style={{ padding:'10px 14px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px' }}>クリア</button>}
        </div>
      )}

      {tab==='issuer' && (
        loading ? <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>⏳ 読み込み中...</div>
        : allData.length===0 ? <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)', borderRadius:'8px', fontSize:'13px', color:'var(--text2)' }}>📋 データを準備中です。毎日自動更新されます。</div>
        : !searchQ ? <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)', fontSize:'13px', lineHeight:2 }}><div style={{ fontSize:'32px', marginBottom:'10px' }}>🔍</div><div style={{ fontWeight:600, color:'var(--text2)', marginBottom:'6px' }}>銘柄名または証券コードを入力して検索</div><div style={{ fontSize:'11px' }}>例: トヨタ自動車　7203　ソニーグループ</div></div>
        : (
          <>
            <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'12px' }}>「{searchQ}」: {issuerGroups.length}銘柄</div>
            {issuerGroups.length===0 ? <div style={{ padding:'16px', background:'rgba(255,83,112,0.08)', borderRadius:'8px', fontSize:'13px', color:'#ff5370' }}>⚠️ 該当なし</div>
            : issuerGroups.slice(0,50).map((group,i) => {
              const holderCount = new Set(group.docs.map(d=>d.filerName)).size
              const maxRatio = Math.max(...group.docs.map(d=>parseFloat(d.holdingRatio)||0))
              const latestDate = group.docs.reduce((max,d)=>(d.submitDate||'')>max?(d.submitDate||''):max,'')
              return (
                <div key={i} onClick={()=>setSelectedIssuer(group)} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 18px', marginBottom:'8px', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>{group.issuerName}</span>
                        {group.secCode && <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', background:'var(--bg3)', padding:'2px 6px', borderRadius:'3px' }}>{group.secCode}</span>}
                      </div>
                      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', fontSize:'12px', color:'var(--text3)' }}>
                        <span>🏦 {holderCount}社保有</span>
                        <span>📊 最大 <strong style={{ color:'#4a9eff' }}>{maxRatio.toFixed(2)}%</strong></span>
                        <span>📅 {latestDate}</span>
                      </div>
                    </div>
                    <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
                  </div>
                </div>
              )
            })}
          </>
        )
      )}

      {tab==='holder' && (
        loading ? <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>⏳ 読み込み中...</div>
        : allData.length===0 ? <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)', borderRadius:'8px', fontSize:'13px', color:'var(--text2)' }}>📋 データを準備中です。</div>
        : <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {holderGroups.slice(0,30).map((h,i) => (
            <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 18px' }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>{h.name}</div>
              <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'8px' }}>保有銘柄: <strong style={{ color:'var(--text2)' }}>{h.issuerCount}社</strong>　報告件数: <strong style={{ color:'var(--text2)' }}>{h.docs.length}件</strong></div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {[...new Set(h.docs.map(d=>d.issuerName))].filter(Boolean).slice(0,8).map((issuer,ii) => {
                  const latestDoc = h.docs.filter(d=>d.issuerName===issuer).sort((a,b)=>(b.submitDate||'').localeCompare(a.submitDate||''))[0]
                  return <div key={ii} style={{ padding:'4px 10px', background:'var(--bg3)', borderRadius:'6px', fontSize:'11px', color:'var(--text2)' }}>{issuer}{latestDoc?.holdingRatio&&<span style={{ marginLeft:'5px', color:'#4a9eff', fontFamily:'var(--mono)', fontWeight:700 }}>{parseFloat(latestDoc.holdingRatio).toFixed(2)}%</span>}</div>
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='shareholder' && (
        <div>
          <div style={{ marginBottom:'12px' }}>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'10px' }}>
              <input type="text" placeholder="銘柄名または証券コードを入力" value={shQuery}
                onChange={e=>setShQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&setShSearchQ(shQuery)}
                style={{ flex:'1', minWidth:'260px', padding:'10px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', fontFamily:'var(--font)', outline:'none' }}/>
              <button onClick={()=>setShSearchQ(shQuery)} style={{ padding:'10px 20px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, flexShrink:0 }}>🔍 検索</button>
            </div>
            <div style={{ fontSize:'11px', color:'var(--text3)' }}>
              ※ 有価証券報告書に記載の大株主上位10名（5%未満の保有者も含む）。年1〜4回更新。
            </div>
          </div>
          {shData.items ? (
            (() => {
              const q = shSearchQ.trim().toLowerCase()
              const filtered = q ? (shData.items||[]).filter(i =>
                (i.issuerName||'').toLowerCase().includes(q) || (i.secCode||'').includes(q)
              ) : shData.items||[]
              return filtered.length === 0 ? (
                <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>
                  <div style={{ fontSize:'32px', marginBottom:'10px' }}>🔍</div>
                  {shSearchQ ? (
                    <>
                      <div>「{shSearchQ}」はインデックス未収載です</div>
                      {/^\d{4}[A-Z]?$/.test(shSearchQ.trim()) && (
                        <button onClick={async () => {
                          try {
                            const r = await fetch(`/data/stockholders/${shSearchQ.trim()}.json?t=${Date.now()}`)
                            if (!r.ok) throw new Error()
                            const d = await r.json()
                            setShData(prev => ({...prev, selected: d}))
                          } catch { alert('コード' + shSearchQ + 'のデータは未取得です。EDINETバッチの実行をお待ちください。') }
                        }} style={{ marginTop:'12px', padding:'8px 18px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600 }}>コード {shSearchQ} を直接照会</button>
                      )}
                    </>
                  ) : '銘柄名または証券コードを入力して検索してください'}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {filtered.slice(0,30).map((item,i) => (
                    <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px 18px', cursor:'pointer' }}
                      onClick={async () => {
                        const r = await fetch(`/data/stockholders/${item.secCode}.json?t=${Date.now()}`)
                        const d = await r.json()
                        setShData(prev => ({...prev, selected: d}))
                      }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
                    >
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                            <span style={{ fontSize:'15px', fontWeight:700, color:'var(--text)' }}>{item.issuerName}</span>
                            <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', background:'var(--bg3)', padding:'2px 6px', borderRadius:'3px' }}>{item.secCode}</span>
                          </div>
                          <div style={{ fontSize:'12px', color:'var(--text3)' }}>
                            大株主 {item.holderCount}名　最終: {item.latestDate}
                          </div>
                        </div>
                        <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()
          ) : (
            <div style={{ padding:'18px', background:'rgba(74,158,255,0.08)', borderRadius:'8px', fontSize:'13px', color:'var(--text2)' }}>
              📋 有価証券報告書のデータはGitHub Actionsで定期取得されます。初回取得まで表示されません。
            </div>
          )}
          {shData.selected && (
            <ShareholderModal data={shData.selected} onClose={()=>setShData(p=>({...p,selected:null}))}/>
          )}
        </div>
      )}

      {tab==='guide' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {[
            { icon:'📋', title:'大量保有報告書とは', body:'上場株式の5%超を取得した投資家は、金融商品取引法により5営業日以内に金融庁のEDINETへ報告書を提出する義務があります。' },
            { icon:'📈', title:'保有割合の見方', body:'5〜7%：新規注目サイン。7〜10%：強い影響力。10%超：アクティビスト・経営参画の可能性。変更報告書で増加トレンドが続く場合は積み増し中のサインです。' },
            { icon:'⚠️', title:'注意事項', body:'データは最大5営業日の遅延があります。5%未満の保有は開示されません。投資判断はご自身でお決めください。' },
          ].map(({icon,title,body}) => (
            <div key={title} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 20px' }}>
              <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>{icon} {title}</h3>
              <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, margin:0 }}>{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
