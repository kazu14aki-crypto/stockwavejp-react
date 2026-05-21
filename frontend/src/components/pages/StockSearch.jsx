import { useState, useEffect, useMemo } from 'react'

// ── 銘柄検索ページ ───────────────────────────────────────────────

// テーマ→コラムIDマップ
const THEME_COL_MAP = {
  '半導体製造装置':'semiconductor-theme','半導体検査装置':'semiconductor-theme',
  '半導体材料':'semiconductor-theme','メモリ':'semiconductor-theme',
  'パワー半導体':'power-semiconductor','次世代半導体':'semiconductor-theme',
  '生成AI':'ai-cloud-theme','AIデータセンター':'ai-cloud-theme',
  'フィジカルAI':'physical-ai-edge-ai','AI半導体':'semiconductor-theme',
  'エッジAI':'physical-ai-edge-ai','防衛・セキュリティ':'defense-theme',
  '宇宙・衛星':'defense-theme','サイバーセキュリティ':'defense-theme',
  'インバウンド':'inbound-theme','観光・ホテル・レジャー':'inbound-theme',
  '銀行':'banking-fintech-theme','SaaS':'saas-dx-theme',
  'EV・電気自動車':'ev-green-theme','光通信':'optical-theme',
}

// 主なETF・インデックス構成銘柄マップ（証券コードから簡易推定）
function guessETF(ticker, themes) {
  const code = parseInt(ticker)
  const etfs = []
  // TOPIX系：ほぼ全上場銘柄
  if (code) etfs.push('1306（TOPIX連動）')
  // 日経225
  const nikkei225 = [7203,6758,8306,6861,8035,9983,4063,9433,7974,6367,6501,8316,8058,4519,4502,9432,7751,6594,6902,3382,6954,8411,7267,4543,5108,9022,9005,4901,8001,6645]
  if (nikkei225.includes(code)) etfs.push('1321（日経225連動）')
  // テーマETF
  if (themes.includes('AI半導体') || themes.includes('半導体製造装置')) etfs.push('2644（グローバルX 半導体）')
  if (themes.includes('防衛・セキュリティ')) etfs.push('2648（グローバルX 防衛）')
  if (themes.includes('EV・電気自動車')) etfs.push('2636（グローバルX EV）')
  return etfs.length > 0 ? etfs : ['TOPIX連動ETF（1306）']
}

