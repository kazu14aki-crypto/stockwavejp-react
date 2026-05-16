"""
fetch_edinet.py — GitHub Actions から実行される EDINET 大量保有報告書取得スクリプト
毎日 JST 20:30 に自動実行し、過去60日分の大量保有報告書を取得して
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


def fetch_one_day(client: httpx.Client, target: str) -> list:
    """1日分の大量保有報告書を取得して返す"""

    # type=2（書類情報あり）を試す
    for type_val in [2, 1]:
        params = {"date": target, "type": type_val}
        if API_KEY:
            params["Subscription-Key"] = API_KEY

        try:
            res = client.get(
                f"{EDINET_BASE}/documents.json",
                params=params,
                timeout=20.0
            )

            if res.status_code == 403:
                print(f"    type={type_val}: 403 Forbidden")
                continue

            if not res.is_success:
                print(f"    type={type_val}: HTTP {res.status_code}")
                continue

            data = res.json()
            meta = data.get("metadata", {})
            status = str(meta.get("status", "200"))

            if status != "200":
                print(f"    type={type_val}: EDINET status={status}, message={meta.get('message','')}")
                continue

            results = data.get("results", [])
            total   = len(results)

            # 全docTypeCodeを確認
            all_codes = list(set(d.get("docTypeCode","?") for d in results))

            # 大量保有報告書をフィルタ
            large = [d for d in results if d.get("docTypeCode") in ["340","350","360"]]
            print(f"    type={type_val}: 全{total}件, codes={all_codes[:10]}, 大量保有={len(large)}件")

            if large:
                return large  # 取得できたら返す

            # 大量保有なしでも type=1 も試す
            if type_val == 2 and total > 0:
                # type=2で件数あるが大量保有0件 → type=1も試す
                continue
            elif type_val == 1:
                return []  # 両方試して0件

        except httpx.TimeoutException:
            print(f"    type={type_val}: タイムアウト")
        except Exception as e:
            print(f"    type={type_val}: エラー {e}")

    return []


def fetch_holdings():
    today   = date.today()
    results = []
    fetched_dates = 0
    empty_dates   = 0
    error_dates   = 0

    print(f"[EDINET] API_KEY: {'設定あり' if API_KEY else '未設定（非登録API）'}")
    print(f"[EDINET] 取得期間: {today - timedelta(days=FETCH_DAYS)} 〜 {today}")
    print(f"[EDINET] ベースURL: {EDINET_BASE}")
    print()

    with httpx.Client(timeout=30.0) as client:
        for i in range(FETCH_DAYS):
            target = (today - timedelta(days=i)).isoformat()
            print(f"  [{i+1:02d}/{FETCH_DAYS}] {target}:")

            large = fetch_one_day(client, target)

            if large:
                fetched_dates += 1
                for doc in large:
                    results.append({
                        "docID":        doc.get("docID"),
                        "submitDate":   target,
                        "issuerName":   doc.get("issuerName"),
                        "secCode":      doc.get("secCode"),
                        "filerName":    doc.get("filerName"),
                        "docTypeCode":  doc.get("docTypeCode"),
                        "docTypeName":  (
                            "新規" if doc.get("docTypeCode") == "340"
                            else "変更" if doc.get("docTypeCode") == "350"
                            else "訂正"
                        ),
                        "holdingRatio": doc.get("otherExplanatoryStatement"),
                        "periodEnd":    doc.get("periodEnd"),
                    })
            else:
                empty_dates += 1

            if len(results) >= MAX_RESULTS:
                print(f"  → 上限{MAX_RESULTS}件に達したため終了")
                break

    return results, fetched_dates, empty_dates


def main():
    print("=" * 60)
    print("EDINET 大量保有報告書 取得スクリプト")
    print("=" * 60)

    results, fetched_dates, empty_dates = fetch_holdings()

    output = {
        "updated_at":    date.today().isoformat(),
        "fetch_days":    FETCH_DAYS,
        "fetched_dates": fetched_dates,
        "empty_dates":   empty_dates,
        "count":         len(results),
        "api_key_used":  bool(API_KEY),
        "results":       results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print()
    print("=" * 60)
    print(f"[完了] {len(results)}件保存")
    print(f"  大量保有あり: {fetched_dates}日")
    print(f"  大量保有0件:  {empty_dates}日")
    print(f"  APIキー: {'使用' if bool(API_KEY) else '未使用'}")
    print("=" * 60)


if __name__ == "__main__":
    main()
