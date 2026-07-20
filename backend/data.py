"""
data.py — StockWaveJP データ取得モジュール
日経225構成銘柄を公式分類（大分類・小分類）に基づいて整理
"""
import yfinance as yf
import numpy as np
import warnings
import logging
# yfinanceのデリスト警告を抑制（銘柄エラーはスキップして継続処理）
warnings.filterwarnings("ignore", message=".*possibly delisted.*")
warnings.filterwarnings("ignore", message=".*No data found.*")
logging.getLogger("yfinance").setLevel(logging.CRITICAL)
import pandas as pd
import time
import threading
from datetime import datetime, timedelta
import pytz
import os

# Infoway APIキー（未設定の場合はNone → yfinanceも廃止済みのためデータなしとなる）
INFOWAY_API_KEY = os.environ.get("INFOWAY_API_KEY", None)

# ── Infoway: バリュエーション指標（PER/PBR/PEG 現在・来期予想）取得 ──
# 契約後、エンドポイント・レスポンスのフィールド名を実機で確認し _parse_valuation() を調整してください。
_VALUATION_CACHE: dict = {}
_VALUATION_CACHE_TTL = 60 * 60 * 24  # 24時間（決算をまたがない限り変動しないため）

def _parse_valuation(raw: dict) -> dict:
    """Infowayレスポンスを内部スキーマに正規化。フィールド名は契約後に要確認。"""
    return {
        "per":     raw.get("per") or raw.get("pe_ratio"),
        "per_fwd": raw.get("forward_per") or raw.get("forward_pe"),
        "pbr":     raw.get("pbr") or raw.get("pb_ratio"),
        "pbr_fwd": raw.get("forward_pbr"),
        "peg":     raw.get("peg") or raw.get("peg_ratio"),
        "peg_fwd": raw.get("forward_peg"),
    }

def get_valuation(ticker: str) -> dict | None:
    """1銘柄のPER/PBR/PEG（現在・来期予想）をInfowayから取得。未契約・失敗時はNone。"""
    if not INFOWAY_API_KEY:
        return None
    cache_key = f"valuation_{ticker}"
    now = time.time()
    cached = _VALUATION_CACHE.get(cache_key)
    if cached and now - cached["ts"] < _VALUATION_CACHE_TTL:
        return cached["value"]
    try:
        import requests
        code = ticker.replace(".T", "")
        resp = requests.get(
            "https://api.infoway.io/v1/market-data/fundamentals",
            params={"symbol": code, "market": "JP"},
            headers={"Authorization": f"Bearer {INFOWAY_API_KEY}"},
            timeout=5,
        )
        if resp.status_code != 200:
            return None
        parsed = _parse_valuation(resp.json())
        _VALUATION_CACHE[cache_key] = {"value": parsed, "ts": now}
        return parsed
    except Exception:
        return None


# ── 株式分割テーブル（2026年。価格データの分割調整チェック用）──
# Infowayが分割調整済み（split-adjusted）の四本値を提供する場合は通常不要だが、
# 念のため過去株価をまたぐ騰落率計算時にここで二重チェック・補正する。
# 形式: ティッカー: [(効力発生日, 分割比率), ...]  比率2 = 1株→2株
STOCK_SPLITS_2026 = {
    "5801.T": [("2026-07-01", 10)],   # 古河電気工業: 1→10
    "5802.T": [("2026-07-01", 4)],    # 住友電気工業: 1→4
    "4452.T": [("2026-07-01", 2)],    # 花王: 1→2
    "8053.T": [("2026-07-01", 4)],    # 住友商事: 1→4
    # 2026年7月1日前後に分割を実施する銘柄は他に約30社あり。
    # 確認次第、本リストに追加してください（東証適時開示・各社IR資料を参照）。
}

def _adjust_for_splits(df: "pd.DataFrame", ticker: str) -> "pd.DataFrame":
    """
    指定ティッカーに既知の分割がある場合、効力発生日より前の価格を分割比率で割り、
    出来高を分割比率倍することで、分割をまたぐ騰落率計算のブレを防ぐ。
    （Infoway側で既に分割調整済みの場合はここでの補正は不要・無害なノーオペレーションとなるよう
      日付ベースでガードしている）
    """
    splits = STOCK_SPLITS_2026.get(ticker)
    if not splits or df is None or df.empty:
        return df
    df = df.copy()
    for eff_date_str, ratio in splits:
        eff_date = pd.Timestamp(eff_date_str)
        mask = df.index < eff_date
        if mask.any():
            for col in ("Open", "High", "Low", "Close"):
                if col in df.columns:
                    df.loc[mask, col] = df.loc[mask, col] / ratio
            if "Volume" in df.columns:
                df.loc[mask, "Volume"] = df.loc[mask, "Volume"] * ratio
    return df

import pickle
import hashlib

# ── マクロティッカー ──
# マクロ指標：ETFを使用（商標権・ライセンス問題を回避）
# 国内主要株(225銘柄平均) = 1321.T (日経225連動ETF 野村AM)
# TOPIX連動型上場投信(1306) = 1306.T (TOPIX連動ETF 野村AM)
# S&P500 ETF(SPY) = SPY
# ドル円 = JPY=X
# 米国ハイテク株100 = QQQ (ナスダック100 ETF)
# 市場ボラティリティ指標(VIXY) = VIXY
MACRO_TICKERS = {
    "国内主要株(1321)":        "1321.T",
    "TOPIX連動型上場投信(1306)":"1306.T",
    "TOPIX指数":               "^TOPIX",
    "S&P500 ETF(SPY)":        "SPY",
    "ドル円":                  "JPY=X",
    "米国ハイテク株100(QQQ)":  "QQQ",
}

