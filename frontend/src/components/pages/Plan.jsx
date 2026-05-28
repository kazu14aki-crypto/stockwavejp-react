import { useState, useEffect } from 'react'
import { useAuth }         from '../../hooks/useAuth.jsx'
import { useSubscription } from '../../hooks/useSubscription.jsx'

export default function Plan({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(false)
  const { isLoggedIn, signIn }  = useAuth()
  const { plan: currentPlan }   = useSubscription()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const perDay = (monthly) => Math.ceil(monthly / 30)

  const PLANS = [
    {
      key: 'free',
      name: 'Free', color: '#4a9eff',
      badge: currentPlan === 'free' ? '現在利用中' : null,
      monthly: { price: '¥0', label: '永久無料', perDay: null },
      yearly:  null,
      features: [
        '67テーマのリアルタイムデータ',
        'テーマヒートマップ',
        '市場別詳細',
        '銘柄検索',
        '週次レポート（最新1週のみ）',
        'コラム記事（全本）',
        'カスタムテーマ（ウォッチリスト）',
      ],
    },
    {
      key: 'standard',
      name: 'スタンダード', color: '#ff8c42',
      badge: currentPlan === 'standard' ? '現在利用中' : '近日公開',
      monthly: { price: '¥980',  label: '単月契約', perDay: perDay(980)  },
      yearly:  { price: '¥9,800', label: '年間契約', discount: '約17%OFF！', perDay: perDay(Math.round(9800/12)) },
      features: [
        'Freeプランの全機能',
        '週次レポート全アーカイブ',
        'メールアラート（価格・騰落率）',
        'カスタムテーマ（取得価格・損益管理）',
      ],
    },
    {
      key: 'pro',
      name: 'プロ', color: '#aa77ff',
      badge: currentPlan === 'pro' ? '現在利用中' : '近日公開',
      monthly: { price: '¥1,980', label: '単月契約', perDay: perDay(1980) },
      yearly:  { price: '¥19,800', label: '年間契約', discount: '約17%OFF！', perDay: perDay(Math.round(19800/12)) },
      features: [
        'スタンダードの全機能',
        '機関投資家大量保有情報',
        'カスタムテーマAI分析（銘柄評価・保有判断）',
        '複数アラートルール設定',
        'ポートフォリオ分析',
        '優先サポート',
      ],
    },
  ]

  const FEATURES = [
    ['テーマ一覧（67テーマ）',          '✅','✅','✅'],
    ['テーマヒートマップ',              '✅','✅','✅'],
    ['テーマ別詳細',                  '✅','✅','✅'],
    ['市場別詳細',                    '✅','✅','✅'],
    ['銘柄検索',                     '✅','✅','✅'],
    ['週次レポート（最新1週）',          '✅','✅','✅'],
    ['コラム記事（全本）',              '✅','✅','✅'],
    ['カスタムテーマ（ウォッチリスト）',   '✅','✅','✅'],
    ['週次レポートアーカイブ',           '❌','✅','✅'],
    ['メールアラート',                 '❌','✅','✅'],
    ['損益管理',                     '❌','✅','✅'],
    ['機関投資家大量保有情報',           '❌','❌','✅'],
    ['カスタムテーマAI分析',            '❌','❌','✅'],
    ['複数アラートルール',              '❌','❌','✅'],
    ['ポートフォリオ分析',             '❌','❌','✅'],
    ['優先サポート',                  '❌','❌','✅'],
  ]

  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', marginBottom:'16px' }

  return (
    <div style={{ padding:'16px 16px 60px', maxWidth:'860px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>💰 料金プラン</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px', lineHeight:1.7 }}>
        現在は<strong style={{ color:'#4a9eff' }}>完全無料</strong>でご利用いただけます。有料プランは近日公開予定です。
        {!isLoggedIn && (
          <span>サブスクリプション加入には<button onClick={signIn} style={{ background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)', fontSize:'12px', fontWeight:700, padding:'0 2px' }}>Googleログイン</button>が必要です。</span>
        )}
      </p>

      {/* プランカード */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:'14px', marginBottom:'28px' }}>
        {PLANS.map(p => (
          <div key={p.key} style={{ background:'var(--bg2)', border:`2px solid ${p.color}40`, borderRadius:'12px', padding:'18px 16px', borderTop:`4px solid ${p.color}` }}>
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
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'6px' }}>
              {p.features.map((f, i) => (
                <li key={i} style={{ fontSize:'12px', color:'var(--text2)', display:'flex', gap:'6px', lineHeight:1.5 }}>
                  <span style={{ color:p.color, flexShrink:0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
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
    </div>
  )
}
