import { useEffect, useState } from 'react'

// 手動更新のお知らせリスト（新しい順）
const MANUAL_NEWS = [
  { date:'2026/07/20', title:'開発中ページを管理者限定化し、市場分類を独自分類へ変更', body:'機関投資家保有と市場別詳細を開発者アカウント限定にしました。市場区分と日経平均の6分類を削除し、代表150銘柄を主力事業で分けたStockWaveJP独自10分類へ変更しました。分析ページ上部には関連ページへ直接移動できるナビゲーションを追加しました。' },
  { date:'2026/07/20', title:'開発中機能の公開範囲を調整', body:'開発中の機関投資家保有ページを一般ユーザーのメニューと導線から非表示にし、開発者アカウントだけが確認できるよう変更しました。' },
  { date:'2026/07/20', title:'初回ガイド・利用ステップ・契約管理を改善', body:'初回ガイドが二度目以降も表示される問題を修正しました。ホームと使い方ページに具体的な閲覧ページ・確認例を追加し、ヘッダーへ次回更新予定を表示しました。既存の有料契約はStripe Customer Portalで変更・解約する方式に統一し、重複契約を防ぐよう改善しました。' },
  { date:'2026/07/20', title:'コラム「世界株安とKOSPI急落」を公開・サポート導線を整理', body:'約1万字の市場分析コラムを公開しました。契約・支払い・ログインのトラブル案内を料金プランページ下部へ移し、更新時刻とデータ基準時刻を全ページ共通ヘッダーへ集約しました。アカウント削除は設定ページ最下部へ移動し、二重確認を追加しました。' },
  { date:'2026/07/20', title:'エラー画面とデータ状態表示を改善', body:'データ未取得・更新失敗・更新遅延・市場休場を区別し、取得時刻とデータ基準時刻を表示するよう改善しました。初回ガイド、アカウント削除、契約・支払いトラブルの案内も追加しました。' },
  { date:'2026/07/19', title:'データ更新頻度・料金プラン・使い方を更新', body:'プラン別の市場データ更新頻度を、Freeは前営業日または当日確定終値、スタンダードは約60分、プロは約15分に整理しました。コラム「StockWaveJPのテーマ選定基準」も公開しました。' },
  { date:'2026/05/29', title:'週次レポート（5/25〜5/29）公開・MLCCテーマ追加', body:'MLCC・電子部品テーマを新設し、村田製作所の時価総額14兆円突破を受けてMLCC関連銘柄が急騰した5/25〜5/29週のレポートを公開しました。テーマ平均+0.82%。' },
  { date:'2026/05/22', title:'週次レポート（5/18〜5/22）公開・防衛3週連続首位', body:'防衛・航空（+8.1%）が3週連続で首位。宇宙・衛星・サイバーセキュリティも上昇継続。来週は日銀金融政策決定会合（5/28〜29）に注目。テーマ平均騰落率+1.24%。' },
  { date:'2026/04/01', title:'コラム8本追加・説明文充実', body:'各ページに説明文とポイントを追加しました。コラムページに親子上場・バフェット銘柄・フィジカルAI・パワー半導体・NISA・光ファイバー・国土強靭化・中東情勢の8本を追加。全20本となりました。' },
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
