"""
main_en.py — FastAPI English Edition
"""
from fastapi import FastAPI, Query
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import pytz

from themes import DEFAULT_THEMES
from themes_en import (
    translate_themes_dict, translate_theme, translate_stock,
    EXTRA_THEMES_EN, THEME_NAME_EN,
)
from data import (
    fetch_theme_results, fetch_theme_trend, fetch_momentum_data,
    fetch_heatmap_data, fetch_monthly_heatmap, fetch_macro_data,
    fetch_market_segments, fetch_segment_detail, fetch_theme_detail,
    MARKET_SEGMENTS, SEGMENT_GROUPS, warmup_cache_extended,
)

app = FastAPI(title="StockWaveJP API (English)", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

THEMES_EN = {**translate_themes_dict(DEFAULT_THEMES), **EXTRA_THEMES_EN}

# Macro indicator name translation
MACRO_NAME_EN = {
    "\u65e5\u7d4c\u5e73\u5747": "Nikkei 225",
    "TOPIX":      "TOPIX",
    "S&P500":     "S&P500",
    "\u30c9\u30eb\u5186": "USD/JPY",
    "\u30ca\u30b9\u30c0\u30c3\u30af": "Nasdaq",
    "VIX":        "VIX",
}

# Market segment name translation
# Keys verified with exact unicode from data.py
SEGMENT_NAME_EN = {
    "\u65e5\u7d4c225\uff5c\u6280\u8853\u30fb\u96fb\u6c17\u6a5f\u5668": "Nikkei225 | Tech & Electronics",
    "\u65e5\u7d4c225\uff5c\u7d20\u6750\u30fb\u5316\u5b66":             "Nikkei225 | Materials & Chemicals",
    "\u65e5\u7d4c225\uff5c\u8cc7\u672c\u8ca1\u30fb\u6a5f\u68b0":       "Nikkei225 | Capital Goods & Machinery",
    "\u65e5\u7d4c225\uff5c\u6d88\u8cbb\u30fb\u30b5\u30fc\u30d3\u30b9": "Nikkei225 | Consumer & Services",
    "\u65e5\u7d4c225\uff5c\u91d1\u878d":                               "Nikkei225 | Financials",
    "\u65e5\u7d4c225\uff5c\u904b\u8f38\u30fb\u901a\u4fe1":             "Nikkei225 | Transport & Telecom",
    "TOPIX\uff5cCore30\uff08\u6642\u4fa1\u7dcf\u984d\u6700\u4e0a\u4f4d\uff09": "TOPIX | Core30",
    "TOPIX\uff5cLarge70\uff08\u5927\u578b\u682a\uff09":                "TOPIX | Large70",
    "\u30d7\u30e9\u30a4\u30e0\u5e02\u5834\uff08\u4e3b\u8981\u9298\u67c4\uff09":     "Prime Market",
    "\u30b9\u30bf\u30f3\u30c0\u30fc\u30c9\u5e02\u5834\uff08\u6ce8\u76ee\u9298\u67c4\uff09": "Standard Market",
    "\u30b0\u30ed\u30fc\u30b9\u5e02\u5834\uff08\u6ce8\u76ee\u9298\u67c4\uff09":     "Growth Market",
}

# Reverse lookup
SEGMENT_NAME_JA = {v: k for k, v in SEGMENT_NAME_EN.items()}

def _jp_result_to_en(result: dict) -> dict:
    r = result.copy()
    if "theme" in r:
        r["theme"] = translate_theme(r["theme"])
    if "stocks" in r:
        r["stocks"] = [
            {**s, "name": translate_stock(s.get("name", s.get("ticker", "")))}
            for s in r["stocks"]
        ]
    return r


@app.on_event("startup")
async def startup_event():
    warmup_cache_extended(DEFAULT_THEMES)
    warmup_cache_extended(EXTRA_THEMES_EN)


@app.get("/")
def root():
    return {"status": "ok", "app": "StockWaveJP API (English)", "version": "1.0.0"}


@app.head("/api/status")
def head_status():
    return Response()


@app.get("/api/status")
def get_status():
    jst = pytz.timezone("Asia/Tokyo")
    est = pytz.timezone("America/New_York")
    now_jst = datetime.now(jst)
    now_est = datetime.now(est)
    h, m = now_jst.hour, now_jst.minute
    is_open = now_jst.weekday() < 5 and (
        (h == 9 and m >= 0) or (10 <= h <= 14) or (h == 15 and m == 0)
    )
    try:
        import yfinance as yf
        rate_df = yf.Ticker("JPY=X").history(period="1d", interval="1m", auto_adjust=True)
        usd_jpy = round(float(rate_df["Close"].iloc[-1]), 2) if len(rate_df) > 0 else None
    except Exception:
        usd_jpy = None
    return {
        "time_jst": now_jst.strftime("%H:%M JST"),
        "time_est": now_est.strftime("%H:%M EST"),
        "date":     now_jst.strftime("%Y/%m/%d"),
        "is_open":  is_open,
        "label":    "Market Open" if is_open else "Market Closed",
        "usd_jpy":  usd_jpy,
    }


@app.get("/api/themes")
def get_themes(period: str = Query(default="1mo")):
    results_ja = fetch_theme_results(DEFAULT_THEMES, period)
    results_en = [{**r, "theme": translate_theme(r["theme"])} for r in results_ja]
    extra_results = fetch_theme_results(EXTRA_THEMES_EN, period)
    results_en.extend(extra_results)
    results_en.sort(key=lambda x: x["pct"], reverse=True)
    rise = sum(1 for r in results_en if r["up"])
    fall = len(results_en) - rise
    avg  = round(sum(r["pct"] for r in results_en) / len(results_en), 2) if results_en else 0
    return {
        "period": period,
        "themes": results_en,
        "summary": {
            "total": len(results_en), "rise": rise, "fall": fall, "avg": avg,
            "top": results_en[0]  if results_en else None,
            "bot": results_en[-1] if results_en else None,
        }
    }


@app.get("/api/theme-names")
def get_theme_names():
    names_en = [translate_theme(t) for t in DEFAULT_THEMES.keys()]
    names_en += list(EXTRA_THEMES_EN.keys())
    return {"themes": names_en}


@app.get("/api/momentum")
def get_momentum(period: str = Query(default="1mo")):
    data = fetch_momentum_data(DEFAULT_THEMES, period)
    data_en = [{**d, "theme": translate_theme(d["theme"])} for d in data]
    return {"period": period, "data": data_en}


@app.get("/api/fund-flow")
def get_fund_flow(period: str = Query(default="1mo")):
    results_ja = fetch_theme_results(DEFAULT_THEMES, period)
    results_en = [{**r, "theme": translate_theme(r["theme"])} for r in results_ja]
    return {
        "period":  period,
        "gainers": results_en[:10],
        "losers":  list(reversed(results_en[-10:])),
        "all":     results_en,
    }


@app.get("/api/trends")
def get_trends(themes: str = Query(default=""), period: str = Query(default="1y")):
    theme_list = [t.strip() for t in themes.split(",") if t.strip()] if themes else []
    if not theme_list:
        theme_list = [translate_theme(t) for t in DEFAULT_THEMES.keys()]
    result = {}
    for theme_en in theme_list:
        ja_name = next((k for k, v in THEME_NAME_EN.items() if v == theme_en), None)
        if ja_name:
            data = fetch_theme_trend(DEFAULT_THEMES, ja_name, period)
        elif theme_en in EXTRA_THEMES_EN:
            data = fetch_theme_trend(EXTRA_THEMES_EN, theme_en, period)
        else:
            data = []
        result[theme_en] = data
    return {"period": period, "trends": result}


@app.get("/api/trend/{theme_name}")
def get_trend(theme_name: str, period: str = Query(default="1y")):
    ja_name = next((k for k, v in THEME_NAME_EN.items() if v == theme_name), theme_name)
    themes_to_use = EXTRA_THEMES_EN if theme_name in EXTRA_THEMES_EN else DEFAULT_THEMES
    name_to_use   = theme_name if theme_name in EXTRA_THEMES_EN else ja_name
    data = fetch_theme_trend(themes_to_use, name_to_use, period)
    return {"theme": theme_name, "period": period, "data": data}


@app.get("/api/heatmap")
def get_heatmap():
    data_ja = fetch_heatmap_data(DEFAULT_THEMES)
    data_en = {translate_theme(k): v for k, v in data_ja.items()}
    return {"data": data_en}


@app.get("/api/heatmap/monthly")
def get_monthly_heatmap():
    data_ja, months = fetch_monthly_heatmap(DEFAULT_THEMES)
    data_en = {translate_theme(k): v for k, v in data_ja.items()}
    return {"data": data_en, "months": months}


@app.get("/api/macro")
def get_macro(period: str = Query(default="1y")):
    data_ja = fetch_macro_data(period)
    data_en = {MACRO_NAME_EN.get(k, k): v for k, v in data_ja.items()}
    return {"period": period, "data": data_en}


@app.get("/api/market-rank")
def get_market_rank(period: str = Query(default="1mo")):
    data_ja = fetch_market_segments(period)
    data_en = {SEGMENT_NAME_EN.get(k, k): v for k, v in data_ja.items()}
    groups_en = {
        "Nikkei 225": [SEGMENT_NAME_EN.get(k, k) for k in SEGMENT_GROUPS.get("\u65e5\u7d4c225", [])],
        "TOPIX":      [SEGMENT_NAME_EN.get(k, k) for k in SEGMENT_GROUPS.get("TOPIX", [])],
        "Market":     [SEGMENT_NAME_EN.get(k, k) for k in SEGMENT_GROUPS.get("\u5e02\u5834\u533a\u5206", [])],
    }
    return {"period": period, "data": data_en, "groups": groups_en}


@app.get("/api/market-rank/{seg_name}")
def get_segment_detail(seg_name: str, period: str = Query(default="1mo")):
    ja_name = SEGMENT_NAME_JA.get(seg_name, seg_name)
    data = fetch_segment_detail(ja_name, period)
    stocks_en = [
        {**s, "name": translate_stock(s.get("name", ""))}
        for s in data.get("stocks", [])
    ]
    return {"period": period, "segment": seg_name, "data": {**data, "stocks": stocks_en}}


@app.get("/api/theme-detail/{theme_name}")
def get_theme_detail(theme_name: str, period: str = Query(default="1mo")):
    ja_name = next((k for k, v in THEME_NAME_EN.items() if v == theme_name), theme_name)
    themes_to_use = EXTRA_THEMES_EN if theme_name in EXTRA_THEMES_EN else DEFAULT_THEMES
    name_to_use   = theme_name if theme_name in EXTRA_THEMES_EN else ja_name
    data = fetch_theme_detail(themes_to_use, name_to_use, period)
    stocks_en = [
        {**s, "name": translate_stock(s.get("name", ""))}
        for s in data.get("stocks", [])
    ]
    return {"period": period, "data": {**data, "theme": theme_name, "stocks": stocks_en}}


@app.get("/api/stock-info/{ticker}")
def get_stock_info(ticker: str):
    try:
        import yfinance as yf
        t    = yf.Ticker(ticker)
        info = t.info
        hist = t.history(period="2d", interval="1d", auto_adjust=True)
        price_jpy = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
        name = info.get("longName") or info.get("shortName") or ticker
        usd_jpy = None
        price_usd = None
        try:
            rate_df = yf.Ticker("JPY=X").history(period="1d", interval="1m", auto_adjust=True)
            usd_jpy = float(rate_df["Close"].iloc[-1]) if len(rate_df) > 0 else None
            if price_jpy and usd_jpy:
                price_usd = round(price_jpy / usd_jpy, 2)
        except Exception:
            pass
        return {
            "ticker": ticker, "name": translate_stock(name),
            "price_jpy": price_jpy, "price_usd": price_usd, "usd_jpy": usd_jpy,
        }
    except Exception as e:
        return {"ticker": ticker, "name": None, "error": str(e)}


@app.get("/api/stock-search")
def search_stocks(q: str = Query(default="")):
    if not q.strip():
        return {"results": []}
    try:
        import yfinance as yf
        results = []
        q = q.strip()
        if q.isdigit() and len(q) == 4:
            ticker = q + ".T"
            try:
                t     = yf.Ticker(ticker)
                info  = t.info
                hist  = t.history(period="2d", interval="1d", auto_adjust=True)
                price = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
                name  = info.get("longName") or info.get("shortName") or ticker
                results.append({"ticker": ticker, "name": translate_stock(name), "price": price})
            except Exception:
                pass
        else:
            try:
                search = yf.Search(q, max_results=8)
                for item in (search.quotes or []):
                    sym  = item.get("symbol", "")
                    name = item.get("longname") or item.get("shortname") or sym
                    if sym and name:
                        results.append({"ticker": sym, "name": name, "exchange": item.get("exchange", ""), "price": None})
            except Exception:
                pass
        return {"results": results[:8]}
    except Exception as e:
        return {"results": [], "error": str(e)}
