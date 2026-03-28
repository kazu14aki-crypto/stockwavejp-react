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
    fetch_heatmap_data, fetch_heatmap_monthly, fetch_macro_data,
    fetch_market_segments, fetch_segment_detail, fetch_theme_detail,
    MARKET_SEGMENTS, SEGMENT_GROUPS, warmup_cache_extended,
    get_nikkei_classification_info, NIKKEI225_CLASSIFICATION,
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
    rise = sum(1 for r in results if r.get("up", r["pct"] >= 0))
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
        "data":   fetch_theme_trend(DEFAULT_THEMES.get(theme_name, {}), period),
    }


@app.get("/api/trends")
def get_trends(themes: str = Query(default=""), period: str = Query(default="1y")):
    theme_list = [t.strip() for t in themes.split(",") if t.strip()] if themes else list(DEFAULT_THEMES.keys())
    return {
        "period": period,
        "trends": {t: fetch_theme_trend(DEFAULT_THEMES.get(t, {}), period) for t in theme_list},
    }


@app.get("/api/heatmap")
def get_heatmap():
    return {"data": fetch_heatmap_data(DEFAULT_THEMES)}


@app.get("/api/heatmap/monthly")
def get_monthly_heatmap():
    result = fetch_heatmap_monthly(DEFAULT_THEMES)
    return result


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


@app.get("/api/nikkei-classification/{seg_name}")
def get_nikkei_classification(seg_name: str):
    """日経225セグメントの大分類・小分類情報を返す"""
    return get_nikkei_classification_info(seg_name)


@app.get("/api/theme-detail/{theme_name}")
def get_theme_detail(theme_name: str, period: str = Query(default="1mo")):
    return {
        "period": period,
        "data":   fetch_theme_detail(theme_name, DEFAULT_THEMES.get(theme_name, {}), period),
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


# 日本株名称マスター（銘柄名検索の日本語化に使用）
JP_STOCK_NAMES = {
    "7203.T":"トヨタ自動車","6758.T":"ソニーグループ","8306.T":"三菱UFJ FG",
    "6861.T":"キーエンス","8035.T":"東京エレクトロン","9983.T":"ファーストリテイリング",
    "4063.T":"信越化学工業","6098.T":"リクルートHD","8058.T":"三菱商事",
    "9433.T":"KDDI","7974.T":"任天堂","6367.T":"ダイキン工業",
    "6501.T":"日立製作所","8316.T":"三井住友FG","7267.T":"ホンダ",
    "4519.T":"中外製薬","8766.T":"東京海上HD","6981.T":"村田製作所",
    "6954.T":"ファナック","8031.T":"三井物産","8001.T":"伊藤忠商事",
    "8411.T":"みずほFG","4568.T":"第一三共","6902.T":"デンソー",
    "4502.T":"武田薬品工業","6702.T":"富士通","6701.T":"NEC",
    "4307.T":"野村総合研究所","3778.T":"さくらインターネット","4385.T":"メルカリ",
    "6857.T":"アドバンテスト","6723.T":"ルネサスエレクトロニクス","6920.T":"レーザーテック",
    "6146.T":"ディスコ","6526.T":"ソシオネクスト","3436.T":"SUMCO",
    "4661.T":"オリエンタルランド","2802.T":"味の素","2503.T":"キリンHD",
    "5401.T":"日本製鉄","7011.T":"三菱重工業","9020.T":"JR東日本",
    "9101.T":"日本郵船","9104.T":"商船三井","9201.T":"JAL","9202.T":"ANA HD",
    "9432.T":"NTT","9434.T":"ソフトバンク","9984.T":"ソフトバンクG",
    "8801.T":"三井不動産","8802.T":"三菱地所","8697.T":"日本取引所G",
    "8604.T":"野村HD","8591.T":"オリックス","6752.T":"パナソニックHD",
    "6503.T":"三菱電機","6762.T":"TDK","6971.T":"京セラ","6645.T":"オムロン",
    "7733.T":"オリンパス","7741.T":"HOYA","4543.T":"テルモ","6869.T":"シスメックス",
    "7751.T":"キヤノン","7731.T":"ニコン","4684.T":"オービック",
    "9719.T":"SCSK","3626.T":"TIS","8308.T":"りそなHD","5020.T":"ENEOS HD",
    "5713.T":"住友金属鉱山","5108.T":"ブリヂストン","3407.T":"旭化成",
    "4188.T":"三菱ケミカルG","4578.T":"大塚HD","4503.T":"アステラス製薬",
    "4523.T":"エーザイ","4507.T":"塩野義製薬","6326.T":"クボタ","6301.T":"コマツ",
    "6273.T":"SMC","1802.T":"大林組","1812.T":"鹿島建設","1925.T":"大和ハウス工業",
    "1928.T":"積水ハウス","6479.T":"ミネベアミツミ","7203.T":"トヨタ自動車",
}

@app.get("/api/stock-search")
def search_stocks(q: str = Query(default="")):
    """銘柄名または証券コードで検索（カスタムテーマ用・日本株のみ）"""
    if not q.strip():
        return {"results": []}
    try:
        import yfinance as yf
        q = q.strip()
        results = []

        # 4桁数字 → 日本株ティッカー
        if q.isdigit() and len(q) == 4:
            ticker = q + ".T"
            try:
                t    = yf.Ticker(ticker)
                info = t.info
                hist = t.history(period="5d", interval="1d", auto_adjust=True)
                price = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
                # 日本語名を優先
                jp_name = JP_STOCK_NAMES.get(ticker)
                en_name = info.get("longName") or info.get("shortName") or ""
                name = jp_name or en_name or ticker
                if name and name != ticker:
                    results.append({"ticker": ticker, "name": name, "price": price})
                else:
                    results.append({"ticker": ticker, "name": ticker, "price": price})
            except Exception:
                pass

        else:
            # 銘柄名検索：まず日本語名マスターから前方一致・部分一致で検索
            q_lower = q.lower()
            for ticker, jp_name in JP_STOCK_NAMES.items():
                if q_lower in jp_name.lower() or q in jp_name:
                    try:
                        hist = yf.Ticker(ticker).history(period="5d", auto_adjust=True)
                        price = round(float(hist["Close"].iloc[-1]), 0) if len(hist) > 0 else None
                    except Exception:
                        price = None
                    results.append({
                        "ticker": ticker,
                        "name": jp_name,
                        "price": price,
                    })
                    if len(results) >= 8:
                        break

            # マスターにない場合はyfinance Searchで補完（日本株のみ）
            if not results:
                try:
                    search = yf.Search(q + " japan stock", max_results=15)
                    for item in (search.quotes or []):
                        sym = item.get("symbol", "")
                        if not sym.endswith(".T"):
                            continue
                        jp_name = JP_STOCK_NAMES.get(sym)
                        en_name = item.get("longname") or item.get("shortname") or sym
                        name = jp_name or en_name
                        if sym and name:
                            results.append({
                                "ticker": sym,
                                "name": name,
                                "price": None,
                            })
                            if len(results) >= 8:
                                break
                except Exception:
                    pass

        # 日本株（.T）のみに絞る
        results = [r for r in results if r["ticker"].endswith(".T")]
        return {"results": results[:8]}
    except Exception as e:
        return {"results": [], "error": str(e)}