# ── StockWaveJP独自の市場分類 ──────────────────────────────
# 公式指数・取引所市場区分・他社の公式セクター分類ではありません。
# 日本株市場を大づかみに比較するため、代表的な大型・中大型株150銘柄を
# 主力事業に基づいて10分類へ一意に割り当てた編集上の分類です。
# 構成銘柄と分類方針はStockWaveJPが独自に管理し、変更時はお知らせへ記録します。
STOCKWAVE_MARKET_CLASSIFICATION = {
    'デジタル・半導体': {
        'ソニーグループ': '6758.T',
        'キーエンス': '6861.T',
        '東京エレクトロン': '8035.T',
        '日立製作所': '6501.T',
        '村田製作所': '6981.T',
        '富士通': '6702.T',
        'アドバンテスト': '6857.T',
        'レーザーテック': '6920.T',
        '三菱電機': '6503.T',
        'ルネサス': '6723.T',
        '京セラ': '6971.T',
        'オムロン': '6645.T',
        'パナソニックHD': '6752.T',
        'TDK': '6762.T',
        'キヤノン': '7751.T',
        '味の素': '2802.T',
        'ディスコ': '6146.T',
        'SCREEN HD': '7735.T',
        '東京精密': '7729.T',
        'ソシオネクスト': '6526.T',
        'キオクシアHD': '285A.T',
        'トレンドマイクロ': '4704.T',
        'NEC': '6701.T',
        'ニコン': '7731.T',
    },
    '産業機械・防衛': {
        'ダイキン工業': '6367.T',
        'ファナック': '6954.T',
        'SMC': '6273.T',
        '三菱重工業': '7011.T',
        '川崎重工業': '7012.T',
        'コマツ': '6301.T',
        'クボタ': '6326.T',
        'IHI': '7013.T',
        '安川電機': '6506.T',
        'THK': '6481.T',
        '富士電機': '6504.T',
        '横河電機': '6841.T',
        'アズビル': '6845.T',
        '旭ダイヤモンド工業': '6104.T',
    },
    '自動車・モビリティ': {
        'トヨタ自動車': '7203.T',
        'デンソー': '6902.T',
        'ホンダ': '7267.T',
        'ブリヂストン': '5108.T',
        'スズキ': '7269.T',
        'マツダ': '7261.T',
        'スバル': '7270.T',
        '三菱自動車': '7211.T',
        '日産自動車': '7201.T',
        '豊田自動織機': '6201.T',
        'アイシン': '7259.T',
        'ジェイテクト': '6473.T',
        'JR東日本': '9020.T',
        'JR東海': '9022.T',
        '日本郵船': '9101.T',
        '商船三井': '9104.T',
        '川崎汽船': '9107.T',
        '日本郵政': '6178.T',
    },
    '金融・商社': {
        '三菱UFJ FG': '8306.T',
        '三菱商事': '8058.T',
        '三井物産': '8031.T',
        '伊藤忠商事': '8001.T',
        '三井住友FG': '8316.T',
        'みずほFG': '8411.T',
        '東京海上HD': '8766.T',
        'オリックス': '8591.T',
        '住友商事': '8053.T',
        'MS&AD保険G': '8725.T',
        '丸紅': '8002.T',
        '第一生命HD': '8750.T',
        '日本取引所G': '8697.T',
        '野村HD': '8604.T',
        '大和証券G': '8601.T',
        'りそなHD': '8308.T',
        'SBIホールディングス': '8473.T',
        'ゆうちょ銀行': '7182.T',
        'かんぽ生命': '7181.T',
    },
    'ヘルスケア': {
        '中外製薬': '4519.T',
        '第一三共': '4568.T',
        '武田薬品工業': '4502.T',
        'HOYA': '7741.T',
        '富士フイルムHD': '4901.T',
        'テルモ': '4543.T',
        'アステラス製薬': '4503.T',
        '大塚HD': '4578.T',
        'エーザイ': '4523.T',
        '塩野義製薬': '4507.T',
        '小野薬品': '4528.T',
        'シスメックス': '6869.T',
        'オリンパス': '7733.T',
        '島津製作所': '7701.T',
    },
    '消費・小売・エンタメ': {
        'ファーストリテイリング': '9983.T',
        '任天堂': '7974.T',
        '花王': '4452.T',
        'セブン&アイHD': '3382.T',
        'イオン': '8267.T',
        'ニトリHD': '9843.T',
        'バンダイナムコHD': '7832.T',
        'ニッスイ': '1332.T',
    },
    '通信・ネットサービス': {
        'リクルートHD': '6098.T',
        'NTT': '9432.T',
        'KDDI': '9433.T',
        'ソフトバンクG': '9984.T',
        'ソフトバンク': '9434.T',
        'メルカリ': '4385.T',
        '楽天グループ': '4755.T',
    },
    '素材・化学': {
        '信越化学工業': '4063.T',
        '日本製鉄': '5401.T',
        '住友金属鉱山': '5713.T',
        '旭化成': '3407.T',
        '三菱ケミカルG': '4188.T',
        '住友電気工業': '5802.T',
        '古河電気工業': '5801.T',
        'フジクラ': '5803.T',
        '日東電工': '6988.T',
        '三井金属': '5706.T',
        'AGC': '5201.T',
        '東レ': '3402.T',
        '帝人': '3401.T',
        'クレハ': '4023.T',
        'ダイセル': '4202.T',
        '積水化学工業': '4204.T',
        '太平洋セメント': '5233.T',
        '住友大阪セメント': '5232.T',
        '日本板硝子': '5202.T',
    },
    'エネルギー・公益': {
        '東京電力HD': '9501.T',
        '関西電力': '9503.T',
        '中部電力': '9502.T',
        '九州電力': '9508.T',
        '東北電力': '9506.T',
        'Jパワー': '9513.T',
        'INPEX': '1605.T',
        'ENEOS HD': '5020.T',
        '出光興産': '5019.T',
        'コスモエネルギーHD': '5021.T',
        '東京ガス': '9531.T',
        '大阪ガス': '9532.T',
        '岩谷産業': '8088.T',
    },
    '建設・不動産・住環境': {
        '三井不動産': '8801.T',
        '三菱地所': '8802.T',
        '住友不動産': '8830.T',
        '東急不動産HD': '3289.T',
        'ヒューリック': '3003.T',
        '大林組': '1802.T',
        '鹿島建設': '1812.T',
        '大成建設': '1801.T',
        '清水建設': '1803.T',
        '積水ハウス': '1928.T',
        '大和ハウス工業': '1925.T',
        '住友林業': '1911.T',
        'TOTO': '5332.T',
        'LIXIL': '5938.T',
    },
}

