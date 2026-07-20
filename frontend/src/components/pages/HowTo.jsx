import React, { useState } from 'react'

const SECTIONS = [
  {
    icon: '📊',
    title: 'テーマ一覧',
    desc: '72テーマ以上の騰落率・出来高・売買代金を一覧比較できるページです。契約開始後はInfowayの日本株データを利用します。',
    items: [
      '上部の期間セレクターで表示期間を切り替えられます。選択できる期間はプランによって異なります。Freeは限定期間、スタンダードとプロはより広い期間を利用できます。',
      '「全テーマ 騰落率ランキング」はデフォルトで上位4件を表示。「トップ10を表示」「全テーマを表示」ボタンで拡張できます。',
      'ページ下部の月次グラフ（騰落率・出来高・売買代金）はPC版ではクリックで拡大表示できます。スマホ版は通常表示です。',
      '月次グラフはテーマを複数選択して比較できます。テーマバッジをクリックで解除、「＋ テーマを追加する」ボタンで追加できます。',
      'テーマヒートマップ（右下）はPC版でクリック拡大。拡大時に注目ゾーンの説明が表示されます。バブルにカーソルを当てるとテーマ名・騰落率・出来高・売買代金がツールチップで表示されます。',
    ]
  },
  {
    icon: '🔥',
    title: 'テーマヒートマップ',
    desc: '72テーマの資金フローを散布図で可視化するページです。',
    items: [
      'X軸が騰落率（右ほど上昇）、Y軸が出来高急増率（上ほど出来高増）、バブルの大きさが売買代金を示します。',
      '右上の「注目ゾーン」は上昇＋出来高急増の最強シグナルエリアです。左上は売り圧力、右下は静かな上昇、左下は静かな下落を示します。',
      'バブルにカーソルを当てるとテーマ名・騰落率・出来高急増率・売買代金が表示されます。',
      'バブルをクリックするとそのテーマの騰落率・出来高・売買代金がポップアップ表示されます。ポップアップ内の「テーマ別詳細を見る」ボタンで詳細ページに移動できます。',
      '上部のセレクターで期間（1日/1週間/1ヶ月/3ヶ月）を切り替えられます。',
    ]
  },
  {
    icon: '🔍',
    title: 'テーマ別詳細',
    desc: '個別テーマの構成銘柄を詳細分析するページです。',
    items: [
      '上部ドロップダウンでテーマを選択。期間も切り替え可能です。',
      '上昇/下落TOP5、注目銘柄ピックアップが全幅で表示されます。表示値は契約プランごとの更新頻度に基づきます。',
      'ページ下部は2カラム構成（PC版）。左カラムに出来高グラフ・銘柄別ヒートマップ・遷移ボタン、右カラムに構成銘柄表が配置されます。',
      '銘柄表は騰落率・出来高・売買代金でソート可能。ヘッダーのボタンで昇順/降順も切り替えられます。',
      '表はクリック&ドラッグで横移動できます。上部にもスクロールバーが表示されています。',
      '各グラフはクリックで拡大表示できます。',
      '「＋」ボタンで銘柄をカスタムテーマに追加できます。',
    ]
  },
  {
    icon: '📋',
    title: '市場別詳細',
    desc: '市場区分・業種別セグメントの銘柄を比較分析するページです。',
    items: [
      '上部でセグメント（国内主要株・テクノロジー・金融・プライム市場など）と期間を切り替えられます。',
      'ページ下部は2カラム構成（PC版）。左カラムに銘柄表、右カラムに銘柄別ヒートマップ・出来高/売買代金グラフが配置されます。',
      '銘柄表はドラッグスクロール・ソートボタン対応。上部スクロールバーも表示されています。',
      'バブルにカーソルを当てると銘柄名・騰落率・出来高・売買代金が表示されます。',
    ]
  },
  {
    icon: '🎨',
    title: 'カスタムテーマ',
    desc: '自分だけのテーマを作成して銘柄を比較追跡できます。',
    items: [
      '最大3テーマ、1テーマあたり最大10銘柄まで作成できます。',
      '銘柄名または4桁証券コードで日本株を検索して追加できます。',
      'Googleログインするとデバイスをまたいでテーマが同期されます。未ログインの場合はブラウザのLocalStorageに保存されます。',
      'テーマ詳細では騰落率グラフ・出来高グラフ・銘柄別ヒートマップ・構成銘柄表が表示されます（2カラム構成・PC版）。',
      '「URLをコピー」でテーマを他のユーザーと共有できます。',
    ]
  },
  {
    icon: '🏦',
    title: '機関投資家 大量保有情報',
    desc: '金融庁EDINETの開示データをもとに「誰がその株を持っているか」を複数の視点で分析できるページです。',
    items: [
      '【投資家で探す】特定の機関投資家名（例: 光通信）で検索すると、その投資家が5%超保有する全銘柄と、各銘柄での保有割合の推移（買い増しペース）をグラフで確認できます。保有割合が継続的に上昇している銘柄は、純投資を超えて出口イベント（TOB・完全子会社化）を待つ蓄積ポジションの可能性があります。',
      '【TOBレーダー】「配当をもらいながらTOBを待てる」候補を、大量保有者の厚みと積み増し・筆頭株主の固定度（親会社/創業家の高比率＝資本再編が読みやすい）・低PBR（上場維持メリットが薄い）の3軸で複合スコア化して発掘します。',
      '【銘柄で探す（5%超）】銘柄名または証券コードで、その銘柄の大量保有者一覧を確認できます。',
      '【大株主（有報）】有価証券報告書の「大株主の状況」上位10名を、属性（創業家・信託口・外国機関・事業法人など）つきで表示します。',
      '保有割合5〜7%の新規報告は注目サイン。10%超は経営参画・アクティビストの可能性があります。増加トレンドが続く場合は積み増し中のサインです。',
      'データは週次で自動更新されます。EDINETの報告書提出から最大5営業日の遅延があり、5%未満の保有は開示義務がないため全体を網羅するものではありません。読み方の詳細はコラム「大株主を読めば企業がわかる」をご覧ください。',
    ]
  },
  {
    icon: '📰',
    title: 'レポート',
    desc: '週次・月次・四半期の3区分で、市場とテーマ循環を振り返るページです。',
    items: [
      'ページ上部のタブで週次・月次・四半期レポートを切り替えます。四半期は1〜3月、4〜6月、7〜9月、10〜12月で集計します。',
      '週次レポートでは前回ランキングの事後成績を表示し、テーマ騰落率だけでなく市場平均を差し引いた超過成績も確認できます。',
      'レポート内でテーマ名が登場する箇所の近くに「テーマ別詳細」「コラムを読む」ボタンが表示されます。',
      '週間上昇/下落TOP5テーマのバッジをクリックするとそのテーマの詳細ページに移動できます。',
      'AIによる自動生成ではなく、市場データをもとに手動作成しています。',
    ]
  },
  {
    icon: '📝',
    title: 'コラム・解説',
    desc: '各テーマの詳細解説・関連銘柄分析記事を掲載しています。',
    items: [
      '72テーマすべての解説コラムと主要銘柄の個別分析記事があります。',
      'テーマ別詳細ページからも「関連コラム記事を読む」ボタンで直接移動できます。',
    ]
  },
  {
    icon: '⚙️',
    title: '設定',
    desc: 'カラーテーマやグラフ表示モードを変更できます。',
    items: [
      'カラーテーマ: ダーク（デフォルト）・ライト（ホワイト）から選択できます。',
      '一部グラフ要素でカラーテーマ切替時に色が変わらない場合がありますが、順次改善中です。',
    ]
  },
]

