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

# ── 日経225 大分類・小分類・銘柄 ──
# 出典：公開情報をもとに構成（構成銘柄は定期的に見直し）
# 大分類：技術、金融、消費、素材、資本財・その他、運輸・公共
# 各銘柄に大分類・小分類を付与

NIKKEI225_CLASSIFICATION = {
    # 大分類: 技術
    "技術": {
        "電気機器": {
            "日立製作所":"6501.T","三菱電機":"6503.T","富士電機":"6504.T","安川電機":"6506.T",
            "NEC":"6701.T","富士通":"6702.T","ソニーグループ":"6758.T","パナソニックHD":"6752.T",
            "TDK":"6762.T","京セラ":"6971.T","村田製作所":"6981.T","オムロン":"6645.T",
            "キーエンス":"6861.T","ファナック":"6954.T","アドバンテスト":"6857.T",
            "東京エレクトロン":"8035.T","ルネサス":"6723.T","レーザーテック":"6920.T",
            "ディスコ":"6146.T","ソシオネクスト":"6526.T","ローム":"6563.T",
            "イビデン":"4062.T","SHIFT":"3697.T","ベイカレント":"6532.T",
        },
        "精密機器": {
            "オリンパス":"7733.T","HOYA":"7741.T","テルモ":"4543.T",
            "シスメックス":"6869.T","キヤノン":"7751.T","ニコン":"7731.T",
        },
        "情報・通信": {
            "野村総合研究所":"4307.T",
        },
    },
    # 大分類: 金融
    "金融": {
        "銀行": {
            "三菱UFJ FG":"8306.T","三井住友FG":"8316.T","みずほFG":"8411.T",
            "りそなHD":"8308.T","しずおかFG":"5831.T",
        },
        "その他金融": {
            "オリックス":"8591.T","日本取引所G":"8697.T",
        },
        "証券": {
            "野村HD":"8604.T","大和証券G":"8601.T",
        },
        "保険": {
            "東京海上HD":"8766.T","MS&AD保険G":"8725.T","SOMPO HD":"8630.T","第一生命HD":"8750.T",
        },
    },
    # 大分類: 消費
    "消費": {
        "自動車・輸送用機器": {
            "トヨタ自動車":"7203.T","ホンダ":"7267.T","日産自動車":"7201.T",
            "マツダ":"7261.T","スズキ":"7269.T","デンソー":"6902.T","豊田自動織機":"6201.T",
            "アイシン":"7259.T","住友電気工業":"5802.T",
        },
        "小売業": {
            "ファーストリテイリング":"9983.T","セブン&アイHD":"3382.T","イオン":"8267.T",
            "ニトリHD":"9843.T","良品計画":"7453.T","ZOZO":"3092.T",
            "パン・パシフィックINT HD":"7532.T",
        },
        "食料品": {
            "味の素":"2802.T","キリンHD":"2503.T","日清食品HD":"2897.T",
            "アサヒグループHD":"2502.T","明治HD":"2269.T","キッコーマン":"2801.T",
            "日本ハム":"2282.T","マルハニチロ":"1333.T",
        },
        "サービス": {
            "リクルートHD":"6098.T","オリエンタルランド":"4661.T",
            "エムスリー":"2413.T","パーソルHD":"2181.T",
        },
        "その他製品": {
            "任天堂":"7974.T","バンダイナムコHD":"7832.T","コナミグループ":"9766.T",
            "ヤマハ":"7951.T","シード":"4042.T",
        },
        "繊維製品": {
            "東レ":"3402.T","帝人":"3401.T",
        },
        "水産・農林": {
            "ニッスイ":"1332.T",
        },
    },
    # 大分類: 素材
    "素材": {
        "化学": {
            "信越化学工業":"4063.T","住友化学":"4005.T","旭化成":"3407.T","三菱ケミカルG":"4188.T",
            "花王":"4452.T","富士フイルムHD":"4901.T","日東電工":"6988.T","デンカ":"4061.T",
            "カネカ":"4118.T","積水化学工業":"4204.T","東ソー":"4042.T",
        },
        "医薬品": {
            "武田薬品工業":"4502.T","アステラス製薬":"4503.T","第一三共":"4568.T",
            "中外製薬":"4519.T","エーザイ":"4523.T","大塚HD":"4578.T","塩野義製薬":"4507.T",
            "小野薬品工業":"4528.T","参天製薬":"4536.T",
        },
        "石油・石炭": {
            "ENEOS HD":"5020.T","出光興産":"5019.T",
        },
        "ゴム製品": {
            "ブリヂストン":"5108.T","住友ゴム工業":"5110.T",
        },
        "ガラス・土石": {
            "AGC":"5201.T","日本板硝子":"5202.T","太平洋セメント":"5233.T",
        },
        "鉄鋼": {
            "日本製鉄":"5401.T","JFE HD":"5411.T","神戸製鋼所":"5406.T",
        },
        "非鉄金属": {
            "住友金属鉱山":"5713.T","三菱マテリアル":"5711.T","DOWAホールディングス":"5714.T",
            "古河電気工業":"5801.T",
        },
        "パルプ・紙": {
            "王子HD":"3861.T","大王製紙":"3880.T",
        },
        "鉱業": {
            "INPEX":"1605.T",
        },
    },
    # 大分類: 資本財・その他
    "資本財・その他": {
        "機械": {
            "クボタ":"6326.T","コマツ":"6301.T","SMC":"6273.T","ダイキン工業":"6367.T",
            "三菱重工業":"7011.T","川崎重工業":"7012.T","IHI":"7013.T",
            "住友重機械工業":"6302.T","荏原製作所":"6361.T","日立建機":"6305.T",
            "ミネベアミツミ":"6479.T","日本精工":"6471.T","THK":"6481.T",
            "椿本チエイン":"6371.T",
        },
        "建設": {
            "大林組":"1802.T","清水建設":"1803.T","鹿島建設":"1812.T","大成建設":"1801.T",
            "大和ハウス工業":"1925.T","積水ハウス":"1928.T",
        },
        "不動産": {
            "三井不動産":"8801.T","三菱地所":"8802.T","住友不動産":"8830.T",
        },
        "卸売業": {
            "三菱商事":"8058.T","三井物産":"8031.T","伊藤忠商事":"8001.T",
            "住友商事":"8053.T","丸紅":"8002.T","豊田通商":"8015.T","双日":"2768.T",
        },
        "電気・ガス": {
            "東京電力HD":"9501.T","関西電力":"9503.T","中部電力":"9502.T",
            "東京ガス":"9531.T","大阪ガス":"9532.T",
        },
    },
    # 大分類: 運輸・公共
    "運輸・公共": {
        "陸運": {
            "JR東日本":"9020.T","JR東海":"9022.T","JR西日本":"9021.T",
            "東急":"9005.T","小田急電鉄":"9007.T","近鉄GHD":"9041.T",
            "ヤマトHD":"9064.T","SGホールディングス":"9143.T",
        },
        "海運": {
            "日本郵船":"9101.T","商船三井":"9104.T","川崎汽船":"9107.T",
        },
        "空運": {
            "JAL":"9201.T","ANA HD":"9202.T",
        },
        "通信": {
            "NTT":"9432.T","KDDI":"9433.T","ソフトバンク":"9434.T","ソフトバンクG":"9984.T",
        },
        "倉庫・運輸関連": {
            "三菱倉庫":"9301.T",
        },
    },
}

