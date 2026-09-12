"""TDnet決算短信XBRLを期間指定で取得し、全Factと主要指標を保存する。

TDnetの一覧APIは長期間を一度に照会すると失敗することがあるため月単位で取得する。
保存済み開示は再取得せず、途中で停止しても再実行で継続できる。
"""
from __future__ import annotations

import argparse
import gzip
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, is_dataclass
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "public" / "data"
STOCK_INDEX_PATH = DATA_DIR / "stock_index.json"
OUTPUT_DIR = DATA_DIR / "tdnet_financial_history"
DOC_ID_RE = re.compile(r"([^/]+?)\.(?:zip|pdf)(?:\?.*)?$", re.IGNORECASE)


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def month_ranges(start: date, end: date) -> Iterable[tuple[date, date]]:
    current = start
    while current <= end:
        next_month = (current.replace(day=28) + timedelta(days=4)).replace(day=1)
        month_end = min(end, next_month - timedelta(days=1))
        yield current, month_end
        current = next_month


def doc_id_from_row(row: dict[str, Any]) -> str:
    for field in ("url_xbrl", "document_url"):
        match = DOC_ID_RE.search(str(row.get(field) or ""))
        if match:
            return match.group(1)
    return str(row.get("id") or "").strip()


def security_code(value: Any) -> str:
    # 2024年以降の英字を含む証券コード（例: 138A）も対象から落とさない。
    text = str(value or "").strip().upper().removesuffix(".T")
    compact = "".join(ch for ch in text if ch.isalnum())
    return compact[:4] if len(compact) >= 4 else ""


def is_earnings_filing(row: dict[str, Any]) -> bool:
    return "決算短信" in str(row.get("title") or "") and bool(row.get("url_xbrl"))


