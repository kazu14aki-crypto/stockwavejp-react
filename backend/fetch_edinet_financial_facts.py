#!/usr/bin/env python3
"""EDINET API v2から上場会社のXBRL Factを欠落なく抽出し、履歴保存する。

保存対象は、書類一覧APIが返す全メタデータ、XBRLの全context、全unit、
contextRefを持つ全Fact（数値・文章・TextBlockを含む）である。各提出書類は
決定的gzip JSONとして保存し、再実行時も既存履歴を削除しない。
"""

from __future__ import annotations

import argparse
import gzip
import io
import json
import os
import re
import time
import zipfile
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

BASE_URL = "https://api.edinet-fsa.go.jp/api/v2"
ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "frontend" / "public" / "data" / "edinet_financial_facts"
DEFAULT_STOCK_INDEX = ROOT / "frontend" / "public" / "data" / "stock_index.json"
XBRLI = "http://www.xbrl.org/2003/instance"
XBRLDI = "http://xbrl.org/2006/xbrldi"
XSI = "http://www.w3.org/2001/XMLSchema-instance"
XML = "http://www.w3.org/XML/1998/namespace"
SCHEMA_VERSION = 1


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def normalize_security_code(value: Any) -> str:
    code = re.sub(r"\D", "", str(value or ""))
    if len(code) == 5 and code.endswith("0"):
        return code[:4]
    return code[:4] if len(code) >= 4 else code


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def namespace_uri(tag: str) -> str:
    return tag[1:].split("}", 1)[0] if tag.startswith("{") else ""


def make_session():
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry

    retry = Retry(
        total=5,
        connect=5,
        read=5,
        status=5,
        backoff_factor=1.0,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"GET"}),
        respect_retry_after_header=True,
    )
    session = requests.Session()
    session.headers.update({"User-Agent": "StockWaveJP-EDINET-Archive/1.0"})
    session.mount("https://", HTTPAdapter(max_retries=retry))
    return session


class EdinetClient:
    def __init__(self, api_key: str, request_interval: float = 0.2):
        if not api_key:
            raise ValueError("環境変数 EDINET_API_KEY が必要です")
        self.api_key = api_key
        self.request_interval = max(0.0, request_interval)
        self.session = make_session()

    def _get(self, path: str, params: dict[str, Any], timeout: int):
        query = {**params, "Subscription-Key": self.api_key}
        response = self.session.get(f"{BASE_URL}{path}", params=query, timeout=timeout)
        response.raise_for_status()
        if self.request_interval:
            time.sleep(self.request_interval)
        return response

    def documents(self, target_date: date) -> list[dict[str, Any]]:
        payload = self._get(
            "/documents.json", {"date": target_date.isoformat(), "type": 2}, 45
        ).json()
        metadata = payload.get("metadata") or {}
        if str(metadata.get("status", "200")) != "200":
            raise RuntimeError(
                f"EDINET API error: status={metadata.get('status')} "
                f"message={metadata.get('message', '')}"
            )
        return payload.get("results") or []

    def document_zip(self, doc_id: str) -> bytes:
        response = self._get(f"/documents/{doc_id}", {"type": 1}, 180)
        content = response.content
        if not zipfile.is_zipfile(io.BytesIO(content)):
            raise ValueError(f"{doc_id}: EDINET応答がZIPではありません")
        return content


def parse_namespace_map(xml_bytes: bytes) -> dict[str, str]:
    namespaces: dict[str, str] = {}
    for _, value in ET.iterparse(io.BytesIO(xml_bytes), events=("start-ns",)):
        prefix, uri = value
        namespaces[prefix or ""] = uri
    return dict(sorted(namespaces.items()))


def element_text(element: ET.Element) -> str:
    return "".join(element.itertext()).strip()


