import gzip
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).parents[1] / "backend" / "fetch_edinet_financial_facts.py"
SPEC = importlib.util.spec_from_file_location("fetch_edinet_financial_facts", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(MODULE)


SAMPLE_XBRL = '''<?xml version="1.0" encoding="UTF-8"?>
<xbrli:xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance"
 xmlns:xbrldi="http://xbrl.org/2006/xbrldi"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xmlns:iso4217="http://www.xbrl.org/2003/iso4217"
 xmlns:jpcrp="http://example.com/jpcrp">
 <xbrli:context id="CurrentYearConsolidatedDuration">
  <xbrli:entity><xbrli:identifier scheme="http://disclosure.edinet-fsa.go.jp">E00001</xbrli:identifier>
   <xbrli:segment><xbrldi:explicitMember dimension="jpcrp:ConsolidatedOrNonConsolidatedAxis">jpcrp:ConsolidatedMember</xbrldi:explicitMember></xbrli:segment>
  </xbrli:entity>
  <xbrli:period><xbrli:startDate>2025-04-01</xbrli:startDate><xbrli:endDate>2026-03-31</xbrli:endDate></xbrli:period>
 </xbrli:context>
 <xbrli:unit id="JPY"><xbrli:measure>iso4217:JPY</xbrli:measure></xbrli:unit>
 <jpcrp:Revenue contextRef="CurrentYearConsolidatedDuration" unitRef="JPY" decimals="-6" scale="3">1,234</jpcrp:Revenue>
 <jpcrp:BusinessTextBlock contextRef="CurrentYearConsolidatedDuration" xml:lang="ja">説明文</jpcrp:BusinessTextBlock>
</xbrli:xbrl>'''.encode("utf-8")


class FinancialFactsTest(unittest.TestCase):
    def test_parse_all_fact_types_and_context(self):
        parsed = MODULE.parse_xbrl(SAMPLE_XBRL, "PublicDoc/sample.xbrl")
        self.assertEqual(len(parsed["facts"]), 2)
        revenue = parsed["facts"][0]
        self.assertEqual(revenue["local_name"], "Revenue")
        self.assertEqual(revenue["value"], "1,234")
        self.assertEqual(revenue["numeric_value"], "1234000")
        self.assertEqual(parsed["units"]["JPY"]["measures"], ["iso4217:JPY"])
        context = parsed["contexts"]["CurrentYearConsolidatedDuration"]
        self.assertEqual(context["period"]["start_date"], "2025-04-01")
        self.assertEqual(context["dimensions"][0]["member"], "jpcrp:ConsolidatedMember")

    def test_gzip_output_is_reproducible(self):
        with tempfile.TemporaryDirectory() as tmp:
            first = Path(tmp) / "first.json.gz"
            second = Path(tmp) / "second.json.gz"
            payload = {"日本語": "保存", "facts": [2, 1]}
            MODULE.write_gzip_json(first, payload)
            MODULE.write_gzip_json(second, payload)
            self.assertEqual(first.read_bytes(), second.read_bytes())
            with gzip.open(first, "rt", encoding="utf-8") as handle:
                self.assertEqual(json.load(handle), payload)


if __name__ == "__main__":
    unittest.main()
