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
      stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
)

export default function Header({ status, onMenuClick, sidebarOpen, viewMode, onViewModeChange }) {
  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--header)',
        background: 'rgba(7,11,20,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 1000,
      }}>

        {/* 蟾ｦ蛛ｴ・壹せ繝槭・譎ゅ・繝上Φ繝舌・繧ｬ繝ｼ縲￣C譎ゅ・繝ｭ繧ｴ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 繧ｹ繝槭・逕ｨ繝｡繝九Η繝ｼ繝懊ち繝ｳ・亥ｷｦ荳奇ｼ・*/}
          <button
            onClick={onMenuClick}
            className="hamburger-btn"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid #2a2e40',
              borderRadius: '6px',
              color: 'var(--text)',
              fontSize: '16px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            {sidebarOpen ? '笨・ : '笘ｰ'}
          </button>

          {/* 繝ｭ繧ｴ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoSvg />
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                <span style={{ color: '#e63030' }}>Stock</span>
                <span style={{ color: '#ffffff' }}>Wave</span>
                <span style={{ color: '#e63030', fontSize: '11px', marginLeft: '2px' }}>JP</span>
              </div>
              <div style={{ fontSize: '7px', letterSpacing: '0.4em', color: '#1e3050', fontWeight: 600, marginTop: '1px' }}>
                譬ｪ縲蠑上豕｢縲蜍・              </div>
            </div>
          </div>
        </div>

        {/* 蜿ｳ蛛ｴ・壹せ繝・・繧ｿ繧ｹ繝ｻ譎ょ綾繝ｻPC/繧ｹ繝槭・蛻・崛 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 蟶ょｴ繧ｹ繝・・繧ｿ繧ｹ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text3)' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: status.is_open ? 'var(--green)' : '#556080',
              boxShadow: status.is_open ? '0 0 8px var(--green)' : 'none',
              display: 'inline-block',
            }} />
            <span className="status-label">{status.label}</span>
          </div>

          {/* 譎ょ綾 */}
          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text3)' }}>
            {status.time}
          </span>

          {/* PC / 繧ｹ繝槭・蛻・崛繝懊ち繝ｳ・亥ｸｸ譎り｡ｨ遉ｺ・・*/}
          <div style={{
            display: 'flex', gap: '2px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: '6px', padding: '2px',
          }}>
            {[
              { key: 'pc',     label: '箕 PC' },
              { key: 'mobile', label: '導 SP' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onViewModeChange(key)}
                style={{
                  padding: '3px 10px', borderRadius: '4px', fontSize: '11px',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                  background: viewMode === key ? 'rgba(74,158,255,0.2)' : 'transparent',
                  color: viewMode === key ? 'var(--accent)' : 'var(--text3)',
                  fontWeight: viewMode === key ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
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
        }
      `}</style>
    </>
  )
}