def parse_context(element: ET.Element) -> dict[str, Any]:
    identifier = element.find(f".//{{{XBRLI}}}identifier")
    instant = element.find(f".//{{{XBRLI}}}instant")
    start = element.find(f".//{{{XBRLI}}}startDate")
    end = element.find(f".//{{{XBRLI}}}endDate")
    forever = element.find(f".//{{{XBRLI}}}forever")
    dimensions: list[dict[str, Any]] = []
    for member in element.iter():
        kind = local_name(member.tag)
        if namespace_uri(member.tag) != XBRLDI or kind not in {"explicitMember", "typedMember"}:
            continue
        item: dict[str, Any] = {
            "kind": "explicit" if kind == "explicitMember" else "typed",
            "dimension": member.attrib.get("dimension", ""),
        }
        if kind == "explicitMember":
            item["member"] = element_text(member)
        else:
            item["value"] = element_text(member)
            item["xml"] = "".join(
                ET.tostring(child, encoding="unicode") for child in list(member)
            )
        dimensions.append(item)
    return {
        "entity": {
            "identifier": element_text(identifier) if identifier is not None else "",
            "scheme": identifier.attrib.get("scheme", "") if identifier is not None else "",
        },
        "period": {
            "instant": element_text(instant) if instant is not None else None,
            "start_date": element_text(start) if start is not None else None,
            "end_date": element_text(end) if end is not None else None,
            "forever": forever is not None,
        },
        "dimensions": dimensions,
    }


def parse_unit(element: ET.Element) -> dict[str, Any]:
    divide = element.find(f"{{{XBRLI}}}divide")
    if divide is None:
        return {
            "measures": [element_text(node) for node in element.findall(f"{{{XBRLI}}}measure")]
        }
    numerator = divide.find(f"{{{XBRLI}}}unitNumerator")
    denominator = divide.find(f"{{{XBRLI}}}unitDenominator")
    return {
        "numerator": [
            element_text(node)
            for node in (numerator.findall(f"{{{XBRLI}}}measure") if numerator is not None else [])
        ],
        "denominator": [
            element_text(node)
            for node in (denominator.findall(f"{{{XBRLI}}}measure") if denominator is not None else [])
        ],
    }


def normalized_number(value: str, scale: str | None, sign: str | None) -> str | None:
    cleaned = re.sub(r"[\s,，]", "", value)
    if not cleaned:
        return None
    try:
        number = Decimal(cleaned)
        if scale not in (None, ""):
            number *= Decimal(10) ** int(scale)
        if sign == "-":
            number = -abs(number)
        result = format(number, "f")
        return result.rstrip("0").rstrip(".") if "." in result else result
    except (InvalidOperation, ValueError, OverflowError):
        return None


def parse_xbrl(xml_bytes: bytes, source_file: str) -> dict[str, Any]:
    root = ET.fromstring(xml_bytes)
    contexts: dict[str, Any] = {}
    units: dict[str, Any] = {}
    facts: list[dict[str, Any]] = []

    for element in root.iter():
        namespace = namespace_uri(element.tag)
        name = local_name(element.tag)
        if namespace == XBRLI and name == "context":
            context_id = element.attrib.get("id")
            if context_id:
                contexts[context_id] = parse_context(element)
        elif namespace == XBRLI and name == "unit":
            unit_id = element.attrib.get("id")
            if unit_id:
                units[unit_id] = parse_unit(element)

        context_ref = element.attrib.get("contextRef")
        if not context_ref:
            continue
        raw_value = element_text(element)
        scale = element.attrib.get("scale")
        sign = element.attrib.get("sign")
        fact = {
            "concept": element.tag,
            "local_name": name,
            "namespace": namespace,
            "context_ref": context_ref,
            "unit_ref": element.attrib.get("unitRef"),
            "decimals": element.attrib.get("decimals"),
            "precision": element.attrib.get("precision"),
            "scale": scale,
            "sign": sign,
            "format": element.attrib.get("format"),
            "escape": element.attrib.get("escape"),
            "lang": element.attrib.get(f"{{{XML}}}lang"),
            "nil": element.attrib.get(f"{{{XSI}}}nil", "false").lower() in {"1", "true"},
            "value": raw_value,
            "numeric_value": normalized_number(raw_value, scale, sign)
            if element.attrib.get("unitRef")
            else None,
            "source_file": source_file,
        }
        extra_attributes = {
            key: value
            for key, value in element.attrib.items()
            if key
            not in {
                "contextRef", "unitRef", "decimals", "precision", "scale", "sign",
                "format", "escape", f"{{{XML}}}lang", f"{{{XSI}}}nil",
            }
        }
        if extra_attributes:
            fact["attributes"] = extra_attributes
        facts.append(fact)

    return {
        "namespaces": parse_namespace_map(xml_bytes),
        "contexts": contexts,
        "units": units,
        "facts": facts,
    }


