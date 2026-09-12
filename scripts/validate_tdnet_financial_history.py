"""保存済みTDnet履歴アーカイブの整合性と主要項目カバレッジを検証する。"""
from __future__ import annotations

import argparse
import gzip
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ROOT = ROOT / "frontend" / "public" / "data" / "tdnet_financial_history"
FIELDS = (
    "revenue",
    "eps",
    "forecast_revenue",
    "forecast_eps",
    "total_shares_issued",
    "operating_cf",
    "free_cf",
    "net_cash",
)


def validate(root: Path) -> dict[str, object]:
    index = json.loads((root / "index.json").read_text(encoding="utf-8"))
    files = list((root / "filings").glob("*.json.gz"))
    bad_files: list[str] = []
    coverage: Counter[str] = Counter()
    sources: Counter[str] = Counter()
    fact_count = 0
    parser_warning_count = 0
    for path in files:
        with gzip.open(path, "rt", encoding="utf-8") as source:
            payload = json.load(source)
        doc_id = path.name.removesuffix(".json.gz")
        metadata = payload.get("source_document", {})
        facts = payload.get("facts", [])
        metrics = payload.get("normalized_metrics") or {}
        fact_count += len(facts)
        parser_warning_count += len(payload.get("parser_warnings", []))
        sources[str(payload.get("source"))] += 1
        for field in FIELDS:
            if metrics.get(field) is not None:
                coverage[field] += 1
        if metadata.get("doc_id") != doc_id or metadata.get("fact_count") != len(facts):
            bad_files.append(doc_id)

    index_ids = set(index.get("filings", {}))
    file_ids = {path.name.removesuffix(".json.gz") for path in files}
    result: dict[str, object] = {
        "range": [index.get("range_start"), index.get("range_end")],
        "documents": index.get("document_count"),
        "files": len(files),
        "securities": index.get("security_count"),
        "site_securities": index.get("site_security_count"),
        "facts": fact_count,
        "parser_warnings": parser_warning_count,
        "errors": (
            index.get("last_run", {}).get("list_error_count", 0)
            + index.get("last_run", {}).get("document_error_count", 0)
        ),
        "bad_files": len(bad_files),
        "missing_files": sorted(index_ids - file_ids),
        "unindexed_files": sorted(file_ids - index_ids),
        "field_coverage": dict(coverage),
        "sources": dict(sources),
        "size_mb": round(sum(path.stat().st_size for path in files) / 1024 / 1024, 1),
    }
    if (
        result["documents"] != result["files"]
        or result["errors"]
        or result["bad_files"]
        or result["missing_files"]
        or result["unindexed_files"]
        or sources != {"TDnet XBRL": len(files)}
    ):
        raise RuntimeError(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    args = parser.parse_args()
    print(json.dumps(validate(args.root), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
