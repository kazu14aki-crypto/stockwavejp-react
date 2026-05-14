"""
fetch_edinet.py — GitHub Actions から実行される EDINET 大量保有報告書取得スクリプト
毎日平日20時（JST）に自動実行し、過去60日分の大量保有報告書を取得して
frontend/public/data/edinet_holdings.json に保存します。
"""

import httpx
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

# ── 設定 ───────────────────────────────────────────────────────────
EDINET_BASE  = "https://api.edinet-fsa.go.jp/api/v2"
API_KEY      = os.environ.get("EDINET_API_KEY", "")
OUTPUT_PATH  = Path(__file__).parent.parent / "frontend" / "public" / "data" / "edinet_holdings.json"
FETCH_DAYS   = 60
MAX_RESULTS  = 300


def fetch_holdings():
    today   = date.today()
    results = []
    errors  = []
    fetched_dates = 0

    print(f"[EDINET] API_KEY設定: {'あり' if API_KEY else 'なし'}")
    print(f"[EDINET] ベースURL: {EDINET_BASE}")
    print(f"[EDINET] 取得期間: {today - timedelta(days=FETCH_DAYS)} 〜 {today}")

    with httpx.Client(timeout=30.0) as client:
        for i in range(FETCH_DAYS):
            target = (today - timedelta(days=i)).isoformat()

            try:
                # APIキーはクエリパラメータとして送信（正しい方式）
                params = {"date": target, "type": 2}
                if API_KEY:
                    params["Subscription-Key"] = API_KEY

                res = client.get(
                    f"{EDINET_BASE}/documents.json",
                    params=params,
                    timeout=20.0
                )

                print(f"  {target}: HTTP {res.status_code}", end="")

                if res.status_code == 403:
                    print(" → 403 Forbidden")
                    errors.append({"date": target, "error": "403"})
                    if i == 0:
                        print("[ERROR] 最初のリクエストで403。EDINETのIPホワイトリストを確認してください。")
                        # 403でも処理を続けて全日程試す（日によって異なる場合があるため）
                    continue

                if not res.is_success:
                    print(f" → skip")
                    continue

                data = res.json()
                meta = data.get("metadata", {})
                status = str(meta.get("status", "200"))

                if status != "200":
                    print(f" → EDINET status={status}")
                    continue

                docs = data.get("results", [])
                day_count = 0
                fetched_dates += 1

                for doc in docs:
                    if doc.get("docTypeCode") not in ["28", "29", "30"]:
                        continue

                    results.append({
                        "docID":          doc.get("docID"),
                        "submitDate":     target,
                        "submitDateTime": doc.get("submitDateTime"),
                        "issuerName":     doc.get("issuerName"),
                        "secCode":        doc.get("secCode"),
                        "filerName":      doc.get("filerName"),
                        "docTypeCode":    doc.get("docTypeCode"),
                        "docTypeName":    (
                            "新規" if doc.get("docTypeCode") == "28"
                            else "変更" if doc.get("docTypeCode") == "29"
                            else "一部免除"
                        ),
                        "holdingRatio":   doc.get("otherExplanatoryStatement"),
                        "periodEnd":      doc.get("periodEnd"),
                    })
                    day_count += 1

                print(f" → 大量保有{day_count}件（全{len(docs)}件中）")

                if len(results) >= MAX_RESULTS:
                    print(f"[EDINET] 上限{MAX_RESULTS}件に達したため終了")
                    break

            except httpx.TimeoutException:
                print(f" → タイムアウト")
                errors.append({"date": target, "error": "timeout"})
            except Exception as e:
                print(f" → エラー: {e}")
                errors.append({"date": target, "error": str(e)})

    return results, errors, fetched_dates


def main():
    print("=" * 60)
    print("EDINET 大量保有報告書 取得スクリプト")
    print("=" * 60)

    results, errors, fetched_dates = fetch_holdings()

    output = {
        "updated_at":    date.today().isoformat(),
        "fetch_days":    FETCH_DAYS,
        "fetched_dates": fetched_dates,
        "count":         len(results),
        "error_count":   len(errors),
        "api_key_used":  bool(API_KEY),
        "results":       results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"[完了] {len(results)}件保存 → {OUTPUT_PATH}")
    print(f"  取得成功日数: {fetched_dates}日 / {FETCH_DAYS}日")
    print(f"  エラー: {len(errors)}件")
    print(f"  APIキー使用: {bool(API_KEY)}")

    # 1件も取得できなかった場合はエラー終了
    if fetched_dates == 0:
        print("\n[WARN] データが1件も取得できませんでした")
        print("  考えられる原因:")
        print("  1. EDINET_API_KEY が未設定")
        print("  2. GitHubのIPがEDINETのホワイトリストに未登録")
        print("  3. EDINET APIのエンドポイントURL変更")
        # エラー終了はしない（空ファイルでも保存する）


if __name__ == "__main__":
    main()
