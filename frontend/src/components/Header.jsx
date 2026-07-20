import AuthButton from './AuthButton'

const LogoSvg = () => (
  <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
    <line x1="28" y1="4" x2="28" y2="10" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="42" y1="9" x2="38" y2="14" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="14" y1="9" x2="18" y2="14" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="50" y1="21" x2="45" y2="23" stroke="#e63030" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="6" y1="21" x2="11" y2="23" stroke="#e63030" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11,31 A17,17 0 0,1 45,31" fill="none" stroke="#e63030" strokeWidth="2.5"/>
    <circle cx="28" cy="31" r="5.5" fill="#e63030"/>
    <line x1="3" y1="31" x2="11" y2="31" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="45" y1="31" x2="53" y2="31" stroke="#e63030" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M3,43 Q9,36 15,43 Q21,50 27,43 Q33,36 39,43 Q45,50 51,43" stroke="var(--text)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
)

function formatDateTime(value, short = false) {
  if (!value) return short ? '未定' : '未定'
  const d = new Date(value)
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString('ja-JP', short
      ? { hour:'2-digit', minute:'2-digit' }
      : { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' })
  }
  const text = String(value)
  const full = text.match(/(?:\d{4}[/-])?(\d{1,2})[/-](\d{1,2})\s+(\d{1,2}):(\d{2})/)
  if (full) return short ? `${full[3].padStart(2,'0')}:${full[4]}` : `${full[1]}/${full[2]} ${full[3].padStart(2,'0')}:${full[4]}`
  const time = text.match(/(\d{1,2}):(\d{2})/)
  return time ? `${time[1].padStart(2,'0')}:${time[2]}` : text.slice(0, short ? 8 : 16)
}

export default function Header({ status = {}, onMenuClick, sidebarOpen, viewMode, onViewModeChange, onLogoClick }) {
  const updatedAt = status.updatedAt || status.updated_at || status.fetchedAt
  const dataAsOf = status.dataAsOf || status.data_as_of || status.updatedAt || status.updated_at
  const nextUpdate = status.nextUpdate || status.nextUpdateAt || status.next_update_at
  const infoColor = status.dataState === 'failed' ? '#ff647c' : 'var(--text3)'
  const timeTitle = `更新時間：${formatDateTime(updatedAt)}／基準時間：${formatDateTime(dataAsOf)}／次回更新予定：${formatDateTime(nextUpdate)}`

  return <>
    <header style={{position:'fixed',top:0,left:0,right:0,height:'var(--header)',background:'var(--bg2)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px',zIndex:1000,minWidth:0}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0,minWidth:0}}>
        <button onClick={onMenuClick} className="hamburger-btn" aria-label="メニューを開く" style={{display:'none',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--text)',fontSize:'16px',width:'34px',height:'34px',padding:0,cursor:'pointer',fontFamily:'var(--font)',flexShrink:0,alignItems:'center',justifyContent:'center',lineHeight:1}}>{sidebarOpen?'✕':'☰'}</button>
        <button onClick={onLogoClick} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0}}>
          <LogoSvg/>
          <div style={{textAlign:'left'}} className="logo-text">
            <div className="logo-main" style={{fontSize:'16px',fontWeight:700,letterSpacing:'-0.01em',lineHeight:1.1,color:'var(--text)'}}><span style={{color:'#e63030'}}>Stock</span>Wave<span style={{color:'#e63030',fontSize:'10px',marginLeft:'2px'}}>JP</span></div>
            <div className="logo-sub" style={{fontSize:'7px',letterSpacing:'0.3em',color:'var(--text3)',fontWeight:600,marginTop:'1px'}}>株　式　波　動</div>
          </div>
        </button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0,minWidth:0}}>
        <div className="market-status" style={{display:'flex',alignItems:'center',gap:'6px',minWidth:0}}>
          <span style={{width:'7px',height:'7px',borderRadius:'50%',display:'inline-block',flexShrink:0,background:status.is_open?'var(--green)':'var(--text3)',boxShadow:status.is_open?'0 0 7px var(--green)':'none'}}/>
          <span className="status-label" style={{fontSize:'11px',color:'var(--text2)',whiteSpace:'nowrap'}}>{status.label||'市場情報確認中'}</span>
          <div className="data-time-desktop" title={timeTitle} style={{display:'flex',alignItems:'center',gap:'5px',whiteSpace:'nowrap'}}>
            {[['更新時間',updatedAt],['基準時間',dataAsOf],['次回予定',nextUpdate]].map(([label,value]) => (
              <span key={label} style={{fontSize:'9px',color:infoColor,padding:'2px 5px',borderRadius:'4px',background:'var(--bg3)',border:'1px solid var(--border)'}}>{label} {formatDateTime(value)}</span>
            ))}
          </div>
          <div className="data-time-mobile" title={timeTitle} style={{display:'none',flexDirection:'column',lineHeight:1.35,whiteSpace:'nowrap',padding:'2px 4px',borderRadius:'4px',background:'var(--bg3)',border:'1px solid var(--border)'}}>
            <span style={{fontSize:'7.5px',color:infoColor}}>更新時間 {formatDateTime(updatedAt,true)}</span>
            <span style={{fontSize:'7.5px',color:infoColor}}>基準時間 {formatDateTime(dataAsOf,true)}</span>
            <span style={{fontSize:'7.5px',color:infoColor}}>次回予定 {formatDateTime(nextUpdate,true)}</span>
          </div>
        </div>
        <div className="view-switcher" style={{display:'flex',gap:'2px',flexShrink:0,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'6px',padding:'2px'}}>
          {[{key:'pc',label:'🖥'},{key:'mobile',label:'📱'}].map(({key,label}) => <button key={key} onClick={()=>onViewModeChange(key)} style={{padding:'3px 9px',borderRadius:'4px',fontSize:'12px',border:'none',cursor:'pointer',fontFamily:'var(--font)',background:viewMode===key?'var(--accent)':'transparent',color:viewMode===key?'#fff':'var(--text3)',transition:'all 0.15s',flexShrink:0}}>{label}</button>)}
        </div>
        <AuthButton/>
      </div>
    </header>
    <style>{`
      @media (max-width:1280px){.hamburger-btn{display:flex!important}}
      @media (max-width:980px){.status-label{display:none!important}.logo-sub{display:none!important}}
      @media (max-width:760px){.data-time-desktop{display:none!important}.data-time-mobile{display:flex!important}.auth-btn-label{display:none!important}}
      @media (max-width:600px){.view-switcher{display:none!important}.logo-main{font-size:13px!important}}
      @media (max-width:460px){.logo-text{display:none!important}.market-status{gap:3px!important}}
    `}</style>
  </>
}
