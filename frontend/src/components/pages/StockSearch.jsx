import { useState, useEffect, useMemo, useCallback } from 'react'
import AddToThemeModal from '../AddToThemeModal'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Column.jsxから完全コピーしたTHEME_ARTICLE_MAP
const THEME_ARTICLE_MAP = {
  '半導体製造装置':'semiconductor-theme','半導体検査装置':'semiconductor-theme',
  '半導体材料':'semiconductor-theme','メモリ':'semiconductor-theme',
  'パワー半導体':'power-semiconductor','次世代半導体':'semiconductor-theme',
  '生成AI':'ai-cloud-theme','AIデータセンター':'ai-cloud-theme',
  'フィジカルAI':'physical-ai-edge-ai','AI半導体':'semiconductor-theme',
  'AI人材':'education-hr-theme','エッジAI':'physical-ai-edge-ai',
  'EV・電気自動車':'ev-green-theme','全固体電池':'ev-green-theme',
  '自動運転':'ev-green-theme','ドローン':'drone-theme',
  '輸送・物流':'transport-logistics-theme','造船':'shipbuilding-theme',
  '再生可能エネルギー':'renewable-energy-theme','太陽光発電':'renewable-energy-theme',
  '核融合発電':'renewable-energy-theme','原子力発電':'renewable-energy-theme',
  '電力会社':'renewable-energy-theme','LNG':'inpex-analysis','石油':'inpex-analysis',
  '蓄電池':'ev-green-theme','資源（水素・ヘリウム・水）':'rare-earth-resources-theme',
  'IOWN':'optical-communication','光通信':'optical-communication',
  '通信':'telecom-theme','量子コンピューター':'ai-cloud-theme','SaaS':'fintech-theme',
  'ウェアラブル端末':'game-entertainment-theme','仮想通貨':'fintech-theme',
  'ネット銀行':'banking-finance-theme','鉄鋼・素材':'steel-materials-theme',
  '化学':'chemical-theme','建築資材':'construction-infra-theme','塗料':'chemical-theme',
  '医薬品・バイオ':'pharma-bio-theme','ヘルスケア・介護':'healthcare-nursing-theme',
  '薬局・ドラッグストア':'healthcare-nursing-theme','銀行・金融':'banking-finance-theme',
  '地方銀行':'regional-bank-theme','保険':'insurance-theme','フィンテック':'fintech-theme',
  '不動産':'real-estate-theme','建設・インフラ':'construction-infra-theme',
  '国土強靭化計画':'national-resilience','下水道':'construction-infra-theme',
  '食品・飲料':'food-beverage-theme','農業・フードテック':'agritech-foodtech-theme',
  '小売・EC':'retail-ec-theme','観光・ホテル・レジャー':'tourism-hotel-theme',
  'インバウンド':'inbound-theme','リユース・中古品':'retail-ec-theme',
  '防衛・航空':'defense-theme','宇宙・衛星':'space-satellite-theme',
  'ロボット・自動化':'robot-automation-theme','レアアース・資源':'rare-earth-resources-theme',
  'バフェット銘柄':'sogo-shosha-analysis','サイバーセキュリティ':'cybersecurity-theme',
  '警備':'cybersecurity-theme','脱炭素・ESG':'ev-green-theme',
  '教育・HR・人材':'education-hr-theme','人材派遣':'education-hr-theme',
  'ゲーム・エンタメ':'game-entertainment-theme',
  // 追加
  '防衛・セキュリティ':'defense-theme','銀行':'banking-finance-theme',
  'DX':'saas-dx-theme','インバウンド消費':'inbound-theme',
}

// ETF推定
function guessETF(ticker, themes) {
  const code = parseInt(ticker)
  const etfs = []
  if (code) etfs.push('1306（TOPIX連動ETF）')
  const n225 = [7203,6758,8306,6861,8035,9983,4063,9433,7974,6367,6501,8316,8058,4519,4502,9432,7751,6594,6902,3382,6954,8411,7267,4543,5108]
  if (n225.includes(code)) etfs.push('1321（日経225連動ETF）')
  if (themes.some(t => ['AI半導体','半導体製造装置','半導体検査装置'].includes(t))) etfs.push('2644（グローバルX半導体）')
  if (themes.some(t => ['防衛・航空','防衛・セキュリティ'].includes(t))) etfs.push('2648（グローバルX防衛）')
  if (themes.some(t => ['EV・電気自動車','全固体電池'].includes(t))) etfs.push('2636（グローバルXEV）')
  if (themes.some(t => ['SaaS','DX'].includes(t))) etfs.push('2849（グローバルXクラウド）')
  return etfs
}

