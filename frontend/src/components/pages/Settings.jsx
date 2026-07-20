import { useState } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'
import { useAuth }         from '../../hooks/useAuth.jsx'

export default function Settings({ viewMode, onViewModeChange, colorTheme, onColorThemeChange, isMobile, onNavigate }) {
  const { plan, planLabel } = useSubscription()
  const { isLoggedIn, user, signOut } = useAuth()
  const [accountBusy,setAccountBusy]=useState(false)
  const [accountError,setAccountError]=useState(null)

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
  const planColor = { free:'#4a9eff', standard:'#ff8c42', pro:'#aa77ff', pro_trial:'#aa77ff', trial_expired:'#888', dev:'#00c48c' }[plan] || '#4a9eff'

  const deleteAccount = async () => {
    const first = window.confirm('本当にアカウントを削除しますか？\n保存したテーマ、設定、ログイン情報は復元できません。')
    if (!first) return
    const second = window.confirm('最終確認です。本当に削除しますか？\nこの操作は取り消せません。')
    if (!second) return
    setAccountBusy(true)
    setAccountError(null)
    try {
      const { supabase } = await import('../../lib/supabase')
      const { data:{ session } } = await supabase.auth.getSession()
      const res = await fetch(`${API}/api/account/delete`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${session?.access_token || ''}` },
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.detail || '削除に失敗しました')
      await signOut()
      localStorage.clear()
      window.alert('アカウントを削除しました')
      window.location.reload()
    } catch (e) {
      setAccountError(e.message)
    } finally {
      setAccountBusy(false)
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
                  初回14日間無料体験中{(() => {
                    const fl = user?.user_metadata?.first_login_at
                    if (!fl) return ''
                    const end = new Date(new Date(fl).getTime() + 14*24*60*60*1000)
                    const rem = Math.max(0, Math.ceil((end - new Date()) / 86400000))
                    return '　終了日：' + end.toLocaleDateString('ja-JP', {year:'numeric',month:'long',day:'numeric'}) + '　（残り' + rem + '日）'
                  })()}
                </span>
              )}
            </div>
            <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'14px' }}>
              {plan === 'free' && 'Freeプラン：基本機能をご利用いただけます。'}
              {plan === 'standard' && 'スタンダードプラン：月額980円。全期間・全アーカイブにアクセスできます。'}
              {plan === 'pro' && 'プロプラン：月額1,980円。全機能・機関投資家情報にアクセスできます。'}
              {plan === 'trial_expired' && '14日間の無料体験期間が終了しました。引き続きご利用いただくには有料プランへのお申し込みをお願いします。'}
            {plan === 'pro_trial' && 'プロプラン14日無料体験中。期間終了後はFreeプランに自動移行します。'}
              {plan === 'dev' && '開発者アカウント：全機能利用可能。'}
            </div>

            <button onClick={() => onNavigate?.('プラン・料金')}
              style={{ ...btnBase, background:'rgba(74,158,255,0.1)', color:'var(--accent)',
                border:'1px solid rgba(74,158,255,0.3)' }}>
              料金プラン・契約管理を見る
            </button>
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

      {/* ── アカウント削除（誤操作防止のため最下部） ── */}
      {isLoggedIn && (
        <Card style={{ marginTop:'34px', border:'1px solid rgba(255,100,100,.3)', background:'rgba(255,100,100,.045)' }}>
          <SLabel>アカウント管理</SLabel>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#ff647c', marginBottom:'7px' }}>アカウント削除</div>
          <div style={{ fontSize:'11px', color:'var(--text3)', lineHeight:1.8, marginBottom:'12px' }}>
            ログイン情報、クラウド保存したカスタムテーマ、お気に入り、ユーザー設定を削除します。削除後は復元できません。<br/>
            有料契約がある場合は、削除前に契約状況をご確認ください。
          </div>
          {accountError && <div style={{ fontSize:'11px', color:'#ff647c', marginBottom:'8px' }}>⚠ {accountError}</div>}
          <button disabled={accountBusy} onClick={deleteAccount} style={{
            ...btnBase, background:'transparent', color:'#ff647c',
            border:'1px solid rgba(255,100,100,.45)', opacity:accountBusy ? .6 : 1,
          }}>
            {accountBusy ? '削除処理中...' : 'アカウントを削除する'}
          </button>
          <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'9px' }}>
            ※ ボタンを押した後、確認画面が2回表示されます。
          </div>
        </Card>
      )}
    </div>
  )
}
