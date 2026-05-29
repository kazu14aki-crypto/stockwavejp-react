#!/usr/bin/env python3
"""
fetch_edinet_holders.py
EDINET APIから大量保有報告書（docTypeCode=120/130）のXBRLを解析し
大株主上位10名・持株数・保有比率を取得してJSONに保存する。

実行:
  python fetch_edinet_holders.py --tickers 7203,6857,8035
  または全銘柄対象で実行（時間がかかるため定期バッチ推奨）

出力:
  frontend/public/data/stockholders/{ticker}.json
  frontend/public/data/stockholders/index.json
"""
import os, json, time, requests, zipfile, io, re, argparse
from datetime import datetime, date, timedelta
from pathlib import Path

EDINET_API_KEY = os.environ.get("EDINET_API_KEY", "")
BASE_URL = "https://api.edinet-fsa.go.jp/api/v2"
OUT_DIR  = Path("../frontend/public/data/stockholders")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# docTypeCode:
#   120 = 有価証券報告書（年次）
#   130 = 半期報告書
#   140 = 四半期報告書（Q1,Q3）
TARGET_CODES = {"120", "130", "140"}

def fetch_documents(target_date: date) -> list:
    """特定日のEDINET提出書類一覧を取得"""
    params = {"date": target_date.isoformat(), "type": 2, "Subscription-Key": EDINET_API_KEY}
    r = requests.get(f"{BASE_URL}/documents.json", params=params, timeout=30)
    if not r.ok:
        return []
    data = r.json()
    return data.get("results", [])

def fetch_xbrl_zip(doc_id: str) -> bytes | None:
    """XBRL ZIPをダウンロード"""
    params = {"type": 5, "Subscription-Key": EDINET_API_KEY}
    r = requests.get(f"{BASE_URL}/documents/{doc_id}", params=params, timeout=60)
    if not r.ok:
        return None
    return r.content

def parse_major_shareholders(xbrl_content: str) -> list:
    """
    XBRLから大株主情報を抽出
    タグ例: <jpcrp030000-ite:NameOfMajorShareholders ...>社名</jpcrp030000-ite:NameOfMajorShareholders>
    """
    shareholders = []

    # 株主名パターン（有価証券報告書のXBRL）
    name_pat  = re.compile(r'<jpcrp030000-ite:NameOfMajorShareholders[^>]*>([^<]+)</jpcrp030000-ite:NameOfMajorShareholders>')
    share_pat = re.compile(r'<jpcrp030000-ite:NumberOfSharesHeld[^>]*>([\d,]+)</jpcrp030000-ite:NumberOfSharesHeld>')
    ratio_pat = re.compile(r'<jpcrp030000-ite:ShareholdingRatio[^>]*>([\d.]+)</jpcrp030000-ite:ShareholdingRatio>')

    names  = [m.group(1).strip() for m in name_pat.finditer(xbrl_content)]
    shares = [m.group(1).replace(",","") for m in share_pat.finditer(xbrl_content)]
    ratios = [m.group(1) for m in ratio_pat.finditer(xbrl_content)]

    for i in range(min(len(names), 10)):
        shareholders.append({
            "rank":  i + 1,
            "name":  names[i],
            "shares": int(shares[i]) if i < len(shares) and shares[i].isdigit() else None,
            "ratio":  float(ratios[i]) if i < len(ratios) else None,
        })
    return shareholders

def process_doc(doc: dict, out_dir: Path) -> bool:
    """1件の書類を処理"""
    # secCodeがNoneの場合に対応
    raw_sec = doc.get("secCode") or ""
    sec_code = raw_sec[:-1] if raw_sec.endswith("0") and len(raw_sec) > 1 else raw_sec
    issuer   = doc.get("filerName", "")
    doc_id   = doc.get("docID", "")
    doc_type = doc.get("docTypeCode","")

    if not sec_code or doc_type not in TARGET_CODES:
        return False

    zip_data = fetch_xbrl_zip(doc_id)
    if not zip_data:
        return False

    try:
        with zipfile.ZipFile(io.BytesIO(zip_data)) as zf:
            xbrl_files = [n for n in zf.namelist() if n.endswith(".xbrl")]
            if not xbrl_files:
                return False
            xbrl_content = zf.read(xbrl_files[0]).decode("utf-8", errors="ignore")
    except Exception:
        return False

    shareholders = parse_major_shareholders(xbrl_content)
    if not shareholders:
        return False

    out_path = out_dir / f"{sec_code}.json"
    existing = {}
    if out_path.exists():
        with open(out_path) as f:
            existing = json.load(f)

    # 履歴として追加（最大8期分）
    history = existing.get("history", [])
    period = {
        "submitDate": doc.get("submitDateTime","")[:10],
        "docType": doc_type,
        "docTypeName": doc.get("docDescription",""),
        "docID": doc_id,
        "shareholders": shareholders,
    }
    # 既に同じsubmitDateのものがあれば上書き
    history = [h for h in history if h.get("submitDate") != period["submitDate"]]
    history.append(period)
    history.sort(key=lambda x: x.get("submitDate",""), reverse=True)
    history = history[:8]

    result = {
        "secCode": sec_code,
        "issuerName": issuer,
        "updated_at": datetime.now().strftime("%Y/%m/%d %H:%M JST"),
        "latestDate": history[0]["submitDate"] if history else "",
        "latest": history[0]["shareholders"] if history else [],
        "history": history,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return True

def update_index(out_dir: Path):
    """index.jsonを更新"""
    entries = []
    for fp in out_dir.glob("*.json"):
        if fp.name == "index.json":
            continue
        with open(fp) as f:
            d = json.load(f)
        entries.append({
            "secCode": d.get("secCode"),
            "issuerName": d.get("issuerName"),
            "latestDate": d.get("latestDate"),
            "holderCount": len(d.get("latest", [])),
        })
    entries.sort(key=lambda x: x.get("latestDate",""), reverse=True)
    with open(out_dir / "index.json", "w", encoding="utf-8") as f:
        json.dump({"updated_at": datetime.now().strftime("%Y/%m/%d"), "count": len(entries), "items": entries}, f, ensure_ascii=False, indent=2)
    print(f"index.json更新: {len(entries)}社")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=30, help="過去N日分を取得")
    args = parser.parse_args()

    total = 0
    for i in range(args.days):
        target = date.today() - timedelta(days=i)
        if target.weekday() >= 5:  # 土日スキップ
            continue
        print(f"処理中: {target}")
        docs = fetch_documents(target)
        for doc in docs:
            if doc.get("docTypeCode") in TARGET_CODES:
                if process_doc(doc, OUT_DIR):
                    total += 1
                    print(f"  ✅ {doc.get('filerName')} ({doc.get('secCode')})")
        time.sleep(0.5)

    update_index(OUT_DIR)
    print(f"完了: {total}件処理")

if __name__ == "__main__":
    main()
