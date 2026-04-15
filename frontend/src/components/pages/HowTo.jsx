import { useState } from 'react'
import React from 'react'

const SECTIONS = [
  {
    icon: '🏠',
    title: 'ホーム',
    color: '#4a9eff',
    summary: 'サイト全体の概況をひと目で把握',
    detail: {
      overview: 'ホームは市場全体の状況を一覧できるダッシュボードです。毎日の投資判断の出発点として活用できます。',
      features: [
        {
          name: 'マーケットサマリー（KPI）',
          desc: '上昇テーマ数・全テーマ平均騰落率・資金流入TOP・資金流出TOPを表示します。矢印（↗↘）で方向感を、色（赤=上昇・緑=下落）でパフォーマンスを直感的に把握できます。',
        },
        {
          name: 'コラム導線',
          desc: '投資初心者向けのテーマ解説や分析手法の記事にアクセスできます。各テーマの背景知識を深めることで、データの読み方が向上します。',
        },
        {
          name: 'マーケット指標・ミニカード',
          desc: '国内主要株ETF・国内広域ETF・米国株ETF・ドル円・米国ハイテクETF・VIX先物ETFの6指標をカード形式で表示。各カードに騰落率とスパークライン（折れ線の小グラフ）を表示します。',
        },
        {
          name: 'マーケット指標比較グラフ',
          desc: '6指標の期間内トレンドを1つのグラフで比較。各指標は独立スケールで正規化しているため、変動幅の異なる指標でも同等にトレンドを確認できます。',
        },
      ],
      tips: [
        '毎朝ホームを開いて「上昇テーマ数」と「平均騰落率」を確認するだけで、市場全体の方向感が掴めます。',
        '資金流入TOPテーマが前日と変わっていたら「テーマ一覧」で詳細を確認しましょう。',
        '米国株ETFとVIX先物ETFを同時に確認することで、リスクオン・リスクオフの判断材料になります。',
      ],
    },
  },
  {
    icon: '📊',
    title: 'テーマ一覧',
    color: '#ff5370',
    summary: '全67テーマの騰落率・出来高・売買代金を比較',
    detail: {
      overview: 'テーマ一覧は、日本株の主要67テーマを横断比較できるページです。「今どのテーマに資金が集まっているか」を一目で判断するための核心ページです。',
      features: [
        {
          name: '期間選択',
          desc: '1週間・1ヶ月・3ヶ月・6ヶ月・1年の5期間を切り替えられます。短期（1週間）は直近の資金の動きを、長期（3ヶ月・1年）はトレンドの持続性を確認するために使います。',
        },
        {
          name: 'KPIカード',
          desc: '上昇テーマ数・全体平均騰落率・資金流入TOP・資金流出TOPの4指標を表示。上昇テーマ数が全体の半数を超えているかどうかで市場全体の地合いを判断できます。',
        },
        {
          name: '騰落ランキングTOP5グラフ',
          desc: '上昇・下落それぞれの上位5テーマを横棒グラフで表示。実際に上昇している銘柄のみが表示され（フィルタリング済み）、タイトルに「◯テーマ上昇」と総数も表示されます。',
        },
        {
          name: '出来高・売買代金TOP5グラフ',
          desc: '取引量・金額ベースでの上位5テーマ。騰落率とは独立した視点で「市場が注目しているテーマ」を確認できます。',
        },
        {
          name: '全テーマランキング（横棒グラフ）',
          desc: '全67テーマの騰落率・出来高・売買代金を横棒グラフで表示。テーマ名が左に表示されるため、どのテーマかが一目でわかります。',
        },
      ],
      tips: [
        '「騰落率上昇TOP5」と「売買代金TOP5」が重複するテーマは、本格的な資金流入の可能性が高いです。',
        '期間を1週間→1ヶ月→3ヶ月と切り替えて、一貫して上位にいるテーマは強いトレンドにある可能性があります。',
        '「資金流出TOP」のテーマでも、売買代金が大きい場合はまだ市場の関心が残っていることを示します。',
      ],
    },
  },
  {
    icon: '🔍',
    title: 'テーマ別詳細',
    color: '#aa77ff',
    summary: '特定テーマの構成銘柄・連動度・比較グラフを詳細分析',
    detail: {
      overview: '気になるテーマを選択し、構成銘柄の個別状況から全体の比較まで、テーマの「中身」を深く掘り下げるページです。',
      features: [
        {
          name: 'テーマ選択・サマリーカード',
          desc: 'ページ上部のセレクトボックスでテーマを選択。平均騰落率・先月比・状態（🔥加速/❄️失速/↗転換↑/↘転換↓/→横ばい）が表示されます。先月比がプラスで状態が「加速」なら資金流入が継続中のシグナルです。',
        },
        {
          name: '上昇/下落TOP5グラフ',
          desc: '構成銘柄の中で特に動きの大きな銘柄を確認できます。「◯銘柄上昇」と表示されるため、テーマ全体の中で何銘柄が実際に動いているか把握できます。',
        },
        {
          name: '構成銘柄一覧テーブル',
          desc: '証券コード・銘柄名・株価・騰落率・大分類・小分類・連動度・出来高・売買代金を一覧表示。「連動度」はテーマ平均騰落率への各銘柄の貢献度です。',
        },
        {
          name: 'テーマ比較グラフ',
          desc: '複数テーマの騰落率推移を折れ線グラフで比較。「半導体」と「AI・クラウド」を同時に表示して相関・差異を確認するといった使い方ができます。最大5テーマを同時選択可能。',
        },
        {
          name: 'マクロ比較グラフ',
          desc: '選択テーマの騰落率と国内株ETF・米国株ETFなどのマクロ指標を比較。テーマが市場全体と連動しているかどうかを判断できます。',
        },
      ],
      tips: [
        'テーマ全体は上昇でも、構成銘柄の中で特定の1〜2銘柄だけが上昇している場合は「見かけ上の上昇」の可能性があります。連動度を確認しましょう。',
        '「テーマ比較」で似た動きをするテーマを把握しておくと、リスク分散の参考になります。',
        '先月比がマイナスでも「状態：↗転換↑」なら方向転換が始まった可能性があります。',
      ],
    },
  },
  {
    icon: '📋',
    title: '市場別詳細',
    color: '#06d6a0',
    summary: '国内主要株・広域ETF・市場区分ごとの構成銘柄を分析',
    detail: {
      overview: '「国内主要株」「国内全般」「市場区分」の3グループに分けて、各分類の騰落率と構成銘柄を確認できるページです。セクター単位での動向把握に最適です。',
      features: [
        {
          name: '国内主要株グループ（技術・金融・消費・素材・資本財・運輸公共）',
          desc: '国内主要225社を6つの大分類に分類。各分類の平均騰落率をボタン上に表示しているため、どのセクターが強いかを一目で確認できます。選択するとその分類の構成銘柄が表示されます。',
        },
        {
          name: '国内全般グループ（Core30・Large70）',
          desc: '時価総額上位の大型株グループ。Core30は時価総額最大規模の30社、Large70はその次の70社で構成されます。市場の牽引役を確認するのに適しています。',
        },
        {
          name: '市場区分グループ（プライム・スタンダード・グロース）',
          desc: '東証の市場区分別に分類。グロース市場は成長企業中心のため騰落率の振れ幅が大きく、リスクも高い傾向があります。',
        },
        {
          name: '小分類説明',
          desc: '国内主要株の大分類を選択すると「この分類には○○、△△が含まれます」と小分類（業種）が表示されます。',
        },
        {
          name: '構成銘柄テーブル',
          desc: '順位・証券コード・銘柄名・株価・騰落率・大分類・小分類・連動度・出来高・売買代金を一覧表示。横スクロールで全カラムを確認できます。',
        },
      ],
      tips: [
        '「技術」セクターが特に強い日は、テーマ一覧で「半導体」「AI・クラウド」なども合わせて確認しましょう。',
        'Core30の動きは市場全体の方向感を示す傾向があります。Large70と比較することで上昇の広がりを確認できます。',
        'グロース市場が大きく上昇している日は、リスクオンの地合いであることが多いです。',
      ],
    },
  },
  {
    icon: '🔥',
    title: 'ヒートマップ・モメンタム',
    color: '#ffd166',
    summary: '67テーマの騰落をヒートマップで視覚化し、モメンタムで勢いを把握',
    detail: {
      overview: '「期間別ヒートマップ」「月次ヒートマップ」「騰落モメンタム」の3タブで構成。67テーマの騰落をカラーマップで一覧し、どのテーマがいま勢いがあるかを多角的に確認できます。',
      features: [
        {
          name: '期間別ヒートマップ',
          desc: '1週・1ヶ月・3ヶ月・6ヶ月・1年の5期間の騰落率を色で表示。赤が上昇・緑が下落。全期間で赤のテーマは強いトレンドが継続中です。',
        },
        {
          name: '月次ヒートマップ',
          desc: '過去12ヶ月の月別騰落率をカレンダー形式で表示。季節性のあるテーマの特定や月ごとの相場パターン把握に活用できます。',
        },
        {
          name: '騰落モメンタム',
          desc: 'テーマごとに「騰落率・先週比・状態」を表示。状態は🔥加速・❄️失速・↗転換↑・↘転換↓・→横ばいの5種類。モメンタムの変化でトレンドの転換点を早期把握できます。',
        },
      ],
      tips: [
        '期間別ヒートマップで「全期間赤（上昇）」のテーマは短期・中期・長期すべてで資金が流入している強いトレンドのサインです。',
        '騰落モメンタムで「🔥加速」と「↗転換↑」が同時に増えている局面は市場の強気サイン。逆に「❄️失速」が増えたら調整に備えましょう。',
        '月次ヒートマップで特定の月に毎年上昇するテーマを探すと、季節性戦略のヒントが得られます。',
      ],
    },
  },
        {
          name: '月次ヒートマップ',
          desc: '直近12ヶ月の月別騰落率を表示。「半導体は3月が強い」「インバウンドは夏に上昇しやすい」といった季節性のパターン発見に役立ちます。',
        },
        {
          name: '色の濃淡',
          desc: '赤・緑の濃さが騰落率の大きさを示します。濃い赤=大幅上昇、薄い赤=小幅上昇、濃い緑=大幅下落です。',
        },
      ],
      tips: [
        '「期間別」で1W〜1Mで赤だが3M〜1Yで緑のテーマは「直近の反発局面」にある可能性があります。',
        '月次ヒートマップで特定の月に繰り返し上昇するテーマは、季節性・決算期などの要因が考えられます。',
        'ヒートマップ全体が赤ければ全面高、全体が緑なら全面安の地合い判断に使えます。',
      ],
    },
  },

        {
          name: '資金フロータブ：全テーマ一覧',
          desc: '全67テーマの騰落率を降順で表示。資金の分布状況（上昇・下落のバランス）を把握できます。',
        },
        {
          name: '騰落モメンタムタブ',
          desc: 'テーマごとに「騰落率・先週比・状態」を表示。状態は🔥加速（騰落率↑＆先週比↑）、❄️失速（両方↓）、↗転換↑（方向転換・上昇へ）、↘転換↓（方向転換・下落へ）、→横ばいの5種類。',
        },
      ],
      tips: [
        '資金流入TOP10と騰落モメンタムの「🔥加速」が重複するテーマは、最も資金流入が加速しているシグナルです。',
        '「↗転換↑」のテーマは下落から上昇に転じた局面。早期参入のシグナルとして活用できます。',
        '「❄️失速」が増えてきたら市場全体のリスクオフを示している可能性があります。',
      ],
    },
  },
  {
    icon: '🎨',
    title: 'カスタムテーマ',
    color: '#e63030',
    summary: '自分だけのオリジナルテーマを作成・追跡',
    detail: {
      overview: '既存の67テーマに含まれない銘柄で独自のテーマを作成し、騰落率を追跡できます。自分の保有銘柄のグループや、特定のサプライチェーン関連銘柄をまとめて管理するのに最適です。',
      features: [
        {
          name: 'テーマ作成（最大3テーマまで）',
          desc: 'テーマ名を入力し、4桁の証券コード（例：6954）または銘柄名で検索して銘柄を追加します。複数の銘柄をまとめてオリジナルテーマとして保存できます。なお、カスタムテーマは1アカウントにつき最大3テーマまで作成できます。',
        },
        {
          name: '騰落率の自動計算',
          desc: '登録した銘柄の騰落率平均を自動計算。テーマ一覧と同じ形式で表示されます。',
        },
        {
          name: 'テーマの編集・削除',
          desc: '既存のカスタムテーマに銘柄を追加・削除したり、テーマごと削除できます。データはブラウザのローカルストレージに保存されます。',
        },
      ],
      tips: [
        '自分の保有銘柄をカスタムテーマに登録して「自分のポートフォリオの騰落率」を確認できます。',
        'サプライチェーン関連銘柄（例：自動車部品メーカーまとめ）を一つのテーマにすると、サプライチェーン全体の状況が把握しやすくなります。',
        'ブラウザのローカルストレージに保存されるため、ブラウザのキャッシュクリアでデータが消える点にご注意ください。',
      ],
    },
  },
  {
    icon: '⚙️',
    title: '設定',
    color: '#4a6080',
    summary: 'カラーテーマと表示モードをカスタマイズ',
    detail: {
      overview: 'サイトの見た目をカスタマイズできます。設定はブラウザに保存され、次回アクセス時にも引き継がれます。',
      features: [
        {
          name: 'カラーテーマ',
          desc: '🌑ブラック（デフォルト）、🌊ネイビー（深いブルー系）、☀️ホワイト（ライトモード）の3種類から選択できます。夜間はブラック・ネイビー、日中はホワイトがおすすめです。',
        },
        {
          name: '表示モード',
          desc: '🔄自動（画面幅で自動判定）、🖥PC、📱スマホの3種類。スマホで見ているのにPC表示になってしまう場合は「スマホ」を選択してください。',
        },
      ],
      tips: [
        'カラーテーマは即時反映されます。ページリロードは不要です。',
        '印刷・スクリーンショットを撮る際はホワイトテーマが見やすい場合があります。',
      ],
    },
  },
]

