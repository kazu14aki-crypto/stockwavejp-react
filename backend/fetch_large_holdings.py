#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_large_holdings.py — 大量保有報告書（5%ルール）の精密取得・投資家軸集計バッチ

既存 fetch_edinet.py の問題点を解決する:
  ・holdingRatio が otherExplanatoryStatement（無関係フィールド）を拾っており保有割合が取れていなかった
  ・提出者（機関投資家）名・保有割合・前回比・提出者の実質支配者がXBRLから未抽出だった
  ・「特定の投資家を軸にした時系列」を作る集計が無かった

本バッチが生成するもの:
  1. large_holdings/filings.json     … 全報告書の明細（銘柄・提出者・保有割合・日付・種別）
  2. large_holdings/by_investor.json … 提出者(機関投資家)ごとの保有銘柄と時系列
  3. large_holdings/by_issuer.json   … 銘柄ごとの大量保有者一覧と各々の推移
  4. large_holdings/index.json       … 提出者・銘柄の索引（検索サジェスト用）

docTypeCode: 350=大量保有報告書(新規), 360=変更報告書, 355/365=訂正

実行:
  set EDINET_API_KEY=xxxx
  python fetch_large_holdings.py --days 90          # 直近90日
  python fetch_large_holdings.py --backfill 400     # 初回フルビルド
