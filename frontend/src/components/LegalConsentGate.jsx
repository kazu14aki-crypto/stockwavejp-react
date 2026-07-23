import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase'

export const LEGAL_VERSIONS={terms:'2026-07-23',privacy:'2026-07-23',disclaimer:'2026-07-23'}
const storageKey=id=>`swjp_legal_consent_${id}_${LEGAL_VERSIONS.terms}_${LEGAL_VERSIONS.privacy}_${LEGAL_VERSIONS.disclaimer}`

export default function LegalConsentGate({onNavigate}){
  const {user,loading}=useAuth()
  const [acceptedRecord,setAcceptedRecord]=useState(false)
  const [checked,setChecked]=useState(false)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  useEffect(()=>{
    let active=true
    const run=async()=>{
      if(!user)return
      if(localStorage.getItem(storageKey(user.id))==='accepted'){if(active)setAcceptedRecord(true);return}
      const {data,error}=await supabase.from('legal_consents').select('id').eq('user_id',user.id).eq('terms_version',LEGAL_VERSIONS.terms).eq('privacy_version',LEGAL_VERSIONS.privacy).eq('disclaimer_version',LEGAL_VERSIONS.disclaimer).limit(1)
      if(!active)return
      if(!error&&data?.length){localStorage.setItem(storageKey(user.id),'accepted');setAcceptedRecord(true)}
    }
    run().catch(()=>{})
    return()=>{active=false}
  },[user?.id])
  if(['#terms','#privacy','#disclaimer'].includes(location.hash)) return null
  if(loading||!user||acceptedRecord)return null
  const save=async()=>{
    if(!checked)return
    setSaving(true);setError('')
    const {error}=await supabase.from('legal_consents').insert({user_id:user.id,terms_version:LEGAL_VERSIONS.terms,privacy_version:LEGAL_VERSIONS.privacy,disclaimer_version:LEGAL_VERSIONS.disclaimer,locale:'ja',source:'first_login',user_agent:navigator.userAgent})
    if(error){setSaving(false);setError('同意記録を保存できませんでした。Supabaseのマイグレーション適用状況を確認してください。');return}
    localStorage.setItem(storageKey(user.id),'accepted');setAcceptedRecord(true)
  }
  const linkStyle={background:'none',border:'none',padding:0,color:'var(--accent)',cursor:'pointer',fontFamily:'var(--font)',textDecoration:'underline'}
  return <div style={{position:'fixed',inset:0,zIndex:5000,display:'grid',placeItems:'center',padding:'18px',background:'rgba(3,7,15,.84)',backdropFilter:'blur(6px)'}}><div style={{width:'min(560px,100%)',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',padding:'22px'}}><h2 style={{margin:'0 0 8px',fontSize:'20px',color:'var(--text)'}}>利用条件への同意</h2><p style={{fontSize:'12px',lineHeight:1.8,color:'var(--text2)'}}>アカウントを利用する前に、以下の文書を確認し、同意してください。</p><div style={{display:'flex',gap:'12px',flexWrap:'wrap',margin:'12px 0'}}><button style={linkStyle} onClick={()=>window.open(location.origin+'#terms','_blank','noopener')}>利用規約</button><button style={linkStyle} onClick={()=>window.open(location.origin+'#privacy','_blank','noopener')}>プライバシーポリシー</button><button style={linkStyle} onClick={()=>window.open(location.origin+'#disclaimer','_blank','noopener')}>免責事項</button></div><label style={{display:'flex',gap:'9px',padding:'12px',border:'1px solid var(--border)',borderRadius:'9px',fontSize:'12px',color:'var(--text2)'}}><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><span>3文書の内容を確認し、同意します。</span></label>{error&&<div style={{fontSize:'11px',color:'#ff647c',marginTop:'9px'}}>{error}</div>}<button disabled={!checked||saving} onClick={save} style={{width:'100%',marginTop:'14px',padding:'11px',border:0,borderRadius:'8px',background:checked?'var(--accent)':'var(--bg3)',color:checked?'#fff':'var(--text3)',fontWeight:700,cursor:checked?'pointer':'not-allowed'}}>{saving?'…':'同意して利用を開始'}</button></div></div>
}