# 大分類・小分類の説明（⑥で使用）
NIKKEI225_SUBCATEGORY_DESC = {
    "技術": {"電気機器":"電気機器","精密機器":"精密機器","情報・通信":"情報・通信"},
    "金融": {"銀行":"銀行","その他金融":"その他金融","証券":"証券","保険":"保険"},
    "消費": {"自動車・輸送用機器":"自動車・輸送用機器","小売業":"小売業","食料品":"食料品","サービス":"サービス","その他製品":"その他製品","繊維製品":"繊維製品","水産・農林":"水産・農林"},
    "素材": {"化学":"化学","医薬品":"医薬品","石油・石炭":"石油・石炭","ゴム製品":"ゴム製品","ガラス・土石":"ガラス・土石","鉄鋼":"鉄鋼","非鉄金属":"非鉄金属","パルプ・紙":"パルプ・紙","鉱業":"鉱業"},
    "資本財・その他": {"機械":"機械","建設":"建設","不動産":"不動産","卸売業":"卸売業","電気・ガス":"電気・ガス"},
    "運輸・公共": {"陸運":"陸運","海運":"海運","空運":"空運","通信":"通信","倉庫・運輸関連":"倉庫・運輸関連"},
}

# MARKET_SEGMENTSを構築（バックエンド互換性のため）
def _build_nikkei_segments():
    segments = {}
    for major, subs in NIKKEI225_CLASSIFICATION.items():
        all_stocks = {}
        for sub_stocks in subs.values():
            all_stocks.update(sub_stocks)
        segments[f"日経225｜{major}"] = all_stocks
    # 市場区分（プライム・スタンダード・グロース）を追加
    segments["プライム市場"] = {
        "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
        "キーエンス":"6861.T","東京エレクトロン":"8035.T","ファーストリテイリング":"9983.T",
        "信越化学工業":"4063.T","リクルートHD":"6098.T","三菱商事":"8058.T",
        "KDDI":"9433.T","任天堂":"7974.T","ダイキン工業":"6367.T",
        "日立製作所":"6501.T","三井住友FG":"8316.T","ホンダ":"7267.T",
        "中外製薬":"4519.T","東京海上HD":"8766.T","村田製作所":"6981.T",
        "ファナック":"6954.T","三井物産":"8031.T","NTT":"9432.T",
        "ソフトバンクグループ":"9984.T","三菱電機":"6503.T","富士フイルムHD":"4901.T",
        "塩野義製薬":"4507.T","セブン＆アイHD":"3382.T","伊藤忠商事":"8001.T",
        "住友商事":"8053.T","丸紅":"8002.T","デンソー":"6902.T",
        "SMC":"6273.T","オリックス":"8591.T","武田薬品工業":"4502.T",
        "アステラス製薬":"4503.T","大塚HD":"4578.T","エーザイ":"4523.T",
        "第一三共":"4568.T","富士通":"6702.T","NEC":"6701.T",
        "パナソニックHD":"6752.T","京セラ":"6971.T","TDK":"6762.T",
        "住友電気工業":"5802.T","川崎重工業":"7012.T","三菱重工業":"7011.T",
        "IHI":"7013.T","スズキ":"7269.T","マツダ":"7261.T",
        "コマツ":"6301.T","クボタ":"6326.T","住友重機械工業":"6302.T",
    }
    segments["スタンダード市場"] = {
        "東京製鐵":"5423.T","大和工業":"5444.T","トーセイ":"8923.T",
        "ビックカメラ":"3048.T","テレビ東京HD":"9413.T","松竹":"9601.T",
        "東映":"9605.T","日本BS放送":"9414.T","日本瓦斯":"8174.T",
        "エレコム":"6750.T","サンリオ":"8136.T","ニフコ":"7988.T",
        "パーク24":"4666.T","西松屋チェーン":"7545.T","トリドールHD":"3397.T",
        "ケーズHD":"8282.T","アークス":"9948.T","コメダHD":"3543.T",
        "松屋フーズHD":"9887.T","リンガーハット":"8200.T","物語コーポレーション":"3097.T",
        "ハウス食品グループ":"2810.T","キユーピー":"2809.T","不二製油グループ":"2607.T",
        "ライフコーポレーション":"8194.T","ベルク":"9974.T","ヤオコー":"8279.T",
        "サミット":"9411.T","ゲオHD":"2681.T","ヤマダHD":"9831.T",
        "DCMホールディングス":"3050.T","コメリ":"8228.T","カインズ":"8218.T",
        "ナフコ":"2790.T","コーナン商事":"7516.T","アレンザHD":"3546.T",
        "島忠":"8184.T","ホームズ":"6184.T","くすりの窓口":"3360.T",
        "クリエイトSDHD":"3148.T","クリエイトメディカル":"4413.T",
        "ツルハHD":"3391.T","コスモス薬品":"3349.T","クスリのアオキHD":"3358.T",
        "カワチ薬品":"2664.T","サンドラッグ":"9989.T","スギHD":"7649.T",
        "アインHD":"9946.T","日本調剤":"3341.T","総合メディカル":"4775.T",
    }
    segments["グロース市場"] = {
        "さくらインターネット":"3778.T","メルカリ":"4385.T",
        "弁護士ドットコム":"6027.T","freee":"4478.T",
        "マネーフォワード":"3994.T","Sansan":"4443.T","ラクス":"3923.T",
        "HENNGE":"4475.T","カオナビ":"4435.T","プレイド":"4165.T",
        "ウォンテッドリー":"3991.T","ビジョナル":"4194.T",
        "インフォマート":"2492.T","ブレインパッド":"3655.T",
        "ユーザーローカル":"3984.T","BASE":"4477.T","Appier":"4180.T",
        "ラクスル":"4384.T","アイスタイル":"3660.T","SHIFT":"3697.T",
        "JDSC":"4418.T","アイドマHD":"7373.T","ジーニー":"6562.T",
        "アドベンチャー":"6030.T","マクアケ":"4479.T","メドレー":"4480.T",
        "ウェルスナビ":"7342.T","Finatext":"4419.T",
        "グローバルウェイ":"3936.T","ライトワークス":"4267.T",
        "HEROZ":"4382.T","うるる":"3979.T","クラウドワークス":"3900.T",
        "ランサーズ":"4484.T","ITbookHD":"1447.T","バリューデザイン":"3960.T",
        "Sharing Innovations":"4178.T","and factory":"7671.T",
        "ログリー":"6579.T","インティメート・マージャー":"7072.T",
        "イルグルム":"3690.T","ナレルグループ":"9163.T","Photosynth":"4379.T",
        "ROBOT PAYMENT":"4374.T","フリーランスアソシエーション":"4294.T",
        "サイバーセキュリティクラウド":"4493.T","イノベーション":"3970.T",
    }
    return segments