const QA = [
  {
    q: 'データはリアルタイムですか？',
    a: '秒単位のリアルタイム配信ではありません。Freeは前営業日または当日確定終値、スタンダードは約60分間隔、プロは約15分間隔で更新します。市場状況、データ提供元、システム処理により反映時刻が前後する場合があります。サイト最上部の「更新時間」「基準時間」「次回更新予定」を確認してください。',
  },
  {
    q: '注目銘柄ピックアップはどのように選ばれていますか？',
    a: '騰落率・出来高・価格推移・売買代金を独自スコアで機械的に集計しています。表示値はプランごとの更新頻度に基づくため、証券会社の取引画面とは時差が生じます。投資判断の参考情報としてご利用ください。',
  },
  {
    q: '売買代金の単位は何ですか？',
    a: '億・兆単位で表示しています（例：2.4兆 = 2.4兆円）。出来高は株数です。',
  },
  {
    q: 'カスタムテーマはいくつまで作れますか？',
    a: 'Freeは1テーマ・10銘柄、スタンダードは5テーマ・各20銘柄、プロは10テーマ・各50銘柄まで作成できます。Googleログインするとデバイス間で同期されます。未ログイン時はブラウザ内に保存されます。',
  },
  {
    q: 'テーマヒートマップのゾーン分けはどういう意味ですか？',
    a: '🔥注目ゾーン（右上）：上昇+出来高急増=最強シグナル / ⚠️売り圧力（左上）：下落+出来高急増=強い売り / 📈静かな上昇（右下）：上昇+出来高少=じわり上昇 / ❄️静かな下落（左下）：弱含みだが動意なし',
  },
  {
    q: '騰落率はどのように計算していますか？',
    a: 'テーマの騰落率はそのテーマに属する構成銘柄の騰落率の単純平均値です。個別銘柄は終値ベースで計算しています。',
  },
  {
    q: 'スマホで表が見づらいのですが？',
    a: '銘柄表は横スクロール対応です。表を左右にスワイプしてください。PC版ではクリック&ドラッグでも横移動できます。スマホではグラフが自動的に縮小表示されます。',
  },
  {
    q: 'データソースはどこですか？',
    a: '株価・出来高・売買代金は、契約開始後にInfowayのJapan Stock Planから取得する予定です。現在はInfoway未契約のため、一部の市場データが表示されない場合があります。大量保有報告書と大株主情報は金融庁EDINETなどの公的開示を利用します。',
  },
]

