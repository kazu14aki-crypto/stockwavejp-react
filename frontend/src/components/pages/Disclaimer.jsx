export default function Disclaimer() {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, color:'#e8f0ff', marginBottom:'4px' }}>免責事項</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'32px' }}>最終更新日：2026年3月26日</p>
      {[
        {
          title: '1. 情報の正確性について',
          body: 'StockWaveJP（以下「当サイト」）に掲載されている情報は、信頼できると考えられる情報源に基づいて作成していますが、その正確性・完全性・最新性を保証するものではありません。株価・テーマデータ・指数等は実際の市場データと相違が生じる場合があります。',
        },
        {
          title: '2. 投資判断について',
          body: '当サイトに掲載されている情報は、投資助言・投資勧誘を目的とするものではありません。株式投資にはリスクが伴います。投資の最終判断は、必ずご自身の責任のもとで行ってください。当サイトの情報を参考にして生じたいかなる損害についても、当サイト運営者は一切責任を負いません。',
        },
        {
          title: '3. データの更新・停止について',
          body: '当サイトのデータは定期的に更新されますが、システムメンテナンス・APIの仕様変更・その他の事情により、データの更新が遅延・停止する場合があります。このような場合においても、当サイト運営者は一切の責任を負いません。',
        },
        {
          title: '4. 外部リンクについて',
          body: '当サイトから外部サイトへのリンクを掲載する場合がありますが、リンク先の内容・運営については一切の責任を負いません。',
        },
        {
          title: '5. 著作権について',
          body: '当サイトに掲載されているコンテンツ（テキスト・グラフ・UI等）の著作権は当サイト運営者に帰属します。無断転載・複製を禁じます。',
        },
        {
          title: '6. 免責事項の変更',
          body: '当サイトは、必要に応じて本免責事項を予告なく変更することがあります。変更後の内容は本ページに掲載した時点で効力を生じます。',
        },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom:'28px' }}>
          <h2 style={{ fontSize:'15px', fontWeight:700, color:'#e8f0ff', marginBottom:'10px',
            borderLeft:'3px solid var(--accent)', paddingLeft:'12px' }}>
            {s.title}
          </h2>
          <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9, whiteSpace:'pre-line' }}>
            {s.body}
          </div>
        </div>
      ))}
    </div>
  )
}
