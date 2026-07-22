import { useEffect, useState } from 'react'

// 手動更新のお知らせリスト（新しい順）
const MANUAL_NEWS = [
  { date:'2026/07/22', title:'日本の成長戦略と現在の政策を分析したコラムを公開', body:'責任ある積極財政、戦略17分野、AI・半導体、防衛、エネルギー、造船、国土強靱化、賃金、地方、金融政策を整理しました。' },
  { date:'2026/07/22', title:'NVIDIAと日本企業の協業を分析したコラムを公開', body:'フィジカルAI、Noetraの国家規模AI基盤、富士通・ファナック・安川電機・川崎重工業の協調制御基盤、Toyota・SoftBank・日立などの取り組みを整理し、日本企業の収益機会とリスクを分析しました。' },
  { date:'2026/07/22', title:'11テーマの解説コラムを公開', body:'次世代半導体、核融合発電、原子力発電、量子コンピューター、ウェアラブル端末、塗料、警備、電線・銅、先端パッケージング・基板、データセンター電力・冷却、M&A・事業承継の解説を公開しました。' },
  { date:'2026/07/20', title:'コラム「世界株安とKOSPI急落」を公開', body:'世界株安を韓国KOSPI、半導体・メモリ株、レバレッジ、金利、原油高の観点から分析しました。' },
  { date:'2026/07/19', title:'コラム「テーマ選定基準」を公開', body:'テーマの新設、構成銘柄の採用・除外、重複掲載、変更方針を公開しました。' },
  { date:'2026/05/29', title:'週次レポート公開・MLCCテーマ追加', body:'5/25〜5/29週のレポートを公開し、MLCC・電子部品テーマを追加しました。' },
  { date:'2026/05/22', title:'週次レポート（5/18〜5/22）公開', body:'防衛・航空、宇宙・衛星、サイバーセキュリティなどの週間動向をまとめました。' },
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
        StockWaveJPのコラム・レポート・テーマ更新情報
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
        <span>📋 コンテンツ更新</span>
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
