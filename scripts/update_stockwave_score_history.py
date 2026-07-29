#!/usr/bin/env python3
"""Append the current StockWave Score snapshot to public history JSON.

Reads frontend/public/data/market.json. Accurate historical scores require
constituent-level theme_detail data. Missing themes are skipped, never
backfilled with invented values.
"""
from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKET = ROOT / "frontend" / "public" / "data" / "market.json"
OUTPUT = ROOT / "frontend" / "public" / "data" / "stockwave_score_history.json"

def median(values):
    values=sorted(values)
    n=len(values)
    if not n: return None
    m=n//2
    return values[m] if n%2 else (values[m-1]+values[m])/2

def clamp(value, lo=0.0, hi=1.0):
    return min(hi,max(lo,value))

def calculate(stocks, theme_average=None):
    values=[]
    for stock in stocks or []:
        try:
            value=float(stock.get("pct"))
            values.append(value)
        except (TypeError,ValueError):
            pass
    if not values: return None
    breadth=sum(v>0 for v in values)/len(values)
    med=median(values)
    avg=float(theme_average) if theme_average is not None else sum(values)/len(values)
    absolute=sorted((abs(v) for v in values),reverse=True)
    total=sum(absolute)
    concentration=sum(absolute[:3])/total if total>0 else 1
    score=round(
        breadth*40
        + clamp((med+5)/10)*25
        + (1-clamp(concentration))*20
        + clamp((avg+5)/10)*15
    )
    return max(0,min(100,score))

def main():
    if not MARKET.exists():
        raise SystemExit(f"Missing {MARKET}")
    market=json.loads(MARKET.read_text(encoding="utf-8"))
    themes=(market.get("themes_1mo") or {}).get("themes") or []
    snapshot={}
    for theme in themes:
        name=theme.get("theme")
        detail=(market.get(f"theme_detail_{name}_1mo")
                or market.get(f"theme_detail_{name}_1d")
                or {})
        score=calculate(detail.get("stocks"), theme.get("pct"))
        if score is not None:
            snapshot[name]=score

    if not snapshot:
        print("No constituent-level scores available; history was not changed.")
        return

    history={"dates":[],"themes":{}}
    if OUTPUT.exists():
        try:
            history=json.loads(OUTPUT.read_text(encoding="utf-8"))
        except Exception:
            pass
    today=datetime.now(timezone.utc).astimezone().date().isoformat()
    dates=history.setdefault("dates",[])
    theme_map=history.setdefault("themes",{})

    if today in dates:
        index=dates.index(today)
    else:
        dates.append(today)
        index=len(dates)-1
        for values in theme_map.values():
            while len(values)<len(dates):
                values.append(None)

    for name,score in snapshot.items():
        values=theme_map.setdefault(name,[None]*len(dates))
        while len(values)<len(dates):
            values.append(None)
        values[index]=score

    # Keep roughly two years of daily snapshots.
    if len(dates)>520:
        cut=len(dates)-520
        history["dates"]=dates[cut:]
        for name,values in list(theme_map.items()):
            theme_map[name]=values[cut:]

    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    OUTPUT.write_text(json.dumps(history,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Saved {len(snapshot)} scores for {today}")

if __name__=="__main__":
    main()
