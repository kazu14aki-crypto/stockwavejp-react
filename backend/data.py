"""
data.py — 完全版（市場別分類拡充・個別株詳細対応）
"""
import yfinance as yf
import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

_cache: dict = {}
_CACHE_TTL = 3600

MACRO_TICKERS = {
    "日経平均": "^N225", "TOPIX": "^TOPX", "S&P500": "^GSPC",
    "ドル円": "JPY=X", "ナスダック": "^IXIC", "VIX": "^VIX",
}

# ── 市場別セグメント（分類拡充版） ──
MARKET_SEGMENTS = {
    # ── 日経225 ──
    "日経225｜技術・電気機器": {
        "日立製作所":"6501.T","三菱電機":"6503.T","富士電機":"6504.T","安川電機":"6506.T",
        "NEC":"6701.T","富士通":"6702.T","ソニーグループ":"6758.T","パナソニックHD":"6752.T",
        "TDK":"6762.T","京セラ":"6971.T","村田製作所":"6981.T","オムロン":"6645.T",
        "キーエンス":"6861.T","ファナック":"6954.T","アドバンテスト":"6857.T",
        "東京エレクトロン":"8035.T","ルネサス":"6723.T","レーザーテック":"6920.T",
        "ディスコ":"6146.T","オリンパス":"7733.T","HOYA":"7741.T","テルモ":"4543.T",
        "キヤノン":"7751.T","ニコン":"7731.T","シスメックス":"6869.T",
    },
    "日経225｜素材・化学": {
        "信越化学工業":"4063.T","住友化学":"4005.T","旭化成":"3407.T","三菱ケミカルG":"4188.T",
        "花王":"4452.T","富士フイルムHD":"4901.T","日東電工":"6988.T",
        "武田薬品工業":"4502.T","アステラス製薬":"4503.T","第一三共":"4568.T",
        "中外製薬":"4519.T","エーザイ":"4523.T","大塚HD":"4578.T","塩野義製薬":"4507.T",
        "ENEOS HD":"5020.T","出光興産":"5019.T","ブリヂストン":"5108.T",
        "AGC":"5201.T","日本製鉄":"5401.T","JFE HD":"5411.T","神戸製鋼所":"5406.T",
        "住友金属鉱山":"5713.T","DOWAホールディングス":"5714.T",
    },
    "日経225｜資本財・機械": {
        "クボタ":"6326.T","コマツ":"6301.T","SMC":"6273.T","ダイキン工業":"6367.T",
        "三菱重工業":"7011.T","川崎重工業":"7012.T","IHI":"7013.T",
        "住友重機械工業":"6302.T","荏原製作所":"6361.T","日立建機":"6305.T",
        "ミネベアミツミ":"6479.T","日本精工":"6471.T",
        "大林組":"1802.T","清水建設":"1803.T","鹿島建設":"1812.T","大成建設":"1801.T",
        "大和ハウス工業":"1925.T","積水ハウス":"1928.T",
    },
    "日経225｜消費・サービス": {
        "トヨタ自動車":"7203.T","ホンダ":"7267.T","日産自動車":"7201.T",
        "マツダ":"7261.T","スズキ":"7269.T","デンソー":"6902.T",
        "任天堂":"7974.T","バンダイナムコHD":"7832.T","コナミグループ":"9766.T",
        "ファーストリテイリング":"9983.T","セブン&アイHD":"3382.T","イオン":"8267.T",
        "ニトリHD":"9843.T","ZOZO":"3092.T","リクルートHD":"6098.T",
        "オリエンタルランド":"4661.T","味の素":"2802.T","キリンHD":"2503.T",
        "日清食品HD":"2897.T","アサヒグループHD":"2502.T",
    },
    "日経225｜金融": {
        "三菱UFJ FG":"8306.T","三井住友FG":"8316.T","みずほFG":"8411.T","りそなHD":"8308.T",
        "野村HD":"8604.T","大和証券G":"8601.T","日本取引所G":"8697.T",
        "東京海上HD":"8766.T","MS&AD保険G":"8725.T","SOMPO HD":"8630.T",
        "第一生命HD":"8750.T","T&D HD":"8795.T","オリックス":"8591.T",
        "三井不動産":"8801.T","三菱地所":"8802.T",
    },
    "日経225｜運輸・通信": {
        "JR東日本":"9020.T","JR東海":"9022.T","JR西日本":"9021.T",
        "東急":"9005.T","近鉄グループHD":"9041.T","小田急電鉄":"9007.T",
        "ヤマトHD":"9064.T","SGホールディングス":"9143.T",
        "日本郵船":"9101.T","商船三井":"9104.T","川崎汽船":"9107.T",
        "JAL":"9201.T","ANA HD":"9202.T",
        "NTT":"9432.T","KDDI":"9433.T","ソフトバンク":"9434.T",
        "三菱商事":"8058.T","三井物産":"8031.T","伊藤忠商事":"8001.T",
        "住友商事":"8053.T","丸紅":"8002.T",
    },
    # ── TOPIX ──
    "TOPIX｜Core30（時価総額最上位）": {
        "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
        "キーエンス":"6861.T","東京エレクトロン":"8035.T","信越化学工業":"4063.T",
        "ファーストリテイリング":"9983.T","リクルートHD":"6098.T","三菱商事":"8058.T",
        "三井物産":"8031.T","KDDI":"9433.T","NTT":"9432.T",
        "ソフトバンクG":"9984.T","任天堂":"7974.T","デンソー":"6902.T",
        "ダイキン工業":"6367.T","日立製作所":"6501.T","中外製薬":"4519.T",
        "第一三共":"4568.T","ホンダ":"7267.T","伊藤忠商事":"8001.T",
        "三井住友FG":"8316.T","みずほFG":"8411.T","東京海上HD":"8766.T",
        "武田薬品工業":"4502.T","村田製作所":"6981.T","ファナック":"6954.T",
        "富士通":"6702.T","花王":"4452.T","オリックス":"8591.T",
    },
    "TOPIX｜Large70（大型株）": {
        "パナソニックHD":"6752.T","住友商事":"8053.T","丸紅":"8002.T",
        "三菱電機":"6503.T","アドバンテスト":"6857.T","レーザーテック":"6920.T",
        "ルネサス":"6723.T","TDK":"6762.T","富士フイルムHD":"4901.T",
        "日本製鉄":"5401.T","住友金属鉱山":"5713.T","三菱重工業":"7011.T",
        "川崎重工業":"7012.T","IHI":"7013.T","コマツ":"6301.T","クボタ":"6326.T",
        "ブリヂストン":"5108.T","旭化成":"3407.T","三菱ケミカルG":"4188.T",
        "大塚HD":"4578.T","アステラス製薬":"4503.T","テルモ":"4543.T",
        "HOYA":"7741.T","京セラ":"6971.T","オムロン":"6645.T","SMC":"6273.T",
        "三井不動産":"8801.T","三菱地所":"8802.T","日本取引所G":"8697.T",
        "野村HD":"8604.T","MS&AD保険G":"8725.T","第一生命HD":"8750.T",
        "JR東日本":"9020.T","JR東海":"9022.T","日本郵船":"9101.T",
        "商船三井":"9104.T","川崎汽船":"9107.T","セブン&アイHD":"3382.T",
        "イオン":"8267.T","ニトリHD":"9843.T","大和証券G":"8601.T","りそなHD":"8308.T",
        "バンダイナムコHD":"7832.T","キヤノン":"7751.T","JAL":"9201.T","ANA HD":"9202.T",
    },
    # ── 市場区分 ──
    "プライム市場（主要銘柄）": {
        "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
        "キーエンス":"6861.T","東京エレクトロン":"8035.T","ファーストリテイリング":"9983.T",
        "信越化学工業":"4063.T","リクルートHD":"6098.T","三菱商事":"8058.T",
        "KDDI":"9433.T","任天堂":"7974.T","ダイキン工業":"6367.T",
        "日立製作所":"6501.T","三井住友FG":"8316.T","ホンダ":"7267.T",
        "中外製薬":"4519.T","東京海上HD":"8766.T","村田製作所":"6981.T",
        "ファナック":"6954.T","三井物産":"8031.T",
    },
    "スタンダード市場（注目銘柄）": {
        "静岡銀行":"8355.T","広島銀行":"8379.T","七十七銀行":"8341.T",
        "東邦銀行":"8346.T","滋賀銀行":"8366.T","琉球銀行":"8399.T",
        "名村造船所":"7014.T","内海造船":"7018.T","三井E&S":"7003.T",
        "太平洋金属":"5441.T","東京製鐵":"5423.T","大和工業":"5444.T",
        "トーセイ":"8923.T","タカラレーベン":"8897.T",
        "ビックカメラ":"3048.T","DCMホールディングス":"3050.T",
    },
    "グロース市場（注目銘柄）": {
        "さくらインターネット":"3778.T","メルカリ":"4385.T",
        "サイバーセキュリティクラウド":"4493.T","FFRIセキュリティ":"3692.T",
        "メドレー":"4480.T","ケアネット":"2150.T","レノバ":"9519.T",
        "ACSL":"6232.T","Appier Group":"4180.T","弁護士ドットコム":"6027.T",
        "freee":"4478.T","マネーフォワード":"3994.T","BASE":"4477.T",
        "Sansan":"4443.T","ラクス":"3923.T","プレイド":"4165.T",
    },
}

