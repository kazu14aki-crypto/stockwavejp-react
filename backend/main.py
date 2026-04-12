import numpy as np
"""
main.py — FastAPI メインサーバー v2.1
"""
from fastapi import FastAPI, Query, Request
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

app = FastAPI(title="StockWaveJP API", version="2.2.0")  # 67テーマ対応
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    import threading
    # バックグラウンドでウォームアップ（起動を遅らせない）
    t = threading.Thread(target=warmup_cache_extended, args=(DEFAULT_THEMES,), daemon=True)
    t.start()

@app.get("/api/ping")
def ping():
    """UptimeRobot・スリープ防止用エンドポイント（軽量）"""
    return {"ok": True}


@app.get("/")
def root():
    return {"status": "ok", "app": "StockWaveJP API", "version": "2.2.0"}


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

@app.get("/api/market-rank-list")
def get_market_rank_list(period: str = Query(default="1mo")):
    """フロントエンドuseMarketRankList用 - market-rankと同じデータを返す"""
    data = fetch_market_segments(period)
    return {"period": period, "data": data, "groups": SEGMENT_GROUPS}


@app.get("/api/vol-trend/{theme_name}")
def get_vol_trend(theme_name: str):
    """テーマ別出来高・売買代金週次推移（1年間）"""
    import yfinance as yf
    import pandas as pd
    import warnings
    warnings.filterwarnings("ignore")
    stocks = DEFAULT_THEMES.get(theme_name, {})
    combined_vol: dict = {}
    combined_tv:  dict = {}
    cutoff = pd.Timestamp.now() - pd.Timedelta(days=370)
    for name, ticker in stocks.items():
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                df = yf.Ticker(ticker).history(period="1y", interval="1d",
                                               auto_adjust=True, timeout=15)
            if df is None or len(df) < 5:
                continue
            df.index = pd.to_datetime(df.index).tz_localize(None)
            df = df[df.index >= cutoff]
            if len(df) < 5:
                continue
            dfw = df.resample("W-FRI").agg({"Volume": "sum", "Close": "last"}).dropna()
            for dt, row in dfw.iterrows():
                key = dt.strftime("%Y-%m-%d")
                vol = float(row["Volume"]) if row["Volume"] else 0
                tv  = vol * float(row["Close"]) if row["Close"] else 0
                combined_vol[key] = combined_vol.get(key, 0) + vol
                combined_tv[key]  = combined_tv.get(key, 0)  + tv
        except Exception:
            continue
    if not combined_vol:
        return {"dates": [], "volumes": [], "trade_values": []}
    dates = sorted(combined_vol.keys())
    return {
        "dates":        dates,
        "volumes":      [round(combined_vol[d]) for d in dates],
        "trade_values": [round(combined_tv[d])  for d in dates],
    }

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
        from data import _fetch_df, _period_df
        # 日本語名を優先（main.py内のJP_STOCK_NAMESを参照）
        jp_name = JP_STOCK_NAMES.get(ticker)
        # 1ヶ月のデータを取得して騰落率・出来高・売買代金を計算
        df = _fetch_df(ticker)
        df_1mo = _period_df(df, "1mo")
        price, pct, volume, trade_value = None, None, None, None
        if df_1mo is not None and len(df_1mo) >= 2:
            cl = df_1mo["Close"].dropna()
            vol = df_1mo["Volume"].dropna()
            if len(cl) >= 2 and (cl > 0).all():
                price = round(float(cl.iloc[-1]), 0)
                pct = round((float(cl.iloc[-1]) / float(cl.iloc[0]) - 1) * 100, 2)
                half = max(len(df_1mo) // 2, 1)
                rv = float(vol.tail(half).mean()) if len(vol) > 0 else 0
                volume = int(rv)
                trade_value = int(rv * price) if price else 0
        # 名前取得（APIがスロー返答の場合でも価格データから）
        if not jp_name:
            try:
                t = yf.Ticker(ticker)
                info = t.info
                jp_name = info.get("longName") or info.get("shortName") or ticker
            except Exception:
                jp_name = ticker
        return {
            "ticker": ticker, "name": jp_name, "price": price,
            "pct": pct, "volume": volume, "trade_value": trade_value,
        }
    except Exception as e:
        return {"ticker": ticker, "name": None, "price": None,
                "pct": None, "volume": None, "trade_value": None, "error": str(e)}


@app.get("/api/stock-history/{ticker}")
def get_stock_history(ticker: str, period: str = "1mo"):
    """銘柄の騰落率履歴（カスタムテーマグラフ用）"""
    try:
        from data import _fetch_df, _period_df
        df  = _fetch_df(ticker)
        pdf = _period_df(df, period)
        if pdf is None or len(pdf) < 2:
            return {"ticker": ticker, "data": []}
        cl  = pdf["Close"].dropna()
        if len(cl) < 2 or not (cl > 0).all():
            return {"ticker": ticker, "data": []}
        cum = (cl / cl.iloc[0] - 1) * 100
        # 重複インデックス除去
        cum = cum[~cum.index.duplicated(keep='last')]
        data = [{"date": str(d.date()), "pct": round(float(v), 2)}
                for d, v in cum.items() if not np.isnan(v)]
        return {"ticker": ticker, "data": data}
    except Exception as e:
        return {"ticker": ticker, "data": [], "error": str(e)}



@app.post("/api/custom-theme-stats")
async def get_custom_theme_stats(request: Request):
    """カスタムテーマの騰落率・出来高を集計（テーマ一覧・比較グラフ用）"""
    try:
        from data import _fetch_df, _period_df
        payload = await request.json()
        tickers = payload.get("tickers", [])
        period  = payload.get("period", "1mo")
        if not tickers:
            return {"pct": 0, "volume": 0, "trade_value": 0, "stocks": []}

        pcts, vols, tvs = [], [], []
        stocks_result = []
        for ticker in tickers[:20]:  # 最大20銘柄
            try:
                df  = _fetch_df(ticker)
                pdf = _period_df(df, period)
                if pdf is None or len(pdf) < 2:
                    continue
                cl  = pdf["Close"].dropna()
                vol = pdf["Volume"].dropna()
                if len(cl) < 2 or not (cl > 0).all():
                    continue
                price = round(float(cl.iloc[-1]), 0)
                pct   = round((float(cl.iloc[-1]) / float(cl.iloc[0]) - 1) * 100, 2)
                half  = max(len(pdf) // 2, 1)
                rv    = float(vol.tail(half).mean()) if len(vol) > 0 else 0
                tv    = int(rv * price)
                pcts.append(pct); vols.append(int(rv)); tvs.append(tv)
                stocks_result.append({
                    "ticker": ticker, "price": price, "pct": pct,
                    "volume": int(rv), "trade_value": tv,
                })
            except Exception:
                continue

        avg_pct = round(sum(pcts) / len(pcts), 2) if pcts else 0
        return {
            "pct": avg_pct,
            "volume": sum(vols),
            "trade_value": sum(tvs),
            "stocks": stocks_result,
        }
    except Exception as e:
        return {"pct": 0, "volume": 0, "trade_value": 0, "stocks": [], "error": str(e)}

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