STOCKWAVE_CLASSIFICATION_DESCRIPTIONS = {
    'デジタル・半導体': '半導体、電子部品、IT機器、ソフトウェアなど、デジタル化を支える企業群。',
    '産業機械・防衛': '工場設備、産業機械、計測・制御、防衛・航空関連を中心とする企業群。',
    '自動車・モビリティ': '自動車、部品、鉄道、海運、物流など、人と物の移動を担う企業群。',
    '金融・商社': '銀行、証券、保険、投資サービス、総合商社をまとめた企業群。',
    'ヘルスケア': '医薬品、医療機器、診断・検査、ヘルスケア関連の企業群。',
    '消費・小売・エンタメ': '小売、日用品、食品、ゲーム・娯楽など個人消費に近い企業群。',
    '通信・ネットサービス': '通信、インターネット、求人・プラットフォーム型サービスの企業群。',
    '素材・化学': '鉄鋼、非鉄、化学、繊維、ガラス、セメントなど産業の基礎素材を担う企業群。',
    'エネルギー・公益': '電力、ガス、石油、資源開発などエネルギー供給を担う企業群。',
    '建設・不動産・住環境': '建設、住宅、不動産、住宅設備など都市・住環境を支える企業群。',
}

# セグメント名をAPI・フロントで識別しやすいよう接頭辞を付ける。
MARKET_SEGMENTS = {
    f"StockWaveJP｜{category}": stocks
    for category, stocks in STOCKWAVE_MARKET_CLASSIFICATION.items()
}

# 銘柄→独自分類のマッピング
STOCK_CLASSIFICATION = {
    ticker: {"major": category, "minor": "StockWaveJP独自分類", "name": name}
    for category, stocks in STOCKWAVE_MARKET_CLASSIFICATION.items()
    for name, ticker in stocks.items()
}

# ── ETF（上場投資信託）────────────────────────────────────
MARKET_SEGMENTS["ETF｜国内株式インデックス"] = {
    "NEXT FUNDS 日経225連動型":          "1321.T",
    "TOPIX連動型上場投信(1306)":         "1306.T",
    "NEXT FUNDS TOPIX連動型":            "1308.T",
    "上場インデックスファンド225":        "1330.T",
    "MAXIS 日経225上場投信":             "1346.T",
    "iシェアーズ 日経225 ETF":           "1329.T",
    "MAXIS TOPIX上場投信":               "1348.T",
    "JPX日経400 ETF":                    "1591.T",
    "日本株高配当70 ETF":                "1577.T",
    "日経平均高配当株50指数連動型ETF":   "1489.T",
    "NEXT FUNDS 東証REIT指数連動型":     "1343.T",
    "MAXIS Jリート上場投信":             "1597.T",
    "iシェアーズ・コア Jリート ETF":    "1476.T",
    "iFreeETF 東証REIT指数":             "1488.T",
    "iシェアーズ 日本高配当株 ETF":     "1478.T",
}
MARKET_SEGMENTS["ETF｜国内株式テーマ"] = {
    "グローバルX半導体 ETF":             "2644.T",
    "NEXT FUNDS 情報通信・サービス他":   "1626.T",
    "NEXT FUNDS 電機・精密":             "1625.T",
    "NEXT FUNDS 輸送用機器":             "1622.T",
    "NEXT FUNDS 銀行業":                 "1615.T",
    "NEXT FUNDS 証券・商品先物":         "1617.T",
    "NEXT FUNDS 保険業":                 "1619.T",
    "NEXT FUNDS 不動産業":               "1631.T",
    "MAXIS 高配当日本株アクティブ":      "2085.T",
    "グローバルX ロジスティクス・J-REIT":"2565.T",
    "グローバルX S&P500配当貴族 ETF":   "2868.T",
}
MARKET_SEGMENTS["ETF｜海外株式・先進国"] = {
    "NEXT FUNDS S&P500指数(ヘッジなし)": "2558.T",
    "iシェアーズ S&P500 米国株 ETF":     "1655.T",
    "MAXIS 全世界株式(オールカントリー)": "2559.T",
    "NEXT FUNDS ナスダック100":           "2631.T",
    "iシェアーズ ナスダック100 ETF":      "2841.T",
    "NEXT FUNDS 外国株式MSCI-KOKUSAI":    "1680.T",
    "iシェアーズ MSCI 全世界株式":       "1554.T",
    "NEXT FUNDS ダウ・ジョーンズ":        "1546.T",
    "上場インデックスファンド米国株式S&P500": "1547.T",
}
MARKET_SEGMENTS["ETF｜新興国・アジア"] = {
    "NEXT FUNDS インドNifty50連動型":     "1678.T",
    "グローバルX インド株式 ETF":         "2850.T",
    "グローバルX チャイナEV・テック ETF": "2854.T",
    "iシェアーズ 中国株式 ETF":          "1575.T",
    "上場インデックスファンド アジアリート":"1495.T",
}
MARKET_SEGMENTS["ETF｜債券・コモディティ"] = {
    "NEXT FUNDS 国内債券インデックス":    "2510.T",
    "iシェアーズ 日本国債 ETF":          "1487.T",
    "NEXT FUNDS 金Price連動型":           "1540.T",
    "NEXT FUNDS 原油価格連動型":          "1699.T",
    "iシェアーズ 米国債7-10年 ETF":      "1482.T",
    "グローバルX 金・貴金属 ETF":         "2861.T",
    "WisdomTree WTI 原油":                "1671.T",
}
MARKET_SEGMENTS["ETF｜レバレッジ・インバース"] = {
    "NEXT FUNDS 日経平均レバレッジ2倍":   "1570.T",
    "NEXT FUNDS 日経平均ダブルインバース": "1571.T",
    "NEXT FUNDS TOPIX レバレッジ(2倍)":   "1568.T",
    "NEXT FUNDS TOPIX インバース(-1倍)":   "1569.T",
    "楽天ETF 日経ダブルブル・マーケット":  "1365.T",
    "大和ETF 日経225インバース":            "1580.T",
}

