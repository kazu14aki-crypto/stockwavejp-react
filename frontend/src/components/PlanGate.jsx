/**
 * PlanGate — 特定プランのみアクセス可能なコンポーネント
 * 
 * 使い方:
 *   <PlanGate feature="institutional" onNavigate={onNavigate}>
 *     <InstitutionalHoldings ... />
 *   </PlanGate>
 */
import { useAuth }         from '../hooks/useAuth.jsx'
import { useSubscription } from '../hooks/useSubscription.jsx'

const FEATURE_LABELS = {
  institutional:      { name:'機関投資家大量保有情報', requiredPlan:'プロ', requiredKey:'pro' },
  weekly_archive:     { name:'週次レポートアーカイブ',  requiredPlan:'スタンダード以上', requiredKey:'standard' },
  custom_theme_ai:    { name:'カスタムテーマAI分析',  requiredPlan:'プロ', requiredKey:'pro' },
}

export default function PlanGate({ feature, children, onNavigate }) {
  const { isLoggedIn, signIn } = useAuth()
  const { canAccess, plan }    = useSubscription()

  // アクセス可能なら素通し
  if (canAccess(feature)) return children

  const info = FEATURE_LABELS[feature] || { name:'この機能', requiredPlan:'上位プラン' }

  return (
    <div style={{ padding:'40px 24px', textAlign:'center', maxWidth:'500px', margin:'0 auto' }}>
      <div style={{ fontSize:'48px', marginBottom:'16px' }}>🔒</div>
      <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
        {info.name}
      </h2>
      <p style={{ fontSize:'13px', color:'var(--text3)', lineHeight:1.8, marginBottom:'24px' }}>
        この機能は<strong style={{ color:'var(--accent)' }}>{info.requiredPlan}</strong>でのみご利用いただけます。
        {!isLoggedIn && <>\nご利用には<strong>Googleログイン</strong>が必要です。</>}
      </p>
      {!isLoggedIn ? (
        <button onClick={signIn} style={{
          padding:'12px 28px', background:'var(--accent)', color:'#fff',
          border:'none', borderRadius:'10px', cursor:'pointer',
          fontFamily:'var(--font)', fontSize:'14px', fontWeight:700,
          marginBottom:'12px', display:'block', width:'100%', maxWidth:'280px', margin:'0 auto 12px',
        }}>
          🔑 Googleでログイン
        </button>
      ) : (
        <button onClick={() => onNavigate?.('プラン・料金')} style={{
          padding:'12px 28px', background:'var(--accent)', color:'#fff',
          border:'none', borderRadius:'10px', cursor:'pointer',
          fontFamily:'var(--font)', fontSize:'14px', fontWeight:700,
          display:'block', width:'100%', maxWidth:'280px', margin:'0 auto 12px',
        }}>
          💰 プランをアップグレード
        </button>
      )}
      <button onClick={() => onNavigate?.('プラン・料金')} style={{
        background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
        fontFamily:'var(--font)', fontSize:'12px', textDecoration:'underline',
      }}>
        プランの詳細を見る
      </button>
    </div>
  )
}