def json_scalar(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if is_dataclass(value):
        return {key: json_scalar(item) for key, item in asdict(value).items()}
    if isinstance(value, dict):
        return {str(key): json_scalar(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [json_scalar(item) for item in value]
    return str(value)


def period_payload(period: Any) -> dict[str, Any] | None:
    if period is None:
        return None
    result = {
        "type": type(period).__name__,
        "instant": json_scalar(getattr(period, "instant", None)),
        "start_date": json_scalar(
            getattr(period, "start_date", None) or getattr(period, "start", None)
        ),
        "end_date": json_scalar(
            getattr(period, "end_date", None) or getattr(period, "end", None)
        ),
        "raw": str(period),
    }
    return {key: value for key, value in result.items() if value is not None}


def fact_payload(item: Any) -> dict[str, Any]:
    raw_value = getattr(item, "value", None)
    label_ja = getattr(getattr(item, "label_ja", None), "text", "")
    label_en = getattr(getattr(item, "label_en", None), "text", "")
    return {
        "concept": str(getattr(item, "concept", "")),
        "namespace_uri": str(getattr(item, "namespace_uri", "")),
        "local_name": str(getattr(item, "local_name", "")),
        "label_ja": str(label_ja or ""),
        "label_en": str(label_en or ""),
        # 精度を落とさないためXBRL値は文字列で保持する。
        "value": None if raw_value is None else str(raw_value),
        "value_type": "decimal" if isinstance(raw_value, Decimal) else "text",
        "unit_ref": getattr(item, "unit_ref", None),
        "decimals": json_scalar(getattr(item, "decimals", None)),
        "context_id": str(getattr(item, "context_id", "")),
        "period": period_payload(getattr(item, "period", None)),
        "entity_id": str(getattr(item, "entity_id", "")),
        "dimensions": [
            {
                "axis": str(getattr(dimension, "axis", "")),
                "member": str(getattr(dimension, "member", "")),
            }
            for dimension in (getattr(item, "dimensions", None) or ())
        ],
        "is_nil": bool(getattr(item, "is_nil", False)),
        "source_line": getattr(item, "source_line", None),
        "order": getattr(item, "order", None),
    }


def filing_metadata(row: dict[str, Any], *, source_url: str, fact_count: int) -> dict[str, Any]:
    code = security_code(row.get("company_code"))
    return {
        "doc_id": doc_id_from_row(row),
        "published_at": str(row.get("pubdate") or ""),
        "security_code": code,
        "company_code": str(row.get("company_code") or ""),
        "company_name": str(row.get("company_name") or ""),
        "title": str(row.get("title") or ""),
        "markets": str(row.get("markets_string") or ""),
        "document_url": str(row.get("document_url") or ""),
        "xbrl_url": str(row.get("url_xbrl") or ""),
        "source_url": source_url,
        "fact_count": fact_count,
    }


def write_gzip_json(path: Path, payload: dict[str, Any]) -> None:
    encoded = (json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(gzip.compress(encoded, compresslevel=9, mtime=0))


def refresh_stored_metadata(path: Path, row: dict[str, Any]) -> dict[str, Any]:
    """一覧側のコード・社名等を既存Factへ反映し、再ダウンロードを避ける。"""
    with gzip.open(path, "rt", encoding="utf-8") as source:
        payload = json.load(source)
    current = payload.get("source_document", {})
    expected = filing_metadata(
        row,
        source_url=str(current.get("source_url") or row.get("url_xbrl") or ""),
        fact_count=len(payload.get("facts", [])),
    )
    if current != expected:
        payload["source_document"] = expected
        write_gzip_json(path, payload)
    return expected


def fetch_one(row: dict[str, Any], market_cap: int | float | None, output_dir: Path) -> dict[str, Any]:
    import tdnet

    # 主要指標抽出は本番の最新値更新と同じ定義を再利用する。
    from update_tdnet_financial_metrics import metric_row

    filing = tdnet.Filing.from_yanoshin(row)
    downloaded = filing.fetch_xbrl()
    statements = tdnet.parse_zip(downloaded.data, entity_id=filing.company_code)

    class CachedFiling:
        pubdate = filing.pubdate
        company_code = filing.company_code
        company_name = filing.company_name
        title = filing.title

        @staticmethod
        def fetch_xbrl() -> Any:
            return downloaded

    metrics = metric_row(CachedFiling(), market_cap)
    facts = [fact_payload(item) for item in statements]
    metadata = filing_metadata(row, source_url=str(downloaded.source_url), fact_count=len(facts))
    payload = {
        "schema_version": 1,
        "source": "TDnet XBRL",
        "source_document": metadata,
        "normalized_metrics": metrics,
        "parser_warnings": [str(item) for item in getattr(statements, "_warnings", ())],
        "facts": facts,
    }
    write_gzip_json(output_dir / "filings" / f"{metadata['doc_id']}.json.gz", payload)
    return metadata


def build_parser() -> argparse.ArgumentParser:
    today = datetime.now(timezone.utc).astimezone().date()
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", default=(today - timedelta(days=730)).isoformat())
    parser.add_argument("--end", default=today.isoformat())
    parser.add_argument("--codes", nargs="*", help="4桁の証券コード。未指定時はStockWaveJP採用全銘柄")
    parser.add_argument("--limit", type=int, help="検証用の最大開示件数")
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    parser.add_argument("--refresh", action="store_true", help="保存済み開示も再取得")
    parser.add_argument(
        "--prune",
        action="store_true",
        help="指定期間・指定銘柄に含まれない保存済み開示を削除（--limitとは併用不可）",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    start = date.fromisoformat(args.start)
    end = date.fromisoformat(args.end)
    if start > end:
        raise SystemExit("--start は --end 以下にしてください")
    if args.prune and args.limit is not None:
        raise SystemExit("--prune と --limit は併用できません")

    stock_index = load_json(STOCK_INDEX_PATH, {})
    selected_codes = {security_code(code) for code in args.codes} if args.codes else {
        security_code(ticker) for ticker in stock_index
    }
    selected_codes.discard("")
    market_caps = {
        security_code(ticker): row.get("market_cap")
        for ticker, row in stock_index.items()
        if isinstance(row, dict)
    }

    import tdnet

    candidates: dict[str, dict[str, Any]] = {}
    list_errors: list[dict[str, str]] = []
    for range_start, range_end in month_ranges(start, end):
        try:
            rows = tdnet.list_by_range(
                range_start, range_end, has_xbrl=True, limit=10000
            )
            for row in rows:
                code = security_code(row.get("company_code"))
                doc_id = doc_id_from_row(row)
                if code in selected_codes and doc_id and is_earnings_filing(row):
                    candidates[doc_id] = row
            print(
                f"一覧 {range_start.isoformat()}〜{range_end.isoformat()}: "
                f"{len(rows)}件（対象累計 {len(candidates)}件）"
            )
        except Exception as exc:
            list_errors.append({
                "range": f"{range_start.isoformat()}..{range_end.isoformat()}",
                "error": f"{type(exc).__name__}: {exc}",
            })
            print(f"一覧取得失敗 {range_start}〜{range_end}: {exc}", file=sys.stderr)

    ordered = sorted(candidates.values(), key=lambda row: str(row.get("pubdate") or ""))
    if args.limit is not None:
        ordered = ordered[: max(args.limit, 0)]

    existing_index = load_json(args.output_dir / "index.json", {})
    filing_index = existing_index.get("filings", {}) if isinstance(existing_index, dict) else {}
    to_fetch = []
    skipped = 0
    metadata_refreshed = 0
    for row in ordered:
        doc_id = doc_id_from_row(row)
        path = args.output_dir / "filings" / f"{doc_id}.json.gz"
        if path.exists() and not args.refresh:
            previous = filing_index.get(doc_id)
            current = refresh_stored_metadata(path, row)
            filing_index[doc_id] = current
            if previous != current:
                metadata_refreshed += 1
            skipped += 1
            continue
        to_fetch.append(row)

    errors: list[dict[str, str]] = []
    completed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = {
            executor.submit(
                fetch_one,
                row,
                market_caps.get(security_code(row.get("company_code"))),
                args.output_dir,
            ): row
            for row in to_fetch
        }
        for future in as_completed(futures):
            row = futures[future]
            doc_id = doc_id_from_row(row)
            try:
                metadata = future.result()
                filing_index[doc_id] = metadata
                completed += 1
                if completed == 1 or completed % 25 == 0 or completed == len(to_fetch):
                    print(f"XBRL保存 {completed}/{len(to_fetch)}: {doc_id}")
            except Exception as exc:
                errors.append({
                    "doc_id": doc_id,
                    "security_code": security_code(row.get("company_code")),
                    "published_at": str(row.get("pubdate") or ""),
                    "title": str(row.get("title") or ""),
                    "error": f"{type(exc).__name__}: {exc}",
                })
                print(f"XBRL取得失敗 {doc_id}: {exc}", file=sys.stderr)

    # 今回の期間・対象に含まれる既存ファイルも索引へ補完する。
    for row in ordered:
        doc_id = doc_id_from_row(row)
        if doc_id in filing_index:
            continue
        path = args.output_dir / "filings" / f"{doc_id}.json.gz"
        if not path.exists():
            continue
        with gzip.open(path, "rt", encoding="utf-8") as source:
            stored = json.load(source)
        filing_index[doc_id] = stored["source_document"]

    pruned = 0
    if args.prune:
        requested_doc_ids = {doc_id_from_row(row) for row in ordered}
        for doc_id in sorted(set(filing_index) - requested_doc_ids):
            # 出力先のfilings直下にある確定済みdoc_idだけを対象にする。
            stale_path = args.output_dir / "filings" / f"{doc_id}.json.gz"
            if stale_path.parent.resolve() != (args.output_dir / "filings").resolve():
                raise RuntimeError(f"削除対象がfilings外です: {stale_path}")
            if stale_path.exists():
                stale_path.unlink()
            filing_index.pop(doc_id, None)
            pruned += 1

    by_security: dict[str, list[str]] = {}
    for doc_id, metadata in filing_index.items():
        code = security_code(metadata.get("security_code") or metadata.get("company_code"))
        if code:
            by_security.setdefault(code, []).append(doc_id)
    for code, doc_ids in by_security.items():
        doc_ids.sort(
            key=lambda item: str(filing_index[item].get("published_at") or ""),
            reverse=True,
        )

    now = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    payload = {
        "schema_version": 1,
        "updated_at": now,
        "source": "TDnet XBRL",
        "storage": "filings/{doc_id}.json.gz",
        "value_policy": "全XBRL Factのvalueは精度保持のため文字列。normalized_metricsは数値型。",
        "definitions": {
            "normalized_metrics": "最新TDnet財務と同じ抽出定義による主要指標",
            "facts": "TDnet決算短信XBRLから解析できた全Factとcontext・期間・dimension・単位・桁情報",
            "forecast_values": "TDnet XBRLに開示された会社予想であり、市場コンセンサスではない",
        },
        "range_start": start.isoformat(),
        "range_end": end.isoformat(),
        "site_security_count": len(selected_codes),
        "document_count": len(filing_index),
        "security_count": len(by_security),
        "last_run": {
            "candidates": len(ordered),
            "processed": completed,
            "skipped_existing": skipped,
            "metadata_refreshed": metadata_refreshed,
            "pruned_outside_request": pruned,
            "list_error_count": len(list_errors),
            "document_error_count": len(errors),
            "list_errors": list_errors,
            "document_errors": errors,
        },
        "by_security_code": by_security,
        "filings": dict(sorted(filing_index.items())),
    }
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "index.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"完了: 候補{len(ordered)}件、取得{completed}件、既存{skipped}件、"
        f"メタデータ補正{metadata_refreshed}件、除外{pruned}件、"
        f"エラー{len(errors) + len(list_errors)}件、保存先 {args.output_dir}"
    )
    return 1 if list_errors or errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