SEGMENT_GROUPS = {
    "StockWaveJP独自分類": [k for k in MARKET_SEGMENTS if k.startswith("StockWaveJP｜")],
    "ETF": [k for k in MARKET_SEGMENTS if k.startswith("ETF｜")],
}

# ── キャッシュユーティリティ ──
CACHE_DIR = "/tmp/swjp_cache"
CACHE_TTL = 7200  # 2時間

def _cache_key_hash(key: str) -> str:
    return hashlib.md5(key.encode()).hexdigest()

def _get_cache(key: str):
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        path = os.path.join(CACHE_DIR, _cache_key_hash(key) + ".pkl")
        if not os.path.exists(path): return None
        if time.time() - os.path.getmtime(path) > CACHE_TTL: return None
        with open(path, "rb") as f: return pickle.load(f)
    except: return None

def _set_cache(key: str, value):
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        path = os.path.join(CACHE_DIR, _cache_key_hash(key) + ".pkl")
        with open(path, "wb") as f: pickle.dump(value, f)
    except: pass

_mem_cache = {}
_df_cache = {}  # DataFrameは専用キャッシュ（pickle不可のため）
_mem_cache_lock = threading.Lock()
_invalid_tickers = set()

def _get_mem_cache(key: str):
    with _mem_cache_lock:
        entry = _mem_cache.get(key)
        if not entry: return None
        if time.time() - entry["ts"] > CACHE_TTL: return None
        return entry["value"]

def _set_mem_cache(key: str, value):
    with _mem_cache_lock:
        _mem_cache[key] = {"value": value, "ts": time.time()}

# ── データ取得（Infoway専用・yfinanceは廃止）──
def _fetch_df(ticker: str, period: str = "2y") -> pd.DataFrame | None:
    if ticker in _invalid_tickers: return None
    cache_key = f"df_{ticker}_{period}"
    with _mem_cache_lock:
        entry = _df_cache.get(cache_key)
        if entry is not None and time.time() - entry["ts"] < CACHE_TTL:
            return entry["value"]
    # Infoway APIから取得（yfinanceは利用規約上の問題により廃止）
    if INFOWAY_API_KEY:
        df_iw = _fetch_df_infoway(ticker, period)
        if df_iw is not None and len(df_iw) >= 3:
            df_iw = _adjust_for_splits(df_iw, ticker)  # 株式分割の二重チェック補正
            with _mem_cache_lock:
                _df_cache[cache_key] = {"value": df_iw, "ts": time.time()}
            return df_iw
    # Infoway未設定・失敗時はNoneを返す（ホワイトなサイト方針）
    return None
def _period_df(df: pd.DataFrame, period: str) -> pd.DataFrame | None:
    if df is None: return None
    delta_map = {
        "1d": timedelta(days=2), "5d": timedelta(days=8), "1mo": timedelta(days=32),
        "2mo": timedelta(days=63), "3mo": timedelta(days=93),
        "6mo": timedelta(days=185), "1y": timedelta(days=366),
    }
    delta = delta_map.get(period, timedelta(days=32))
    if not delta: return None
    cutoff = pd.Timestamp.now() - delta
    result = df[df.index >= cutoff]
    return result if len(result) >= 2 else None

def _calc_pct(df: pd.DataFrame) -> float | None:
    if df is None or len(df) < 2: return None
    cl = df["Close"].dropna()
    if len(cl) < 2 or (cl <= 0).any(): return None
    pct = (cl.iloc[-1] / cl.iloc[0] - 1) * 100
    return None if abs(pct) > 500 else round(float(pct), 2)

def _robust_avg(vals: list) -> float:
    if not vals: return 0.0
    if len(vals) <= 3: return round(float(np.mean(vals)), 2)
    arr = np.array(vals)
    q1, q3 = np.percentile(arr, 25), np.percentile(arr, 75)
    iqr = q3 - q1
    f = arr[(arr >= q1 - 3*iqr) & (arr <= q3 + 3*iqr)]
    return round(float(f.mean() if len(f) > 0 else np.median(arr)), 2)

