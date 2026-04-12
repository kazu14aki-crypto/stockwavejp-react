"""
fetch_data.py — GitHub Actionsで実行するデータ取得スクリプト
yfinanceから全テーマデータを取得してJSONに保存する
"""
import yfinance as yf
import numpy as np
import pandas as pd
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import pytz

# themes.pyからTHEMESをimport（themes.pyと自動同期）
import sys as _sys
import os as _os
_sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', 'backend'))
from themes import DEFAULT_THEMES as THEMES

MACRO_TICKERS = {
    "国内主要株(1321)":          "1321.T",
    "TOPIX連動型上場投信(1306)": "1306.T",
    "S&P500 ETF(SPY)":          "SPY",
    "ドル円":                    "JPY=X",
    "米国ハイテク株100(QQQ)":   "QQQ",
}

PERIODS = ["1d", "5d", "1mo", "3mo", "6mo", "1y"]


def robust_avg(pcts):
    if not pcts: return 0.0
    if len(pcts) <= 3: return round(float(np.mean(pcts)), 2)
    arr = np.array(pcts)
    q1, q3 = np.percentile(arr, 25), np.percentile(arr, 75)
    iqr = q3 - q1
    f = arr[(arr >= q1 - 3*iqr) & (arr <= q3 + 3*iqr)]
    return round(float(f.mean() if len(f) > 0 else np.median(arr)), 2)


def fetch_ticker(ticker):
    try:
        df = yf.Ticker(ticker).history(
            period="2y", interval="1d",
            auto_adjust=True, repair=True, timeout=15
        )
        if df is None or len(df) < 5:
            print(f"  EMPTY: {ticker} → rows={len(df) if df is not None else 0}")
            return None
        df.index = df.index.tz_localize(None)
        print(f"  OK: {ticker} → {len(df)} rows, last={df.index[-1].date()}")
        return df
    except Exception as e:
        print(f"  ERROR: {ticker} → {type(e).__name__}: {e}")
        return None


def get_period_df(df, period):
    if df is None: return None
    now = pd.Timestamp.now()
    delta = {
        "1d": pd.Timedelta(days=2), "5d": pd.Timedelta(days=7),
        "1mo": pd.DateOffset(months=1),
        "3mo": pd.DateOffset(months=3), "6mo": pd.DateOffset(months=6),
        "1y": pd.DateOffset(years=1),
    }
    cutoff = now - delta.get(period, pd.DateOffset(months=1))
    result = df[df.index >= cutoff]
    return result if len(result) >= 2 else None


