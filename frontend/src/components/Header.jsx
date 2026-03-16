const LogoSvg = () => (
  <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
    <line x1="28" y1="4"  x2="28" y2="10" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="42" y1="9"  x2="38" y2="14" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="14" y1="9"  x2="18" y2="14" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="50" y1="21" x2="45" y2="23" stroke="#e63030" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="6"  y1="21" x2="11" y2="23" stroke="#e63030" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11,31 A17,17 0 0,1 45,31" fill="none" stroke="#e63030" strokeWidth="2.5"/>
    <circle cx="28" cy="31" r="5.5" fill="#e63030"/>
    <line x1="3"  y1="31" x2="11" y2="31" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="45" y1="31" x2="53" y2="31" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3,43 Q9,36 15,43 Q21,50 27,43 Q33,36 39,43 Q45,50 51,43"
      stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
)

export default function Header({ status, onMenuClick, sidebarOpen, viewMode, onViewModeChange, onLogoClick }) {
  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--header)',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', zIndex: 1000,
        minWidth: 0,  /* 見切れ防止 */
      }}>
        {/* 左側 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* スマホ用ハンバーガー（左上） */}
          <button onClick={onMenuClick} className="hamburger-btn" style={{
            display: 'none',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '6px', color: 'var(--text)', fontSize: '15px',
            padding: '4px 9px', cursor: 'pointer', fontFamily: 'var(--font)',
            flexShrink: 0,
          }}>
            {sidebarOpen ? '✕' : '☰'}
          </button>

          {/* ロゴ */}
          <button onClick={onLogoClick} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            flexShrink: 0,
          }}>
            <LogoSvg />
            <div style={{ textAlign: 'left' }} className="logo-text">
              <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1, color: 'var(--text)' }}>
                <span style={{ color: '#e63030' }}>Stock</span>Wave
                <span style={{ color: '#e63030', fontSize: '10px', marginLeft: '2px' }}>JP</span>
              </div>
              <div style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'var(--text3)', fontWeight: 600, marginTop: '1px' }}>
                株　式　波　動
              </div>
            </div>
          </button>
        </div>

        {/* 右側 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* 市場ステータス */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="status-area">
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block', flexShrink: 0,
              background: status.is_open ? 'var(--green)' : 'var(--text3)',
              boxShadow: status.is_open ? '0 0 7px var(--green)' : 'none',
            }} />
            <span className="status-label" style={{ fontSize: '11px', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
              {status.label}
            </span>
          </div>

          {/* 時刻 */}
          <span className="status-time" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
            {status.time}
          </span>

          {/* PC/SP切替（常時表示・見切れなし） */}
          <div style={{
            display: 'flex', gap: '2px', flexShrink: 0,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '2px',
          }}>
            {[{ key: 'pc', label: '🖥' }, { key: 'mobile', label: '📱' }].map(({ key, label }) => (
              <button key={key} onClick={() => onViewModeChange(key)} style={{
                padding: '3px 9px', borderRadius: '4px', fontSize: '12px',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                background: viewMode === key ? 'var(--accent)' : 'transparent',
                color: viewMode === key ? '#fff' : 'var(--text3)',
                transition: 'all 0.15s', flexShrink: 0,
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display: block !important; }
          .status-label  { display: none !important; }
          .status-time   { display: none !important; }
          .logo-text     { display: none !important; }
        }
        @media (max-width: 400px) {
          .status-area   { display: none !important; }
        }
      `}</style>
    </>
  )
}
