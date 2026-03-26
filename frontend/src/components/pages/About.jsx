export default function About() {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, color:'#e8f0ff', marginBottom:'4px' }}>運営者情報</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'32px' }}>StockWaveJP について</p>

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'28px 32px', marginBottom:'24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:'16px 24px', fontSize:'13px' }}>
          {[
            ['サイト名', 'StockWaveJP'],
            ['URL', 'https://stockwavejp.com'],
            ['運営開始', '2026年3月'],
            ['目的', '日本株テーマ別の騰落率・出来高・売買代金をリアルタイムで可視化し、投資判断の参考情報を提供すること'],
            ['データソース', 'yfinance（非公式・遅延データ）をもとに独自集計'],
            ['対象ユーザー', '日本株に興味を持つ個人投資家・投資初心者'],
          ].map(([label, value], i) => (
            <div key={i} style={{ display:'contents' }}>
              <span style={{ color:'var(--text3)', fontWeight:600, letterSpacing:'0.05em', fontSize:'11px', textTransform:'uppercase', paddingTop:'2px' }}>{label}</span>
              <span style={{ color:'var(--text2)', lineHeight:1.7 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'24px 28px', marginBottom:'24px' }}>
        <h2 style={{ fontSize:'15px', fontWeight:700, color:'#e8f0ff', marginBottom:'14px' }}>サイトについて</h2>
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9, marginBottom:'12px' }}>
          StockWaveJPは、日本株のテーマ別動向を視覚的に把握するためのダッシュボードです。
          半導体・AI・防衛・インバウンドなど30テーマの騰落率・出来高・売買代金を自動集計し、
          どのテーマに資金が集まっているかをリアルタイムで確認できます。
        </p>
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9, marginBottom:'0' }}>
          個別銘柄の推奨や投資助言は行っておらず、あくまで「市場全体のテーマの流れを把握する」ための
          情報提供ツールです。実際の投資判断は、必ずご自身の責任において行ってください。
        </p>
      </div>

      <div style={{ background:'rgba(255,140,66,0.07)', border:'1px solid rgba(255,140,66,0.2)', borderRadius:'10px', padding:'18px 22px' }}>
        <h2 style={{ fontSize:'14px', fontWeight:700, color:'#ff8c42', marginBottom:'10px' }}>⚠️ 免責事項</h2>
        <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.9, margin:0 }}>
          当サイトに掲載されている情報は投資助言ではありません。掲載データはyfinance経由で取得しており、
          リアルタイムデータではなく15〜20分程度の遅延があります。データの正確性・完全性を保証するものではなく、
          当サイトの情報を参考にして生じた損害について運営者は一切責任を負いません。
          株式投資にはリスクが伴います。投資判断は必ず証券会社等の公式情報をご確認の上、
          ご自身の判断と責任において行ってください。
        </p>
      </div>
    </div>
  )
}
