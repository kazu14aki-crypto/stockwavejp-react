const SECTIONS = [
  { title:'免責事項', body:'本ツール（StockWaveJP）は株式投資の参考情報を提供することを目的としており、投資助言・推奨を行うものではありません。投資に関する最終的な判断はご自身の責任においてお願いします。' },
  { title:'データの正確性について', body:'本ツールが提供するデータはyfinance経由で取得したものであり、リアルタイムデータではありません。データの正確性・完全性・最新性を保証するものではありません。実際の投資判断には証券会社等の公式データをご確認ください。' },
  { title:'著作権について', body:'本ツールのコード・デザイン・データ構成は著作権により保護されています。無断転載・複製・商用利用を禁止します。' },
  { title:'利用規約', body:'本ツールを利用した結果生じたいかなる損害についても、運営者は責任を負いません。本ツールは「現状のまま」提供されており、いかなる保証も行いません。' },
]
export default function Disclaimer() {
  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px',fontWeight:700,letterSpacing:'-0.02em',color:'#e8f0ff',marginBottom:'4px' }}>免責事項</h1>
      <p style={{ fontSize:'12px',color:'var(--text3)',marginBottom:'28px' }}>StockWaveJP利用規約・免責事項</p>
      {SECTIONS.map((s,i)=>(
        <div key={i} style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'20px 24px',marginBottom:'12px' }}>
          <div style={{ fontSize:'14px',fontWeight:700,color:'#e8f0ff',marginBottom:'10px' }}>{s.title}</div>
          <div style={{ fontSize:'13px',color:'var(--text2)',lineHeight:1.8 }}>{s.body}</div>
        </div>
      ))}
      <div style={{ fontSize:'12px',color:'var(--text3)',marginTop:'20px',textAlign:'center' }}>© 2026 StockWaveJP. All rights reserved.</div>
    </div>
  )
}
