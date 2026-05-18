export default function LegalNotice() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.9, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'14px', fontWeight:700, color:'var(--text)', margin:'24px 0 8px', paddingBottom:'6px', borderBottom:'1px solid var(--border)' }
  const p  = { marginBottom:'10px' }
  const row = (label, value) => (
    <div key={label} style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'8px 16px',
      padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'13px' }}>
      <span style={{ color:'var(--text3)', fontWeight:600 }}>{label}</span>
      <span style={{ color:'var(--text2)' }}>{value}</span>
    </div>
  )

  return (
    <div style={s}>
      <h1 style={h1}>特定商取引法に基づく表示</h1>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)' }}>
        特定商取引に関する法律第11条（通信販売についての広告）に基づき、以下の通り表示します。
      </p>

      <h2 style={h2}>販売業者・サービス運営者</h2>
      <div>
        {row('販売業者', 'StockWaveJP運営')}
        {row('所在地', '請求があった場合には、遅滞なく開示します。')}
        {row('電話番号', '請求があった場合には、遅滞なく開示します。')}
        {row('メールアドレス', 'info@stockwavejp.com')}
        {row('サービス名', 'StockWaveJP')}
        {row('サービスURL', 'https://stockwavejp.com')}
      </div>

      <h2 style={h2}>販売価格</h2>
      <div>
        {row('Free プラン', '無料（永久）')}
        {row('スタンダード プラン', '月額 ¥1,180（税込）／年額 ¥11,800（税込）')}
        {row('プロ プラン', '月額 ¥1,980（税込）／年額 ¥19,800（税込）')}
      </div>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)', marginTop:'8px' }}>
        ※ 表示価格はすべて消費税10%を含む税込価格です。<br/>
        ※ 料金は予告なく変更する場合があります。変更前に登録メールアドレスへご連絡します。
      </p>

      <h2 style={h2}>支払い方法・支払い時期</h2>
      <div>
        {row('支払い方法', 'クレジットカード（Visa・Mastercard・American Express・JCB）')}
        {row('支払い時期', '月払い：毎月契約日に自動課金　年払い：毎年契約日に自動課金')}
        {row('決済処理', 'Stripe（ストライプジャパン株式会社）')}
      </div>

      <h2 style={h2}>サービス提供時期</h2>
      <p style={p}>
        お支払い確認後、直ちにご利用いただけます。サービスはオンラインにて提供されます。
      </p>

      <h2 style={h2}>契約期間・自動更新</h2>
      <p style={p}>
        有料プランは<strong>自動更新制</strong>です。契約期間終了日の翌日に同一プランが自動的に更新されます。
        解約をご希望の場合は、<strong>契約期間終了日の前日まで</strong>にマイページの設定よりお手続きください。
        契約期間中に解約された場合も、期間終了日まで全ての機能をご利用いただけます。
      </p>

      <h2 style={h2}>返金・キャンセルポリシー</h2>
      <p style={p}>
        原則として、お支払い済み料金の返金は行いません。ただし以下の場合は例外とします。
      </p>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>当サービスの重大な障害により、連続7日間以上サービスが利用できなかった場合</li>
        <li>当サービス側の過誤による二重請求が発生した場合</li>
        <li>法令上の消費者保護規定が適用される場合</li>
      </ul>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)' }}>
        返金のご請求は info@stockwavejp.com までお問い合わせください。
      </p>

      <h2 style={h2}>動作環境</h2>
      <div>
        {row('対応ブラウザ', 'Google Chrome / Mozilla Firefox / Apple Safari / Microsoft Edge（各最新版推奨）')}
        {row('対応デバイス', 'PC・スマートフォン・タブレット（インターネット接続環境が必要）')}
      </div>

      <h2 style={h2}>サービスの中断・終了</h2>
      <p style={p}>
        システムメンテナンスや不測の事態により、予告なくサービスを一時中断する場合があります。
        有料サービスを終了する場合は、30日前までに登録メールアドレスへご連絡します。
      </p>

      <h2 style={h2}>投資情報に関する免責</h2>
      <p style={p}>
        本サービスは金融商品取引法に基づく投資助言業の登録を行っておらず、
        特定の有価証券の売買を推奨・勧誘するものではありません。
        本サービスの情報に基づく投資判断の結果生じた損失について、当運営者は一切責任を負いません。
      </p>

      <h2 style={h2}>お問い合わせ</h2>
      <p style={p}>
        特定商取引法に関するご請求・お問い合わせは、下記のメールアドレスまでご連絡ください。<br/>
        受付後、5営業日以内に対応いたします。
      </p>
      <div style={{ padding:'12px 16px', background:'var(--bg2)', borderRadius:'8px',
        border:'1px solid var(--border)', fontSize:'13px' }}>
        メールアドレス: <a href="mailto:info@stockwavejp.com" style={{ color:'var(--accent)' }}>
          info@stockwavejp.com
        </a>
      </div>

      <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'24px' }}>
        最終更新日: 2025年3月1日
      </p>
    </div>
  )
}