# ── API関数 ──
def fetch_theme_results(themes: dict, period: str) -> list:
    cache_key = f"theme_results_{id(themes)}_{period}"
    cached = _get_mem_cache(cache_key)
    if cached is not None: return cached

    result = []
    for theme_name, stocks in themes.items():
        pcts, vols, tvs, vol_chgs = [], [], [], []
        for ticker in stocks.values():
            df = _fetch_df(ticker)
            pdf = _period_df(df, period)
            pct = _calc_pct(pdf)
            if pct is not None:
                pcts.append(pct)
                if pdf is not None and len(pdf) >= 2:
                    vol = pdf["Volume"].dropna()
                    half = max(len(pdf) // 2, 1)
                    rv = float(vol.tail(half).mean()) if len(vol) > 0 else 0
                    pv = float(vol.head(half).mean()) if len(vol) > 0 else 0
                    cl = pdf["Close"].dropna()
                    price = float(cl.iloc[-1]) if len(cl) > 0 else 0
                    vols.append(int(rv))
                    tvs.append(int(rv * price))
                    vol_chgs.append(round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0)
        avg = _robust_avg(pcts)
        result.append({
            "theme": theme_name,
            "pct": avg,
            "up": avg >= 0,
            "stock_count": len(stocks),
            "volume": int(sum(vols)),
            "volume_chg": round(float(np.mean(vol_chgs)) if vol_chgs else 0, 1),
            "trade_value": int(sum(tvs)),
        })

    result.sort(key=lambda x: x["pct"], reverse=True)
    _set_mem_cache(cache_key, result)
    return result

def fetch_theme_trend(theme_stocks: dict, period: str) -> list:
    from concurrent.futures import ThreadPoolExecutor, as_completed

    # キャッシュキーはstocksのhashから生成
    import hashlib as _hl
    ck_src = ",".join(sorted(theme_stocks.values())) + "_" + period
    cache_key = "theme_trend_" + _hl.md5(ck_src.encode()).hexdigest()
    cached = _get_mem_cache(cache_key)
    if cached is not None:
        return cached

    all_dates = set()
    stock_data = {}

    def _safe_fetch(args):
        name, ticker = args
        try:
            df = _fetch_df(ticker)
            if df is None:
                return name, None
            pdf = _period_df(df, period)
            if pdf is None or len(pdf) < 2:
                return name, None
            cl = pdf["Close"].dropna()
            if len(cl) < 2:
                return name, None
            # 価格の異常値チェック：負・ゼロ・極端な値を排除
            if not (cl > 0).all():
                return name, None
            if cl.iloc[0] < 1:  # 基準値が1円未満は異常
                return name, None
            cum = (cl / cl.iloc[0] - 1) * 100
            # 累積騰落率が±1000%を超える場合は異常値として除外
            if cum.abs().max() > 1000:
                return name, None
            # 重複インデックスを解消（株式分割等でまれに発生）
            cum = cum[~cum.index.duplicated(keep='last')]
            return name, cum
        except Exception:
            return name, None

    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = list(ex.map(_safe_fetch, theme_stocks.items()))

    for name, cum in futs:
        if cum is not None:
            stock_data[name] = cum
            all_dates.update(cum.index)

    if not all_dates:
        return []

    dates = sorted(all_dates)
    result = []
    for d in dates:
        vals = []
        for s in stock_data.values():
            try:
                if d not in s.index:
                    continue
                raw = s.loc[d]
                # Seriesが返る場合（重複インデックス）はスカラーに変換
                if isinstance(raw, pd.Series):
                    v = float(raw.iloc[-1])
                else:
                    v = float(raw)
                # ±1000%以内の正常値のみ使用
                if not np.isnan(v) and abs(v) <= 1000:
                    vals.append(v)
            except Exception:
                pass
        if vals:
            result.append({"date": str(d.date()), "pct": round(float(np.mean(vals)), 2)})

    _set_mem_cache(cache_key, result)
    return result

def fetch_segment_detail(seg_name: str, period: str) -> list:
    cache_key = f"seg_detail_v2_{seg_name}_{period}"  # v2: spark追加
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    stocks_def = MARKET_SEGMENTS.get(seg_name, {})
    # セグメント全体の日次騰落率を事前計算（連動度の分母）
    seg_theme_daily = {}
    for _name, _ticker in stocks_def.items():
        _df = _fetch_df(_ticker)
        _pdf = _period_df(_df, period)
        if _pdf is None or len(_pdf) < 2: continue
        _cl = _pdf["Close"].dropna()
        if len(_cl) < 2: continue
        _dr = _cl.pct_change().dropna()
        for _dt, _v in _dr.items():
            _key = str(_dt)[:10]
            if _key not in seg_theme_daily:
                seg_theme_daily[_key] = []
            seg_theme_daily[_key].append(float(_v))
    seg_theme_avg = {dt: float(pd.Series(vals).mean()) for dt, vals in seg_theme_daily.items() if vals}

    result = []
    for i, (name, ticker) in enumerate(stocks_def.items()):
        df = _fetch_df(ticker)
        pdf = _period_df(df, period)
        if pdf is None or len(pdf) < 2: continue
        cl = pdf["Close"].dropna()
        if len(cl) < 2: continue
        pct = round((cl.iloc[-1] / cl.iloc[0] - 1) * 100, 2)
        if abs(pct) > 500: continue
        vol = pdf["Volume"].dropna()
        half = max(len(pdf) // 2, 1)
        rv = float(vol.tail(half).mean()) if len(vol) > 0 else 0
        pv = float(vol.head(half).mean()) if len(vol) > 0 else 0
        vol_chg = round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0
        price = round(float(cl.iloc[-1]), 0)
        tv = int(rv * price)
        # StockWaveJP独自分類を取得
        cls_info = STOCK_CLASSIFICATION.get(ticker, {})
        # スパークライン（6ヶ月の週次騰落率）
        spark = []
        try:
            df_sp = _fetch_df(ticker)
            if df_sp is not None and len(df_sp) >= 10:
                cutoff6 = pd.Timestamp.now() - pd.Timedelta(days=185)
                df_sp6 = df_sp[df_sp.index >= cutoff6]
                cl_sp = df_sp6["Close"].dropna()
                if len(cl_sp) >= 4:
                    base = float(cl_sp.iloc[0])
                    step = max(1, len(cl_sp) // 20)
                    spark = [round((float(v) / base - 1) * 100, 2) for v in cl_sp.iloc[::step]]
        except Exception:
            spark = []
        # 時価総額: fast_info → 出来高近似フォールバック
        market_cap = 0
        try:
            fi2 = yf.Ticker(ticker).fast_info
            mc2 = getattr(fi2, 'market_cap', None)
            if mc2 and mc2 > 0:
                market_cap = int(mc2)
        except Exception:
            pass
        if market_cap == 0:
            try:
                df_seg2 = _fetch_df(ticker)
                if df_seg2 is not None and len(df_seg2) >= 5:
                    lp2 = float(df_seg2['Close'].dropna().iloc[-1])
                    av2 = float(df_seg2['Volume'].dropna().tail(20).mean())
                    if av2 > 0 and lp2 > 0:
                        market_cap = int(av2 / 0.005 * lp2)
            except Exception:
                pass
        # ③連動度: セグメント平均日次騰落率との相関係数 (-100〜100)
        seg_correlation = 0.0
        try:
            dr2 = pdf["Close"].dropna().pct_change().dropna()
            sd = {str(dt)[:10]: float(v) for dt, v in dr2.items()}
            cdates = sorted(set(sd.keys()) & set(seg_theme_avg.keys()))
            if len(cdates) >= 10:
                corr2 = pd.Series([sd[d] for d in cdates]).corr(
                    pd.Series([seg_theme_avg[d] for d in cdates]))
                if not pd.isna(corr2):
                    seg_correlation = round(float(corr2) * 100, 1)
        except Exception:
            seg_correlation = 0.0
        _val = get_valuation(ticker)
        result.append({
            "ticker": ticker, "name": name, "price": price,
            "pct": pct, "contribution": round(pct / max(len(result)+1, 1), 4),  # 寄与度
            "market_cap": market_cap,
            "volume": int(rv), "volume_chg": vol_chg, "trade_value": tv,
            "vol_rank": 0, "tv_rank": 0,
            "major": cls_info.get("major", ""),
            "minor": cls_info.get("minor", ""),
            "spark": spark,
            "per": (_val or {}).get("per"), "per_fwd": (_val or {}).get("per_fwd"),
            "pbr": (_val or {}).get("pbr"), "pbr_fwd": (_val or {}).get("pbr_fwd"),
            "peg": (_val or {}).get("peg"), "peg_fwd": (_val or {}).get("peg_fwd"),
        })

    result.sort(key=lambda x: x["pct"], reverse=True)
    for i, r in enumerate(result): r["vol_rank"] = i + 1
    result_by_tv = sorted(result, key=lambda x: x["trade_value"], reverse=True)
    for i, r in enumerate(result_by_tv): r["tv_rank"] = i + 1

    pcts = [r["pct"] for r in result]
    avg = round(sum(pcts)/len(pcts), 2) if pcts else 0.0
    final = {"stocks": result, "avg": avg}
    _set_mem_cache(cache_key, final)
    _set_cache(cache_key, final)
    return final

def fetch_market_segments(period: str) -> dict:
    cache_key = f"market_segments_swjp_v1_{period}"
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    result = {}
    for seg_name, stocks in MARKET_SEGMENTS.items():
        pcts = []
        for ticker in stocks.values():
            df = _fetch_df(ticker)
            pdf = _period_df(df, period)
            pct = _calc_pct(pdf)
            if pct is not None: pcts.append(pct)
        result[seg_name] = {
            "pct": _robust_avg(pcts),
            "count": len(stocks),
        }

    _set_mem_cache(cache_key, result)
    _set_cache(cache_key, result)
    return result

def fetch_theme_detail(theme_name: str, theme_stocks: dict, period: str) -> dict:
    cache_key = f"theme_detail_v3_{theme_name}_{period}"  # v3: 連動度・高速化
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    # ④高速化: 先に全銘柄のdfをまとめて収集し、market_capも同一dfから計算
    raw = {}
    for name, ticker in theme_stocks.items():
        df = _fetch_df(ticker)
        raw[ticker] = (name, df)

    # テーマ全体の日次騰落率を計算（③連動度の分母）
    theme_returns = {}  # date -> list of daily_pct
    for ticker, (name, df) in raw.items():
        pdf = _period_df(df, period)
        if pdf is None or len(pdf) < 2: continue
        cl = pdf["Close"].dropna()
        if len(cl) < 2: continue
        dr = cl.pct_change().dropna()
        for dt, v in dr.items():
            key = str(dt)[:10]
            if key not in theme_returns:
                theme_returns[key] = []
            theme_returns[key].append(float(v))
    # 各日のテーマ平均日次騰落率
    theme_daily = {dt: float(pd.Series(vals).mean()) for dt, vals in theme_returns.items() if vals}

    stocks = []
    for ticker, (name, df) in raw.items():
        pdf = _period_df(df, period)
        if pdf is None or len(pdf) < 2: continue
        cl = pdf["Close"].dropna()
        if len(cl) < 2: continue
        pct = round((cl.iloc[-1] / cl.iloc[0] - 1) * 100, 2)
        if abs(pct) > 500: continue
        vol = pdf["Volume"].dropna()
        half = max(len(pdf) // 2, 1)
        rv = float(vol.tail(half).mean()) if len(vol) > 0 else 0
        pv = float(vol.head(half).mean()) if len(vol) > 0 else 0
        vol_chg = round((rv - pv) / pv * 100, 1) if pv > 0 else 0.0
        price = round(float(cl.iloc[-1]), 0)
        tv = int(rv * price)

        # ③連動度: テーマ日次騰落率との相関係数 (-100〜100、100=完全連動)
        correlation = 0.0
        try:
            dr = cl.pct_change().dropna()
            stock_daily = {str(dt)[:10]: float(v) for dt, v in dr.items()}
            common_dates = sorted(set(stock_daily.keys()) & set(theme_daily.keys()))
            if len(common_dates) >= 10:
                xs = [stock_daily[d] for d in common_dates]
                ys = [theme_daily[d] for d in common_dates]
                s_x = pd.Series(xs)
                s_y = pd.Series(ys)
                corr = s_x.corr(s_y)
                if not pd.isna(corr):
                    correlation = round(float(corr) * 100, 1)
        except Exception:
            correlation = 0.0

        # スパークライン（既存dfを再利用、fast_info不要）
        spark = []
        try:
            if df is not None and len(df) >= 10:
                df6 = df[df.index >= (pd.Timestamp.now() - pd.Timedelta(days=185))]
                cl6 = df6["Close"].dropna()
                if len(cl6) >= 4:
                    base = float(cl6.iloc[0])
                    step = max(1, len(cl6) // 20)
                    spark = [round((float(v) / base - 1) * 100, 2) for v in cl6.iloc[::step]]
        except Exception:
            spark = []

        # 時価総額: fast_info → 出来高近似の順
        market_cap = 0
        try:
            fi = yf.Ticker(ticker).fast_info
            mc = getattr(fi, 'market_cap', None)
            if mc and mc > 0:
                market_cap = int(mc)
        except Exception:
            pass
        if market_cap == 0:
            try:
                # dfはraw[ticker][1]として取得済み
                df_raw = raw.get(ticker, (None, None))[1]
                if df_raw is not None and len(df_raw) >= 5:
                    lp = float(df_raw['Close'].dropna().iloc[-1])
                    av = float(df_raw['Volume'].dropna().tail(20).mean())
                    if av > 0 and lp > 0:
                        market_cap = int(av / 0.005 * lp)
            except Exception:
                pass

        _val = get_valuation(ticker)
        stocks.append({
            "ticker": ticker, "name": name, "price": price,
            "pct": pct,
            "contribution": round(pct / len(stocks), 4) if len(stocks) > 0 else 0,  # 寄与度（銘柄騰落率÷銘柄数）
            "market_cap": market_cap,
            "volume": int(rv), "volume_chg": vol_chg, "trade_value": tv,
            "spark": spark,
            "vol_rank": 0, "tv_rank": 0,
            "per": (_val or {}).get("per"), "per_fwd": (_val or {}).get("per_fwd"),
            "pbr": (_val or {}).get("pbr"), "pbr_fwd": (_val or {}).get("pbr_fwd"),
            "peg": (_val or {}).get("peg"), "peg_fwd": (_val or {}).get("peg_fwd"),
        })

    stocks.sort(key=lambda x: x["pct"], reverse=True)
    for i, s in enumerate(stocks): s["vol_rank"] = i + 1
    stocks_by_tv = sorted(stocks, key=lambda x: x["trade_value"], reverse=True)
    for i, s in enumerate(stocks_by_tv): s["tv_rank"] = i + 1

    pcts = [s["pct"] for s in stocks]
    result = {"stocks": stocks, "avg": _robust_avg(pcts)}
    _set_mem_cache(cache_key, result)
    _set_cache(cache_key, result)
    return result

def fetch_momentum_data(themes: dict, period: str) -> list:
    cache_key = f"momentum_v2_{period}"  # v2: volume_chg/trade_value追加
    cached = _get_mem_cache(cache_key)
    if cached is not None: return cached

    # テーマ結果をまとめて取得（pct + volume_chg + trade_value 含む）
    cur_results = fetch_theme_results(themes, period)
    cur_map  = {r["theme"]: r for r in cur_results}
    w1_map   = {r["theme"]: r["pct"] for r in fetch_theme_results(themes, "5d")}
    m1_map   = {r["theme"]: r["pct"] for r in fetch_theme_results(themes, "1mo")}

    result = []
    for theme_name, row in cur_map.items():
        cur = row["pct"]
        dw = round(cur - w1_map.get(theme_name, cur), 2)
        if period == "1mo":
            dm = round(m1_map.get(theme_name, 0) - w1_map.get(theme_name, 0), 2)
        else:
            dm = round(cur - m1_map.get(theme_name, cur), 2)
        if   dw > 3  and dm > 5:  state = "🔥加速"
        elif dw < -3 and dm < -5: state = "❄️失速"
        elif dw > 2:               state = "↗転換↑"
        elif dw < -2:              state = "↘転換↓"
        else:                      state = "→横ばい"

        # volume_chg と trade_value を fetch_theme_results から直接取得
        vol_chg_val = float(row.get("volume_chg", 0))
        tv_val      = int(row.get("trade_value", 0))

        result.append({"theme": theme_name, "pct": cur, "week_diff": dw, "month_diff": dm,
                       "state": state, "volume_chg": vol_chg_val, "trade_value": tv_val})

    result.sort(key=lambda x: x["pct"], reverse=True)
    _set_mem_cache(cache_key, result)
    return result

def fetch_heatmap_data(themes: dict) -> dict:
    cache_key = "heatmap_data"
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    periods = {"1W": "5d", "1M": "1mo", "3M": "3mo", "6M": "6mo", "1Y": "1y"}
    result = {}
    for theme_name, stocks in themes.items():
        result[theme_name] = {}
        for label, period in periods.items():
            pcts = []
            for ticker in stocks.values():
                df = _fetch_df(ticker)
                pdf = _period_df(df, period)
                pct = _calc_pct(pdf)
                if pct is not None: pcts.append(pct)
            result[theme_name][label] = _robust_avg(pcts) if pcts else None

    _set_mem_cache(cache_key, result)
    _set_cache(cache_key, result)
    return result

def fetch_heatmap_monthly(themes: dict) -> dict:
    cache_key = "heatmap_monthly"
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    jst = pytz.timezone("Asia/Tokyo")
    now = datetime.now(jst)
    months = []
    # 直近12ヶ月を正しく計算（今月を含む過去12ヶ月）
    for i in range(11, -1, -1):
        # i=11が12ヶ月前、i=0が今月
        total_months = now.month - 1 - i  # 0始まりの月番号から引く
        year_offset = total_months // 12 if total_months >= 0 else (total_months - 11) // 12
        month_in_year = total_months % 12 + 1
        if total_months < 0:
            year_offset = -((-total_months + 11) // 12)
            month_in_year = 12 - ((-total_months - 1) % 12)
        y = now.year + year_offset
        m = month_in_year
        months.append(f"{y}/{m:02d}")

    data = {}
    for theme_name, stocks in themes.items():
        data[theme_name] = {}
        all_dfs = {}
        for name, ticker in stocks.items():
            df = _fetch_df(ticker, "2y")
            if df is not None: all_dfs[ticker] = df

        for m_str in months:
            y, mo = int(m_str[:4]), int(m_str[5:])
            start = pd.Timestamp(y, mo, 1)
            if mo == 12: end = pd.Timestamp(y + 1, 1, 1)
            else: end = pd.Timestamp(y, mo + 1, 1)
            pcts = []
            for ticker, df in all_dfs.items():
                mdf = df[(df.index >= start) & (df.index < end)]
                if len(mdf) >= 2:
                    cl = mdf["Close"].dropna()
                    if len(cl) >= 2 and (cl > 0).all():
                        pct = round((cl.iloc[-1] / cl.iloc[0] - 1) * 100, 2)
                        if abs(pct) < 500: pcts.append(pct)
            data[theme_name][m_str] = _robust_avg(pcts) if pcts else None

    result = {"data": data, "months": months}
    _set_mem_cache(cache_key, result)
    _set_cache(cache_key, result)
    return result

def fetch_macro_data(period: str) -> dict:
    cache_key = f"macro_{period}"
    cached = _get_mem_cache(cache_key)
    if cached is None:
        cached = _get_cache(cache_key)
    if cached is not None: return cached

    result = {}
    for name, ticker in MACRO_TICKERS.items():
        df = _fetch_df(ticker)
        # ETF（1306.Tなど）は最新データが欠落する場合があるため短期再取得を試みる
        pdf = _period_df(df, period)
        if pdf is None or len(pdf) < 2:
            # 短期再取得フォールバック
            try:
                import warnings as _w
                with _w.catch_warnings(): 
                    _w.simplefilter("ignore")
                    df2 = yf.Ticker(ticker).history(period="3mo", interval="1d",
                                                    auto_adjust=True, timeout=20)
                if df2 is not None and len(df2) >= 2:
                    df2.index = df2.index.tz_localize(None)
                    pdf = _period_df(df2, period)
            except Exception:
                pass
        if pdf is None or len(pdf) < 2: continue
        cl = pdf["Close"].dropna()
        if len(cl) < 2: continue
        cum = (cl / cl.iloc[0] - 1) * 100
        result[name] = [{"date": str(d.date()), "pct": round(float(v), 2)} for d, v in cum.items()]

    _set_mem_cache(cache_key, result)
    _set_cache(cache_key, result)
    return result

def warmup_cache_extended(themes: dict):
    print("[warmup] starting...")
    try:
        for period in ["1mo", "3mo"]:
            fetch_theme_results(themes, period)
        for period in ["5d", "1mo"]:
            fetch_market_segments(period)
        fetch_macro_data("1mo")
        print("[warmup] done")
    except Exception as e:
        print(f"[warmup] error: {e}")

# StockWaveJP独自分類の説明をAPIで返すための関数
def get_market_classification_info(seg_name: str) -> dict:
    """StockWaveJP独自分類の説明と構成方針を返す。"""
    if not seg_name.startswith("StockWaveJP｜"):
        return {}
    category = seg_name.replace("StockWaveJP｜", "", 1)
    stocks = STOCKWAVE_MARKET_CLASSIFICATION.get(category, {})
    return {
        "category": category,
        "count": len(stocks),
        "description": STOCKWAVE_CLASSIFICATION_DESCRIPTIONS.get(category, ""),
        "methodology": "StockWaveJPが主力事業に基づいて独自分類した参考情報です。公式指数・公式業種分類ではありません。",
    }
