import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const STORAGE_KEY = 'swjp_custom_themes_v2'

function loadThemes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveThemes(themes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes))
}

export default function CustomTheme() {
  const [themes,     setThemes]     = useState(loadThemes)
  const [mode,       setMode]       = useState('list')
  const [editTarget, setEditTarget] = useState(null)
  const [themeName,  setThemeName]  = useState('')
  const [query,      setQuery]      = useState('')   // 銘柄名 or 証券コード
  const [searching,  setSearching]  = useState(false)
  const [results,    setResults]    = useState([])   // 検索結果リスト
  const [searchError,setSearchError]= useState('')
  const [stocks,     setStocks]     = useState([])

  const persist = (updated) => { setThemes(updated); saveThemes(updated) }

  const startEdit = (i) => {
    const t = themes[i]
    setEditTarget(i); setThemeName(t.name); setStocks(t.stocks || [])
    setMode('edit'); setResults([]); setQuery(''); setSearchError('')
  }
  const startCreate = () => {
    setEditTarget(null); setThemeName(''); setStocks([])
    setMode('create'); setResults([]); setQuery(''); setSearchError('')
  }

  // 検索：銘柄名 or 4桁証券コード
  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return
    setSearching(true); setSearchError(''); setResults([])

    // 数字4桁 → 日本株ティッカー（.T付与）
    // アルファベット → 米国株そのまま
    // それ以外 → 銘柄名検索
    let tickersToTry = []
    if (/^\d{4}$/.test(q)) {
      tickersToTry = [q + '.T']
    } else if (/^[A-Za-z\^=]+$/.test(q)) {
      tickersToTry = [q.toUpperCase()]
    } else {
      // 銘柄名検索：バックエンドのsearch APIを呼ぶ
      try {
        const res  = await fetch(`${API}/api/stock-search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          setResults(data.results)
        } else {
          setSearchError(`「${q}」に一致する銘柄が見つかりませんでした`)
        }
      } catch {
        setSearchError('検索に失敗しました')
      }
      setSearching(false)
      return
    }

    // ティッカーで直接検索
    try {
      const res  = await fetch(`${API}/api/stock-info/${encodeURIComponent(tickersToTry[0])}`)
      const data = await res.json()
      if (data.name) {
        setResults([{ ticker: data.ticker, name: data.name, price: data.price }])
      } else {
        setSearchError(`「${tickersToTry[0]}」の情報が取得できませんでした`)
      }
    } catch {
      setSearchError('検索に失敗しました')
    }
    setSearching(false)
  }

  const addStock = (stock) => {
    if (stocks.find(s => s.ticker === stock.ticker)) {
      setSearchError('この銘柄はすでに追加されています'); return
    }
    setStocks(prev => [...prev, stock])
    setResults([]); setQuery(''); setSearchError('')
  }

  const removeStock = (ticker) => setStocks(prev => prev.filter(s => s.ticker !== ticker))

  const handleSave = () => {
    if (!themeName.trim()) { alert('テーマ名を入力してください'); return }
    if (!stocks.length)    { alert('銘柄を1つ以上追加してください'); return }
    const theme = { name: themeName.trim(), stocks }
    if (mode === 'edit' && editTarget !== null) {
      persist(themes.map((t,i) => i === editTarget ? theme : t))
    } else {
      persist([...themes, theme])
    }
    setMode('list')
  }

  const deleteTheme = (i) => {
    if (!window.confirm('このテーマを削除しますか？')) return
    persist(themes.filter((_,idx) => idx !== i))
  }

  // ── リスト ──
  if (mode === 'list') {
    return (
      <div style={{ padding:'28px 24px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>カスタムテーマ</h1>
          <button onClick={startCreate} style={btnP}>＋ 新規作成</button>
        </div>
        <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px' }}>
          独自のテーマを作成して追跡。銘柄名または4桁の証券コードで検索できます。
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
            {themes.map((t,i) => (
              <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'var(--radius)', padding:'14px 18px',
                display:'flex', alignItems:'center', gap:'12px',
                animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>{t.name}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                    {(t.stocks||[]).map(s=>(
                      <span key={s.ticker} style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'20px',
                        background:'rgba(91,156,246,0.1)', color:'var(--accent)', border:'1px solid rgba(91,156,246,0.2)' }}>
                        {s.name||s.ticker}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize:'12px', color:'var(--text3)', whiteSpace:'nowrap' }}>{(t.stocks||[]).length}銘柄</span>
                <button onClick={()=>startEdit(i)} style={btnS}>編集</button>
                <button onClick={()=>deleteTheme(i)} style={btnD}>削除</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── 作成/編集フォーム ──
  return (
    <div style={{ padding:'28px 24px 48px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
        <button onClick={()=>setMode('list')} style={{ background:'none', border:'none',
          color:'var(--text2)', cursor:'pointer', fontSize:'20px', padding:0 }}>←</button>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>
          {mode==='edit'?'テーマを編集':'新規テーマ作成'}
        </h1>
      </div>

      {/* テーマ名 */}
      <div style={{ marginBottom:'20px' }}>
        <label style={lbl}>テーマ名</label>
        <input value={themeName} onChange={e=>setThemeName(e.target.value)}
          placeholder="例：AIロボット、防衛関連 など"
          style={{ ...inp, width:'100%', maxWidth:'400px' }} />
      </div>

      {/* 銘柄検索 */}
      <div style={{ marginBottom:'20px' }}>
        <label style={lbl}>銘柄を追加</label>
        <div style={{ display:'flex', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
            placeholder="銘柄名（例：トヨタ）または証券コード（例：7203）"
            style={{ ...inp, flex:1, minWidth:'200px' }} />
          <button onClick={handleSearch} disabled={searching||!query.trim()} style={{
            ...btnP, opacity:(!query.trim()||searching)?0.5:1 }}>
            {searching?'検索中...':'🔍 検索'}
          </button>
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)' }}>
          日本株：4桁の証券コード（7203）または銘柄名（トヨタ）で検索 / 米国株：ティッカー（AAPL）
        </div>

        {/* エラー */}
        {searchError && (
          <div style={{ fontSize:'12px', color:'var(--red)', marginTop:'8px', padding:'8px 12px',
            background:'rgba(255,83,112,0.08)', borderRadius:'6px', border:'1px solid rgba(255,83,112,0.2)' }}>
            {searchError}
          </div>
        )}

        {/* 検索結果リスト */}
        {results.length > 0 && (
          <div style={{ marginTop:'10px', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden' }}>
            {results.map((r,i) => (
              <div key={r.ticker} style={{ display:'flex', alignItems:'center', gap:'12px',
                padding:'10px 14px', background: i%2===0?'var(--bg2)':'var(--bg3)',
                borderBottom: i<results.length-1?'1px solid var(--border)':'none' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{r.name}</div>
                  <div style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>
                    {r.ticker}
                    {r.price && <span style={{ marginLeft:'10px', color:'var(--text2)' }}>¥{r.price.toLocaleString()}</span>}
                  </div>
                </div>
                <button onClick={()=>addStock(r)} style={btnP}>追加</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 追加済み銘柄 */}
      {stocks.length > 0 && (
        <div style={{ marginBottom:'24px' }}>
          <label style={lbl}>追加済み銘柄（{stocks.length}銘柄）</label>
          <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
            {stocks.map((s,i) => (
              <div key={s.ticker} style={{ display:'flex', alignItems:'center', gap:'10px',
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'6px', padding:'8px 12px',
                animation:`fadeUp 0.2s ease ${i*0.03}s both` }}>
                <span style={{ fontSize:'12px', color:'var(--text3)', fontFamily:'var(--mono)', width:'70px', flexShrink:0 }}>
                  {s.ticker.replace('.T','')}
                </span>
                <span style={{ flex:1, fontSize:'13px', color:'var(--text)', fontWeight:500 }}>{s.name}</span>
                {s.price && <span style={{ fontSize:'12px', color:'var(--text2)', fontFamily:'var(--mono)' }}>¥{s.price.toLocaleString()}</span>}
                <button onClick={()=>removeStock(s.ticker)} style={{ background:'none', border:'1px solid var(--border)',
                  borderRadius:'4px', color:'var(--text3)', cursor:'pointer', padding:'3px 8px',
                  fontSize:'12px', fontFamily:'var(--font)' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 保存 */}
      <div style={{ display:'flex', gap:'10px' }}>
        <button onClick={handleSave} disabled={!themeName.trim()||!stocks.length}
          style={{ ...btnP, fontSize:'14px', padding:'10px 24px', opacity:(!themeName.trim()||!stocks.length)?0.4:1 }}>
          💾 {mode==='edit'?'変更を保存':'テーマを作成'}
        </button>
        <button onClick={()=>setMode('list')} style={{ ...btnS, fontSize:'14px', padding:'10px 18px' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

const btnP = { background:'rgba(91,156,246,0.15)', color:'var(--accent)', border:'1px solid rgba(91,156,246,0.3)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 14px', cursor:'pointer', fontWeight:600, transition:'all 0.15s', whiteSpace:'nowrap' }
const btnS = { background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 12px', cursor:'pointer', transition:'all 0.15s' }
const btnD = { background:'rgba(255,83,112,0.1)', color:'var(--red)', border:'1px solid rgba(255,83,112,0.2)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'7px 12px', cursor:'pointer', transition:'all 0.15s' }
const inp  = { background:'var(--bg3)', color:'var(--text)', border:'1px solid var(--border)', borderRadius:'6px', fontFamily:'var(--font)', fontSize:'13px', padding:'8px 12px', outline:'none' }
const lbl  = { display:'block', fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text2)', textTransform:'uppercase', marginBottom:'8px' }
