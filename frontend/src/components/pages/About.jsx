export default function About() {
  const s    = { padding:'28px 20px 60px', maxWidth:'800px', margin:'0 auto' }
  const h1   = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }
  const h2   = { fontSize:'14px', fontWeight:700, color:'#e8f0ff', marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px' }
  const card = { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'20px 24px', marginBottom:'14px' }
  const p    = { fontSize:'13px', color:'var(--text2)', lineHeight:1.8, marginBottom:'10px' }

  return (
    <div style={s}>
      <h1 style={h1}>StockWaveJPについて</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px' }}>
        StockWaveJPは日本株67テーマの騰落率・出来高・売買代金をリアルタイムで可視化し、
        機関投資家レベルの資金フロー分析を個人投資家に提供するサービスです。
      </p>

      <div style={card}>
        <h2 style={h2}><span>💡</span> なぜStockWaveJPを作ったのか</h2>
        <p style={p}>個人投資家として日本株テーマ投資に取り組む中で「どのテーマに機関投資家の資金が流入しているか」をリアルタイムで把握できるツールが存在しないことに気づきました。既存ツールは高額すぎるか個別銘柄分析に特化しており、テーマ全体の資金フローを俯瞰できるものがありませんでした。</p>
        <p style={{...p, marginBottom:0}}>StockWaveJPはその空白を埋めるために作られました。67テーマの騰落率・出来高・売買代金を集計しモメンタム状態を判定、資金流入シグナルを視覚化することで個人投資家が機関投資家レベルのテーマ分析を手軽に行えることを目指しています。</p>
      </div>

      <div style={card}>
        <h2 style={h2}><span>🎯</span> ミッションと目標</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          {[
            ['📊 テーマデータの民主化', '機関投資家レベルのテーマ資金フローデータを個人投資家が利用しやすい形で提供します。'],
            ['🔍 複雑さをシンプルに', '67テーマ×5期間×3指標の膨大な情報を直感的なビジュアルシグナルに変換します。'],
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
        <h2 style={h2}><span>🏢</span> 運営情報</h2>
        <div style={{ display:'grid', gridTemplateColumns:'110px 1fr', gap:'8px 16px', fontSize:'12px' }}>
          {[
            ['サービス名', 'StockWaveJP'],
            ['URL', 'https://stockwavejp.com'],
            ['お問い合わせ', 'stockwavejp26@gmail.com'],
            ['開始時期', '2025年3月'],
            ['目的', '日本株テーマ別の騰落率・出来高・売買代金のリアルタイム可視化（投資参考情報の提供）'],
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
            '📊 67テーマのリアルタイム騰落率・出来高・売買代金',
            '🔥 テーマヒートマップ（騰落率×出来高の散布図）',
            '📈 市場別ランキング（セグメント別・ETF別）',
            '🎯 注目銘柄ピックアップ（複合スコア）',
            '📰 週次マーケットレポート（自動生成）',
            '📚 テーマ別コラム記事（全67テーマ）',
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

      {/* ── 料金プラン ── */}
      <div style={card}>
        <h2 style={h2}><span>💰</span> 料金プラン</h2>
        <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>
          現在は<strong style={{ color:'#4a9eff' }}>完全無料</strong>でご利用いただけます。有料プランは近日公開予定です。
        </p>
        <div style={{ overflowX:'auto', marginBottom:'20px' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr>
                {[['機能', 'left'],['Free', 'center'],['スタンダード\n¥1,180/月\n年額¥11,800', 'center'],['プロ\n¥1,980/月\n年額¥19,800', 'center']].map(([h, align], i) => (
                  <th key={i} style={{
                    padding:'10px 12px', textAlign:align,
                    background: i===1?'rgba(74,158,255,0.12)':i===2?'rgba(255,140,66,0.12)':i===3?'rgba(170,119,255,0.12)':'var(--bg3)',
                    color: i===1?'#4a9eff':i===2?'#ff8c42':i===3?'#aa77ff':'var(--text3)',
                    fontWeight:700, fontSize:i===0?'11px':'11px',
                    borderBottom:'2px solid var(--border)',
                    borderRight:i<3?'1px solid var(--border)':'none',
                    whiteSpace:'pre-line',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['ホームダッシュボード','✅','✅','✅'],
                ['テーマ一覧（67テーマ）','✅','✅','✅'],
                ['テーマヒートマップ','✅','✅','✅'],
                ['テーマ別詳細','✅','✅','✅'],
                ['市場別ランキング（全セグメント・ETF）','✅','✅','✅'],
                ['機関投資家大量保有情報','✅','✅','✅'],
                ['週次レポート（最新1週）','✅','✅','✅'],
                ['コラム記事（全本）','✅','✅','✅'],
                ['カスタムテーマ（ウォッチリスト）','✅','✅','✅'],
                ['週次レポートアーカイブ（全週）','❌','✅','✅'],
                ['メールアラート（価格・騰落率通知）','❌','✅','✅'],
                ['カスタムテーマ（取得価格・損益管理）','❌','✅','✅'],
                ['複数アラートルール','❌','❌','✅'],
                ['ポートフォリオ分析','❌','❌','✅'],
                ['優先サポート','❌','❌','✅'],
              ].map((row, ri) => (
                <tr key={ri} style={{ borderBottom:'1px solid var(--border)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding:'7px 12px',
                      textAlign:ci===0?'left':'center',
                      color:ci===0?'var(--text2)':cell==='✅'?'#00c48c':cell==='❌'?'var(--text3)':'var(--text)',
                      background:ci===1?'rgba(74,158,255,0.04)':ci===2?'rgba(255,140,66,0.04)':ci===3?'rgba(170,119,255,0.04)':'transparent',
                      borderRight:ci<3?'1px solid var(--border)':'none',
                      fontSize:ci===0?'12px':'13px', fontWeight:ci>0?600:400,
                    }}>
                      {ci===1&&ri===0
                        ? <span style={{ fontSize:'10px', background:'rgba(74,158,255,0.15)', color:'#4a9eff', borderRadius:'4px', padding:'2px 6px' }}>現在のプラン</span>
                        : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {[
            { name:'Free', price:'¥0', period:'永久無料', color:'#4a9eff', badge:'現在利用中', yearly:null },
            { name:'スタンダード', price:'¥1,180', period:'/月', color:'#ff8c42', badge:'近日公開', yearly:'年額¥11,800' },
            { name:'プロ', price:'¥1,980', period:'/月', color:'#aa77ff', badge:'近日公開', yearly:'年額¥19,800' },
          ].map(p => (
            <div key={p.name} style={{ background:'var(--bg3)', border:`1px solid ${p.color}40`,
              borderRadius:'8px', padding:'12px', borderTop:`3px solid ${p.color}`, textAlign:'center' }}>
              <div style={{ fontSize:'12px', fontWeight:700, color:p.color, marginBottom:'3px' }}>{p.name}</div>
              <div style={{ fontSize:'20px', fontWeight:800, color:'var(--text)', fontFamily:'var(--mono)' }}>{p.price}</div>
              <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'3px' }}>{p.period}</div>
              {p.yearly && <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>{p.yearly}</div>}
              <div style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'4px', fontWeight:600, display:'inline-block',
                background:p.badge==='現在利用中'?`${p.color}20`:'rgba(255,255,255,0.05)',
                color:p.badge==='現在利用中'?p.color:'var(--text3)' }}>
                {p.badge}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'10px' }}>
          ※ 料金は予告なく変更する場合があります。消費税込み。
        </p>
      </div>
    </div>
  )
}
