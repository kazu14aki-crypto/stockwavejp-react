/**
 * AddToThemeModal — 銘柄をカスタムテーマに追加するミニモーダル
 * ThemeDetail・MarketRankの銘柄テーブル各行から呼び出す
 */
import { useState } from 'react'
import { useCustomThemes } from '../hooks/useCustomThemes'

export default function AddToThemeModal({ stock, onClose }) {
  const { themes, addStockToTheme, createThemeWithStock } = useCustomThemes()
  const [newName, setNewName] = useState('')
  const [mode, setMode]       = useState('select') // 'select' | 'create'
  const [done, setDone]       = useState(false)
  const [msg,  setMsg]        = useState('')

  const handleAdd = (idx) => {
    addStockToTheme(idx, stock)
    setMsg(`「${themes[idx].name}」に追加しました`)
    setDone(true)
    setTimeout(onClose, 1200)
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    createThemeWithStock(newName.trim(), stock)
    setMsg(`「${newName.trim()}」を作成して追加しました`)
    setDone(true)
    setTimeout(onClose, 1200)
  }

  return (
    <>
      {/* オーバーレイ */}
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:900,
      }}/>
      {/* モーダル本体 */}
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'12px', padding:'20px 24px', zIndex:901,
        width:'clamp(280px, 90vw, 380px)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
      }}>
        {/* ヘッダー */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'14px' }}>
          <div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'2px' }}>
              カスタムテーマに追加
            </div>
            <div style={{ fontSize:'11px', color:'var(--text3)' }}>
              {stock.ticker.replace('.T','')} · {stock.name}
            </div>
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none', color:'var(--text3)',
            cursor:'pointer', fontSize:'16px', padding:'0 0 0 8px', lineHeight:1,
          }}>✕</button>
        </div>

        {done ? (
          <div style={{ textAlign:'center', padding:'16px 0', fontSize:'13px',
            color:'var(--green)', fontWeight:600 }}>
            ✓ {msg}
          </div>
        ) : (
          <>
            {/* タブ */}
            <div style={{ display:'flex', gap:'4px', marginBottom:'14px' }}>
              {[['select','既存テーマへ追加'],['create','新規テーマを作成']].map(([k,l]) => (
                <button key={k} onClick={() => setMode(k)} style={{
                  flex:1, padding:'6px', borderRadius:'6px', fontSize:'11px',
                  fontWeight:600, cursor:'pointer', fontFamily:'var(--font)',
                  border: mode===k ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: mode===k ? 'rgba(74,158,255,0.12)' : 'transparent',
                  color: mode===k ? 'var(--accent)' : 'var(--text3)',
                }}>{l}</button>
              ))}
            </div>

            {mode === 'select' ? (
              themes.length === 0 ? (
                <div style={{ textAlign:'center', padding:'16px', fontSize:'12px', color:'var(--text3)' }}>
                  カスタムテーマがありません。<br/>「新規テーマを作成」から追加できます。
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'5px', maxHeight:'200px', overflowY:'auto' }}>
                  {themes.map((t, i) => {
                    const alreadyIn = t.stocks?.some(s => s.ticker === stock.ticker)
                    return (
                      <button key={i} onClick={() => !alreadyIn && handleAdd(i)} style={{
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'9px 12px', borderRadius:'7px', cursor: alreadyIn ? 'default' : 'pointer',
                        background: alreadyIn ? 'rgba(255,255,255,0.03)' : 'var(--bg3)',
                        border:'1px solid var(--border)', fontFamily:'var(--font)',
                        opacity: alreadyIn ? 0.5 : 1, transition:'all 0.12s',
                      }}
                        onMouseEnter={e => !alreadyIn && (e.currentTarget.style.borderColor='rgba(74,158,255,0.35)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}>
                        <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{t.name}</span>
                        <span style={{ fontSize:'10px', color: alreadyIn ? 'var(--text3)' : 'var(--accent)', fontWeight:600 }}>
                          {alreadyIn ? '追加済み' : `＋ 追加（${(t.stocks||[]).length}銘柄）`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            ) : (
              <div>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>
                  新しいテーマ名
                </div>
                <div style={{ display:'flex', gap:'6px' }}>
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="例：注目銘柄、マイポートフォリオ"
                    autoFocus
                    style={{
                      flex:1, background:'var(--bg3)', color:'var(--text)',
                      border:'1px solid var(--border)', borderRadius:'6px',
                      fontFamily:'var(--font)', fontSize:'13px', padding:'7px 10px', outline:'none',
                    }}
                  />
                  <button onClick={handleCreate} disabled={!newName.trim()} style={{
                    padding:'7px 14px', borderRadius:'6px', fontSize:'13px',
                    fontWeight:600, cursor:'pointer', fontFamily:'var(--font)',
                    background:'rgba(74,158,255,0.15)', color:'var(--accent)',
                    border:'1px solid rgba(74,158,255,0.3)',
                    opacity: newName.trim() ? 1 : 0.4,
                  }}>作成</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
