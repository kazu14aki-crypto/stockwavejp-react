import { useEffect, useState } from 'react'
const KEY='swjp_onboarding_v1_done'
const STEPS=[
  { icon:'①', title:'強いテーマを探す', text:'「テーマ一覧」で1週間を選び、市場超過騰落率と出来高の上位を確認します。' },
  { icon:'②', title:'一時的な上昇か確認する', text:'テーマ詳細で期間別推移、分布、構成銘柄を見て、特定1社だけの上昇ではないか確認します。' },
  { icon:'③', title:'個別銘柄を比較する', text:'業績、バリュエーション、流動性、開示資料を確認し、テーマの強さだけで売買しないようにします。' },
  { icon:'④', title:'継続性を追う', text:'レポートで前回ランキングの事後成績を確認し、継続・失速を判断します。' },
]
export default function FirstVisitTutorial({ onNavigate }) {
  const [open,setOpen]=useState(false); const [step,setStep]=useState(0)
  useEffect(()=>{ try { if(!localStorage.getItem(KEY)) setOpen(true) } catch {} },[])
  if(!open) return null
  const close=()=>{ try{localStorage.setItem(KEY,'1')}catch{}; setOpen(false) }
  const x=STEPS[step]
  return <div style={{position:'fixed',inset:0,zIndex:3000,background:'rgba(4,8,16,.78)',display:'grid',placeItems:'center',padding:'16px'}}>
    <div style={{width:'min(560px,100%)',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px',boxShadow:'0 24px 80px rgba(0,0,0,.45)'}}>
      <div style={{fontSize:'10px',color:'var(--accent)',fontWeight:800,letterSpacing:'.12em'}}>初回ガイド {step+1}/{STEPS.length}</div>
      <div style={{fontSize:'36px',margin:'14px 0 8px'}}>{x.icon}</div>
      <h2 style={{fontSize:'20px',color:'var(--text)',margin:'0 0 10px'}}>{x.title}</h2>
      <p style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.9,minHeight:'74px'}}>{x.text}</p>
      <div style={{display:'flex',gap:'6px',margin:'18px 0'}}>{STEPS.map((_,i)=><span key={i} style={{height:'4px',flex:1,borderRadius:'4px',background:i<=step?'var(--accent)':'var(--border)'}} />)}</div>
      <div style={{display:'flex',justifyContent:'space-between',gap:'8px'}}>
        <button onClick={close} style={b('transparent','var(--text3)')}>スキップ</button>
        <div style={{display:'flex',gap:'8px'}}>
          {step>0&&<button onClick={()=>setStep(step-1)} style={b('var(--bg3)','var(--text2)')}>戻る</button>}
          {step<STEPS.length-1?<button onClick={()=>setStep(step+1)} style={b('var(--accent)','#fff')}>次へ</button>:<button onClick={()=>{close();onNavigate?.('テーマ一覧')}} style={b('var(--accent)','#fff')}>テーマを探す</button>}
        </div>
      </div>
    </div>
  </div>
}
const b=(background,color)=>({padding:'9px 14px',borderRadius:'7px',border:'1px solid var(--border)',background,color,cursor:'pointer',fontFamily:'var(--font)',fontWeight:700})
