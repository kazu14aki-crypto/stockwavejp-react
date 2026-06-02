const SECTIONS = [
  {
    title: '情報の目的と責任',
    body: '本ツール（StockWaveJP）は、株式市場の動向分析のための参考情報の提供を目的としており、投資勧誘や特定の銘柄の推奨、投資助言を行うものではありません。投資に関する最終決定は、お客様ご自身の判断と責任において行われるようお願いいたします。',
  },
  {
    title: 'データの独自集計について',
    body: '当サイトで表示される各数値（「国内主要225銘柄」「大型株70社」等の平均騰落率および集計データ）は、対象となる個別銘柄の終値を元に、当サイトが独自に集計・算出したものです。日本経済新聞社が公表する「日経平均株価」や、株式会社JPX総研が公表する「TOPIX」等の公式な指数値ではありません。',
  },
  {
    title: 'データの正確性とソース',
    body: '当サイトの情報は信頼できると考えられるデータプロバイダーより取得しておりますが、データの正確性、完全性、最新性を保証するものではありません。提供データには市場に応じた遅延（15分〜20分程度、または日次更新）が含まれます。実際の投資に際しては、必ず証券会社等の公式データをご確認ください。',
  },
  {
    title: '損害への責任',
    body: '本ツールの利用により生じたいかなる損害（直接・間接を問わず）についても、運営者は一切の責任を負いません。本サービスは「現状のまま」提供されており、保守、中断、不具合等による損害についても同様とします。',
  },
  {
    title: '著作権について',
    body: '本ツールのコード・デザイン・データ構成は著作権により保護されています。無断転載・複製・商用利用を禁止します。',
  },
]

export default function Disclaimer() {
  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'4px' }}>
        免責事項
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'28px' }}>
        StockWaveJP 免責事項
      </p>

      {SECTIONS.map((s,i) => (
        <div key={i} style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'12px',
          animation:`fadeUp 0.3s ease ${i*0.06}s both`,
        }}>
          <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'10px',
            borderLeft:'3px solid var(--accent)', paddingLeft:'10px' }}>
            {s.title}
          </div>
          <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9 }}>{s.body}</div>
        </div>
      ))}

      <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'20px', textAlign:'center' }}>
        © 2026 StockWaveJP. All rights reserved.
      </div>
    </div>
  )
}
