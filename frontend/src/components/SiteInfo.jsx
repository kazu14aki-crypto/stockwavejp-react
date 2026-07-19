export default function SiteInfo() {
  const s    = { padding:'28px 20px 60px', maxWidth:'800px', margin:'0 auto' }
  const h1   = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }
  const h2   = { fontSize:'14px', fontWeight:700, color:'#e8f0ff', marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px' }
  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px 24px', marginBottom:'14px' }
  const p    = { fontSize:'13px', color:'var(--text2)', lineHeight:1.8, marginBottom:'10px' }

  return (
    <div style={s}>
      <h1 style={h1}>StockWaveJPについて</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px' }}>
        StockWaveJPは日本株72テーマの騰落率・出来高・売買代金をプラン別の更新頻度で可視化し、
        機関投資家レベルの資金フロー分析を個人投資家に提供するサービスです。
      </p>

      <div style={card}>
        <h2 style={h2}><span>💡</span> なぜStockWaveJPを作ったのか</h2>
        <p style={p}>個人投資家として日本株テーマ投資に取り組む中で「どのテーマに機関投資家の資金が流入しているか」をリアルタイムで把握できるツールが存在しないことに気づきました。既存ツールは高額すぎるか個別銘柄分析に特化しており、テーマ全体の資金フローを俯瞰できるものがありませんでした。</p>
        <p style={{...p, marginBottom:0}}>StockWaveJPはその空白を埋めるために作られました。72テーマの騰落率・出来高・売買代金を集計しモメンタム状態を判定、資金流入シグナルを視覚化することで個人投資家が機関投資家レベルのテーマ分析を手軽に行えることを目指しています。</p>
      </div>

      <div style={card}>
        <h2 style={h2}><span>🎯</span> ミッションと目標</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          {[
            ['📊 テーマデータの民主化', '機関投資家レベルのテーマ資金フローデータを個人投資家が利用しやすい形で提供します。'],
            ['🔍 複雑さをシンプルに', '72テーマ×5期間×3指標の膨大な情報を直感的なビジュアルシグナルに変換します。'],
            ['📈 投資判断の質を向上', '騰落率モメンタム・出来高拡大・売買代金確認というデータドリブンな根拠を提供します。'],
            ['🌐 継続的な改善', '実際の投資家フィードバックを反映しながら機能と精度を継続改善していきます。'],
          ].map(([t, d], i) => (
            <div key={i} style={{ background:'var(--bg3)', borderRadius:'8px', padding:'10px 12px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>{t}</div>
              <div style={{ fontSize:'11px', color:'var(--text3)', lineHeight:1.7 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <h2 style={h2}><span>👤</span> 開発者プロフィール</h2>
        <div style={{ display:'flex', gap:'20px', alignItems:'flex-start', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:'200px' }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
              個人投資家 ／ StockWaveJP 開発者
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:'6px 12px', fontSize:'12px', marginBottom:'12px' }}>
              {[
                ['投資歴', '約1年（日米株式、スウィング〜中期保有）'],
                ['投資スタイル', '現物・信用口座を併用したテーマ株投資'],
                ['制作動機', '自分の投資判断に使えるテーマ分析ツールが欲しかった'],
              ].map(([l, v]) => (
                <div key={l} style={{ display:'contents' }}>
                  <span style={{ color:'var(--text3)', fontWeight:600, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.04em', paddingTop:'2px' }}>{l}</span>
                  <span style={{ color:'var(--text2)', lineHeight:1.7 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.8, margin:0 }}>
              「どのテーマに資金が流れているか」を素早く把握できるツールが個人投資家には
              不足していると感じ、自ら開発したのがStockWaveJPです。
              実際の投資家目線で設計・改善を続けています。
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', minWidth:'160px' }}>
            {[
              { label:'得意テーマ', value:'半導体・AI・銀行', color:'#ff8c42' },
              { label:'保有スタイル', value:'スウィング〜中期', color:'#00c48c' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background:'var(--bg3)', borderRadius:'8px', padding:'10px 12px',
                borderLeft:`3px solid ${color}`,
              }}>
                <div style={{ fontSize:'10px', color:'var(--text3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'3px' }}>{label}</div>
                <div style={{ fontSize:'12px', color:'var(--text)', fontWeight:600 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <h2 style={h2}><span>🏢</span> 運営情報</h2>
        <div style={{ display:'grid', gridTemplateColumns:'110px 1fr', gap:'8px 16px', fontSize:'12px' }}>
          {[
            ['サービス名', 'StockWaveJP'],
            ['URL', 'https://stockwavejp.com'],
            ['お問い合わせ', 'stockwavejp26@gmail.com'],
            ['開始時期', '2025年3月'],
            ['目的', '日本株テーマ別の騰落率・出来高・売買代金の定期更新での可視化（投資参考情報の提供）'],
            ['対象ユーザー', '日本株に関心を持つ個人投資家・初心者'],
          ].map(([l, v]) => (
            <div key={l} style={{ display:'contents' }}>
              <span style={{ color:'var(--text3)', fontWeight:600, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</span>
              <span style={{ color:'var(--text2)', lineHeight:1.7 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <h2 style={h2}><span>✨</span> 主な機能</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
          {[
            '📊 72テーマの定期更新の騰落率・出来高・売買代金',
            '🔥 テーマヒートマップ（騰落率×出来高の散布図）',
            '📈 市場別ランキング（セグメント別・ETF別）',
            '🎯 注目銘柄ピックアップ（複合スコア）',
            '📰 週次マーケットレポート（自動生成）',
            '📚 テーマ別コラム記事（全72テーマ）',
            '🏦 機関投資家大量保有情報（EDINET連携）',
            '⚙️ カスタムテーマ（自分だけのウォッチリスト）',
          ].map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'4px',
              padding:'6px 10px', background:'var(--bg3)', borderRadius:'6px', fontSize:'11px', color:'var(--text2)' }}>
              {f}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
