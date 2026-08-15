"""TDnetの決算短信XBRLから、銘柄画面用の財務指標を更新する。

出力は frontend/public/data/financial_metrics.json。金額は円、CFは当期累計。
FCFは営業CF - 有形固定資産取得支出とし、取得支出をXBRLから確認できない
開示では値を作らない。TDnet取得元URLと開示日時も各レコードに残す。
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
    keys = [CK.CASH_AND_DEPOSITS, CK.OPERATING_CF, CK.PURCHASE_PPE_CF]
    values = extract_values(statements, keys, period="current", consolidated=True)
    # 非連結決算短信では連結指定で取れないため、同じ一次資料を個別値として読む。
    if not any(get_value(values, key) is not None for key in keys):
        values = extract_values(statements, keys, period="current", consolidated=False)

    fallback_cash, cash_instant = current_instant_value(statements, CASH_LOCAL_NAMES)
    cash = get_value(values, CK.CASH_AND_DEPOSITS) or fallback_cash
    debt = interest_bearing_debt(statements, cash_instant)
    operating_cf = get_value(values, CK.OPERATING_CF)
    purchase_ppe_cf = get_value(values, CK.PURCHASE_PPE_CF)
    net_cash = cash - debt if cash is not None and debt is not None else None
    # 支出は通常マイナス。正数で返るタクソノミーでも同じ定義にする。
    free_cf = None
    if operating_cf is not None and purchase_ppe_cf is not None:
        free_cf = operating_cf + purchase_ppe_cf if purchase_ppe_cf <= 0 else operating_cf - purchase_ppe_cf

    # 少なくとも依頼された4項目のいずれかが確認できた場合のみ公開データに残す。
    if all(value is None for value in (net_cash, operating_cf, free_cf)):
        return None
    return {
        "net_cash": json_value(net_cash),
        "net_cash_ratio": round(net_cash / market_cap * 100, 2) if net_cash is not None and market_cap else None,
        "operating_cf": json_value(operating_cf),
        "free_cf": json_value(free_cf),
        "cash_and_deposits": json_value(cash),
        "interest_bearing_debt": json_value(debt),
        "period_type": "当期累計",
        "fcf_definition": "営業CF−有形固定資産取得支出",
        "disclosed_at": str(getattr(filing, "pubdate", "")),
        "filing_title": str(getattr(filing, "title", "")),
        "source": "TDnet XBRL",
        "source_url": str(getattr(downloaded, "source_url", "")),
    }


def latest_earnings_filing(code: str) -> Any | None:
    import tdnet

    # 開示一覧は公開APIを優先し、利用不能時はTDnetの公開一覧へフォールバックする。
    # 財務数値そのものは、各FilingのTDnet XBRL ZIPからのみ抽出する。
    filings = tdnet.documents(code=int(code), has_xbrl=True, limit=12)
    for filing in filings:
        title = str(getattr(filing, "title", ""))
        if "決算短信" in title:
            return filing
    return None


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
    args = parser.parse_args()

    stock_index = load_json(INDEX_PATH, {})
    existing = load_json(OUTPUT_PATH, {})
    metrics = dict(existing.get("metrics", {}))
    requested = {str(code).zfill(4) for code in args.codes} if args.codes else None
    entries = []
    for ticker, stock in stock_index.items():
        code = str(ticker).replace(".T", "")
        if len(code) != 4 or not code.isdigit() or (requested and code not in requested):
            continue
        entries.append((ticker, code, stock.get("market_cap")))
    if args.limit:
        entries = entries[: args.limit]
    if not entries:
        print("更新対象の証券コードがありません。")
        return 0

    updated = errors = 0
    for number, (ticker, code, market_cap) in enumerate(entries, 1):
        try:
            filing = latest_earnings_filing(code)
            if filing is None:
                print(f"[{number}/{len(entries)}] {code}: XBRL付き決算短信なし")
                continue
            row = metric_row(filing, market_cap)
            if row is None:
                print(f"[{number}/{len(entries)}] {code}: 対象科目なし")
                continue
            metrics[ticker] = row
            updated += 1
            print(f"[{number}/{len(entries)}] {code}: 更新")
        except Exception as exc:
            errors += 1
            print(f"[{number}/{len(entries)}] {code}: {type(exc).__name__}: {exc}", file=sys.stderr)

    payload = {
        "updated_at": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "source": "TDnet XBRL",
        "definitions": {
            "net_cash": "現金及び預金−有利子負債（リース負債・仕入債務を除く）",
            "net_cash_ratio": "ネットキャッシュ÷時価総額×100",
            "operating_cf": "キャッシュ・フロー計算書の営業活動によるキャッシュ・フロー（当期累計）",
            "free_cf": "営業CF−有形固定資産取得支出（当期累計）",
        },
        "metrics": metrics,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"完了: {updated}件更新、{errors}件エラー、保存先: {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
