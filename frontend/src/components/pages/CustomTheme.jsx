import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const STORAGE_KEY = 'swjp_custom_themes_v2'

function loadThemes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveThemes(themes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes))
}

// 驫俶氛諠・ｱ繧馳finance API縺ｧ讀懃ｴ｢・医ヰ繝・け繧ｨ繝ｳ繝臥ｵ檎罰・・async function searchTicker(ticker) {
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
  const [editTarget, setEditTarget] = useState(null)   // 邱ｨ髮・ｸｭ繝・・繝槭・index

  // 繝・・繝槫錐蜈･蜉・  const [themeName, setThemeName] = useState('')
  // 驫俶氛霑ｽ蜉
  const [tickerInput, setTickerInput] = useState('')
  const [searching,   setSearching]   = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [searchError,  setSearchError]  = useState('')
  // 迴ｾ蝨ｨ邱ｨ髮・ｸｭ縺ｮ驫俶氛繝ｪ繧ｹ繝・  const [stocks, setStocks] = useState([]) // [{ticker, name, price}]

  const persist = (updated) => { setThemes(updated); saveThemes(updated) }

  // 邱ｨ髮・Δ繝ｼ繝蛾幕蟋・  const startEdit = (i) => {
    const t = themes[i]
    setEditTarget(i)
    setThemeName(t.name)
    setStocks(t.stocks || [])
    setMode('edit')
    setSearchResult(null)
    setTickerInput('')
  }

  // 譁ｰ隕丈ｽ懈・繝｢繝ｼ繝蛾幕蟋・  const startCreate = () => {
    setEditTarget(null)
    setThemeName('')
    setStocks([])
    setMode('create')
    setSearchResult(null)
    setTickerInput('')
  }

  // 驫俶氛讀懃ｴ｢
  const handleSearch = async () => {
    const t = tickerInput.trim().toUpperCase()
    if (!t) return
    // .T 縺御ｻ倥＞縺ｦ縺・↑縺・ｴ蜷医・閾ｪ蜍穂ｻ倅ｸ・    const ticker = t.endsWith('.T') || t.includes('^') || t.includes('=') ? t : t + '.T'
    setSearching(true)
    setSearchError('')
    setSearchResult(null)
    const data = await searchTicker(ticker)
    if (data && data.name) {
      setSearchResult({ ticker, name: data.name, price: data.price })
    } else {
      setSearchError(`縲・{ticker}縲阪・諠・ｱ縺悟叙蠕励〒縺阪∪縺帙ｓ縺ｧ縺励◆縲ゅユ繧｣繝・き繝ｼ繧ｳ繝ｼ繝峨ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲Ａ)
    }
    setSearching(false)
  }

  // 驫俶氛霑ｽ蜉
  const addStock = (stock) => {
    if (stocks.find(s => s.ticker === stock.ticker)) {
      setSearchError('縺薙・驫俶氛縺ｯ縺吶〒縺ｫ霑ｽ蜉縺輔ｌ縺ｦ縺・∪縺・)
      return
    }
    setStocks(prev => [...prev, stock])
    setSearchResult(null)
    setTickerInput('')
    setSearchError('')
  }

  // 驫俶氛蜑企勁
  const removeStock = (ticker) => setStocks(prev => prev.filter(s => s.ticker !== ticker))

  // 菫晏ｭ・  const handleSave = () => {
    if (!themeName.trim()) { alert('繝・・繝槫錐繧貞・蜉帙＠縺ｦ縺上□縺輔＞'); return }
    if (!stocks.length)    { alert('驫俶氛繧・縺､莉･荳願ｿｽ蜉縺励※縺上□縺輔＞'); return }
    const theme = { name: themeName.trim(), stocks }
    if (mode === 'edit' && editTarget !== null) {
      const updated = themes.map((t, i) => i === editTarget ? theme : t)
      persist(updated)
    } else {
      persist([...themes, theme])
    }
    setMode('list')
  }

  // 蜑企勁
  const deleteTheme = (i) => {
    if (!window.confirm('縺薙・繝・・繝槭ｒ蜑企勁縺励∪縺吶°・・)) return
    persist(themes.filter((_, idx) => idx !== i))
  }

  // 笏笏 繝ｪ繧ｹ繝郁｡ｨ遉ｺ 笏笏
  if (mode === 'list') {
    return (
      <div style={{ padding: '28px 32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>繧ｫ繧ｹ繧ｿ繝繝・・繝・/h1>
          <button onClick={startCreate} style={btnPrimary}>・・譁ｰ隕丈ｽ懈・</button>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '28px' }}>
          迢ｬ閾ｪ縺ｮ繝・・繝槭ｒ菴懈・縺励※霑ｽ霍｡縺ｧ縺阪∪縺吶る釜譟・さ繝ｼ繝峨〒讀懃ｴ｢縺励※霑ｽ蜉縺励※縺上□縺輔＞縲・        </p>

        {themes.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>耳</div>
            <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '20px' }}>縺ｾ縺繧ｫ繧ｹ繧ｿ繝繝・・繝槭′縺ゅｊ縺ｾ縺帙ｓ</div>
            <button onClick={startCreate} style={btnPrimary}>譛蛻昴・繝・・繝槭ｒ菴懈・</button>
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
                  {(t.stocks || []).length}驫俶氛
                </div>
                <button onClick={() => startEdit(i)} style={btnSecondary}>邱ｨ髮・/button>
                <button onClick={() => deleteTheme(i)} style={btnDanger}>蜑企勁</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 笏笏 菴懈・/邱ｨ髮・ヵ繧ｩ繝ｼ繝 笏笏
  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setMode('list')} style={{ background: 'none', border: 'none',
          color: 'var(--text2)', cursor: 'pointer', fontSize: '20px', padding: 0 }}>竊・/button>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
          {mode === 'edit' ? '繝・・繝槭ｒ邱ｨ髮・ : '譁ｰ隕上ユ繝ｼ繝樔ｽ懈・'}
        </h1>
      </div>

      {/* 繝・・繝槫錐 */}
      <div style={formGroup}>
        <label style={formLabel}>繝・・繝槫錐</label>
        <input value={themeName} onChange={e => setThemeName(e.target.value)}
          placeholder="萓具ｼ哂I繝ｭ繝懊ャ繝医・亟陦幃未騾｣ 縺ｪ縺ｩ"
          style={{ ...inputStyle, width: '100%', maxWidth: '400px' }} />
      </div>

      {/* 驫俶氛讀懃ｴ｢ */}
      <div style={formGroup}>
        <label style={formLabel}>驫俶氛繧定ｿｽ蜉</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="險ｼ蛻ｸ繧ｳ繝ｼ繝会ｼ井ｾ具ｼ・954 縺ｾ縺溘・ 6954.T・・
            style={{ ...inputStyle, width: '260px' }}
          />
          <button onClick={handleSearch} disabled={searching || !tickerInput.trim()} style={{
            ...btnPrimary, opacity: (!tickerInput.trim() || searching) ? 0.5 : 1,
          }}>
            {searching ? '讀懃ｴ｢荳ｭ...' : '剥 讀懃ｴ｢'}
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '12px' }}>
          譌･譛ｬ譬ｪ縺ｯ險ｼ蛻ｸ繧ｳ繝ｼ繝・譯・ｼ・T 縺ｯ閾ｪ蜍穂ｻ倅ｸ趣ｼ峨∫ｱｳ蝗ｽ譬ｪ縺ｯ AAPL繝ｻMSFT 縺ｪ縺ｩ
        </div>

        {/* 讀懃ｴ｢邨先棡 */}
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
                  ﾂ･{searchResult.price.toLocaleString()}
                </span>}
              </div>
            </div>
            <button onClick={() => addStock(searchResult)} style={btnPrimary}>霑ｽ蜉</button>
          </div>
        )}
      </div>

      {/* 霑ｽ蜉貂医∩驫俶氛荳隕ｧ */}
      {stocks.length > 0 && (
        <div style={formGroup}>
          <label style={formLabel}>霑ｽ蜉貂医∩驫俶氛・・stocks.length}驫俶氛・・/label>
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
                  ﾂ･{s.price.toLocaleString()}
                </span>}
                <button onClick={() => removeStock(s.ticker)} style={{
                  background: 'none', border: '1px solid var(--border)', borderRadius: '4px',
                  color: 'var(--text3)', cursor: 'pointer', padding: '3px 8px',
                  fontSize: '12px', fontFamily: 'var(--font)',
                }}>笨・/button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 菫晏ｭ倥・繧ｿ繝ｳ */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button onClick={handleSave} disabled={!themeName.trim() || !stocks.length} style={{
          ...btnPrimary,
          fontSize: '14px', padding: '10px 28px',
          opacity: (!themeName.trim() || !stocks.length) ? 0.4 : 1,
        }}>
          沈 {mode === 'edit' ? '螟画峩繧剃ｿ晏ｭ・ : '繝・・繝槭ｒ菴懈・'}
        </button>
        <button onClick={() => setMode('list')} style={{ ...btnSecondary, fontSize: '14px', padding: '10px 20px' }}>
          繧ｭ繝｣繝ｳ繧ｻ繝ｫ
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
