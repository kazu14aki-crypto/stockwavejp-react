"""EDINET全FactアーカイブからStocksSearch向けの小型FCFデータを生成する。"""

from __future__ import annotations

import gzip
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "public" / "data" / "edinet_financial_facts"
OUTPUT = ROOT / "frontend" / "public" / "data" / "edinet_fcf_metrics.json"
CFO_NAMES = (
    "NetCashProvidedByUsedInOperatingActivities",
    "NetCashProvidedByUsedInOperatingActivitiesIFRS",
    "CashFlowsFromUsedInOperatingActivitiesIFRSSummaryOfBusinessResults",
    "CashFlowsFromUsedInOperatingActivitiesUSGAAPSummaryOfBusinessResults",
    "NetCashProvidedByUsedInOperatingActivitiesSummaryOfBusinessResults",
)
PPE_NAMES = (
    "PurchaseOfPropertyPlantAndEquipmentInvCF",
    "PurchaseOfPropertyPlantAndEquipmentInvCFIFRS",
)
COMBINED_CAPEX_NAMES = (
    "PurchaseOfPropertyPlantAndEquipmentAndIntangibleAssetsInvCF",
    "PurchaseOfPropertyPlantAndEquipmentAndIntangibleAssetsInvCFIFRS",
    "PurchaseOfPropertyPlantAndEquipmentAndInvestmentPropertyInvCFIFRS",
    "PurchaseOfTangibleAndIntangibleAssetsInvCFIFRS",
)
INTANGIBLE_NAMES = (
    "PurchaseOfIntangibleAssetsInvCF",
    "PurchaseOfIntangibleAssetsInvCFIFRS",
    "PaymentsRelatedToAcquisitionOfIntangibleAssetsAndInternalDevelopmentsInvCFIFRS",
    "PaymentsForAdditionsToAndInternallyDevelopedIntangibleAssetsInvCFIFRS",
    "AdditionsToIntangibleAssetsInvCFIFRS",
)


def number(value: Any) -> int | float | None:
    try:
        parsed = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None
    if not parsed.is_finite():
        return None
    return int(parsed) if parsed == parsed.to_integral_value() else float(parsed)


def acceptable_context(context: dict) -> bool:
    dimensions = context.get("dimensions") or []
    if not dimensions:
        return True
    return all(
        "ConsolidatedOrNonConsolidatedAxis" in str(item.get("dimension") or "")
        and "ConsolidatedMember" in str(item.get("member") or "")
        for item in dimensions
    )


def first(facts: dict[str, dict], names: tuple[str, ...]) -> dict | None:
    return next((facts[name] for name in names if name in facts), None)


def parse_document(path: Path, document: dict) -> dict | None:
    with gzip.open(path, "rt", encoding="utf-8") as handle:
        payload = json.load(handle)
    allowed = set(CFO_NAMES + PPE_NAMES + COMBINED_CAPEX_NAMES + INTANGIBLE_NAMES)
    periods: dict[tuple[str, str], dict[str, dict]] = defaultdict(dict)
    for xbrl in payload.get("xbrl_documents", []):
        contexts = xbrl.get("contexts") or {}
        for fact in xbrl.get("facts", []):
            name = fact.get("local_name")
            if name not in allowed or fact.get("numeric_value") is None:
                continue
            context = contexts.get(fact.get("context_ref")) or {}
            period = context.get("period") or {}
            start, end = period.get("start_date"), period.get("end_date")
            if not start or not end or not acceptable_context(context):
                continue
            value = number(fact.get("numeric_value"))
            if value is not None:
                periods[(start, end)].setdefault(name, {"value": value, "concept": name})
    metrics = []
    for (start, end), facts in periods.items():
        cfo, ppe, combined = first(facts, CFO_NAMES), first(facts, PPE_NAMES), first(facts, COMBINED_CAPEX_NAMES)
        intangible = first(facts, INTANGIBLE_NAMES)
        if cfo is None:
            continue
        capex = ppe or combined
        metrics.append({
            "periodStart": start,
            "periodEnd": end,
            "operatingCashFlow": cfo["value"],
            "operatingCashFlowConcept": cfo["concept"],
            "capitalExpenditure": abs(capex["value"]) if capex else None,
            "capitalExpenditureConcept": capex["concept"] if capex else None,
            "intangibleExpenditure": abs(intangible["value"]) if intangible and not combined else None,
            "intangibleExpenditureConcept": intangible["concept"] if intangible and not combined else None,
            "freeCashFlow": cfo["value"] - abs(capex["value"]) if capex else None,
            "definition": "営業CF−有形固定資産取得支出" if ppe else "営業CF−有形・無形資産等取得支出" if combined else None,
        })
    if not metrics:
        return None
    metrics.sort(key=lambda item: (item["periodEnd"], item["periodStart"]), reverse=True)
    submitted = str(document.get("submit_date_time") or "")[:10]
    current = next((item for item in metrics if not submitted or item["periodEnd"] <= submitted), metrics[0])
    duration = (datetime.fromisoformat(current["periodEnd"]) - datetime.fromisoformat(current["periodStart"])).days
    prior = next((item for item in metrics if item["periodEnd"] < current["periodEnd"] and abs((datetime.fromisoformat(item["periodEnd"]) - datetime.fromisoformat(item["periodStart"])).days - duration) <= 7), None)
    return {
        "docId": document.get("doc_id"),
        "docType": document.get("doc_type_code"),
        "description": document.get("description"),
        "submittedAt": document.get("submit_date_time"),
        "source": "EDINET API v2 XBRL",
        "current": current,
        "prior": prior,
    }


def main() -> int:
    index = json.loads((SOURCE / "index.json").read_text(encoding="utf-8"))
    records: dict[str, list[dict]] = defaultdict(list)
    stats = Counter()
    for document in index.get("documents", []):
        if document.get("doc_type_code") not in {"120", "160"}:
            continue
        stats["documentsScanned"] += 1
        try:
            record = parse_document(SOURCE / document["path"], document)
        except (OSError, json.JSONDecodeError):
            record = None
        if record is None:
            stats["documentsWithoutOperatingCf"] += 1
            continue
        code = str(document.get("security_code") or "")[:4]
        records[code].append(record)
        stats["documentsWithOperatingCf"] += 1
        stats["documentsWithFcf"] += record["current"].get("freeCashFlow") is not None
        stats["documentsWithComparablePriorFcf"] += bool(record.get("prior") and record["prior"].get("freeCashFlow") is not None)
    for values in records.values():
        values.sort(key=lambda item: item.get("submittedAt") or "", reverse=True)
    latest = {code: values[0] for code, values in records.items() if values}
    stats["securitiesWithOperatingCf"] = len(latest)
    stats["securitiesWithFcf"] = sum(item["current"].get("freeCashFlow") is not None for item in latest.values())
    stats["securitiesWithComparablePriorFcf"] = sum(bool(item.get("prior") and item["prior"].get("freeCashFlow") is not None) for item in latest.values())
    result = {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "sourceUpdatedAt": index.get("updated_at"),
        "source": "StockWaveJP EDINET全Factアーカイブ / EDINET API v2 XBRL",
        "stats": dict(stats),
        "bySecurity": records,
    }
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps(result["stats"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