def calc_metrics(df):
    try:
        if df is None or len(df) < 2: return None
        cl = df["Close"].dropna()
        if len(cl) < 2 or (cl <= 0).any(): return None
        pct = (cl.iloc[-1] / cl.iloc[0] - 1) * 100
        if abs(pct) > 1000: return None
        half = max(len(df) // 2, 1)
        vol  = df["Volume"].dropna()
        rv   = float(vol.tail(half).mean()) if len(vol) > 0 else 0
        pv   = float(vol.head(half).mean()) if len(vol) > 0 else 0
        last_price = float(cl.iloc[-1])
        vol_chg    = round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0
        day_chg    = round((cl.iloc[-1] - cl.iloc[-2]) / cl.iloc[-2] * 100, 2) if len(cl) >= 2 else None
        return {
            "pct": round(float(pct), 2), "volume": int(rv),
            "volume_chg": vol_chg, "trade_value": int(rv * last_price),
            "price": round(last_price, 0), "day_chg": day_chg,
        }
    except: return None


def build_market_segments():
    """market_segmentsを構築（data.pyと同じ定義）"""
    nikkei = {
        "日経225｜技術": {
            "日立製作所":"6501.T","三菱電機":"6503.T","NEC":"6701.T","富士通":"6702.T",
            "ソニーグループ":"6758.T","パナソニックHD":"6752.T","TDK":"6762.T",
            "京セラ":"6971.T","村田製作所":"6981.T","オムロン":"6645.T",
            "キーエンス":"6861.T","ファナック":"6954.T","アドバンテスト":"6857.T",
            "東京エレクトロン":"8035.T","ルネサス":"6723.T","レーザーテック":"6920.T",
            "ディスコ":"6146.T","HOYA":"7741.T","テルモ":"4543.T","キヤノン":"7751.T",
        },
        "日経225｜金融": {
            "三菱UFJ FG":"8306.T","三井住友FG":"8316.T","みずほFG":"8411.T",
            "りそなHD":"8308.T","野村HD":"8604.T","大和証券G":"8601.T",
            "日本取引所G":"8697.T","東京海上HD":"8766.T","MS&AD保険G":"8725.T",
            "SOMPO HD":"8630.T","第一生命HD":"8750.T","オリックス":"8591.T",
        },
        "日経225｜消費": {
            "トヨタ自動車":"7203.T","ホンダ":"7267.T","日産自動車":"7201.T",
            "デンソー":"6902.T","任天堂":"7974.T","ファーストリテイリング":"9983.T",
            "セブン&アイHD":"3382.T","イオン":"8267.T","リクルートHD":"6098.T",
            "オリエンタルランド":"4661.T","味の素":"2802.T","アサヒグループHD":"2502.T",
        },
        "日経225｜素材": {
            "信越化学工業":"4063.T","旭化成":"3407.T","三菱ケミカルG":"4188.T",
            "花王":"4452.T","富士フイルムHD":"4901.T","武田薬品工業":"4502.T",
            "アステラス製薬":"4503.T","第一三共":"4568.T","中外製薬":"4519.T",
            "ENEOS HD":"5020.T","ブリヂストン":"5108.T","日本製鉄":"5401.T",
            "住友金属鉱山":"5713.T",
        },
        "日経225｜資本財・その他": {
            "クボタ":"6326.T","コマツ":"6301.T","SMC":"6273.T","ダイキン工業":"6367.T",
            "三菱重工業":"7011.T","川崎重工業":"7012.T","IHI":"7013.T",
            "大林組":"1802.T","大成建設":"1801.T","大和ハウス工業":"1925.T",
            "三井不動産":"8801.T","三菱地所":"8802.T","三菱商事":"8058.T",
            "三井物産":"8031.T","伊藤忠商事":"8001.T","住友商事":"8053.T",
        },
        "日経225｜運輸・公共": {
            "JR東日本":"9020.T","JR東海":"9022.T","日本郵船":"9101.T",
            "商船三井":"9104.T","川崎汽船":"9107.T","JAL":"9201.T","ANA HD":"9202.T",
            "NTT":"9432.T","KDDI":"9433.T","ソフトバンク":"9434.T","ソフトバンクG":"9984.T",
        },
        "国内全般｜時価総額上位50": {
            "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
            "キーエンス":"6861.T","東京エレクトロン":"8035.T","信越化学工業":"4063.T",
            "ファーストリテイリング":"9983.T","リクルートHD":"6098.T","三菱商事":"8058.T",
            "NTT":"9432.T","KDDI":"9433.T","ソフトバンクG":"9984.T","任天堂":"7974.T",
            "デンソー":"6902.T","日立製作所":"6501.T","三井物産":"8031.T",
            "中外製薬":"4519.T","伊藤忠商事":"8001.T","第一三共":"4568.T",
            "三井住友FG":"8316.T","ダイキン工業":"6367.T","ホンダ":"7267.T",
            "みずほFG":"8411.T","東京海上HD":"8766.T","武田薬品工業":"4502.T",
            "村田製作所":"6981.T","ファナック":"6954.T","富士通":"6702.T",
            "アドバンテスト":"6857.T","レーザーテック":"6920.T","花王":"4452.T",
            "オリックス":"8591.T","ソフトバンク":"9434.T","三菱電機":"6503.T",
            "SMC":"6273.T","HOYA":"7741.T","富士フイルムHD":"4901.T","ルネサス":"6723.T",
            "京セラ":"6971.T","オムロン":"6645.T","パナソニックHD":"6752.T",
            "TDK":"6762.T","住友商事":"8053.T","三菱重工業":"7011.T","川崎重工業":"7012.T",
            "テルモ":"4543.T","日本製鉄":"5401.T","コマツ":"6301.T",
            "MS&AD保険G":"8725.T","住友金属鉱山":"5713.T",
        },
        "国内全般｜上位51-100位": {
            "丸紅":"8002.T","クボタ":"6326.T","IHI":"7013.T","第一生命HD":"8750.T",
            "アステラス製薬":"4503.T","大塚HD":"4578.T","三井不動産":"8801.T",
            "三菱地所":"8802.T","ブリヂストン":"5108.T","旭化成":"3407.T",
            "三菱ケミカルG":"4188.T","日本取引所G":"8697.T","野村HD":"8604.T",
            "セブン&アイHD":"3382.T","イオン":"8267.T","JR東日本":"9020.T",
            "JR東海":"9022.T","日本郵船":"9101.T","商船三井":"9104.T","川崎汽船":"9107.T",
            "ニトリHD":"9843.T","大和証券G":"8601.T","りそなHD":"8308.T",
            "バンダイナムコHD":"7832.T","キヤノン":"7751.T","東芝":"6502.T",
            "住友電気工業":"5802.T","古河電気工業":"5801.T","フジクラ":"5803.T",
            "日東電工":"6988.T","エーザイ":"4523.T","塩野義製薬":"4507.T",
            "小野薬品":"4528.T","シスメックス":"6869.T","オリンパス":"7733.T",
            "ディスコ":"6146.T","SCREEN HD":"7735.T","東京精密":"7729.T",
            "安川電機":"6506.T","THK":"6481.T","ソシオネクスト":"6526.T",
            "キオクシアHD":"285A.T","三井金属":"5706.T","住友不動産":"8830.T",
            "東急不動産HD":"3289.T","ヒューリック":"3003.T","メルカリ":"4385.T",
            "楽天グループ":"4755.T","SBIホールディングス":"8473.T","ニッスイ":"1332.T",
        },
        "国内全般｜上位101-150位": {
            "スズキ":"7269.T","マツダ":"7261.T","スバル":"7270.T","三菱自動車":"7211.T",
            "日産自動車":"7201.T","豊田自動織機":"6201.T","アイシン":"7259.T",
            "ジェイテクト":"6473.T","日本郵政":"6178.T","ゆうちょ銀行":"7182.T",
            "かんぽ生命":"7181.T","東京電力HD":"9501.T","関西電力":"9503.T",
            "中部電力":"9502.T","九州電力":"9508.T","東北電力":"9506.T",
            "Jパワー":"9513.T","INPEX":"1605.T","ENEOS HD":"5020.T","出光興産":"5019.T",
            "コスモエネルギーHD":"5021.T","東京ガス":"9531.T","大阪ガス":"9532.T",
            "岩谷産業":"8088.T","大林組":"1802.T","鹿島建設":"1812.T",
            "大成建設":"1801.T","清水建設":"1803.T","積水ハウス":"1928.T",
            "大和ハウス工業":"1925.T","住友林業":"1911.T","トレンドマイクロ":"4704.T",
            "NEC":"6701.T","富士電機":"6504.T","横河電機":"6841.T","アズビル":"6845.T",
            "島津製作所":"7701.T","ニコン":"7731.T","AGC":"5201.T","東レ":"3402.T",
            "帝人":"3401.T","クレハ":"4023.T","ダイセル":"4202.T","積水化学工業":"4204.T",
            "TOTO":"5332.T","LIXIL":"5938.T","太平洋セメント":"5233.T",
            "住友大阪セメント":"5232.T","日本板硝子":"5202.T","JAL":"9201.T",
        },
        "プライム市場": {
            "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
            "キーエンス":"6861.T","東京エレクトロン":"8035.T","ファーストリテイリング":"9983.T",
            "信越化学工業":"4063.T","リクルートHD":"6098.T","三菱商事":"8058.T",
            "KDDI":"9433.T","任天堂":"7974.T","ダイキン工業":"6367.T",
            "日立製作所":"6501.T","三井住友FG":"8316.T","ホンダ":"7267.T",
            "中外製薬":"4519.T","東京海上HD":"8766.T","村田製作所":"6981.T",
            "ファナック":"6954.T","三井物産":"8031.T",
        },
        "スタンダード市場（一部）": {
            "東京製鐵":"5423.T","大和工業":"5444.T","トーセイ":"8923.T",
            "ビックカメラ":"3048.T","テレビ東京HD":"9413.T","松竹":"9601.T",
        },
        "グロース市場（一部）": {
            "さくらインターネット":"3778.T","メルカリ":"4385.T",
            "弁護士ドットコム":"6027.T","freee":"4478.T",
            "マネーフォワード":"3994.T","Sansan":"4443.T","ラクス":"3923.T",
        },
    }
    return nikkei


def main():
    jst     = pytz.timezone("Asia/Tokyo")
    now_jst = datetime.now(jst)
    print(f"=== 開始: {now_jst.strftime('%Y/%m/%d %H:%M JST')} ===")
    print(f"yfinance version: {yf.__version__}")

    # テスト取得（トヨタ1銘柄で接続確認）
    print("接続テスト中（トヨタ 7203.T）...")
    test_df = yf.Ticker("7203.T").history(period="5d", interval="1d", auto_adjust=True)
    if test_df is not None and len(test_df) > 0:
        print(f"接続テスト成功: {len(test_df)}行取得")
    else:
        print("接続テスト失敗: データなし")

    # 全ユニークティッカーを並列取得
    all_tickers = set()
    for stocks in THEMES.values():
        all_tickers.update(stocks.values())
    all_tickers.update(MACRO_TICKERS.values())
    all_tickers = list(all_tickers)
    print(f"取得対象: {len(all_tickers)} ティッカー")

    ticker_data = {}
    with ThreadPoolExecutor(max_workers=20) as ex:
        futs = {ex.submit(fetch_ticker, t): t for t in all_tickers}
        done = 0
        for fut in as_completed(futs):
            t  = futs[fut]
            df = fut.result()
            if df is not None:
                ticker_data[t] = df
            done += 1
            if done % 20 == 0:
                print(f"  進捗: {done}/{len(all_tickers)}")

    print(f"取得成功: {len(ticker_data)}/{len(all_tickers)}")

    output = {}

    # テーマ集計（全期間）
    for period in PERIODS:
        print(f"集計: {period}")
        results = []
        for theme_name, stocks in THEMES.items():
            pcts, vols, tvs, vol_chgs = [], [], [], []
            for name, ticker in stocks.items():
                df  = ticker_data.get(ticker)
                pdf = get_period_df(df, period)
                d   = calc_metrics(pdf)
                if d:
                    pcts.append(d["pct"]); vols.append(d["volume"])
                    tvs.append(d["trade_value"]); vol_chgs.append(d["volume_chg"])
            avg_pct = robust_avg(pcts)
            results.append({
                "theme": theme_name, "pct": avg_pct, "up": avg_pct >= 0,
                "stock_count": len(stocks), "volume": int(sum(vols)),
                "volume_chg": round(float(np.mean(vol_chgs)) if vol_chgs else 0, 1),
                "trade_value": int(sum(tvs)),
            })
        results.sort(key=lambda x: x["pct"], reverse=True)
        rise = sum(1 for r in results if r["up"])
        fall = len(results) - rise
        avg  = round(sum(r["pct"] for r in results) / len(results), 2) if results else 0
        output[f"themes_{period}"] = {
            "period": period, "themes": results,
            "summary": {
                "total": len(results), "rise": rise, "fall": fall, "avg": avg,
                "top": results[0] if results else None,
                "bot": results[-1] if results else None,
            },
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

    # マクロデータ
    for period in ["1d", "5d", "1mo", "3mo", "6mo", "1y"]:
        macro_result = {}
        for name, ticker in MACRO_TICKERS.items():
            df  = ticker_data.get(ticker)
            pdf = get_period_df(df, period)
            if pdf is None or len(pdf) < 2: continue
            cl  = pdf["Close"].dropna()
            cum = (cl / cl.iloc[0] - 1) * 100
            macro_result[name] = [
                {"date": str(d.date()), "pct": round(float(v), 2)}
                for d, v in cum.items()
            ]
        # 異常値フィルタ（ETFの分配金落ち等で急落するケース除去）
        for name_key in list(macro_result.keys()):
            arr = macro_result[name_key]
            if arr:
                last_pct = arr[-1]["pct"]
                if abs(last_pct) > 60:  # ±60%超は異常値とみなす
                    # 直前の正常値で補完
                    normal = [d for d in arr if abs(d["pct"]) <= 60]
                    macro_result[name_key] = normal if normal else []
        output[f"macro_{period}"] = {
            "period": period, "data": macro_result,
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

    # ヒートマップデータ
    print("集計: heatmap")
    heatmap_result = {}
    periods_map = {"1W": "5d", "1M": "1mo", "3M": "3mo", "6M": "6mo", "1Y": "1y"}
    for theme_name, stocks in THEMES.items():
        tr = {pl: [] for pl in periods_map}
        for ticker in stocks.values():
            df = ticker_data.get(ticker)
            if df is None: continue
            for pl, pc in periods_map.items():
                pdf = get_period_df(df, pc)
                d   = calc_metrics(pdf)
                if d: tr[pl].append(d["pct"])
        heatmap_result[theme_name] = {
            pl: round(sum(v)/len(v), 2) if v else None
            for pl, v in tr.items()
        }
    output["heatmap"] = {"data": heatmap_result, "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST")}

    # テーマ名一覧
    output["theme_names"] = {"themes": list(THEMES.keys()), "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST")}

    # 市場ステータス
    h, m    = now_jst.hour, now_jst.minute
    is_open = now_jst.weekday() < 5 and (
        (h == 9 and m >= 0) or (10 <= h <= 14) or (h == 15 and m == 0)
    )
    output["status"] = {
        "time": now_jst.strftime("%H:%M JST"), "date": now_jst.strftime("%Y/%m/%d"),
        "is_open": is_open, "label": "open" if is_open else "closed",
        "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
    }

    # ── テーマ別詳細キャッシュ（最も重要：テーマ別詳細ページの高速化）──
    print("集計: theme_detail（全テーマ × 2期間）")
    for period in ["1d", "5d", "1mo", "3mo", "6mo", "1y"]:
        for theme_name, stocks in THEMES.items():
            detail_stocks = []
            for name, ticker in stocks.items():
                df  = ticker_data.get(ticker)
                pdf = get_period_df(df, period)
                if pdf is None or len(pdf) < 2: continue
                d = calc_metrics(pdf)
                if not d: continue
                # スパークライン（6ヶ月の週次騰落率）
                spark = []
                try:
                    df_sp = ticker_data.get(ticker)
                    if df_sp is not None and len(df_sp) >= 10:
                        import pandas as _pd2
                        cutoff6 = _pd2.Timestamp.now() - _pd2.Timedelta(days=185)
                        df_sp6 = df_sp[df_sp.index >= cutoff6]
                        cl_sp = df_sp6["Close"].dropna()
                        if len(cl_sp) >= 4:
                            base = float(cl_sp.iloc[0])
                            step = max(1, len(cl_sp) // 20)
                            spark = [round((float(v) / base - 1) * 100, 2) for v in cl_sp.iloc[::step]]
                except Exception:
                    spark = []
                detail_stocks.append({
                    "ticker": ticker, "name": name,
                    "price": d["price"], "pct": d["pct"],
                    "contribution": round(d["pct"] / len(stocks), 2),
                    "volume": d["volume"], "volume_chg": d["volume_chg"],
                    "trade_value": d["trade_value"], "vol_rank": 0, "tv_rank": 0,
                    "spark": spark,
                })
            # 出来高・売買代金順位を付与してから騰落率順にソート
            for i, s in enumerate(sorted(detail_stocks, key=lambda x: x["volume"], reverse=True)):
                s["vol_rank"] = i + 1
            for i, s in enumerate(sorted(detail_stocks, key=lambda x: x["trade_value"], reverse=True)):
                s["tv_rank"] = i + 1
            detail_stocks.sort(key=lambda x: x["pct"], reverse=True)
            avg = round(sum(s["pct"] for s in detail_stocks) / len(detail_stocks), 2) if detail_stocks else 0
            key = f"theme_detail_{theme_name}_{period}"
            output[key] = {"stocks": detail_stocks, "avg": avg,
                           "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST")}

    # ── 市場別詳細キャッシュ（市場別ランキングページの高速化）──
    # ── テーマ別トレンド（比較グラフ用）をmarket.jsonに追加 ──
    print("集計: trends（全テーマ × 全期間）")
    for period in ["1d", "5d", "1mo", "3mo", "6mo", "1y"]:
        all_trends = {}
        for theme_name, stocks in THEMES.items():
            tickers = list(stocks.values())
            if not tickers:
                continue
            theme_series = {}
            for name, ticker in stocks.items():
                df = ticker_data.get(ticker)
                pdf = get_period_df(df, period)
                if pdf is None or len(pdf) < 2:
                    continue
                cl = pdf["Close"].dropna()
                if len(cl) < 2 or not (cl > 0).all():
                    continue
                cum = (cl / cl.iloc[0] - 1) * 100
                cum = cum[~cum.index.duplicated(keep="last")]
                theme_series[theme_name] = [
                    {"date": str(d.date()), "pct": round(float(v), 2)}
                    for d, v in cum.items() if not __import__("math").isnan(v)
                ]
                break  # テーマを代表する1銘柄のみ（軽量化）
            all_trends.update(theme_series)
        output[f"trends_{period}"] = {
            "data": all_trends,
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

        print("集計: seg_detail（全セグメント × 2期間）")
    MARKET_SEGMENTS = build_market_segments()
    for period in ["1d", "5d", "1mo", "3mo", "6mo", "1y"]:
        for seg_name, seg_stocks in MARKET_SEGMENTS.items():
            seg_detail = []
            for name, ticker in seg_stocks.items():
                df  = ticker_data.get(ticker)
                if df is None:
                    # セグメント専用ティッカーは別途取得
                    try:
                        df = yf.Ticker(ticker).history(period="2y", interval="1d", auto_adjust=True)
                        if df is not None and len(df) > 0:
                            df.index = df.index.tz_localize(None)
                    except Exception:
                        continue
                pdf = get_period_df(df, period)
                if pdf is None or len(pdf) < 2: continue
                d = calc_metrics(pdf)
                if not d: continue
                seg_detail.append({
                    "ticker": ticker, "name": name,
                    "price": d["price"], "pct": d["pct"],
                    "contribution": round(d["pct"] / len(seg_stocks), 2),
                    "volume": d["volume"], "volume_chg": d["volume_chg"],
                    "trade_value": d["trade_value"], "vol_rank": 0, "tv_rank": 0,
                })
            for i, s in enumerate(sorted(seg_detail, key=lambda x: x["volume"], reverse=True)):
                s["vol_rank"] = i + 1
            for i, s in enumerate(sorted(seg_detail, key=lambda x: x["trade_value"], reverse=True)):
                s["tv_rank"] = i + 1
            seg_detail.sort(key=lambda x: x["pct"], reverse=True)
            avg = round(sum(s["pct"] for s in seg_detail) / len(seg_detail), 2) if seg_detail else 0
            key = f"seg_{seg_name}_{period}"
            output[key] = {"stocks": seg_detail, "avg": avg,
                           "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST")}
        # market_rank_{period}（セグメント一覧）
        output[f"market_rank_{period}"] = {
            "period": period,
            "data": {
                seg: {"pct": output.get(f"seg_{seg}_{period}", {}).get("avg", 0),
                      "count": len(MARKET_SEGMENTS.get(seg, {}))}
                for seg in MARKET_SEGMENTS
            },
            "groups": {
                "国内主要株": [k for k in MARKET_SEGMENTS if k.startswith("日経225")],
                "国内全般":   [k for k in MARKET_SEGMENTS if k.startswith("国内全般")],
                "市場区分":   [k for k in MARKET_SEGMENTS if any(k.startswith(x) for x in ["プライム","スタンダード","グロース"])],
            },
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

    # ── 月次ヒートマップキャッシュ ──
    print("集計: heatmap_monthly")
    months = []
    for i in range(11, -1, -1):
        total_months = now_jst.month - 1 - i
        if total_months < 0:
            year_offset = -((-total_months + 11) // 12)
            month_in_year = 12 - ((-total_months - 1) % 12)
        else:
            year_offset = total_months // 12
            month_in_year = total_months % 12 + 1
        months.append(f"{now_jst.year + year_offset}/{month_in_year:02d}")
    monthly_data = {}
    for theme_name, stocks in THEMES.items():
        monthly_data[theme_name] = {}
        for m_str in months:
            y, mo = int(m_str[:4]), int(m_str[5:])
            start = pd.Timestamp(y, mo, 1)
            end   = pd.Timestamp(y + 1, 1, 1) if mo == 12 else pd.Timestamp(y, mo + 1, 1)
            pcts  = []
            for ticker in stocks.values():
                df = ticker_data.get(ticker)
                if df is None: continue
                mdf = df[(df.index >= start) & (df.index < end)]
                if len(mdf) < 2: continue
                cl = mdf["Close"].dropna()
                if len(cl) >= 2 and (cl > 0).all():
                    pct = round((cl.iloc[-1] / cl.iloc[0] - 1) * 100, 2)
                    if abs(pct) < 500: pcts.append(pct)
            monthly_data[theme_name][m_str] = robust_avg(pcts) if pcts else None
    output["heatmap_monthly"] = {
        "data": monthly_data, "months": months,
        "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
    }

    # ── 騰落モメンタムキャッシュ ──
    print("集計: momentum")
    for period in ["1mo", "3mo"]:
        cur_map = {theme: output.get(f"themes_{period}", {}).get("themes", []) for theme in THEMES}
        cur_pct = {}
        for t in output.get(f"themes_{period}", {}).get("themes", []):
            cur_pct[t["theme"]] = t["pct"]
        w1_pct = {}
        for t in output.get("themes_5d", {}).get("themes", []):
            w1_pct[t["theme"]] = t["pct"]
        m1_pct = {}
        for t in output.get("themes_1mo", {}).get("themes", []):
            m1_pct[t["theme"]] = t["pct"]
        momentum = []
        for theme_name, cur in cur_pct.items():
            dw = round(cur - w1_pct.get(theme_name, cur), 2)
            dm = round(m1_pct.get(theme_name, 0) - w1_pct.get(theme_name, 0), 2) if period == "1mo" else round(cur - m1_pct.get(theme_name, cur), 2)
            if   dw > 3  and dm > 5:  state = "🔥加速"
            elif dw < -3 and dm < -5: state = "❄️失速"
            elif dw > 2:               state = "↗転換↑"
            elif dw < -2:              state = "↘転換↓"
            else:                      state = "→横ばい"
            momentum.append({"theme": theme_name, "pct": cur, "week_diff": dw, "month_diff": dm, "state": state})
        momentum.sort(key=lambda x: x["pct"], reverse=True)
        output[f"momentum_{period}"] = {
            "period": period, "data": momentum,
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

    # ── 銘柄アクション検出（分割・廃止・名称変更等） ──
    print("検出: 銘柄アクション")
    actions = []
    seen_tickers = set()
    for theme_stocks in THEMES.values():
        for name, ticker in theme_stocks.items():
            if ticker in seen_tickers:
                continue
            seen_tickers.add(ticker)
            try:
                tk = yf.Ticker(ticker)
                info = tk.info or {}
                # 名称変更チェック
                api_name = info.get('longName') or info.get('shortName') or ''
                if api_name and name and api_name != name and len(api_name) > 2:
                    # 大きく異なる場合のみ（部分一致でなければ）
                    if name not in api_name and api_name not in name:
                        pass  # rename は表示しない（日英表記差のため誤検知多数）
                # 株式分割チェック（splits）
                splits = tk.splits
                if splits is not None and len(splits) > 0:
                    recent = splits[splits.index >= (pd.Timestamp.now() - pd.Timedelta(days=90))]
                    for dt, ratio in recent.items():
                        if ratio != 1.0:
                            actions.append({
                                "type": "split",
                                "ticker": ticker,
                                "name": name,
                                "detail": f"株式分割 {ratio:.1f}:1（{str(dt.date())}）",
                                "detected_at": now_jst.strftime("%Y/%m/%d"),
                                "effective_date": str(dt.date()),
                            })
            except Exception:
                pass
    # ── 資金フロー（fund_flow）をmarket.jsonに追加 ──
    print("生成: 資金フロー")
    for period in ["1d", "5d", "1mo", "3mo", "6mo", "1y"]:
        key = f"fund_flow_{period}"
        themes_key = f"themes_{period}"
        if themes_key not in output:
            continue
        all_themes = output[themes_key].get("themes", [])
        if not all_themes:
            continue
        gainers = sorted([t for t in all_themes if t.get("pct",0) > 0],
                         key=lambda x: x["pct"], reverse=True)[:5]
        losers  = sorted([t for t in all_themes if t.get("pct",0) < 0],
                         key=lambda x: x["pct"])[:5]
        output[key] = {
            "gainers": gainers,
            "losers":  losers,
            "all":     sorted(all_themes, key=lambda x: x.get("pct",0), reverse=True),
            "updated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        }

    output["corporate_actions"] = actions
    if actions:
        print(f"  銘柄アクション検出: {len(actions)}件")

    # 保存
    # ── テーマ別 出来高・売買代金 週次推移（1年間） ──
    print("テーマ別出来高・売買代金推移を集計中...")
    import warnings as _w
    _w.filterwarnings("ignore")
    for theme_name, stocks in THEMES.items():
        weekly_dates, weekly_vols, weekly_tvs = [], [], []
        try:
            # 全銘柄の日次データを週次に集約
            combined_vol = {}
            combined_tv  = {}
            for name, ticker in stocks.items():
                df = ticker_data.get(ticker)
                if df is None or len(df) < 5:
                    continue
                # 過去1年分
                cutoff = pd.Timestamp.now() - pd.Timedelta(days=370)
                dff = df[df.index >= cutoff].copy()
                if len(dff) < 5:
                    continue
                # 週次リサンプル（金曜日基準）
                dff.index = pd.to_datetime(dff.index)
                dff_w = dff.resample('W-FRI').agg({
                    'Volume': 'sum',
                    'Close':  'last',
                })
                dff_w = dff_w.dropna()
                for dt, row in dff_w.iterrows():
                    key = dt.strftime('%Y-%m-%d')
                    vol = float(row['Volume']) if row['Volume'] else 0
                    tv  = vol * float(row['Close']) if row['Close'] else 0
                    combined_vol[key] = combined_vol.get(key, 0) + vol
                    combined_tv[key]  = combined_tv.get(key, 0)  + tv
            if combined_vol:
                dates_sorted = sorted(combined_vol.keys())
                weekly_dates = dates_sorted
                weekly_vols  = [round(combined_vol[d]) for d in dates_sorted]
                weekly_tvs   = [round(combined_tv[d])  for d in dates_sorted]
        except Exception:
            pass
        output[f"vol_trend_{theme_name}"] = {
            "dates":  weekly_dates,
            "volumes": weekly_vols,
            "trade_values": weekly_tvs,
        }

    os.makedirs("frontend/public/data", exist_ok=True)
    # trendsデータを別ファイルに分割（market.jsonの肥大化防止）
    trends_output = {}
    main_output   = {}
    for k, v in output.items():
        if k.startswith("trends_"):
            trends_output[k] = v
        else:
            main_output[k] = v

    # ── テーマ別 出来高・売買代金 週次推移（1年間） ──
    print("テーマ別出来高・売買代金推移を集計中...")
    import warnings as _w
    _w.filterwarnings("ignore")
    for theme_name, stocks in THEMES.items():
        weekly_dates, weekly_vols, weekly_tvs = [], [], []
        try:
            # 全銘柄の日次データを週次に集約
            combined_vol = {}
            combined_tv  = {}
            for name, ticker in stocks.items():
                df = ticker_data.get(ticker)
                if df is None or len(df) < 5:
                    continue
                # 過去1年分
                cutoff = pd.Timestamp.now() - pd.Timedelta(days=370)
                dff = df[df.index >= cutoff].copy()
                if len(dff) < 5:
                    continue
                # 週次リサンプル（金曜日基準）
                dff.index = pd.to_datetime(dff.index)
                dff_w = dff.resample('W-FRI').agg({
                    'Volume': 'sum',
                    'Close':  'last',
                })
                dff_w = dff_w.dropna()
                for dt, row in dff_w.iterrows():
                    key = dt.strftime('%Y-%m-%d')
                    vol = float(row['Volume']) if row['Volume'] else 0
                    tv  = vol * float(row['Close']) if row['Close'] else 0
                    combined_vol[key] = combined_vol.get(key, 0) + vol
                    combined_tv[key]  = combined_tv.get(key, 0)  + tv
            if combined_vol:
                dates_sorted = sorted(combined_vol.keys())
                weekly_dates = dates_sorted
                weekly_vols  = [round(combined_vol[d]) for d in dates_sorted]
                weekly_tvs   = [round(combined_tv[d])  for d in dates_sorted]
        except Exception:
            pass
        output[f"vol_trend_{theme_name}"] = {
            "dates":  weekly_dates,
            "volumes": weekly_vols,
            "trade_values": weekly_tvs,
        }

    os.makedirs("frontend/public/data", exist_ok=True)

    # market.json（メインデータ）
    out_path = "frontend/public/data/market.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(main_output, f, ensure_ascii=False, separators=(",", ":"))
    size = os.path.getsize(out_path) / 1024
    print(f"=== 完了: {out_path} ({size:.1f} KB) ===")

    # trends.json（テーマ比較グラフ用）
    trends_path = "frontend/public/data/trends.json"
    with open(trends_path, "w", encoding="utf-8") as f:
        json.dump(trends_output, f, ensure_ascii=False, separators=(",", ":"))
    t_size = os.path.getsize(trends_path) / 1024
    print(f"=== 完了: {trends_path} ({t_size:.1f} KB) ===")


if __name__ == "__main__":
    main()
