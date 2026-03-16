const SECTIONS = [
  {
    title: '免責事項',
    body: '本ツール（StockWaveJP）は株式投資の参考情報を提供することを目的としており、投資助言・推奨を行うものではありません。投資に関する最終的な判断はご自身の責任においてお願いします。',
  },
  {
    title: 'データの正確性について',
    body: '本ツールが提供するデータはyfinance経由で取得しており、リアルタイムデータではありません（15〜20分程度の遅延があります）。データの正確性・完全性・最新性を保証するものではありません。実際の投資判断には証券会社等の公式データをご確認ください。',
  },
  {
    title: '著作権について',
    body: '本ツールのコード・デザイン・データ構成は著作権により保護されています。無断転載・複製・商用利用を禁止します。',
  },
  {
    title: '利用規約',
    body: '本ツールを利用した結果生じたいかなる損害についても、運営者は責任を負いません。本ツールは「現状のまま」提供されており、いかなる保証も行いません。',
  },
  {
    title: 'お問い合わせ',
    body: null,
    isContact: true,
  },
]

export default function Disclaimer() {
  return (
    <div style={{ padding:'28px 32px 48px' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'4px' }}>
        免責事項
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'28px' }}>
        StockWaveJP 利用規約・免責事項・お問い合わせ
      </p>

      {SECTIONS.map((s,i) => (
        <div key={i} style={{
          background:'var(--bg2)', border:'1px solid var(--border)',
          borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:'12px',
          animation:`fadeUp 0.3s ease ${i*0.06}s both`,
        }}>
          <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>
            {s.title}
          </div>
          {s.isContact ? (
            <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.8 }}>
              <p style={{ marginBottom:'12px' }}>
                ご意見・ご要望・不具合報告などのお問い合わせは、X（旧Twitter）のDMよりお願いします。
              </p>
              <a
                href="https://twitter.com/StockWaveJP"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:'inline-flex', alignItems:'center', gap:'10px',
                  background:'rgba(91,156,246,0.1)', border:'1px solid rgba(91,156,246,0.25)',
                  borderRadius:'8px', padding:'12px 20px',
                  color:'var(--accent)', textDecoration:'none', fontWeight:600, fontSize:'14px',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(91,156,246,0.2)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(91,156,246,0.1)'}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>StockWaveJP　@StockWaveJP</span>
              </a>
              <p style={{ marginTop:'12px', fontSize:'12px', color:'var(--text3)' }}>
                ※ お返事までお時間をいただく場合がございます。あらかじめご了承ください。
              </p>
            </div>
          ) : (
            <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.8 }}>{s.body}</div>
          )}
        </div>
      ))}

      <div style={{ fontSize:'12px', color:'var(--text3)', marginTop:'20px', textAlign:'center' }}>
        © 2026 StockWaveJP. All rights reserved.
      </div>
    </div>
  )
}
