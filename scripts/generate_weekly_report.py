"""
generate_weekly_report.py - 週次レポート自動生成スクリプト
毎週金曜日 引け後（16:00 JST）に GitHub Actions で実行
生成したレポートを frontend/public/data/weekly_report.json に保存
"""
import json, os, sys, re
from datetime import datetime, timedelta
import pytz
import anthropic

JST = pytz.timezone("Asia/Tokyo")

def load_market_data():
    """market.json からテーマデータを読み込む"""
    path = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data", "market.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def extract_theme_summary(mj: dict) -> dict:
    """market.json からテーマ別騰落率サマリを抽出"""
    themes_1w = mj.get("themes_5d", {}).get("themes", [])
    themes_1mo = mj.get("themes_1mo", {}).get("themes", [])

    theme_map_1w  = {t["theme"]: t for t in themes_1w}
    theme_map_1mo = {t["theme"]: t for t in themes_1mo}

    # 週次TOP/BOTTOM
    sorted_1w = sorted(themes_1w, key=lambda x: x.get("pct", 0), reverse=True)
    top5  = sorted_1w[:5]
    bot5  = sorted_1w[-5:]

    # 全テーマの騰落率サマリ
    avg_1w = sum(t.get("pct", 0) for t in themes_1w) / max(len(themes_1w), 1)
    rise   = sum(1 for t in themes_1w if t.get("pct", 0) >= 0)
    fall   = sum(1 for t in themes_1w if t.get("pct", 0) < 0)

    return {
        "top5_themes":  top5,
        "bot5_themes":  bot5,
        "avg_pct_1w":   round(avg_1w, 2),
        "rise_count":   rise,
        "fall_count":   fall,
        "total_themes": len(themes_1w),
        "theme_map_1w": theme_map_1w,
        "theme_map_1mo": theme_map_1mo,
    }

def extract_stock_highlights(mj: dict, summary: dict) -> dict:
    """強かった・弱かった銘柄をheatmapデータから抽出"""
    top_stocks, bot_stocks = [], []

    # 上位テーマの銘柄詳細からピックアップ
    for t in summary["top5_themes"][:3]:
        key = f"theme_detail_{t['theme']}_5d"
        detail = mj.get(key, {})
        stocks = detail.get("stocks", [])
        if stocks:
            best = sorted(stocks, key=lambda x: x.get("pct", 0), reverse=True)[:2]
            top_stocks.extend([{**s, "theme": t["theme"]} for s in best])

    for t in summary["bot5_themes"][:3]:
        key = f"theme_detail_{t['theme']}_5d"
        detail = mj.get(key, {})
        stocks = detail.get("stocks", [])
        if stocks:
            worst = sorted(stocks, key=lambda x: x.get("pct", 0))[:2]
            bot_stocks.extend([{**s, "theme": t["theme"]} for s in worst])

    return {"top_stocks": top_stocks[:6], "bot_stocks": bot_stocks[:6]}

