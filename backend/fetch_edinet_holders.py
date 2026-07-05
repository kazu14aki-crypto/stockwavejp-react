#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_edinet_holders.py（改良版）
EDINET API v2から有価証券報告書（docTypeCode=120）・半期報告書（130）のXBRLを解析し、
「大株主の状況」上位10名の名称・持株数・保有比率を取得、株主属性を自動分類してJSON保存する。

改良点:
  1. XBRLタグを実際のEDINETタクソノミ（jpcrp_cor:NameMajorShareholders等）に対応
     - 名前空間プレフィックスに依存しないローカル名マッチ
     - contextRef（No1MajorShareholdersMember〜No10）で名称・株数・比率を正確に紐付け
     - タグが無い提出書類向けにMajorShareholdersTextBlock（HTMLテーブル）のフォールバック解析
  2. 保有比率の単位ゆらぎを正規化（0.0523形式→5.23%へ変換）
  3. 株主属性の自動分類（創業者・個人 / 信託口 / 外国機関 / 金融機関 / 事業法人 / 自社関連 等）
  4. --backfill で過去1年分を走査（有報は年1回提出のため365日走査で全上場企業をカバー）

実行例:
  set EDINET_API_KEY=xxxxx
  python fetch_edinet_holders.py --days 7             # 直近1週間の新規提出分
  python fetch_edinet_holders.py --backfill 370       # 初回フルビルド（全銘柄・数時間）
  python fetch_edinet_holders.py --days 30 --tickers 7203,6857

出力:
  frontend/public/data/stockholders/{ticker}.json
  frontend/public/data/stockholders/index.json
