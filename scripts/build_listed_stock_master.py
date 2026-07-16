#!/usr/bin/env python3
"""Build the all-Japan listed stock search master.

Primary source: Financial Services Agency EDINET code list (official).
The generated master is deliberately separate from stock_index.json:
- listed_stock_master.json: searchable universe of listed issuers
- stock_index.json: curated theme universe plus market data
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import unicodedata
import zipfile
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

import requests

EDINET_CODELIST_URL = "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/codelist/Edinetcode.zip"
JST = timezone(timedelta(hours=9))


def norm(value: Any) -> str:
    return unicodedata.normalize("NFKC", str(value or "")).strip()


def pick(row: dict[str, str], *candidates: str) -> str:
    normalized = {norm(k).replace(" ", ""): v for k, v in row.items()}
    for name in candidates:
        key = norm(name).replace(" ", "")
        if key in normalized:
            return norm(normalized[key])
    return ""


def security_code(raw: str) -> str | None:
    digits = re.sub(r"\D", "", norm(raw))
    if len(digits) >= 4:
        return digits[:4]
    return None


def read_edinet_csv(payload: bytes) -> list[dict[str, str]]:
    with zipfile.ZipFile(io.BytesIO(payload)) as zf:
        names = [n for n in zf.namelist() if n.lower().endswith(".csv")]
        if not names:
            raise ValueError("EDINET code-list ZIP does not contain a CSV file")
        raw = zf.read(names[0])
    text = None
    for encoding in ("cp932", "shift_jis", "utf-8-sig", "utf-8"):
        try:
            text = raw.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    if text is None:
        raise ValueError("Unable to decode EDINET code-list CSV")
    return list(csv.DictReader(io.StringIO(text)))


def load_json(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def build(rows: list[dict[str, str]], curated: dict[str, Any]) -> dict[str, Any]:
    stocks: dict[str, dict[str, Any]] = {}
    for row in rows:
        listing = pick(row, "上場区分", "Listing category")
        code = security_code(pick(row, "証券コード", "Securities code"))
        name = pick(row, "提出者名", "会社名", "Filer name")
        filer_type = pick(row, "提出者種別", "Filer type")
        if not code or not name:
            continue
        # EDINET uses 上場/非上場. Empty listing flags are excluded.
        if listing and ("非上場" in listing or "上場" not in listing):
            continue
        ticker = f"{code}.T"
        curated_entry = curated.get(ticker, {})
        stocks[ticker] = {
            "ticker": ticker,
            "code": code,
            "name": name,
            "market": pick(row, "上場区分") or "上場",
            "industry": pick(row, "提出者業種", "業種"),
            "filer_type": filer_type,
            "themes": curated_entry.get("themes", []),
            "curated": bool(curated_entry),
        }

    # Never lose a curated stock because of a temporary source omission.
    for ticker, item in curated.items():
        code = ticker.replace(".T", "")
        current = stocks.setdefault(ticker, {
            "ticker": ticker, "code": code, "name": item.get("name") or code,
            "market": "", "industry": "", "filer_type": "",
            "themes": [], "curated": True,
        })
        current["name"] = item.get("name") or current["name"]
        current["themes"] = item.get("themes", [])
        current["curated"] = True

    ordered = sorted(stocks.values(), key=lambda x: (x["code"], x["name"]))
    return {
        "updated_at": datetime.now(JST).isoformat(timespec="seconds"),
        "source": "金融庁 EDINETコードリスト",
        "source_url": EDINET_CODELIST_URL,
        "count": len(ordered),
        "stocks": ordered,
    }


def fallback_from_repo(root: Path, curated: dict[str, Any]) -> dict[str, Any]:
    holder_index = load_json(root / "frontend/public/data/stockholders/index.json", {})
    rows = []
    for item in holder_index.get("items", []):
        rows.append({
            "上場区分": "上場", "証券コード": item.get("secCode", ""),
            "提出者名": item.get("issuerName", ""), "提出者業種": "",
            "提出者種別": "",
        })
    result = build(rows, curated)
    result["source"] = "repository fallback (run Update Listed Stock Master to refresh from EDINET)"
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-zip", type=Path)
    parser.add_argument("--output", type=Path, default=Path("frontend/public/data/listed_stock_master.json"))
    parser.add_argument("--fallback", action="store_true", help="Use repository data when download fails")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    curated_path = root / "frontend/public/data/stock_index.json"
    curated = load_json(curated_path, {})
    try:
        if args.input_zip:
            payload = args.input_zip.read_bytes()
        else:
            response = requests.get(EDINET_CODELIST_URL, timeout=60, headers={"User-Agent": "StockWaveJP/1.0"})
            response.raise_for_status()
            payload = response.content
        result = build(read_edinet_csv(payload), curated)
        if result["count"] < 1000:
            raise ValueError(f"Unexpectedly small listed universe: {result['count']}")
    except Exception:
        if not args.fallback:
            raise
        result = fallback_from_repo(root, curated)

    output = args.output if args.output.is_absolute() else root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {result['count']} stocks to {output}")


if __name__ == "__main__":
    main()
