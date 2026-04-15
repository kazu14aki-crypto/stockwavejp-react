import { useEffect, useRef } from 'react'

export default function Sidebar({ pages, pagesOther, currentPage, onPageChange, isOpen, isMobile, onOpen, onClose, contactUrl }) {
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  useEffect(() => {
    if (!isMobile) return
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }
    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current || 0))
      if (Math.abs(dx) < 70 || dy > Math.abs(dx) * 0.6) { touchStartX.current = null; return }
      if (dx > 70 && touchStartX.current < 40 && !isOpen)  { onOpen?.() }
      else if (dx > 130 && !isOpen)                         { onOpen?.() }
      else if (dx < -70 && isOpen)                          { onClose?.() }
      touchStartX.current = null
    }
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend',   handleTouchEnd,   { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend',   handleTouchEnd)
    }
  }, [isMobile, isOpen, onOpen, onClose])

  // スマホ時は画面幅の75%（最小240px・最大280px）、PCは固定220px
  const sidebarWidth = isMobile ? 'min(280px, 75vw)' : 'var(--sidebar)'

  const sidebarStyle = {
    position: 'fixed',
    top: 'var(--header)',
    left: 0,
    right: 'auto',
    bottom: 0,
    width: sidebarWidth,
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    borderLeft: 'none',
    padding: isMobile ? '12px 6px' : '16px 8px',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 900,
    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
    transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
    boxShadow: isMobile && isOpen ? '6px 0 24px rgba(0,0,0,0.4)' : 'none',
    WebkitOverflowScrolling: 'touch',
  }

  const NavBtn = ({ icon, label }) => {
    const isActive = currentPage === label
    return (
      <button onClick={() => onPageChange(label)} style={{
        // スマホ: タップしやすいよう縦幅を大きく（最低44px = Apple HIG推奨）
        padding: isMobile ? '11px 10px' : '7px 10px',
        minHeight: isMobile ? '44px' : 'auto',
        fontSize: '12px',
        color: isActive ? 'var(--text)' : 'var(--text2)',
        borderRadius: '6px', marginBottom: '2px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
        letterSpacing: '-0.01em', fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
        borderRight: 'none', borderTop: 'none', borderBottom: 'none',
        background: isActive ? 'rgba(74,158,255,0.12)' : 'transparent',
        width: '100%', textAlign: 'left', fontFamily: 'var(--font)',
        transition: 'all 0.15s',
        overflow: 'hidden',
      }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(74,158,255,0.06)'; e.currentTarget.style.color='#8aaad0' }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)' }}}
      >
        <span style={{ fontSize:'13px', opacity:0.75, flexShrink:0, width:'18px', textAlign:'center' }}>{icon}</span>
        <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:1 }}>{label}</span>
      </button>
    )
  }

  const SLabel = ({ children }) => (
    <div style={{ fontSize:'9px', fontWeight:600, letterSpacing:'0.2em', color:'var(--text3)', textTransform:'uppercase', padding:'0 10px', margin:'16px 0 6px' }}>
      {children}
    </div>
  )

  return (
    <nav style={sidebarStyle}>
      <SLabel>MENU</SLabel>
      {pages.map(({ icon, label }) => <NavBtn key={label} icon={icon} label={label} />)}
      <SLabel>OTHER</SLabel>
      {pagesOther.map(({ icon, label }) => <NavBtn key={label} icon={icon} label={label} />)}
      {contactUrl && (
        <a href={contactUrl} target="_blank" rel="noopener noreferrer" style={{
          display:'flex', alignItems:'center', gap:'8px',
          padding:'9px 12px', fontSize:'13px', color:'var(--text2)',
          borderRadius:'6px', marginBottom:'1px',
          borderLeft:'2px solid transparent', borderRight:'2px solid transparent',
          borderTop:'none', borderBottom:'none',
          background:'transparent', textDecoration:'none', fontFamily:'var(--font)',
          transition:'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(74,158,255,0.06)'; e.currentTarget.style.color='#8aaad0' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)' }}
        >
          <span style={{ fontSize:'13px', opacity:0.7 }}>✉️</span>お問い合わせ
        </a>
      )}
    </nav>
  )
}
