"""既存の株価データを変えず、TDnet財務項目だけをmarket.jsonへ反映する。"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "public" / "data"
FINANCIAL_METRICS_PATH = DATA_DIR / "financial_metrics.json"
MARKET_PATH = DATA_DIR / "market.json"

DIRECT_FIELDS = (
    "net_cash",
    "operating_cf",
    "free_cf",
    "revenue",
    "revenue_type",
    "operating_income",
    "ordinary_income",
    "net_income_parent",
    "net_income",
    "eps",
    "eps_diluted",
    "prior_revenue",
    "prior_eps",
    "total_shares_issued",
    "treasury_stock_shares",
    "shares_outstanding",
    "average_shares",
    "forecast_revenue",
    "forecast_operating_income",
    "forecast_ordinary_income",
    "forecast_net_income_parent",
    "forecast_eps",
    "forecast_dps",
    "guidance_status",
    "guidance_disclosed_at",
    "guidance_filing_title",
    "guidance_source_url",
)

VERBOSE_FIELDS = ("guidance", "guidance_field_sources", "metric_details")


def fields_for_row(metric: dict, market_cap: object) -> dict:
    fields = {name: metric.get(name) for name in DIRECT_FIELDS}
    net_cash = metric.get("net_cash")
    try:
        cap = float(market_cap)
    except (TypeError, ValueError):
        cap = 0.0
    fields["net_cash_ratio"] = (
        round(float(net_cash) / cap * 100, 2)
        if net_cash is not None and cap
        else metric.get("net_cash_ratio")
    )
    fields.update(
        {
            "financial_period_type": metric.get("period_type"),
            "financial_disclosed_at": metric.get("disclosed_at"),
            "financial_filing_title": metric.get("filing_title"),
            "financial_source": metric.get("source"),
            "financial_source_url": metric.get("source_url"),
        }
    )
    return fields


def merge_node(node: object, metrics: dict, stats: dict) -> None:
    if isinstance(node, list):
        for item in node:
            merge_node(item, metrics, stats)
        return
    if not isinstance(node, dict):
        return

    ticker = node.get("ticker")
    if isinstance(ticker, str) and ticker in metrics:
        for name in VERBOSE_FIELDS:
            node.pop(name, None)
        node.update(fields_for_row(metrics[ticker], node.get("market_cap")))
        stats["rows"] += 1
        stats["tickers"].add(ticker)

    for value in node.values():
        if isinstance(value, (dict, list)):
            merge_node(value, metrics, stats)


def main() -> None:
    with FINANCIAL_METRICS_PATH.open(encoding="utf-8") as file:
        financial_payload = json.load(file)
    metrics = financial_payload.get("metrics", financial_payload)
    if not isinstance(metrics, dict) or not metrics:
        raise RuntimeError("financial_metrics.jsonに有効なmetricsがありません")

    with MARKET_PATH.open(encoding="utf-8") as file:
        market = json.load(file)

    stats = {"rows": 0, "tickers": set()}
    merge_node(market, metrics, stats)
    if stats["rows"] == 0:
        raise RuntimeError("market.json内でTDnet財務を結合できる銘柄がありません")

    with MARKET_PATH.open("w", encoding="utf-8", newline="\n") as file:
        json.dump(market, file, ensure_ascii=False, separators=(",", ":"))

    print(
        f"TDnet財務をmarket.jsonへ反映: {stats['rows']}行 / "
        f"{len(stats['tickers'])}銘柄"
    )


if __name__ == "__main__":
    main()
