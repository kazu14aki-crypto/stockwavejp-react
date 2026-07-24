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
const API=import.meta.env.VITE_API_URL||'http://127.0.0.1:8000'
async function token(){const {data:{session}}=await supabase.auth.getSession();return session?.access_token||''}
export function warmupBackend(){fetch(`${API}/api/ping`).catch(()=>{})}
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
 const call=async(path,body={})=>{const r=await fetch(`${API}${path}`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${await token()}`},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.detail||d.error||'処理に失敗しました。');return d}
 const checkout=async()=>{
  setLoading(true);setError('')
  try{
   const {error:consentError}=await supabase.from('legal_consents').insert({user_id:user.id,terms_version:LEGAL_VERSIONS.terms,privacy_version:LEGAL_VERSIONS.privacy,disclaimer_version:LEGAL_VERSIONS.disclaimer,locale:'ja',source:'subscription_checkout',user_agent:navigator.userAgent})
   if(consentError)throw new Error('同意記録を保存できませんでした。')
   const d=await call('/api/stripe/create-checkout',{price_key:priceKey,user_id:user.id,email:user.email,success_url:location.origin,cancel_url:location.origin,legal_consent:true,terms_version:LEGAL_VERSIONS.terms,privacy_version:LEGAL_VERSIONS.privacy,disclaimer_version:LEGAL_VERSIONS.disclaimer})
   if(d.resumed){location.reload();return}
   location.assign(d.url)
  }catch(e){setError(e.message);setLoading(false)}
 }
 const click=async()=>{if(!isLoggedIn){signIn();return};if(isActive&&status==='canceling'){setLoading(true);try{await call('/api/stripe/resume-subscription');location.reload()}catch(e){alert(e.message)}finally{setLoading(false)};return};if(paid){setLoading(true);try{const d=await call('/api/stripe/create-portal');location.assign(d.url)}catch(e){alert(e.message)}finally{setLoading(false)};return};setShow(true)}
 if(isActive&&status!=='canceling')return <div style={{marginTop:'14px',padding:'10px',textAlign:'center',background:`${color}20`,border:`1px solid ${color}50`,borderRadius:'8px',fontSize:'12px',color,fontWeight:700}}>✅ 現在のプラン</div>
 return <div>{show&&<LegalDocumentReview documents={documents} title="有料プラン申込みの確認" description="利用規約、プライバシーポリシー、免責事項、特定商取引法表示を順番に最後まで確認してください。" completeLabel="同意してStripeへ進む" completingLabel="保存中…" cancelLabel="戻る" onCancel={()=>{if(!loading){setShow(false);setError('')}}} onComplete={checkout} saving={loading} error={error}/>}<button onClick={click} onMouseEnter={warmupBackend} disabled={loading} style={{width:'100%',padding:'12px',marginTop:'14px',background:loading?'var(--bg3)':color,color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:700,cursor:loading?'wait':'pointer'}}>{loading?'読み込み中…':!isLoggedIn?'🔑 ログインして申し込む':isActive&&status==='canceling'?'解約予約を取り消して継続':paid?'支払い管理で変更 →':`${label} に申し込む →`}</button></div>
}
