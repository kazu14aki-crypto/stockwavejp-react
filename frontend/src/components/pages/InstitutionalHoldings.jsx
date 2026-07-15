import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'

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

// ═══ 保有割合の推移スパークライン（買い増しペースの可視化） ═══
function RatioTrend({ trend, height = 40 }) {
  if (!trend || trend.length < 1) return null
  const W = 200, H = height, PAD = 4
  const ratios = trend.map(t => t.ratio).filter(v => v != null)
  if (!ratios.length) return null
  const max = Math.max(...ratios, 5), min = Math.min(...ratios, 0)
  const range = max - min || 1
  const x = (i) => trend.length === 1 ? W / 2 : PAD + (i / (trend.length - 1)) * (W - PAD * 2)
  const y = (v) => PAD + (1 - (v - min) / range) * (H - PAD * 2)
  const pts = trend.map((t, i) => `${x(i).toFixed(1)},${y(t.ratio).toFixed(1)}`).join(' ')
  const up = ratios[ratios.length - 1] >= ratios[0]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: '200px', height: `${H}px` }}>
      <line x1="0" x2={W} y1={y(5)} y2={y(5)} stroke="#ff8c42" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5"/>
      <polyline points={pts} fill="none" stroke={up ? '#ff5370' : '#00c48c'} strokeWidth="1.6"/>
      {trend.map((t, i) => t.ratio != null && (
        <circle key={i} cx={x(i)} cy={y(t.ratio)} r={t.type === '新規' ? 3 : 2}
          fill={t.type === '新規' ? '#ffd700' : (up ? '#ff5370' : '#00c48c')}/>
      ))}
    </svg>
  )
}

// ═══ 投資家軸ビュー（例: 光通信を検索→保有全銘柄の推移） ═══
function InvestorView({ query, onNavigate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [suggest, setSuggest] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetch(`/data/large_holdings/index.json?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setSuggest(d?.investors?.slice(0, 40) || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!query) { setData(null); return }
    setLoading(true)
    fetch(`${API}/api/large-holdings/investor/${encodeURIComponent(query)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d)).catch(() => setData(null)).finally(() => setLoading(false))
  }, [query])

  const sortedPositions = useMemo(() => {
    const positions = [...(data?.positions || [])]
    return positions.sort((a, b) => {
      const av = Number(a.latestRatio) || 0
      const bv = Number(b.latestRatio) || 0
      return sortOrder === 'asc' ? av - bv : bv - av
    })
  }, [data, sortOrder])

  if (!query) {
    return (
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.9, marginBottom: '16px' }}>
          特定の機関投資家名（例: <b>光通信</b>）を検索すると、その投資家が5%超保有する全銘柄と、各銘柄での保有割合の推移（買い増しペース）を確認できます。買い増しを続けている銘柄は、純投資を超えた出口イベント（TOB・完全子会社化）を待つポジションの可能性があります。
        </div>
        {suggest.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px' }}>保有銘柄数の多い投資家（クリックで検索）</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {suggest.map(inv => (
                <span key={inv.key} className="inv-chip" data-inv={inv.key}
                  style={{ fontSize: '11.5px', padding: '4px 11px', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', background: 'var(--bg2)' }}>
                  {inv.key} <b style={{ color: 'var(--accent)' }}>{inv.positions}</b>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (loading) return <div style={{ color: 'var(--text3)', padding: '20px' }}>読み込み中…</div>
  if (!data || data.notFound || !data.positions?.length) {
    return <div style={{ color: 'var(--text3)', padding: '20px' }}>「{query}」の大量保有報告書データが見つかりません。名称の一部（例: 光通信）でお試しください。データはバッチ巡回後に追加されます。</div>
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text)' }}>
          <b>{data.investor}</b> が5%超保有する <b style={{ color: 'var(--accent)' }}>{data.positionCount}</b> 銘柄
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: 'var(--text3)' }}>
          保有率順
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
            style={{ padding: '6px 9px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '11px', cursor: 'pointer' }}>
            <option value="desc">高い順（降順）</option>
            <option value="asc">低い順（昇順）</option>
          </select>
        </label>
      </div>
      {sortedPositions.map(pos => {
        const delta = (pos.latestRatio != null && pos.firstRatio != null) ? +(pos.latestRatio - pos.firstRatio).toFixed(2) : null
        return (
          <div key={pos.secCode} onClick={() => pos.secCode && onNavigate?.('銘柄詳細', pos.secCode)} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', cursor: pos.secCode ? 'pointer' : 'default' }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)' }}>{pos.secCode}</span> {pos.issuerName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                初回 {pos.firstRatio}%（{pos.firstDate}）→ 最新 <b style={{ color: 'var(--text)' }}>{pos.latestRatio}%</b>
                {delta != null && <span style={{ color: delta > 0 ? '#ff5370' : '#00c48c', fontWeight: 700, marginLeft: '6px' }}>{delta > 0 ? '▲+' : '▼'}{Math.abs(delta)}pt</span>}
                　報告{pos.reportCount}回
              </div>
            </div>
            <RatioTrend trend={pos.trend}/>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--mono)', color: (pos.latestRatio || 0) >= 20 ? '#ffd700' : 'var(--accent)', minWidth: '64px', textAlign: 'right' }}>
              {pos.latestRatio}%
            </div>
          </div>
        )
      })}
      <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '12px', lineHeight: 1.7 }}>
        ★=新規報告　線の傾き＝買い増し(赤)/売却(緑)。20%超は黄色表示。保有割合の継続的な上昇は、出口イベントを待つ蓄積ポジションのサインになり得ます。
      </div>
    </div>
  )
}

