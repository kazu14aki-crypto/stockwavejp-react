export default function Disclaimer() {
  const s  = { padding:'32px 28px 60px', maxWidth:'780px', margin:'0 auto', lineHeight:1.9, fontSize:'13px', color:'var(--text2)' }
  const h1 = { fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }
  const h2 = { fontSize:'14px', fontWeight:700, color:'var(--text)', margin:'24px 0 8px', paddingBottom:'6px', borderBottom:'1px solid var(--border)' }
  const p  = { marginBottom:'12px' }

  return (
    <div style={s}>
      <h1 style={h1}>免責事項</h1>
      <p style={{ ...p, fontSize:'12px', color:'var(--text3)' }}>最終更新日：2025年3月1日</p>

      <h2 style={h2}>1. 情報の目的と性質</h2>
      <p style={p}>
        本サービス「StockWaveJP」は、株式市場のテーマ別騰落率・出来高・売買代金の可視化ツールです。
        投資判断の参考情報の提供を目的としており、<strong>特定の有価証券の売買を推奨・勧誘するものではありません。</strong>
        本サービスは金融商品取引法に基づく投資助言業の登録を行っておらず、投資助言には該当しません。
      </p>

      <h2 style={h2}>2. データの独自集計について</h2>
      <p style={p}>
        当サイトで表示される各数値（テーマ別騰落率・出来高・売買代金等）は、対象銘柄のデータを元に当サイトが独自に集計・算出したものです。
        日本経済新聞社が公表する「日経平均株価」や、JPX総研が公表する「TOPIX」等の公式指数値ではありません。
      </p>

      <h2 style={h2}>3. データの正確性とソース</h2>
      <p style={p}>
        当サイトの情報はInfoway（data.infoway.io）および金融庁EDINET等のデータプロバイダーより取得しておりますが、
        データの正確性・完全性・最新性を保証するものではありません。
        実際の投資に際しては、必ず証券会社等の公式データをご確認ください。
      </p>
      <p style={p}>
        提供データには市場に応じた遅延（リアルタイムデータは当日分、日次データは前営業日分）が含まれる場合があります。
      </p>

      <h2 style={h2}>4. 損害への免責</h2>
      <p style={p}>
        本サービスの情報に基づく投資判断の結果生じた損失・損害（直接・間接を問わず）について、当運営者は一切の責任を負いません。
        本サービスは「現状のまま（as-is）」で提供されており、サービスの中断・不具合・データの欠落等による損害についても同様です。
      </p>

      <h2 style={h2}>5. 外部リンクについて</h2>
      <p style={p}>
        本サービスに掲載されている外部リンク（証券会社・金融機関・EDINET等）は参考情報として提供しています。
        リンク先のコンテンツ・サービスについて当運営者は責任を負いません。
      </p>

      <h2 style={h2}>6. 著作権について</h2>
      <p style={p}>
        本サービスのコード・デザイン・テーマ分析記事・コラム等のコンテンツは著作権により保護されています。
        個人的・非商業的な目的での閲覧・参照のみを許可します。
        無断転載・複製・商業利用はお断りします。
      </p>

      <h2 style={h2}>7. 本免責事項の変更</h2>
      <p style={p}>
        本免責事項は予告なく変更する場合があります。変更後も引き続き本サービスをご利用いただいた場合、
        変更後の内容に同意いただいたものとみなします。
      </p>

      <h2 style={h2}>8. お問い合わせ</h2>
      <p style={p}>
        本免責事項に関するご質問は <a href="mailto:stockwavejp26@gmail.com" style={{ color:'var(--accent)' }}>stockwavejp26@gmail.com</a> までお問い合わせください。
      </p>
    </div>
  )
}
