export default function Settings({ viewMode, onViewModeChange, colorTheme, onColorThemeChange }) {
  const Card = ({ children, style = {} }) => (
    <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',
      borderRadius:'var(--radius)',padding:'20px 24px',marginBottom:'16px', ...style }}>{children}</div>
  )
  const SLabel = ({ children }) => (
    <div style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'#ffffff',
      textTransform:'uppercase',marginBottom:'14px' }}>{children}</div>
  )

  const COLOR_THEMES = [
    { key:'dark',  label:'倦 繝悶Λ繝・け', desc:'繝繝ｼ繧ｯ繝｢繝ｼ繝会ｼ医ョ繝輔か繝ｫ繝茨ｼ・ },
    { key:'navy',  label:'穴 繝阪う繝薙・', desc:'豺ｱ縺・ヶ繝ｫ繝ｼ邉ｻ繝繝ｼ繧ｯ繝・・繝・ },
    { key:'light', label:'笘・・繝帙Ρ繧､繝・, desc:'繝ｩ繧､繝医Δ繝ｼ繝・ },
  ]

  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px',fontWeight:700,letterSpacing:'-0.02em',color:'#ffffff',marginBottom:'4px' }}>險ｭ螳・/h1>
      <p style={{ fontSize:'12px',color:'var(--text2)',marginBottom:'28px' }}>陦ｨ遉ｺ繝｢繝ｼ繝峨ｄ繝・じ繧､繝ｳ縺ｮ險ｭ螳壹ｒ螟画峩縺ｧ縺阪∪縺・/p>

      {/* 繧ｫ繝ｩ繝ｼ繝・・繝・*/}
      <Card>
        <SLabel>繧ｫ繝ｩ繝ｼ繝・・繝・/SLabel>
        <div style={{ display:'flex',gap:'12px',flexWrap:'wrap' }}>
          {COLOR_THEMES.map(({ key, label, desc }) => (
            <button key={key} onClick={() => onColorThemeChange(key)} style={{
              padding:'12px 20px', borderRadius:'8px', cursor:'pointer',
              border:`2px solid ${colorTheme===key?'var(--accent)':'var(--border)'}`,
              background:colorTheme===key?'rgba(74,158,255,0.1)':'var(--bg3)',
              fontFamily:'var(--font)', transition:'all 0.15s',
              display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'4px',
              minWidth:'140px',
            }}>
              <span style={{ fontSize:'14px', color:'#ffffff', fontWeight:600 }}>{label}</span>
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{desc}</span>
              {colorTheme===key && (
                <span style={{ fontSize:'10px',color:'var(--accent)',fontWeight:600,marginTop:'4px' }}>笨・驕ｩ逕ｨ荳ｭ</span>
              )}
            </button>
          ))}
        </div>
        <p style={{ fontSize:'11px',color:'var(--text3)',marginTop:'12px' }}>
          窶ｻ 繝・・繝槭・繝ｪ繝ｭ繝ｼ繝峨↑縺励〒蜊ｳ譎ょ渚譏縺輔ｌ縺ｾ縺・        </p>
      </Card>

      {/* 陦ｨ遉ｺ繝｢繝ｼ繝・*/}
      <Card>
        <SLabel>陦ｨ遉ｺ繝｢繝ｼ繝・/SLabel>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
          {[{key:'auto',label:'売 閾ｪ蜍・},{key:'pc',label:'箕 PC'},{key:'mobile',label:'導 繧ｹ繝槭・'}].map(({key,label})=>(
            <button key={key} onClick={()=>onViewModeChange(key)} style={{
              padding:'8px 20px',borderRadius:'6px',fontSize:'13px',cursor:'pointer',
              border:`1px solid ${viewMode===key?'var(--accent)':'var(--border)'}`,
              background:viewMode===key?'rgba(74,158,255,0.12)':'transparent',
              color:viewMode===key?'var(--accent)':'var(--text2)',
              fontFamily:'var(--font)',fontWeight:viewMode===key?600:400,transition:'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <p style={{ fontSize:'11px',color:'var(--text3)',marginTop:'10px' }}>
          縲瑚・蜍輔阪・繝悶Λ繧ｦ繧ｶ縺ｮ逕ｻ髱｢蟷・ｒ讀懃衍縺励※PC/繧ｹ繝槭・繧定・蜍募愛螳壹＠縺ｾ縺・        </p>
      </Card>

      {/* 謗･邯壽ュ蝣ｱ */}
      <Card>
        <SLabel>謗･邯壽ュ蝣ｱ</SLabel>
        <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px' }}>
          <span style={{ fontSize:'12px',color:'var(--text2)' }}>繝舌ャ繧ｯ繧ｨ繝ｳ繝陰PI:</span>
          <code style={{ fontSize:'12px',color:'var(--accent)',background:'rgba(74,158,255,0.08)',
            padding:'3px 8px',borderRadius:'4px',fontFamily:'var(--mono)' }}>
            http://127.0.0.1:8000
          </code>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <span style={{ fontSize:'12px',color:'var(--text2)' }}>繧ｹ繝槭・縺九ｉ繧｢繧ｯ繧ｻ繧ｹ:</span>
          <code style={{ fontSize:'12px',color:'#7ed957',background:'rgba(126,217,87,0.08)',
            padding:'3px 8px',borderRadius:'4px',fontFamily:'var(--mono)' }}>
            http://192.168.x.x:5173
          </code>
        </div>
      </Card>

      {/* 繝舌・繧ｸ繝ｧ繝ｳ */}
      <Card>
        <SLabel>繝舌・繧ｸ繝ｧ繝ｳ諠・ｱ</SLabel>
        <div style={{ fontSize:'13px',color:'var(--text2)',lineHeight:2 }}>
          <div>StockWaveJP React迚・<span style={{ color:'var(--accent)',fontFamily:'var(--mono)' }}>v1.0.0</span></div>
          <div>繝輔Ο繝ｳ繝医お繝ｳ繝・ <span style={{ color:'var(--text3)' }}>React + Vite</span></div>
          <div>繝舌ャ繧ｯ繧ｨ繝ｳ繝・ <span style={{ color:'var(--text3)' }}>FastAPI + yfinance</span></div>
        </div>
      </Card>
    </div>
  )
}
