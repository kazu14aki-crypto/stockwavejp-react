
# ── EDINET Large Shareholding Proxy ───────────────────────────
# main_en.py に追加するエンドポイント
# EDINET APIはCORSヘッダーがないのでバックエンドがプロキシする

import httpx
from fastapi import Query as QParam

@app.get("/api/edinet/large-holdings")
async def edinet_large_holdings(q: str = QParam(""), days: int = 60):
    """
    EDINETの大量保有報告書を検索する
    CORSの問題を回避するためバックエンド経由でアクセス
    """
    EDINET_BASE = "https://disclosure2.edinet-fsa.go.jp/api/v2"
    results = []
    today = __import__('datetime').date.today()
    
    async with httpx.AsyncClient(timeout=20.0) as client:
        for i in range(min(days, 30)):
            target_date = (today - __import__('datetime').timedelta(days=i)).isoformat()
            try:
                res = await client.get(f"{EDINET_BASE}/documents.json?date={target_date}&type=2")
                if not res.is_success:
                    continue
                data = res.json()
                docs = data.get("results", [])
                for doc in docs:
                    if doc.get("docTypeCode") not in ["28", "29", "30"]:
                        continue
                    # Filter by query
                    q_lower = q.lower()
                    matches = (
                        not q or
                        q_lower in (doc.get("issuerName") or "").lower() or
                        q_lower in (doc.get("secCode") or "").lower() or
                        q_lower in (doc.get("filerName") or "").lower()
                    )
                    if matches:
                        results.append({
                            "docID":          doc.get("docID"),
                            "submitDate":     target_date,
                            "submitDateTime": doc.get("submitDateTime"),
                            "issuerName":     doc.get("issuerName"),
                            "secCode":        doc.get("secCode"),
                            "filerName":      doc.get("filerName"),
                            "docTypeCode":    doc.get("docTypeCode"),
                            "holdingRatio":   doc.get("otherExplanatoryStatement"),
                        })
                if len(results) >= 50:
                    break
            except Exception:
                continue
    
    return {"results": results, "query": q, "count": len(results)}