"""
import os, json, time, requests, zipfile, io, re, argparse, html
from datetime import datetime, date, timedelta
from pathlib import Path

EDINET_API_KEY = os.environ.get("EDINET_API_KEY", "")
BASE_URL = "https://api.edinet-fsa.go.jp/api/v2"
OUT_DIR  = Path(__file__).parent / ".." / "frontend" / "public" / "data" / "stockholders"
OUT_DIR = OUT_DIR.resolve()
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 120=有価証券報告書（大株主の状況を含む）、130=半期報告書
TARGET_CODES = {"120", "130"}

# ─────────────────────────────────────────────
# 株主属性の分類エンジン
# ─────────────────────────────────────────────
CATEGORY_LABELS = {
    "individual": "個人（創業者一族の可能性）",
    "treasury":   "自己株式",
    "employee":   "従業員持株会",
    "trust":      "信託口（国内機関・年金/投信）",
    "foreign":    "外国機関投資家",
    "financial":  "銀行・保険",
    "securities": "証券会社",
    "government": "政府系・公的",
    "foundation": "財団・学校法人",
    "corporate":  "事業法人",
    "other":      "その他",
}

_FOREIGN_PAT = re.compile(
    r"STATE\s*STREET|SSBT|JP\s*MORGAN|JPMORGAN|BNYM|BNY\s*MELLON|NORTHERN\s+TRUST|"
    r"GOLDMAN|MSCO|MORGAN\s+STANLEY|UBS|BARCLAYS|HSBC|CITIBANK|CITI\s|DFA\s|VANGUARD|"
    r"BLACKROCK|CLEARSTREAM|EUROCLEAR|GIC\s|NORGES|SAJAP|RBC\s|BBH\s|MELLON|NOMURA\s+INTERNATIONAL|"
    r"CHASE|LUXEMBOURG|OMNIBUS|TREATY|RE\s*FUND|SEC\s*LENDING|ACCOUNT", re.I)

def classify_holder(name: str, issuer_name: str = "") -> dict:
    """株主名から属性を推定して返す"""
    n = (name or "").strip()
    nz = n.replace("　", " ")
    result = {"category": "other", "is_founder_family": False}

    if re.search(r"自己株|自社株", nz):
        result["category"] = "treasury"; return result
    if "持株会" in nz or "持株制度" in nz:
        result["category"] = "employee"; return result
    if re.search(r"マスタートラスト|マスター・トラスト|カストディ銀行|カストディー銀行|信託口|信託銀行.*（.*口）|資産管理サービス", nz):
        result["category"] = "trust"; return result
    if _FOREIGN_PAT.search(nz) or (re.fullmatch(r"[A-Za-z0-9 ,.\-&()'/]+", nz) and len(nz) > 8):
        result["category"] = "foreign"; return result
    if re.search(r"財務大臣|政策投資銀行|産業革新|JIC|INCJ|年金積立金|地方公共団体|県|市$", nz):
        result["category"] = "government"; return result
    if re.search(r"銀行|生命保険|損害保険|火災海上|信用金庫|信用組合|農林中央金庫|共済", nz):
        result["category"] = "financial"; return result
    if "証券" in nz:
        result["category"] = "securities"; return result
    if re.search(r"財団|学園|学院|大学|基金", nz):
        result["category"] = "foundation"; return result
    if re.search(r"株式会社|有限会社|合同会社|合資会社|（株）|\(株\)|ホールディングス|Ｈｏｌｄｉｎｇｓ|Holdings|Co\.|Ltd|Inc\.|Corporation|ＬＬＣ|LLC", nz, re.I):
        result["category"] = "corporate"
    else:
        # 法人キーワードなし・比較的短い日本語名 → 個人とみなす
        jp_chars = re.findall(r"[\u4e00-\u9fff\u3040-\u30ff]", nz)
        if jp_chars and len(nz.replace(" ", "")) <= 12:
            result["category"] = "individual"
            # 創業家ヒューリスティック: 姓（先頭1〜3文字）が発行体名に含まれる
            surname = nz.replace(" ", "")[:2]
            if surname and issuer_name and surname in issuer_name:
                result["is_founder_family"] = True
    return result

# ─────────────────────────────────────────────
# EDINET API
# ─────────────────────────────────────────────
def fetch_documents(target_date: date) -> list:
    params = {"date": target_date.isoformat(), "type": 2, "Subscription-Key": EDINET_API_KEY}
    try:
        r = requests.get(f"{BASE_URL}/documents.json", params=params, timeout=30)
        if not r.ok:
            return []
        return r.json().get("results", []) or []
    except Exception:
        return []

def fetch_xbrl_zip(doc_id: str) -> bytes | None:
    params = {"type": 1, "Subscription-Key": EDINET_API_KEY}  # type=1: 提出本文書(XBRL含むZIP)
    try:
        r = requests.get(f"{BASE_URL}/documents/{doc_id}", params=params, timeout=90)
        if not r.ok or "zip" not in (r.headers.get("Content-Type","") + "zip"):
            return None
        return r.content
    except Exception:
        return None

# ─────────────────────────────────────────────
# XBRL解析
# ─────────────────────────────────────────────
def _normalize_ratio(vals: list) -> list:
    """比率の単位ゆらぎ補正: 全値が1未満なら小数表記(0.0523)とみなし100倍する"""
    nums = [v for v in vals if v is not None]
    if nums and all(v < 1.0 for v in nums):
        return [None if v is None else round(v * 100, 2) for v in vals]
    return [None if v is None else round(v, 2) for v in vals]

def parse_major_shareholders_xbrl(xbrl: str) -> list:
    """
    itemizedタグ方式: プレフィックス非依存で
    NameMajorShareholders / NumberOfSharesHeld / ShareholdingRatio を
    contextRef中の No{n}MajorShareholders で紐付ける
    """
    def collect(local_name):
        pat = re.compile(
            r"<[A-Za-z0-9_\-]+:" + local_name +
            r'[^>]*contextRef="[^"]*No(\d+)MajorShareholders[^"]*"[^>]*>(.*?)</[A-Za-z0-9_\-]+:' + local_name + ">",
            re.S)
        out = {}
        for m in pat.finditer(xbrl):
            idx = int(m.group(1))
            val = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
            if idx not in out and val:
                out[idx] = val
        return out

    names  = collect("NameMajorShareholders")
    shares = collect("NumberOfSharesHeld")
    ratios = collect("ShareholdingRatio")
    if not names:
        return []

    idxs = sorted(names.keys())[:10]
    ratio_vals = []
    for i in idxs:
        try:
            ratio_vals.append(float(ratios.get(i, "").replace(",", "")) if i in ratios else None)
        except ValueError:
            ratio_vals.append(None)
    ratio_vals = _normalize_ratio(ratio_vals)

    result = []
    for rank, i in enumerate(idxs, start=1):
        sh = shares.get(i, "").replace(",", "")
        result.append({
            "rank": rank,
            "name": names[i],
            "shares": int(float(sh)) if re.fullmatch(r"[\d.]+", sh or "") else None,
            "ratio": ratio_vals[rank-1],
        })
    return result

def parse_major_shareholders_textblock(xbrl: str) -> list:
    """フォールバック: MajorShareholdersTextBlock内のHTMLテーブルを解析"""
    m = re.search(
        r"<[A-Za-z0-9_\-]+:MajorShareholdersTextBlock[^>]*>(.*?)</[A-Za-z0-9_\-]+:MajorShareholdersTextBlock>",
        xbrl, re.S)
    if not m:
        return []
    block = html.unescape(m.group(1))
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", block, re.S)
    result = []
    ratios_raw = []
    for row in rows:
        cells = [re.sub(r"<[^>]+>", "", c).replace("\u3000", " ").strip()
                 for c in re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)]
        cells = [c for c in cells if c]
        if len(cells) < 3:
            continue
        nums = [c for c in cells if re.fullmatch(r"[\d,，]+(?:\.\d+)?", c.replace(" ", ""))]
        if len(nums) < 2:
            continue
        name = cells[0]
        if re.search(r"氏名|名称|計$|合計", name):
            continue
        try:
            shares = int(float(nums[-2].replace(",", "").replace("，", "")))
            ratio  = float(nums[-1].replace(",", "").replace("，", ""))
        except ValueError:
            continue
        ratios_raw.append(ratio)
        result.append({"rank": len(result)+1, "name": name, "shares": shares, "ratio": ratio})
        if len(result) >= 10:
            break
    if result:
        fixed = _normalize_ratio([r["ratio"] for r in result])
        for r, v in zip(result, fixed):
            r["ratio"] = v
    return result

def build_ownership_summary(shareholders: list) -> dict:
    """属性別の合計保有比率を集計"""
    agg = {}
    for sh in shareholders:
        cat = sh.get("category", "other")
        if sh.get("ratio") is not None:
            agg[cat] = round(agg.get(cat, 0) + sh["ratio"], 2)
    founder_total = round(sum(
        sh["ratio"] for sh in shareholders
        if sh.get("ratio") is not None and (sh.get("category") == "individual")), 2)
    top10_total = round(sum(sh["ratio"] for sh in shareholders if sh.get("ratio") is not None), 2)
    return {"by_category": agg, "individual_total": founder_total, "top10_total": top10_total}

# ─────────────────────────────────────────────
# 書類処理
# ─────────────────────────────────────────────
def process_doc(doc: dict, out_dir: Path, ticker_filter: set | None) -> bool:
    raw_sec = doc.get("secCode") or ""
    sec_code = raw_sec[:-1] if raw_sec.endswith("0") and len(raw_sec) == 5 else raw_sec
    if not sec_code or doc.get("docTypeCode", "") not in TARGET_CODES:
        return False
    if ticker_filter and sec_code not in ticker_filter:
        return False

    issuer = doc.get("filerName", "")
    doc_id = doc.get("docID", "")

    zip_data = fetch_xbrl_zip(doc_id)
    if not zip_data:
        return False
    try:
        with zipfile.ZipFile(io.BytesIO(zip_data)) as zf:
            # PublicDoc配下の本体XBRLを優先
            xbrl_files = sorted(
                [n for n in zf.namelist() if n.endswith(".xbrl") and "PublicDoc" in n]
            ) or sorted([n for n in zf.namelist() if n.endswith(".xbrl")])
            if not xbrl_files:
                return False
            xbrl = zf.read(xbrl_files[0]).decode("utf-8", errors="ignore")
    except Exception:
        return False

    shareholders = parse_major_shareholders_xbrl(xbrl) or parse_major_shareholders_textblock(xbrl)
    if not shareholders:
        return False

    # 属性分類を付与
    for sh in shareholders:
        cls = classify_holder(sh["name"], issuer)
        sh["category"] = cls["category"]
        sh["category_label"] = CATEGORY_LABELS[cls["category"]]
        sh["is_founder_family"] = cls["is_founder_family"]

    out_path = out_dir / f"{sec_code}.json"
    existing = {}
    if out_path.exists():
        try:
            existing = json.load(open(out_path, encoding="utf-8"))
        except Exception:
            existing = {}

    history = existing.get("history", [])
    period = {
        "submitDate": (doc.get("submitDateTime") or "")[:10],
        "docType": doc.get("docTypeCode", ""),
        "docTypeName": doc.get("docDescription", ""),
        "docID": doc_id,
        "shareholders": shareholders,
        "summary": build_ownership_summary(shareholders),
    }
    history = [h for h in history if h.get("submitDate") != period["submitDate"]]
    history.append(period)
    history.sort(key=lambda x: x.get("submitDate", ""), reverse=True)
    history = history[:8]

    result = {
        "secCode": sec_code,
        "issuerName": issuer,
        "updated_at": datetime.now().strftime("%Y/%m/%d %H:%M JST"),
        "latestDate": history[0]["submitDate"],
        "latest": history[0]["shareholders"],
        "latestSummary": history[0]["summary"],
        "history": history,
    }
    json.dump(result, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    return True

def update_index(out_dir: Path):
    entries = []
    for fp in out_dir.glob("*.json"):
        if fp.name == "index.json":
            continue
        try:
            d = json.load(open(fp, encoding="utf-8"))
        except Exception:
            continue
        top = (d.get("latest") or [{}])[0]
        entries.append({
            "secCode": d.get("secCode"),
            "issuerName": d.get("issuerName"),
            "latestDate": d.get("latestDate"),
            "holderCount": len(d.get("latest", [])),
            "topHolder": top.get("name", ""),
            "topHolderCategory": top.get("category", ""),
            "individualTotal": (d.get("latestSummary") or {}).get("individual_total", 0),
        })
    entries.sort(key=lambda x: x.get("latestDate", ""), reverse=True)
    json.dump(
        {"updated_at": datetime.now().strftime("%Y/%m/%d"), "count": len(entries), "items": entries},
        open(out_dir / "index.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"index.json更新: {len(entries)}社")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7, help="過去N日分の提出書類を処理")
    parser.add_argument("--backfill", type=int, default=0, help="初回フルビルド用: 過去N日を走査（例: 370）")
    parser.add_argument("--tickers", type=str, default="", help="対象銘柄コードをカンマ区切りで限定")
    parser.add_argument("--site", action="store_true",
                        help="サイト収録銘柄（frontend/public/data/stock_index.json）のみに限定して取得")
    args = parser.parse_args()

    if not EDINET_API_KEY:
        print("⚠️ 環境変数 EDINET_API_KEY が未設定です。https://api.edinet-fsa.go.jp で取得してください。")
        return

    days = args.backfill if args.backfill > 0 else args.days
    ticker_filter = set(t.strip() for t in args.tickers.split(",") if t.strip()) or None
    if args.site:
        idx_path = Path(__file__).parent / ".." / "frontend" / "public" / "data" / "stock_index.json"
        try:
            idx = json.load(open(idx_path, encoding="utf-8"))
            site_codes = {str(k).replace(".T", "") for k in idx.keys()}
            ticker_filter = site_codes if ticker_filter is None else (ticker_filter & site_codes)
            print(f"--site: サイト収録{len(site_codes)}銘柄に限定")
        except Exception as e:
            print(f"⚠️ stock_index.json読込失敗（--site無効）: {e}")

    total = 0
    for i in range(days):
        target = date.today() - timedelta(days=i)
        if target.weekday() >= 5:
            continue
        docs = fetch_documents(target)
        hits = [d for d in docs if d.get("docTypeCode") in TARGET_CODES]
        if hits:
            print(f"{target}: 対象{len(hits)}件")
        for doc in hits:
            if process_doc(doc, OUT_DIR, ticker_filter):
                total += 1
                print(f"  ✅ {doc.get('filerName')} ({doc.get('secCode')})")
        time.sleep(0.3)

    update_index(OUT_DIR)
    print(f"完了: {total}件処理")

if __name__ == "__main__":
    main()
