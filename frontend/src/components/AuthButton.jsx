/**
 * AuthButton — ヘッダー右側のログイン/ユーザーボタン
 */
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AuthButton() {
  const { isLoggedIn, loading, displayName, avatarUrl, signIn, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (loading) return (
    <div style={{ width:'28px', height:'28px', borderRadius:'50%',
      background:'var(--bg3)', flexShrink:0 }} />
  )

  if (!isLoggedIn) return (
    <button
      onClick={() => signIn()}
      title="Googleでログインするとカスタムテーマがどのデバイスでも同期されます"
      style={{
        display:'flex', alignItems:'center', gap:'6px',
        background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.3)',
        borderRadius:'6px', color:'var(--accent)', cursor:'pointer',
        fontFamily:'var(--font)', fontSize:'12px', fontWeight:600,
        padding:'5px 10px', whiteSpace:'nowrap', flexShrink:0,
        transition:'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(74,158,255,0.18)'}
      onMouseLeave={e => e.currentTarget.style.background='rgba(74,158,255,0.1)'}
    >
      <GoogleIcon />
      <span className="auth-btn-label">ログイン</span>
    </button>
  )

  // ログイン済み
  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      <button
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:'transparent', border:'1px solid var(--border)',
          borderRadius:'20px', cursor:'pointer', padding:'3px 10px 3px 3px',
          fontFamily:'var(--font)', transition:'all 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" width={22} height={22}
            style={{ borderRadius:'50%', flexShrink:0 }} />
        ) : (
          <div style={{ width:22, height:22, borderRadius:'50%',
            background:'var(--accent)', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'11px', color:'#fff', fontWeight:700 }}>
            {(displayName||'?')[0].toUpperCase()}
          </div>
        )}
        <span className="auth-btn-label" style={{ fontSize:'12px', color:'var(--text2)',
          maxWidth:'80px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {displayName?.split(' ')[0] || 'ユーザー'}
        </span>
      </button>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)}
            style={{ position:'fixed', inset:0, zIndex:998 }} />
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', right:0,
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'10px', padding:'8px', zIndex:999,
            minWidth:'180px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <div style={{ padding:'8px 12px 10px', borderBottom:'1px solid var(--border)', marginBottom:'4px' }}>
              <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text)',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {displayName}
              </div>
              <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'2px' }}>
                カスタムテーマを同期中
              </div>
            </div>
            <button onClick={() => { signOut(); setMenuOpen(false) }} style={{
              width:'100%', textAlign:'left', background:'none',
              border:'none', padding:'8px 12px', borderRadius:'6px',
              color:'var(--red)', fontSize:'13px', cursor:'pointer',
              fontFamily:'var(--font)', transition:'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,83,112,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='none'}
            >
              ログアウト
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
