const SECTIONS = [
  {
    icon: '📊',
    title: 'テーマ一覧',
    body: '日本株のテーマ別騰落率・出来高・売買代金をランキング形式で表示します。期間を選択してKPIカードやグラフで全テーマを一覧できます。上昇テーマ（赤）・下落テーマ（黄緑）の色で視覚的に把握できます。',
  },
  {
    icon: '📡',
    title: '騰落モメンタム',
    body: '現在の騰落率に加え、先週比・先月比の変化を表示します。「🔥加速」「❄️失速」「↗転換↑」などの状態フィルターで注目テーマを絞り込めます。',
  },
  {
    icon: '💹',
    title: '資金フロー',
    body: '資金流入TOP10・流出TOP10と全テーマの騰落率一覧を表示します。どのテーマに資金が集まっているかを把握できます。',
  },
  {
    icon: '📈',
    title: '騰落推移',
    body: '日次終値から算出した累積騰落率の推移グラフです。上位5＋下位5の自動選択、手動選択、全テーマ表示の3モードがあります。',
  },
  {
    icon: '🔥',
    title: 'ヒートマップ',
    body: '期間別（1W/1M/3M/6M/1Y）と月次推移の2種類のヒートマップです。赤が上昇、緑が下落を表します。テーマ間のパフォーマンス比較に最適です。',
  },
  {
    icon: '📊',
    title: 'テーマ・マクロ比較',
    body: 'テーマ同士の騰落率を比較できます。また日経平均・S&P500・ドル円・VIXなどのマクロ指標との対比も可能です。',
  },
  {
    icon: '📋',
    title: '市場別ランキング',
    body: '日経225（技術/素材/資本財/消費/金融/運輸）、TOPIX（Core30/Large70）、プライム/スタンダード/グロース市場別の騰落率と構成銘柄一覧を表示します。',
  },
  {
    icon: '🔍',
    title: 'テーマ別詳細',
    body: 'テーマを選択して構成銘柄の騰落率・寄与度・出来高・売買代金などの詳細を確認できます。上昇/下落TOP5グラフと構成銘柄一覧テーブルを表示します。',
  },
  {
    icon: '🎨',
    title: 'カスタムテーマ',
    body: '独自のテーマを作成して追跡できます。銘柄コード（例：6954.T）を入力して好きな銘柄を組み合わせたオリジナルテーマを作成・編集・削除できます。',
  },
  {
    icon: '⚙️',
    title: '設定',
    body: 'PC/スマホの表示モード切替、カラーテーマ（ブラック/ホワイト/ネイビー）の変更ができます。',
  },
]

export default function HowTo() {
  return (
    <div style={{ padding: '28px 32px 48px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
        使い方
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '28px' }}>
        StockWaveJP の各機能の説明です
      </p>

      {/* 概要カード */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74,158,255,0.1), rgba(255,69,96,0.08))',
        border: '1px solid rgba(74,158,255,0.2)',
        borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: '28px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          StockWaveJP とは
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8 }}>
          日本株のテーマ別騰落率・出来高・売買代金をリアルタイムで追跡するダッシュボードです。
          yfinanceの日次データを使用し、どのテーマに資金が流入・流出しているかを視覚的に把握できます。
          投資判断の参考情報を提供するものであり、投資助言ではありません。
        </div>
      </div>

      {/* 各ページの説明 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="howto-grid">
        {SECTIONS.map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px 20px',
            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,158,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{s.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{s.title}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</div>
          </div>
        ))}
      </div>

      {/* データについて */}
      <div style={{
        background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.2)',
        borderRadius: 'var(--radius)', padding: '18px 20px', marginTop: '24px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ff8c42', marginBottom: '8px' }}>
          ⚠️ データについて
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8 }}>
          データはyfinance経由で取得しており、リアルタイムデータではありません（15〜20分遅延）。
          初回データ取得には数十秒かかる場合があります。
          実際の投資判断には証券会社等の公式データをご確認ください。
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .howto-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
