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
FETCH_DAYS   = 60   # 過去何日分を取得するか
MAX_RESULTS  = 300  # 最大保存件数

def fetch_holdings():
    today    = date.today()
    results  = []
    errors   = []
    fetched_dates = 0

    headers = {}
    if API_KEY:
        headers["Ocp-Apim-Subscription-Key"] = API_KEY

    print(f"[EDINET] API_KEY設定: {'あり' if API_KEY else 'なし（未登録）'}")
    print(f"[EDINET] 取得期間: {today - timedelta(days=FETCH_DAYS)} 〜 {today}")

    with httpx.Client(timeout=30.0, headers=headers) as client:
        for i in range(FETCH_DAYS):
            target = (today - timedelta(days=i)).isoformat()

            # 土日はスキップ（EDINETは土日も受付しているが件数が少ない）
            # スキップしない（週末提出分も含める）

            try:
                # まずtype=2（APIキーあり）を試す
                params = {"date": target, "type": 2}
                if API_KEY:
                    params["Subscription-Key"] = API_KEY

                res = client.get(
                    f"{EDINET_BASE}/documents.json",
                    params=params,
                    timeout=20.0
                )

                if res.status_code == 403:
                    print(f"  {target}: 403 Forbidden - APIキーまたはIPが拒否されました")
                    errors.append({"date": target, "error": "403 Forbidden"})
                    # 最初の日で403なら全日同じなので中断
                    if i == 0:
                        print("[EDINET] 最初のリクエストで403。IPまたはAPIキーを確認してください。")
                        break
                    continue

                if not res.is_success:
                    print(f"  {target}: HTTP {res.status_code}")
                    continue

                data = res.json()

                # metadata のステータス確認
                meta = data.get("metadata", {})
                if str(meta.get("status", "200")) != "200":
                    print(f"  {target}: EDINETエラー status={meta.get('status')}")
                    continue

                docs = data.get("results", [])
                fetched_dates += 1
                day_count = 0

                for doc in docs:
                    # 大量保有報告書のみ（28=新規, 29=変更, 30=一部免除）
                    if doc.get("docTypeCode") not in ["28", "29", "30"]:
                        continue

                    results.append({
                        "docID":          doc.get("docID"),
                        "submitDate":     target,
                        "submitDateTime": doc.get("submitDateTime"),
                        "issuerName":     doc.get("issuerName"),    # 発行体（対象企業）
                        "secCode":        doc.get("secCode"),        # 証券コード
                        "filerName":      doc.get("filerName"),      # 保有者（機関投資家名）
                        "docTypeCode":    doc.get("docTypeCode"),
                        "docTypeName":    "新規" if doc.get("docTypeCode") == "28"
                                         else "変更" if doc.get("docTypeCode") == "29"
                                         else "一部免除",
                        "holdingRatio":   doc.get("otherExplanatoryStatement"),
                        "periodEnd":      doc.get("periodEnd"),
                    })
                    day_count += 1

                print(f"  {target}: {day_count}件の大量保有報告書")

                if len(results) >= MAX_RESULTS:
                    print(f"[EDINET] 上限{MAX_RESULTS}件に達したため終了")
                    break

            except httpx.TimeoutException:
                print(f"  {target}: タイムアウト")
                errors.append({"date": target, "error": "timeout"})
                continue
            except Exception as e:
                print(f"  {target}: エラー {e}")
                errors.append({"date": target, "error": str(e)})
                continue

    return results, errors, fetched_dates


def main():
    print("=" * 50)
    print("EDINET 大量保有報告書 取得スクリプト")
    print("=" * 50)

    results, errors, fetched_dates = fetch_holdings()

    # 出力データ構造
    output = {
        "updated_at":    date.today().isoformat(),
        "fetch_days":    FETCH_DAYS,
        "fetched_dates": fetched_dates,
        "count":         len(results),
        "error_count":   len(errors),
        "api_key_used":  bool(API_KEY),
        "results":       results,
    }

    # ファイルに保存
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n[完了] {len(results)}件保存 → {OUTPUT_PATH}")
    print(f"  エラー: {len(errors)}件, 取得日数: {fetched_dates}日")

    # 403エラーのみの場合はエラー終了（GitHub Actionsに失敗を伝える）
    if fetched_dates == 0 and len(errors) > 0:
        print("[ERROR] データが取得できませんでした")
        sys.exit(1)


if __name__ == "__main__":
    main()
