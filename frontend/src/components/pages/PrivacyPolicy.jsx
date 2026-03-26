export default function PrivacyPolicy() {
  return (
    <div style={{ padding:'28px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, color:'#e8f0ff', marginBottom:'4px' }}>プライバシーポリシー</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'32px' }}>最終更新日：2026年3月26日</p>

      {[
        {
          title: '1. 基本方針',
          body: `StockWaveJP（以下「当サイト」）は、ユーザーの個人情報の取り扱いについて、以下のポリシーを定めます。当サイトは個人情報保護の重要性を認識し、適切な保護に努めます。`,
        },
        {
          title: '2. 収集する情報',
          body: `当サイトは以下の情報を収集することがあります。\n\n・アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）\n・Googleアナリティクスによる利用状況データ（ページビュー、滞在時間等）\n・ユーザーがカスタムテーマ機能で入力したデータ（ブラウザのローカルストレージに保存）\n\n氏名・メールアドレス等の個人を特定できる情報は収集していません。`,
        },
        {
          title: '3. Cookieの使用',
          body: `当サイトは、ユーザー体験の向上および利用状況の分析を目的として、Cookieを使用しています。\n\n・Google Analytics：サイトの利用状況を分析するために使用します。収集されたデータは匿名化されており、個人を特定できません。\n・Google AdSense：広告配信の最適化のために使用します。\n\nブラウザの設定によりCookieを無効にすることができますが、一部の機能が正常に動作しなくなる場合があります。`,
        },
        {
          title: '4. 広告について',
          body: `当サイトは、第三者配信事業者であるGoogleが提供する広告サービス「Google AdSense」を利用しています。Googleを含む第三者配信事業者は、Cookieを使用して、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。\n\nユーザーは、Googleの広告設定でパーソナライズ広告を無効にできます。また、www.aboutads.info にアクセスすることで、第三者配信事業者のCookieを無効にすることも可能です。`,
        },
        {
          title: '5. アクセス解析ツール',
          body: `当サイトではGoogleアナリティクスを使用しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。`,
        },
        {
          title: '6. 免責事項',
          body: `当サイトに掲載されている情報は、信頼できると考えられる情報源に基づいて作成していますが、その正確性・完全性を保証するものではありません。当サイトの情報を参考にして生じたいかなる損害についても、当サイト運営者は一切責任を負いません。`,
        },
        {
          title: '7. プライバシーポリシーの変更',
          body: `本ポリシーの内容は、法令その他の事情の変化により、予告なく変更することがあります。変更後のポリシーは本ページに掲載した時点で効力を生じます。`,
        },
        {
          title: '8. お問い合わせ',
          body: `プライバシーポリシーに関するお問い合わせは、X（旧Twitter）のDM（@StockWaveJP）またはサイト内のお問い合わせフォームよりご連絡ください。`,
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
