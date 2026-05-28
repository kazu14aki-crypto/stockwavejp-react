/**
 * UpgradePlanButton.jsx — プランアップグレードボタン
 * Plan.jsxの各プランカードに配置
 */
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function UpgradePlanButton({ priceKey, label, color }) {
  const { user, isLoggedIn, signIn } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!isLoggedIn) { signIn(); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_key:   priceKey,
          user_id:     user.id,
          email:       user.email,
          success_url: 'https://stockwavejp.com',
          cancel_url:  'https://stockwavejp.com',
        }),
      })
      const { url } = await res.json()
      window.location.href = url  // Stripe Checkoutページへリダイレクト
    } catch (e) {
      alert('決済ページの読み込みに失敗しました。時間をおいて再試行してください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        width: '100%', padding: '12px',
        background: loading ? 'var(--bg3)' : color,
        color: '#fff', border: 'none', borderRadius: '8px',
        fontFamily: 'var(--font)', fontSize: '13px', fontWeight: 700,
        cursor: loading ? 'wait' : 'pointer',
        marginTop: '14px', transition: 'opacity 0.15s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? '読み込み中...' : isLoggedIn ? `${label}に申し込む` : 'ログインして申し込む'}
    </button>
  )
}
