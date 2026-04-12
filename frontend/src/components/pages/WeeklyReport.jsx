import { useState } from 'react'

const WEEKLY_REPORTS = [
  {
    id: 'report-2026-w15',
    week: '2026年第15週',
    dateRange: '2026年4月7日〜11日',
    published: '2026/04/11',
    headline: '米中関税摩擦激化で日経平均急落・防衛テーマは逆行高、全67テーマの地殻変動',
    summary: '今週の日本株市場は米中関税摩擦の激化を受けて日経平均が週間で大幅下落。輸出関連・半導体が売られる中、防衛・航空テーマは逆行高。StockWaveJPで67テーマを横断確認すると「防衛・警備・国土強靭化」という内需系テーマへの資金シフトが鮮明だった。',
    sections: [
      {
        title: '今週のテーマ騰落率ハイライト（67テーマ横断分析）',
        content: '上昇テーマ（内需・防衛が逆行高）：\n\n防衛・航空 +5.2%：米中対立激化による地政学リスク高まりで三菱重工・川崎重工・IHIが急騰。防衛費増額の継続方針が改めて評価された。出来高は平常時の3.1倍。\n\n電力会社 +3.8%：景気後退懸念局面でのディフェンシブシフトにより、東京電力HD・関西電力・中部電力が堅調。原子力再稼働期待も追い風。\n\n原子力発電 +3.4%：エネルギー安全保障の観点から原子力見直し論が再浮上。関西電力・九州電力など原発比率の高い電力株に資金流入。\n\n警備 +2.9%：景気後退懸念でのディフェンシブ買い。セコム・綜合警備保障が小幅ながら堅調推移。\n\n下落テーマ（輸出・グロースが急落）：\n\nAI半導体 -8.4%：SOX指数の急落・エヌビディア関連の下落に連動し東京エレクトロン・アドバンテスト・レーザーテックが軒並み年初来安値圏。\n\nEV・電気自動車 -6.1%：対中関税の報復措置リスクでトヨタ・マツダ・ホンダが急落。中国依存度の高い自動車部品メーカーへの売りが波及。\n\n造船 -4.8%：世界景気後退懸念で海運運賃先安観が強まり、三菱重工・三井E&Sが下落。',
      },
      {
        title: '米中関税摩擦と日本株テーマへの影響分析',
        content: '今週最大のテーマは「米中関税摩擦の激化」です。トランプ政権が中国製品への追加関税を大幅引き上げたことを受け、中国側も対抗措置を発動。この影響を受けやすいテーマと受けにくいテーマを分類すると以下の通りです。\n\n【影響大（売り圧力）】\n・AI半導体：エヌビディアのGPU対中輸出規制強化\n・EV・電気自動車：中国市場依存の高い自動車メーカー\n・レアアース・資源：中国が主要産地のレアメタル輸出規制リスク\n\n【影響小〜プラス（逃避先）】\n・防衛・航空：地政学リスク高まりで需要増\n・電力会社・原子力：エネルギー安全保障の重要性高まり\n・国土強靭化計画：内需直結・輸出無関係\n\nStockWaveJPで67テーマのモメンタムを横断確認し、「関税リスクの低い内需テーマ」への資金シフトを早期に把握することが今週の教訓です。',
      },
      {
        title: '来週（4/14〜18）の注目イベント',
        content: '4月14日（月）：米3月小売売上高（個人消費の動向確認）\n4月15日（火）：中国1〜3月期GDP速報（関税影響の先行確認）\n4月16日（水）：米国主要銀行決算（JPモルガン・バンクオブアメリカ）\n4月17日（木）：日本3月貿易統計（輸出への関税影響を先行確認）\n4月18日（金）：日本3月消費者物価指数（CPI）・米国ミシガン大消費者信頼感指数\n\n★★★ 最注目：4月15日の中国GDP。関税ショックの実態が数字に表れ始めるか注目。予想を下回る場合は資源・鉄鋼・造船テーマへの追加売りが想定される。\n\n★★ 注目：4月18日の日本CPI。日銀の次回利上げ判断材料として重要。予想超えなら銀行・地方銀行テーマへの追い風継続。',
      },
      {
        title: 'StockWaveJP編集部の今週の観察',
        content: '今週で特筆すべきは「67テーマへの拡張後、初めて本格的な相場急変局面を迎えた」ことです。67テーマを横断したモメンタム確認により、以下のパターンが観察されました。\n\n「防衛・航空テーマが加速モメンタムを維持したまま出来高が急増」→これは機関投資家の組み入れ拡大を示す強いシグナルでした。同時に「AI半導体・EV関連テーマが転換↓から失速へ」というモメンタムの悪化も確認でき、事前にポジション縮小を判断できた局面でした。\n\n67テーマのヒートマップを見ると今週は「内需系（防衛・電力・警備・国土強靭化）が緑」「輸出系（半導体・EV・造船）が赤」という鮮明な二極化でした。このような局面でこそ、テーマ横断のモメンタム管理が個別株選択の精度を大幅に高めます。',
      },
    ],
  },
  {
    id: 'report-2026-w14',
    week: '2026年第14週',
    dateRange: '2026年3月31日〜4月4日',
    published: '2026/04/04',
    headline: 'トランプ関税ショック第一波で日経平均急落、防衛・資源は底堅く',
    summary: 'トランプ政権が主要貿易相手国への「相互関税」を発表した影響で世界株式市場が急落。日経平均は週間で5%超の大幅安となった。ただし防衛・資源・電力会社テーマは相対的に底堅く、テーマローテーションによるリスク管理の重要性が改めて示された週。',
    sections: [
      {
        title: '今週のテーマ騰落率ハイライト',
        content: '上昇・底堅かったテーマ：\n\n防衛・航空 +2.3%：地政学リスク高まりと防衛費増額継続で三菱重工が逆行高。\n\n資源（水素・ヘリウム・水） +1.8%：エネルギー安全保障の観点から岩谷産業・エア・ウォーターが小幅高。\n\n電力会社 +0.9%：ディフェンシブ買い。市場全体の急落局面でも下値抵抗力を発揮。\n\n急落したテーマ：\n\n半導体製造装置 -9.2%：世界景気後退懸念で設備投資削減観測。東京エレクトロン・ディスコが年初来安値更新。\n\nEV・電気自動車 -7.8%：トヨタ・ホンダが急落。中国向け輸出への関税影響懸念。\n\n造船 -5.4%：海運運賃の先安観で川崎重工・三井E&Sが下落。',
      },
      {
        title: 'StockWaveJP編集部の今週の観察',
        content: '今週の最大の学びは「67テーマのヒートマップが急落局面での資金シフト先を明確に示した」ことです。市場全体が5%超下落する中で、防衛・電力・警備・国土強靭化という「景気非連動の内需テーマ」が緑のまま維持されており、事前にこれらへのポジションを持っていれば被害を最小化できました。StockWaveJPのモメンタムと出来高を組み合わせた判断を継続することをお勧めします。',
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
        毎週更新 | 67テーマ別騰落率の振り返りと来週の注目ポイント
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
