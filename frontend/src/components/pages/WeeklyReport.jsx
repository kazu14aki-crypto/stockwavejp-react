import { useState, useEffect } from 'react'

// 週次レポートデータ（毎週更新予定）
const WEEKLY_REPORTS = [
  {
    id: 'report-2026-w15',
    week: '2026年第15週',
    dateRange: '2026年4月7日〜11日',
    published: '2026/04/11',
    headline: '日銀追加利上げ観測で銀行・金融テーマが急騰、半導体は調整局面',
    summary: '今週の日本株市場は、日銀審議委員の発言を受けた追加利上げ観測の高まりで銀行・金融テーマが週間+6.8%の急騰。一方でナスダックの調整を受け半導体・AI関連は軟調に推移した。テーマローテーションが鮮明な1週間だった。',
    sections: [
      {
        title: '今週のテーマ騰落率ハイライト',
        content: `上昇テーマ上位：

銀行・金融 +6.8%：日銀追加利上げ観測の高まりで三菱UFJ・三井住友が急騰。出来高は平常時の2.8倍に膨らみ、機関投資家・外国人投資家の積極的な買いが確認された。

地方銀行 +5.2%：メガバンクに遅れる形でコンコルディアFG・ふくおかFGなど地銀株にも資金が波及。利上げ恩恵の「第二波」として注目が集まった。

保険 +4.1%：東京海上HD・MS&ADが新高値を更新。金利上昇による運用収益改善期待が継続。

下落テーマ上位：

半導体 -3.2%：米フィラデルフィア半導体指数（SOX指数）の下落に連動し東京エレクトロン・アドバンテストが調整。ただし出来高は限定的で本格的な売りではない。

AI・クラウド -2.1%：グロース株全般の調整でさくらインターネット・富士通が軟調。`,
      },
      {
        title: '来週の注目イベント・カレンダー',
        content: `4月14日（月）：米3月小売売上高発表（消費動向の確認）
4月15日（火）：中国3月経済指標発表（鉄鋼・資源テーマへの影響）
4月16日（水）：日本3月貿易統計（円安効果の確認）
4月17日（木）：米主要銀行決算（JPモルガン・バンクオブアメリカ等）
4月18日（金）：日本3月消費者物価指数（日銀政策への影響）

注目度★★★：4月18日のCPI発表。5月の日銀会合に向けた利上げ判断の材料として市場が最も注目している。予想を上回る伸びとなれば銀行・金融テーマへの追い風が継続する可能性がある。`,
      },
      {
        title: 'StockWaveJP編集部の今週の観察',
        content: `今週最も印象的だったのは「銀行・金融テーマが転換↑を示した翌週に加速モメンタムへ移行した」というパターンが再現されたことです。

先週のモメンタム確認で「銀行・金融：転換↑」を確認していた方にとっては、今週の+6.8%は予見可能な動きでした。StockWaveJPのモメンタムデータが実際の株価動向の先行指標として機能したケースとして記録しておきたいと思います。

一方で半導体テーマは「加速→横ばい→転換↓」というモメンタム悪化のパターンが出始めており、来週以降の継続的な下落リスクに注意が必要です。半導体保有ポジションの利益確定タイミングとして検討する価値があります。

来週の最重要イベントはCPI発表です。利上げ期待が維持されるなら銀行・地銀・保険テーマへの強気スタンスを継続、予想より低いCPIならグロース（半導体・AI）への資金回帰のシナリオも想定しておきたいです。`,
      },
    ],
  },
  {
    id: 'report-2026-w14',
    week: '2026年第14週',
    dateRange: '2026年3月31日〜4月4日',
    published: '2026/04/04',
    headline: '防衛テーマが週間+8.1%で全テーマトップ、イラク情勢緊迫化で資源高も',
    summary: '中東情勢の緊迫化を背景に防衛テーマが週間+8.1%で全テーマトップの上昇。川崎重工・三菱重工が新高値を更新した。同時に原油高で商社・資源テーマも堅調。一方でインバウンド関連は円高進行で上値が重かった。',
    sections: [
      {
        title: '今週のテーマ騰落率ハイライト',
        content: `上昇テーマ上位：

防衛・宇宙 +8.1%：中東の地政学リスク高まりと政府の防衛費増額継続方針で川崎重工・三菱重工・IHIが急騰。防衛省関連の大型受注発表も重なり出来高は平常時の3.2倍。

レアアース・資源 +5.4%：原油高で総合商社5社が全面高。三菱商事・三井物産が週間5%超の上昇。バフェット銘柄としての再注目も。

建設・インフラ +3.8%：防衛関連インフラ整備への期待と国土強靭化の次期計画策定報道で大成建設・鹿島建設が堅調。

下落テーマ：

観光・ホテル +1.2%（上昇も上値重い）：円高進行で訪日外国人の割安感低下を懸念した売りが上値を抑えた。ホテル各社は過去最高業績で評価は高いが為替への感応度の高さが確認された。`,
      },
      {
        title: 'StockWaveJP編集部の今週の観察',
        content: `防衛テーマが「転換↑→加速」のパターンを3週連続で維持しています。これほど継続的に加速モメンタムが続くのは、単なる一時的な材料反応ではなく「構造的な資金流入（機関投資家の組み入れ拡大）」が起きていることを示唆しています。

防衛テーマへの投資タイミングとして「日経平均が下落する日に防衛株が上昇・横ばいを維持する日（相対強度が高い日）」をカウントしてみると、過去3週間で10日中7日がこのパターンでした。これは防衛テーマが「日経平均との相関が低い独立したモメンタム」を持っていることを示しており、ポートフォリオのヘッジとしても機能しています。`,
      },
    ],
  },
]

