# EDINET財務Factアーカイブ

`backend/fetch_edinet_financial_facts.py` はEDINET API v2の提出本文書ZIPを取得し、
分析時に用途を後決めできるよう、XBRLのFactを項目限定せず履歴保存します。

## 保存場所

- `frontend/public/data/edinet_financial_facts/index.json`: 書類一覧と銘柄別docID
- `frontend/public/data/edinet_financial_facts/filings/{docID}.json.gz`: 書類別の全Fact
- `frontend/public/data/edinet_financial_facts/source_zips/{docID}.zip`: `--keep-source-zip`指定時だけ保存するEDINET原本

既存docIDは再取得せず、過去の提出書類を削除しません。初回は過去370日を走査し、
以後は平日の定期処理で直近14日を重複なく追加します。

## 保存する内容

- EDINET書類一覧APIが返す提出者、証券コード、書類種別、対象期間、訂正・取下げ状態等の全メタデータ
- ZIP内ファイル一覧と解析対象XBRLファイル名
- XBRL名前空間
- 全context（期間・時点、EDINETコード、連結/単体、セグメント等のdimension）
- 全unit（円、株、割合、複合単位等）
- `contextRef`を持つ全Fact
  - conceptの完全修飾名、ローカル名、namespace
  - 原文値と、数値の場合はscale/sign適用後の文字列値
  - unit、decimals、precision、言語、nil、Inline XBRL属性
  - 文章項目とTextBlockも省略しない

金額をJSON浮動小数点へ変換すると桁落ちするため、`numeric_value`は文字列です。
分析側ではcontextの期間とdimensionを必ず見て、当期/前期、連結/単体、継続期間/時点を区別してください。

## 実行例

```powershell
$env:EDINET_API_KEY = 'EDINETのAPIキー'
python backend/fetch_edinet_financial_facts.py --days 14 --site
python backend/fetch_edinet_financial_facts.py --backfill 370 --site
python backend/fetch_edinet_financial_facts.py --days 30 --tickers 7203,6857
```

原本ZIPのGit保存は容量が急増するため標準では無効です。通常の分析に必要なXBRL情報は
gzip JSONへ全件保存されます。監査やパーサー再構築のため原本も必要な場合だけ
`--keep-source-zip`を指定してください。

ブラウザー側では`DecompressionStream('gzip')`、Pythonでは`gzip.open()`で展開できます。
