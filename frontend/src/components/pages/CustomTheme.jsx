/**
 * CustomTheme.jsx — カスタムテーマ管理＋詳細表示＋URLエクスポート
 */
import { useState, useEffect } from 'react'
import { useCustomThemes, themeToUrl, themeFromUrl, STORAGE_KEY } from '../../hooks/useCustomThemes'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const PERIODS = [
  { label:'1週間', value:'5d' },
  { label:'1ヶ月', value:'1mo' },
  { label:'3ヶ月', value:'3mo' },
]

function formatLarge(n) {
  if (!n) return '0'
  if (n >= 1e12) return (n/1e12).toFixed(1)+'兆'
  if (n >= 1e8)  return (n/1e8).toFixed(1)+'億'
  if (n >= 1e4)  return (n/1e4).toFixed(1)+'万'
  return n.toLocaleString()
}

// ── 騰落率グラフ ─────────────────────────────────
function ThemeTrendChart({ stocks, period }) {
  const [seriesData, setSeriesData] = useState({})
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!stocks?.length) return
    setLoading(true)
    const fetches = stocks.map(s =>
      fetch(`${API}/api/stock-history/${encodeURIComponent(s.ticker)}?period=${period}`)
        .then(r => r.json())
        .catch(() => null)
    )
    Promise.all(fetches).then(results => {
      const map = {}
      results.forEach((r, i) => {
        if (r?.data?.length) map[stocks[i].name] = r.data
      })
      setSeriesData(map)
      setLoading(false)
    })
  }, [stocks, period])

  if (loading) return (
    <div style={{ padding:'20px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>
      グラフデータ取得中...
    </div>
  )

  const names = Object.keys(seriesData)
  if (!names.length) return (
    <div style={{ padding:'20px', textAlign:'center', color:'var(--text3)', fontSize:'12px' }}>
      グラフデータなし
    </div>
  )

  const allDates = [...new Set(names.flatMap(n => seriesData[n].map(d => d.date)))].sort()
  const W = 800, H = 200, PL = 44, PR = 16, PT = 12, PB = 28
  const COLORS = ['#4a9eff','#ff4560','#06d6a0','#ffd166','#aa77ff','#ff8c42','#e63030','#06d6a0']

  let yMin = Infinity, yMax = -Infinity
  names.forEach(n => seriesData[n].forEach(d => {
    if (d.pct < yMin) yMin = d.pct
    if (d.pct > yMax) yMax = d.pct
  }))
  if (yMin === Infinity) { yMin = -1; yMax = 1 }
  const pad = (yMax - yMin) * 0.1 || 1
  const nMin = yMin - pad, nMax = yMax + pad
  const xS = i => PL + (i / Math.max(allDates.length - 1, 1)) * (W - PL - PR)
  const yS = v => PT + (1 - (v - nMin) / (nMax - nMin)) * (H - PT - PB)

  const ticks = [-20, -10, 0, 10, 20].filter(v => v >= nMin - 5 && v <= nMax + 5)
  const xStep = Math.max(1, Math.floor(allDates.length / 5))
  const xLabels = []
  for (let i = 0; i < allDates.length; i += xStep) xLabels.push({ i, date: allDates[i] })

  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px', overflowX:'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:'block', minWidth:'280px' }}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke="rgba(120,140,180,0.1)" strokeWidth="1"/>
            {v === 0 && <line x1={PL} y1={yS(0)} x2={W-PR} y2={yS(0)} stroke="rgba(120,140,180,0.3)" strokeWidth="1" strokeDasharray="4,3"/>}
            <text x={PL-4} y={yS(v)+3} textAnchor="end" fill="var(--text3)" fontSize="8" fontFamily="DM Mono">
              {v>0?`+${v}`:v}%
            </text>
          </g>
        ))}
        {xLabels.map(({i, date}) => (
          <text key={date} x={xS(i)} y={H-4} textAnchor="middle" fill="var(--text3)" fontSize="8">
            {date.slice(2,7)}
          </text>
        ))}
        {names.map((name, ti) => {
          const data = seriesData[name]
          const pts = data.map(d => {
            const xi = allDates.indexOf(d.date)
            return xi >= 0 ? `${xS(xi)},${yS(d.pct)}` : null
          }).filter(Boolean)
          return pts.length ? (
            <polyline key={name} points={pts.join(' ')} fill="none"
              stroke={COLORS[ti % COLORS.length]} strokeWidth="1.8"
              strokeLinejoin="round" strokeLinecap="round"/>
          ) : null
        })}
      </svg>
      {/* 凡例 */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginTop:'8px' }}>
        {names.map((name, ti) => {
          const last = seriesData[name]?.at(-1)
          const c = COLORS[ti % COLORS.length]
          return (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
              <div style={{ width:'14px', height:'2px', background:c, borderRadius:'1px' }}/>
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{name}</span>
              {last && <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color:c, fontWeight:700 }}>
                {last.pct>=0?'+':''}{last.pct?.toFixed(1)}%
              </span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 銘柄テーブル ─────────────────────────────────
function CustomStockTable({ stocks, period, onRemove }) {
  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!stocks?.length) return
    setLoading(true)
    Promise.all(
      stocks.map(s =>
        fetch(`${API}/api/stock-info/${encodeURIComponent(s.ticker)}`)
          .then(r => r.json()).catch(() => null)
      )
    ).then(results => {
      const map = {}
      results.forEach((r, i) => { if (r) map[stocks[i].ticker] = r })
      setDetails(map)
      setLoading(false)
    })
  }, [stocks, period])

  if (!stocks?.length) return (
    <div style={{ textAlign:'center', padding:'20px', color:'var(--text3)', fontSize:'12px' }}>
      銘柄がありません
    </div>
  )

  const avg = stocks.length && Object.values(details).length
    ? Object.values(details).reduce((s, d) => s + (d.pct ?? 0), 0) / Object.values(details).length
    : null

  return (
    <div>
      {avg !== null && (
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
          <span style={{ fontSize:'12px', color:'var(--text3)' }}>テーマ平均騰落率</span>
          <span style={{ fontSize:'18px', fontWeight:700, fontFamily:'var(--mono)',
            color: avg >= 0 ? 'var(--red)' : 'var(--green)' }}>
            {avg >= 0 ? '+' : ''}{avg.toFixed(2)}%
          </span>
        </div>
      )}
      <div style={{ overflowX:'auto' }}>
        <table style={{ borderCollapse:'collapse', fontSize:'12px', fontFamily:'var(--font)', width:'100%', minWidth:'600px' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              {['#','銘柄名','株価','騰落率','出来高','売買代金','操作'].map(h => (
                <th key={h} style={{ padding:'6px 10px', textAlign: h==='銘柄名'?'left':'right',
                  fontSize:'10px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase',
                  letterSpacing:'0.06em', whiteSpace:'nowrap', background:'var(--bg3)',
                  ...(h==='#'||h==='操作' ? {textAlign:'center'} : {}) }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => {
              const d = details[s.ticker]
              const pColor = (d?.pct ?? 0) >= 0 ? 'var(--red)' : 'var(--green)'
              const bg = i%2===0 ? 'transparent' : 'rgba(255,255,255,0.02)'
              return (
                <tr key={s.ticker} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', background: bg }}>
                  <td style={{ padding:'8px 10px', textAlign:'center', color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'11px' }}>
                    {i+1}
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'left' }}>
                    <div style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)' }}>{s.ticker.replace('.T','')}</div>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{s.name}</div>
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'var(--mono)', color:'var(--text2)' }}>
                    {loading ? '...' : d?.price ? `¥${d.price.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, color: loading ? 'var(--text3)' : pColor }}>
                    {loading ? '...' : d?.pct != null ? `${d.pct>=0?'+':''}${d.pct.toFixed(1)}%` : '-'}
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'var(--mono)', color:'var(--text2)' }}>
                    {loading ? '...' : formatLarge(d?.volume)}
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'right', fontFamily:'var(--mono)', color:'var(--text2)' }}>
                    {loading ? '...' : formatLarge(d?.trade_value)}
                  </td>
                  <td style={{ padding:'8px 10px', textAlign:'center' }}>
                    {onRemove && (
                      <button onClick={() => onRemove(s.ticker)} style={{
                        background:'none', border:'1px solid var(--border)', borderRadius:'4px',
                        color:'var(--text3)', cursor:'pointer', padding:'2px 7px', fontSize:'11px',
                        fontFamily:'var(--font)',
                      }}>✕</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── メインコンポーネント ────────────────────────
export default function CustomTheme() {
  const { themes, saveTheme, deleteTheme } = useCustomThemes()
  const [mode,        setMode]        = useState('list')  // 'list'|'detail'|'edit'|'create'
  const [activeIndex, setActiveIndex] = useState(null)
  const [editTarget,  setEditTarget]  = useState(null)
  const [period,      setPeriod]      = useState('1mo')
  const [urlCopied,   setUrlCopied]   = useState(false)

  // 編集フォーム
  const [themeName, setThemeName]   = useState('')
  const [stocks,    setStocks]      = useState([])
  const [query,     setQuery]       = useState('')
  const [searching, setSearching]   = useState(false)
  const [results,   setResults]     = useState([])
  const [searchErr, setSearchErr]   = useState('')
  const [detailPeriod, setDetailPeriod] = useState('1mo')
  const [expandedResult, setExpanded] = useState(null)

  // URLからインポート
  useEffect(() => {
    const imported = themeFromUrl(window.location.search)
    if (imported) {
      const already = themes.find(t => t.name === imported.name)
      if (!already) {
        if (window.confirm(`URLからテーマ「${imported.name}」をインポートしますか？`)) {
          saveTheme(imported)
        }
      }
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const activeTheme = activeIndex !== null ? themes[activeIndex] : null

  // URLコピー
  const copyUrl = () => {
    if (!activeTheme) return
    const url = window.location.origin + window.location.pathname + themeToUrl(activeTheme)
    navigator.clipboard.writeText(url).then(() => {
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    })
  }

  // 編集開始
  const startEdit = (i) => {
    const t = themes[i]
    setEditTarget(i); setThemeName(t.name); setStocks(t.stocks||[])
    setMode('edit'); setResults([]); setQuery(''); setSearchErr(''); setExpanded(null)
  }
  const startCreate = () => {
    setEditTarget(null); setThemeName(''); setStocks([])
    setMode('create'); setResults([]); setQuery(''); setSearchErr(''); setExpanded(null)
  }

  // 検索
  const handleSearch = async () => {
    const q = query.trim(); if (!q) return
    setSearching(true); setSearchErr(''); setResults([]); setExpanded(null)
    try {
      if (/^\d{4}$/.test(q)) {
        const r = await fetch(`${API}/api/stock-info/${encodeURIComponent(q+'.T')}`)
        const d = await r.json()
        d.ticker ? setResults([{ ticker:d.ticker, name:d.name||d.ticker, price:d.price }])
                 : setSearchErr(`「${q}」が見つかりませんでした`)
      } else {
        const r = await fetch(`${API}/api/stock-search?q=${encodeURIComponent(q)}`)
        const d = await r.json()
        const jp = (d.results||[]).filter(r => r.ticker?.endsWith('.T'))
        jp.length ? setResults(jp)
                  : setSearchErr(`「${q}」に一致する銘柄が見つかりませんでした（証券コード4桁でも検索できます）`)
      }
    } catch { setSearchErr('検索に失敗しました') }
    setSearching(false)
  }
  const addStock = (s) => {
    if (stocks.find(x => x.ticker === s.ticker)) { setSearchErr('すでに追加済みです'); return }
    setStocks(p => [...p, s]); setResults([]); setQuery(''); setSearchErr(''); setExpanded(null)
  }
  const removeStock = (ticker) => setStocks(p => p.filter(s => s.ticker !== ticker))

  const handleSave = () => {
    if (!themeName.trim()) { alert('テーマ名を入力してください'); return }
    if (!stocks.length)    { alert('銘柄を1つ以上追加してください'); return }
    saveTheme({ name:themeName.trim(), stocks }, editTarget)
    setMode('list')
  }

  // ── テーマ一覧 ──────────────────────────────
  if (mode === 'list') return (
    <div style={{ padding:'28px 24px 48px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>カスタムテーマ</h1>
        <button onClick={startCreate} style={btnP}>＋ 新規作成</button>
      </div>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px' }}>
        独自のテーマを作成・追跡。銘柄名または4桁証券コードで検索（日本株のみ）。
      </p>
      {themes.length === 0 ? (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)',
          padding:'48px', textAlign:'center' }}>
          <div style={{ fontSize:'36px', marginBottom:'12px' }}>🎨</div>
          <div style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'20px' }}>まだカスタムテーマがありません</div>
          <button onClick={startCreate} style={btnP}>最初のテーマを作成</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {themes.map((t, i) => (
            <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'14px 18px',
              display:'flex', alignItems:'center', gap:'12px',
              animation:`fadeUp 0.3s ease ${i*0.05}s both`,
              cursor:'pointer', transition:'border-color 0.15s' }}
              onClick={() => { setActiveIndex(i); setMode('detail') }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>{t.name}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                  {(t.stocks||[]).map(s => (
                    <span key={s.ticker} style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'20px',
                      background:'rgba(74,158,255,0.1)', color:'var(--accent)', border:'1px solid rgba(74,158,255,0.2)' }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize:'12px', color:'var(--text3)', whiteSpace:'nowrap' }}>{(t.stocks||[]).length}銘柄</span>
              <button onClick={e => { e.stopPropagation(); startEdit(i) }} style={btnS}>編集</button>
              <button onClick={e => { e.stopPropagation(); window.confirm('削除しますか？') && deleteTheme(i) }} style={btnD}>削除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── テーマ詳細 ──────────────────────────────
  if (mode === 'detail' && activeTheme) return (
    <div style={{ padding:'20px 24px 48px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
        <button onClick={() => setMode('list')} style={{ background:'none', border:'none',
          color:'var(--text2)', cursor:'pointer', fontSize:'20px', padding:0 }}>←</button>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)', flex:1 }}>{activeTheme.name}</h1>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)} style={{
              padding:'4px 12px', borderRadius:'6px', fontSize:'11px', cursor:'pointer',
              fontFamily:'var(--font)', fontWeight: period===p.value ? 700 : 400,
              border: period===p.value ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: period===p.value ? 'rgba(74,158,255,0.12)' : 'transparent',
              color: period===p.value ? 'var(--accent)' : 'var(--text3)',
            }}>{p.label}</button>
          ))}
          <button onClick={() => startEdit(activeIndex)} style={btnS}>✏️ 編集</button>
          <button onClick={copyUrl} style={{ ...btnS, color: urlCopied ? 'var(--green)' : 'var(--text2)' }}>
            {urlCopied ? '✓ コピー済み' : '🔗 URLをコピー'}
          </button>
        </div>
      </div>

      {/* 騰落率グラフ */}
      <div style={{ marginBottom:'20px' }}>
        <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text3)', marginBottom:'8px',
          display:'flex', alignItems:'center', gap:'8px' }}>
          <span>📈 構成銘柄 騰落率推移</span>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
        </div>
        <ThemeTrendChart stocks={activeTheme.stocks} period={period} />
      </div>

      {/* 銘柄テーブル */}
      <div>
        <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text3)', marginBottom:'8px',
          display:'flex', alignItems:'center', gap:'8px' }}>
          <span>📋 構成銘柄 詳細データ（{period === '5d' ? '1週間' : period === '1mo' ? '1ヶ月' : '3ヶ月'}）</span>
          <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
        </div>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'14px' }}>
          <CustomStockTable stocks={activeTheme.stocks} period={period} />
        </div>
      </div>

      {/* URLエクスポート説明 */}
      <div style={{ marginTop:'20px', padding:'12px 16px', background:'rgba(74,158,255,0.06)',
        border:'1px solid rgba(74,158,255,0.15)', borderRadius:'8px', fontSize:'12px', color:'var(--text3)' }}>
        💡 「URLをコピー」でこのテーマを共有・ブックマークできます。URLにアクセスすると自動でインポートされます。
      </div>
    </div>
  )

  // ── 作成/編集フォーム ──────────────────────
  return (
    <div style={{ padding:'28px 24px 48px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
        <button onClick={() => setMode('list')} style={{ background:'none', border:'none',
          color:'var(--text2)', cursor:'pointer', fontSize:'20px', padding:0 }}>←</button>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>
          {mode === 'edit' ? 'テーマを編集' : '新規テーマ作成'}
        </h1>
      </div>

      <div style={{ marginBottom:'20px' }}>
        <label style={lbl}>テーマ名</label>
        <input value={themeName} onChange={e => setThemeName(e.target.value)}
          placeholder="例：AIロボット、注目銘柄 など"
          style={{ ...inp, width:'100%', maxWidth:'400px' }} />
      </div>

      <div style={{ marginBottom:'20px' }}>
        <label style={lbl}>銘柄を追加</label>
        <div style={{ display:'flex', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleSearch()}
            placeholder="銘柄名（例：トヨタ、ソニー）または証券コード（例：7203）"
            style={{ ...inp, flex:1, minWidth:'200px' }} />
          <button onClick={handleSearch} disabled={searching || !query.trim()}
            style={{ ...btnP, opacity: (!query.trim()||searching) ? 0.5 : 1 }}>
            {searching ? '検索中...' : '🔍 検索'}
          </button>
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)' }}>
          ※ 日本株のみ対応
        </div>

        {searchErr && (
          <div style={{ fontSize:'12px', color:'var(--red)', marginTop:'8px', padding:'8px 12px',
            background:'rgba(255,83,112,0.08)', borderRadius:'6px', border:'1px solid rgba(255,83,112,0.2)' }}>
            {searchErr}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ marginTop:'10px' }}>
            <div style={{ display:'flex', gap:'4px', marginBottom:'8px' }}>
              {PERIODS.map(p => (
                <button key={p.value} onClick={() => setDetailPeriod(p.value)} style={{
                  padding:'3px 10px', borderRadius:'4px', fontSize:'11px', cursor:'pointer',
                  fontFamily:'var(--font)', border:'none',
                  background: detailPeriod===p.value ? 'var(--accent)' : 'var(--bg3)',
                  color: detailPeriod===p.value ? '#fff' : 'var(--text3)',
                }}>{p.label}</button>
              ))}
            </div>
            <div style={{ border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden' }}>
              {results.map((r, i) => (
                <div key={r.ticker}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px',
                    background: i%2===0 ? 'var(--bg2)' : 'var(--bg3)',
                    borderBottom: i<results.length-1 || expandedResult===r.ticker ? '1px solid var(--border)' : 'none',
                    cursor:'pointer' }}
                    onClick={() => setExpanded(expandedResult===r.ticker ? null : r.ticker)}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>
                        {r.ticker.replace('.T','')}
                        {r.price && <span style={{ marginLeft:'10px', color:'var(--text2)' }}>¥{r.price.toLocaleString()}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize:'10px', color:'var(--text3)' }}>
                      {expandedResult===r.ticker ? '▲' : '▼'}
                    </span>
                    <button onClick={e => { e.stopPropagation(); addStock(r) }} style={btnP}>追加</button>
                  </div>
                  {expandedResult===r.ticker && (
                    <div style={{ padding:'10px 14px', background:'var(--bg2)',
                      borderBottom: i<results.length-1 ? '1px solid var(--border)' : 'none' }}>
                      <CustomStockTable stocks={[r]} period={detailPeriod} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {stocks.length > 0 && (
        <div style={{ marginBottom:'24px' }}>
          <label style={lbl}>追加済み銘柄（{stocks.length}銘柄）</label>
          <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
            {stocks.map((s, i) => (
              <div key={s.ticker} style={{ display:'flex', alignItems:'center', gap:'10px',
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'6px', padding:'8px 12px',
                animation:`fadeUp 0.2s ease ${i*0.03}s both` }}>
                <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)', width:'60px', flexShrink:0 }}>
                  {s.ticker.replace('.T','')}
                </span>
                <span style={{ flex:1, fontSize:'13px', color:'var(--text)', fontWeight:500 }}>{s.name}</span>
                {s.price && <span style={{ fontSize:'12px', color:'var(--text2)', fontFamily:'var(--mono)' }}>¥{s.price.toLocaleString()}</span>}
                <button onClick={() => removeStock(s.ticker)} style={{ background:'none', border:'1px solid var(--border)',
                  borderRadius:'4px', color:'var(--text3)', cursor:'pointer', padding:'3px 8px',
                  fontSize:'12px', fontFamily:'var(--font)' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:'10px' }}>
        <button onClick={handleSave} disabled={!themeName.trim()||!stocks.length}
          style={{ ...btnP, fontSize:'14px', padding:'10px 24px', opacity: (!themeName.trim()||!stocks.length) ? 0.4 : 1 }}>
          💾 {mode==='edit' ? '変更を保存' : 'テーマを作成'}
        </button>
        <button onClick={() => setMode('list')} style={{ ...btnS, fontSize:'14px', padding:'10px 18px' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

const btnP = { background:'rgba(74,158,255,0.15)', color:'var(--accent)', border:'1px solid rgba(74,158,255,0.3)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 14px', cursor:'pointer', fontWeight:600, transition:'all 0.15s', whiteSpace:'nowrap' }
const btnS = { background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 12px', cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }
const btnD = { background:'rgba(255,83,112,0.1)', color:'var(--red)', border:'1px solid rgba(255,83,112,0.2)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 12px', cursor:'pointer', transition:'all 0.15s' }
const inp  = { background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'8px 12px', outline:'none' }
const lbl  = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text2)', textTransform:'uppercase', marginBottom:'8px' }
