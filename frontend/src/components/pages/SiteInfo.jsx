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

      {/* 独自機能バッジ */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'12px', padding:'22px 26px', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
          <span style={{ fontSize:'22px' }}>⚡</span>
          <h2 style={{ fontSize:'15px', fontWeight:700, color:'#e8f0ff', margin:0,
            borderLeft:'3px solid #ffd619', paddingLeft:'10px' }}>
            StockWaveJPでしか見られない機能
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'10px' }}>
          {[
            { icon:'📡', title:'騰落モメンタム', desc:'🔥加速・↗転換↑・→横ばい・↘転換↓・❄️失速の5分類は当サイト独自の指標' },
            { icon:'🗺️', title:'テーマ×期間ヒートマップ', desc:'30テーマの騰落率を1週〜1年の複数期間で同時比較できる' },
            { icon:'📊', title:'三指標同時表示', desc:'騰落率・出来高・売買代金を30テーマ分まとめてランキング表示' },
            { icon:'⚙️', title:'カスタムテーマ', desc:'自分だけのテーマを作成して独自の銘柄群を追跡できる' },
            { icon:'📈', title:'マクロ連動表示', desc:'日経平均・ドル円・VIX等のマクロ指標とテーマ動向を同時確認' },
            { icon:'📰', title:'週次レポート', desc:'毎週の相場振り返りと来週の注目ポイントを編集部が解説' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background:'rgba(74,158,255,0.04)',
              border:'1px solid rgba(74,158,255,0.15)', borderRadius:'8px',
              padding:'12px 14px' }}>
              <div style={{ fontSize:'18px', marginBottom:'6px' }}>{icon}</div>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--accent)', marginBottom:'4px' }}>{title}</div>
              <div style={{ fontSize:'11px', color:'var(--text3)', lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
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


      {/* 運営者情報 */}
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'22px 26px', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
          <span style={{ fontSize:'22px' }}>🏢</span>
          <h2 style={{ fontSize:'15px', fontWeight:700, color:'#e8f0ff', margin:0,
            borderLeft:'3px solid #4a9eff', paddingLeft:'10px' }}>
            運営者情報
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:'12px 24px', fontSize:'13px', marginBottom:'14px' }}>
          {[
            ['サイト名', 'StockWaveJP'],
            ['URL', 'https://stockwavejp.com'],
            ['運営開始', '2026年3月'],
            ['運営者', 'StockWaveJP編集部（兼業日米株投資家）'],
            ['目的', '日本株テーマ別の騰落率・出来高・売買代金をリアルタイムで可視化し、投資判断の参考情報を提供すること'],
            ['対象ユーザー', '日本株に興味を持つ個人投資家・投資初心者'],
          ].map(([label, value], i) => (
            <div key={i} style={{ display:'contents' }}>
              <span style={{ color:'var(--text3)', fontWeight:600, letterSpacing:'0.05em', fontSize:'11px',
                textTransform:'uppercase', alignSelf:'start', paddingTop:'2px' }}>{label}</span>
              <span style={{ color:'var(--text2)', lineHeight:1.7 }}>
                {label === '運営者' ? (
                  <a href="https://twitter.com/StockWaveJP" target="_blank" rel="noopener noreferrer"
                    style={{ color:'var(--accent)', textDecoration:'none' }}>
                    {value}
                  </a>
                ) : value}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9 }}>
          StockWaveJPは、日本株のテーマ別動向を視覚的に把握するためのダッシュボードです。
          個別銘柄の推奨や投資助言は行っておらず、あくまで「市場全体のテーマの流れを把握する」ための
          情報提供ツールです。実際の投資判断は、必ずご自身の責任において行ってください。
        </div>
      </div>

      {/* 運営者プロフィール */}
      <div style={{ background:'var(--bg2)', border:'1px solid rgba(74,158,255,0.2)',
        borderRadius:'12px', padding:'22px 26px', marginBottom:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
          <span style={{ fontSize:'22px' }}>👤</span>
          <h2 style={{ fontSize:'15px', fontWeight:700, color:'#e8f0ff', margin:0,
            borderLeft:'3px solid #aa77ff', paddingLeft:'10px' }}>
            運営者プロフィール
          </h2>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:'20px', flexWrap:'wrap' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'50%',
            background:'linear-gradient(135deg,#4a9eff,#aa77ff)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'28px', flexShrink:0 }}>📊</div>
          <div style={{ flex:1, minWidth:'200px' }}>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#e8f0ff', marginBottom:'4px' }}>
              StockWaveJP編集部
            </div>
            <div style={{ fontSize:'12px', color:'var(--accent)', marginBottom:'12px', fontWeight:600 }}>
              兼業日米株投資家
            </div>
            <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:2 }}>
              日本株・米国株に投資する個人投資家として、テーマ株の資金フローを独自に追跡・分析しています。
              「どのテーマに資金が集まっているか」「モメンタムはどう変化しているか」を客観的なデータで
              可視化することで、感情に左右されない投資判断をサポートしたいという思いからStockWaveJPを開発しました。
              <br /><br />
              日米両市場の特性の違い（日本株のテーマ集中度の高さ・政策感応度の強さ）を踏まえた
              分析視点を大切にしています。騰落率・出来高・売買代金・モメンタムの4指標を組み合わせた
              テーマ分析アプローチを通じて、個人投資家が機関投資家と同じ目線でマーケットを俯瞰できる
              ツールの提供を目指しています。
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'14px', flexWrap:'wrap' }}>
              {[
                { label:'投資スタイル', value:'テーマ株モメンタム投資・長期バリュー投資' },
                { label:'投資市場',   value:'日本株・米国株（日米兼業）' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background:'rgba(74,158,255,0.07)',
                  border:'1px solid rgba(74,158,255,0.15)', borderRadius:'6px',
                  padding:'6px 12px', fontSize:'11px' }}>
                  <span style={{ color:'var(--text3)', marginRight:'6px' }}>{label}:</span>
                  <span style={{ color:'var(--accent)', fontWeight:600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