function Chevron({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition:'transform 0.2s', transform: open?'rotate(180deg)':'rotate(0deg)', flexShrink:0 }}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function HowTo() {
  const [openQ, setOpenQ] = useState(null)
  const [openS, setOpenS] = useState(null)

  return (
    <div style={{ padding:'24px 28px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>📖 使い方・Q&A</h1>
      <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'28px' }}>
        StockWaveJPの各機能の使い方と、よくある質問をまとめています。
      </p>


      <div style={{ marginBottom:'26px', padding:'16px 18px', background:'var(--bg2)',
        border:'1px solid var(--border)', borderRadius:'10px' }}>
        <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>
          ⏱️ プラン別データ更新頻度
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'8px' }}>
          {[
            ['Free','前営業日または当日確定終値','#4a9eff'],
            ['スタンダード','約60分間隔','#ff8c42'],
            ['プロ','約15分間隔','#aa77ff'],
          ].map(([name, frequency, color]) => (
            <div key={name} style={{ padding:'10px 12px', borderRadius:'8px',
              border:`1px solid ${color}35`, background:`${color}0d` }}>
              <div style={{ fontSize:'11px', fontWeight:800, color }}>{name}</div>
              <div style={{ fontSize:'12px', color:'var(--text2)', marginTop:'4px' }}>{frequency}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'10px', fontSize:'10px', color:'var(--text3)', lineHeight:1.7 }}>
          ※ 秒単位のリアルタイム配信ではありません。市場休場日やデータ提供元の状況により反映時刻が前後します。
        </div>
      </div>


      <div style={{ marginBottom:'30px' }}>
        <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'12px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
          🧭 StockWaveJPの基本的な使い方
        </h2>
        <p style={{fontSize:'12px',color:'var(--text3)',lineHeight:1.8,marginBottom:'12px'}}>
          ランキングを見て終わるのではなく、「テーマ発見 → 資金流入の確認 → 銘柄比較 → 事後追跡」の順で使います。
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'10px'}}>
          {[
            ['1','テーマ一覧','期間を「1週間」、表示指標を「市場超過騰落率」にします。テーマ騰落率から同期間のTOPIX騰落率を引いた値で並べ、地合い以上に買われているテーマを探します。','確認例：テーマ +3.2%、市場 +1.0% → 市場超過 +2.2pt'],
            ['2','テーマ別詳細','候補テーマを選び、出来高、売買代金、上昇銘柄比率、成績分布を確認します。特定1社だけの急騰か、複数銘柄へ資金が広がっているかを区別します。','確認例：平均は高いが中央値が低い場合、一部の急騰銘柄に偏っている可能性'],
            ['3','テーマ別詳細・銘柄検索','構成銘柄表から候補を絞り、決算短信、受注、利益率、PER・PBR、流動性、直近の適時開示を確認します。テーマ順位は個別銘柄の購入理由そのものではありません。','確認例：同じ半導体テーマでも装置、材料、メモリで業績サイクルは異なる'],
            ['4','レポート','週次レポートで前回ランキングの事後成績を確認します。翌週も市場超過が続いたテーマは継続候補、順位急落や超過マイナスは失速候補として見直します。','確認例：前週1位でも翌週-2.0ptなら、追いかけ買いより再確認を優先'],
          ].map(([n,page,body,example]) => (
            <div key={n} style={{padding:'14px',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'10px',fontWeight:800,color:'var(--accent)'}}>STEP {n}</span>
                <span style={{fontSize:'9px',fontWeight:700,color:'var(--accent)',padding:'2px 7px',borderRadius:'12px',background:'rgba(74,158,255,.08)',border:'1px solid rgba(74,158,255,.22)'}}>{page}</span>
              </div>
              <div style={{fontSize:'11px',color:'var(--text2)',lineHeight:1.8,marginTop:'8px'}}>{body}</div>
              <div style={{fontSize:'10px',color:'var(--text3)',lineHeight:1.7,marginTop:'8px',paddingTop:'8px',borderTop:'1px dashed var(--border)'}}>{example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 機能ガイド（アコーディオン形式） */}
      <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'14px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
        🗺️ 機能ガイド
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'32px' }}>
        {SECTIONS.map((sec, si) => (
          <div key={si} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden' }}>
            <button onClick={() => setOpenS(openS === si ? null : si)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                gap:'12px', padding:'12px 16px', background:'transparent', border:'none',
                cursor:'pointer', textAlign:'left', fontFamily:'var(--font)', color:'var(--text)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'18px' }}>{sec.icon}</span>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)' }}>{sec.title}</div>
                  <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>{sec.desc}</div>
                </div>
              </div>
              <Chevron open={openS === si} />
            </button>
            {openS === si && (
              <div style={{ padding:'0 16px 14px', borderTop:'1px solid var(--border)' }}>
                <ul style={{ margin:'10px 0 0', paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'5px' }}>
                  {sec.items.map((item, ii) => (
                    <li key={ii} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.7 }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Q&A */}
      <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'14px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
        ❓ よくある質問
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'32px' }}>
        {QA.map((qa, i) => (
          <div key={i} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden' }}>
            <button onClick={() => setOpenQ(openQ === i ? null : i)}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                gap:'12px', padding:'12px 16px', background:'transparent', border:'none',
                cursor:'pointer', textAlign:'left', fontFamily:'var(--font)', color:'var(--text)' }}>
              <span style={{ fontSize:'13px', fontWeight:600 }}>Q. {qa.q}</span>
              <Chevron open={openQ === i} />
            </button>
            {openQ === i && (
              <div style={{ padding:'0 16px 14px', fontSize:'12px', color:'var(--text2)', lineHeight:1.8,
                borderTop:'1px solid var(--border)' }}>
                <div style={{ paddingTop:'10px' }}>A. {qa.a}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 免責事項 */}
      <div style={{ padding:'14px 18px', background:'rgba(255,193,7,0.05)',
        border:'1px solid rgba(255,193,7,0.2)', borderRadius:'8px', fontSize:'12px', color:'var(--text3)', lineHeight:1.8 }}>
        ⚠️ <strong style={{ color:'var(--text2)' }}>免責事項：</strong>
        当サイトに掲載されている情報は参考目的のみであり、特定の銘柄の売買を推奨するものではありません。
        投資の最終判断はご自身の責任でお願いします。データの正確性・最新性について保証するものではありません。
      </div>
    </div>
  )
}
