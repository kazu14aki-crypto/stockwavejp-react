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
        {row('Free プラン', '無料')}
        {row('スタンダード プラン', '月額 ¥980（税込）')}
        {row('プロ プラン', '月額 ¥1,980（税込）')}
        {row('備考', '年額プランは現在提供していません。上記のほかに必要となる料金はありません（通信費は利用者負担）。')}
      </div>
      <h2 style={h2}>支払い方法・支払い時期</h2>
      <div>
        {row('支払い方法', 'クレジットカード（Visa・Mastercard・American Express・JCB）')}
        {row('支払い時期', '初回：申込時に課金　以降：毎月の更新日に自動課金')}
        {row('決済処理', 'Stripe（ストライプジャパン株式会社）')}
      </div>
      <h2 style={h2}>役務の提供時期</h2>
      <p style={p}>決済完了後、直ちに有料プランの機能をご利用いただけます。</p>
      <h2 style={h2}>無料体験</h2>
      <p style={p}>初回ログインから14日間、プロプラン相当の機能を無料でお試しいただけます（アカウントごとに1回）。無料体験にクレジットカードの登録は不要で、体験期間終了により自動的に課金されることはありません。</p>
      <h2 style={h2}>契約期間・自動更新・解約方法</h2>
      <p style={p}>有料プランは1か月ごとの自動更新制です。解約は、サイト内の「設定」ページからいつでもお手続きいただけます。次回更新日の前日までに解約された場合、次回以降の請求は発生しません。解約後も現契約期間の末日までは有料機能をご利用いただけます。</p>
      <h2 style={h2}>動作環境</h2>
      <p style={p}>最新版のGoogle Chrome / Microsoft Edge / Safari / Firefox を推奨します。インターネット接続環境が必要です。</p>
      <h2 style={h2}>返金・キャンセルポリシー</h2>
      <p style={p}>デジタルコンテンツ・役務の性質上、決済完了後の返金・キャンセルは原則としてお受けできません（特定商取引法上のクーリングオフの適用はありません）。ただし、当サービスの責めに帰すべき重大な障害（連続7日以上の利用不能）・二重請求その他決済上の誤り・法令上の消費者保護規定が適用される場合はこの限りではありません。</p>
      <h2 style={h2}>お問い合わせ</h2>
      <p style={p}>
        <a href="mailto:stockwavejp26@gmail.com" style={{ color:'var(--accent)' }}>stockwavejp26@gmail.com</a><br/>
        受付後5営業日以内に対応いたします。
      </p>
      <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'24px' }}>最終更新日: 2026年7月5日</p>
    </div>
  )
}
