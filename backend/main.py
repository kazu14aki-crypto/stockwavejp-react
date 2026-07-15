import numpy as np
"""
main.py — FastAPI メインサーバー v2.1
"""
from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import pytz

from themes import DEFAULT_THEMES
from data import (
    fetch_theme_results, fetch_theme_trend, fetch_momentum_data,
    fetch_heatmap_data, fetch_heatmap_monthly, fetch_macro_data,
    fetch_market_segments, fetch_segment_detail, fetch_theme_detail,
    MARKET_SEGMENTS, SEGMENT_GROUPS, warmup_cache_extended,
    get_nikkei_classification_info, NIKKEI225_CLASSIFICATION,
    get_valuation,
)

# ── サブスクリプションプラン判定（バリュエーション列のアクセス制御用）──
from supabase import create_client as _create_client
import os as _os
_sb_url = _os.environ.get("SUPABASE_URL", "")
_sb_key = _os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
_sb_plan_client = _create_client(_sb_url, _sb_key) if _sb_url and _sb_key else None

def _is_subscribed(uid: str | None) -> bool:
    """uidが有料プラン（standard/pro/pro_trial）であればTrue。無料・期限切れ・未ログインはFalse。"""
    if not uid or not _sb_plan_client:
        return False
    try:
        res = _sb_plan_client.table("subscriptions") \
            .select("status,plan") \
            .eq("user_id", uid) \
            .eq("status", "active") \
            .execute()
        if res.data and len(res.data) > 0:
            return True  # アクティブな有料サブスクあり
    except Exception:
        pass
    # サブスクなし → pro_trial（14日間無料体験）の判定はフロント側のuser_metadataベースのため、
    # バックエンドではサブスクテーブルの有無のみで判定（トライアル中はフロントのUIで別途出し分け）
    return False

def _strip_valuation_if_locked(payload: dict, uid: str | None) -> dict:
    """サブスク未加入の場合、per/per_fwd/pbr/pbr_fwd/peg/peg_fwdをNoneにし、ロックフラグを付与する。"""
    subscribed = _is_subscribed(uid)
    stocks = (payload.get("data") or {}).get("stocks") if isinstance(payload.get("data"), dict) else None
    if stocks is None and isinstance(payload.get("data"), list):
        stocks = payload.get("data")
    if stocks:
        for s in stocks:
            if not subscribed:
                for k in ("per", "per_fwd", "pbr", "pbr_fwd", "peg", "peg_fwd"):
                    if k in s:
                        s[k] = None
    payload["valuation_locked"] = not subscribed
    return payload



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
def get_segment_detail(seg_name: str, period: str = Query(default="1mo"), uid: str = Query(default=None)):
    payload = {
        "period":   period,
        "segment":  seg_name,
        "data":     fetch_segment_detail(seg_name, period),
    }
    return _strip_valuation_if_locked(payload, uid)


@app.get("/api/nikkei-classification/{seg_name}")
def get_nikkei_classification(seg_name: str):
    """日経225セグメントの大分類・小分類情報を返す"""
    return get_nikkei_classification_info(seg_name)


@app.get("/api/theme-detail/{theme_name}")
def get_theme_detail(theme_name: str, period: str = Query(default="1mo"), uid: str = Query(default=None)):
    payload = {
        "period": period,
        "data":   fetch_theme_detail(theme_name, DEFAULT_THEMES.get(theme_name, {}), period),
    }
    return _strip_valuation_if_locked(payload, uid)


@app.get("/api/stock-universe")
def get_stock_universe(period: str = Query(default="5d"), uid: str = Query(default=None)):
    """Dev Edgeスキャナ用: 全テーマ＋市場区分を横断した銘柄ユニバースを1コールで返す。
    テーマの増減・将来の全銘柄収録に自動追随する（DEFAULT_THEMES/MARKET_SEGMENTSを走査）。"""
    rows: dict = {}
    theme_pct: dict = {}
    for name, stocks in DEFAULT_THEMES.items():
        try:
            d = fetch_theme_detail(name, stocks, period)
        except Exception:
            continue
        theme_pct[name] = d.get("avg")
        for s in d.get("stocks", []):
            code = s.get("ticker")
            if not code:
                continue
            r = rows.get(code)
            if r is None:
                r = dict(s)
                r.pop("spark", None)  # 転送量削減
                r["themes"] = []
                rows[code] = r
            r["themes"].append(name)
    # 市場区分（テーマ未収載銘柄の受け皿。将来の全銘柄収録時もここが拾う）
    for seg, v in MARKET_SEGMENTS.items():
        seg_stocks = v.get("stocks") if isinstance(v, dict) else None
        if not seg_stocks:
            continue
        try:
            d = fetch_theme_detail(seg, seg_stocks, period)
        except Exception:
            continue
        for s in d.get("stocks", []):
            code = s.get("ticker")
            if code and code not in rows:
                r = dict(s)
                r.pop("spark", None)
                r["themes"] = []
                rows[code] = r
    payload = {"period": period, "count": len(rows),
               "theme_pct": theme_pct, "data": list(rows.values())}
    return _strip_valuation_if_locked(payload, uid)


