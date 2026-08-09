import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useSubscription } from '../hooks/useSubscription.jsx'
import { supabase } from '../lib/supabase'

export const PENDING_TRIAL_START_KEY = 'swjp_pending_pro_trial_start'
const promptSeenKey = userId => `swjp_trial_prompt_seen_${userId}`

export default function FreeTrialPrompt() {
  const { user, loading } = useAuth()
  const { refreshSubscription } = useSubscription()
  const [legalReady, setLegalReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const handledUserId = useRef(null)

  const startTrial = async (autoStart = false) => {
    if (!user || user.user_metadata?.pro_trial_started_at) return
    setStarting(true)
    setError('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { pro_trial_started_at: new Date().toISOString() }
      })
      if (updateError) throw updateError
      sessionStorage.removeItem(PENDING_TRIAL_START_KEY)
      localStorage.setItem(promptSeenKey(user.id), 'started')
      refreshSubscription()
      setOpen(false)
    } catch (startError) {
      sessionStorage.removeItem(PENDING_TRIAL_START_KEY)
      setError(startError.message || '無料体験を開始できませんでした。時間をおいて再度お試しください。')
      if (autoStart) setOpen(true)
    } finally {
      setStarting(false)
    }
  }

  useEffect(() => {
    const markReady = () => setLegalReady(true)
    window.addEventListener('swjp-legal-consent-ready', markReady)
    return () => window.removeEventListener('swjp-legal-consent-ready', markReady)
  }, [])

  useEffect(() => {
    if (loading || !legalReady || !user || handledUserId.current === user.id) return
    handledUserId.current = user.id
    if (user.user_metadata?.pro_trial_started_at) return
    if (sessionStorage.getItem(PENDING_TRIAL_START_KEY) === '1') {
      startTrial(true)
      return
    }
    if (!localStorage.getItem(promptSeenKey(user.id))) setOpen(true)
  }, [loading, legalReady, user?.id])

  if (!open) return null

  const defer = () => {
    if (user) localStorage.setItem(promptSeenKey(user.id), 'deferred')
    setOpen(false)
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="free-trial-title" style={{ position:'fixed', inset:0, zIndex:1100, display:'grid', placeItems:'center', padding:'20px', background:'rgba(2,8,20,.68)' }}>
      <section style={{ width:'min(100%, 440px)', padding:'24px', borderRadius:'16px', border:'1px solid rgba(170,119,255,.55)', background:'linear-gradient(145deg, #142749, #21183e)', boxShadow:'0 24px 70px rgba(0,0,0,.45)' }}>
        <div style={{ fontSize:'30px', marginBottom:'10px' }}>🎁</div>
        <h2 id="free-trial-title" style={{ margin:'0 0 10px', color:'#f3efff', fontSize:'19px' }}>プロプラン無料体験のご案内</h2>
        <p style={{ margin:'0 0 16px', color:'var(--text2)', fontSize:'13px', lineHeight:1.8 }}>14日間、プロプランの全機能を無料でお試しいただけます。クレジットカード登録は不要で、終了後に自動課金されることはありません。</p>
        {error && <p role="alert" style={{ margin:'0 0 12px', color:'#ffb0a8', fontSize:'12px', lineHeight:1.7 }}>{error}</p>}
        <button type="button" onClick={() => startTrial(false)} disabled={starting} style={{ width:'100%', padding:'12px', border:0, borderRadius:'9px', background:'#aa77ff', color:'#fff', fontSize:'13px', fontWeight:800, cursor:starting ? 'wait' : 'pointer' }}>{starting ? '無料体験を開始しています…' : 'プロプラン無料体験を開始する（14日間）'}</button>
        <button type="button" onClick={defer} disabled={starting} style={{ width:'100%', marginTop:'9px', padding:'9px', border:0, background:'transparent', color:'var(--text3)', fontSize:'12px', cursor:starting ? 'wait' : 'pointer' }}>今回は開始しない</button>
      </section>
    </div>
  )
}
