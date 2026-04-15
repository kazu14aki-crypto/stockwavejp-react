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
          desc: '上昇テーマ数・全テーマ平均騰落率・資金流入TOP・資金流出TOPを表示します。矢印（↗↘）で方向感を確認できます。',
        },
        {
          name: 'マーケット指標・ミニカード',
          desc: '国内主要株ETF・国内広域ETF・米国株ETF・ドル円・米国ハイテクETF・VIX先物ETFの6指標をカード形式で表示。',
        },
      ],
      tips: [
        'まずホームで全体の地合いを確認してから、テーマ一覧に移るのが効率的なルーティンです。',
        'VIX（恐怖指数）が高い局面は市場の不安定性が高まっているサイン。リスク管理を優先しましょう。',
      ],
    },
  },
  {
    icon: '📊',
    title: 'テーマ一覧',
    color: '#4a9eff',
    summary: '67テーマの騰落率・出来高・売買代金を一覧比較',
    detail: {
      overview: '日本株67テーマの騰落率・出来高・売買代金をランキング形式で一覧比較できます。どのテーマに資金が流入・流出しているかを一目で把握できます。',
      features: [
        {
          name: '期間切り替え',
          desc: '1日・1週間・1ヶ月・3ヶ月・6ヶ月・1年の6期間で表示を切り替え可能。短期と長期のトレンドを使い分けて比較できます。',
        },
        {
          name: '上昇・下落TOP5',
          desc: '直近の資金流入TOP5テーマと流出TOP5テーマを横棒グラフで強調表示。最も注目すべきテーマを瞬時に把握できます。',
        },
        {
          name: '📊 テーマ詳細を確認ボタン',
          desc: '各テーマカードの「テーマ詳細を確認」ボタンからテーマ別詳細ページに直接移動できます。',
        },
      ],
      tips: [
        '「上昇TOP5」に連続して登場するテーマは強いトレンドの可能性があります。出来高・売買代金も同時に確認しましょう。',
        '「全テーマ平均騰落率」がマイナスの日は市場全体が下落局面。その中でプラスのテーマが本当に強いテーマです。',
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
          desc: 'ページ上部のセレクトボックスでテーマを選択。平均騰落率・総出来高・売買代金などのKPIカードが即座に更新されます。',
        },
        {
          name: '注目銘柄ピックアップ',
          desc: 'テーマ内の構成銘柄を騰落率・出来高急増・直近加速・売買代金で総合スコア化し、上位3銘柄を選定理由付きで表示します。投資推奨ではありません。',
        },
        {
          name: '構成銘柄テーブル',
          desc: '構成銘柄の株価・騰落率・時価総額・連動度・出来高・売買代金・スパークライン（6ヶ月推移）を一覧表示。横スワイプで全詳細を確認できます。',
        },
        {
          name: '出来高・売買代金グラフ',
          desc: 'テーマ全体の1年間の週次出来高（折れ線・左軸）と売買代金（棒グラフ・右軸）の推移グラフ。資金流入の継続性を確認できます。',
        },
      ],
      tips: [
        '「連動度」は各銘柄のテーマ平均騰落率への貢献度を示します。連動度が高い銘柄はテーマの代表株として動きます。',
        'スパークライン（銘柄名横の折れ線）で6ヶ月の騰落トレンドを一目確認。上昇トレンドは赤、下落は緑で表示されます。',
      ],
    },
  },
  {
    icon: '📋',
    title: '市場別詳細',
    color: '#06d6a0',
    summary: '日経225・時価総額上位・市場区分別の銘柄分析',
    detail: {
      overview: '日経225採用銘柄・時価総額上位150銘柄・市場区分（プライム・スタンダード・グロース）ごとに銘柄の騰落率・出来高・売買代金を確認できます。',
      features: [
        {
          name: '国内主要株タブ',
          desc: '日経225銘柄を「技術・金融・消費・素材・資本財・運輸」の6セグメントに分類して表示。どのセクターに資金が流入しているかを把握できます。',
        },
        {
          name: '国内全般タブ',
          desc: '時価総額上位50・上位51-100位・上位101-150位の3グループで時価総額上位銘柄の動向を確認できます。',
        },
        {
          name: '市場区分タブ',
          desc: 'プライム・スタンダード・グロース市場の代表銘柄を表示。市場区分ごとの資金動向を確認できます。',
        },
      ],
      tips: [
        '日経225の「技術セグメント」が強い時は半導体・AI関連テーマへの資金流入が続いている可能性があります。',
        'スパークライン（銘柄名横）で個別銘柄の6ヶ月トレンドを確認し、上昇継続中の銘柄を見つけましょう。',
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
          desc: 'テーマごとに「騰落率・先週比・状態」を表示。状態は🔥加速・❄️失速・↗転換↑・↘転換↓・→横ばいの5種類。',
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
    icon: '🎨',
    title: 'カスタムテーマ',
    color: '#aa77ff',
    summary: '自分だけのオリジナルテーマを作成・管理',
    detail: {
      overview: '任意の銘柄を組み合わせて独自のテーマを作成できます。既存67テーマに含まれない組み合わせを自由に設定できます。',
      features: [
        {
          name: 'テーマ作成',
          desc: '銘柄コード（例：7203.T）または銘柄名で検索して追加。テーマ名・説明文も自由に設定できます。',
        },
        {
          name: 'テーマ一覧・詳細との連携',
          desc: 'カスタムテーマはテーマ一覧・テーマ別詳細に通常テーマと同様に表示され、騰落率・出来高・売買代金・連動度も自動集計されます。',
        },
      ],
      tips: [
        'ウォッチリストとして活用する方法が人気です。気になる銘柄を登録しておくと毎日の変動を一括確認できます。',
        '作成したカスタムテーマはブラウザのLocalStorageに保存されます（最大3テーマ）。',
      ],
    },
  },
  {
    icon: '⚙️',
    title: '設定',
    color: '#4a6080',
    summary: '表示設定・カラーテーマのカスタマイズ',
    detail: {
      overview: 'サイトの表示設定を変更できます。ダーク/ライトモードの切り替えや表示カスタマイズが可能です。',
      features: [
        {
          name: 'カラーテーマ',
          desc: 'ダークモード（デフォルト）とライトモードを切り替えられます。目の疲れや環境に合わせて選択してください。',
        },
      ],
      tips: [
        '設定はブラウザのLocalStorageに保存され、次回アクセス時も引き継がれます。',
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
          a: '連動度は、その銘柄の日次騰落率がテーマ全体の平均日次騰落率にどれだけ連動しているかを示す相関係数（-100〜+100）です。+100に近いほど「テーマと同じ方向に動きやすい代表銘柄」、0に近いほどテーマとは独立して動く銘柄です。マイナスは逆方向に動く傾向があることを示します。テーマの中心的な動きを担う銘柄を探す指標として活用してください。',
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
