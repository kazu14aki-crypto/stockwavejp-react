import React, { useState } from 'react'

const SECTIONS = [
  {
    icon: '📊',
    title: 'テーマ一覧',
    desc: '67テーマの騰落率・出来高・売買代金を一覧比較できるページです。',
    items: [
      '上部の期間セレクター（1日/1週間/1ヶ月/3ヶ月/6ヶ月/1年）で表示期間を切り替えられます。',
      '「全テーマ 騰落率ランキング」はデフォルトで上位4件を表示。「トップ10を表示」「全67テーマを表示」ボタンで拡張できます。',
      'ページ下部の月次グラフ（騰落率・出来高・売買代金）はPC版ではクリックで拡大表示できます。スマホ版は通常表示です。',
      '月次グラフはテーマを複数選択して比較できます。テーマバッジをクリックで解除、「＋ テーマを追加する」ボタンで追加できます。',
      'テーマヒートマップ（右下）はPC版でクリック拡大。拡大時に注目ゾーンの説明が表示されます。バブルにカーソルを当てるとテーマ名・騰落率・出来高・売買代金がツールチップで表示されます。',
    ]
  },
  {
    icon: '🔥',
    title: 'テーマヒートマップ',
    desc: '67テーマの資金フローを散布図で可視化するページです。',
    items: [
      'X軸が騰落率（右ほど上昇）、Y軸が出来高急増率（上ほど出来高増）、バブルの大きさが売買代金を示します。',
      '右上の「注目ゾーン」は上昇＋出来高急増の最強シグナルエリアです。左上は売り圧力、右下は静かな上昇、左下は静かな下落を示します。',
      'バブルにカーソルを当てるとテーマ名・騰落率・出来高急増率・売買代金が表示されます。',
      'バブルをクリックするとそのテーマの詳細ページに移動します。',
      '上部のセレクターで期間（1日/1週間/1ヶ月/3ヶ月）を切り替えられます。',
    ]
  },
  {
    icon: '🔍',
    title: 'テーマ別詳細',
    desc: '個別テーマの構成銘柄を詳細分析するページです。',
    items: [
      '上部ドロップダウンでテーマを選択。期間も切り替え可能です。',
      '上昇/下落TOP5、注目銘柄ピックアップ（※リアルタイムではなくデータ取得タイミングに依存）が全幅で表示されます。',
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
    icon: '📰',
    title: '週次レポート',
    desc: '毎週末更新のマーケットレポートです。',
    items: [
      'レポートはカード形式で一覧表示されます。クリックするとレポート全文が表示されます。',
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
      '67テーマすべての解説コラムと主要銘柄の個別分析記事があります。',
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
    a: 'リアルタイムではありません。GitHub Actionsにより1日数回（平日7:00/9:00/12:00/15:30/23:30 UTC）自動更新されます。最新データの反映には最大数時間かかる場合があります。ページ右上の「最終更新」時刻を確認してください。',
  },
  {
    q: '注目銘柄ピックアップはどのように選ばれていますか？',
    a: '騰落率・出来高・価格推移・売買代金を独自スコアで機械的に集計しています。リアルタイムデータではなくデータ取得タイミングに依存するため、最新の市場状況と乖離する場合があります。投資判断の参考程度としてご利用ください。',
  },
  {
    q: '売買代金の単位は何ですか？',
    a: '億・兆単位で表示しています（例：2.4兆 = 2.4兆円）。出来高は株数です。',
  },
  {
    q: 'カスタムテーマはいくつまで作れますか？',
    a: '最大3テーマ、1テーマあたり最大10銘柄まで作成できます。Googleログインするとデバイス間でデータが同期されます。未ログイン時はブラウザのLocalStorageに保存されるため、ブラウザのデータを削除すると失われます。',
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
    a: '現在はyfinance（Yahoo Finance非公式API）を利用しています。将来的には商用APIへの移行を予定しています。データの正確性については保証できません。',
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

  return (
    <div style={{ padding:'24px 28px 60px', maxWidth:'900px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>📖 使い方・Q&A</h1>
      <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'28px' }}>
        StockWaveJPの各機能の使い方と、よくある質問をまとめています。
      </p>

      {/* 機能ガイド */}
      <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'14px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
        🗺️ 機能ガイド
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px' }}>
        {SECTIONS.map((sec, si) => (
          <div key={si} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
              <span style={{ fontSize:'18px' }}>{sec.icon}</span>
              <div>
                <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{sec.title}</div>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>{sec.desc}</div>
              </div>
            </div>
            <ul style={{ margin:0, paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'4px' }}>
              {sec.items.map((item, ii) => (
                <li key={ii} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.7 }}>{item}</li>
              ))}
            </ul>
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
