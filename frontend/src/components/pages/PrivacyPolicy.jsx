export default function PrivacyPolicy() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.8, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'15px', fontWeight:700, color:'var(--text)', margin:'28px 0 10px' }
  const p  = { marginBottom:'12px' }

  return (
    <div style={s}>
      <h1 style={h1}>プライバシーポリシー</h1>
      <p style={p}>最終更新日：2025年3月1日</p>
      <p style={p}>StockWaveJP（以下「本サービス」）は、利用者のプライバシーを尊重し、個人情報の適切な取り扱いに努めます。</p>

      <h2 style={h2}>1. 収集する情報</h2>
      <p style={p}><strong>アカウント情報</strong>：Googleアカウントでログインする場合、氏名・メールアドレス・プロフィール画像を取得します。</p>
      <p style={p}><strong>決済情報</strong>：有料プランのご利用にあたり、決済処理はStripe（ストライプジャパン株式会社）が行います。当サービスはクレジットカード番号等の機密決済情報を直接収集・保存しません。Stripeは決済処理のために必要な情報を収集します（詳細はStripeのプライバシーポリシーをご参照ください）。</p>
      <p style={p}><strong>利用データ</strong>：閲覧ページ・機能利用状況・アクセス時刻などのサービス利用ログを収集します。</p>
      <p style={p}><strong>カスタムテーマ・設定データ</strong>：ログインユーザーが保存したカスタムテーマ・設定情報をデータベースに保存します。</p>
      <p style={p}><strong>クッキー・ローカルストレージ</strong>：ユーザー設定の保存・セッション管理のためにブラウザのローカルストレージを使用します。</p>

      <h2 style={h2}>2. 情報の利用目的</h2>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>サービスの提供・維持・改善</li>
        <li>アカウント認証・セキュリティ確保</li>
        <li>有料プランの管理・請求処理</li>
        <li>サービスに関する重要なご連絡（更新・変更・障害通知等）</li>
        <li>不正アクセス・不正利用の検知・防止</li>
      </ul>
      <p style={p}>マーケティング目的での個人情報の利用、および第三者への個人情報の販売は行いません。</p>

      <h2 style={h2}>3. 情報の共有</h2>
      <p style={p}>以下の場合を除き、個人情報を第三者と共有することはありません：</p>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li><strong>Stripe（ストライプジャパン株式会社）</strong>：有料プランの決済処理のため。Stripeは独立したデータ管理者として個人データを処理します。</li>
        <li><strong>Supabase</strong>：認証・データベースサービスの提供のため</li>
        <li><strong>GitHub Pages</strong>：サイトホスティングのため</li>
        <li><strong>法令に基づく場合</strong>：裁判所・行政機関から法令に基づく開示要求を受けた場合</li>
      </ul>

      <h2 style={h2}>4. Stripe決済について</h2>
      <p style={p}>有料プランの決済はStripeを通じて処理されます。当サービスのCheckout画面でStripeのサービスを利用する際、Stripeは決済に関連する個人データ（連絡先情報・決済手段の詳細・取引データ等）を収集・処理します。Stripeによる個人データの取り扱いについては、Stripeのプライバシーポリシー（<a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" style={{ color:'var(--accent)' }}>https://stripe.com/jp/privacy</a>）をご確認ください。</p>

      <h2 style={h2}>5. Google認証について</h2>
      <p style={p}>本サービスはGoogleのOAuth認証を使用します。Googleから取得する情報はメールアドレス・氏名・プロフィール画像のみです。Googleのプライバシーポリシーは <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color:'var(--accent)' }}>https://policies.google.com/privacy</a> をご参照ください。</p>

      <h2 style={h2}>6. データの保管・セキュリティ</h2>
      <p style={p}>個人情報はSupabase（米国）のデータベースに暗号化して保管します。Row Level Security（RLS）を実装し、本人以外からのアクセスを防止しています。ただし、インターネットを経由した情報送信の完全なセキュリティを保証することはできません。</p>

      <h2 style={h2}>7. データの保持期間</h2>
      <p style={p}>アカウントデータはアカウント削除まで保持します。決済に関するデータはStripeが管理します（Stripeの保持ポリシーに従います）。ログデータは最長90日間保持した後、自動的に削除されます。</p>

      <h2 style={h2}>8. 利用者の権利</h2>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>保有する個人情報の開示・訂正を求める権利</li>
        <li>個人情報の削除を求める権利（アカウント削除）</li>
        <li>個人情報の処理への異議申立て権</li>
      </ul>
      <p style={p}>これらの権利を行使する場合は、info@stockwavejp.com までご連絡ください。</p>

      <h2 style={h2}>9. 未成年者について</h2>
      <p style={p}>本サービスは18歳未満の方を対象としておらず、意図的に未成年者の個人情報を収集しません。</p>

      <h2 style={h2}>10. ポリシーの変更</h2>
      <p style={p}>本ポリシーを変更する場合は、本ページで更新日とともに公表します。有料会員には変更の30日前までにメール通知を行います。</p>

      <h2 style={h2}>11. お問い合わせ</h2>
      <p style={p}>本ポリシーに関するご質問は、info@stockwavejp.com までお問い合わせください。</p>
    </div>
  )
}
