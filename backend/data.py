"""
data.py — 完全最適化版
- 全銘柄を一度だけ取得（重複排除）
- 2年分データを一括取得して各期間を切り出し
- ファイルキャッシュ（再起動後も即時返答）
- 並列処理最適化
"""
import yfinance as yf
import numpy as np
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import threading
import os
import json
import hashlib

# ── キャッシュ設定 ──
_mem_cache: dict = {}          # メモリキャッシュ
_CACHE_TTL   = 7200            # 2時間
_FILE_CACHE_DIR = "/tmp/swjp_cache"  # ファイルキャッシュ場所
os.makedirs(_FILE_CACHE_DIR, exist_ok=True)

_invalid_tickers: set = set()  # 無効銘柄キャッシュ

# ── マクロ指標 ──
MACRO_TICKERS = {
    "日経平均": "^N225", "TOPIX": "^TOPX", "S&P500": "^GSPC",
    "ドル円": "JPY=X", "ナスダック": "^IXIC", "VIX": "^VIX",
}

# ── 市場セグメント ──
MARKET_SEGMENTS = {
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
        "住友金属鉱山":"5713.T",
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
        "ニトリHD":"9843.T","リクルートHD":"6098.T",
        "オリエンタルランド":"4661.T","味の素":"2802.T","キリンHD":"2503.T",
        "日清食品HD":"2897.T","アサヒグループHD":"2502.T",
    },
    "日経225｜金融": {
        "三菱UFJ FG":"8306.T","三井住友FG":"8316.T","みずほFG":"8411.T","りそなHD":"8308.T",
        "野村HD":"8604.T","大和証券G":"8601.T","日本取引所G":"8697.T",
        "東京海上HD":"8766.T","MS&AD保険G":"8725.T","SOMPO HD":"8630.T",
        "第一生命HD":"8750.T","オリックス":"8591.T",
        "三井不動産":"8801.T","三菱地所":"8802.T",
    },
    "日経225｜運輸・通信": {
        "JR東日本":"9020.T","JR東海":"9022.T","JR西日本":"9021.T",
        "東急":"9005.T","小田急電鉄":"9007.T",
        "ヤマトHD":"9064.T","SGホールディングス":"9143.T",
        "日本郵船":"9101.T","商船三井":"9104.T","川崎汽船":"9107.T",
        "JAL":"9201.T","ANA HD":"9202.T",
        "NTT":"9432.T","KDDI":"9433.T","ソフトバンク":"9434.T",
        "三菱商事":"8058.T","三井物産":"8031.T","伊藤忠商事":"8001.T",
        "住友商事":"8053.T","丸紅":"8002.T",
    },
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
        "東京製鐵":"5423.T","大和工業":"5444.T","三井E&S":"7003.T",
        "トーセイ":"8923.T","ビックカメラ":"3048.T","DCMホールディングス":"3050.T",
        "テレビ東京HD":"9413.T","松竹":"9601.T",
    },
    "グロース市場（注目銘柄）": {
        "さくらインターネット":"3778.T","メルカリ":"4385.T",
        "Appier Group":"4180.T","弁護士ドットコム":"6027.T",
        "freee":"4478.T","マネーフォワード":"3994.T","BASE":"4477.T",
        "Sansan":"4443.T","ラクス":"3923.T","プレイド":"4165.T",
    },
}

SEGMENT_GROUPS = {
    "日経225": [k for k in MARKET_SEGMENTS if k.startswith("日経225")],
    "TOPIX":   [k for k in MARKET_SEGMENTS if k.startswith("TOPIX")],
    "市場区分": [k for k in MARKET_SEGMENTS if any(k.startswith(x) for x in ["プライム","スタンダード","グロース"])],
}


# ── キャッシュユーティリティ ──

def _cache_key_hash(key: str) -> str:
    return hashlib.md5(key.encode()).hexdigest()

