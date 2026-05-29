/**
 * useSubscription — サブスクリプション状態管理
 * 
 * プラン種別:
 *   'free'     → Free（未ログイン or サブスクなし）
 *   'standard' → スタンダード（月額¥980 or 年額¥9,800）
 *   'pro'      → プロ（月額¥1,980 or 年額¥19,800）
 *   'dev'      → 開発者（全機能解放）
 *
 * 機能制限:
 *   機関投資家保有 → pro のみ
 *   週次レポートアーカイブ → standard以上
 *   カスタムテーマ分析（AI） → pro のみ
 */
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

// 開発者メールアドレス（全機能解放）
const DEV_EMAILS = [
  'stockwavejp26@gmail.com',
]

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const [plan,      setPlan]      = useState('free')   // 'free' | 'standard' | 'pro' | 'dev'
  const [loading,   setLoading]   = useState(true)
  const [expiresAt, setExpiresAt] = useState(null)

  useEffect(() => {
    let cancelled = false

    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          if (!cancelled) { setPlan('free'); setLoading(false) }
          return
        }

        const email = session.user.email

        // 開発者チェック（常に全機能解放）
        if (DEV_EMAILS.includes(email)) {
          if (!cancelled) { setPlan('dev'); setLoading(false) }
          return
        }

        // ③ 初回ログインから30日間はProプラン体験版
        const userMeta = session.user.user_metadata || {}
        const firstLoginAt = userMeta.first_login_at
        if (!firstLoginAt) {
          // 初回ログイン日時を記録
          await supabase.auth.updateUser({
            data: { first_login_at: new Date().toISOString() }
          }).catch(() => {})
          if (!cancelled) { setPlan('pro_trial'); setLoading(false) }
          return
        }
        const daysSinceFirst = (Date.now() - new Date(firstLoginAt).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceFirst < 30) {
          if (!cancelled) { setPlan('pro_trial'); setLoading(false) }
          return
        }

        // Supabaseのsubscriptionsテーブルから状態取得
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan, status, current_period_end, stripe_subscription_id')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error || !data) {
          if (!cancelled) { setPlan('free'); setLoading(false) }
          return
        }

        // 有効期限チェック
        const expiry = data.current_period_end ? new Date(data.current_period_end) : null
        const isValid = expiry ? expiry > new Date() : true

        if (isValid) {
          if (!cancelled) {
            setPlan(data.plan || 'free')
            setExpiresAt(expiry)
            setLoading(false)
          }
        } else {
          if (!cancelled) { setPlan('free'); setLoading(false) }
        }
      } catch {
        if (!cancelled) { setPlan('free'); setLoading(false) }
      }
    }

    checkSubscription()

    // ログイン状態変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true)
      checkSubscription()
    })

    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  const value = {
    plan,
    loading,
    expiresAt,
    // 便利なbooleanヘルパー
    isFree:     plan === 'free',
    isStandard: ['standard','pro','pro_trial','dev'].includes(plan),
    isPro:      ['pro','pro_trial','dev'].includes(plan),
    isDev:      plan === 'dev',
    // 機能アクセス判定
    canAccess: (feature) => {
      const rules = {
        'weekly_archive':      ['standard', 'pro', 'pro_trial', 'dev'],
        'institutional':       ['pro', 'pro_trial', 'dev'],
        'custom_theme_ai':     ['pro', 'pro_trial', 'dev'],
        'multiple_alerts':     ['pro', 'pro_trial', 'dev'],
        'portfolio_analysis':  ['pro', 'pro_trial', 'dev'],
      }
      return rules[feature]?.includes(plan) ?? true
    },
    planLabel: {
      free:'Free', standard:'スタンダード', pro:'プロ', pro_trial:'プロ体験版（無料）', dev:'開発者'
    }[plan] || 'Free',
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