export default function WeeklyReport() {
  const [selectedReport, setSelectedReport] = useState(null)

  const report = selectedReport
    ? WEEKLY_REPORTS.find(r => r.id === selectedReport)
    : null

  if (report) {
    return (
      <div style={{ padding:'20px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
        <button onClick={() => setSelectedReport(null)} style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:'transparent', border:'none', color:'var(--accent)',
          fontSize:'13px', cursor:'pointer', fontFamily:'var(--font)',
          padding:'0', marginBottom:'20px',
        }}>
          ← レポート一覧に戻る
        </button>
        <div style={{ display:'inline-block', background:'rgba(255,140,66,0.1)',
          border:'1px solid rgba(255,140,66,0.3)', borderRadius:'20px',
          padding:'3px 12px', fontSize:'11px', fontWeight:600,
          color:'#ff8c42', marginBottom:'12px' }}>
          📅 {report.week}（{report.dateRange}）
        </div>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'#e8f0ff',
          lineHeight:1.5, marginBottom:'8px' }}>
          {report.headline}
        </h1>
        <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9,
          marginBottom:'28px', paddingBottom:'20px', borderBottom:'1px solid var(--border)' }}>
          {report.summary}
        </p>
        {report.sections.map((sec, i) => (
          <div key={i} style={{ marginBottom:'28px' }}>
            <h2 style={{ fontSize:'15px', fontWeight:700, color:'var(--accent)',
              marginBottom:'12px', paddingBottom:'8px',
              borderBottom:'1px solid var(--border)' }}>
              {sec.title}
            </h2>
            <div style={{ fontSize:'13px', color:'var(--text2)', lineHeight:2,
              whiteSpace:'pre-line', background:'var(--bg2)',
              border:'1px solid var(--border)', borderRadius:'8px',
              padding:'16px 20px' }}>
              {sec.content}
            </div>
          </div>
        ))}
        <div style={{ background:'rgba(255,140,66,0.07)',
          border:'1px solid rgba(255,140,66,0.2)', borderRadius:'8px',
          padding:'14px 18px', fontSize:'12px', color:'#e8f0ff', lineHeight:1.8 }}>
          ⚠️ 本レポートは情報提供を目的としており、特定の投資を推奨するものではありません。
          投資判断はご自身の責任において行ってください。
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'20px 32px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)',
        marginBottom:'4px' }}>週次マーケットレポート</h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'28px' }}>
        毎週更新 | テーマ別騰落率の振り返りと来週の注目ポイント
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        {WEEKLY_REPORTS.map(r => (
          <div key={r.id}
            onClick={() => setSelectedReport(r.id)}
            style={{ background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'20px 24px', cursor:'pointer',
              transition:'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            <div style={{ display:'flex', alignItems:'center',
              justifyContent:'space-between', marginBottom:'8px', flexWrap:'wrap', gap:'8px' }}>
              <span style={{ fontSize:'11px', fontWeight:600, color:'#ff8c42',
                background:'rgba(255,140,66,0.1)', border:'1px solid rgba(255,140,66,0.25)',
                borderRadius:'20px', padding:'2px 10px' }}>
                📅 {r.week}
              </span>
              <span style={{ fontSize:'11px', color:'var(--text3)' }}>{r.published}</span>
            </div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text)',
              marginBottom:'8px', lineHeight:1.5 }}>
              {r.headline}
            </div>
            <div style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7,
              display:'-webkit-box', WebkitLineClamp:2,
              WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {r.summary}
            </div>
            <div style={{ marginTop:'12px', fontSize:'12px', color:'var(--accent)',
              fontWeight:600 }}>
              レポートを読む →
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'32px', padding:'20px', background:'var(--bg2)',
        border:'1px dashed var(--border)', borderRadius:'10px',
        textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>
        💡 週次レポートは毎週金曜日の引け後に更新予定です
      </div>
    </div>
  )
}
