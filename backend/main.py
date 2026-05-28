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
                from data import _fetch_df
                df = _fetch_df(ticker, period="2y")
            if df is None or len(df) < 5:
                continue
            if df.index.tz is not None:
                df.index = df.index.tz_localize(None)
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
    """銘柄情報取得（カスタムテーマ用）— Infoway/market.jsonベース"""
    try:
        from data import _fetch_df, _period_df
        # 日本語名を優先
        jp_name = JP_STOCK_NAMES.get(ticker)
        # Infowayからデータ取得
        df    = _fetch_df(ticker)
        df_1mo = _period_df(df, "1mo")
        price = pct = volume = trade_value = None
        if df is not None and len(df) > 0:
            price = round(float(df["Close"].iloc[-1]), 2) if "Close" in df.columns else None
        if df_1mo is not None and len(df_1mo) >= 2:
            p0 = float(df_1mo["Close"].iloc[0])
            p1 = float(df_1mo["Close"].iloc[-1])
            pct = round((p1 - p0) / p0 * 100, 2) if p0 else None
            if "Volume" in df_1mo.columns:
                volume = int(df_1mo["Volume"].sum())
            if "Close" in df_1mo.columns and "Volume" in df_1mo.columns:
                trade_value = int((df_1mo["Close"] * df_1mo["Volume"]).sum())
        return {
            "ticker": ticker,
            "name":   jp_name or ticker,
            "price":  price,
            "pct":    pct,
            "volume": volume,
            "trade_value": trade_value,
        }
    except Exception as e:
        return {"ticker": ticker, "name": JP_STOCK_NAMES.get(ticker, ticker),
                "price": None, "pct": None, "error": str(e)}

@app.get("/api/stock-history/{ticker}")
def get_stock_history(ticker: str, period: str = "1mo"):
    """銘柄株価履歴取得（カスタムテーマ用）— Infowayベース"""
    try:
        from data import _fetch_df, _period_df
        df = _fetch_df(ticker)
        df_p = _period_df(df, period)
        if df_p is None or len(df_p) == 0:
            return {"ticker": ticker, "period": period, "data": []}
        records = []
        for ts, row in df_p.iterrows():
            records.append({
                "date":  str(ts.date()),
                "close": round(float(row["Close"]), 2) if "Close" in row else None,
                "volume": int(row["Volume"]) if "Volume" in row else None,
            })
        return {"ticker": ticker, "period": period, "data": records}
    except Exception as e:
        return {"ticker": ticker, "period": period, "data": [], "error": str(e)}

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
    """銘柄名または証券コードで検索（カスタムテーマ用・日本株のみ）
    JP_STOCK_NAMES マスターを検索。yfinanceは使用しない。"""
    if not q.strip():
        return {"results": []}
    try:
        q = q.strip()
        results = []

        # 4桁数字 → 直接ティッカー検索
        if q.isdigit() and len(q) == 4:
            ticker = q + ".T"
            name = JP_STOCK_NAMES.get(ticker)
            if name:
                results.append({"ticker": ticker, "name": name, "price": None})

        # 文字列 → 銘柄名マスターを部分一致検索
        if not results:
            q_lower = q.lower()
            for ticker, name in JP_STOCK_NAMES.items():
                if q_lower in name.lower() or q_lower in ticker.lower():
                    results.append({"ticker": ticker, "name": name, "price": None})
                if len(results) >= 10:
                    break

        # 証券コード部分一致（4〜5文字の英数字）
        if not results and len(q) >= 3:
            for ticker, name in JP_STOCK_NAMES.items():
                if ticker.startswith(q.upper()):
                    results.append({"ticker": ticker, "name": name, "price": None})
                if len(results) >= 10:
                    break

        return {"results": results[:10]}
    except Exception as e:
        return {"results": [], "error": str(e)}

@app.get("/api/edinet/large-holdings")
async def edinet_large_holdings(q: str = "", days: int = 60):
    """
    EDINET大量保有報告書を検索（CORSを回避するバックエンドプロキシ）
    環境変数 EDINET_API_KEY に登録APIキーを設定してください。
    APIキーはクエリパラメータ Subscription-Key として送信します。
    """
    cache_key = f"{q.strip().lower()}:{min(days,60)}"
    now = time.time()

    # キャッシュヒット
    if cache_key in _edinet_cache:
        ts, cached = _edinet_cache[cache_key]
        if now - ts < _CACHE_TTL:
            return {**cached, "cached": True}

    # 正しいEDINET API v2のベースURL
    EDINET_BASE = "https://api.edinet-fsa.go.jp/api/v2"
    api_key = os.environ.get("EDINET_API_KEY", "")

    results = []
    today = date.today()
    q_lower = (q or "").strip().lower()
    errors = []

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            for i in range(min(days, 60)):
                target = (today - timedelta(days=i)).isoformat()
                try:
                    # APIキーはクエリパラメータとして送信（正しい方式）
                    params = {"date": target, "type": 2}
                    if api_key:
                        params["Subscription-Key"] = api_key

                    res = await client.get(
                        f"{EDINET_BASE}/documents.json",
                        params=params,
                        timeout=12.0
                    )

                    if res.status_code == 403:
                        errors.append(f"403 on {target}")
                        # 最初の403でAPIキーエラーを返す
                        if i == 0:
                            return {
                                "results": [], "query": q, "count": 0,
                                "error": "EDINET 403: APIキーが無効か、アクセスが拒否されました。",
                                "api_key_set": bool(api_key),
                                "url_used": EDINET_BASE
                            }
                        continue

                    if not res.is_success:
                        continue

                    data = res.json()
                    # metadataのstatusを確認
                    meta = data.get("metadata", {})
                    if meta.get("status") != "200":
                        continue

                    docs = data.get("results", [])
                    for doc in docs:
                        # 大量保有報告書: docTypeCode 28=新規, 29=変更, 30=一部免除
                        if doc.get("docTypeCode") not in ["28", "29", "30"]:
                            continue
                        if q_lower:
                            issuer = (doc.get("issuerName") or "").lower()
                            sec    = (doc.get("secCode")    or "").lower()
                            filer  = (doc.get("filerName")  or "").lower()
                            if not (q_lower in issuer or q_lower in sec or q_lower in filer):
                                continue
                        results.append({
                            "docID":        doc.get("docID"),
                            "submitDate":   target,
                            "submitDateTime": doc.get("submitDateTime"),
                            "issuerName":   doc.get("issuerName"),
                            "secCode":      doc.get("secCode"),
                            "filerName":    doc.get("filerName"),
                            "docTypeCode":  doc.get("docTypeCode"),
                            "holdingRatio": doc.get("otherExplanatoryStatement"),
                            "docDescription": doc.get("docDescription"),
                        })
                    if len(results) >= 100:
                        break
                except httpx.TimeoutException:
                    errors.append(f"timeout on {target}")
                    continue
                except Exception as ex:
                    errors.append(f"error on {target}: {str(ex)}")
                    continue
    except Exception as e:
        return {"results": [], "query": q, "count": 0, "error": str(e)}

    payload = {
        "results": results,
        "query": q,
        "count": len(results),
        "cached": False,
        "api_key_set": bool(api_key),
        "errors_count": len(errors),
    }
    if results:
        _edinet_cache[cache_key] = (now, payload)
    return payload