@app.get("/api/stock-valuation/{ticker}")
def get_stock_valuation(ticker: str, uid: str = Query(default=None)):
    """個別銘柄詳細ページ用: PER/PBR/PEG等（サブスク未加入はロック）"""
    subscribed = _is_subscribed(uid)
    val = {}
    try:
        val = get_valuation(ticker) or {}
    except Exception:
        val = {}
    keys = ("per", "per_fwd", "pbr", "pbr_fwd", "peg", "peg_fwd")
    out = {k: (val.get(k) if subscribed else None) for k in keys}
    return {"ticker": ticker, "valuation_locked": not subscribed, **out}


# ═══ 大量保有報告書（投資家軸） ═══
import json as _json_lh
from pathlib import Path as _Path_lh

_LH_DIR = _Path_lh(__file__).parent / ".." / "frontend" / "public" / "data" / "large_holdings"

def _load_lh(name):
    fp = (_LH_DIR / name).resolve()
    try:
        return _json_lh.load(open(fp, encoding="utf-8"))
    except Exception:
        return None


@app.get("/api/large-holdings/investor/{name}")
def get_investor_positions(name: str):
    """特定の機関投資家の保有銘柄と各々の保有割合推移を返す（例: 光通信）"""
    data = _load_lh("by_investor.json") or {}
    # 完全一致を優先。部分一致は最初の1件ではなく全候補を統合する。
    matches = [name] if name in data else [k for k in data if name.lower() in k.lower() or k.lower() in name.lower()]
    if not matches:
        return {"investor": name, "positionCount": 0, "positions": [], "notFound": True}
    merged = {}
    for key in matches:
        for pos in data[key].get("positions", []):
            sec = str(pos.get("secCode") or "")
            if not sec:
                continue
            current = merged.get(sec)
            if current is None or str(pos.get("latestDate") or "") > str(current.get("latestDate") or ""):
                merged[sec] = pos
    positions = sorted(merged.values(), key=lambda x: (x.get("latestRatio") or 0), reverse=True)
    return {"investor": name, "matchedNames": matches, "positionCount": len(positions), "positions": positions}


@app.get("/api/large-holdings/issuer/{ticker}")
def get_issuer_holders(ticker: str):
    """特定銘柄の大量保有者一覧と各々の推移を返す"""
    code = str(ticker).replace(".T", "")
    data = _load_lh("by_issuer.json") or {}
    return data.get(code, {"secCode": code, "issuerName": "", "holders": [], "notFound": True})


@app.get("/api/large-holdings/index")
def get_lh_index():
    """投資家・銘柄の検索索引"""
    return _load_lh("index.json") or {"investors": [], "issuers": []}


def _lh_ratio_pct(value):
    try:
        v = float(value)
    except (TypeError, ValueError):
        return 0.0
    return v * 100 if 0 <= abs(v) <= 1 else v


