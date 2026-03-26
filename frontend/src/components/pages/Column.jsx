/**
 * Column.jsx — コラム・解説ページ
 * AdSense審査対応：株式投資初心者向けオリジナルテキストコンテンツ
 */
import { useState } from 'react'

const COLUMNS = [
  {
    id: 'theme-investing-basics',
    category: '入門',
    icon: '📘',
    title: 'テーマ株投資とは？個別株・インデックスとの違いをわかりやすく解説',
    date: '2026/03/20',
    summary: '「半導体関連株が急騰」「AI銘柄に資金集中」といったニュースを聞いたことがあるでしょう。テーマ株投資とは何か、メリット・リスクをゼロから解説します。',
    body: `
## テーマ株投資とは

テーマ株投資とは、特定の社会トレンドや技術革新に関連する複数の銘柄をまとめて「テーマ」として捉え、そのテーマ全体の動向を分析する投資スタイルです。

たとえば「半導体」テーマであれば、半導体製造装置メーカー・素材メーカー・設計会社など、半導体産業に関わる企業群をひとつのグループとして見ます。

## 個別株投資との違い

個別株投資は1社の業績・財務を深く分析して売買します。一方テーマ投資は「どの産業・技術に資金が集まっているか」という大きな流れを掴むことに重点を置きます。

一社の決算ミスで大きく損失が出るリスクを、テーマ全体の分散でやわらげることができる点が特徴です。

## インデックス投資との違い

インデックス投資（日経平均・S&P500連動など）は市場全体に投資する方法です。テーマ投資はその中でも「成長が期待される特定分野」に絞った投資です。

インデックスより高いリターンを狙える可能性がある一方、テーマが時代遅れになると急落するリスクもあります。

## テーマ株のサイクル

テーマ株には「注目期→加熱期→調整期→成熟期」というサイクルがあります。注目が集まり始めた初期段階で乗れると大きなリターンが期待できますが、過熱した後に参入すると高値掴みになるリスクがあります。

騰落率・出来高・売買代金のデータを組み合わせて、今どの段階にあるかを読むことがテーマ投資の核心です。

## まとめ

テーマ株投資は「時代の変化を先読みする投資」です。ただし、テーマへの熱狂が先行して実態と乖離することも多いため、冷静なデータ分析が欠かせません。StockWaveJPは各テーマの騰落率・出来高・売買代金をリアルタイムで可視化し、客観的な判断材料を提供します。
    `,
  },
  {
    id: 'semiconductor-theme',
    category: '半導体',
    icon: '⚡',
    title: '半導体テーマ徹底解説：AI需要が牽引する構造的成長と主要銘柄の関係性',
    date: '2026/03/18',
    summary: '半導体は現代産業の「コメ」と呼ばれる基幹部品です。AI・EV・スマートフォンすべてに必要不可欠な半導体テーマの構造と、国内主要銘柄の役割を解説します。',
    body: `
## なぜ半導体テーマが注目されるのか

半導体は、スマートフォン・パソコン・自動車・家電・産業機器、そして生成AIを動かすデータセンターまで、あらゆる電子機器に使われています。特に2023年以降、生成AIブームによりGPUやHBM（高帯域メモリ）の需要が爆発的に増加し、半導体関連銘柄が世界的に注目を集めています。

## 半導体バリューチェーンと国内企業の位置づけ

半導体産業はいくつかの工程に分かれており、日本企業はその中でも特定領域で世界トップシェアを持ちます。

**製造装置（強みの中核）**
- 東京エレクトロン（8035）：エッチング装置・コーター/デベロッパーで世界シェア上位
- アドバンテスト（6857）：半導体テスト装置で世界トップ
- ディスコ（6146）：ダイシング・研削装置で圧倒的シェア
- レーザーテック（6920）：EUVマスク欠陥検査装置でほぼ独占

**設計・SoC**
- ルネサスエレクトロニクス（6723）：車載マイコンで世界トップ3
- ソシオネクスト（6526）：SoC設計専業（ファブレス）

**素材**
- SUMCO（3436）：シリコンウエハで世界2位

## バリューチェーンの連鎖

「製造装置→ウエハ（素材）→半導体チップ→搭載製品」という流れがあり、AI需要の増加は上流の製造装置・素材にも波及します。AIサーバー向け需要が拡大すると、真っ先に装置・素材の受注が増えるため、国内半導体関連株が反応しやすい構造になっています。

## 最近のトピックス

- 先端半導体（2nm・3nm）向け装置需要の急拡大
- HBM（高帯域幅メモリ）対応の検査装置需要増
- 日米間の半導体サプライチェーン再構築（熊本TSMCなど）
- 輸出規制の動向（対中規制が装置メーカーの売上に影響）

## リスク要因

半導体産業はシリコンサイクル（好況・不況の繰り返し）が激しく、スマホや汎用半導体の在庫調整局面では株価が大きく下落することがあります。AI向け先端半導体が好調でも、自動車・家電向けが不振という二極化が起きることも。

テーマ全体の騰落率だけでなく、出来高の変化（資金フロー）を見ることで市場の関心度を把握することが重要です。
    `,
  },
  {
    id: 'ai-cloud-theme',
    category: 'AI・クラウド',
    icon: '🤖',
    title: 'AI・クラウドテーマ：生成AI時代に変わる日本企業の競争環境と投資機会',
    date: '2026/03/16',
    summary: 'ChatGPTの登場以来、AI関連への投資資金流入が世界規模で続いています。国内AI・クラウドテーマの特徴と、インフラ・ソフトウェア・サービス各層の主要企業を解説します。',
    body: `
## 日本のAI・クラウド市場の特徴

米国ではOpenAI・Google・MicrosoftなどのビッグテックがAI競争をリードしていますが、日本市場においてはAIを「実装・活用」する側の企業群が投資テーマとして注目されています。

## テーマ内の3つの層

**インフラ層（クラウド・データセンター）**
- さくらインターネット（3778）：国産GPUクラウドを政府支援のもと整備。生成AI向けGPUサーバーの国産化で注目
- 富士通（6702）・NEC（6701）：国内大手SIerとしてAI基盤構築案件を多数受注

**プラットフォーム・ミドルウェア層**
- 野村総合研究所（4307）：金融・流通向けAI活用システムの構築

**アプリケーション・サービス層**
- SCSK（9719）・TIS（3626）：企業向けAI導入支援・DX推進
- オービック（4684）：中堅企業向けERP・AIによる業務効率化

## AI活用の「波」の広がり

生成AIブームは第1波（モデル開発・インフラ投資）から第2波（企業への実装・業務効率化）へ移行しつつあります。日本企業は第1波より第2波での恩恵が大きく、SIer・ソフトウェア企業への資金流入が続いています。

## 最近のトピックス

- 政府の生成AI活用推進策（行政システムへのAI導入）
- さくらインターネットのGPUクラウド整備加速
- 国産LLM開発（NEC・富士通・NTTなど）
- AI活用による人材不足対応需要の拡大

## 投資上の注意点

「AI」の名前がついた銘柄が急騰することがありますが、実際の収益貢献が限定的な場合も多いです。売買代金の急増→騰落率の確認→トレンドの継続性という順で確認することを推奨します。
    `,
  },
  {
    id: 'defense-theme',
    category: '防衛・宇宙',
    icon: '🛡️',
    title: '防衛・宇宙テーマ：地政学リスクと防衛費拡大が生む構造的な追い風',
    date: '2026/03/14',
    summary: '日本の防衛費はGDP比2%への増額方針が決定し、2027年度に向けて大幅な拡大が続きます。防衛・宇宙テーマの構造と主要企業の関係を解説します。',
    body: `
## 防衛テーマが注目される背景

2022年以降の地政学リスク上昇と、日本政府による防衛費増額（2027年度にGDP比2%相当＝約10兆円規模）の決定により、防衛関連銘柄が国内テーマ株として急速に注目を集めるようになりました。

## 防衛産業のバリューチェーン

**システムインテグレーター（主契約企業）**
- 三菱重工業（7011）：戦闘機・艦艇・ミサイルなど主要防衛装備を一手に担う
- 川崎重工業（7012）：潜水艦・哨戒機・陸上装備
- IHI（7013）：航空エンジン・ロケットエンジン

**電子・通信系**
- NEC（6701）：防衛通信システム・レーダー
- 富士通（6702）：指揮・通信・管制システム

**宇宙インフラ**
- 三菱電機（6503）：人工衛星・ロケット搭載電子機器
- IHIエアロスペース：固体ロケット（イプシロン後継）

## 注目ポイント：装備品の国産化

日本は長年、多くの防衛装備品を米国から調達してきました。しかし安全保障上の理由から国産化・ライセンス生産の推進が加速しており、国内防衛産業の市場拡大が期待されています。

## 最近のトピックス

- 次期戦闘機（F-X）の日英伊共同開発進捗
- スタンドオフミサイル（長射程兵器）の量産開始
- 宇宙安全保障に向けた早期警戒衛星整備
- 防衛費増額に伴う各社の受注残高拡大

## 騰落率のみかた

防衛テーマは地政学的なニュース（紛争・軍事的緊張）に敏感に反応します。短期的な急騰後に調整するパターンが多いため、出来高の変化と売買代金の推移を合わせて確認することが重要です。
    `,
  },
  {
    id: 'inbound-theme',
    category: 'インバウンド',
    icon: '✈️',
    title: 'インバウンドテーマ：訪日外国人3,000万人超が生む消費拡大と恩恵企業',
    date: '2026/03/12',
    summary: '2025年の訪日外客数は3,000万人を超え、過去最高水準が続いています。インバウンド消費の拡大が直接・間接に恩恵をもたらす業種と主要銘柄を解説します。',
    body: `
## インバウンド消費の現状

訪日外国人による消費（インバウンド消費）は2024年に過去最高の約8兆円を記録し、2025年以降もその水準が続いています。円安が追い風となり、特に高価格帯の商品・体験への消費が顕著です。

## インバウンドテーマの構成

**直接恩恵（宿泊・観光）**
- オリエンタルランド（4661）：東京ディズニーリゾート。訪日客・国内客双方の需要
- 交通インフラ（JR各社・空港）

**消費（小売・百貨店）**
- 外国人観光客の免税購入で百貨店・ドラッグストア・コンビニ等の売上増

**地域経済・不動産**
- 観光地周辺の宿泊施設・民泊需要
- 京都・大阪・北海道など観光地の地価上昇

**医療ツーリズム**
- 健診・審美歯科・美容医療の訪日医療観光増加

## なぜ円安がテーマを強化するか

円安が進むほど外国人から見た日本の物価が相対的に安くなり、消費単価が上がります。同じ宿泊でも外国人旅行者は高単価プランを選ぶ傾向があり、ホテル・旅館の収益改善につながります。

## 最近のトピックス

- オーバーツーリズム対策（入島料・混雑規制）の議論
- 外国人向け高付加価値旅行（ラグジュアリー旅行）の拡大
- インバウンド消費の地方波及（東京・京都一極集中の変化）
- アジア富裕層の「爆買い」から「体験消費」へのシフト

## テーマのリスク

円高転換・景気後退・感染症・地政学リスクによる渡航制限が急落要因となります。インバウンド需要は外部環境の変化に敏感なため、為替動向と組み合わせた分析が重要です。
    `,
  },
  {
    id: 'ev-green-theme',
    category: 'EV・脱炭素',
    icon: '🔋',
    title: 'EV・脱炭素テーマ：世界的な電動化シフトと日本企業の強みと課題',
    date: '2026/03/10',
    summary: '脱炭素・電動化は世界的な長期トレンドです。日本の自動車・素材・エネルギー関連企業が担う役割と、テーマ内の資金フローの読み方を解説します。',
    body: `
## EV・脱炭素テーマの全体像

EVシフトはトヨタをはじめとする日本の自動車メーカーだけでなく、部品・素材・エネルギー各分野に広がる巨大なテーマです。2035年の欧州新車販売ガソリン車禁止を筆頭に、各国が電動化目標を設定しており、関連企業への長期的な需要が続きます。

## テーマの構成企業と関係性

**完成車・主要Tier1**
- トヨタ自動車（7203）：HEV・PHEV・FCV・BEVの全方位戦略
- デンソー（6902）：トヨタグループ最大の部品メーカー。EV用パワートレイン・熱管理システム

**電池・素材**
- パナソニックHD（6752）：EV用円筒形リチウムイオン電池（テスラ向け等）
- 住友電気工業（5802）：ワイヤーハーネス（EV化で高電圧対応需要増）
- 住友金属鉱山（5713）：ニッケル・コバルトなど電池材料

**充電・エネルギーインフラ**
- 再エネ・充電インフラ関連

**脱炭素・環境**
- 省エネ設備・カーボンクレジット関連企業

## バリューチェーンの連鎖

「電池材料→電池セル→EV→充電インフラ→電力供給」という連鎖があります。電池性能の向上が素材需要の変化を生み（コバルト削減→ニッケル増加など）、投資先の変化を引き起こすこともあります。

## 最近のトピックス

- 全固体電池の量産化スケジュール（トヨタ2027〜2028年目標）
- 中国EV（BYD等）の日本市場参入加速
- 脱炭素への逆風：米国でのEV補助金政策変更
- 水素・燃料電池車（FCV）への期待と現実

## 投資上の注意点

EVシフトは長期トレンドですが、短期では「EV失速」報道で急落することがあります。長期の構造変化と短期の需給変動を区別して判断することが重要です。
    `,
  },
  {
    id: 'how-to-read-data',
    category: '分析手法',
    icon: '📊',
    title: '騰落率・出来高・売買代金の読み方：テーマ株分析の3つの基本指標',
    date: '2026/03/08',
    summary: 'StockWaveJPに表示される3つの指標（騰落率・出来高・売買代金）がそれぞれ何を意味するのか、実際のテーマ分析でどう活用するかを解説します。',
    body: `
## 3つの基本指標

### 1. 騰落率（価格変化率）

期間内の株価変化率を示します。「このテーマが期間中に平均何%上がった（下がった）か」を表します。

テーマの騰落率は、テーマに含まれる銘柄の騰落率の平均値で計算されます。

**活用法**
- 全テーマ比較で「今どのテーマに資金が入っているか」を確認
- 期間（1週間・1ヶ月・3ヶ月・1年）を変えて「短期の動きか長期トレンドか」を確認

### 2. 出来高（取引量）

期間中に取引された株式の数量です。出来高が多いほど、そのテーマへの市場参加者の関心が高いことを示します。

**活用法**
- 騰落率が高くても出来高が少ない→「材料は出たが市場全体の関心は低い」
- 騰落率が上昇しつつ出来高も増加→「本格的な資金流入の可能性」

### 3. 売買代金（取引金額）

出来高×株価で計算される金額ベースの指標です。株価の高い銘柄が多いテーマは、出来高が少なくても売買代金が大きくなります。

**活用法**
- テーマの実際の「お金の動き」を把握するには売買代金が最も適切
- 機関投資家・大口投資家の動向は売買代金に反映されやすい

## 3指標の組み合わせ分析

| 騰落率 | 出来高 | 売買代金 | 解釈 |
|---|---|---|---|
| 上昇↑ | 増加↑ | 増加↑ | 強い上昇トレンド、資金流入加速 |
| 上昇↑ | 減少↓ | 減少↓ | 上昇は一時的、勢い弱まり |
| 下落↓ | 増加↑ | 増加↑ | 急落・パニック売り |
| 下落↓ | 減少↓ | 減少↓ | 静かな調整、底打ち待ち |

## 騰落モメンタムとの組み合わせ

StockWaveJPの「騰落モメンタム」では先週比・状態（加速/失速/転換）を確認できます。「騰落率が高く・出来高増加・状態が加速」であれば、そのテーマへの資金流入が継続していることを示す強いシグナルです。

## 注意点

これらの指標は「参考情報」であり、将来の株価を保証するものではありません。実際の投資判断は、企業の財務情報・マクロ経済・自身のリスク許容度を総合的に考慮してください。
    `,
  },
  {
    id: 'market-cycle',
    category: '分析手法',
    icon: '🔄',
    title: '市場サイクルとテーマ投資：資金ローテーションを読む技術',
    date: '2026/03/06',
    summary: '株式市場では資金は常にどこかへ動いています。市場サイクルに応じてテーマ間で資金がローテーションする仕組みと、それを活用した投資アプローチを解説します。',
    body: `
## 市場サイクルとは

株式市場には景気・金利・企業業績などに連動した「サイクル」があります。このサイクルの局面によって、どのテーマが買われやすいかが変わります。

## 代表的なサイクルと強いテーマ

**景気拡大期（金利低め・成長期待大）**
→ AI・テクノロジー・半導体・グロース株が強い

**景気後退懸念期（金利上昇・リスクオフ）**
→ ディフェンシブ（医薬品・食品・インフラ）・高配当株が強い

**インフレ・資源高局面**
→ 素材・エネルギー・商社が強い

**円安局面**
→ 輸出関連（自動車・精密機器）・インバウンドが強い

**地政学リスク上昇**
→ 防衛・エネルギー安保関連が強い

## 資金ローテーションのサイン

テーマ間で資金が移動する「ローテーション」のサインは以下のように現れます。

1. 強かったテーマの騰落率が鈍化し、出来高が減少
2. 別のテーマの出来高が急増し始める
3. 新たなテーマの騰落率が上昇に転じる

StockWaveJPの「資金フロー」ページでは全テーマの騰落率と出来高を比較できるため、このローテーションの兆候をリアルタイムで確認できます。

## セクターローテーションの実例

2024年〜2025年の日本株では：
- 2024年前半：半導体・AI関連が強いトレンド
- 2024年後半：金利上昇懸念でグロースから金融・バリューへ資金移動
- 2025年：防衛・インバウンドの台頭と半導体の再加速

このような流れをヒートマップで可視化することで、どのテーマが長期トレンドにあるかを確認できます。

## 重要な注意

資金ローテーションの「予測」は困難です。上記はあくまで過去の傾向であり、将来も同じパターンが繰り返す保証はありません。データを参考に自分で考え、判断する材料として活用してください。
    `,
  },
]

