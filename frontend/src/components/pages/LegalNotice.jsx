export default function LegalNotice() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.9, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'14px', fontWeight:700, color:'var(--text)', margin:'24px 0 8px', paddingBottom:'6px', borderBottom:'1px solid var(--border)' }
  const p  = { marginBottom:'12px' }
  const row = (label, value) => (
    <div key={label} style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'8px 16px', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'13px' }}>
      <span style={{ color:'var(--text3)', fontWeight:600 }}>{label}</span>
      <span style={{ color:'var(--text2)' }}>{value}</span>
    </div>
  )
  return (
    <div style={s}>
      <h1 style={h1}>特定商取引法に基づく表示</h1>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)' }}>特定商取引に関する法律第11条に基づき、以下の通り表示します。</p>
      <h2 style={h2}>販売業者・サービス運営者</h2>
      <div>
        {row('販売業者', 'StockWaveJP運営')}
        {row('所在地', '請求があった場合には、遅滞なく開示します。')}
        {row('電話番号', '請求があった場合には、遅滞なく開示します。')}
        {row('メールアドレス', 'stockwavejp26@gmail.com')}
        {row('サービス名', 'StockWaveJP')}
        {row('サービスURL', 'https://stockwavejp.com')}
      </div>
      <h2 style={h2}>販売価格</h2>
      <div>
        {row('Free プラン', '無料（永久）')}
        {row('スタンダード プラン', '月額 ¥980（税込）／年額 ¥9,800（税込）')}
        {row('プロ プラン', '月額 ¥1,980（税込）／年額 ¥19,800（税込）')}
      </div>
      <h2 style={h2}>支払い方法・支払い時期</h2>
      <div>
        {row('支払い方法', 'クレジットカード（Visa・Mastercard・American Express・JCB）')}
        {row('支払い時期', '月払い：毎月契約日に自動課金　年払い：毎年契約日に自動課金')}
        {row('決済処理', 'Stripe（ストライプジャパン株式会社）')}
      </div>
      <h2 style={h2}>契約期間・自動更新</h2>
      <p style={p}>有料プランは自動更新制です。解約は契約期間終了日の前日までにマイページの設定よりお手続きください。</p>
      <h2 style={h2}>返金・キャンセルポリシー</h2>
      <p style={p}>原則として返金は行いません。ただしサービス重大障害（連続7日以上）・二重請求・法令上の消費者保護規定が適用される場合は例外とします。</p>
      <h2 style={h2}>お問い合わせ</h2>
      <p style={p}>
        <a href="mailto:stockwavejp26@gmail.com" style={{ color:'var(--accent)' }}>stockwavejp26@gmail.com</a><br/>
        受付後5営業日以内に対応いたします。
      </p>
      <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'24px' }}>最終更新日: 2026年5月21日</p>
    </div>
  )
}
