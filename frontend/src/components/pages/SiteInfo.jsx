export default function SiteInfo() {
  return (
    <div style={{ padding: '28px 32px 60px', maxWidth: '760px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e8f0ff', marginBottom: '4px' }}>
        当サイトについて
      </h1>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '32px' }}>
        StockWaveJP の目的と作成の背景
      </p>

      {/* メインビジョン */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74,158,255,0.1), rgba(255,69,96,0.07))',
        border: '1px solid rgba(74,158,255,0.2)',
        borderRadius: '12px', padding: '28px 32px', marginBottom: '24px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.15em',
          textTransform: 'uppercase', marginBottom: '12px' }}>
          Mission
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#e8f0ff', marginBottom: '20px', lineHeight: 1.5 }}>
          StockWaveJPが目指すもの：主観を排した相場の可視化
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 2, margin: 0 }}>
            株式市場において、投資家が分析に割ける時間は限られています。StockWaveJPは、その限られた時間の中で最大のインサイト（洞察）を得るために設計された客観的データプラットフォームです。
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 2, margin: 0 }}>
            独自のセクター分類と集計アルゴリズムにより、国内主要大型株の騰落トレンドを数値化。個別のニュースや主観的なバイアスを完全に排除し、純粋な資金の流入・流出という「事実」のみをランキング形式で直感的に表示します。
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 2, margin: 0 }}>
            複雑な分析にかかる労力を最小化し、誰もが瞬時に現在の相場の全体像を掴める。そんな「速さ」と「客観性」を両立したツールとして、皆様のフラットな投資判断に貢献します。
          </p>
        </div>
      </div>

      {[
        {
          icon: '🎯',
          title: 'このサイトの目的',
          color: '#4a9eff',
          content: `日本株の投資情報は、証券会社のツールや有料サービスに集中しており、初心者が「今どのテーマが動いているか」を無料で把握できる場所が少ないという課題がありました。

StockWaveJPは、半導体・AI・防衛・インバウンドなど30の投資テーマについて、騰落率・出来高・売買代金を自動集計し、「資金の流れ」を視覚的に把握できるダッシュボードとして開発しました。

投資助言や個別銘柄の推奨ではなく、「今市場は何を注目しているか」を客観的なデータで提供することを第一の目的としています。`,
        },
        {
          icon: '💡',
          title: '作成の背景・理由',
          color: '#aa77ff',
          content: `株式市場では、個別銘柄の分析だけでなく「どのテーマやセクターに資金が流れているか」という大局観が投資判断に非常に重要です。しかし、テーマ別の騰落率・出来高・売買代金を一元管理できる無料ツールは国内に限られていました。

特に投資初心者の方が「今日半導体が上がっているのはわかった、でも他のテーマはどうなの？」という疑問を持ったとき、比較できるデータに無料でアクセスできる場所を作りたいという思いから、このサイトを開発しました。

また、テーマ株投資の「流れを読む」楽しさを、より多くの方に体験してもらいたいという思いも込めています。`,
        },
        {
          icon: '🔧',
          title: '技術と運営について',
          color: '#06d6a0',
          content: `当サイトはReact（フロントエンド）とFastAPI（バックエンド）を用いて構築されており、GitHub PagesとRender.comでホスティングされています。

データはyfinance経由で取得し、GitHub Actionsにより平日の前場寄り付き後・前場引け後・後場引け後の1日3回自動更新されます。

表示されるデータは当サイトが独自に集計・算出したものであり、公式の指数値（日経平均株価・TOPIX等）ではありません。あくまで参考情報として提供しています。`,
        },
        {
          icon: '🗺️',
          title: '今後の展望',
          color: '#ff8c42',
          content: `現在は日本株テーマの騰落率可視化を中心としていますが、今後はより詳細な分析機能やアラート機能なども検討しています。

また、現在は個人が非商用で運営していますが、適切なデータライセンスを取得したうえで、より信頼性の高いデータの提供も視野に入れています。

ご意見・ご要望はX（旧Twitter）@StockWaveJP のDMまたはお問い合わせフォームよりお気軽にお寄せください。ユーザーの皆様のフィードバックがサービス改善の原動力です。`,
        },
      ].map((sec, i) => (
        <div key={i} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '22px 26px', marginBottom: '16px',
          animation: `fadeUp 0.3s ease ${i * 0.08}s both`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '22px' }}>{sec.icon}</span>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#e8f0ff', margin: 0,
              borderLeft: `3px solid ${sec.color}`, paddingLeft: '10px' }}>
              {sec.title}
            </h2>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 2, whiteSpace: 'pre-line' }}>
            {sec.content}
          </div>
        </div>
      ))}

      {/* 連絡先 */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <a href="https://twitter.com/StockWaveJP" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(91,156,246,0.1)', border: '1px solid rgba(91,156,246,0.25)',
            borderRadius: '8px', padding: '12px 24px',
            color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X（旧Twitter）@StockWaveJP
        </a>
      </div>
    </div>
  )
}