def generate_report_with_claude(summary: dict, stocks: dict, date_str: str) -> str:
    """Claude APIで週次レポート本文を生成"""
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise EnvironmentError(
            "ANTHROPIC_API_KEY が設定されていません。\n"
            "GitHub Actions の場合: Settings → Secrets and variables → Actions → "
            "New repository secret で ANTHROPIC_API_KEY を追加してください。\n"
            "ローカル実行の場合: export ANTHROPIC_API_KEY=sk-ant-... を実行してください。"
        )
    client = anthropic.Anthropic(api_key=api_key)

    # プロンプトデータ構築
    top5_text = "\n".join(
        f"  {i+1}. {t['theme']}: {t['pct']:+.1f}% (出来高増減: {t.get('volume_chg', 0):+.1f}%)"
        for i, t in enumerate(summary["top5_themes"])
    )
    bot5_text = "\n".join(
        f"  {i+1}. {t['theme']}: {t['pct']:+.1f}%"
        for i, t in enumerate(summary["bot5_themes"])
    )
    top_stocks_text = "\n".join(
        f"  ・{s['name']}({s['ticker'].replace('.T','')})[{s['theme']}]: {s['pct']:+.1f}%"
        for s in stocks["top_stocks"]
    ) or "  データなし"
    bot_stocks_text = "\n".join(
        f"  ・{s['name']}({s['ticker'].replace('.T','')})[{s['theme']}]: {s['pct']:+.1f}%"
        for s in stocks["bot_stocks"]
    ) or "  データなし"

    prompt = f"""あなたは日本株市場のプロアナリストです。
以下のデータをもとに、個人投資家向けの週次マーケットレポートを作成してください。

【集計週】{date_str}

【今週の全体概況】
- テーマ平均騰落率: {summary["avg_pct_1w"]:+.2f}%
- 上昇テーマ数: {summary["rise_count"]} / 下落テーマ数: {summary["fall_count"]} (全{summary["total_themes"]}テーマ)

【今週 強かったテーマ TOP5（週次騰落率）】
{top5_text}

【今週 弱かったテーマ BOTTOM5】
{bot5_text}

【今週 強かった銘柄（主要テーマより）】
{top_stocks_text}

【今週 弱かった銘柄（主要テーマより）】
{bot_stocks_text}

【レポート作成条件】
1. 5000字以上で作成すること
2. 以下の構成で書くこと:
   ① 今週の市場全体の総評（500字以上）
   ② 今週の強かったテーマ詳細解説（各テーマ300字以上、計1500字以上）
   ③ 今週の強かった銘柄解説（各銘柄200字以上）
   ④ 今週の弱かったテーマ・銘柄と背景分析（800字以上）
   ⑤ 来週注目すべきテーマと銘柄（1000字以上）
   ⑥ 投資戦略のまとめ（500字以上）
3. 断定的な推奨は避け「可能性がある」「注目される」などの表現を使う
4. 具体的な数値データを積極的に引用する
5. 素人にも分かりやすく、専門用語には簡単な説明を加える
6. 「なぜ強かったのか」「なぜ弱かったのか」の背景・要因を分析する

レポートをMarkdown形式で作成してください。"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

def main():
    now_jst = datetime.now(JST)
    date_str = now_jst.strftime("%Y年%m月%d日（週）")
    week_str = now_jst.strftime("%Y-%m-%d")

    print(f"=== 週次レポート生成開始: {now_jst.strftime('%Y/%m/%d %H:%M JST')} ===")

    # データ読み込み
    print("market.json 読み込み中...")
    mj = load_market_data()

    # テーマサマリ抽出
    print("テーマサマリ抽出中...")
    summary = extract_theme_summary(mj)

    print(f"  上位テーマ: {[t['theme'] for t in summary['top5_themes']]}")
    print(f"  下位テーマ: {[t['theme'] for t in summary['bot5_themes']]}")

    # 銘柄ハイライト抽出
    print("銘柄ハイライト抽出中...")
    stocks = extract_stock_highlights(mj, summary)

    # Claude APIでレポート生成
    print("Claude APIでレポート生成中...")
    report_text = generate_report_with_claude(summary, stocks, date_str)
    print(f"  生成完了: {len(report_text)}文字")

    # 出力
    output = {
        "week": week_str,
        "generated_at": now_jst.strftime("%Y/%m/%d %H:%M JST"),
        "title": f"週次マーケットレポート {date_str}",
        "summary": {
            "avg_pct_1w": summary["avg_pct_1w"],
            "rise_count": summary["rise_count"],
            "fall_count": summary["fall_count"],
            "top5_themes": [{"theme": t["theme"], "pct": t["pct"]} for t in summary["top5_themes"]],
            "bot5_themes": [{"theme": t["theme"], "pct": t["pct"]} for t in summary["bot5_themes"]],
        },
        "report": report_text,
    }

    # 次回更新予定（翌週金曜16時JST）
    next_friday = now_jst + timedelta(days=(4 - now_jst.weekday()) % 7 + 7 if now_jst.weekday() == 4 else timedelta(days=(4 - now_jst.weekday()) % 7).days)
    # 単純に7日後の金曜
    next_report_dt = now_jst + timedelta(days=7)
    output["next_report_at"] = next_report_dt.strftime("%Y年%m月%d日 16:00")

    out_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data")
    os.makedirs(out_dir, exist_ok=True)

    # 最新レポートを保存
    out_path = os.path.join(out_dir, "weekly_report.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # 過去ログ: weekly_reports/{week_str}.json にも保存
    archive_dir = os.path.join(out_dir, "weekly_reports")
    os.makedirs(archive_dir, exist_ok=True)
    archive_path = os.path.join(archive_dir, f"{week_str}.json")
    with open(archive_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # インデックスファイル更新（過去レポート一覧）
    index_path = os.path.join(archive_dir, "index.json")
    index = []
    if os.path.exists(index_path):
        with open(index_path, encoding="utf-8") as f:
            index = json.load(f)
    # 既存エントリの更新または追加
    existing = next((x for x in index if x["week"] == week_str), None)
    entry = {"week": week_str, "title": output["title"], "generated_at": output["generated_at"],
             "avg_pct_1w": summary["avg_pct_1w"]}
    if existing:
        index = [entry if x["week"] == week_str else x for x in index]
    else:
        index.insert(0, entry)  # 新しい順
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"✅ 保存完了: {out_path}")
    print(f"   アーカイブ: {archive_path}")
    print(f"   レポート文字数: {len(report_text)}")
    print(f"   次回更新予定: {output['next_report_at']}")

if __name__ == "__main__":
    main()