@app.get("/api/tob-radar")
def get_tob_radar(uid: str = Query(default=None)):
    """
    TOBオプション・スコア: 大量保有×資本構成×低バリュエーションを掛け合わせ、
    「配当をもらいながらTOBを待てる」候補を発掘する。
    """
    subscribed = _is_subscribed(uid)
    by_issuer = _load_lh("by_issuer.json") or {}
    candidates = []

    sh_dir = _Path_lh(__file__).parent / ".." / "frontend" / "public" / "data" / "stockholders"

    for sec, info in by_issuer.items():
        holders = info.get("holders", [])
        if not holders:
            continue
        holders = sorted(holders, key=lambda h: _lh_ratio_pct(h.get("latestRatio")), reverse=True)
        top = holders[0]
        top_ratio = _lh_ratio_pct(top.get("latestRatio"))
        if top_ratio < 5:
            continue
        trend = top.get("trend", [])
        accumulating = len(trend) >= 2 and _lh_ratio_pct(trend[-1].get("ratio")) > _lh_ratio_pct(trend[0].get("ratio"))

        founder_or_parent = 0.0
        pbr = None
        try:
            sh = _json_lh.load(open((sh_dir / f"{sec}.json").resolve(), encoding="utf-8"))
            summ = sh.get("latestSummary", {})
            bycat = summ.get("by_category", {})
            founder_or_parent = (bycat.get("corporate", 0) + bycat.get("individual", 0))
        except Exception:
            pass
        try:
            val = get_valuation(f"{sec}.T") or {}
            pbr = val.get("pbr")
        except Exception:
            pbr = None

        s_holder = min(100, top_ratio / 25 * 100)
        s_accum = 100 if accumulating else 40
        s_capital = min(100, founder_or_parent / 40 * 100)
        s_value = (min(100, (1.5 - pbr) / 1.0 * 100) if isinstance(pbr, (int, float)) and pbr > 0 else 50)
        s_value = max(0, s_value)
        score = round(0.30 * s_holder + 0.20 * s_accum + 0.30 * s_capital + 0.20 * s_value, 1)

        candidates.append({
            "secCode": sec,
            "issuerName": info.get("issuerName", ""),
            "topHolder": top.get("filerKey", ""),
            "topRatio": top_ratio,
            "accumulating": accumulating,
            "reportCount": top.get("reportCount", 0),
            "stableOwnerPct": round(founder_or_parent, 1),
            "pbr": pbr if subscribed else None,
            "score": score,
            "factors": {
                "holder": round(s_holder), "accum": round(s_accum),
                "capital": round(s_capital), "value": round(s_value) if subscribed else None,
            },
        })

    candidates.sort(key=lambda x: x["score"], reverse=True)
    return {"count": len(candidates), "subscribed": subscribed, "candidates": candidates[:50]}


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

        # 日本株（4桁数字.T形式）のみに厳密に絞る
        import re as _re
        results = [r for r in results
                   if _re.match(r'^\d{4}\.T$', r["ticker"])
                   and r.get("name") and r["name"] != r["ticker"]]
        return {"results": results[:8]}
    except Exception as e:
        return {"results": [], "error": str(e)}

# ── Stripe Checkout ────────────────────────────────────────────
import os
import stripe as _stripe
from supabase import create_client as _sb_client
import datetime as _dt

_stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")
_WEBHOOK_SECRET  = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
_PRICE_IDS = {
    "standard_monthly": os.environ.get("STRIPE_PRICE_STD_MONTHLY"),
    "standard_yearly":  os.environ.get("STRIPE_PRICE_STD_YEARLY"),
    "pro_monthly":      os.environ.get("STRIPE_PRICE_PRO_MONTHLY"),
    "pro_yearly":       os.environ.get("STRIPE_PRICE_PRO_YEARLY"),
}

class CheckoutReq(BaseModel):
    price_key:      str
    user_id:        str
    email:          str
    success_url:    str
    cancel_url:     str
    billing_timing: str = 'period_end'  # 'immediate' or 'period_end'
