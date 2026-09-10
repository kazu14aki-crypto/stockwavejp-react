"""TDnetの決算短信XBRLから、銘柄画面用の財務指標を更新する。

出力は frontend/public/data/financial_metrics.json。金額は円、CFは当期累計。
FCFは営業CF - 有形固定資産取得支出とし、取得支出をXBRLから確認できない
開示では値を作らない。実績、会社予想（ガイダンス）、株式数についても
元Fact・期間・単位を追跡できる詳細を保存する。
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "frontend" / "public" / "data"
INDEX_PATH = DATA_DIR / "stock_index.json"
OUTPUT_PATH = DATA_DIR / "financial_metrics.json"


def json_value(value: Any) -> int | float | None:
    """Decimal等をJSONで扱える数値にする。"""
    if value is None:
        return None
    try:
        number = Decimal(str(value))
    except Exception:
        return None
    if not number.is_finite():
        return None
    return int(number) if number == number.to_integral_value() else float(number)


def get_value(values: dict[Any, Any], key: Any) -> int | float | None:
    """tdnetのCK enum / str双方の戻り値に対応する。"""
    for candidate in (key, str(key), getattr(key, "value", None)):
        if candidate in values:
            item = values[candidate]
            return json_value(getattr(item, "value", item))
    return None


def get_extracted(values: dict[Any, Any], key: Any) -> Any | None:
    """tdnetのCK enum / str双方のキーからExtractedValueを返す。"""
    for candidate in (key, str(key), getattr(key, "value", None)):
        if candidate in values:
            return values[candidate]
    return None


def _date_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value)
    return text if text and text != "None" else None


def period_detail(period: Any) -> dict[str, Any] | None:
    """xbrl-coreのInstant/Duration両期間をJSON化する。"""
    if period is None:
        return None
    instant = getattr(period, "instant", None)
    start = getattr(period, "start_date", None) or getattr(period, "start", None)
    end = getattr(period, "end_date", None) or getattr(period, "end", None)
    result = {
        "instant": _date_text(instant),
        "start_date": _date_text(start),
        "end_date": _date_text(end),
    }
    return result if any(result.values()) else {"raw": str(period)}


def dimension_detail(dimensions: Any) -> list[dict[str, str]]:
    result = []
    for dimension in dimensions or ():
        axis = (
            getattr(dimension, "dimension", None)
            or getattr(dimension, "axis", None)
            or getattr(dimension, "dimension_qname", None)
        )
        member = getattr(dimension, "member", None) or getattr(dimension, "member_qname", None)
        result.append({"axis": str(axis or ""), "member": str(member or dimension)})
    return result


def extracted_detail(values: dict[Any, Any], key: Any) -> dict[str, Any] | None:
    """値と元XBRL Factの出所を保存する。"""
    extracted = get_extracted(values, key)
    if extracted is None:
        return None
    item = getattr(extracted, "item", None)
    value = json_value(getattr(extracted, "value", extracted))
    if value is None:
        return None
    detail = {
        "value": value,
        "canonical_key": str(getattr(extracted, "canonical_key", key)),
        "mapper": getattr(extracted, "mapper_name", None),
    }
    if item is not None:
        detail.update({
            "concept": getattr(item, "local_name", None),
            "namespace": getattr(item, "namespace_uri", None),
            "unit": getattr(item, "unit_ref", None),
            "decimals": getattr(item, "decimals", None),
            "period": period_detail(getattr(item, "period", None)),
            "dimensions": dimension_detail(getattr(item, "dimensions", None)),
        })
    return detail


def first_metric(values: dict[Any, Any], candidates: list[tuple[Any, str]]) -> tuple[int | float | None, str | None, dict[str, Any] | None]:
    for key, label in candidates:
        detail = extracted_detail(values, key)
        if detail is not None:
            return detail["value"], label, detail
    return None, None, None


DEBT_LOCAL_NAMES = {
    "ShortTermBorrowings",
    "CurrentPortionOfLongTermLoansPayable",
    "CurrentPortionOfBonds",
    "CurrentPortionOfConvertibleBondTypeBonds",
    "Bonds",
    "ConvertibleBondTypeBonds",
    "LongTermLoansPayable",
    "LongTermBorrowings",
    "BondsAndBorrowings",
    "CurrentBondsAndBorrowings",
    "BondsPayableCLIFRS",
    "BondsPayableNCLIFRS",
    "BorrowingsCLIFRS",
    "BorrowingsNCLIFRS",
}

CASH_LOCAL_NAMES = {
    "CashAndDeposits",
    "CashAndCashEquivalents",
    "CashAndCashEquivalentsIFRS",
}


def latest_instant(statements: Any, names: set[str] | None = None) -> Any:
    instants = [
        getattr(getattr(item, "period", None), "instant", None)
        for item in statements
        if names is None or getattr(item, "local_name", "") in names
    ]
    return max((instant for instant in instants if instant is not None), default=None)


def current_instant_value(statements: Any, names: set[str]) -> tuple[int | float | None, Any]:
    """貸借対照表の比較列を避け、最新の期末日だけを読む。"""
    instant = latest_instant(statements, names)
    if instant is None:
        return None, None
    for item in statements:
        if getattr(item, "local_name", "") in names and getattr(getattr(item, "period", None), "instant", None) == instant:
            return json_value(getattr(item, "value", None)), instant
    return None, instant


def interest_bearing_debt(statements: Any, instant: Any) -> int | float | None:
    """重複しない代表的な有利子負債XBRL科目だけを合算する。

