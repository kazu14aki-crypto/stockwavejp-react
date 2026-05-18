import { useState, useEffect } from 'react'

export default function Plan() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const s    = { padding:'24px 16px 60px', maxWidth:'820px', margin:'0 auto' }
  const h1   = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }
  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px', marginBottom:'16px' }

  const PLANS = [
    {
      name:'Free', price:'¥0', period:'永久無料', color:'#4a9eff',
      badge:'現在利用中', badgeBg:'rgba(74,158,255,0.15)', yearly: null,
      features:['67テーマのリアルタイムデータ','テーマヒートマップ','市場別ランキング','週次レポート（最新1週）','コラム記事（全本）','カスタムテーマ（ウォッチリスト）','機関投資家大量保有情報'],
    },
    {
      name:'スタンダード', price:'¥1,180', period:'/月', color:'#ff8c42',
      badge:'近日公開', badgeBg:'rgba(255,255,255,0.05)', yearly:'年額 ¥11,800',
      features:['Freeプランの全機能','週次レポート全アーカイブ','メールアラート（価格・騰落率）','カスタムテーマ（取得価格・損益管理）'],
    },
    {
      name:'プロ', price:'¥1,980', period:'/月', color:'#aa77ff',
      badge:'近日公開', badgeBg:'rgba(255,255,255,0.05)', yearly:'年額 ¥19,800',
      features:['スタンダードの全機能','複数アラートルール設定','ポートフォリオ分析','優先サポート'],
    },
  ]

  const FEATURES = [
    ['ホームダッシュボード','✅','✅','✅'],
    ['テーマ一覧（67テーマ）','✅','✅','✅'],
    ['テーマヒートマップ','✅','✅','✅'],
    ['テーマ別詳細','✅','✅','✅'],
    ['市場別ランキング','✅','✅','✅'],
    ['機関投資家大量保有情報','✅','✅','✅'],
    ['週次レポート（最新1週）','✅','✅','✅'],
    ['コラム記事（全本）','✅','✅','✅'],
    ['カスタムテーマ（ウォッチリスト）','✅','✅','✅'],
    ['週次レポートアーカイブ','❌','✅','✅'],
    ['メールアラート','❌','✅','✅'],
    ['損益管理','❌','✅','✅'],
    ['複数アラートルール','❌','❌','✅'],
    ['ポートフォリオ分析','❌','❌','✅'],
    ['優先サポート','❌','❌','✅'],
  ]

  return (
    <div style={s}>
      <h1 style={h1}>💰 料金プラン</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px', lineHeight:1.7 }}>
        現在は<strong style={{ color:'#4a9eff' }}>完全無料</strong>でご利用いただけます。
        有料プランは近日公開予定です。
      </p>

      {/* プランカード — スマホは縦積み、PCは3列 */}
      <div style={{
        display:'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
        gap:'12px', marginBottom:'24px'
      }}>
        {PLANS.map(p => (
          <div key={p.name} style={{
            background:'var(--bg2)', border:`2px solid ${p.color}40`,
            borderRadius:'10px', padding: isMobile ? '16px' : '18px 16px',
            borderTop:`4px solid ${p.color}`,
          }}>
            {/* スマホは横並び、PCは縦 */}
            <div style={{
              display:'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '12px' : '0',
              marginBottom: isMobile ? '12px' : '0',
            }}>
              <div style={{ flex: isMobile ? 1 : undefined }}>
                <div style={{ fontSize:'15px', fontWeight:800, color:p.color, marginBottom:'4px' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'3px' }}>
                  <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>{p.price}</span>
                  <span style={{ fontSize:'11px', color:'var(--text3)' }}>{p.period}</span>
                </div>
                {p.yearly && <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>{p.yearly}</div>}
              </div>
              <div style={{
                fontSize:'10px', fontWeight:700, padding:'4px 12px', borderRadius:'20px',
                background:p.badgeBg, color:p.badge==='現在利用中'?p.color:'var(--text3)',
                border:`1px solid ${p.badge==='現在利用中'?p.color+'40':'rgba(255,255,255,0.08)'}`,
                whiteSpace:'nowrap', flexShrink:0,
              }}>
                {p.badge}
              </div>
            </div>
            <ul style={{ listStyle:'none', padding:0, margin: isMobile ? 0 : '12px 0 0', display:'flex', flexDirection:'column', gap:'6px' }}>
              {p.features.map((f, i) => (
                <li key={i} style={{ fontSize:'12px', color:'var(--text2)', display:'flex', alignItems:'flex-start', gap:'6px', lineHeight:1.5 }}>
                  <span style={{ color:p.color, flexShrink:0, marginTop:'1px' }}>✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 機能比較表 */}
      <div style={card}>
        <h2 style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'14px' }}>
          📊 機能比較表
        </h2>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize: isMobile ? '11px' : '12px', minWidth: isMobile ? '320px' : undefined }}>
            <thead>
              <tr>
                {[
                  ['機能', 'left', 'transparent', 'var(--text3)'],
                  ['Free', 'center', 'rgba(74,158,255,0.10)', '#4a9eff'],
                  ['スタンダード', 'center', 'rgba(255,140,66,0.10)', '#ff8c42'],
                  ['プロ', 'center', 'rgba(170,119,255,0.10)', '#aa77ff'],
                ].map(([h, align, bg, color], i) => (
                  <th key={i} style={{
                    padding: isMobile ? '8px 6px' : '10px 12px',
                    textAlign:align, background:bg, color,
                    fontWeight:700, fontSize: isMobile ? '10px' : '11px',
                    borderBottom:'2px solid var(--border)',
                    borderRight:i<3?'1px solid var(--border)':'none',
                    whiteSpace: isMobile ? 'normal' : 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((row, ri) => (
                <tr key={ri} style={{ borderBottom:'1px solid var(--border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: isMobile ? '6px 6px' : '8px 12px',
                      textAlign:ci===0?'left':'center',
                      color: ci===0?'var(--text2)':cell==='✅'?'#00c48c':cell==='❌'?'rgba(255,255,255,0.2)':'var(--text)',
                      background: ci===1?'rgba(74,158,255,0.03)':ci===2?'rgba(255,140,66,0.03)':ci===3?'rgba(170,119,255,0.03)':'transparent',
                      borderRight:ci<3?'1px solid var(--border)':'none',
                      fontSize: ci===0 ? (isMobile?'11px':'12px') : '13px',
                      fontWeight:ci>0?700:400,
                    }}>
                      {ci===1&&ri===0
                        ? <span style={{ fontSize:'9px', background:'rgba(74,158,255,0.15)', color:'#4a9eff', borderRadius:'4px', padding:'2px 5px' }}>現在</span>
                        : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'12px' }}>
          ※ 料金は予告なく変更する場合があります。消費税込み。有料プランは近日公開予定。
        </p>
      </div>
    </div>
  )
}