# ── Stripe サブスクリプション解約 ──────────────────────────────────────
@app.post("/api/stripe/cancel-subscription")
async def cancel_subscription(req: Request):
    body = await req.json()
    user_id = body.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    try:
        # Supabaseからstripe_subscription_idを取得
        from supabase import create_client
        sb_url = os.environ.get("SUPABASE_URL", "")
        sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        sb = create_client(sb_url, sb_key)
        result = sb.table("subscriptions") \
            .select("stripe_subscription_id") \
            .eq("user_id", user_id) \
            .eq("status", "active") \
            .limit(1) \
            .execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="有効なサブスクリプションが見つかりません")
        sub_id = result.data[0]["stripe_subscription_id"]

        # Stripeでキャンセル（期間終了時に自動解約）
        stripe.Subscription.modify(sub_id, cancel_at_period_end=True)

        # Supabaseのステータスを更新
        sb.table("subscriptions") \
            .update({"status": "canceling"}) \
            .eq("stripe_subscription_id", sub_id) \
            .execute()

        return {"ok": True, "message": "解約予約を受け付けました。契約期間終了日まで引き続きご利用いただけます。"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Stripe Customer Portal ─────────────────────────────────────────────
@app.post("/api/stripe/create-portal")
async def create_portal(req: Request):
    body = await req.json()
    user_id = body.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    try:
        from supabase import create_client
        sb_url = os.environ.get("SUPABASE_URL", "")
        sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        sb = create_client(sb_url, sb_key)
        result = sb.table("subscriptions") \
            .select("stripe_customer_id") \
            .eq("user_id", user_id) \
            .limit(1) \
            .execute()
        if not result.data or not result.data[0].get("stripe_customer_id"):
            raise HTTPException(status_code=404, detail="Stripe顧客情報が見つかりません")
        customer_id = result.data[0]["stripe_customer_id"]
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url="https://stockwavejp.com",
        )
        return {"url": session.url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/stripe/create-checkout")
async def create_checkout(req: CheckoutReq):
    pid = _PRICE_IDS.get(req.price_key)
    if not pid:
        missing = "STRIPE_PRICE_STD_MONTHLY" if "standard" in req.price_key else "STRIPE_PRICE_PRO_MONTHLY"
        return {"error": f"価格IDが設定されていません。Renderの環境変数 {missing} を確認してください。"}
    try:
        plan = "standard" if "standard" in req.price_key else "pro"
        session = _stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": pid, "quantity": 1}],
            customer_email=req.email,
            client_reference_id=req.user_id,
            success_url=req.success_url + "?checkout=success",
            cancel_url=req.cancel_url + "?checkout=cancel",
            subscription_data={"metadata": {"user_id": req.user_id, "plan": plan}},
            locale="ja",
        )
        return {"url": session.url}
    except _stripe.error.StripeError as e:
        return {"error": f"Stripe エラー: {str(e)}"}
    except Exception as e:
        return {"error": f"サーバーエラー: {str(e)}"}