def select_xbrl_files(archive: zipfile.ZipFile) -> list[str]:
    names = [name for name in archive.namelist() if name.lower().endswith(".xbrl")]
    public = [name for name in names if "/PublicDoc/" in f"/{name}"]
    return sorted(public or names)


def parse_document_zip(zip_bytes: bytes) -> tuple[list[dict[str, Any]], list[str]]:
    parsed: list[dict[str, Any]] = []
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archive:
        names = archive.namelist()
        for name in select_xbrl_files(archive):
            parsed.append({"file": name, **parse_xbrl(archive.read(name), name)})
    return parsed, names


def write_gzip_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(
        payload, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    with path.open("wb") as raw:
        with gzip.GzipFile(filename="", fileobj=raw, mode="wb", mtime=0) as compressed:
            compressed.write(encoded)


def read_index(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": SCHEMA_VERSION, "documents": []}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(payload.get("documents"), list):
            return payload
    except (OSError, json.JSONDecodeError):
        pass
    raise ValueError(f"既存index.jsonを読み込めません: {path}")


def write_index(path: Path, documents: list[dict[str, Any]], run: dict[str, Any]) -> None:
    documents.sort(key=lambda item: (item.get("submit_date_time") or "", item["doc_id"]), reverse=True)
    by_security_code: dict[str, list[str]] = {}
    for item in documents:
        by_security_code.setdefault(item["security_code"], []).append(item["doc_id"])
    payload = {
        "schema_version": SCHEMA_VERSION,
        "updated_at": utc_now(),
        "source": "EDINET API v2",
        "storage": "filings/{doc_id}.json.gz",
        "document_count": len(documents),
        "security_count": len(by_security_code),
        "last_run": run,
        "by_security_code": by_security_code,
        "documents": documents,
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def load_site_codes(path: Path) -> set[str]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return {normalize_security_code(key) for key in payload if normalize_security_code(key)}


def is_xbrl_document(document: dict[str, Any]) -> bool:
    flag = str(document.get("xbrlFlag", "")).strip().lower()
    return flag in {"1", "true"}


def process_document(
    client: EdinetClient,
    document: dict[str, Any],
    output_dir: Path,
    keep_source_zip: bool,
) -> dict[str, Any]:
    doc_id = str(document.get("docID") or "").strip()
    security_code = normalize_security_code(document.get("secCode"))
    if not doc_id or not security_code:
        raise ValueError("docIDまたはsecCodeがありません")

    zip_bytes = client.document_zip(doc_id)
    xbrl_documents, archive_files = parse_document_zip(zip_bytes)
    if not xbrl_documents:
        raise ValueError(f"{doc_id}: XBRLインスタンスがありません")

    fact_count = sum(len(item["facts"]) for item in xbrl_documents)
    context_count = sum(len(item["contexts"]) for item in xbrl_documents)
    unit_count = sum(len(item["units"]) for item in xbrl_documents)
    saved_at = utc_now()
    payload = {
        "schema_version": SCHEMA_VERSION,
        "saved_at": saved_at,
        "source": "EDINET API v2",
        "source_document": document,
        "security_code": security_code,
        "archive_files": archive_files,
        "xbrl_documents": xbrl_documents,
        "counts": {
            "xbrl_files": len(xbrl_documents),
            "facts": fact_count,
            "contexts": context_count,
            "units": unit_count,
        },
    }
    relative_path = Path("filings") / f"{doc_id}.json.gz"
    write_gzip_json(output_dir / relative_path, payload)
    if keep_source_zip:
        source_path = output_dir / "source_zips" / f"{doc_id}.zip"
        source_path.parent.mkdir(parents=True, exist_ok=True)
        source_path.write_bytes(zip_bytes)

    return {
        "doc_id": doc_id,
        "security_code": security_code,
        "filer_name": document.get("filerName"),
        "edinet_code": document.get("edinetCode"),
        "doc_type_code": document.get("docTypeCode"),
        "description": document.get("docDescription"),
        "submit_date_time": document.get("submitDateTime"),
        "period_start": document.get("periodStart"),
        "period_end": document.get("periodEnd"),
        "withdrawal_status": document.get("withdrawalStatus"),
        "disclosure_status": document.get("disclosureStatus"),
        "path": relative_path.as_posix(),
        "source_zip_path": f"source_zips/{doc_id}.zip" if keep_source_zip else None,
        "fact_count": fact_count,
        "context_count": context_count,
        "unit_count": unit_count,
        "saved_at": saved_at,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, default=10, help="本日を含む過去N日を走査")
    parser.add_argument("--backfill", type=int, default=0, help="--daysに代えて過去N日を走査")
    parser.add_argument("--tickers", default="", help="4桁銘柄コードをカンマ区切りで限定")
    parser.add_argument("--site", action="store_true", help="StockWaveJP収録銘柄のみに限定")
    parser.add_argument("--stock-index", type=Path, default=DEFAULT_STOCK_INDEX)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--keep-source-zip", action="store_true", help="EDINET原本ZIPも保存")
    parser.add_argument("--max-documents", type=int, default=0, help="検証用の処理件数上限")
    parser.add_argument("--request-interval", type=float, default=0.2)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    api_key = os.environ.get("EDINET_API_KEY", "").strip()
    if not api_key:
        print("エラー: 環境変数 EDINET_API_KEY が未設定です")
        return 2
    days = args.backfill if args.backfill > 0 else args.days
    if days <= 0:
        print("エラー: 取得日数は1以上にしてください")
        return 2

    ticker_filter = {
        normalize_security_code(value)
        for value in args.tickers.split(",")
        if normalize_security_code(value)
    }
    if args.site:
        site_codes = load_site_codes(args.stock_index.resolve())
        ticker_filter = ticker_filter & site_codes if ticker_filter else site_codes
        print(f"StockWaveJP収録銘柄に限定: {len(ticker_filter)}銘柄")

    output_dir = args.output_dir.resolve()
    index_path = output_dir / "index.json"
    existing_index = read_index(index_path)
    documents_by_id = {item["doc_id"]: item for item in existing_index.get("documents", [])}
    client = EdinetClient(api_key, args.request_interval)
    start = date.today() - timedelta(days=days - 1)
    processed = 0
    skipped_existing = 0
    candidates = 0
    errors: list[dict[str, str]] = []

    print(f"EDINET走査期間: {start.isoformat()} - {date.today().isoformat()}")
    stop = False
    for offset in range(days):
        target_date = date.today() - timedelta(days=offset)
        try:
            listed = client.documents(target_date)
        except Exception as exc:
            errors.append({"date": target_date.isoformat(), "error": str(exc)})
            print(f"{target_date}: 一覧取得失敗: {exc}")
            continue
        matched = []
        for document in listed:
            security_code = normalize_security_code(document.get("secCode"))
            if not security_code or not is_xbrl_document(document):
                continue
            if ticker_filter and security_code not in ticker_filter:
                continue
            matched.append(document)
        print(f"{target_date}: 全{len(listed)}件 / XBRL対象{len(matched)}件")
        candidates += len(matched)

        for document in matched:
            doc_id = str(document.get("docID") or "")
            target_path = output_dir / "filings" / f"{doc_id}.json.gz"
            if doc_id in documents_by_id and target_path.exists():
                skipped_existing += 1
                continue
            if args.max_documents and processed >= args.max_documents:
                stop = True
                break
            try:
                entry = process_document(client, document, output_dir, args.keep_source_zip)
                documents_by_id[doc_id] = entry
                processed += 1
                print(f"  保存: {doc_id} {entry['security_code']} facts={entry['fact_count']}")
            except Exception as exc:
                errors.append({"doc_id": doc_id, "error": str(exc)})
                print(f"  失敗: {doc_id}: {exc}")
        if stop:
            break

    run = {
        "started_for_date": date.today().isoformat(),
        "range_start": start.isoformat(),
        "range_end": date.today().isoformat(),
        "days": days,
        "site_only": bool(args.site),
        "ticker_filter_count": len(ticker_filter),
        "candidates": candidates,
        "processed": processed,
        "skipped_existing": skipped_existing,
        "error_count": len(errors),
        "errors": errors,
    }
    write_index(index_path, list(documents_by_id.values()), run)
    print(
        f"完了: 新規{processed}件 / 既存{skipped_existing}件 / "
        f"エラー{len(errors)}件 / 累計{len(documents_by_id)}件"
    )
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