# backend/main.py に追加するエンドポイント

import stripe
import os
from fastapi import HTTPException, Request
from pydantic import BaseModel

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

PRICE_IDS = {
    "standard_monthly": os.environ.get("STRIPE_PRICE_STD_MONTHLY"),
    "standard_yearly":  os.environ.get("STRIPE_PRICE_STD_YEARLY"),
    "pro_monthly":      os.environ.get("STRIPE_PRICE_PRO_MONTHLY"),
    "pro_yearly":       os.environ.get("STRIPE_PRICE_PRO_YEARLY"),
}

class CheckoutRequest(BaseModel):
    price_key: str      # "standard_monthly" など
    user_id:   str      # Supabaseのユーザーid
    email:     str      # ユーザーのメールアドレス
    success_url: str    # 決済成功後のリダイレクト先
    cancel_url:  str    # キャンセル時のリダイレクト先

@app.post("/api/stripe/create-checkout")
async def create_checkout_session(req: CheckoutRequest):
    """Stripe Checkoutセッションを作成"""
    price_id = PRICE_IDS.get(req.price_key)
    if not price_id:
        raise HTTPException(400, f"Invalid price_key: {req.price_key}")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            customer_email=req.email,
            client_reference_id=req.user_id,  # SupabaseのユーザーIDを保持
            success_url=req.success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=req.cancel_url,
            subscription_data={
                "metadata": {
                    "user_id": req.user_id,
                    "plan": "standard" if "standard" in req.price_key else "pro",
                }
            },
            locale="ja",  # 日本語UI
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(400, str(e))


@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    """StripeからのWebhookを受信してSupabaseを更新"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(400, "Invalid webhook signature")

    # サブスクリプション開始
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["client_reference_id"]
        plan = session["subscription_data"]["metadata"]["plan"]
        sub_id = session["subscription"]

        # Stripeからサブスクリプション詳細を取得
        sub = stripe.Subscription.retrieve(sub_id)
        period_end = sub["current_period_end"]

        # SupabaseのSubscriptionsテーブルを更新
        from supabase import create_client
        import datetime
        sb = create_client(
            os.environ["VITE_SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # ← Service Role Key（Webhookのみ使用）
        )
        sb.table("subscriptions").upsert({
            "user_id": user_id,
            "plan": plan,
            "status": "active",
            "stripe_subscription_id": sub_id,
            "stripe_customer_id": session["customer"],
            "current_period_end": datetime.datetime.fromtimestamp(
                period_end, tz=datetime.timezone.utc
            ).isoformat(),
        }, on_conflict="user_id").execute()

    # サブスクリプション更新（自動更新時）
    elif event["type"] == "invoice.payment_succeeded":
        sub_id = event["data"]["object"]["subscription"]
        sub = stripe.Subscription.retrieve(sub_id)
        user_id = sub["metadata"].get("user_id")
        if user_id:
            from supabase import create_client
            import datetime
            sb = create_client(
                os.environ["VITE_SUPABASE_URL"],
                os.environ["SUPABASE_SERVICE_ROLE_KEY"]
            )
            sb.table("subscriptions").update({
                "status": "active",
                "current_period_end": datetime.datetime.fromtimestamp(
                    sub["current_period_end"], tz=datetime.timezone.utc
                ).isoformat(),
            }).eq("stripe_subscription_id", sub_id).execute()

    # サブスクリプションキャンセル
    elif event["type"] in ["customer.subscription.deleted", "customer.subscription.updated"]:
        sub = event["data"]["object"]
        sub_id = sub["id"]
        status = "canceled" if event["type"].endswith("deleted") else sub["status"]
        from supabase import create_client
        sb = create_client(
            os.environ["VITE_SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        )
        sb.table("subscriptions").update({"status": status}).eq(
            "stripe_subscription_id", sub_id
        ).execute()

    return {"status": "ok"}