const USAGE_SCENARIOS = [
  {
    title: '📅 毎朝の市場確認ルーティン',
    steps: [
      'ホームで「上昇テーマ数」と「資金流入TOP」を確認',
      'テーマ一覧（1週間）で直近の動きが強いテーマをチェック',
      'テーマ別詳細で気になるテーマの構成銘柄を確認',
    ],
  },
  {
    title: '🔍 テーマの本格調査',
    steps: [
      'ヒートマップで複数期間の強さを確認（短期だけでなく中長期も強いか）',
      'テーマ別詳細で先月比・状態を確認（加速中か失速中か）',
      'ヒートマップ・モメンタムでモメンタムの持続性を確認',
      '構成銘柄テーブルで連動度の高い銘柄を特定',
    ],
  },
  {
    title: '📊 市場全体の地合い判断',
    steps: [
      'ホームのマクロ指標で国内株ETF・米国株ETF・VIX先物ETFを確認',
      'ヒートマップ・モメンタムで「🔥加速」「❄️失速」の数を比較',
      'ヒートマップ全体の色の傾向（赤多=強気・緑多=弱気）を確認',
    ],
  },
]


function QAItem({ q, a, delay = 0 }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: '8px', marginBottom: '6px', overflow: 'hidden',
      animation: `fadeUp 0.3s ease ${delay}s both`,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', fontFamily: 'var(--font)', textAlign: 'left',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Q</span>
        <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{q}</span>
        <span style={{ fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '10px', paddingTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>A</span>
            <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.9 }}>{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HowTo() {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '4px' }}>
        使い方
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '28px' }}>
        StockWaveJP の各機能の使い方・活用方法・見方の解説
      </p>

      {/* 概要カード */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74,158,255,0.1), rgba(255,69,96,0.08))',
        border: '1px solid rgba(74,158,255,0.2)',
        borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          StockWaveJP とは
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.9 }}>
          日本株のテーマ別騰落率・出来高・売買代金をリアルタイムで追跡するダッシュボードです。
          平日9時〜16時の間、1時間おきに自動更新（1日最大8回）。データはETF価格をもとに算出した独自指標を使用しており、
          各指数の公式数値ではありません。投資助言ではなく、参考情報の提供を目的としています。
        </div>
      </div>

      {/* 活用シナリオ */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡 活用シナリオ</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }} className="scenario-grid">
          {USAGE_SCENARIOS.map((sc, i) => (
            <div key={i} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px 16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>
                {sc.title}
              </div>
              <ol style={{ margin: 0, paddingLeft: '16px' }}>
                {sc.steps.map((step, j) => (
                  <li key={j} style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '2px' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* 各ページの説明（クリックで詳細展開） */}
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px',
        display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📖 各ページの詳細説明</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map((s, i) => {
          const isOpen = activeSection === i
          return (
            <div key={i} style={{
              background: 'var(--bg2)', border: `1px solid ${isOpen ? s.color + '55' : 'var(--border)'}`,
              borderRadius: '10px', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* ヘッダー */}
              <button onClick={() => setActiveSection(isOpen ? null : i)} style={{
                width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px', fontFamily: 'var(--font)',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.summary}</div>
                </div>
                <span style={{ fontSize: '12px', color: isOpen ? s.color : 'var(--text3)',
                  fontWeight: 600, flexShrink: 0, transition: 'color 0.2s' }}>
                  {isOpen ? '▲ 閉じる' : '▼ 詳細を見る'}
                </span>
              </button>

              {/* 詳細 */}
              {isOpen && (
                <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${s.color}33` }}>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.9, margin: '14px 0 16px' }}>
                    {s.detail.overview}
                  </p>

                  {/* 機能一覧 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: s.color,
                      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      主な機能
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {s.detail.features.map((f, fi) => (
                        <div key={fi} style={{
                          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                          borderRadius: '8px', padding: '10px 14px',
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                            {f.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8 }}>
                            {f.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 活用Tips */}
                  <div style={{ background: `${s.color}0e`, border: `1px solid ${s.color}33`,
                    borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: s.color,
                      letterSpacing: '0.1em', marginBottom: '8px' }}>
                      💡 活用Tips
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {s.detail.tips.map((t, ti) => (
                        <li key={ti} style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.9, marginBottom: '2px' }}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>


      {/* Q&A */}
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', margin: '28px 0 12px',
        display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>❓ よくある質問（Q&A）</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>
      {[
        {
          q: 'データはどのくらいの頻度で更新されますか？',
          a: '平日の9時5分頃〜15時40分頃まで、1時間おきに最大8回、GitHub Actionsにより自動更新されます。土日・祝日は更新されません。ヘッダーの「最終取得」表示で最新のデータ取得時刻を確認できます。',
        },
        {
          q: '表示されているデータはリアルタイムですか？',
          a: 'いいえ。データは最大1時間の遅延があります。取引時間中のリアルタイム価格ではなく、直近の更新タイミングの終値を基準に集計されます。実際の売買には証券会社の公式データをご使用ください。',
        },

        {
          q: '騰落率はどのように計算されていますか？',
          a: '各テーマの騰落率は、テーマに含まれる構成銘柄それぞれの騰落率（期間開始日の終値を基準とした変化率）を平均したものです。公式の指数（日経平均株価・TOPIXなど）とは異なる独自の集計値です。',
        },
        {
          q: '「連動度」とは何ですか？',
          a: '連動度は、その銘柄がテーマ全体の平均騰落率に対してどれだけ貢献しているかを示す指標です。テーマ平均騰落率をテーマ内の銘柄数で均等割りした値として計算しています。',
        },
        {
          q: 'カスタムテーマとは何ですか？どこに保存されますか？',
          a: 'カスタムテーマはサイドメニューの「カスタムテーマ」から自分だけのテーマを作成できる機能です。1アカウントにつき最大3テーマまで作成できます。Googleアカウントでログインするとクラウドに保存されマルチデバイスで同期できます。未ログインの場合はブラウザのローカルストレージに保存されます。カスタムテーマはテーマ一覧・テーマ別詳細にも表示されます。',
        },

        {
          q: '「状態（加速・失速・転換）」はどう判定されますか？',
          a: '騰落モメンタムの状態は、騰落率と先週比の組み合わせで判定しています。🔥加速：先週比+3pt超かつ先月比+5pt超、❄️失速：その逆、↗転換↑：先週比+2pt超（下落から上昇へ）、↘転換↓：先週比-2pt未満（上昇から下落へ）、→横ばい：それ以外です。',
        },


        {
          q: 'データに誤りがあると思われる場合はどうすればよいですか？',
          a: 'サイドメニューの「当サイトについて」ページよりご連絡ください。データプロバイダに起因する誤りの場合は修正が困難な場合もありますが、内容を確認の上対応いたします。',
        },
      ].map((item, i) => (
        <QAItem key={i} q={item.q} a={item.a} delay={i * 0.04} />
      ))}



      <style>{`
        @media (max-width: 768px) {
          .scenario-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