リース負債、仕入債務、偶発債務は含めない。金融機関などで科目が取得不能な
場合は、ネットキャッシュを表示しないため、過度な推定にならない。
"""
    if instant is None:
        return None
    found: list[int | float] = []
    for item in statements:
        if getattr(item, "local_name", "") not in DEBT_LOCAL_NAMES:
            continue
        if getattr(getattr(item, "period", None), "instant", None) != instant:
            continue
        value = json_value(getattr(item, "value", None))
        if value is not None:
            found.append(value)
    return sum(found) if found else None


def metric_row(filing: Any, market_cap: int | float | None) -> dict[str, Any] | None:
    import tdnet
    from tdnet import CK, extract_values, parse_zip

    downloaded = filing.fetch_xbrl()
    statements = parse_zip(downloaded.data)
    actual_keys = [
        CK.REVENUE,
        CK.ORDINARY_REVENUE_BANKING,
        CK.ORDINARY_REVENUE_INSURANCE,
        CK.NET_OPERATING_REVENUE_SE,
        CK.OPERATING_REVENUE_SE,
        CK.OPERATING_INCOME,
        CK.ORDINARY_INCOME,
        CK.NET_INCOME_PARENT,
        CK.NET_INCOME,
        CK.EPS,
        CK.EPS_DILUTED,
        CK.TOTAL_SHARES_ISSUED,
        CK.TREASURY_STOCK_SHARES,
        CK.AVERAGE_SHARES,
        CK.CASH_AND_DEPOSITS,
        CK.OPERATING_CF,
        CK.PURCHASE_PPE_CF,
    ]
    values = extract_values(statements, actual_keys, period="current", consolidated=True)
    # 非連結決算短信では連結指定で取れないため、同じ一次資料を個別値として読む。
    if not any(get_value(values, key) is not None for key in actual_keys):
        values = extract_values(statements, actual_keys, period="current", consolidated=False)
        consolidation = "non_consolidated"
    else:
        consolidation = "consolidated"

    # 発行済株式数・自己株式数・期中平均株式数は、連結会社でもTDnetサマリー上は
    # NonConsolidatedMemberに置かれるため、PL/CFとは別に非連結軸から取得する。
    share_keys = [CK.TOTAL_SHARES_ISSUED, CK.TREASURY_STOCK_SHARES, CK.AVERAGE_SHARES]
    share_values = extract_values(statements, share_keys, period="current", consolidated=False)
    for key in share_keys:
        share_item = get_extracted(share_values, key)
        if share_item is not None:
            values[key] = share_item

    prior_values = extract_values(statements, actual_keys, period="prior", consolidated=consolidation == "consolidated")

    revenue, revenue_type, revenue_detail = first_metric(values, [
        (CK.REVENUE, "売上高・売上収益"),
        (CK.ORDINARY_REVENUE_BANKING, "銀行業の経常収益"),
        (CK.ORDINARY_REVENUE_INSURANCE, "保険業の経常収益"),
        (CK.NET_OPERATING_REVENUE_SE, "証券業の純営業収益"),
        (CK.OPERATING_REVENUE_SE, "証券業の営業収益"),
    ])
    prior_revenue, _, prior_revenue_detail = first_metric(prior_values, [
        (CK.REVENUE, "売上高・売上収益"),
        (CK.ORDINARY_REVENUE_BANKING, "銀行業の経常収益"),
        (CK.ORDINARY_REVENUE_INSURANCE, "保険業の経常収益"),
        (CK.NET_OPERATING_REVENUE_SE, "証券業の純営業収益"),
        (CK.OPERATING_REVENUE_SE, "証券業の営業収益"),
    ])

    fallback_cash, cash_instant = current_instant_value(statements, CASH_LOCAL_NAMES)
    cash = get_value(values, CK.CASH_AND_DEPOSITS)
    if cash is None:
        cash = fallback_cash
    debt = interest_bearing_debt(statements, cash_instant)
    operating_cf = get_value(values, CK.OPERATING_CF)
    purchase_ppe_cf = get_value(values, CK.PURCHASE_PPE_CF)
    net_cash = cash - debt if cash is not None and debt is not None else None
    # 支出は通常マイナス。正数で返るタクソノミーでも同じ定義にする。
    free_cf = None
    if operating_cf is not None and purchase_ppe_cf is not None:
        free_cf = operating_cf + purchase_ppe_cf if purchase_ppe_cf <= 0 else operating_cf - purchase_ppe_cf

    total_shares = get_value(values, CK.TOTAL_SHARES_ISSUED)
    treasury_shares = get_value(values, CK.TREASURY_STOCK_SHARES)
    shares_outstanding = (
        total_shares - treasury_shares
        if total_shares is not None and treasury_shares is not None
        else None
    )

    guidance_keys = [
        CK.FORECAST_REVENUE,
        CK.FORECAST_OPERATING_INCOME,
        CK.FORECAST_ORDINARY_INCOME,
        CK.FORECAST_NET_INCOME_PARENT,
        CK.FORECAST_EPS,
        CK.FORECAST_DPS,
    ]
    guidance_values = extract_values(statements, guidance_keys)
    guidance = {
        "revenue": get_value(guidance_values, CK.FORECAST_REVENUE),
        "operating_income": get_value(guidance_values, CK.FORECAST_OPERATING_INCOME),
        "ordinary_income": get_value(guidance_values, CK.FORECAST_ORDINARY_INCOME),
        "net_income_parent": get_value(guidance_values, CK.FORECAST_NET_INCOME_PARENT),
        "eps": get_value(guidance_values, CK.FORECAST_EPS),
        "dps": get_value(guidance_values, CK.FORECAST_DPS),
    }
    earnings_guidance_source = {
        "disclosed_at": str(getattr(filing, "pubdate", "")),
        "filing_title": str(getattr(filing, "title", "")),
        "source_url": str(getattr(downloaded, "source_url", "")),
    }
    guidance_field_sources = {
        key: earnings_guidance_source
        for key, value in guidance.items()
        if value is not None
    }

    # 少なくとも依頼された財務項目のいずれかが確認できた場合のみ公開データに残す。
    if all(value is None for value in (
        net_cash, operating_cf, free_cf, revenue, get_value(values, CK.EPS),
        total_shares, *guidance.values(),
    )):
        return None
    metric_details = {
        "revenue": revenue_detail,
        "operating_income": extracted_detail(values, CK.OPERATING_INCOME),
        "ordinary_income": extracted_detail(values, CK.ORDINARY_INCOME),
        "net_income_parent": extracted_detail(values, CK.NET_INCOME_PARENT),
        "net_income": extracted_detail(values, CK.NET_INCOME),
        "eps": extracted_detail(values, CK.EPS),
        "eps_diluted": extracted_detail(values, CK.EPS_DILUTED),
        "total_shares_issued": extracted_detail(values, CK.TOTAL_SHARES_ISSUED),
        "treasury_stock_shares": extracted_detail(values, CK.TREASURY_STOCK_SHARES),
        "average_shares": extracted_detail(values, CK.AVERAGE_SHARES),
        "prior_revenue": prior_revenue_detail,
        "prior_eps": extracted_detail(prior_values, CK.EPS),
        "forecast_revenue": extracted_detail(guidance_values, CK.FORECAST_REVENUE),
        "forecast_operating_income": extracted_detail(guidance_values, CK.FORECAST_OPERATING_INCOME),
        "forecast_ordinary_income": extracted_detail(guidance_values, CK.FORECAST_ORDINARY_INCOME),
        "forecast_net_income_parent": extracted_detail(guidance_values, CK.FORECAST_NET_INCOME_PARENT),
        "forecast_eps": extracted_detail(guidance_values, CK.FORECAST_EPS),
        "forecast_dps": extracted_detail(guidance_values, CK.FORECAST_DPS),
    }
    return {
        "net_cash": json_value(net_cash),
        "net_cash_ratio": round(net_cash / market_cap * 100, 2) if net_cash is not None and market_cap else None,
        "operating_cf": json_value(operating_cf),
        "free_cf": json_value(free_cf),
        "cash_and_deposits": json_value(cash),
        "interest_bearing_debt": json_value(debt),
        "revenue": json_value(revenue),
        "revenue_type": revenue_type,
        "operating_income": get_value(values, CK.OPERATING_INCOME),
        "ordinary_income": get_value(values, CK.ORDINARY_INCOME),
        "net_income_parent": get_value(values, CK.NET_INCOME_PARENT),
        "net_income": get_value(values, CK.NET_INCOME),
        "eps": get_value(values, CK.EPS),
        "eps_diluted": get_value(values, CK.EPS_DILUTED),
        "prior_revenue": json_value(prior_revenue),
        "prior_eps": get_value(prior_values, CK.EPS),
        "total_shares_issued": json_value(total_shares),
        "treasury_stock_shares": json_value(treasury_shares),
        "shares_outstanding": json_value(shares_outstanding),
        "average_shares": get_value(values, CK.AVERAGE_SHARES),
        "forecast_revenue": guidance["revenue"],
        "forecast_operating_income": guidance["operating_income"],
        "forecast_ordinary_income": guidance["ordinary_income"],
        "forecast_net_income_parent": guidance["net_income_parent"],
        "forecast_eps": guidance["eps"],
        "forecast_dps": guidance["dps"],
        "guidance": guidance,
        "guidance_field_sources": guidance_field_sources,
        "guidance_status": "company_forecast" if any(value is not None for value in guidance.values()) else "not_disclosed_in_xbrl",
        "guidance_disclosed_at": str(getattr(filing, "pubdate", "")),
        "guidance_filing_title": str(getattr(filing, "title", "")),
        "guidance_source_url": str(getattr(downloaded, "source_url", "")),
        "consolidation": consolidation,
        "metric_details": {key: value for key, value in metric_details.items() if value is not None},
        "period_type": "当期累計",
        "fcf_definition": "営業CF−有形固定資産取得支出",
        "disclosed_at": str(getattr(filing, "pubdate", "")),
        "filing_title": str(getattr(filing, "title", "")),
        "source": "TDnet XBRL",
        "source_url": str(getattr(downloaded, "source_url", "")),
    }


def merge_newer_guidance(row: dict[str, Any], filing: Any) -> None:
    """決算短信後の業績予想修正XBRLがあれば会社予想だけを上書きする。"""
    from tdnet import CK, extract_values, parse_zip

    downloaded = filing.fetch_xbrl()
    statements = parse_zip(downloaded.data)
    keys = [
        CK.FORECAST_REVENUE,
        CK.FORECAST_OPERATING_INCOME,
        CK.FORECAST_ORDINARY_INCOME,
        CK.FORECAST_NET_INCOME_PARENT,
        CK.FORECAST_EPS,
        CK.FORECAST_DPS,
    ]
    values = extract_values(statements, keys)
    field_keys = {
        "forecast_revenue": CK.FORECAST_REVENUE,
        "forecast_operating_income": CK.FORECAST_OPERATING_INCOME,
        "forecast_ordinary_income": CK.FORECAST_ORDINARY_INCOME,
        "forecast_net_income_parent": CK.FORECAST_NET_INCOME_PARENT,
        "forecast_eps": CK.FORECAST_EPS,
        "forecast_dps": CK.FORECAST_DPS,
    }
    found = False
    for field, key in field_keys.items():
        value = get_value(values, key)
        if value is None:
            continue
        row[field] = value
        row["guidance"][field.removeprefix("forecast_")] = value
        row.setdefault("guidance_field_sources", {})[field.removeprefix("forecast_")] = {
            "disclosed_at": str(getattr(filing, "pubdate", "")),
            "filing_title": str(getattr(filing, "title", "")),
            "source_url": str(getattr(downloaded, "source_url", "")),
        }
        detail = extracted_detail(values, key)
        if detail is not None:
            row.setdefault("metric_details", {})[field] = detail
        found = True
    if found:
        row.update({
            "guidance_status": "revised_company_forecast",
            "guidance_disclosed_at": str(getattr(filing, "pubdate", "")),
            "guidance_filing_title": str(getattr(filing, "title", "")),
            "guidance_source_url": str(getattr(downloaded, "source_url", "")),
        })


def latest_relevant_filings(code: str) -> tuple[Any | None, Any | None]:
    import tdnet

    # 開示一覧は公開APIを優先し、利用不能時はTDnetの公開一覧へフォールバックする。
    # 財務数値そのものは、各FilingのTDnet XBRL ZIPからのみ抽出する。
    filings = tdnet.documents(code=int(code), has_xbrl=True, limit=24)
    earnings = None
    guidance = None
    for filing in filings:
        title = str(getattr(filing, "title", ""))
        if earnings is None and "決算短信" in title:
            earnings = filing
        elif guidance is None and "業績予想" in title:
            guidance = filing
        if earnings is not None and guidance is not None:
            break
    if earnings is not None and guidance is not None:
        earnings_date = str(getattr(earnings, "pubdate", ""))
        guidance_date = str(getattr(guidance, "pubdate", ""))
        if guidance_date <= earnings_date:
            guidance = None
    return earnings, guidance


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--codes", nargs="*", help="4桁の証券コードだけを更新")
    parser.add_argument("--limit", type=int, help="検証用の最大件数")
    parser.add_argument("--offset", type=int, default=0, help="更新対象の開始位置（分割実行用）")
    parser.add_argument(
        "--output",
        type=Path,
        help="検証用の出力先。未指定時は公開用 financial_metrics.json を更新",
    )
    args = parser.parse_args()

    stock_index = load_json(INDEX_PATH, {})
    output_path = args.output or OUTPUT_PATH
    # 検証出力は公開済みデータを継承せず、指定銘柄の抽出結果だけを確認できるようにする。
    existing = load_json(output_path, {}) if args.output else load_json(OUTPUT_PATH, {})
    metrics = dict(existing.get("metrics", {}))
    requested = {str(code).zfill(4) for code in args.codes} if args.codes else None
    entries = []
    for ticker, stock in stock_index.items():
        code = str(ticker).replace(".T", "")
        if len(code) != 4 or not code.isdigit() or (requested and code not in requested):
            continue
        entries.append((ticker, code, stock.get("market_cap")))
    if args.offset:
        entries = entries[args.offset:]
    if args.limit:
        entries = entries[: args.limit]
    if not entries:
        print("更新対象の証券コードがありません。")
        return 0

    updated = errors = 0
    for number, (ticker, code, market_cap) in enumerate(entries, 1):
        try:
            filing, guidance_filing = latest_relevant_filings(code)
            if filing is None:
                print(f"[{number}/{len(entries)}] {code}: XBRL付き決算短信なし")
                continue
            row = metric_row(filing, market_cap)
            if row is None:
                print(f"[{number}/{len(entries)}] {code}: 対象科目なし")
                continue
            if guidance_filing is not None:
                merge_newer_guidance(row, guidance_filing)
            metrics[ticker] = row
            updated += 1
            print(f"[{number}/{len(entries)}] {code}: 更新")
        except Exception as exc:
            errors += 1
            print(f"[{number}/{len(entries)}] {code}: {type(exc).__name__}: {exc}", file=sys.stderr)

    payload = {
        "schema_version": 2,
        "updated_at": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "source": "TDnet XBRL",
        "definitions": {
            "net_cash": "現金及び預金−有利子負債（リース負債・仕入債務を除く）",
            "net_cash_ratio": "ネットキャッシュ÷時価総額×100",
            "operating_cf": "キャッシュ・フロー計算書の営業活動によるキャッシュ・フロー（当期累計）",
            "free_cf": "営業CF−有形固定資産取得支出（当期累計）",
            "revenue": "決算短信XBRLの当期累計売上高・売上収益。銀行・保険・証券は対応する業種別収益",
            "eps": "決算短信XBRLの基本的1株当たり利益",
            "total_shares_issued": "期末発行済株式総数（自己株式を含む）",
            "treasury_stock_shares": "期末自己株式数",
            "shares_outstanding": "期末発行済株式総数−期末自己株式数",
            "forecast_values": "TDnet XBRLに開示された会社予想。市場コンセンサスではない",
            "metric_details": "各値の元XBRL concept・期間・単位・連結/単体等の追跡情報",
        },
        "metrics": metrics,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"完了: {updated}件更新、{errors}件エラー、保存先: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
