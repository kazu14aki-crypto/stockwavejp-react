import { useState } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'
import { useAuth }         from '../../hooks/useAuth.jsx'

export default function Settings({ viewMode, onViewModeChange, colorTheme, onColorThemeChange, isMobile, onNavigate }) {
  const { plan, planLabel, isPro, isStandard, expiresAt } = useSubscription()
  const { isLoggedIn, user } = useAuth()
  const [cancelling,  setCancelling]  = useState(false)
  const [cancelDone,  setCancelDone]  = useState(false)
  const [cancelError, setCancelError] = useState(null)

  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const Card = ({ children, style = {} }) => (
    <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',
      borderRadius:'var(--radius)',padding:'20px 24px',marginBottom:'16px', ...style }}>
      {children}
    </div>
  )
  const SLabel = ({ children }) => (
    <div style={{ fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',color:'var(--text3)',
      textTransform:'uppercase',marginBottom:'14px' }}>{children}</div>
  )

  const COLOR_THEMES = [
    { key:'dark',  label:'🌑 ダーク', desc:'ダークモード（デフォルト）' },
    { key:'light', label:'☀️ ライト', desc:'ライトモード' },
  ]

  const VIEW_MODES = [
    { key:'auto',   label:'🖥️ 自動',   desc:'画面幅で自動判定' },
    { key:'mobile', label:'📱 スマホ', desc:'スマホ表示に固定' },
    { key:'pc',     label:'💻 PC',    desc:'PC表示に固定' },
  ]

  const COLOR_DIRS = [
    { key:'jp', label:'日本式', desc:'上昇＝赤 / 下落＝緑（デフォルト）' },
    { key:'us', label:'米国式', desc:'上昇＝緑 / 下落＝赤' },
  ]

  const colorDir = localStorage.getItem('swjp_color_dir') || 'jp'
  const setColorDir = (v) => {
    localStorage.setItem('swjp_color_dir', v)
    window.dispatchEvent(new Event('storage'))
  }

  // プランラベル色
  const planColor = { free:'#4a9eff', standard:'#ff8c42', pro:'#aa77ff', pro_trial:'#aa77ff', dev:'#00c48c' }[plan] || '#4a9eff'

  // 解約処理
  const handleCancel = async () => {
    if (!window.confirm('サブスクリプションを解約しますか？\n残りの契約期間は引き続きご利用いただけます。')) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await fetch(`${API}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || '解約処理に失敗しました')
      setCancelDone(true)
    } catch (e) {
      setCancelError(e.message)
    } finally {
      setCancelling(false)
    }
  }

  const btnBase = {
    padding:'10px 18px', borderRadius:'8px', cursor:'pointer',
    fontFamily:'var(--font)', fontSize:'13px', fontWeight:700,
    transition:'opacity 0.15s',
  }

  return (
    <div style={{ padding:'20px 16px 60px', maxWidth:'700px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px',fontWeight:700,color:'var(--text)',marginBottom:'20px' }}>⚙️ 設定</h1>

      {/* ── 現在のプラン ── */}
      <Card>
        <SLabel>💰 現在のプラン</SLabel>
        {isLoggedIn ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px', flexWrap:'wrap' }}>
              <span style={{ fontSize:'20px', fontWeight:800, color:planColor }}>{planLabel}</span>
              {plan === 'pro_trial' && (
                <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px',
                  background:'rgba(170,119,255,0.15)', color:'#aa77ff', border:'1px solid rgba(170,119,255,0.3)' }}>
                  初回14日無料体験中 — 終了日：{expiresAt ? expiresAt.toLocaleDateString('ja-JP') : '確認中'}
                </span>
              )}
            </div>
            <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'14px' }}>
              {plan === 'free' && 'Freeプラン：基本機能をご利用いただけます。'}
              {plan === 'standard' && 'スタンダードプラン：月額980円。全期間・全アーカイブにアクセスできます。'}
              {plan === 'pro' && 'プロプラン：月額1,980円。全機能・機関投資家情報にアクセスできます。'}
              {plan === 'pro_trial' && 'プロプラン無料体験中。期間終了後はFreeプランに自動移行します。'}
              {plan === 'dev' && '開発者アカウント：全機能利用可能。'}
            </div>

            {/* プラン変更ボタン */}
            {(plan === 'free' || plan === 'pro_trial') && (
              <button onClick={() => onNavigate?.('プラン・料金')}
                style={{ ...btnBase, background:'var(--accent)', color:'#fff', border:'none', marginBottom:'10px' }}>
                💰 有料プランに申し込む
              </button>
            )}

            {/* 解約ボタン */}
            {(plan === 'standard' || plan === 'pro' || plan === 'pro_trial') && !cancelDone && (
              <div style={{ marginTop:'8px', padding:'14px', background:'rgba(255,100,100,0.08)',
                border:'1px solid rgba(255,100,100,0.25)', borderRadius:'10px' }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'#ff6464', marginBottom:'8px' }}>
                  サブスクリプションの解約
                </div>
                <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'10px', lineHeight:1.7 }}>
                  解約後も<strong>契約期間の終了日まで</strong>引き続きご利用いただけます。<br/>
                  次回更新日以降は自動的にFreeプランに移行します。
                </div>
                {cancelError && (
                  <div style={{ fontSize:'12px', color:'#ff4560', marginBottom:'8px' }}>
                    ⚠️ {cancelError}
                  </div>
                )}
                <button onClick={handleCancel} disabled={cancelling}
                  style={{ ...btnBase, background:'rgba(255,100,100,0.15)', color:'#ff6464',
                    border:'1px solid rgba(255,100,100,0.4)', opacity: cancelling ? 0.6 : 1 }}>
                  {cancelling ? '処理中...' : '🔴 サブスクリプションを解約する'}
                </button>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px', lineHeight:1.7 }}>
                  ※ 解約後も<strong>契約期間の終了日まで</strong>引き続きご利用いただけます。<br/>
                  ※ 無料体験期間中に加入した場合、加入時点から有料契約が開始されています。
                </div>
              </div>
            )}

            {cancelDone && (
              <div style={{ padding:'14px', background:'rgba(0,196,140,0.08)',
                border:'1px solid rgba(0,196,140,0.3)', borderRadius:'10px', fontSize:'13px', color:'#00c48c' }}>
                ✅ 解約が完了しました。契約期間の終了日まで引き続きご利用いただけます。
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize:'13px', color:'var(--text3)', lineHeight:1.7 }}>
            Googleアカウントでログインすると、プランの管理やカスタムテーマのクラウド同期ができます。<br/>
            <button onClick={() => onNavigate?.('プラン・料金')}
              style={{ marginTop:'10px', ...btnBase, background:'var(--accent)', color:'#fff', border:'none' }}>
              プランを見る
            </button>
          </div>
        )}
      </Card>

      {/* ── 支払い方法の変更 ── */}
      {(plan === 'standard' || plan === 'pro') && (
        <Card>
          <SLabel>💳 支払い方法・請求情報</SLabel>
          <div style={{ fontSize:'13px', color:'var(--text3)', lineHeight:1.7, marginBottom:'12px' }}>
            支払い方法の変更、請求履歴の確認は Stripe Customer Portal からご対応ください。
          </div>
          <button onClick={async () => {
            try {
              const res = await fetch(`${API}/api/stripe/create-portal`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ user_id: user?.id })
              })
              const d = await res.json()
              if (d.url) window.open(d.url, '_blank')
              else alert('ポータルの読み込みに失敗しました')
            } catch { alert('ポータルの読み込みに失敗しました') }
          }}
            style={{ ...btnBase, background:'rgba(74,158,255,0.1)', color:'var(--accent)',
              border:'1px solid rgba(74,158,255,0.3)' }}>
            🔗 支払い管理ポータルを開く
          </button>
        </Card>
      )}

      {/* ── カラーテーマ ── */}
      <Card>
        <SLabel>🎨 カラーテーマ</SLabel>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {COLOR_THEMES.map(t => (
            <button key={t.key} onClick={() => onColorThemeChange?.(t.key)}
              style={{ ...btnBase,
                background: colorTheme===t.key ? 'rgba(74,158,255,0.15)' : 'transparent',
                color: colorTheme===t.key ? 'var(--accent)' : 'var(--text2)',
                border: colorTheme===t.key ? '1px solid rgba(74,158,255,0.4)' : '1px solid var(--border)',
              }}>
              {t.label}
              {colorTheme===t.key && <span style={{ marginLeft:'6px', fontSize:'10px' }}>適用中</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* ── 上昇下落カラー ── */}
      <Card>
        <SLabel>📈 上昇・下落カラー</SLabel>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'12px' }}>
          {COLOR_DIRS.map(d => (
            <button key={d.key} onClick={() => setColorDir(d.key)}
              style={{ ...btnBase,
                background: colorDir===d.key ? 'rgba(74,158,255,0.15)' : 'transparent',
                color: colorDir===d.key ? 'var(--accent)' : 'var(--text2)',
                border: colorDir===d.key ? '1px solid rgba(74,158,255,0.4)' : '1px solid var(--border)',
              }}>
              {d.label}
              {colorDir===d.key && <span style={{ marginLeft:'6px', fontSize:'10px' }}>適用中</span>}
            </button>
          ))}
        </div>
        {/* ④ 上昇下落カラーの例 */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'10px' }}>
          <div style={{ fontSize:'12px', color:'var(--text3)', marginRight:'8px', lineHeight:'28px' }}>表示例：</div>
          <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
            <span style={{
              padding:'3px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:700,
              color: colorDir === 'us' ? '#4ade80' : '#f87171',
              background: colorDir === 'us' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
            }}>▲ +2.5%</span>
            <span style={{ fontSize:'11px', color:'var(--text3)' }}>上昇</span>
          </div>
          <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
            <span style={{
              padding:'3px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:700,
              color: colorDir === 'us' ? '#f87171' : '#4ade80',
              background: colorDir === 'us' ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)',
            }}>▼ -1.8%</span>
            <span style={{ fontSize:'11px', color:'var(--text3)' }}>下落</span>
          </div>
        </div>
        <div style={{ fontSize:'11px', color:'var(--text3)' }}>
          ※ 変更は即時反映されます
        </div>
      </Card>

      {/* ── 表示モード ── */}
      <Card>
        <SLabel>🖥️ 表示モード</SLabel>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {VIEW_MODES.map(m => (
            <button key={m.key} onClick={() => onViewModeChange?.(m.key)}
              style={{ ...btnBase,
                background: viewMode===m.key ? 'rgba(74,158,255,0.15)' : 'transparent',
                color: viewMode===m.key ? 'var(--accent)' : 'var(--text2)',
                border: viewMode===m.key ? '1px solid rgba(74,158,255,0.4)' : '1px solid var(--border)',
              }}>
              {m.label}
              {viewMode===m.key && <span style={{ marginLeft:'6px', fontSize:'10px' }}>適用中</span>}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