# 銘柄→大分類・小分類のマッピング
def _build_stock_classification():
    mapping = {}  # ticker -> {major, minor}
    for major, subs in NIKKEI225_CLASSIFICATION.items():
        for minor, stocks in subs.items():
            for name, ticker in stocks.items():
                mapping[ticker] = {"major": major, "minor": minor, "name": name}
    return mapping

STOCK_CLASSIFICATION = _build_stock_classification()

MARKET_SEGMENTS = _build_nikkei_segments()

# TOPIX構成銘柄
# 国内全般（時価総額順位ベース・参考値）
MARKET_SEGMENTS["国内全般｜時価総額上位50"] = {
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
}
MARKET_SEGMENTS["国内全般｜上位51-100位"] = {
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
}
MARKET_SEGMENTS["国内全般｜上位101-150位"] = {
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
    "住友大阪セメント":"5232.T","日本板硝子":"5202.T","旭ダイヤモンド工業":"6104.T",
}

MARKET_SEGMENTS["プライム市場"] = {
    "トヨタ自動車":"7203.T","ソニーグループ":"6758.T","三菱UFJ FG":"8306.T",
    "キーエンス":"6861.T","東京エレクトロン":"8035.T","ファーストリテイリング":"9983.T",
    "信越化学工業":"4063.T","リクルートHD":"6098.T","三菱商事":"8058.T",
    "KDDI":"9433.T","任天堂":"7974.T","ダイキン工業":"6367.T",
    "日立製作所":"6501.T","三井住友FG":"8316.T","ホンダ":"7267.T",
    "中外製薬":"4519.T","東京海上HD":"8766.T","村田製作所":"6981.T",
    "ファナック":"6954.T","三井物産":"8031.T",
}
MARKET_SEGMENTS["スタンダード市場（一部）"] = {
    "東京製鐵":"5423.T","大和工業":"5444.T","三井E&S":"7003.T",
    "トーセイ":"8923.T","ビックカメラ":"3048.T","DCMホールディングス":"3050.T",
    "テレビ東京HD":"9413.T","松竹":"9601.T",
}
MARKET_SEGMENTS["グロース市場（一部）"] = {
    "さくらインターネット":"3778.T","メルカリ":"4385.T",
    "Appier Group":"4180.T","弁護士ドットコム":"6027.T",
    "freee":"4478.T","マネーフォワード":"3994.T","BASE":"4477.T",
    "Sansan":"4443.T","ラクス":"3923.T","プレイド":"4165.T",
}

