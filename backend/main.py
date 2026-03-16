"""
main.py — FastAPI メインサーバー v2.1
"""
from fastapi import FastAPI, Query
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import pytz

from themes import DEFAULT_THEMES
from data import (
    fetch_theme_results, fetch_theme_trend, fetch_momentum_data,
    fetch_heatmap_data, fetch_monthly_heatmap, fetch_macro_data,
    fetch_market_segments, fetch_segment_detail, fetch_theme_detail,
    MARKET_SEGMENTS, SEGMENT_GROUPS, warmup_cache_extended,
)

app = FastAPI(title="StockWaveJP API", version="2.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    warmup_cache_extended(DEFAULT_THEMES)


@app.get("/")
def root():
    return {"status": "ok", "app": "StockWaveJP API", "version": "2.1.0"}


@app.head("/api/status")
def head_status():
    return Response()


@app.get("/api/status")
def get_status():
    jst = pytz.timezone("Asia/Tokyo")
    now = datetime.now(jst)
    h, m = now.hour, now.minute
    is_open = now.weekday() < 5 and (
        (h == 9 and m >= 0) or (10 <= h <= 14) or (h == 15 and m == 0)
    )
    return {
        "time":    now.strftime("%H:%M JST"),
        "date":    now.strftime("%Y/%m/%d"),
        "is_open": is_open,
        "label":   "open" if is_open else "closed",
    }


@app.get("/api/themes")
def get_themes(period: str = Query(default="1mo")):
    results = fetch_theme_results(DEFAULT_THEMES, period)
    rise = sum(1 for r in results if r["up"])
    fall = len(results) - rise
    avg  = round(sum(r["pct"] for r in results) / len(results), 2) if results else 0
    return {
        "period": period,
        "themes": results,
        "summary": {
            "total": len(results), "rise": rise, "fall": fall, "avg": avg,
            "top": results[0]  if results else None,
            "bot": results[-1] if results else None,
        }
    }


@app.get("/api/theme-names")
def get_theme_names():
    return {"themes": list(DEFAULT_THEMES.keys())}


@app.get("/api/momentum")
def get_momentum(period: str = Query(default="1mo")):
    return {"period": period, "data": fetch_momentum_data(DEFAULT_THEMES, period)}


@app.get("/api/fund-flow")
def get_fund_flow(period: str = Query(default="1mo")):
    results = fetch_theme_results(DEFAULT_THEMES, period)
    return {
        "period":  period,
        "gainers": results[:10],
        "losers":  list(reversed(results[-10:])),
        "all":     results,
    }


@app.get("/api/trend/{theme_name}")
def get_trend(theme_name: str, period: str = Query(default="1y")):
    return {
        "theme":  theme_name,
        "period": period,
        "data":   fetch_theme_trend(DEFAULT_THEMES, theme_name, period),
    }


@app.get("/api/trends")
def get_trends(themes: str = Query(default=""), period: str = Query(default="1y")):
    theme_list = [t.strip() for t in themes.split(",") if t.strip()] if themes else list(DEFAULT_THEMES.keys())
    return {
        "period": period,
        "trends": {t: fetch_theme_trend(DEFAULT_THEMES, t, period) for t in theme_list},
    }


@app.get("/api/heatmap")
def get_heatmap():
    return {"data": fetch_heatmap_data(DEFAULT_THEMES)}


@app.get("/api/heatmap/monthly")
def get_monthly_heatmap():
    data, months = fetch_monthly_heatmap(DEFAULT_THEMES)
    return {"data": data, "months": months}


@app.get("/api/macro")
def get_macro(period: str = Query(default="1y")):
    return {"period": period, "data": fetch_macro_data(period)}


@app.get("/api/market-rank")
def get_market_rank(period: str = Query(default="1mo")):
    data = fetch_market_segments(period)
    return {"period": period, "data": data, "groups": SEGMENT_GROUPS}


@app.get("/api/market-rank/{seg_name}")
def get_segment_detail(seg_name: str, period: str = Query(default="1mo")):
    return {
        "period":   period,
        "segment":  seg_name,
        "data":     fetch_segment_detail(seg_name, period),
    }


@app.get("/api/theme-detail/{theme_name}")
def get_theme_detail(theme_name: str, period: str = Query(default="1mo")):
    return {
        "period": period,
        "data":   fetch_theme_detail(DEFAULT_THEMES, theme_name, period),
    }


@app.get("/api/stock-info/{ticker}")
def get_stock_info(ticker: str):
    """銘柄情報取得（カスタムテーマ用）"""
    try:
        import yfinance as yf
        t    = yf.Ticker(ticker)
        info = t.info
        hist = t.history(period="2d", interval="1d", auto_adjust=True)
        price = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
        name  = (info.get("longName") or info.get("shortName") or
                 info.get("displayName") or ticker)
        return {"ticker": ticker, "name": name, "price": price}
    except Exception as e:
        return {"ticker": ticker, "name": None, "price": None, "error": str(e)}


@app.get("/api/stock-search")
def search_stocks(q: str = Query(default="")):
    """銘柄名または証券コードで検索（カスタムテーマ用）"""
    if not q.strip():
        return {"results": []}
    try:
        import yfinance as yf
        q = q.strip()
        results = []

        # 4桁数字 → 日本株
        if q.isdigit() and len(q) == 4:
            ticker = q + ".T"
            try:
                t    = yf.Ticker(ticker)
                info = t.info
                hist = t.history(period="2d", interval="1d", auto_adjust=True)
                price = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
                name  = info.get("longName") or info.get("shortName") or ticker
                if name and name != ticker:
                    results.append({"ticker": ticker, "name": name, "price": price})
            except Exception:
                pass
        else:
            # 銘柄名で検索
            try:
                search = yf.Search(q, max_results=8)
                for item in (search.quotes or []):
                    sym  = item.get("symbol", "")
                    name = item.get("longname") or item.get("shortname") or sym
                    if sym and name:
                        results.append({
                            "ticker":   sym,
                            "name":     name,
                            "exchange": item.get("exchange", ""),
                            "price":    None,
                        })
            except Exception:
                pass

        return {"results": results[:8]}
    except Exception as e:
        return {"results": [], "error": str(e)}