// 株価チャート（Infoway/stock-historyから取得）
function StockChart({ ticker, period }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [volData, setVolData] = useState([])

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    fetch(`${API}/api/stock-history/${encodeURIComponent(ticker)}?period=${period}`)
      .then(r => r.json())
      .then(d => {
        const rows = d.data || []
        setData(rows.map(r => ({ date: r.date, close: r.close })).filter(r => r.close))
        setVolData(rows.map(r => ({ date: r.date, volume: r.volume, tv: r.trade_value })).filter(r => r.volume))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [ticker, period])

  if (loading) return <div style={{ padding:'30px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>データ取得中...</div>
  if (!data.length) return <div style={{ padding:'30px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>データなし</div>

  // 株価折れ線チャート
  const W = 600, H = 140, PL = 52, PR = 16, PT = 12, PB = 24
  const GW = W - PL - PR, GH = H - PT - PB
  const closes = data.map(r => r.close)
  const minC = Math.min(...closes), maxC = Math.max(...closes)
  const rangeC = maxC - minC || 1
  const xPos = i => PL + (i / Math.max(data.length - 1, 1)) * GW
  const yC = v => PT + (1 - (v - minC) / rangeC) * GH
  const pricePts = data.map((r, i) => `${xPos(i).toFixed(1)},${yC(r.close).toFixed(1)}`).join(' ')
  const isUp = closes[closes.length - 1] >= closes[0]
  const lineColor = isUp ? 'var(--red)' : 'var(--green)'

  // 目盛り
  const ticks = 4
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => minC + (rangeC / ticks) * i)
  const fmt = v => v >= 10000 ? `${(v/1000).toFixed(0)}K` : v.toFixed(0)

  // 出来高バーチャート
  const maxVol = Math.max(...volData.map(r => r.volume || 0), 1)
  const VH = 48, VPT = 8

  // 日付ラベル（最初・中間・最後）
  const labelIdx = [0, Math.floor(data.length / 2), data.length - 1]

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'300px' }}>
        {/* グリッド */}
        {tickVals.map((v, i) => (
          <g key={i}>
            <line x1={PL} y1={yC(v)} x2={W - PR} y2={yC(v)}
              stroke="rgba(120,140,180,0.12)" strokeWidth="1"/>
            <text x={PL - 4} y={yC(v) + 4} textAnchor="end" fontSize="9" fill="var(--text3)" fontFamily="var(--mono)">
              {fmt(v)}
            </text>
          </g>
        ))}
        {/* 折れ線 */}
        <polyline points={`${xPos(0)},${PT + GH} ${pricePts} ${xPos(data.length - 1)},${PT + GH}`}
          fill={lineColor} fillOpacity="0.08" stroke="none"/>
        <polyline points={pricePts} fill="none" stroke={lineColor} strokeWidth="1.8"
          strokeLinejoin="round" strokeLinecap="round"/>
        {/* 日付ラベル */}
        {labelIdx.filter(idx => idx < data.length).map(idx => (
          <text key={idx} x={xPos(idx)} y={H - 4} textAnchor="middle"
            fontSize="9" fill="var(--text3)" fontFamily="var(--mono)">
            {data[idx].date?.slice(5)}
          </text>
        ))}
      </svg>

      {/* 出来高バー */}
      {volData.length > 0 && (
        <div style={{ marginTop:'4px' }}>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px' }}>出来高</div>
          <svg viewBox={`0 0 ${W} ${VH}`} width="100%" style={{ display:'block', minWidth:'300px' }}>
            {volData.map((r, i) => {
              const bh = Math.max(1, (r.volume / maxVol) * (VH - VPT))
              const bw = Math.max(1, GW / volData.length - 1)
              const bx = PL + (i / Math.max(volData.length - 1, 1)) * GW - bw / 2
              return (
                <rect key={i} x={bx} y={VH - bh} width={bw} height={bh}
                  fill="rgba(74,158,255,0.4)" rx="1"/>
              )
            })}
          </svg>
        </div>
      )}

      {/* 売買代金 */}
      {volData.length > 0 && (
        <div style={{ marginTop:'4px' }}>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px' }}>売買代金</div>
          <svg viewBox={`0 0 ${W} ${VH}`} width="100%" style={{ display:'block', minWidth:'300px' }}>
            {volData.map((r, i) => {
              const maxTV = Math.max(...volData.map(v => v.tv || 0), 1)
              const bh = Math.max(1, ((r.tv || 0) / maxTV) * (VH - VPT))
              const bw = Math.max(1, GW / volData.length - 1)
              const bx = PL + (i / Math.max(volData.length - 1, 1)) * GW - bw / 2
              return (
                <rect key={i} x={bx} y={VH - bh} width={bw} height={bh}
                  fill="rgba(255,140,66,0.4)" rx="1"/>
              )
            })}
          </svg>
        </div>
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
  const [modalStock, setModalStock] = useState(null)  // カスタムテーマ追加モーダル

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
      s.name?.toLowerCase().includes(q) ||
      s.ticker?.toLowerCase().includes(q) ||
      s.ticker?.replace('.T','').includes(q)
    ).slice(0, 20)
  }, [stockIndex, searchQ])

  const doSearch = useCallback(() => setSearchQ(query), [query])

  const fmt = (v) => {
    if (v == null || isNaN(v)) return '-'
    if (v >= 1e12) return (v / 1e12).toFixed(1) + '兆円'
    if (v >= 1e8)  return (v / 1e8).toFixed(1) + '億円'
    return v.toLocaleString()
  }
  const pColor = v => v == null ? 'var(--text3)' : v >= 0 ? 'var(--red)' : 'var(--green)'

  const PERIODS = [
    { v:'1d', l:'1日' },{ v:'5d', l:'1週' },{ v:'1mo', l:'1ヶ月' },
    { v:'3mo', l:'3ヶ月' },{ v:'6mo', l:'6ヶ月' },{ v:'1y', l:'1年' },
  ]

  const btn = {
    base: {
      padding:'8px 16px', border:'1px solid var(--border)', borderRadius:'8px',
      cursor:'pointer', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
      background:'var(--bg3)', color:'var(--text2)',
    },
    accent: {
      padding:'10px 18px', border:'1px solid rgba(74,158,255,0.3)', borderRadius:'8px',
      cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
      background:'rgba(74,158,255,0.1)', color:'var(--accent)',
    },
    purple: {
      padding:'10px 18px', border:'1px solid rgba(170,119,255,0.3)', borderRadius:'8px',
      cursor:'pointer', fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
      background:'rgba(170,119,255,0.08)', color:'#aa77ff',
    },
  }

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'900px', margin:'0 auto' }}>
      {/* カスタムテーマ追加モーダル */}
      {modalStock && (
        <AddToThemeModal
          stock={modalStock}
          onClose={() => setModalStock(null)}
        />
      )}

      {selected ? (
        <button onClick={() => { setSelected(null); setPeriod('1mo') }}
          style={{ ...btn.base, marginBottom:'16px', background:'transparent', border:'none', padding:0, color:'var(--text3)', fontSize:'13px' }}>
          ← 検索に戻る
        </button>
      ) : (
        <>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>
            🔎 銘柄検索
          </h1>
          <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'18px', lineHeight:1.7 }}>
            銘柄名または証券コードで検索。株価チャート・テーマ・コラムへのリンクを表示します。
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

      {/* 検索前 */}
      {!selected && !searchQ && (
        <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text3)' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔎</div>
          <div style={{ fontSize:'13px' }}>銘柄名や証券コードで検索</div>
          <div style={{ fontSize:'11px', marginTop:'6px' }}>
            {loading ? '読み込み中...' : `${Object.keys(stockIndex).length}銘柄のデータが利用可能`}
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
                const code = s.ticker.replace('.T','')
                return (
                  <div key={s.ticker}
                    onClick={() => setSelected(s)}
                    style={{
                      background:'var(--bg2)', border:'1px solid var(--border)',
                      borderRadius:'10px', padding:'12px 16px', cursor:'pointer',
                      display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                  >
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{s.name}</span>
                        <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)',
                          background:'var(--bg3)', padding:'1px 6px', borderRadius:'4px' }}>{code}</span>
                      </div>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {s.themes.slice(0, 3).map(t => (
                          <span key={t} style={{ fontSize:'10px', padding:'2px 7px',
                            background:'rgba(74,158,255,0.08)', color:'var(--accent)',
                            border:'1px solid rgba(74,158,255,0.2)', borderRadius:'10px' }}>{t}</span>
                        ))}
                        {s.themes.length > 3 && <span style={{ fontSize:'10px', color:'var(--text3)' }}>+{s.themes.length - 3}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', fontFamily:'var(--mono)' }}>
                        ¥{s.price?.toLocaleString() ?? '-'}
                      </div>
                      <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'var(--mono)', color:pColor(s.pct) }}>
                        {s.pct != null ? `${s.pct >= 0 ? '+' : ''}${s.pct.toFixed(1)}%` : '-'}
                      </div>
                    </div>
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
        // コラムIDをTHEME_ARTICLE_MAPから取得（最初にマッチしたテーマ）
        const colId = s.themes.map(t => THEME_ARTICLE_MAP[t]).find(Boolean) || null
        const etfs = guessETF(s.ticker, s.themes)

        return (
          <div>
            {/* 銘柄ヘッダー */}
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
                      {s.pct != null ? `${s.pct >= 0 ? '+' : ''}${s.pct.toFixed(2)}%` : '-'}
                    </span>
                    <span style={{ fontSize:'12px', color:'var(--text3)' }}>
                      時価総額: <strong style={{ color:'var(--text2)' }}>{fmt(s.market_cap)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'14px' }}>
              <button onClick={() => setModalStock({
                ticker: s.ticker,
                name: s.name,
                price: s.price,
                pct: s.pct,
              })} style={btn.accent}>
                ＋ カスタムテーマに追加
              </button>
              {colId && (
                <button onClick={() => onNavigate?.('コラム・解説', colId)} style={btn.purple}>
                  📖 関連コラムを読む
                </button>
              )}
            </div>

            {/* 期間選択 */}
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
              {PERIODS.map(p => (
                <button key={p.v} onClick={() => setPeriod(p.v)} style={{
                  ...btn.base,
                  border: period === p.v ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: period === p.v ? 'rgba(74,158,255,0.12)' : 'transparent',
                  color: period === p.v ? 'var(--accent)' : 'var(--text3)',
                }}>{p.l}</button>
              ))}
            </div>

            {/* 株価チャート（Infoway） */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📈 株価・出来高・売買代金推移
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
                {s.themes.map(t => (
                  <button key={t} onClick={() => onNavigate?.('テーマ別詳細', t)}
                    style={{
                      padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
                      background:'rgba(74,158,255,0.08)', border:'1px solid rgba(74,158,255,0.25)',
                      color:'var(--accent)', fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
                    }}>
                    {t} →
                  </button>
                ))}
              </div>
            </div>

            {/* 組み込みETF */}
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'12px', padding:'16px 20px', marginBottom:'14px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
                📦 組み込まれている主なETF
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {etfs.map((etf, i) => (
                  <span key={i} style={{ padding:'4px 12px', background:'var(--bg3)',
                    border:'1px solid var(--border)', borderRadius:'6px',
                    fontSize:'12px', color:'var(--text2)' }}>{etf}</span>
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
              {s.themes.slice(0, 2).map(theme => {
                const sameTheme = Object.values(stockIndex)
                  .filter(st => st.themes.includes(theme) && st.ticker !== s.ticker)
                  .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
                  .slice(0, 5)
                if (!sameTheme.length) return null
                return (
                  <div key={theme} style={{ marginBottom:'12px' }}>
                    <div style={{ fontSize:'11px', color:'var(--accent)', fontWeight:600, marginBottom:'6px' }}>
                      {theme}
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {sameTheme.map(st => (
                        <button key={st.ticker} onClick={() => setSelected(st)} style={{
                          padding:'4px 12px', background:'var(--bg3)',
                          border:'1px solid var(--border)', borderRadius:'6px',
                          fontFamily:'var(--font)', fontSize:'12px', cursor:'pointer', color:'var(--text2)',
                        }}>
                          {st.name}
                          {st.pct != null && (
                            <span style={{ marginLeft:'5px', fontFamily:'var(--mono)', fontWeight:700,
                              color:pColor(st.pct) }}>
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
