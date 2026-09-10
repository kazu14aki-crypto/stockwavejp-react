import importlib.util
import sys
import unittest
from unittest import mock
from decimal import Decimal
from pathlib import Path
from types import SimpleNamespace


MODULE_PATH = Path(__file__).parents[1] / "scripts" / "update_tdnet_financial_metrics.py"
SPEC = importlib.util.spec_from_file_location("update_tdnet_financial_metrics", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(MODULE)


class FinancialMetricsHelpersTest(unittest.TestCase):
    def test_extracted_detail_preserves_fact_provenance(self):
        item = SimpleNamespace(
            local_name="NetIncomePerShare",
            namespace_uri="http://example.test/tse-ed-t",
            unit_ref="JPYPerShare",
            decimals="2",
            period=SimpleNamespace(start_date="2026-04-01", end_date="2026-06-30"),
            dimensions=(SimpleNamespace(dimension="ResultForecastAxis", member="ResultMember"),),
        )
        extracted = SimpleNamespace(
            value=Decimal("123.45"),
            canonical_key="eps",
            mapper_name="summary_mapper",
            item=item,
        )
        detail = MODULE.extracted_detail({"eps": extracted}, "eps")
        self.assertEqual(detail["value"], 123.45)
        self.assertEqual(detail["concept"], "NetIncomePerShare")
        self.assertEqual(detail["period"]["end_date"], "2026-06-30")
        self.assertEqual(detail["dimensions"][0]["member"], "ResultMember")

    def test_first_metric_uses_industry_revenue_fallback(self):
        extracted = SimpleNamespace(value=Decimal("987000000"), item=None)
        value, label, detail = MODULE.first_metric(
            {"ordinary_revenue_banking": extracted},
            [("revenue", "売上高"), ("ordinary_revenue_banking", "銀行業の経常収益")],
        )
        self.assertEqual(value, 987000000)
        self.assertEqual(label, "銀行業の経常収益")
        self.assertEqual(detail["value"], 987000000)

    def test_newer_guidance_replaces_only_disclosed_fields(self):
        keys = SimpleNamespace(
            FORECAST_REVENUE="forecast_revenue",
            FORECAST_OPERATING_INCOME="forecast_operating_income",
            FORECAST_ORDINARY_INCOME="forecast_ordinary_income",
            FORECAST_NET_INCOME_PARENT="forecast_net_income_parent",
            FORECAST_EPS="forecast_eps",
            FORECAST_DPS="forecast_dps",
        )
        eps = SimpleNamespace(value=Decimal("150.25"), item=None)
        fake_tdnet = SimpleNamespace(
            CK=keys,
            parse_zip=lambda _: object(),
            extract_values=lambda _statements, _keys: {"forecast_eps": eps},
        )
        filing = SimpleNamespace(
            pubdate="2026-09-01 15:00:00",
            title="通期業績予想の修正",
            fetch_xbrl=lambda: SimpleNamespace(data=b"zip", source_url="https://example.test/revision.zip"),
        )
        row = {
            "forecast_revenue": 1000,
            "forecast_eps": 100.0,
            "guidance": {"revenue": 1000, "eps": 100.0},
            "guidance_field_sources": {},
            "metric_details": {},
        }
        with mock.patch.dict(sys.modules, {"tdnet": fake_tdnet}):
            MODULE.merge_newer_guidance(row, filing)
        self.assertEqual(row["forecast_revenue"], 1000)
        self.assertEqual(row["forecast_eps"], 150.25)
        self.assertEqual(row["guidance_status"], "revised_company_forecast")
        self.assertEqual(row["guidance_field_sources"]["eps"]["filing_title"], "通期業績予想の修正")


if __name__ == "__main__":
    unittest.main()