const CATEGORIES = ['すべて', '入門', '半導体', 'AI・クラウド', '防衛・宇宙', 'インバウンド', 'EV・脱炭素', '分析手法']

const CAT_COLORS = {
  '入門':       { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff',  border:'rgba(74,158,255,0.25)' },
  '半導体':     { bg:'rgba(255,69,96,0.1)',   color:'#ff4560',  border:'rgba(255,69,96,0.25)' },
  'AI・クラウド':{ bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '防衛・宇宙': { bg:'rgba(76,175,130,0.1)',  color:'#4caf82',  border:'rgba(76,175,130,0.25)' },
  'インバウンド':{ bg:'rgba(255,140,66,0.1)',  color:'#ff8c42',  border:'rgba(255,140,66,0.25)' },
  'EV・脱炭素': { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0',  border:'rgba(6,214,160,0.25)' },
  '分析手法':   { bg:'rgba(255,214,25,0.1)',  color:'#ffd619',  border:'rgba(255,214,25,0.25)' },
}

// Markdown風テキストを簡易レンダリング
function RenderBody({ text }) {
  const lines = text.trim().split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontSize:'16px', fontWeight:700, color:'#e8f0ff',
          margin:'24px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} style={{ fontSize:'13px', fontWeight:700, color:'var(--accent)', margin:'14px 0 6px' }}>
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin:'6px 0 12px', paddingLeft:'20px' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.8, marginBottom:'2px' }}>
              {item.includes('（') ? (
                <>
                  <span style={{ color:'var(--text)', fontWeight:600 }}>{item.split('：')[0]}</span>
                  {item.includes('：') ? <span style={{ color:'var(--text2)' }}>：{item.split('：').slice(1).join('：')}</span> : null}
                </>
              ) : item}
            </li>
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('| ')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('| ')) {
        if (!lines[i].includes('---')) {
          rows.push(lines[i].trim().split('|').filter(c => c.trim()).map(c => c.trim()))
        }
        i++
      }
      if (rows.length > 0) {
        elements.push(
          <div key={`table-${i}`} style={{ overflowX:'auto', margin:'12px 0 20px' }}>
            <table style={{ borderCollapse:'collapse', fontSize:'12px', width:'100%', minWidth:'400px' }}>
              <thead>
                <tr>
                  {rows[0].map((h, j) => (
                    <th key={j} style={{ padding:'8px 12px', textAlign:'left', borderBottom:'1px solid var(--border)',
                      color:'var(--text3)', fontWeight:600, background:'var(--bg3)', whiteSpace:'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding:'8px 12px', color:'var(--text2)', lineHeight:1.6 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    } else {
      elements.push(
        <p key={i} style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.9, margin:'0 0 12px' }}>
          {line}
        </p>
      )
    }
    i++
  }
  return <div>{elements}</div>
}

export default function Column() {
  const [activeCat,  setActiveCat]  = useState('すべて')
  const [activeCol,  setActiveCol]  = useState(null)

  const filtered = activeCat === 'すべて'
    ? COLUMNS
    : COLUMNS.filter(c => c.category === activeCat)

  if (activeCol) {
    const col = COLUMNS.find(c => c.id === activeCol)
    const cat = CAT_COLORS[col.category] || CAT_COLORS['入門']
    return (
      <div style={{ padding:'20px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
        <button onClick={() => setActiveCol(null)} style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:'transparent', border:'none', color:'var(--accent)',
          fontSize:'13px', cursor:'pointer', fontFamily:'var(--font)',
          padding:'0', marginBottom:'20px',
        }}>
          ← コラム一覧に戻る
        </button>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px',
          background:cat.bg, color:cat.color, border:`1px solid ${cat.border}`,
          display:'inline-block', marginBottom:'12px' }}>
          {col.category}
        </span>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'#e8f0ff', lineHeight:1.5, marginBottom:'8px' }}>
          {col.title}
        </h1>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'24px' }}>
          {col.date}
        </div>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px',
          padding:'6px 20px 20px', marginBottom:'28px' }}>
          <RenderBody text={col.body} />
        </div>
        <div style={{ background:'rgba(255,140,66,0.07)', border:'1px solid rgba(255,140,66,0.2)',
          borderRadius:'8px', padding:'14px 18px', fontSize:'12px', color:'var(--text2)', lineHeight:1.8 }}>
          ⚠️ 本コラムは情報提供を目的としており、特定の銘柄・投資方法を推奨するものではありません。
          実際の投資判断はご自身の責任において行ってください。
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'20px 32px 60px' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'#e8f0ff', marginBottom:'4px' }}>
        コラム・解説
      </h1>
      <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'24px' }}>
        テーマ株投資の基礎から各テーマの詳細解説まで、投資判断に役立つ情報を提供します。
      </p>

      {/* カテゴリフィルタ */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'24px' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{
            padding:'5px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer',
            fontFamily:'var(--font)', transition:'all 0.15s',
            border: activeCat === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: activeCat === cat ? 'rgba(74,158,255,0.12)' : 'transparent',
            color: activeCat === cat ? 'var(--accent)' : 'var(--text3)',
            fontWeight: activeCat === cat ? 600 : 400,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* コラム一覧 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }} className="col-grid">
        {filtered.map((col, i) => {
          const cat = CAT_COLORS[col.category] || CAT_COLORS['入門']
          return (
            <div key={col.id} onClick={() => setActiveCol(col.id)} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'18px 20px', cursor:'pointer',
              animation:`fadeUp 0.3s ease ${i * 0.05}s both`,
              transition:'border-color 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(74,158,255,0.3)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <span style={{ fontSize:'20px' }}>{col.icon}</span>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'12px',
                  background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>
                  {col.category}
                </span>
                <span style={{ fontSize:'10px', color:'var(--text3)', marginLeft:'auto', fontFamily:'var(--mono)' }}>
                  {col.date}
                </span>
              </div>
              <h2 style={{ fontSize:'13px', fontWeight:700, color:'#e8f0ff', lineHeight:1.5, marginBottom:'8px' }}>
                {col.title}
              </h2>
              <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7, margin:0,
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {col.summary}
              </p>
              <div style={{ marginTop:'12px', fontSize:'11px', color:'var(--accent)', fontWeight:600 }}>
                続きを読む →
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width:640px) { .col-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
