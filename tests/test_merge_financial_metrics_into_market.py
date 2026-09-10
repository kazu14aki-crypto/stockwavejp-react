import unittest

from scripts.merge_financial_metrics_into_market import fields_for_row, merge_node


class MergeFinancialMetricsIntoMarketTests(unittest.TestCase):
    def test_fields_include_earnings_guidance_shares_and_provenance(self):
        metric = {
            "net_cash": 200,
            "eps": 12.3,
            "revenue": 1_000,
            "forecast_eps": 15.0,
            "total_shares_issued": 100,
            "filing_title": "決算短信",
            "disclosed_at": "2026-09-10 15:00:00",
            "source_url": "https://example.test/filing.zip",
        }

        fields = fields_for_row(metric, 1_000)

        self.assertEqual(fields["net_cash_ratio"], 20.0)
        self.assertEqual(fields["eps"], 12.3)
        self.assertEqual(fields["revenue"], 1_000)
        self.assertEqual(fields["forecast_eps"], 15.0)
        self.assertEqual(fields["total_shares_issued"], 100)
        self.assertEqual(fields["financial_filing_title"], "決算短信")
        self.assertEqual(fields["financial_source_url"], "https://example.test/filing.zip")

    def test_merge_updates_all_nested_rows_for_matching_ticker(self):
        market = {
            "theme": {"stocks": [{"ticker": "7203.T", "market_cap": 2_000}]},
            "segment": {"stocks": [{"ticker": "7203.T", "market_cap": 2_000}]},
        }
        metrics = {"7203.T": {"net_cash": 100, "eps": 20.0}}
        stats = {"rows": 0, "tickers": set()}

        merge_node(market, metrics, stats)

        self.assertEqual(stats["rows"], 2)
        self.assertEqual(stats["tickers"], {"7203.T"})
        self.assertEqual(market["theme"]["stocks"][0]["eps"], 20.0)
        self.assertEqual(market["segment"]["stocks"][0]["net_cash_ratio"], 5.0)


if __name__ == "__main__":
    unittest.main()
