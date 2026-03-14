import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:8000'
const STORAGE_KEY = 'swjp_custom_themes_v2'

function loadThemes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveThemes(themes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes))
}

// 銘柄情報をyfinance APIで検索（バックエンド経由）
async function searchTicker(ticker) {
  try {
    const res  = await fetch(`${API}/api/stock-info/${encodeURIComponent(ticker)}`)
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

export default function CustomTheme() {
  const [themes,     setThemes]     = useState(loadThemes)
  const [mode,       setMode]       = useState('list') // 'list' | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null)   // 編集中テーマのindex

  // テーマ名入力
  const [themeName, setThemeName] = useState('')
  // 銘柄追加
  const [tickerInput, setTickerInput] = useState('')
  const [searching,   setSearching]   = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [searchError,  setSearchError]  = useState('')
  // 現在編集中の銘柄リスト
  const [stocks, setStocks] = useState([]) // [{ticker, name, price}]

  const persist = (updated) => { setThemes(updated); saveThemes(updated) }

  // 編集モード開始
  const startEdit = (i) => {
    const t = themes[i]
    setEditTarget(i)
    setThemeName(t.name)
    setStocks(t.stocks || [])
    setMode('edit')
    setSearchResult(null)
    setTickerInput('')
  }

  // 新規作成モード開始
  const startCreate = () => {
    setEditTarget(null)
    setThemeName('')
    setStocks([])
    setMode('create')
    setSearchResult(null)
    setTickerInput('')
  }

  // 銘柄検索
  const handleSearch = async () => {
    const t = tickerInput.trim().toUpperCase()
    if (!t) return
    // .T が付いていない場合は自動付与
    const ticker = t.endsWith('.T') || t.includes('^') || t.includes('=') ? t : t + '.T'
    setSearching(true)
    setSearchError('')
    setSearchResult(null)
    const data = await searchTicker(ticker)
    if (data && data.name) {
      setSearchResult({ ticker, name: data.name, price: data.price })
    } else {
      setSearchError(`「${ticker}」の情報が取得できませんでした。ティッカーコードを確認してください。`)
    }
    setSearching(false)
  }

  // 銘柄追加
  const addStock = (stock) => {
    if (stocks.find(s => s.ticker === stock.ticker)) {
      setSearchError('この銘柄はすでに追加されています')
      return
    }
    setStocks(prev => [...prev, stock])
    setSearchResult(null)
    setTickerInput('')
    setSearchError('')
  }

  // 銘柄削除
  const removeStock = (ticker) => setStocks(prev => prev.filter(s => s.ticker !== ticker))

  // 保存
  const handleSave = () => {
    if (!themeName.trim()) { alert('テーマ名を入力してください'); return }
    if (!stocks.length)    { alert('銘柄を1つ以上追加してください'); return }
    const theme = { name: themeName.trim(), stocks }
    if (mode === 'edit' && editTarget !== null) {
      const updated = themes.map((t, i) => i === editTarget ? theme : t)
      persist(updated)
    } else {
      persist([...themes, theme])
    }
    setMode('list')
  }

  // 削除
  const deleteTheme = (i) => {
    if (!window.confirm('このテーマを削除しますか？')) return
    persist(themes.filter((_, idx) => idx !== i))
  }

  // ── リスト表示 ──
  if (mode === 'list') {
    return (
      <div style={{ padding: '28px 32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>カスタムテーマ</h1>
          <button onClick={startCreate} style={btnPrimary}>＋ 新規作成</button>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '28px' }}>
          独自のテーマを作成して追跡できます。銘柄コードで検索して追加してください。
        </p>

        {themes.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎨</div>
            <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '20px' }}>まだカスタムテーマがありません</div>
            <button onClick={startCreate} style={btnPrimary}>最初のテーマを作成</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {themes.map((t, i) => (
              <div key={i} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{t.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {(t.stocks || []).map(s => (
                      <span key={s.ticker} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                        background: 'rgba(74,158,255,0.1)', color: 'var(--accent)',
                        border: '1px solid rgba(74,158,255,0.2)' }}>
                        {s.name || s.ticker}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                  {(t.stocks || []).length}銘柄
                </div>
                <button onClick={() => startEdit(i)} style={btnSecondary}>編集</button>
                <button onClick={() => deleteTheme(i)} style={btnDanger}>削除</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── 作成/編集フォーム ──
  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setMode('list')} style={{ background: 'none', border: 'none',
          color: 'var(--text2)', cursor: 'pointer', fontSize: '20px', padding: 0 }}>←</button>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
          {mode === 'edit' ? 'テーマを編集' : '新規テーマ作成'}
        </h1>
      </div>

      {/* テーマ名 */}
      <div style={formGroup}>
        <label style={formLabel}>テーマ名</label>
        <input value={themeName} onChange={e => setThemeName(e.target.value)}
          placeholder="例：AIロボット、防衛関連 など"
          style={{ ...inputStyle, width: '100%', maxWidth: '400px' }} />
      </div>

      {/* 銘柄検索 */}
      <div style={formGroup}>
        <label style={formLabel}>銘柄を追加</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="証券コード（例：6954 または 6954.T）"
            style={{ ...inputStyle, width: '260px' }}
          />
          <button onClick={handleSearch} disabled={searching || !tickerInput.trim()} style={{
            ...btnPrimary, opacity: (!tickerInput.trim() || searching) ? 0.5 : 1,
          }}>
            {searching ? '検索中...' : '🔍 検索'}
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '12px' }}>
          日本株は証券コード4桁（.T は自動付与）、米国株は AAPL・MSFT など
        </div>

        {/* 検索結果 */}
        {searchError && (
          <div style={{ fontSize: '12px', color: '#ff4560', marginBottom: '10px', padding: '8px 12px',
            background: 'rgba(255,69,96,0.08)', borderRadius: '6px', border: '1px solid rgba(255,69,96,0.2)' }}>
            {searchError}
          </div>
        )}
        {searchResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)',
            borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{searchResult.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                {searchResult.ticker}
                {searchResult.price && <span style={{ marginLeft: '12px', color: 'var(--text2)' }}>
                  ¥{searchResult.price.toLocaleString()}
                </span>}
              </div>
            </div>
            <button onClick={() => addStock(searchResult)} style={btnPrimary}>追加</button>
          </div>
        )}
      </div>

      {/* 追加済み銘柄一覧 */}
      {stocks.length > 0 && (
        <div style={formGroup}>
          <label style={formLabel}>追加済み銘柄（{stocks.length}銘柄）</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {stocks.map((s, i) => (
              <div key={s.ticker} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '8px 12px',
                animation: `fadeUp 0.2s ease ${i * 0.03}s both`,
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)', width: '80px' }}>
                  {s.ticker.replace('.T', '')}
                </span>
                <span style={{ flex: 1, fontSize: '13px', color: '#c0d0e8', fontWeight: 500 }}>{s.name}</span>
                {s.price && <span style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                  ¥{s.price.toLocaleString()}
                </span>}
                <button onClick={() => removeStock(s.ticker)} style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: '4px',
                  color: 'var(--text3)', cursor: 'pointer', padding: '3px 8px',
                  fontSize: '12px', fontFamily: 'var(--font)',
                }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 保存ボタン */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button onClick={handleSave} disabled={!themeName.trim() || !stocks.length} style={{
          ...btnPrimary,
          fontSize: '14px', padding: '10px 28px',
          opacity: (!themeName.trim() || !stocks.length) ? 0.4 : 1,
        }}>
          💾 {mode === 'edit' ? '変更を保存' : 'テーマを作成'}
        </button>
        <button onClick={() => setMode('list')} style={{ ...btnSecondary, fontSize: '14px', padding: '10px 20px' }}>
          キャンセル
        </button>
      </div>
    </div>
  )
}

const btnPrimary   = { background:'rgba(74,158,255,0.15)',color:'var(--accent)',border:'1px solid rgba(74,158,255,0.3)',borderRadius:'6px',fontFamily:'var(--font)',fontSize:'13px',padding:'7px 16px',cursor:'pointer',fontWeight:600,transition:'all 0.15s',whiteSpace:'nowrap' }
const btnSecondary = { background:'transparent',color:'var(--text2)',border:'1px solid var(--border)',borderRadius:'6px',fontFamily:'var(--font)',fontSize:'13px',padding:'7px 14px',cursor:'pointer',transition:'all 0.15s' }
const btnDanger    = { background:'rgba(255,69,96,0.1)',color:'#ff4560',border:'1px solid rgba(255,69,96,0.2)',borderRadius:'6px',fontFamily:'var(--font)',fontSize:'13px',padding:'7px 14px',cursor:'pointer',transition:'all 0.15s' }
const inputStyle   = { background:'var(--bg3)',color:'var(--text)',border:'1px solid rgba(74,120,200,0.2)',borderRadius:'6px',fontFamily:'var(--font)',fontSize:'13px',padding:'8px 12px',outline:'none' }
const formGroup    = { marginBottom:'24px' }
const formLabel    = { display:'block',fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'#ffffff',textTransform:'uppercase',marginBottom:'10px' }
