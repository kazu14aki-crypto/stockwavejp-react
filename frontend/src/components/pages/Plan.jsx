import UpgradePlanButton, { warmupBackend } from '../UpgradePlanButton'
import { useState, useEffect } from 'react'
import { useAuth }         from '../../hooks/useAuth.jsx'
import { useSubscription } from '../../hooks/useSubscription.jsx'

export default function Plan({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(false)
  const { isLoggedIn, signIn, user } = useAuth()
  const { plan: currentPlan, planLabel, isPro } = useSubscription()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const perDay = (monthly) => Math.ceil(monthly / 30)

  const openPortal = async () => {
    const { supabase } = await import('../../lib/supabase')
    const { data:{ session } } = await supabase.auth.getSession()
    const res = await fetch(`${API}/api/stripe/create-portal`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${session?.access_token || ''}` },
      body:JSON.stringify({ user_id:user?.id }),
    })
    const d = await res.json()
    if (!res.ok || !d.url) throw new Error(d.detail || '支払い管理ポータルを開けませんでした')
    window.open(d.url, '_blank', 'noopener,noreferrer')
  }

  const PLANS = [
    {
      key: 'free',
      name: 'Free', color: '#4a9eff',
      badge: currentPlan === 'free' ? '現在利用中' : null,
      monthly: { price: '¥0', label: '永久無料', perDay: null },
      yearly:  null,
      features: [
        '72テーマの確定終値データ',
        'テーマヒートマップ',
        '市場別詳細',
        '銘柄検索',
        'レポート（無料公開範囲）',
        'コラム記事（全本）',
        'カスタムテーマ（ウォッチリスト）',
      ],
    },
    {
      key: 'standard',
      name: 'スタンダード', color: '#ff8c42',
      badge: currentPlan === 'standard' ? '現在利用中' : null,
      monthly: { price: '¥980',  label: '単月契約', perDay: perDay(980)  },
      yearly:  null,  // 年額は一時停止中（半年後に復活予定）
      features: [
        'Freeプランの全機能',
        '市場データ 約60分更新',
        'テーマ別詳細・市場別詳細（全期間）',
        'カスタムテーマ 5テーマ・20銘柄/テーマ',
        '週次・月次・四半期レポート（全アーカイブ）',
        '市場別詳細ページ',
      ],
    },
    {
      key: 'pro',
      name: 'プロ', color: '#aa77ff',
      badge: currentPlan === 'pro' ? '現在利用中' : null,
      monthly: { price: '¥1,980', label: '単月契約', perDay: perDay(1980) },
      yearly:  null,  // 年額は一時停止中（半年後に復活予定）
      features: [
        'スタンダードの全機能',
        '市場データ 約15分更新',
        'カスタムテーマ 10テーマ・50銘柄/テーマ',
        '🚧 機関投資家大量保有情報（準備中）',
        '優先サポート',
      ],
    },
  ]

  const FEATURES = [
    ['市場データ更新頻度', '確定終値','約60分','約15分'],
    ['テーマ一覧（72テーマ+）',                   '✅','✅','✅'],
    ['テーマヒートマップ',                        '✅','✅','✅'],
    ['テーマ別詳細（Free対象期間）',             '✅','✅','✅'],
    ['テーマ別詳細（全期間）',                    '❌','✅','✅'],
    ['銘柄検索',                                  '✅','✅','✅'],
    ['コラム・解説記事（全本）',                  '✅','✅','✅'],
    ['カスタムテーマ 1テーマ・10銘柄',            '✅','❌','❌'],
    ['カスタムテーマ 5テーマ・20銘柄/テーマ',    '❌','✅','❌'],
    ['カスタムテーマ 10テーマ・50銘柄/テーマ',   '❌','❌','✅'],
    ['レポート（無料公開範囲）',           '✅','✅','✅'],
    ['週次・月次・四半期レポート（全アーカイブ）',              '❌','✅','✅'],
    ['市場別詳細ページ',                          '❌','✅','✅'],
    ['機関投資家大量保有情報',                    '❌','❌','✅'],
    ['優先サポート',                              '❌','❌','✅'],
  ]

  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', marginBottom:'16px' }

  return (
    <div style={{ padding:'16px 16px 60px', maxWidth:'860px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>💰 料金プラン</h1>
      {currentPlan === 'pro_trial' && (
        <div style={{ padding:'12px 16px', background:'rgba(170,119,255,0.12)',
          border:'1px solid rgba(170,119,255,0.3)', borderRadius:'10px',
          fontSize:'13px', color:'#aa77ff', marginBottom:'16px', lineHeight:1.7 }}>
          🎉 <strong>プロプラン体験版（無料）</strong>をご利用中です。<br/>
          <span style={{ fontSize:'11px', color:'var(--text2)' }}>初回ログインから14日間、全機能を無料でお試しいただけます。期間終了後は自動的にFreeプランになります。</span>
        </div>
      )}
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px', lineHeight:1.7 }}>
        現在のプラン: <strong style={{ color:'#4a9eff' }}>{planLabel}</strong>。有料プランへのアップグレードは下記ボタンから。
        {!isLoggedIn && (
          <span>サブスクリプション加入には<button onClick={signIn} style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'12px', fontWeight:700, padding:'0 2px' }}>Googleログイン</button>が必要です。</span>
        )}
      </p>

      {/* プランカード */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:'14px', marginBottom:'28px' }}>
        {PLANS.map(p => (
          <div key={p.key} style={{ background:'var(--bg2)', border:`2px solid ${p.color}40`, borderRadius:'12px', padding:'18px 16px', borderTop:`4px solid ${p.color}`, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
              <span style={{ fontSize:'16px', fontWeight:800, color:p.color }}>{p.name}</span>
              {p.badge && (
                <span style={{ fontSize:'10px', fontWeight:700, padding:'3px 10px', borderRadius:'20px',
                  background: p.badge==='現在利用中' ? `${p.color}20` : 'rgba(255,255,255,0.05)',
                  color: p.badge==='現在利用中' ? p.color : 'var(--text3)',
                  border:`1px solid ${p.badge==='現在利用中' ? p.color+'50' : 'rgba(255,255,255,0.08)'}`
                }}>{p.badge}</span>
              )}
            </div>

            {/* 単月 */}
            <div style={{ padding:'12px', borderRadius:'8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginBottom: p.yearly ? '10px' : '14px' }}>
              <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>{p.monthly.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                <span style={{ fontSize:'26px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>{p.monthly.price}</span>
                {p.monthly.label !== '永久無料' && <span style={{ fontSize:'12px', color:'var(--text3)' }}>/月</span>}
              </div>
              {p.monthly.perDay && <div style={{ fontSize:'11px', color:p.color, fontWeight:600, marginTop:'4px' }}>一日あたり約{p.monthly.perDay}円！</div>}
              {p.monthly.label === '永久無料' && <div style={{ fontSize:'11px', color:'#4a9eff', fontWeight:600, marginTop:'4px' }}>ずっと無料</div>}
            </div>

            {/* 年間 */}
            {p.yearly && (
              <div style={{ padding:'12px', borderRadius:'8px', background:`${p.color}10`, border:`1px solid ${p.color}30`, marginBottom:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.yearly.label}</span>
                  <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'10px', background:p.color, color:'#fff' }}>{p.yearly.discount}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
                  <span style={{ fontSize:'22px', fontWeight:800, color:p.color, fontFamily:'var(--mono)' }}>{p.yearly.price}</span>
                  <span style={{ fontSize:'11px', color:'var(--text3)' }}>/年</span>
                </div>
                <div style={{ fontSize:'11px', color:p.color, fontWeight:600, marginTop:'4px' }}>一日あたり約{p.yearly.perDay}円！</div>
              </div>
            )}

            {/* 機能リスト */}
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'6px', flexGrow:1, marginBottom:'14px' }}>
              {p.features.map((f, i) => (
                <li key={i} style={{ fontSize:'12px', color:'var(--text2)', display:'flex', gap:'6px', lineHeight:1.5 }}>
                  <span style={{ color:p.color, flexShrink:0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            {/* 申し込みボタン */}
            {p.key !== 'free' && (
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginTop:'auto' }}>
                <UpgradePlanButton priceKey={`${p.key}_monthly`} label={p.name} color={p.color} disabled={false}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 機能比較表 */}
      <div style={card}>
        <h2 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'14px' }}>📊 機能比較表</h2>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: isMobile ? '11px' : '12px', minWidth:'300px' }}>
            <thead>
              <tr>
                {[['機能','left','transparent','var(--text3)'],['Free','center','rgba(74,158,255,0.10)','#4a9eff'],['スタンダード','center','rgba(255,140,66,0.10)','#ff8c42'],['プロ','center','rgba(170,119,255,0.10)','#aa77ff']].map(([h,align,bg,color],i) => (
                  <th key={i} style={{ padding: isMobile?'8px 6px':'10px 12px', textAlign:align, background:bg, color, fontWeight:700, fontSize: isMobile?'10px':'11px', borderBottom:'2px solid var(--border)', borderRight:i<3?'1px solid var(--border)':'none' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, ri) => (
                <tr key={ri} style={{ borderBottom:'1px solid var(--border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: isMobile?'6px':'8px 12px', textAlign:ci===0?'left':'center', color: ci===0?'var(--text2)':cell==='✅'?'#00c48c':cell==='❌'?'rgba(255,255,255,0.2)':'var(--text)', background: ci===1?'rgba(74,158,255,0.03)':ci===2?'rgba(255,140,66,0.03)':ci===3?'rgba(170,119,255,0.03)':'transparent', borderRight:ci<3?'1px solid var(--border)':'none', fontSize:ci===0?(isMobile?'11px':'12px'):'13px', fontWeight:ci>0?700:400 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'12px' }}>
          ※ 料金は消費税込み。有料プランは近日公開予定。
        </p>
      </div>
      {/* 無料体験期間中の契約に関する注意事項 */}
      <div style={{ background:'rgba(255,200,50,0.08)', border:'1px solid rgba(255,200,50,0.3)',
        borderRadius:'12px', padding:'16px 20px', marginTop:'8px' }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'#ffd619', marginBottom:'8px' }}>
          ⚠️ 無料体験期間中のサブスク加入について
        </div>
        <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>
          無料体験期間中（初回ログインから14日間）にサブスクリプションへ加入された場合、
          <strong>加入した時点で無料体験期間が終了し、有料契約期間が開始</strong>となります。<br/>
          設定ページの「現在のプラン」には加入したプランが表示され、解約ボタンから解約できます。<br/>
          解約後も<strong>契約期間の終了日まで</strong>引き続きご利用いただけます。
        </div>
      </div>

      {/* 契約・支払い・ログインに関するサポート */}
      <div style={{ ...card, marginTop:'18px' }}>
        <h2 style={{ fontSize:'15px', fontWeight:800, color:'var(--text)', marginBottom:'5px' }}>🧾 契約・支払いに関するサポート</h2>
        <p style={{ fontSize:'11px', color:'var(--text3)', lineHeight:1.7, marginBottom:'14px' }}>
          プラン変更、解約、決済エラーなど、有料プランに関する確認事項をまとめています。
        </p>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'repeat(2,minmax(0,1fr))', gap:'10px' }}>
          {[
            ['プラン変更・解約','支払い管理ポータルから変更できます。解約後も契約期間終了までは利用でき、終了後にFreeへ移行します。'],
            ['支払失敗','支払い管理ポータルでカード情報を更新してください。Stripeの再請求後、ログアウト・再ログインすると契約状態が反映されます。'],
            ['二重課金','請求履歴を確認し、請求日・金額・登録メールアドレスを添えてお問い合わせください。調査前に重複契約をすべて解約しないでください。'],
            ['体験期間終了','14日間の体験終了後は自動課金せずFreeへ移行します。体験中に有料契約した場合は、契約した時点から有料期間が始まります。'],
            ['有料機能が反映されない','決済完了後にログアウト・再ログインしてください。改善しない場合は決済完了メールと登録メールアドレスを添えてお問い合わせください。'],
            ['アカウント削除','設定ページの最下部にあります。削除時は誤操作防止の確認画面が2回表示されます。'],
          ].map(([title,body]) => (
            <div key={title} style={{ padding:'12px 13px', border:'1px solid var(--border)', borderRadius:'9px', background:'var(--bg3)' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'5px' }}>{title}</div>
              <div style={{ fontSize:'11px', color:'var(--text2)', lineHeight:1.75 }}>{body}</div>
            </div>
          ))}
        </div>
        {(currentPlan==='standard' || currentPlan==='pro') && (
          <button onClick={() => openPortal().catch(e => window.alert(e.message))} style={{
            marginTop:'14px', padding:'9px 15px', borderRadius:'8px', cursor:'pointer',
            background:'rgba(74,158,255,.1)', color:'var(--accent)',
            border:'1px solid rgba(74,158,255,.35)', fontFamily:'var(--font)', fontWeight:700,
          }}>支払い管理ポータルを開く</button>
        )}
      </div>

      <div style={card}>
        <h2 style={{ fontSize:'15px', fontWeight:800, color:'var(--text)', marginBottom:'5px' }}>🔐 ログイン・データ更新のトラブル</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginTop:'13px' }}>
          <div>
            <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>Googleログインできない</div>
            <div style={{ fontSize:'11px', color:'var(--text2)', lineHeight:1.8 }}>
              ポップアップとCookieを許可し、シークレットモードまたは別ブラウザで再試行してください。拡張機能や広告ブロッカーを一時停止すると改善する場合があります。エラーが続く場合は、端末・ブラウザ・発生時刻・エラー画面を添えてお問い合わせください。
            </div>
          </div>
          <div>
            <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>データ更新が遅れている</div>
            <div style={{ fontSize:'11px', color:'var(--text2)', lineHeight:1.8 }}>
              全ページ共通でサイト最上部に表示される「更新時刻」と「データ基準時刻」を確認してください。更新失敗時は0%として扱わず、「未取得」「更新失敗」「更新遅延」「市場休場」を区別して表示します。
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
