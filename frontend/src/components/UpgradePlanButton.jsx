import { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useSubscription } from '../hooks/useSubscription.jsx'
import { LEGAL_VERSIONS } from './LegalConsentGate.jsx'
import LegalDocumentReview from './LegalDocumentReview.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import LegalNotice from './pages/LegalNotice.jsx'
import { supabase } from '../lib/supabase'
const API = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname.includes('stockwavejp')
    ? 'https://stockwavejp-api.onrender.com'
    : 'http://127.0.0.1:8000'
)

async function freshToken() {
  const refreshed = await supabase.auth.refreshSession()
  if (!refreshed.error && refreshed.data?.session?.access_token) {
    return refreshed.data.session.access_token
  }
  const current = await supabase.auth.getSession()
  if (current.error) throw current.error
  const accessToken = current.data?.session?.access_token
  if (!accessToken) throw new Error('ログイン情報を確認できませんでした。再度ログインしてください。')
  return accessToken
}

async function warmupRequest() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    await fetch(`${API}/api/ping`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch {
    // Render may still be waking up. The checkout request retries once below.
  } finally {
    clearTimeout(timeout)
  }
}

export function warmupBackend() {
  warmupRequest()
}
export default function UpgradePlanButton({priceKey,label,color,disabled}){
 const {user,isLoggedIn,signIn}=useAuth();const {plan,status}=useSubscription();const [loading,setLoading]=useState(false);const [show,setShow]=useState(false);const [error,setError]=useState('')
 const documents=useMemo(()=>[
  {key:'terms',label:'利用規約',component:TermsOfService,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
  {key:'privacy',label:'プライバシーポリシー',component:PrivacyPolicy,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
  {key:'disclaimer',label:'免責事項',component:Disclaimer,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
  {key:'commerce',label:'特定商取引法に基づく表示',component:LegalNotice,scrollMessage:'文書の最後までスクロールしてください。',readMessage:'最後まで表示しました。内容を確認してチェックしてください。',checkLabel:'内容を確認しました',checkedLabel:'確認済み'},
 ],[])
 const target=priceKey.includes('pro')?'pro':'standard';const isActive=plan===target;const paid=['standard','pro'].includes(plan)
 if(disabled)return <div style={{marginTop:'14px',padding:'12px',textAlign:'center',background:'var(--bg3)',borderRadius:'8px',fontSize:'12px',color:'var(--text3)'}}>近日公開予定</div>
 const call=async(path,body={})=>{
  const requestOnce=async()=>{
   const controller=new AbortController()
   const timeout=setTimeout(()=>controller.abort(),45000)
   try{
    const accessToken=await freshToken()
    const response=await fetch(`${API}${path}`,{
     method:'POST',
     mode:'cors',
     cache:'no-store',
     headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${accessToken}`,
     },
     body:JSON.stringify(body),
     signal:controller.signal,
    })
    const raw=await response.text()
    let data={}
    try{data=raw?JSON.parse(raw):{}}catch{data={detail:raw}}
    if(!response.ok)throw new Error(data.detail||data.error||`処理に失敗しました（${response.status}）。`)
    return data
   }finally{
    clearTimeout(timeout)
   }
  }
  try{
   return await requestOnce()
  }catch(firstError){
   const retryable=firstError?.name==='AbortError'||firstError instanceof TypeError||/Failed to fetch|NetworkError|Load failed/i.test(firstError?.message||'')
   if(!retryable)throw firstError
   await warmupRequest()
   await new Promise(resolve=>setTimeout(resolve,1200))
   try{
    return await requestOnce()
   }catch(secondError){
    if(secondError?.name==='AbortError')throw new Error('バックエンドへの接続がタイムアウトしました。少し待って再度お試しください。')
    if(secondError instanceof TypeError||/Failed to fetch|NetworkError|Load failed/i.test(secondError?.message||'')){
     throw new Error('Stripe接続用APIに到達できませんでした。通信状態を確認し、少し待って再度お試しください。')
    }
    throw secondError
   }
  }
 }
 const checkout=async()=>{
  setLoading(true);setError('')
  try{
   await warmupRequest()
   const d=await call('/api/stripe/create-checkout',{price_key:priceKey,user_id:user.id,email:user.email,success_url:location.origin,cancel_url:location.origin,legal_consent:true,terms_version:LEGAL_VERSIONS.terms,privacy_version:LEGAL_VERSIONS.privacy,disclaimer_version:LEGAL_VERSIONS.disclaimer})
   if(d.resumed){location.reload();return}
   location.assign(d.url)
  }catch(e){setError(e.message);setLoading(false)}
 }
 const click=async()=>{if(!isLoggedIn){signIn();return};if(isActive&&status==='canceling'){setLoading(true);try{await call('/api/stripe/resume-subscription');location.reload()}catch(e){alert(e.message)}finally{setLoading(false)};return};if(paid){setLoading(true);try{const d=await call('/api/stripe/create-portal');location.assign(d.url)}catch(e){alert(e.message)}finally{setLoading(false)};return};setShow(true)}
 if(isActive&&status!=='canceling')return <div style={{marginTop:'14px',padding:'10px',textAlign:'center',background:`${color}20`,border:`1px solid ${color}50`,borderRadius:'8px',fontSize:'12px',color,fontWeight:700}}>✅ 現在のプラン</div>
 return <div>{show&&<LegalDocumentReview documents={documents} title="有料プラン申込みの確認" description="利用規約、プライバシーポリシー、免責事項、特定商取引法表示を順番に最後まで確認してください。" completeLabel="同意してStripeへ進む" completingLabel="保存中…" cancelLabel="戻る" onCancel={()=>{if(!loading){setShow(false);setError('')}}} onComplete={checkout} saving={loading} error={error}/>}<button onClick={click} onMouseEnter={warmupBackend} disabled={loading} style={{width:'100%',padding:'12px',marginTop:'14px',background:loading?'var(--bg3)':color,color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:700,cursor:loading?'wait':'pointer'}}>{loading?'読み込み中…':!isLoggedIn?'🔑 ログインして申し込む':isActive&&status==='canceling'?'解約予約を取り消して継続':paid?'支払い管理で変更 →':`${label} に申し込む →`}</button></div>
}
