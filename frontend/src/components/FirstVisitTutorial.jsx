import { useEffect, useState } from 'react'

const KEY = 'swjp_v3_onboarding_v1_shown'
const COOKIE = 'swjp_onboarding_v1_shown'
const STEPS = [
  { icon:'①', title:'強いテーマを探す', text:'「テーマ一覧」で1週間を選び、表示指標を「市場超過騰落率」に切り替えて、TOPIXより強いテーマを探します。' },
  { icon:'②', title:'一時的な上昇か確認する', text:'「テーマ別詳細」で出来高、成績分布、構成銘柄を確認し、特定1社だけが平均を押し上げていないかを見ます。' },
  { icon:'③', title:'個別銘柄を比較する', text:'構成銘柄表と「銘柄検索」を使い、業績、バリュエーション、流動性、企業開示を比較します。' },
  { icon:'④', title:'継続性を追う', text:'「レポート」の週次レポートで前回ランキングの事後成績を確認し、テーマが継続しているか失速したかを追います。' },
]

function hasSeenGuide() {
  try {
    if (localStorage.getItem(KEY) === '1') return true
  } catch {}
  try {
    return document.cookie.split(';').some(v => v.trim() === `${COOKIE}=1`)
  } catch { return false }
}

function rememberGuideShown() {
  try { localStorage.setItem(KEY, '1') } catch {}
  try { document.cookie = `${COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax` } catch {}
}

export default function FirstVisitTutorial({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (hasSeenGuide()) return
    // 「完了したか」ではなく「一度表示したか」を保存する。
    // ページを途中で閉じても、次回アクセス時に再表示しない。
    rememberGuideShown()
    setOpen(true)
  }, [])

  if (!open) return null
  const close = () => setOpen(false)
  const current = STEPS[step]

  return <div role="dialog" aria-modal="true" aria-label="StockWaveJP初回ガイド" style={{position:'fixed',inset:0,zIndex:3000,background:'rgba(4,8,16,.78)',display:'grid',placeItems:'center',padding:'16px'}}>
    <div style={{width:'min(560px,100%)',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px',boxShadow:'0 24px 80px rgba(0,0,0,.45)'}}>
      <div style={{fontSize:'10px',color:'var(--accent)',fontWeight:800,letterSpacing:'.12em'}}>初回ガイド {step+1}/{STEPS.length}</div>
      <div style={{fontSize:'36px',margin:'14px 0 8px'}}>{current.icon}</div>
      <h2 style={{fontSize:'20px',color:'var(--text)',margin:'0 0 10px'}}>{current.title}</h2>
      <p style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.9,minHeight:'74px'}}>{current.text}</p>
      <div style={{display:'flex',gap:'6px',margin:'18px 0'}}>{STEPS.map((_,i)=><span key={i} style={{height:'4px',flex:1,borderRadius:'4px',background:i<=step?'var(--accent)':'var(--border)'}} />)}</div>
      <div style={{display:'flex',justifyContent:'space-between',gap:'8px'}}>
        <button onClick={close} style={buttonStyle('transparent','var(--text3)')}>閉じる</button>
        <div style={{display:'flex',gap:'8px'}}>
          {step>0 && <button onClick={()=>setStep(step-1)} style={buttonStyle('var(--bg3)','var(--text2)')}>戻る</button>}
          {step<STEPS.length-1
            ? <button onClick={()=>setStep(step+1)} style={buttonStyle('var(--accent)','#fff')}>次へ</button>
            : <button onClick={()=>{ close(); onNavigate?.('テーマ一覧') }} style={buttonStyle('var(--accent)','#fff')}>テーマ一覧を見る</button>}
        </div>
      </div>
    </div>
  </div>
}

const buttonStyle = (background,color) => ({padding:'9px 14px',borderRadius:'7px',border:'1px solid var(--border)',background,color,cursor:'pointer',fontFamily:'var(--font)',fontWeight:700})
