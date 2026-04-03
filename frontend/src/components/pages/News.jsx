import { useEffect, useState } from 'react'

// 手動更新のお知らせリスト（新しい順）
const MANUAL_NEWS = [
  { date:'2026/04/01', title:'コラム8本追加・説明文充実', body:'各ページに説明文とポイントを追加しました。コラムページに親子上場・バフェット銘柄・フィジカルAI・パワー半導体・NISA・光通信・国土強靭化・中東情勢の8本を追加。全20本となりました。' },
  { date:'2026/03/31', title:'カスタムテーマ機能強化', body:'Googleログインによるマルチデバイス同期に対応しました。テーマ一覧・テーマ別詳細からカスタムテーマへの追加ボタンも設置されています。' },
  { date:'2026/03/28', title:'市場別ランキング→市場別詳細に名称変更', body:'より内容を正確に表す「市場別詳細」に名称を変更しました。また1日・1週間・1ヶ月など期間選択のデフォルトを1日表示に変更しました。' },
  { date:'2026/03/14', title:'React版リリース', body:'StockWaveJP がReact+FastAPIに移行しました。デザイン・モバイル対応が大幅に改善されています。' },
  { date:'2026/03/01', title:'出来高・売買代金ランキング追加', body:'テーマ一覧ページに出来高・売買代金のランキンググラフを追加しました。' },
  { date:'2026/02/15', title:'騰落モメンタム機能追加', body:'先週比・先月比の変化から「加速・失速・転換」テーマを一目で把握できる騰落モメンタムページを追加しました。' },
]

const DATA_URL = '/data/market.json'

export default function News() {
  const [actions, setActions] = useState([])

  // market.jsonから銘柄アクション（分割・廃止等）を取得
  useEffect(() => {
    fetch(`${DATA_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(json => {
        const acts = json.corporate_actions || []
        setActions(acts)
      })
      .catch(() => {})
  }, [])

  // 最新日付を特定（NEWバッジ用）
  const allDates = MANUAL_NEWS.map(n => n.date)
  const latestDate = allDates.length > 0 ? allDates.reduce((a,b) => a > b ? a : b) : null

  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'#e8f0ff', marginBottom:'4px' }}>
        お知らせ
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'28px' }}>
        StockWaveJPの機能追加・変更・修正情報
      </p>

      {/* 銘柄アクション（自動取得） */}
      {actions.length > 0 && (
        <div style={{ marginBottom:'24px' }}>
          <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text2)',
            letterSpacing:'0.06em', textTransform:'uppercase',
            marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px' }}>
            <span>📢 銘柄アクション情報</span>
            <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
          </div>
          {actions.map((a, i) => (
            <div key={i} style={{
              background:'rgba(255,214,25,0.06)', border:'1px solid rgba(255,214,25,0.2)',
              borderRadius:'8px', padding:'12px 16px', marginBottom:'8px',
              display:'flex', alignItems:'flex-start', gap:'12px',
            }}>
              <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'20px',
                background:'rgba(255,214,25,0.15)', color:'#ffd619',
                border:'1px solid rgba(255,214,25,0.3)', flexShrink:0, marginTop:'1px' }}>
                {a.type === 'split'  ? '株式分割' :
                 a.type === 'merge'  ? '株式併合' :
                 a.type === 'delist' ? '上場廃止' :
                 a.type === 'rename' ? '社名変更' : 'アクション'}
              </span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', marginBottom:'3px' }}>
                  {a.name}（{a.ticker?.replace('.T','')}）
                </div>
                <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.7 }}>
                  {a.detail}
                </div>
                <div style={{ fontSize:'10px', color:'var(--text3)', marginTop:'4px', fontFamily:'var(--mono)' }}>
                  確認日: {a.detected_at}
                  {a.effective_date && ` ／ 実施予定日: ${a.effective_date}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 手動お知らせ */}
      <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text2)',
        letterSpacing:'0.06em', textTransform:'uppercase',
        marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span>📋 更新履歴</span>
        <div style={{ flex:1, height:'1px', background:'var(--border)' }}/>
      </div>
      {MANUAL_NEWS.map((n, i) => (
        <div key={i} style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'12px',
          animation:`fadeUp 0.3s ease ${i*0.06}s both`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)' }}>
              {n.date}
            </span>
            {n.date === latestDate && (
              <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px',
                background:'rgba(74,158,255,0.12)', color:'var(--accent)',
                border:'1px solid rgba(74,158,255,0.25)', fontWeight:700 }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontSize:'15px', fontWeight:600, color:'#e8f0ff', marginBottom:'8px' }}>
            {n.title}
          </div>
          <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.7 }}>
            {n.body}
          </div>
        </div>
      ))}
    </div>
  )
}