@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    payload   = await request.body()
    sig       = request.headers.get("stripe-signature", "")
    wh_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    # 1. 署名検証
    try:
        event = _stripe.Webhook.construct_event(payload, sig, wh_secret)
    except Exception as e:
        print(f"[WEBHOOK] Signature error: {e}")
        raise HTTPException(400, "Invalid signature")

    et = event["type"]
    print(f"[WEBHOOK] type={et}")

    # 2. Supabase 環境変数確認
    sb_url = os.environ.get("SUPABASE_URL", "")
    sb_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not sb_url or not sb_key:
        print(f"[WEBHOOK ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        raise HTTPException(500, "Supabase env missing")

    import httpx as _httpx
    import json as _json

    base_hdrs = {
        "apikey":        sb_key,
        "Authorization": f"Bearer {sb_key}",
        "Content-Type":  "application/json",
        "Prefer":        "return=minimal",
    }

    def safe_get(obj, key, default=None):
        """StripeObject/dict両対応の安全なget"""
        try:
            v = obj[key]
            return v if v is not None else default
        except (KeyError, TypeError, IndexError):
            return default

    def to_isoformat(ts):
        """Unixタイムスタンプ → ISO8601文字列"""
        try:
            return _dt.datetime.fromtimestamp(int(ts), tz=_dt.timezone.utc).isoformat()
        except Exception:
            return None

    def sb_upsert(data):
        try:
            r = _httpx.post(
                f"{sb_url}/rest/v1/subscriptions",
                headers={**base_hdrs, "Prefer": "resolution=merge-duplicates,return=minimal"},
                content=_json.dumps(data).encode(),
                timeout=15,
            )
            print(f"[WEBHOOK] upsert {r.status_code}: {r.text[:200]}")
        except Exception as e:
            print(f"[WEBHOOK] upsert error: {e}")
            raise

    def sb_update_by_sub(sub_stripe_id, data):
        try:
            r = _httpx.patch(
                f"{sb_url}/rest/v1/subscriptions?stripe_subscription_id=eq.{sub_stripe_id}",
                headers=base_hdrs,
                content=_json.dumps(data).encode(),
                timeout=15,
            )
            print(f"[WEBHOOK] update {r.status_code}: {r.text[:200]}")
        except Exception as e:
            print(f"[WEBHOOK] update error: {e}")
            raise

    try:
        if et == "checkout.session.completed":
            obj    = event["data"]["object"]
            uid    = safe_get(obj, "client_reference_id")
            sub_id = safe_get(obj, "subscription")
            cust   = safe_get(obj, "customer")
            print(f"[WEBHOOK] checkout uid={uid} sub={sub_id} cust={cust}")
            if uid and sub_id:
                sub  = _stripe.Subscription.retrieve(sub_id)
                # メタデータ取得（StripeObject → dict変換は使わず直接アクセス）
                try:
                    plan = sub.metadata["plan"]
                except Exception:
                    plan = "standard"
                exp = to_isoformat(safe_get(sub, "current_period_end"))
                sb_upsert({
                    "user_id":                uid,
                    "plan":                   plan,
                    "status":                 "active",
                    "stripe_subscription_id": sub_id,
                    "stripe_customer_id":     cust,
                    "current_period_end":     exp,
                })

        elif et == "invoice.payment_succeeded":
            obj    = event["data"]["object"]
            sub_id = safe_get(obj, "subscription")
            print(f"[WEBHOOK] invoice.payment_succeeded sub={sub_id}")
            if sub_id:
                sub = _stripe.Subscription.retrieve(sub_id)
                exp = to_isoformat(safe_get(sub, "current_period_end"))
                sb_update_by_sub(sub_id, {
                    "status":             "active",
                    "current_period_end": exp,
                })

        elif et == "customer.subscription.updated":
            obj    = event["data"]["object"]
            sub_id = safe_get(obj, "id")
            cancel = safe_get(obj, "cancel_at_period_end", False)
            status = "canceling" if cancel else safe_get(obj, "status", "active")
            print(f"[WEBHOOK] sub.updated sub={sub_id} status={status}")
            if sub_id:
                sb_update_by_sub(sub_id, {"status": status})

        elif et == "customer.subscription.deleted":
            obj    = event["data"]["object"]
            sub_id = safe_get(obj, "id")
            print(f"[WEBHOOK] sub.deleted sub={sub_id}")
            if sub_id:
                sb_update_by_sub(sub_id, {"status": "canceled"})

        else:
            print(f"[WEBHOOK] unhandled: {et}")

    except Exception as e:
        print(f"[WEBHOOK ERROR] {et}: {type(e).__name__}: {e}")
        raise HTTPException(500, f"Webhook error: {e}")

    return {"ok": True}


# ── EDINET 大量保有報告書データ ───────────────────────────────────
@app.get("/api/edinet/holdings")
async def get_edinet_holdings(query: str = "", limit: int = 200):
    """
    EDINET OPEN APIから大量保有報告書データを取得。
    クエリパラメータでissuer名またはfiler名を絞り込み。
    """
    import httpx as _httpx_ed
    import datetime as _dt_ed

    EDINET_API = "https://disclosure.edinet-fsa.go.jp/api/v2/documents.json"

    try:
        # 過去60日間の大量保有報告書を取得
        today = _dt_ed.date.today()
        results = []

        # 最新30日分を取得
        for delta in range(0, 30):
            d = today - _dt_ed.timedelta(days=delta)
            date_str = d.strftime("%Y-%m-%d")
            try:
                r = _httpx_ed.get(
                    EDINET_API,
                    params={
                        "date": date_str,
                        "type": 2,  # 書類一覧（大量保有報告書含む）
                    },
                    timeout=10,
                )
                if not r.is_success:
                    continue
                data = r.json()
                docs = data.get("results", [])
                for doc in docs:
                    # 大量保有報告書 = docTypeCode "43" (大量保有報告書)
                    # または "44" (変更報告書)
                    if doc.get("docTypeCode") not in ("43", "44"):
                        continue
                    issuer = doc.get("issuerName", "")
                    filer  = doc.get("filerName", "")
                    sec    = doc.get("secCode", "") or ""
                    # クエリフィルタ
                    if query:
                        ql = query.lower()
                        if ql not in issuer.lower() and ql not in filer.lower() and ql not in sec:
                            continue
                    results.append({
                        "docID":         doc.get("docID", ""),
                        "docTypeCode":   doc.get("docTypeCode", ""),
                        "issuerName":    issuer,
                        "secCode":       sec.rstrip("0") if sec else "",
                        "filerName":     filer,
                        "holdingRatio":  doc.get("submitDateTime", "")[:10],
                        "submitDate":    doc.get("submitDateTime", "")[:10],
                        "docDescription":doc.get("docDescription", ""),
                        "pdfURL":        f"https://disclosure.edinet-fsa.go.jp/api/v2/documents/{doc.get('docID','')}?type=2",
                    })
                    if len(results) >= limit:
                        break
                if len(results) >= limit:
                    break
            except Exception as e:
                print(f"[EDINET] Error for {date_str}: {e}")
                continue

        return {
            "updated_at": today.isoformat(),
            "count": len(results),
            "results": results,
        }
    except Exception as e:
        print(f"[EDINET ERROR] {e}")
        raise HTTPException(500, f"EDINET fetch error: {e}")

