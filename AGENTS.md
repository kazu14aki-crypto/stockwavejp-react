# StockWaveJP 開発ルール

## 対象と言語

- このリポジトリは StockWaveJP の日本語版である。画面文言、コラム、説明、メタデータ、運用ドキュメントは日本語を優先する。
- 英語版または翻訳用の資産が存在しても、明示的な依頼がない限り変更しない。複数言語にまたがる成果物は、対象言語が分かる名称または説明を付ける。
- 日本株の銘柄コード、社名、保有比率、順位など、利用者に表示する金融データは信頼できる一次・公式ソースで照合する。1 件の不整合を修正する際は、同じ表示単位の隣接データも確認する。

## 構成と変更先

- `frontend/`: React 18 / Vite の日本語フロントエンド。画面は `frontend/src/components/pages/`、共通 UI は `frontend/src/components/`、hooks は `frontend/src/hooks/` に置く。
- `backend/`: FastAPI とデータ取得処理。Python 依存関係は `backend/requirements.txt` に追加する。
- `scripts/`: 市場データ、上場銘柄マスター、レポート用のバッチ処理。依存関係は `scripts/requirements.txt` に追加する。
- `frontend/public/data/`: 配信する生成データの正本。データ更新スクリプトと GitHub Actions はここへ出力する。ルートの `data/` は、目的を確認せずに同期元・出力先として扱わない。
- `frontend/src/components/pages/columnData.js` はコラムのアプリ表示と静的 HTML 生成の入力である。コラムを変更したら生成結果も確認する。
- `frontend/public/` のコラム、sitemap、robots はビルド時に生成・更新される。手作業での差分は、必要性を確認してから行う。

## 実装とデータ更新

- 既存の UI、データスキーマ、ルート形式を維持する。データの欠落を UI 側の黙った除外で隠さず、生成・インデックス・クライアントフィルタの順に原因を確認する。
- 銘柄検索の対象を狭めない。上場銘柄の網羅性に関わる変更では `frontend/public/data/listed_stock_master.json` とその生成元を確認する。
- 機密値は `.env` または CI secrets を使い、ソース・生成データ・ログに追加しない。
- 生成データを意図せず大量更新しない。データ取得や生成を実行した場合は、差分の対象・件数・妥当性を確認する。

## 検証

- フロントエンド変更後は `cd frontend; npm run build` を実行する。ビルドは週次レポートのインデックスと静的コラムも更新するため、生成差分を確認する。
- Python の変更後は、対象スクリプトの構文・限定的な実行確認を行う。外部 API を呼ぶデータ更新は、依頼または必要な検証の場合だけ実行する。
- コミット前に `git diff --check` と `git status --short` を確認する。自分の変更以外の差分を上書き・削除しない。

## CI / デプロイ

- `main` への push は GitHub Pages のビルド・デプロイを開始する。未解決のマージマーカーを残さない。
- 定期 Actions は市場データ、EDINET、上場銘柄マスター、週次レポートを更新する。ワークフロー変更では、出力先が `frontend/public/data/` と整合することを確認する。
