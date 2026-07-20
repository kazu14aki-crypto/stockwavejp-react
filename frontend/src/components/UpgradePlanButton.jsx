import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useSubscription } from '../hooks/useSubscription.jsx'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
let backendWarmed = false
export function warmupBackend() {
  if (backendWarmed) return
  backendWarmed = true
  fetch(`${API}/api/ping`, { method:'GET' }).catch(() => {})
}

async function getAccessToken() {
  const { supabase } = await import('../lib/supabase')
  const { data:{ session } } = await supabase.auth.getSession()
  return session?.access_token || ''
}

export default function UpgradePlanButton({ priceKey, label, color, disabled }) {
  const { user, isLoggedIn, signIn } = useAuth()
  const { plan: currentPlan } = useSubscription()
  const [loading, setLoading] = useState(false)
  const targetPlan = priceKey.includes('pro') ? 'pro' : 'standard'
  const isActive = currentPlan === targetPlan
  const hasPaidSubscription = currentPlan === 'standard' || currentPlan === 'pro'

  if (disabled) return <div style={{marginTop:'14px',padding:'12px',textAlign:'center',background:'var(--bg3)',borderRadius:'8px',fontSize:'12px',color:'var(--text3)',fontFamily:'var(--font)'}}>近日公開予定</div>
  if (isActive) return <div style={{marginTop:'14px',padding:'10px',textAlign:'center',background:`${color}20`,border:`1px solid ${color}50`,borderRadius:'8px',fontSize:'12px',color,fontFamily:'var(--font)',fontWeight:700}}>✅ 現在のプラン</div>

  const openPortal = async () => {
    const token = await getAccessToken()
    const res = await fetch(`${API}/api/stripe/create-portal`, { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body:JSON.stringify({}) })
    const data = await res.json()
    if (!res.ok || !data.url) throw new Error(data.detail || '支払い管理ポータルを開けませんでした')
    window.location.assign(data.url)
  }

  const startCheckout = async () => {
    const token = await getAccessToken()
    const res = await fetch(`${API}/api/stripe/create-checkout`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
      body:JSON.stringify({price_key:priceKey,user_id:user.id,email:user.email,success_url:window.location.origin,cancel_url:window.location.origin})
    })
    const data = await res.json()
    if (!res.ok || !data.url) throw new Error(data.detail || data.error || '決済ページを開けませんでした')
    window.location.assign(data.url)
  }

  const handleClick = async () => {
    if (!isLoggedIn) { signIn(); return }
    setLoading(true)
    try {
      if (hasPaidSubscription) await openPortal()
      else await startCheckout()
    } catch (error) {
      window.alert(error.message || '処理に失敗しました。時間をおいて再試行してください。')
      setLoading(false)
    }
  }

  const actionLabel = hasPaidSubscription
    ? `支払い管理で${label}へ変更 →`
    : `${label}に申し込む →`

  return <div>
    <button onClick={handleClick} onMouseEnter={warmupBackend} disabled={loading} style={{width:'100%',padding:'12px',marginTop:'14px',background:loading?'var(--bg3)':color,color:'#fff',border:'none',borderRadius:'8px',fontFamily:'var(--font)',fontSize:'13px',fontWeight:700,cursor:loading?'wait':'pointer',opacity:loading ? .7 : 1,transition:'opacity .15s'}}>
      {loading ? '読み込み中...' : isLoggedIn ? actionLabel : '🔑 ログインして申し込む'}
    </button>
    {hasPaidSubscription && <div style={{fontSize:'10px',color:'var(--text3)',marginTop:'6px',lineHeight:1.6}}>※ 既存契約の変更はStripeの支払い管理画面で行います。新しい契約を重複作成しません。</div>}
  </div>
}