// スパークライン
function MiniSparkline({ data, color }) {
  if (!data || data.length < 3) return <span style={{ color:'var(--text3)', fontSize:'10px' }}>-</span>
  const W = 80, H = 28, P = 2
  const valid = data.filter(v => typeof v === 'number' && isFinite(v))
  if (valid.length < 2) return null
  const min = Math.min(...valid), max = Math.max(...valid)
  const range = max - min || 1
  const n = valid.length
  const pts = valid.map((v, i) => {
    const x = P + (i / (n - 1)) * (W - P * 2)
    const y = P + (1 - (v - min) / range) * (H - P * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg width={W} height={H}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function StockSearch({ onNavigate }) {
  const [query,       setQuery]       = useState('')
  const [searchQ,     setSearchQ]     = useState('')
  const [stockIndex,  setStockIndex]  = useState({})
  const [loading,     setLoading]     = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [addedMsg,    setAddedMsg]    = useState('')

  useEffect(() => {
    fetch('/data/stock_index.json?t=' + Date.now())
      .then(r => r.json())
      .then(d => { setStockIndex(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // 検索結果
  const results = useMemo(() => {
    const q = searchQ.trim().toLowerCase()
    if (!q) return []
    return Object.values(stockIndex).filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.ticker?.toLowerCase().includes(q) ||
      s.ticker?.replace('.T','').includes(q)
    ).slice(0, 15)
  }, [stockIndex, searchQ])

  const doSearch = () => setSearchQ(query)

  const fmt = (v, decimals = 0) => {
    if (v == null || isNaN(v)) return '-'
    if (v >= 1e12) return (v / 1e12).toFixed(1) + '兆円'
    if (v >= 1e8)  return (v / 1e8).toFixed(1) + '億円'
    return v.toLocaleString()
  }

  const pColor = (v) => v == null ? 'var(--text3)' : v >= 0 ? 'var(--red)' : 'var(--green)'

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
      {/* ヘッダー */}
      {selected ? (
        <button onClick={() => setSelected(null)} style={{
          background:'none', border:'none', color:'var(--text3)',
          cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px',
          marginBottom:'16px', padding:0, display:'flex', alignItems:'center', gap:'6px',
        }}>← 検索に戻る</button>
      ) : (
        <>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>
            🔎 銘柄検索
          </h1>
          <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'18px', lineHeight:1.7 }}>
            銘柄名または証券コードを入力して検索。株価・テーマ・コラムへのリンクを表示します。
          </p>
        </>
      )}

      {/* 検索バー */}
      {!selected && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
          <input
            type="text"
            placeholder="銘柄名または証券コード（例: トヨタ、7203）"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            autoFocus
            style={{
              flex:1, padding:'12px 14px',
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', color:'var(--text)', fontSize:'14px',
              fontFamily:'var(--font)', outline:'none',
            }}
          />
          <button onClick={doSearch} style={{
            padding:'12px 22px', background:'var(--accent)', color:'#fff',
            border:'none', borderRadius:'10px', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'14px', fontWeight:700, flexShrink:0,
          }}>検索</button>
        </div>
      )}

      {/* 検索前の状態 */}
      {!selected && !searchQ && !loading && (
        <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔎</div>
          <div style={{ fontSize:'13px' }}>銘柄名や証券コードで検索</div>
          <div style={{ fontSize:'11px', marginTop:'6px' }}>
            {Object.keys(stockIndex).length}銘柄のデータが利用可能
          </div>
        </div>
      )}

      {/* 検索結果一覧 */}
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
              {results.map(s => {
                const pct = s.pct
                const code = s.ticker.replace('.T','')
                return (
                  <div key={s.ticker}
                    onClick={() => setSelected(s)}
                    style={{
                      background:'var(--bg2)', border:'1px solid var(--border)',
                      borderRadius:'10px', padding:'12px 16px',
                      cursor:'pointer', display:'flex', alignItems:'center', gap:'12px',
                      transition:'border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                  >
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{s.name}</span>
                        <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)',
                          background:'var(--bg3)', padding:'1px 6px', borderRadius:'4px' }}>
                          {code}
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                        {s.themes.slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize:'10px', padding:'2px 7px',
                            background:'rgba(74,158,255,0.08)', color:'var(--accent)',
                            border:'1px solid rgba(74,158,255,0.2)', borderRadius:'10px' }}>
                            {t}
                          </span>
                        ))}
                        {s.themes.length > 3 && (
                          <span style={{ fontSize:'10px', color:'var(--text3)' }}>+{s.themes.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', fontFamily:'var(--mono)' }}>
                        ¥{s.price?.toLocaleString() ?? '-'}
                      </div>
                      <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(pct) }}>
                        {pct != null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%` : '-'}
                      </div>
                    </div>
                    <MiniSparkline data={s.spark} color={pct >= 0 ? 'var(--red)' : 'var(--green)'} />
                    <span style={{ color:'var(--text3)', fontSize:'16px' }}>›</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* 銘柄詳細ページ */}
      {selected && (() => {
        const s = selected
        const code = s.ticker.replace('.T', '')
        const pct = s.pct
        const etfs = guessETF(s.ticker, s.themes)
        const colId = s.themes.map(t => THEME_COL_MAP[t]).filter(Boolean)[0] || null

        return (
          <div>
            {/* 銘柄ヘッダー */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'18px 20px', marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                    <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', margin:0 }}>{s.name}</h1>
                    <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)',
                      background:'var(--bg3)', padding:'3px 8px', borderRadius:'4px' }}>{code}</span>
                  </div>
                  <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
                    <div>
                      <span style={{ fontSize:'28px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>
                        ¥{s.price?.toLocaleString() ?? '-'}
                      </span>
                      <span style={{ fontSize:'15px', fontWeight:700, fontFamily:'var(--mono)',
                        color:pColor(pct), marginLeft:'10px' }}>
                        {pct != null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%` : '-'}
                      </span>
                    </div>
                    <div style={{ fontSize:'12px', color:'var(--text3)' }}>
                      時価総額: <strong style={{ color:'var(--text2)' }}>{fmt(s.market_cap)}</strong>
                    </div>
                  </div>
                </div>
                <div style={{ width:'140px', flexShrink:0 }}>
                  <MiniSparkline data={s.spark} color={pct >= 0 ? 'var(--red)' : 'var(--green)'} />
                  <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'3px', textAlign:'center' }}>
                    直近推移（1ヶ月）
                  </div>
                </div>
              </div>
            </div>

            {/* 所属テーマ */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📊 所属テーマ
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {s.themes.map(t => (
                  <button key={t}
                    onClick={() => onNavigate?.('テーマ別詳細', t)}
                    style={{
                      padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
                      background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.25)',
                      color:'var(--accent)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
                    }}>
                    {t} → 詳細を見る
                  </button>
                ))}
              </div>
            </div>

            {/* アクション */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'14px' }}>
              <button
                onClick={() => {
                  // カスタムテーマへの追加（onNavigateでカスタムテーマページに遷移）
                  onNavigate?.('カスタムテーマ')
                  setAddedMsg(`${s.name}（${code}）をカスタムテーマページで追加できます`)
                  setTimeout(() => setAddedMsg(''), 4000)
                }}
                style={{
                  padding:'10px 18px', background:'rgba(74,158,255,0.12)',
                  border:'1px solid rgba(74,158,255,0.3)', borderRadius:'8px',
                  color:'var(--accent)', fontFamily:'var(--font)', fontSize:'13px',
                  fontWeight:600, cursor:'pointer',
                }}>
                ＋ カスタムテーマに追加
              </button>

              {colId && (
                <button
                  onClick={() => onNavigate?.('コラム・解説', colId)}
                  style={{
                    padding:'10px 18px', background:'rgba(170,119,255,0.1)',
                    border:'1px solid rgba(170,119,255,0.3)', borderRadius:'8px',
                    color:'#aa77ff', fontFamily:'var(--font)', fontSize:'13px',
                    fontWeight:600, cursor:'pointer',
                  }}>
                  📖 関連コラムを読む
                </button>
              )}

              <a href={`https://finance.yahoo.co.jp/quote/${code}.T`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding:'10px 18px', background:'var(--bg3)',
                  border:'1px solid var(--border)', borderRadius:'8px',
                  color:'var(--text2)', fontFamily:'var(--font)', fontSize:'13px',
                  textDecoration:'none', fontWeight:600,
                }}>
                🔗 詳細チャートを見る
              </a>
            </div>

            {addedMsg && (
              <div style={{ padding:'10px 14px', background:'rgba(74,158,255,0.1)',
                border:'1px solid rgba(74,158,255,0.3)', borderRadius:'8px',
                fontSize:'12px', color:'var(--accent)', marginBottom:'14px' }}>
                ✅ {addedMsg}
              </div>
            )}

            {/* 組み込まれているETF */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📦 組み込まれている主なETF・インデックス
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {etfs.map((etf, i) => (
                  <span key={i} style={{ padding:'4px 12px', background:'var(--bg3)',
                    border:'1px solid var(--border)', borderRadius:'6px',
                    fontSize:'12px', color:'var(--text2)' }}>
                    {etf}
                  </span>
                ))}
              </div>
              <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px' }}>
                ※ 日経225・TOPIX構成銘柄は公式データを確認してください
              </p>
            </div>

            {/* 同テーマの関連銘柄 */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                🔗 同テーマの主要銘柄
              </div>
              {s.themes.slice(0, 2).map(theme => {
                // stock_indexから同テーマの銘柄を抽出
                const sameTheme = Object.values(stockIndex)
                  .filter(st => st.themes.includes(theme) && st.ticker !== s.ticker)
                  .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
                  .slice(0, 4)
                if (!sameTheme.length) return null
                return (
                  <div key={theme} style={{ marginBottom:'12px' }}>
                    <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:600, marginBottom:'6px' }}>
                      {theme}
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {sameTheme.map(st => (
                        <button key={st.ticker}
                          onClick={() => setSelected(st)}
                          style={{
                            padding:'4px 12px', background:'var(--bg3)',
                            border:'1px solid var(--border)', borderRadius:'6px',
                            fontFamily:'var(--font)', fontSize:'12px', cursor:'pointer',
                            color:'var(--text2)',
                          }}>
                          {st.name}
                          {st.pct != null && (
                            <span style={{ marginLeft:'5px', fontFamily:'var(--mono)', fontWeight:700,
                              color: st.pct >= 0 ? 'var(--red)' : 'var(--green)' }}>
                              {st.pct >= 0 ? '+' : ''}{st.pct.toFixed(1)}%
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