"""
import os, json, io, re, zipfile, argparse, html, time
from datetime import date, timedelta
from pathlib import Path
from collections import defaultdict

try:
    import httpx
    _client_lib = "httpx"
except ImportError:
    import requests
    _client_lib = "requests"

EDINET_BASE = "https://api.edinet-fsa.go.jp/api/v2"
API_KEY = os.environ.get("EDINET_API_KEY", "")
OUT_DIR = (Path(__file__).parent / ".." / "frontend" / "public" / "data" / "large_holdings").resolve()
OUT_DIR.mkdir(parents=True, exist_ok=True)

# 350=大量保有報告書, 360=変更報告書（訂正355/365も本文は同構造）
TARGET_CODES = {"350", "360", "355", "365"}
DOCTYPE_LABEL = {"350": "新規", "360": "変更", "355": "訂正(新規)", "365": "訂正(変更)"}


# ─────────────────────────────────────────────
# HTTP
# ─────────────────────────────────────────────
def _get(url, params, timeout=30, want_bytes=False):
    if _client_lib == "httpx":
        with httpx.Client(timeout=timeout) as c:
            r = c.get(url, params=params)
            if r.status_code != 200:
                return None
            return r.content if want_bytes else r.json()
    else:
        r = requests.get(url, params=params, timeout=timeout)
        if r.status_code != 200:
            return None
        return r.content if want_bytes else r.json()


def list_documents(target: date):
    params = {"date": target.isoformat(), "type": 2}
    if API_KEY:
        params["Subscription-Key"] = API_KEY
    data = _get(f"{EDINET_BASE}/documents.json", params)
    if not data:
        return []
    return data.get("results", []) or []


def download_xbrl(doc_id: str):
    params = {"type": 1}
    if API_KEY:
        params["Subscription-Key"] = API_KEY
    return _get(f"{EDINET_BASE}/documents/{doc_id}", params, timeout=90, want_bytes=True)


# ─────────────────────────────────────────────
# XBRL 抽出（大量保有報告書のタクソノミ）
# ─────────────────────────────────────────────
# 大量保有報告書は jplvh_cor 名前空間。プレフィックス非依存でローカル名照合する。
def _tag(xbrl, local, ctx_filter=None):
    """指定ローカル名タグの値を全て返す（contextRef付き）。"""
    pat = re.compile(
        r'<[A-Za-z0-9_\-]+:' + local + r'(\s[^>]*)?>(.*?)</[A-Za-z0-9_\-]+:' + local + r'>',
        re.S)
    out = []
    for m in pat.finditer(xbrl):
        attrs = m.group(1) or ""
        ctx = re.search(r'contextRef="([^"]*)"', attrs)
        ctx = ctx.group(1) if ctx else ""
        if ctx_filter and ctx_filter not in ctx:
            continue
        val = html.unescape(re.sub(r"<[^>]+>", "", m.group(2))).strip()
        out.append((ctx, val))
    return out


def _first(xbrl, local):
    vals = _tag(xbrl, local)
    return vals[0][1] if vals else None


def _num(s):
    if s is None:
        return None
    s = str(s).replace(",", "").replace("，", "").replace("%", "").strip()
    try:
        return float(s)
    except ValueError:
        return None


def _ratio_pct(value):
    """EDINET XBRLの割合は0.0736（=7.36%）と7.36が混在するため百分率へ統一。"""
    v = _num(value)
    if v is None:
        return None
    if 0 <= abs(v) <= 1:
        v *= 100
    return round(v, 4)


def _norm_name(value):
    return re.sub(r"[\s　・･,，.。()（）\[\]【】'\"]", "", str(value or "")).replace("株式会社", "").replace("有限会社", "").lower()


def load_issuer_code_map():
    """有報大株主索引を使い、EDINET側でsecCodeが空の書類も銘柄コードへ補完。"""
    index_path = OUT_DIR.parent / "stockholders" / "index.json"
    out = {}
    try:
        items = json.load(open(index_path, encoding="utf-8")).get("items", [])
        for item in items:
            code = str(item.get("secCode") or "").strip()
            name = _norm_name(item.get("issuerName"))
            if code and name:
                out[name] = code
    except Exception:
        pass
    return out


def parse_large_holding_xbrl(xbrl: str) -> dict:
    """
    大量保有報告書XBRLから中核フィールドを抽出。
    タクソノミのローカル名は版により揺れるため、候補を順に試す。
    """
    def pick(*locals_):
        for lc in locals_:
            v = _first(xbrl, lc)
            if v:
                return v
        return None

    issuer = pick("NameOfIssuer", "IssuerName", "NameOfIssuerOfShares")
    filer = pick("NameOfSubmitter", "SubmitterName", "NameOfPersonRequiredToSubmit")
    # 保有割合（今回）と前回
    ratio_now = _ratio_pct(pick("HoldingRatioOfShareCertificatesEtc",
                                "HoldingRatioOfShareCertificates",
                                "RatioOfHoldingShareCertificatesEtc",
                                "HoldingRatio"))
    ratio_prev = _ratio_pct(pick("HoldingRatioOfShareCertificatesEtcInLastReport",
                                 "HoldingRatioInLastReport",
                                 "RatioOfHoldingShareCertificatesEtcInLastReport"))
    # 保有目的（純投資 / 政策 / 経営参画 等）— 出口イベント予測の重要シグナル
    purpose = pick("PurposeOfHolding", "PurposeOfHoldingShareCertificatesEtc",
                   "Purpose")
    # 提出義務発生日（この日付が「買い増した日」に近い）
    obligation_date = pick("DateOfOccurrenceOfReportingObligation",
                          "DateWhenReportingObligationArose")
    # 保有株式数
    shares = _num(pick("TotalNumberOfShareCertificatesEtcHeld",
                       "NumberOfShareCertificatesEtcHeld"))
    return {
        "issuer": issuer, "filer": filer,
        "ratio": ratio_now, "ratio_prev": ratio_prev,
        "purpose": (purpose or "")[:120],
        "obligation_date": obligation_date,
        "shares": shares,
    }


# 提出者名の正規化（光通信グループを1つに束ねる等）
def normalize_filer(name: str) -> str:
    if not name:
        return ""
    n = name.replace("株式会社", "").replace("　", " ").strip()
    # 代表的な機関投資家グループの名寄せ
    aliases = {
        "光通信": ["光通信", "ＵＨパートナーズ", "UHパートナーズ", "エターナルホスピタリティ"],
    }
    for canon, pats in aliases.items():
        if any(p in n for p in pats):
            return canon
    return n


# ─────────────────────────────────────────────
# メイン処理
# ─────────────────────────────────────────────
def process(days: int, ticker_filter=None):
    today = date.today()
    filings = []
    seen_docs = set()
    issuer_code_map = load_issuer_code_map()

    for i in range(days):
        target = today - timedelta(days=i)
        if target.weekday() >= 5:
            continue
        docs = list_documents(target)
        hits = [d for d in docs if d.get("docTypeCode") in TARGET_CODES]
        if not hits:
            continue
        print(f"{target}: 大量保有系 {len(hits)}件")
        for doc in hits:
            doc_id = doc.get("docID")
            if not doc_id or doc_id in seen_docs:
                continue
            seen_docs.add(doc_id)
            sec = (doc.get("secCode") or "")
            sec = sec[:-1] if len(sec) == 5 and sec.endswith("0") else sec
            if ticker_filter and sec and sec not in ticker_filter:
                continue

            zip_bytes = download_xbrl(doc_id)
            parsed = {}
            if zip_bytes:
                try:
                    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
                        xbrls = [n for n in zf.namelist() if n.endswith(".xbrl") and "PublicDoc" in n] \
                                or [n for n in zf.namelist() if n.endswith(".xbrl")]
                        if xbrls:
                            xbrl = zf.read(xbrls[0]).decode("utf-8", errors="ignore")
                            parsed = parse_large_holding_xbrl(xbrl)
                except Exception as e:
                    print(f"  ⚠ XBRL解析失敗 {doc_id}: {e}")
            time.sleep(0.25)

            filer_raw = parsed.get("filer") or doc.get("filerName") or ""
            issuer_name = parsed.get("issuer") or doc.get("issuerName") or ""
            if not sec and issuer_name:
                norm = _norm_name(issuer_name)
                sec = issuer_code_map.get(norm, "")
                if not sec:
                    # 表記揺れに備え、包含一致は一意の場合だけ採用
                    matches = [code for name, code in issuer_code_map.items() if norm and (norm in name or name in norm)]
                    if len(set(matches)) == 1:
                        sec = matches[0]
            rec = {
                "docID": doc_id,
                "submitDate": (doc.get("submitDateTime") or target.isoformat())[:10],
                "secCode": sec,
                "issuerName": issuer_name,
                "filerName": filer_raw,
                "filerKey": normalize_filer(filer_raw),
                "docType": doc.get("docTypeCode"),
                "docTypeName": DOCTYPE_LABEL.get(doc.get("docTypeCode"), "その他"),
                "ratio": parsed.get("ratio"),
                "ratioPrev": parsed.get("ratio_prev"),
                "ratioDelta": (round(parsed["ratio"] - parsed["ratio_prev"], 2)
                               if parsed.get("ratio") is not None and parsed.get("ratio_prev") is not None
                               else None),
                "purpose": parsed.get("purpose"),
                "obligationDate": parsed.get("obligation_date"),
                "shares": parsed.get("shares"),
            }
            filings.append(rec)
            if rec["ratio"] is not None:
                print(f"  ✓ {rec['issuerName']}({sec}) ← {rec['filerKey']} {rec['ratio']}%"
                      + (f" ({'+' if rec['ratioDelta'] and rec['ratioDelta']>0 else ''}{rec['ratioDelta']})" if rec['ratioDelta'] is not None else ""))
    return filings


def merge_and_build(new_filings):
    """既存filings.jsonへマージし、投資家軸・銘柄軸の集計を再構築。"""
    fp = OUT_DIR / "filings.json"
    existing = []
    if fp.exists():
        try:
            existing = json.load(open(fp, encoding="utf-8")).get("filings", [])
        except Exception:
            existing = []
    by_id = {f["docID"]: f for f in existing if f.get("docID")}
    for f in new_filings:
        by_id[f["docID"]] = f
    all_filings = sorted(by_id.values(), key=lambda x: x.get("submitDate", ""), reverse=True)
    issuer_code_map = load_issuer_code_map()
    for f in all_filings:
        f["ratio"] = _ratio_pct(f.get("ratio"))
        f["ratioPrev"] = _ratio_pct(f.get("ratioPrev"))
        if f.get("ratio") is not None and f.get("ratioPrev") is not None:
            f["ratioDelta"] = round(f["ratio"] - f["ratioPrev"], 2)
        if not f.get("secCode") and f.get("issuerName"):
            norm = _norm_name(f["issuerName"])
            f["secCode"] = issuer_code_map.get(norm, "")
            if not f["secCode"]:
                matches = [code for name, code in issuer_code_map.items() if norm and (norm in name or name in norm)]
                if len(set(matches)) == 1:
                    f["secCode"] = matches[0]

    # 投資家軸: filerKey → 銘柄ごとの時系列
    by_investor = defaultdict(lambda: defaultdict(list))
    for f in all_filings:
        if not f.get("filerKey") or not f.get("secCode"):
            continue
        by_investor[f["filerKey"]][f["secCode"]].append(f)
    investor_out = {}
    for inv, issuers in by_investor.items():
        positions = []
        for sec, recs in issuers.items():
            recs = sorted(recs, key=lambda x: x.get("submitDate", ""))
            latest = recs[-1]
            first = recs[0]
            positions.append({
                "secCode": sec,
                "issuerName": latest.get("issuerName", ""),
                "latestRatio": latest.get("ratio"),
                "firstRatio": first.get("ratio"),
                "firstDate": first.get("submitDate"),
                "latestDate": latest.get("submitDate"),
                "reportCount": len(recs),
                "trend": [{"date": r["submitDate"], "ratio": r["ratio"],
                           "type": r["docTypeName"], "purpose": r.get("purpose")}
                          for r in recs if r.get("ratio") is not None],
            })
        positions.sort(key=lambda x: (x["latestRatio"] or 0), reverse=True)
        investor_out[inv] = {"investor": inv, "positionCount": len(positions), "positions": positions}
    json.dump(investor_out, open(OUT_DIR / "by_investor.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    # 銘柄軸: secCode → 大量保有者一覧
    by_issuer = defaultdict(lambda: defaultdict(list))
    for f in all_filings:
        if f.get("secCode"):
            by_issuer[f["secCode"]][f["filerKey"]].append(f)
    issuer_out = {}
    for sec, filers in by_issuer.items():
        holders = []
        name = ""
        for fk, recs in filers.items():
            recs = sorted(recs, key=lambda x: x.get("submitDate", ""))
            latest = recs[-1]
            name = latest.get("issuerName") or name
            holders.append({
                "filerKey": fk,
                "latestRatio": latest.get("ratio"),
                "latestDate": latest.get("submitDate"),
                "reportCount": len(recs),
                "trend": [{"date": r["submitDate"], "ratio": r["ratio"], "type": r["docTypeName"]}
                          for r in recs if r.get("ratio") is not None],
            })
        holders.sort(key=lambda x: (x["latestRatio"] or 0), reverse=True)
        issuer_out[sec] = {"secCode": sec, "issuerName": name, "holders": holders}
    json.dump(issuer_out, open(OUT_DIR / "by_issuer.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    # 索引（検索サジェスト用）
    index = {
        "updated_at": date.today().isoformat(),
        "investors": sorted([{"key": k, "positions": v["positionCount"]}
                             for k, v in investor_out.items()],
                            key=lambda x: x["positions"], reverse=True),
        "issuers": [{"secCode": s, "name": v["issuerName"], "holders": len(v["holders"])}
                    for s, v in issuer_out.items()],
    }
    json.dump(index, open(OUT_DIR / "index.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    json.dump({"updated_at": date.today().isoformat(), "count": len(all_filings), "filings": all_filings},
              open(fp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n完了: filings {len(all_filings)}件 / 投資家 {len(investor_out)} / 銘柄 {len(issuer_out)}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=90)
    ap.add_argument("--backfill", type=int, default=0)
    ap.add_argument("--tickers", type=str, default="")
    args = ap.parse_args()
    if not API_KEY:
        print("⚠️ EDINET_API_KEY 未設定。https://api.edinet-fsa.go.jp で取得してください。")
        return
    days = args.backfill or args.days
    tf = set(t.strip() for t in args.tickers.split(",") if t.strip()) or None
    new = process(days, tf)
    merge_and_build(new)


if __name__ == "__main__":
    main()
