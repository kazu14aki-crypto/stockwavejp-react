export default function Settings({ viewMode, onViewModeChange, colorTheme, onColorThemeChange, colorDir, onColorDirChange }) {
  const Card = ({ children, style = {} }) => (
    <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',
      borderRadius:'var(--radius)',padding:'20px 24px',marginBottom:'16px', ...style }}>{children}</div>
  )
  const SLabel = ({ children }) => (
    <div style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'var(--text)',
      textTransform:'uppercase',marginBottom:'14px' }}>{children}</div>
  )

  const COLOR_THEMES = [
    { key:'dark',      label:'🌑 ブラック',       desc:'深いダーク（デフォルト）' },
    { key:'midnight',  label:'🌙 ミッドナイト',   desc:'深夜も疲れにくい青みダーク' },
    { key:'light',     label:'☀️ オフホワイト',   desc:'目に優しいライトモード' },
    { key:'sand',      label:'🏖 サンド',          desc:'温かみのあるベージュ' },
  ]

  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px',fontWeight:700,letterSpacing:'-0.02em',color:'var(--text)',marginBottom:'4px' }}>設定</h1>
      <p style={{ fontSize:'12px',color:'var(--text2)',marginBottom:'28px' }}>表示モードやデザインの設定を変更できます</p>

      {/* カラーテーマ */}
      <Card>
        <SLabel>カラーテーマ</SLabel>
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
              <span style={{ fontSize:'14px', color:'var(--text)', fontWeight:600 }}>{label}</span>
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{desc}</span>
              {colorTheme===key && (
                <span style={{ fontSize:'10px',color:'var(--accent)',fontWeight:600,marginTop:'4px' }}>✓ 適用中</span>
              )}
            </button>
          ))}
        </div>
        <p style={{ fontSize:'11px',color:'var(--text3)',marginTop:'12px' }}>
          ※ テーマはリロードなしで即時反映されます
        </p>
      </Card>

      {/* 上昇・下落カラー */}
      <Card>
        <SLabel>上昇・下落カラー</SLabel>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          {[
            { key:'jp', label:'🇯🇵 日本式',  desc:'上昇=赤 / 下落=緑（デフォルト）', up:'#e63030', down:'#1a9a50' },
            { key:'us', label:'🇺🇸 米国式',  desc:'上昇=緑 / 下落=赤',              up:'#1a9a50', down:'#e63030' },
          ].map(({ key, label, desc, up, down }) => (
            <button key={key} onClick={() => onColorDirChange?.(key)} style={{
              padding:'12px 20px', borderRadius:'8px', cursor:'pointer',
              border:`2px solid ${colorDir===key?'var(--accent)':'var(--border)'}`,
              background:colorDir===key?'rgba(74,158,255,0.1)':'var(--bg3)',
              fontFamily:'var(--font)', transition:'all 0.15s',
              display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'6px',
              minWidth:'160px',
            }}>
              <span style={{ fontSize:'14px', color:'var(--text)', fontWeight:600 }}>{label}</span>
              <span style={{ fontSize:'11px', color:'var(--text2)' }}>{desc}</span>
              <div style={{ display:'flex', gap:'8px', marginTop:'2px' }}>
                <span style={{ fontSize:'12px', background:up, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontWeight:700 }}>+2.5%</span>
                <span style={{ fontSize:'12px', background:down, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontWeight:700 }}>-1.8%</span>
              </div>
              {colorDir===key && <span style={{ fontSize:'10px',color:'var(--accent)',fontWeight:600 }}>✓ 適用中</span>}
            </button>
          ))}
        </div>
        <p style={{ fontSize:'11px',color:'var(--text3)',marginTop:'12px' }}>
          ※ 変更は即時反映されます
        </p>
      </Card>

      {/* 表示モード */}
      <Card>
        <SLabel>表示モード</SLabel>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
          {[{key:'auto',label:'🔄 自動'},{key:'pc',label:'🖥 PC'},{key:'mobile',label:'📱 スマホ'}].map(({key,label})=>(
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
          「自動」はブラウザの画面幅を検知してPC/スマホを自動判定します
        </p>
      </Card>


    </div>
  )
}