def _file_cache_path(key: str) -> str:
    return os.path.join(_FILE_CACHE_DIR, _cache_key_hash(key) + ".json")

def _load_file_cache(key: str):
    """ファイルキャッシュから読み込み"""
    path = _file_cache_path(key)
    try:
        if not os.path.exists(path):
            return None
        mtime = os.path.getmtime(path)
        if time.time() - mtime > _CACHE_TTL:
            return None
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

def _save_file_cache(key: str, data):
    """ファイルキャッシュに保存"""
    path = _file_cache_path(key)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
    except Exception:
        pass

def _is_cache_valid(key: str) -> bool:
    if key in _mem_cache:
        if time.time() - _mem_cache[key]["ts"] < _CACHE_TTL:
            return True
    return False

def _get_cache(key: str):
    """メモリ→ファイルの順で取得"""
    if _is_cache_valid(key):
        return _mem_cache[key]["data"]
    file_data = _load_file_cache(key)
    if file_data is not None:
        _mem_cache[key] = {"ts": time.time(), "data": file_data}
        return file_data
    return None

def _set_cache(key: str, data):
    """メモリとファイルの両方に保存"""
    _mem_cache[key] = {"ts": time.time(), "data": data}
    _save_file_cache(key, data)


# ── 共有データストア（全銘柄を一度だけ取得）──

_all_ticker_data: dict = {}      # ticker -> DataFrame（2年分）
_all_ticker_lock  = threading.Lock()
_ticker_fetch_done: set = set()


def _robust_avg(pcts: list) -> float:
    if not pcts: return 0.0
    if len(pcts) <= 3: return round(float(np.mean(pcts)), 2)
    arr = np.array(pcts)
    q1, q3 = np.percentile(arr, 25), np.percentile(arr, 75)
    iqr = q3 - q1
    f = arr[(arr >= q1 - 3*iqr) & (arr <= q3 + 3*iqr)]
    return round(float(f.mean() if len(f) > 0 else np.median(arr)), 2)


def _fetch_ticker_2y(ticker: str) -> pd.DataFrame | None:
    """2年分データを一括取得（auto_adjust=Trueで分割調整済み）"""
    if ticker in _invalid_tickers:
        return None
    try:
        df = yf.Ticker(ticker).history(
            period="2y", interval="1d",
            auto_adjust=True, repair=True,
            timeout=12,
        )
        if df is None or len(df) < 5:
            _invalid_tickers.add(ticker)
            return None
        df.index = df.index.tz_localize(None)
        cl = df["Close"].dropna()
        if (cl <= 0).any():
            _invalid_tickers.add(ticker)
            return None
        return df
    except Exception:
        _invalid_tickers.add(ticker)
        return None


def _get_period_df(df: pd.DataFrame, period: str) -> pd.DataFrame | None:
    """2年分DataFrameから指定期間を切り出す"""
    if df is None or len(df) < 2:
        return None
    now = pd.Timestamp.now()
    period_map = {
        "5d":  now - pd.Timedelta(days=7),
        "1mo": now - pd.DateOffset(months=1),
        "3mo": now - pd.DateOffset(months=3),
        "6mo": now - pd.DateOffset(months=6),
        "1y":  now - pd.DateOffset(years=1),
        "2y":  now - pd.DateOffset(years=2),
    }
    cutoff = period_map.get(period, now - pd.DateOffset(months=1))
    result = df[df.index >= cutoff]
    return result if len(result) >= 2 else None