# セグメントのグループ分け
SEGMENT_GROUPS = {
    "日経225": [k for k in MARKET_SEGMENTS if k.startswith("日経225")],
    "TOPIX":   [k for k in MARKET_SEGMENTS if k.startswith("TOPIX")],
    "市場区分": [k for k in MARKET_SEGMENTS if any(k.startswith(x) for x in ["プライム","スタンダード","グロース"])],
}


def _is_cache_valid(key):
    return key in _cache and time.time() - _cache[key]["ts"] < _CACHE_TTL


def _robust_avg(pcts):
    if not pcts: return 0.0
    if len(pcts) <= 3: return round(float(np.mean(pcts)), 2)
    arr = np.array(pcts)
    q1, q3 = np.percentile(arr, 25), np.percentile(arr, 75)
    iqr = q3 - q1
    f = arr[(arr >= q1 - 3*iqr) & (arr <= q3 + 3*iqr)]
    return round(float(f.mean() if len(f) > 0 else np.median(arr)), 2)


def _fetch_single_full(ticker, period):
    try:
        df = yf.Ticker(ticker).history(period=period, interval="1d", auto_adjust=True)
        if df is None or len(df) < 2: return None
        df.index = df.index.tz_localize(None)
        cl = df["Close"]
        if (cl <= 0).any() or cl.isna().any(): return None
        if (cl.pct_change().abs().dropna() > 49).any(): return None
        pct = (cl.iloc[-1] / cl.iloc[0] - 1) * 100
        if abs(pct) > 500: return None
        half = max(len(df) // 2, 1)
        rv = float(df["Volume"].tail(half).mean())
        pv = float(df["Volume"].head(half).mean())
        last_price = float(cl.iloc[-1])
        trade_value = rv * last_price
        vol_chg = round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0
        # 前日比
        day_chg = round((cl.iloc[-1] - cl.iloc[-2]) / cl.iloc[-2] * 100, 2) if len(cl) >= 2 else None
        return {
            "pct": round(float(pct), 2),
            "volume": int(rv), "volume_chg": vol_chg,
            "trade_value": int(trade_value),
            "price": round(last_price, 0),
            "day_chg": day_chg,
        }
    except: return None


def _fetch_single(ticker, period):
    d = _fetch_single_full(ticker, period)
    return d["pct"] if d else None


def _fetch_daily_series(ticker, period):
    try:
        df = yf.Ticker(ticker).history(period=period, interval="1d", auto_adjust=True)
        if df is None or len(df) < 2: return None
        df.index = df.index.tz_localize(None)
        cl = df["Close"]
        if (cl <= 0).any() or cl.isna().any(): return None
        if (cl.pct_change().abs().dropna() > 49).any(): return None
        cum = (cl / cl.iloc[0] - 1) * 100
        if cum.abs().max() > 500: return None
        return cum
    except: return None


def fetch_theme_results(themes, period):
    cache_key = f"themes_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    results = []
    for theme_name, stocks in themes.items():
        pcts, vols, tvs, vol_chgs = [], [], [], []
        with ThreadPoolExecutor(max_workers=8) as ex:
            futs = {ex.submit(_fetch_single_full, t, period): t for t in stocks.values()}
            for fut in as_completed(futs):
                d = fut.result()
                if d:
                    pcts.append(d["pct"]); vols.append(d["volume"])
                    tvs.append(d["trade_value"]); vol_chgs.append(d["volume_chg"])
        avg_pct = _robust_avg(pcts)
        results.append({
            "theme": theme_name, "pct": avg_pct, "up": avg_pct >= 0,
            "stock_count": len(stocks), "volume": int(sum(vols)),
            "volume_chg": round(float(np.mean(vol_chgs)) if vol_chgs else 0, 1),
            "trade_value": int(sum(tvs)),
        })
    results.sort(key=lambda x: x["pct"], reverse=True)
    _cache[cache_key] = {"ts": time.time(), "data": results}
    return results


def fetch_segment_detail(seg_name, period):
    """市場セグメントの個別株詳細を取得"""
    cache_key = f"seg_detail_{seg_name}_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]

    stocks = MARKET_SEGMENTS.get(seg_name, {})
    stock_results = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(_fetch_single_full, ticker, period): (name, ticker)
                for name, ticker in stocks.items()}
        for fut in as_completed(futs):
            name, ticker = futs[fut]
            d = fut.result()
            if d:
                stock_results.append({"name": name, "ticker": ticker, **d})

    stock_results.sort(key=lambda x: x["pct"], reverse=True)

    # 寄与度計算
    total_abs = sum(abs(s["pct"]) for s in stock_results) or 1
    for s in stock_results:
        s["contribution"] = round(s["pct"] / total_abs * 100, 1)

    # 出来高・売買代金ランキング
    vol_sorted = sorted(enumerate(stock_results), key=lambda x: x[1]["volume"], reverse=True)
    tv_sorted  = sorted(enumerate(stock_results), key=lambda x: x[1]["trade_value"], reverse=True)
    vol_rank = {i: r+1 for r, (i, _) in enumerate(vol_sorted)}
    tv_rank  = {i: r+1 for r, (i, _) in enumerate(tv_sorted)}
    for i, s in enumerate(stock_results):
        s["vol_rank"] = vol_rank.get(i, "-")
        s["tv_rank"]  = tv_rank.get(i, "-")

    avg_pct = _robust_avg([s["pct"] for s in stock_results])
    result = {"avg": avg_pct, "stocks": stock_results}
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_theme_detail(themes, theme_name, period):
    """テーマの個別株詳細を取得"""
    cache_key = f"theme_detail_{theme_name}_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]

    stocks = themes.get(theme_name, {})
    stock_results = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(_fetch_single_full, ticker, period): (name, ticker)
                for name, ticker in stocks.items()}
        for fut in as_completed(futs):
            name, ticker = futs[fut]
            d = fut.result()
            if d:
                stock_results.append({"name": name, "ticker": ticker, **d})

    stock_results.sort(key=lambda x: x["pct"], reverse=True)
    total_abs = sum(abs(s["pct"]) for s in stock_results) or 1
    for s in stock_results:
        s["contribution"] = round(s["pct"] / total_abs * 100, 1)

    vol_sorted = sorted(enumerate(stock_results), key=lambda x: x[1]["volume"], reverse=True)
    tv_sorted  = sorted(enumerate(stock_results), key=lambda x: x[1]["trade_value"], reverse=True)
    vol_rank = {i: r+1 for r, (i, _) in enumerate(vol_sorted)}
    tv_rank  = {i: r+1 for r, (i, _) in enumerate(tv_sorted)}
    for i, s in enumerate(stock_results):
        s["vol_rank"] = vol_rank.get(i, "-")
        s["tv_rank"]  = tv_rank.get(i, "-")

    avg_pct = _robust_avg([s["pct"] for s in stock_results])
    result = {"theme": theme_name, "avg": avg_pct, "stocks": stock_results}
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_market_segments(period):
    cache_key = f"market_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    result = {}
    for seg_name, stocks in MARKET_SEGMENTS.items():
        pcts = []
        with ThreadPoolExecutor(max_workers=8) as ex:
            futs = {ex.submit(_fetch_single, ticker, period): ticker for ticker in stocks.values()}
            for fut in as_completed(futs):
                v = fut.result()
                if v is not None: pcts.append(v)
        result[seg_name] = {"avg": _robust_avg(pcts), "count": len(stocks)}
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_theme_trend(themes, theme_name, period):
    cache_key = f"trend_{theme_name}_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    stocks = themes.get(theme_name, {})
    series_list = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(_fetch_daily_series, t, period): t for t in stocks.values()}
        for fut in as_completed(futs):
            s = fut.result()
            if s is not None: series_list.append(s)
    if not series_list: return []
    combined = pd.concat(series_list, axis=1).sort_index().ffill()
    def _robust_row(row):
        v = row.dropna()
        if len(v) == 0: return np.nan
        if len(v) <= 3: return v.mean()
        q1, q3 = v.quantile(0.25), v.quantile(0.75)
        iqr = q3 - q1
        f = v[(v >= q1-3*iqr) & (v <= q3+3*iqr)]
        return f.mean() if len(f) > 0 else v.median()
    avg_series = combined.apply(_robust_row, axis=1).round(2)
    result = [{"date": str(d.date()), "pct": float(v)} for d, v in avg_series.items()]
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_momentum_data(themes, period):
    cache_key = f"momentum_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    now_map = {r["theme"]: r["pct"] for r in fetch_theme_results(themes, period)}
    w1_map  = {r["theme"]: r["pct"] for r in fetch_theme_results(themes, "5d")}
    m1_map  = {r["theme"]: r["pct"] for r in fetch_theme_results(themes, "1mo")}
    result = []
    for theme_name, cur in now_map.items():
        dw = round(cur - w1_map.get(theme_name, cur), 2)
        dm = round(cur - m1_map.get(theme_name, cur), 2)
        if   dw > 3  and dm > 5:  state = "🔥加速"
        elif dw < -3 and dm < -5: state = "❄️失速"
        elif dw > 2:               state = "↗転換↑"
        elif dw < -2:              state = "↘転換↓"
        else:                      state = "→横ばい"
        result.append({"theme": theme_name, "pct": cur, "week_diff": dw, "month_diff": dm, "state": state})
    result.sort(key=lambda x: x["pct"], reverse=True)
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_heatmap_data(themes):
    cache_key = "heatmap"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    periods = {"1W": "5d", "1M": "1mo", "3M": "3mo", "6M": "6mo", "1Y": "1y"}
    result = {}
    for theme_name, stocks in themes.items():
        tr = {pl: [] for pl in periods}
        for ticker in stocks.values():
            for pl, pc in periods.items():
                v = _fetch_single(ticker, pc)
                if v is not None: tr[pl].append(v)
        result[theme_name] = {pl: round(sum(v)/len(v),2) if v else None for pl, v in tr.items()}
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result


