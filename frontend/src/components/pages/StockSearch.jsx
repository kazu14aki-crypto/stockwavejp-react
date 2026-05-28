import { useState, useEffect, useMemo } from 'react'

const THEME_ARTICLE_MAP = {
  '半導体製造装置':'semiconductor-theme','AI半導体':'semiconductor-theme',
  '生成AI':'ai-cloud-theme','防衛・航空':'defense-theme',
  '防衛・セキュリティ':'defense-theme','宇宙・衛星':'defense-theme',
  'サイバーセキュリティ':'defense-theme','SaaS':'saas-dx-theme',
  'EV・電気自動車':'ev-green-theme','光通信':'optical-communication',
  'インバウンド':'inbound-theme','観光・ホテル・レジャー':'inbound-theme',
  '銀行':'banking-finance-theme','フィジカルAI':'physical-ai-edge-ai',
}

export default function StockSearch({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [stockIndex, setStockIndex] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/data/stock_index.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { setStockIndex(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const results = useMemo(() => {
    const q = searchQ.trim().toLowerCase()
    if (!q) return []
    return Object.values(stockIndex).filter(s =>
      s.name?.toLowerCase().includes(q) || s.ticker?.replace('.T','').includes(q)
    ).slice(0, 20)
  }, [stockIndex, searchQ])

  const pColor = v => v == null ? 'var(--text3)' : v >= 0 ? 'var(--red)' : 'var(--green)'

  if (selected) {
    const s = selected
    const code = s.ticker.replace('.T','')
    const colId = s.themes?.map(t => THEME_ARTICLE_MAP[t]).find(Boolean)
    return (
      <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
        <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', marginBottom:'16px', padding:0 }}>← 検索に戻る</button>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'18px 20px', marginBottom:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px', flexWrap:'wrap' }}>
            <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', margin:0 }}>{s.name}</h1>
            <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)', background:'var(--bg3)', padding:'3px 8px', borderRadius:'4px' }}>{code}</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'10px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'26px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>¥{s.price?.toLocaleString()??'-'}</span>
            <span style={{ fontSize:'15px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(s.pct) }}>{s.pct!=null?`${s.pct>=0?'+':''}${s.pct.toFixed(2)}%`:'-'}</span>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>時価総額: {s.market_cap>=1e12?(s.market_cap/1e12).toFixed(1)+'兆円':s.market_cap>=1e8?(s.market_cap/1e8).toFixed(0)+'億円':'-'}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'14px' }}>
          {s.themes?.map(t => (
            <button key={t} onClick={() => onNavigate?.('テーマ別詳細', t)} style={{ padding:'6px 14px', borderRadius:'20px', cursor:'pointer', background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.25)', color:'var(--accent)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600 }}>{t} →</button>
          ))}
          {colId && <button onClick={() => onNavigate?.('コラム・解説', colId)} style={{ padding:'6px 14px', borderRadius:'20px', cursor:'pointer', background:'rgba(170,119,255,0.08)', border:'1px solid rgba(170,119,255,0.25)', color:'#aa77ff', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600 }}>📖 コラム →</button>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>🔎 銘柄検索</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'18px', lineHeight:1.7 }}>銘柄名または証券コードで検索。テーマ・コラムへのリンクを表示します。</p>
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        <input type="text" placeholder="銘柄名または証券コード（例: トヨタ、7203）" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==='Enter'&&setSearchQ(query)} style={{ flex:1, padding:'12px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'14px', fontFamily:'var(--font)', outline:'none' }}/>
        <button onClick={() => setSearchQ(query)} style={{ padding:'12px 22px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'10px', cursor:'pointer', fontFamily:'var(--font)', fontSize:'14px', fontWeight:700, flexShrink:0 }}>検索</button>
      </div>
      {!searchQ ? (
        <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔎</div>
          <div style={{ fontSize:'13px' }}>{loading?'読み込み中...':`${Object.keys(stockIndex).length}銘柄のデータが利用可能`}</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'6px' }}>「{searchQ}」: {results.length}件</div>
          {results.length===0 ? <div style={{ padding:'24px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>⚠️ 該当なし</div>
          : results.map(s => (
            <div key={s.ticker} onClick={() => setSelected(s)} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'12px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{s.name}</span>
                  <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)', background:'var(--bg3)', padding:'1px 6px', borderRadius:'4px' }}>{s.ticker.replace('.T','')}</span>
                </div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {s.themes?.slice(0,3).map(t => <span key={t} style={{ fontSize:'10px', padding:'2px 7px', background:'rgba(74,158,255,0.08)', color:'var(--accent)', border:'1px solid rgba(74,158,255,0.2)', borderRadius:'10px' }}>{t}</span>)}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', fontFamily:'var(--mono)' }}>¥{s.price?.toLocaleString()??'-'}</div>
                <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(s.pct) }}>{s.pct!=null?`${s.pct>=0?'+':''}${s.pct.toFixed(1)}%`:'-'}</div>
              </div>
              <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
