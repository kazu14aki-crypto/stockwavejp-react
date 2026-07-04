import { useState, useEffect, useMemo } from 'react'
import AddToThemeModal from '../AddToThemeModal'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const THEME_ARTICLE_MAP = {
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

// ④ コラムIDの表示ラベル
const COL_LABELS = {
  'semiconductor-theme':    '半導体製造装置・AIチップ コラム',
  'power-semiconductor':    'パワー半導体 コラム',
  'ai-cloud-theme':         '生成AI・クラウド コラム',
  'physical-ai-edge-ai':    'フィジカルAI・エッジAI コラム',
  'defense-theme':          '防衛・宇宙・サイバー コラム',
  'inbound-theme':          'インバウンド消費 コラム',
  'banking-finance-theme':  '銀行・金融 コラム',
  'saas-dx-theme':          'SaaS・DX コラム',
  'ev-green-theme':         'EV・グリーン コラム',
  'optical-communication':  '光通信 コラム',
  'mlcc-murata-analysis':   '村田製作所・MLCC コラム',
  'optical-theme':          '光通信 コラム',
  'murata-seisakusho-analysis': '村田製作所 コラム',
}

function guessETF(ticker, themes = []) {
  const code = parseInt(ticker)
  const etfs = []
  if (code) etfs.push('1306（TOPIX連動ETF）')
  const n225 = [7203,6758,8306,6861,8035,9983,4063,9433,7974,6367,6501,8316,8058]
  if (n225.includes(code)) etfs.push('1321（日経225連動ETF）')
  if (themes.some(t => ['AI半導体','半導体製造装置','MLCC・電子部品'].includes(t))) etfs.push('2644（グローバルX半導体）')
  if (themes.some(t => ['防衛・航空','防衛・セキュリティ'].includes(t))) etfs.push('2648（グローバルX防衛）')
  if (themes.some(t => ['EV・電気自動車'].includes(t))) etfs.push('2636（グローバルXEV）')
  return etfs
}

function StockChart({ ticker, period }) {
  const [data, setData] = useState([])
  const [volData, setVolData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    fetch(`${API}/api/stock-history/${encodeURIComponent(ticker)}?period=${period}`)
      .then(r => r.json())
      .then(d => {
        const rows = d.data || []
        setData(rows.filter(r => r.close).map(r => ({ date: r.date, close: r.close })))
        setVolData(rows.filter(r => r.volume).map(r => ({ date: r.date, volume: r.volume, tv: r.trade_value })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [ticker, period])

  if (loading) return <div style={{ padding:'24px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>データ取得中...</div>
  if (!data.length) return <div style={{ padding:'24px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>チャートデータなし（Infoway接続後に表示）</div>

  const W=600, H=140, PL=52, PR=16, PT=12, PB=24
  const GW=W-PL-PR, GH=H-PT-PB
  const closes = data.map(r => r.close)
  const minC=Math.min(...closes), maxC=Math.max(...closes), rangeC=maxC-minC||1
  const xPos = i => PL + (i / Math.max(data.length-1,1)) * GW
  const yC = v => PT + (1-(v-minC)/rangeC)*GH
  const pts = data.map((r,i) => `${xPos(i).toFixed(1)},${yC(r.close).toFixed(1)}`).join(' ')
  const isUp = closes[closes.length-1] >= closes[0]
  const lc = isUp ? 'var(--red)' : 'var(--green)'
  const ticks = [minC, (minC+maxC)/2, maxC]
  const labelIdx = [0, Math.floor(data.length/2), data.length-1]
  const maxVol = Math.max(...volData.map(r=>r.volume||0), 1)
  const VH=40

  return (
    <div style={{ overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'280px' }}>
        {ticks.map((v,i) => (
          <g key={i}>
            <line x1={PL} y1={yC(v)} x2={W-PR} y2={yC(v)} stroke="rgba(120,140,180,0.1)" strokeWidth="1"/>
            <text x={PL-4} y={yC(v)+4} textAnchor="end" fontSize="9" fill="var(--text3)" fontFamily="var(--mono)">
              {v>=10000?(v/1000).toFixed(0)+'K':v.toFixed(0)}
            </text>
          </g>
        ))}
        <polyline points={pts} fill="none" stroke={lc} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
        {labelIdx.filter(i=>i<data.length).map(i => (
          <text key={i} x={xPos(i)} y={H-4} textAnchor="middle" fontSize="9" fill="var(--text3)" fontFamily="var(--mono)">
            {data[i].date?.slice(5)}
          </text>
        ))}
      </svg>
      {volData.length > 0 && (
        <>
          <div style={{ fontSize:'10px', color:'var(--text3)', margin:'4px 0 2px' }}>出来高</div>
          <svg viewBox={`0 0 ${W} ${VH}`} width="100%" style={{ display:'block', minWidth:'280px' }}>
            {volData.map((r,i) => {
              const bh = Math.max(1,(r.volume/maxVol)*(VH-8))
              const bw = Math.max(1,GW/volData.length-1)
              const bx = PL+(i/Math.max(volData.length-1,1))*GW-bw/2
              return <rect key={i} x={bx} y={VH-bh} width={bw} height={bh} fill="rgba(74,158,255,0.4)" rx="1"/>
            })}
          </svg>
        </>
      )}
    </div>
  )
}

export default function StockSearch({ onNavigate }) {
  const [query,      setQuery]      = useState('')
  const [searchQ,    setSearchQ]    = useState('')
  const [stockIndex, setStockIndex] = useState({})
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState(null)
  const [period,     setPeriod]     = useState('1mo')
  const [modalStock, setModalStock] = useState(null)

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
  const fmt = v => v==null?'-': v>=1e12?(v/1e12).toFixed(1)+'兆円': v>=1e8?(v/1e8).toFixed(0)+'億円': v.toLocaleString()

  const PERIODS = [
    {v:'1d',l:'1日'},{v:'5d',l:'1週'},{v:'1mo',l:'1ヶ月'},
    {v:'3mo',l:'3ヶ月'},{v:'6mo',l:'6ヶ月'},{v:'1y',l:'1年'},
  ]

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
      {/* ② AddToThemeModal */}
      {modalStock && (
        <AddToThemeModal stock={modalStock} onClose={() => setModalStock(null)} />
      )}

      {selected ? (
        <button onClick={() => { setSelected(null); setPeriod('1mo') }}
          style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'13px', marginBottom:'16px', padding:0 }}>
          ← 検索に戻る
        </button>
      ) : (
        <>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>🔎 銘柄検索</h1>
        </>
      )}

      {/* 検索バー */}
      {!selected && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
          <input type="text" placeholder="銘柄名または証券コード（例: トヨタ、7203）"
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key==='Enter' && setSearchQ(query)} autoFocus
            style={{ flex:1, padding:'12px 14px', background:'var(--bg2)',
              border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)',
              fontSize:'14px', fontFamily:'var(--font)', outline:'none' }}/>
          <button onClick={() => setSearchQ(query)} style={{
            padding:'12px 22px', background:'var(--accent)', color:'#fff',
            border:'none', borderRadius:'10px', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'14px', fontWeight:700, flexShrink:0 }}>
            検索
          </button>
        </div>
      )}

      {/* 検索前 */}
      {!selected && !searchQ && (
        <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔎</div>
          <div style={{ fontSize:'13px' }}>
            {loading ? '読み込み中...' : `${Object.keys(stockIndex).length}銘柄のデータが利用可能`}
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {!selected && searchQ && (
        <>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'10px' }}>
            「{searchQ}」: {results.length}件
          </div>
          {results.length === 0 ? (
            <div style={{ padding:'24px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>
              ⚠️ 「{searchQ}」に該当する銘柄が見つかりませんでした
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {results.map(s => <div key={s.ticker}>
                <div onClick={() => setSelected(s)}
                  style={{ background:'var(--bg2)', border:'1px solid var(--border)',
                    borderRadius:'10px', padding:'12px 16px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{s.name}</span>
                      <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)',
                        background:'var(--bg3)', padding:'1px 6px', borderRadius:'4px' }}>
                        {s.ticker.replace('.T','')}
                      </span>
                    </div>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {s.themes?.slice(0,3).map(t => (
                        <span key={t} style={{ fontSize:'10px', padding:'2px 7px',
                          background:'rgba(74,158,255,0.08)', color:'var(--accent)',
                          border:'1px solid rgba(74,158,255,0.2)', borderRadius:'10px' }}>{t}</span>
                      ))}
                      {s.themes?.length > 3 && <span style={{ fontSize:'10px', color:'var(--text3)' }}>+{s.themes.length-3}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', fontFamily:'var(--mono)' }}>
                      ¥{s.price?.toLocaleString() ?? '-'}
                    </div>
                    <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(s.pct) }}>
                      {s.pct!=null ? `${s.pct>=0?'+':''}${s.pct.toFixed(1)}%` : '-'}
                    </div>
                  </div>
                  <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
                </div>
                {/* コラムボタン（一覧） */}
                {(() => {
                  const cids = [...new Set((s.themes||[]).map(t=>THEME_ARTICLE_MAP[t]).filter(Boolean))]
                  return cids.length > 0 ? (
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'6px', paddingLeft:'4px' }}>
                      {cids.map(cid => (
                        <button key={cid}
                          onClick={e => { e.stopPropagation(); onNavigate?.('コラム・解説', cid) }}
                          style={{ fontSize:'10px', padding:'2px 8px',
                            background:'rgba(170,119,255,0.08)', color:'#aa77ff',
                            border:'1px solid rgba(170,119,255,0.2)', borderRadius:'10px',
                            cursor:'pointer', fontFamily:'var(--font)' }}>
                          📖 {COL_LABELS[cid] || 'コラムを読む'}
                        </button>
                      ))}
                    </div>
                  ) : null
                })()}
              </div>)}
            </div>
          )}
        </>
      )}

      {/* 銘柄詳細 */}
      {selected && (() => {
        const s = selected
        const code = s.ticker.replace('.T','')
        // ④ 重複除去して全コラムIDを取得
        const colIds = [...new Set(
          (s.themes || []).map(t => THEME_ARTICLE_MAP[t]).filter(Boolean)
        )]
        const etfs = guessETF(s.ticker, s.themes)
        return (
          <div>
            {/* ヘッダー */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'18px 20px', marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px', flexWrap:'wrap' }}>
                    <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', margin:0 }}>{s.name}</h1>
                    <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)',
                      background:'var(--bg3)', padding:'3px 8px', borderRadius:'4px' }}>{code}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'10px', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'26px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>
                      ¥{s.price?.toLocaleString() ?? '-'}
                    </span>
                    <span style={{ fontSize:'15px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(s.pct) }}>
                      {s.pct!=null ? `${s.pct>=0?'+':''}${s.pct.toFixed(2)}%` : '-'}
                    </span>
                    <span style={{ fontSize:'12px', color:'var(--text3)' }}>
                      時価総額: <strong style={{ color:'var(--text2)' }}>{fmt(s.market_cap)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ⑥ アクションボタン */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'14px' }}>
              <button onClick={() => setModalStock({ ticker:s.ticker, name:s.name, price:s.price, pct:s.pct })}
                style={{ padding:'10px 18px', border:'1px solid rgba(74,158,255,0.3)', borderRadius:'8px',
                  cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
                  background:'rgba(74,158,255,0.1)', color:'var(--accent)' }}>
                ＋ カスタムテーマに追加
              </button>
              {colIds.map(cid => (
                <button key={cid} onClick={() => onNavigate?.('コラム・解説', cid)}
                  style={{ padding:'10px 18px', border:'1px solid rgba(170,119,255,0.3)', borderRadius:'8px',
                    cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
                    background:'rgba(170,119,255,0.08)', color:'#aa77ff' }}>
                  📖 {COL_LABELS[cid] || 'コラムを読む'}
                </button>
              ))}
            </div>

            {/* 期間選択 */}
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
              {PERIODS.map(p => (
                <button key={p.v} onClick={() => setPeriod(p.v)} style={{
                  padding:'5px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer',
                  fontFamily:'var(--font)', fontWeight:period===p.v?700:400,
                  border:period===p.v?'1px solid var(--accent)':'1px solid var(--border)',
                  background:period===p.v?'rgba(74,158,255,0.12)':'transparent',
                  color:period===p.v?'var(--accent)':'var(--text3)',
                }}>{p.l}</button>
              ))}
            </div>

            {/* チャート */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📈 株価・出来高推移
              </div>
              <StockChart ticker={s.ticker} period={period} />
            </div>

            {/* 所属テーマ */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📊 所属テーマ
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {s.themes?.map(t => (
                  <button key={t} onClick={() => onNavigate?.('テーマ別詳細', t)}
                    style={{ padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
                      background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.25)',
                      color:'var(--accent)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600 }}>
                    {t} →
                  </button>
                ))}
              </div>
            </div>

            {/* ETF */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📦 組み込まれている主なETF
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {etfs.map((e,i) => (
                  <span key={i} style={{ padding:'4px 12px', background:'var(--bg3)',
                    border:'1px solid var(--border)', borderRadius:'6px', fontSize:'12px', color:'var(--text2)' }}>
                    {e}
                  </span>
                ))}
              </div>
              <p style={{ fontSize:'10px', color:'var(--text3)', marginTop:'8px' }}>
                ※ 推定値。正確な構成銘柄は各ETFの公式情報をご確認ください
              </p>
            </div>

            {/* 同テーマ関連銘柄 */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                🔗 同テーマの主要銘柄
              </div>
              {s.themes?.slice(0,2).map(theme => {
                const sameTheme = Object.values(stockIndex)
                  .filter(st => st.themes?.includes(theme) && st.ticker !== s.ticker)
                  .sort((a,b) => (b.market_cap||0)-(a.market_cap||0))
                  .slice(0,5)
                if (!sameTheme.length) return null
                return (
                  <div key={theme} style={{ marginBottom:'12px' }}>
                    <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:600, marginBottom:'6px' }}>{theme}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {sameTheme.map(st => (
                        <button key={st.ticker} onClick={() => { setSelected(st); setPeriod('1mo') }}
                          style={{ padding:'4px 12px', background:'var(--bg3)',
                            border:'1px solid var(--border)', borderRadius:'6px',
                            fontFamily:'var(--font)', fontSize:'12px', cursor:'pointer', color:'var(--text2)' }}>
                          {st.name}
                          {st.pct!=null && (
                            <span style={{ marginLeft:'5px', fontFamily:'var(--mono)', fontWeight:700,
                              color:pColor(st.pct), fontSize:'11px' }}>
                              {st.pct>=0?'+':''}{st.pct.toFixed(1)}%
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
