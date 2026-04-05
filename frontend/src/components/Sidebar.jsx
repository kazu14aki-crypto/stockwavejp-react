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

  const sidebarStyle = {
    position: 'fixed',
    top: 'var(--header)',
    left: 0,          /* 常に左固定 */
    right: 'auto',
    bottom: 0,
    width: 'var(--sidebar)',
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    borderLeft: 'none',
    padding: '16px 8px',
    overflowY: 'auto',
    zIndex: 900,
    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
    transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
    boxShadow: isMobile && isOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
  }

  const NavBtn = ({ icon, label }) => {
    const isActive = currentPage === label
    return (
      <button onClick={() => onPageChange(label)} style={{
        padding: '9px 12px',
        fontSize: '13px',
        color: isActive ? 'var(--text)' : 'var(--text2)',
        borderRadius: '6px', marginBottom: '1px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
        letterSpacing: '-0.01em', fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
        borderRight: '2px solid transparent',
        borderTop: 'none', borderBottom: 'none',
        background: isActive ? 'rgba(74,158,255,0.1)' : 'transparent',
        width: '100%', textAlign: 'left', fontFamily: 'var(--font)',
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(74,158,255,0.06)'; e.currentTarget.style.color='#8aaad0' }}}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)' }}}
      >
        <span style={{ fontSize:'13px', opacity:0.7 }}>{icon}</span>{label}
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