SEGMENT_GROUPS = {
    "国内主要株": [k for k in MARKET_SEGMENTS if k.startswith("日経225")],
    "国内全般":   [k for k in MARKET_SEGMENTS if k.startswith("国内全般")],
    "市場区分":   [k for k in MARKET_SEGMENTS if any(k.startswith(x) for x in ["プライム","スタンダード","グロース"])],
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

# ── yfinance取得 ──
def _fetch_df(ticker: str, period: str = "2y") -> pd.DataFrame | None:
    if ticker in _invalid_tickers: return None
    cache_key = f"df_{ticker}_{period}"
    # DataFrame専用キャッシュ（bool評価しない）
    with _mem_cache_lock:
        entry = _df_cache.get(cache_key)
        if entry is not None and time.time() - entry["ts"] < CACHE_TTL:
            return entry["value"]
    try:
        # yfinanceのwarningを一時的に抑制
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            df = yf.Ticker(ticker).history(period=period, interval="1d", auto_adjust=True, repair=True, timeout=20)
        if df is None or len(df) < 3:
            _invalid_tickers.add(ticker)
            print(f"[SKIP] {ticker}: データ不足または上場廃止（テーマ計算から除外）")
            return None
        df.index = df.index.tz_localize(None)
        with _mem_cache_lock:
            _df_cache[cache_key] = {"value": df, "ts": time.time()}
        return df
    except Exception as e:
        err_str = str(e).lower()
        if any(k in err_str for k in ["404", "delisted", "no data found", "no price data"]):
            _invalid_tickers.add(ticker)
            print(f"[SKIP] {ticker}: 上場廃止またはデータなし（テーマ計算から除外）")
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
        # 大分類・小分類を取得
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
        result.append({
            "ticker": ticker, "name": name, "price": price,
            "pct": pct, "contribution": round(pct / max(len(result)+1, 1), 4),  # 寄与度
            "market_cap": market_cap,
            "volume": int(rv), "volume_chg": vol_chg, "trade_value": tv,
            "vol_rank": 0, "tv_rank": 0,
            "major": cls_info.get("major", ""),
            "minor": cls_info.get("minor", ""),
            "spark": spark,
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
    cache_key = f"market_segments_{period}"
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

        stocks.append({
            "ticker": ticker, "name": name, "price": price,
            "pct": pct,
            "contribution": round(pct / len(stocks), 4) if len(stocks) > 0 else 0,  # 寄与度（銘柄騰落率÷銘柄数）
            "market_cap": market_cap,
            "volume": int(rv), "volume_chg": vol_chg, "trade_value": tv,
            "spark": spark,
            "vol_rank": 0, "tv_rank": 0,
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

# 日経225 セグメント分類情報をAPIで返すための関数
def get_nikkei_classification_info(seg_name: str) -> dict:
    """日経225セグメントの大分類・小分類情報を返す"""
    if not seg_name.startswith("日経225｜") and not seg_name.startswith("国内主要株｜"): return {}
    major = seg_name.replace("日経225｜", "")
    subs = NIKKEI225_CLASSIFICATION.get(major, {})
    sub_names = list(subs.keys())
    return {
        "major": major,
        "sub_categories": sub_names,
        "description": f"この分類には{', '.join(sub_names)}が含まれます。"
    }
