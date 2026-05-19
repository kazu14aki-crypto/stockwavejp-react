export default function TermsOfService() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.8, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'15px', fontWeight:700, color:'var(--text)', margin:'28px 0 10px' }
  const p  = { marginBottom:'12px' }

  return (
    <div style={s}>
      <h1 style={h1}>利用規約</h1>
      <p style={p}>最終更新日：2025年3月1日</p>
      <p style={p}>本利用規約（以下「本規約」）は、StockWaveJP（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただくことで、本規約に同意いただいたものとみなします。</p>

      <h2 style={h2}>1. サービスの概要と性質</h2>
      <p style={p}>本サービスは、日本株式市場のテーマ別騰落率・出来高・売買代金の可視化ツールです。<strong>投資参考情報の提供を目的としており、投資助言・売買推奨を行うものではありません。</strong>本サービスは金融商品取引法に基づく投資助言業の登録を行っておらず、特定の有価証券の売買を推奨・勧誘するものではありません。</p>

      <h2 style={h2}>2. 利用資格</h2>
      <p style={p}>本サービスは18歳以上の方にご利用いただけます。未成年者がご利用になる場合は、保護者の同意が必要です。日本法その他適用法令に違反しない範囲でご利用ください。</p>

      <h2 style={h2}>3. アカウント</h2>
      <p style={p}>Googleアカウントを使用してログインすることで、カスタムテーマ保存等の追加機能をご利用いただけます。アカウント情報の管理はご自身の責任において行ってください。以下に該当する場合、事前通知なしにアカウントを停止・削除することがあります：本規約への違反、不正アクセス・不正利用、サービスの運営妨害行為。</p>

      <h2 style={h2}>4. 有料プラン・決済（Stripe）</h2>
      <p style={p}>本サービスの有料プランの決済は、<strong>Stripe（ストライプジャパン株式会社）</strong>が提供する決済処理サービスを通じて行われます。</p>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>クレジットカード情報はStripeが管理し、当サービスはカード番号等の機密情報を保持しません</li>
        <li>Stripeの利用規約（<a href="https://stripe.com/jp/legal/ssa" target="_blank" rel="noopener noreferrer" style={{ color:'var(--accent)' }}>https://stripe.com/jp/legal/ssa</a>）が決済に適用されます</li>
        <li>決済手段：クレジットカード（Visa・Mastercard・American Express・JCB）</li>
        <li>請求サイクル：月払いは毎月同日、年払いは毎年同日に自動更新されます</li>
        <li>領収書はStripeよりメールで送付されます</li>
      </ul>

      <h2 style={h2}>5. 自動更新・解約</h2>
      <p style={p}>有料プランは<strong>自動更新制</strong>です。契約期間終了日の翌日に自動的に同一プランが更新されます。解約をご希望の場合は、契約期間終了日の前日までに設定ページよりお手続きください。<strong>契約期間中に解約された場合も、契約終了日まで全ての機能を引き続きご利用いただけます。</strong>日割り返金は行いません。</p>

      <h2 style={h2}>6. 返金ポリシー</h2>
      <p style={p}>原則として、お支払い済みの料金の返金は行いません。ただし、以下の場合は例外とします：</p>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>当サービスの重大な障害により、連続7日間以上サービスが利用できない場合</li>
        <li>当サービス側の過誤による二重請求が発生した場合</li>
      </ul>
      <p style={p}>返金のご請求はstockwavejp26@gmail.comまでお問い合わせください。</p>

      <h2 style={h2}>7. 禁止事項</h2>
      <ul style={{ paddingLeft:'20px', marginBottom:'12px' }}>
        <li>本サービスのデータ・コンテンツの無断複製・転載・商業利用</li>
        <li>自動クローリング・スクレイピング等によるデータの大量取得</li>
        <li>本サービスのシステムやセキュリティへの攻撃・不正アクセス試行</li>
        <li>他の利用者または第三者の権利を侵害する行為</li>
        <li>虚偽情報の登録・送信</li>
        <li>法令または公序良俗に反する行為</li>
        <li>本サービスの情報を投資勧誘目的で第三者に提供する行為</li>
      </ul>

      <h2 style={h2}>8. 知的財産権</h2>
      <p style={p}>本サービスのコンテンツ（テーマ分析記事・コラム・グラフ・UI設計等）に関する知的財産権はStockWaveJP運営者に帰属します。個人的・非商業的な目的での閲覧・参照のみを許可します。</p>

      <h2 style={h2}>9. 免責事項</h2>
      <p style={p}>本サービスの情報に基づく投資判断の結果生じた損失について、運営者は一切責任を負いません。本サービスは現状有姿で提供され、特定目的への適合性・完全性・中断なきサービス提供を保証しません。</p>

      <h2 style={h2}>10. サービスの変更・終了</h2>
      <p style={p}>運営者は事前通知なく本サービスの内容を変更できます。有料サービス利用中の場合、サービス終了の30日前までにメールにてお知らせします。</p>

      <h2 style={h2}>11. 個人情報の取り扱い</h2>
      <p style={p}>本サービスにおける個人情報の取り扱いは、別途定めるプライバシーポリシーに従います。Stripeを通じた決済情報については、Stripeのプライバシーポリシー（<a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" style={{ color:'var(--accent)' }}>https://stripe.com/jp/privacy</a>）が適用されます。</p>

      <h2 style={h2}>12. 規約の変更</h2>
      <p style={p}>本規約を変更する場合は、本ページで更新日とともに公表します。有料会員には変更の30日前までにメールでお知らせします。変更後も引き続きご利用いただいた場合、変更後の規約に同意いただいたものとみなします。</p>

      <h2 style={h2}>13. 準拠法・管轄裁判所</h2>
      <p style={p}>本規約は日本法に準拠します。本サービスの利用に関して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>

      <h2 style={h2}>14. お問い合わせ</h2>
      <p style={p}>本規約に関するご質問・解約のお申し出は、stockwavejp26@gmail.com までお問い合わせください。</p>
    </div>
  )
}