def fetch_monthly_heatmap(themes):
    cache_key = "monthly_heatmap"
    if _is_cache_valid(cache_key):
        d = _cache[cache_key]["data"]
        return d["heatmap"], d["months"]
    today = pd.Timestamp.now()
    months = [(today - pd.DateOffset(months=i)).strftime("%Y/%m") for i in range(11,-1,-1)]
    monthly_data = {}
    for theme_name, stocks in themes.items():
        accum = {m: [] for m in months}
        for ticker in stocks.values():
            try:
                df = yf.Ticker(ticker).history(period="2y", interval="1d", auto_adjust=True)
                if df is None or len(df) < 2: continue
                df.index = df.index.tz_localize(None)
                for m_label in months:
                    yr, mo = int(m_label[:4]), int(m_label[5:])
                    mdf = df[(df.index.year==yr)&(df.index.month==mo)]
                    if len(mdf) < 2: continue
                    s, e = mdf["Close"].iloc[0], mdf["Close"].iloc[-1]
                    if s > 0: accum[m_label].append(round((e-s)/s*100,2))
            except: pass
        monthly_data[theme_name] = {m: round(sum(v)/len(v),2) if v else None for m, v in accum.items()}
    _cache[cache_key] = {"ts": time.time(), "data": {"heatmap": monthly_data, "months": months}}
    return monthly_data, months


def fetch_macro_data(period):
    cache_key = f"macro_{period}"
    if _is_cache_valid(cache_key): return _cache[cache_key]["data"]
    result = {}
    for name, ticker in MACRO_TICKERS.items():
        series = _fetch_daily_series(ticker, period)
        if series is not None:
            result[name] = [{"date": str(d.date()), "pct": float(v)} for d, v in series.items()]
    _cache[cache_key] = {"ts": time.time(), "data": result}
    return result
