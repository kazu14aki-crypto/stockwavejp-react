import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase'
import LegalDocumentReview from './LegalDocumentReview.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'

export const LEGAL_VERSIONS = {
  terms: '2026-08-04',
  privacy: '2026-08-04',
  disclaimer: '2026-08-04',
}
const storageKey=id=>`swjp_legal_consent_${id}_${LEGAL_VERSIONS.terms}_${LEGAL_VERSIONS.privacy}_${LEGAL_VERSIONS.disclaimer}`

export default function LegalConsentGate(){
  const {user,loading}=useAuth()
  const [acceptedRecord,setAcceptedRecord]=useState(false)
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  const documents=useMemo(()=>[
    {key:'terms',label:'利用規約',component:TermsOfService,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
    {key:'privacy',label:'プライバシーポリシー',component:PrivacyPolicy,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
    {key:'disclaimer',label:'免責事項',component:Disclaimer,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
  ],[])
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
  useEffect(()=>{
    if(acceptedRecord) window.dispatchEvent(new Event('swjp-legal-consent-ready'))
  },[acceptedRecord])
  if(['#terms','#privacy','#disclaimer'].includes(location.hash))return null
  if(loading||!user||acceptedRecord)return null
  const save=async()=>{
    setSaving(true);setError('')
    const {error}=await supabase.from('legal_consents').insert({user_id:user.id,terms_version:LEGAL_VERSIONS.terms,privacy_version:LEGAL_VERSIONS.privacy,disclaimer_version:LEGAL_VERSIONS.disclaimer,locale:'ja',source:'first_login',user_agent:navigator.userAgent})
    if(error){setSaving(false);setError('同意記録を保存できませんでした。Supabaseの設定を確認してください。');return}
    localStorage.setItem(storageKey(user.id),'accepted');setAcceptedRecord(true)
  }
  return <LegalDocumentReview documents={documents} title="利用条件への同意" description="各文書を最後までスクロールし、内容を確認した文書から順にチェックしてください。" completeLabel="同意して利用を開始" completingLabel="保存中…" onComplete={save} saving={saving} error={error}/>
}