// ═══ TOBレーダー（大量保有×資本構成×低PBRの複合発掘） ═══
function TobRadar({ isSubscribed, onNavigate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let uid = null
    import('../../lib/supabase').then(({ supabase }) =>
      supabase.auth.getSession().then(s => { uid = s?.data?.session?.user?.id || null })
    ).catch(() => {}).finally(() => {
      fetch(`${API}/api/tob-radar${''}`).then(r => r.ok ? r.json() : null)
        .then(d => setData(d)).catch(() => setData(null)).finally(() => setLoading(false))
    })
  }, [])
  if (loading) return <div style={{ color: 'var(--text3)', padding: '20px' }}>スキャン中…</div>
  if (!data || !data.candidates?.length) {
    return <div style={{ color: 'var(--text3)', padding: '20px' }}>現在の取得範囲ではスコア条件を満たす候補がありません。大量保有データの初回バックフィル完了後に候補数が増えます。</div>
  }
  return (
    <div>
      <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.9, marginBottom: '16px' }}>
        「配当をもらいながらTOBを待てる」候補を、①大量保有者の厚みと積み増し ②筆頭株主の固定度（親会社・創業家の高比率＝資本再編が読みやすい）③低PBR（上場維持メリットが薄い）の3軸で複合スコア化しています。
      </div>
      {data.candidates.map((c, i) => (
        <div key={c.secCode} onClick={() => onNavigate?.('銘柄詳細', c.secCode)}
          style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', background: 'var(--bg2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)' }}>#{i + 1}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)' }}>{c.secCode}</span> {c.issuerName}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--mono)', color: c.score >= 70 ? '#ffd700' : c.score >= 55 ? '#ff8c42' : 'var(--text2)' }}>
              {c.score}<span style={{ fontSize: '10px', color: 'var(--text3)' }}> /100</span>
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text2)', lineHeight: 1.8 }}>
            大量保有: <b>{c.topHolder}</b> {c.topRatio}%{c.accumulating && <span style={{ color: '#ff5370' }}> ▲積み増し中</span>}（報告{c.reportCount}回）
            ／ 支配的安定株主 <b>{c.stableOwnerPct}%</b>
            {c.pbr != null ? <> ／ PBR <b>{c.pbr}</b></> : <> ／ PBR <span style={{ color: '#ffd700' }}>🔒</span></>}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            {[['保有', c.factors.holder], ['積増', c.factors.accum], ['資本', c.factors.capital], ['割安', c.factors.value]].map(([l, v]) => (
              <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: '4px', background: 'var(--bg3)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${v ?? 0}%`, height: '100%', background: v == null ? '#8b949e' : '#4a9eff' }}/>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text3)', marginTop: '2px' }}>{l}{v == null ? '🔒' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ fontSize: '10.5px', color: 'var(--text3)', marginTop: '12px', lineHeight: 1.7 }}>
        ※ 統計的な構造の類似性を示すもので、TOBを予測・保証するものではありません。クリックで銘柄詳細へ。{!isSubscribed && 'PBR等はサブスク加入で表示されます。'}
      </div>
    </div>
  )
}

export default function InstitutionalHoldings({ onNavigate, isMobile } = {}) {
  const { isStandard } = useSubscription()
  const [allData, setAllData] = useState([])
  const [query, setQuery] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState('')
  const [tab, setTab] = useState('issuer')
  const [selectedIssuer, setSelectedIssuer] = useState(null)


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

  const tabs = [['investor','🎯 投資家で探す'],['tobradar','📡 TOBレーダー'],['issuer','🏢 銘柄で探す（5%超）'],['guide','💡 ガイド']]

  return (
    <div style={{ padding:'24px 20px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>🏦 機関投資家 大量保有情報</h1>
      {updatedAt && <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>📅 データ更新日: {updatedAt}　全{allData.length}件</div>}

      <div style={{ display:'flex', gap:'4px', marginBottom:'18px', borderBottom:'1px solid var(--border)', marginTop:'16px', overflowX:'auto' }}>
        {tabs.map(([k,label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding:'8px 14px', border:'none', cursor:'pointer', background:tab===k?'var(--accent)':'transparent', color:tab===k?'#fff':'var(--text3)', borderRadius:'6px 6px 0 0', fontFamily:'var(--font)', fontSize:'12px', fontWeight:tab===k?700:400, borderBottom:tab===k?'2px solid var(--accent)':'2px solid transparent', whiteSpace:'nowrap' }}>{label}</button>
        ))}
      </div>

      {(tab === 'issuer' || tab === 'investor') && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input type="text" placeholder={tab==='investor'?'機関投資家名を入力（例: 光通信）':tab==='issuer'?'銘柄名または証券コードを入力':'機関投資家名を入力'} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} style={{ flex:'1', minWidth:'260px', padding:'10px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', fontFamily:'var(--font)', outline:'none' }}/>
          <button onClick={doSearch} style={{ padding:'10px 20px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600, flexShrink:0 }}>🔍 検索</button>
          {searchQ && <button onClick={()=>{setQuery('');setSearchQ('')}} style={{ padding:'10px 14px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px' }}>クリア</button>}
        </div>
      )}

      {tab==='investor' && (
        <>
          <div onClick={(e) => { const chip = e.target.closest('.inv-chip'); if (chip) { const v = chip.getAttribute('data-inv'); setQuery(v); setSearchQ(v) } }}>
            <InvestorView query={searchQ} onNavigate={onNavigate}/>
          </div>
        </>
      )}

      {tab==='tobradar' && (
        <TobRadar isSubscribed={isStandard} onNavigate={onNavigate}/>
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
