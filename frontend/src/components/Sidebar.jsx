export default function Sidebar({ pages, pagesOther, currentPage, onPageChange, isOpen, isMobile }) {
  // ⑥ スマホは右側表示
  const sidebarStyle = {
    position: 'fixed',
    top: 'var(--header)',
    bottom: 0,
    width: 'var(--sidebar)',
    background: 'var(--bg2)',
    padding: '16px 8px',
    overflowY: 'auto',
    zIndex: 900,
    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
    // PCは左固定、スマホは右側
    ...(isMobile ? {
      right: 0,
      left: 'auto',
      borderLeft: '1px solid var(--border)',
      borderRight: 'none',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      boxShadow: isOpen ? '-4px 0 20px rgba(0,0,0,0.3)' : 'none',
    } : {
      left: 0,
      right: 'auto',
      borderRight: '1px solid var(--border)',
      borderLeft: 'none',
      transform: 'translateX(0)',
    }),
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
        borderLeft: isActive && !isMobile ? '2px solid var(--accent)' : '2px solid transparent',
        borderRight: isActive && isMobile  ? '2px solid var(--accent)' : '2px solid transparent',
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
    </nav>
  )
}
