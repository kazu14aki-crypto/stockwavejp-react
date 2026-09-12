import importlib.util
from datetime import date
from decimal import Decimal
from pathlib import Path
from types import SimpleNamespace
import gzip
import json


MODULE_PATH = Path(__file__).parents[1] / "scripts" / "fetch_tdnet_financial_history.py"
SPEC = importlib.util.spec_from_file_location("fetch_tdnet_financial_history", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


def test_month_ranges_split_long_period() -> None:
    assert list(MODULE.month_ranges(date(2024, 9, 11), date(2024, 11, 2))) == [
        (date(2024, 9, 11), date(2024, 9, 30)),
        (date(2024, 10, 1), date(2024, 10, 31)),
        (date(2024, 11, 1), date(2024, 11, 2)),
    ]


def test_filing_filter_and_doc_id() -> None:
    row = {
        "title": "2026年3月期 決算短信〔日本基準〕（連結）",
        "url_xbrl": "https://www.release.tdnet.info/inbs/081220260501123456.zip",
    }
    assert MODULE.is_earnings_filing(row)
    assert MODULE.doc_id_from_row(row) == "081220260501123456"
    assert MODULE.security_code("72030") == "7203"
    assert MODULE.security_code("138A0") == "138A"
    assert MODULE.security_code("138A.T") == "138A"


def test_fact_payload_preserves_decimal_as_text() -> None:
    item = SimpleNamespace(
        concept="jppfs_cor:NetSales",
        namespace_uri="urn:test",
        local_name="NetSales",
        label_ja=SimpleNamespace(text="売上高"),
        label_en=SimpleNamespace(text="Net sales"),
        value=Decimal("12345678901234567890"),
        unit_ref="JPY",
        decimals=-6,
        context_id="CurrentYearDuration",
        period=None,
        entity_id="72030",
        dimensions=(),
        is_nil=False,
        source_line=42,
        order=1,
    )
    payload = MODULE.fact_payload(item)
    assert payload["value"] == "12345678901234567890"
    assert payload["value_type"] == "decimal"
    assert payload["label_ja"] == "売上高"


def test_prune_rejects_limit(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(
        "sys.argv",
        ["fetch_tdnet_financial_history.py", "--prune", "--limit", "1", "--output-dir", str(tmp_path)],
    )
    try:
        MODULE.main()
    except SystemExit as exc:
        assert str(exc) == "--prune と --limit は併用できません"
    else:
        raise AssertionError("--prune と --limit の併用を拒否する必要があります")


def test_refresh_stored_metadata_corrects_alphanumeric_code(tmp_path) -> None:
    path = tmp_path / "filings" / "0812.json.gz"
    MODULE.write_gzip_json(path, {
        "source": "TDnet XBRL",
        "source_document": {
            "doc_id": "0812",
            "security_code": "1860",
            "source_url": "https://www2.jpx.co.jp/disc/186A0/0812.zip",
            "fact_count": 1,
        },
        "facts": [{"value": "1"}],
    })
    row = {
        "company_code": "186A0",
        "company_name": "アストロスケール",
        "title": "決算短信",
        "pubdate": "2026-09-11 16:00:00",
        "document_url": "https://example.test/0812.zip",
        "url_xbrl": "https://example.test/0812.zip",
        "markets_string": "東証グロース",
    }
    metadata = MODULE.refresh_stored_metadata(path, row)
    assert metadata["security_code"] == "186A"
    with gzip.open(path, "rt", encoding="utf-8") as source:
        stored = json.load(source)
    assert stored["source_document"]["security_code"] == "186A"
