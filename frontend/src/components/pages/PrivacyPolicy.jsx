export default function PrivacyPolicy() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.9, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'14px', fontWeight:700, color:'var(--text)', margin:'24px 0 8px', paddingBottom:'6px', borderBottom:'1px solid var(--border)' }
  const p  = { marginBottom:'12px' }
  const li = { marginBottom:'6px', paddingLeft:'4px' }

  return (
    <div style={s}>
      <h1 style={h1}>プライバシーポリシー</h1>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)' }}>最終更新日：2026年5月21日</p>
      <p style={p}>
        StockWaveJP（以下「本サービス」）は、利用者のプライバシーを尊重し、個人情報の適切な取り扱いに努めます。
        本サービスは日本・英語圏・欧州連合（EU）を含む国際的なユーザーを対象としており、EU一般データ保護規則（GDPR）を含む適用法令を遵守します。
      </p>

      <h2 style={h2}>1. 収集する情報</h2>
      <p style={p}><strong>アカウント情報</strong>：Googleアカウントでログインする場合、氏名・メールアドレス・プロフィール画像を取得します。</p>
      <p style={p}><strong>決済情報</strong>：有料プランの決済はStripe（ストライプジャパン株式会社）が処理します。当サービスはクレジットカード番号等の機密決済情報を直接収集・保存しません。</p>
      <p style={p}><strong>利用データ</strong>：閲覧ページ・機能利用状況・アクセス時刻などを収集します。</p>
      <p style={p}><strong>クッキー・ローカルストレージ</strong>：ユーザー設定の保存・セッション管理のためにブラウザのローカルストレージを使用します。</p>

      <h2 style={h2}>2. 情報の利用目的</h2>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}>サービスの提供・維持・改善</li>
        <li style={li}>アカウント認証・セキュリティ確保</li>
        <li style={li}>有料プランの管理・請求処理</li>
        <li style={li}>サービスに関する重要なご連絡（更新・変更・障害通知等）</li>
        <li style={li}>不正アクセス・不正利用の検知・防止</li>
      </ul>
      <p style={p}>マーケティング目的での個人情報の利用、および第三者への個人情報の販売は行いません。</p>

      <h2 style={h2}>3. 情報の共有</h2>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}><strong>Stripe</strong>：有料プランの決済処理のため</li>
        <li style={li}><strong>Supabase</strong>：認証・データベースサービスの提供のため（米国）</li>
        <li style={li}><strong>GitHub Pages</strong>：サイトホスティングのため</li>
        <li style={li}><strong>法令に基づく場合</strong>：裁判所・行政機関から法令に基づく開示要求を受けた場合</li>
      </ul>

      <h2 style={h2}>4. GDPRに基づく欧州連合（EU）ユーザーの権利</h2>
      <p style={p}>EU/EEA在住のユーザーは、GDPR（一般データ保護規則）に基づき以下の権利を有します：</p>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}><strong>アクセス権</strong>：保有する個人データの開示を求める権利</li>
        <li style={li}><strong>訂正権</strong>：不正確な個人データの訂正を求める権利</li>
        <li style={li}><strong>削除権（忘れられる権利）</strong>：個人データの削除を求める権利</li>
        <li style={li}><strong>処理制限権</strong>：個人データの処理を制限する権利</li>
        <li style={li}><strong>データポータビリティ権</strong>：機械可読形式でのデータ提供を求める権利</li>
        <li style={li}><strong>異議申立権</strong>：個人データの処理に異議を申し立てる権利</li>
        <li style={li}><strong>自動化意思決定からの保護権</strong>：プロファイリング等の自動化された意思決定の対象にならない権利</li>
      </ul>
      <p style={p}>これらの権利を行使する場合は <a href="mailto:stockwavejp26@gmail.com" style={{ color:'var(--accent)' }}>stockwavejp26@gmail.com</a> までご連絡ください。1ヶ月以内に対応いたします。</p>
      <p style={p}>EU監督機関への申立権：お住まいのEU加盟国のデータ保護機関（DPA）に申し立てを行う権利があります。</p>

      <h2 style={h2}>5. データ処理の法的根拠（GDPR第6条）</h2>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}><strong>契約履行</strong>（第6条1項b）：サービス提供のために必要な処理</li>
        <li style={li}><strong>正当な利益</strong>（第6条1項f）：不正利用防止・セキュリティ確保のための処理</li>
        <li style={li}><strong>法的義務の遵守</strong>（第6条1項c）：法令に基づく情報保存・開示</li>
        <li style={li}><strong>同意</strong>（第6条1項a）：マーケティング等のオプション機能（現在未実施）</li>
      </ul>

      <h2 style={h2}>6. 国際データ移転</h2>
      <p style={p}>
        本サービスはSupabase（米国）・Stripe（米国）等のサービスを利用しており、個人データが欧州経済領域（EEA）外に移転される場合があります。
        これらの移転は以下の適切な保護措置のもとで行われます：
      </p>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}>EUと対象国間の適切性認定（欧州委員会が承認した国への移転）</li>
        <li style={li}>EU標準契約条項（SCCs）に基づく契約的保護措置</li>
        <li style={li}>GDPRフレームワークを採用するプロセッサーの利用（Stripe、Supabase等）</li>
      </ul>

      <h2 style={h2}>7. データの保管・セキュリティ</h2>
      <p style={p}>個人情報はSupabase（米国）のデータベースにTLS暗号化して保管します。Row Level Security（RLS）を実装し、本人以外からのアクセスを防止しています。</p>

      <h2 style={h2}>8. データの保持期間</h2>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}>アカウントデータ：アカウント削除まで</li>
        <li style={li}>決済データ：Stripeが管理（法令に基づき最低7年間保持）</li>
        <li style={li}>ログデータ：最長90日間保持後、自動削除</li>
      </ul>

      <h2 style={h2}>9. Cookieポリシー</h2>
      <p style={p}>
        本サービスは以下の目的でブラウザのローカルストレージを使用します：
      </p>
      <ul style={{ paddingLeft:'18px', marginBottom:'12px' }}>
        <li style={li}><strong>必須</strong>：ログインセッションの維持、テーマ設定の保存</li>
        <li style={li}><strong>機能</strong>：カスタムテーマのデータ保存</li>
      </ul>
      <p style={p}>広告目的のCookieやトラッキングCookieは使用していません。</p>

      <h2 style={h2}>10. 未成年者について</h2>
      <p style={p}>本サービスは18歳未満の方を対象としておらず、意図的に未成年者の個人情報を収集しません。</p>

      <h2 style={h2}>11. ポリシーの変更</h2>
      <p style={p}>本ポリシーを変更する場合は、本ページで更新日とともに公表します。重要な変更の場合は、有料会員には30日前までにメール通知します。</p>

      <h2 style={h2}>12. お問い合わせ・データ保護責任者</h2>
      <p style={p}>
        本ポリシーに関するご質問・GDPR権利行使のご請求は以下までご連絡ください：<br/>
        <a href="mailto:stockwavejp26@gmail.com" style={{ color:'var(--accent)' }}>stockwavejp26@gmail.com</a><br/>
        運営者：StockWaveJP運営<br/>
        ※ GDPRに基づくデータ主体の権利行使には1ヶ月以内に回答いたします。
      </p>
    </div>
  )
}