def _calc_metrics_from_df(df: pd.DataFrame) -> dict | None:
    """DataFrameから各種指標を計算"""
    try:
        if df is None or len(df) < 2:
            return None
        cl = df["Close"].dropna()
        if len(cl) < 2:
            return None
        daily_chg = cl.pct_change().abs().dropna()
        if (daily_chg > 0.99).any():
            return None
        pct = (cl.iloc[-1] / cl.iloc[0] - 1) * 100
        if abs(pct) > 1000:
            return None
        half = max(len(df) // 2, 1)
        vol  = df["Volume"].dropna()
        rv   = float(vol.tail(half).mean()) if len(vol) > 0 else 0
        pv   = float(vol.head(half).mean()) if len(vol) > 0 else 0
        last_price  = float(cl.iloc[-1])
        trade_value = rv * last_price
        vol_chg     = round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0
        day_chg     = round((cl.iloc[-1] - cl.iloc[-2]) / cl.iloc[-2] * 100, 2) if len(cl) >= 2 else None
        return {
            "pct": round(float(pct), 2),
            "volume": int(rv), "volume_chg": vol_chg,
            "trade_value": int(trade_value),
            "price": round(last_price, 0),
            "day_chg": day_chg,
        }
    except Exception:
        return None


def _ensure_ticker_loaded(ticker: str):
    """指定銘柄のデータがなければ取得"""
    with _all_ticker_lock:
        if ticker in _ticker_fetch_done:
            return
    df = _fetch_ticker_2y(ticker)
    with _all_ticker_lock:
        if df is not None:
            _all_ticker_data[ticker] = df
        _ticker_fetch_done.add(ticker)


def _preload_all_tickers(all_tickers: list):
    """全ユニーク銘柄を並列一括取得（重複排除済み）"""
    unique = [t for t in set(all_tickers) if t not in _ticker_fetch_done]
    if not unique:
        return
    print(f"Preloading {len(unique)} unique tickers...")
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = {ex.submit(_fetch_ticker_2y, t): t for t in unique}
        for fut in as_completed(futs):
            ticker = futs[fut]
            df = fut.result()
            with _all_ticker_lock:
                if df is not None:
                    _all_ticker_data[ticker] = df
                _ticker_fetch_done.add(ticker)
    print(f"Preload complete. Valid: {len(_all_ticker_data)}, Invalid: {len(_invalid_tickers)}")


def _get_ticker_metrics(ticker: str, period: str) -> dict | None:
    """キャッシュ済みDataFrameから指標を計算"""
    with _all_ticker_lock:
        df = _all_ticker_data.get(ticker)
    if df is None:
        # まだ取得されていなければ即時取得
        _ensure_ticker_loaded(ticker)
        with _all_ticker_lock:
            df = _all_ticker_data.get(ticker)
    if df is None:
        return None
    period_df = _get_period_df(df, period)
    return _calc_metrics_from_df(period_df)


def _get_ticker_series(ticker: str, period: str) -> pd.Series | None:
    """累積騰落率の時系列を返す"""
    with _all_ticker_lock:
        df = _all_ticker_data.get(ticker)
    if df is None:
        _ensure_ticker_loaded(ticker)
        with _all_ticker_lock:
            df = _all_ticker_data.get(ticker)
    if df is None:
        return None
    try:
        period_df = _get_period_df(df, period)
        if period_df is None:
            return None
        cl  = period_df["Close"].dropna()
        cum = (cl / cl.iloc[0] - 1) * 100
        if cum.abs().max() > 1000:
            return None
        return cum
    except Exception:
        return None


# ── メイン API 関数 ──

def fetch_theme_results(themes: dict, period: str) -> list[dict]:
    cache_key = f"themes_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    results = []
    for theme_name, stocks in themes.items():
        pcts, vols, tvs, vol_chgs = [], [], [], []
        for name, ticker in stocks.items():
            if ticker in _invalid_tickers:
                continue
            d = _get_ticker_metrics(ticker, period)
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
    _set_cache(cache_key, results)
    return results


def fetch_segment_detail(seg_name: str, period: str) -> dict:
    cache_key = f"seg_detail_{seg_name}_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    stocks = MARKET_SEGMENTS.get(seg_name, {})
    stock_results = []
    for name, ticker in stocks.items():
        if ticker in _invalid_tickers:
            continue
        d = _get_ticker_metrics(ticker, period)
        if d:
            stock_results.append({"name": name, "ticker": ticker, **d})

    stock_results.sort(key=lambda x: x["pct"], reverse=True)
    total_abs = sum(abs(s["pct"]) for s in stock_results) or 1
    for s in stock_results:
        s["contribution"] = round(s["pct"] / total_abs * 100, 1)

    vol_sorted = sorted(enumerate(stock_results), key=lambda x: x[1]["volume"], reverse=True)
    tv_sorted  = sorted(enumerate(stock_results), key=lambda x: x[1]["trade_value"], reverse=True)
    for r, (i, _) in enumerate(vol_sorted): stock_results[i]["vol_rank"] = r + 1
    for r, (i, _) in enumerate(tv_sorted):  stock_results[i]["tv_rank"]  = r + 1

    result = {"avg": _robust_avg([s["pct"] for s in stock_results]), "stocks": stock_results}
    _set_cache(cache_key, result)
    return result


def fetch_theme_detail(themes: dict, theme_name: str, period: str) -> dict:
    cache_key = f"theme_detail_{theme_name}_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    stocks = themes.get(theme_name, {})
    stock_results = []
    for name, ticker in stocks.items():
        if ticker in _invalid_tickers:
            continue
        d = _get_ticker_metrics(ticker, period)
        if d:
            stock_results.append({"name": name, "ticker": ticker, **d})

    stock_results.sort(key=lambda x: x["pct"], reverse=True)
    total_abs = sum(abs(s["pct"]) for s in stock_results) or 1
    for s in stock_results:
        s["contribution"] = round(s["pct"] / total_abs * 100, 1)

    vol_sorted = sorted(enumerate(stock_results), key=lambda x: x[1]["volume"], reverse=True)
    tv_sorted  = sorted(enumerate(stock_results), key=lambda x: x[1]["trade_value"], reverse=True)
    for r, (i, _) in enumerate(vol_sorted): stock_results[i]["vol_rank"] = r + 1
    for r, (i, _) in enumerate(tv_sorted):  stock_results[i]["tv_rank"]  = r + 1

    result = {"theme": theme_name, "avg": _robust_avg([s["pct"] for s in stock_results]), "stocks": stock_results}
    _set_cache(cache_key, result)
    return result


def fetch_market_segments(period: str) -> dict:
    cache_key = f"market_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    result = {}
    for seg_name, stocks in MARKET_SEGMENTS.items():
        pcts = []
        for ticker in stocks.values():
            if ticker in _invalid_tickers:
                continue
            d = _get_ticker_metrics(ticker, period)
            if d:
                pcts.append(d["pct"])
        result[seg_name] = {"avg": _robust_avg(pcts), "count": len(stocks)}

    _set_cache(cache_key, result)
    return result


def fetch_theme_trend(themes: dict, theme_name: str, period: str) -> list[dict]:
    cache_key = f"trend_{theme_name}_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    stocks = themes.get(theme_name, {})
    series_list = []
    for ticker in stocks.values():
        if ticker in _invalid_tickers:
            continue
        s = _get_ticker_series(ticker, period)
        if s is not None:
            series_list.append(s)

    if not series_list:
        return []

    combined = pd.concat(series_list, axis=1).sort_index().ffill()

    def _robust_row(row):
        v = row.dropna()
        if len(v) == 0: return np.nan
        if len(v) <= 3: return v.mean()
        q1, q3 = v.quantile(0.25), v.quantile(0.75)
        iqr = q3 - q1
        f = v[(v >= q1 - 3*iqr) & (v <= q3 + 3*iqr)]
        return f.mean() if len(f) > 0 else v.median()

    avg_series = combined.apply(_robust_row, axis=1).round(2)
    result = [{"date": str(d.date()), "pct": float(v)} for d, v in avg_series.items()]
    _set_cache(cache_key, result)
    return result


def fetch_momentum_data(themes: dict, period: str) -> list[dict]:
    cache_key = f"momentum_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

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
    _set_cache(cache_key, result)
    return result


def fetch_heatmap_data(themes: dict) -> dict:
    cache_key = "heatmap"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    periods = {"1W": "5d", "1M": "1mo", "3M": "3mo", "6M": "6mo", "1Y": "1y"}
    result = {}
    for theme_name, stocks in themes.items():
        tr = {pl: [] for pl in periods}
        for ticker in stocks.values():
            if ticker in _invalid_tickers:
                continue
            for pl, pc in periods.items():
                d = _get_ticker_metrics(ticker, pc)
                if d:
                    tr[pl].append(d["pct"])
        result[theme_name] = {
            pl: round(sum(v) / len(v), 2) if v else None
            for pl, v in tr.items()
        }

    _set_cache(cache_key, result)
    return result


def fetch_monthly_heatmap(themes: dict):
    cache_key = "monthly_heatmap"
    cached = _get_cache(cache_key)
    if cached:
        return cached["heatmap"], cached["months"]

    today  = pd.Timestamp.now()
    months = [(today - pd.DateOffset(months=i)).strftime("%Y/%m") for i in range(11, -1, -1)]
    monthly_data = {}

    for theme_name, stocks in themes.items():
        accum = {m: [] for m in months}
        for ticker in stocks.values():
            if ticker in _invalid_tickers:
                continue
            with _all_ticker_lock:
                df = _all_ticker_data.get(ticker)
            if df is None:
                continue
            try:
                for m_label in months:
                    yr, mo = int(m_label[:4]), int(m_label[5:])
                    mdf = df[(df.index.year == yr) & (df.index.month == mo)]
                    if len(mdf) < 2:
                        continue
                    s, e = mdf["Close"].iloc[0], mdf["Close"].iloc[-1]
                    if s > 0:
                        accum[m_label].append(round((e - s) / s * 100, 2))
            except Exception:
                pass
        monthly_data[theme_name] = {
            m: round(sum(v) / len(v), 2) if v else None
            for m, v in accum.items()
        }

    data = {"heatmap": monthly_data, "months": months}
    _set_cache(cache_key, data)
    return monthly_data, months


def fetch_macro_data(period: str) -> dict:
    cache_key = f"macro_{period}"
    cached = _get_cache(cache_key)
    if cached:
        return cached

    result = {}
    for name, ticker in MACRO_TICKERS.items():
        s = _get_ticker_series(ticker, period)
        if s is not None:
            result[name] = [{"date": str(d.date()), "pct": float(v)} for d, v in s.items()]

    _set_cache(cache_key, result)
    return result


def _collect_all_tickers(themes: dict) -> list:
    """全テーマ＋セグメント＋マクロのユニークティッカー一覧"""
    tickers = set()
    for stocks in themes.values():
        tickers.update(stocks.values())
    for stocks in MARKET_SEGMENTS.values():
        tickers.update(stocks.values())
    tickers.update(MACRO_TICKERS.values())
    return list(tickers)


def warmup_cache_extended(themes: dict):
    """起動時に全ユニーク銘柄を一括先読みし、主要キャッシュを生成"""
    def _warmup():
        print("=== Cache warmup started ===")
        all_tickers = _collect_all_tickers(themes)
        print(f"Total unique tickers: {len(all_tickers)}")

        # 全銘柄を並列一括取得
        _preload_all_tickers(all_tickers)

        # 主要キャッシュを生成
        for period in ["1mo", "5d", "3mo"]:
            try:
                fetch_theme_results(themes, period)
                print(f"Theme results cached: {period}")
            except Exception as e:
                print(f"Warmup error ({period}): {e}")

        try:
            fetch_macro_data("1mo")
            print("Macro data cached")
        except Exception as e:
            print(f"Macro warmup error: {e}")

        print("=== Cache warmup complete ===")

    threading.Thread(target=_warmup, daemon=True).start()


# warmup_cache は後方互換のためエイリアスを残す
warmup_cache = warmup_cache_extended
