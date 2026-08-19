#!/usr/bin/env python3
"""Validate static DevEdge indicator conditions without look-ahead bias.

Each observation is evaluated only against returns in subsequent snapshots.
This is a descriptive check, not a prediction model or trading recommendation.
"""
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "frontend" / "public" / "data"
HISTORY = DATA / "dev_edge_technical_history.json"
OUT = DATA / "dev_edge_signal_validation.json"
JST = timezone(timedelta(hours=9))


def load(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def compound(values):
    result = 1.0
    for value in values:
        result *= 1 + value / 100
    return (result - 1) * 100


def conditions(technical):
    rsi = technical.get("rsi14")
    bb = technical.get("bb_pct_b")
    trend = bool(technical.get("above_ma25") and technical.get("above_ma75"))
    macd = bool(technical.get("macd_bullish") and technical.get("macd_hist_rising"))
    rsi_ready = isinstance(rsi, (int, float)) and 45 <= rsi <= 68
    bb_ready = isinstance(bb, (int, float)) and 0.45 <= bb <= 1.0
    return {
        "トレンド（25日・75日線上）": trend,
        "RSI（45〜68）": rsi_ready,
        "MACD（上向き・拡大）": macd,
        "ボリンジャー（中心〜+2σ内）": bb_ready,
        "複合買い場候補": trend and rsi_ready and macd and bb_ready,
    }


def summarize(name, outcomes):
    five = [item[0] for item in outcomes]
    twenty = [item[1] for item in outcomes if item[1] is not None]
    count = len(five)
    avg5 = sum(five) / count if count else 0.0
    avg20 = sum(twenty) / len(twenty) if twenty else 0.0
    win_rate = sum(value > 0 for value in five) / count * 100 if count else 0.0
    return {
        "signal": name,
        "count": count,
        "avg_5d": round(avg5, 3),
        "avg_20d": round(avg20, 3),
        "win_rate": round(win_rate, 1),
        "max_drawdown": round(min(five), 3) if five else 0.0,
        "edge": count >= 30 and avg5 > 0 and win_rate >= 52,
    }


def main():
    history = sorted(load(HISTORY, []), key=lambda item: item.get("date", ""))[-260:]
    names = [
        "トレンド（25日・75日線上）", "RSI（45〜68）", "MACD（上向き・拡大）",
        "ボリンジャー（中心〜+2σ内）", "複合買い場候補",
    ]
    results = {name: [] for name in names}
    for index, snapshot in enumerate(history):
        future = history[index + 1:index + 21]
        for ticker, technical in snapshot.get("stocks", {}).items():
            returns = []
            for later in future:
                item = later.get("stocks", {}).get(ticker, {})
                value = item.get("daily_pct")
                if isinstance(value, (int, float)):
                    returns.append(float(value))
            if len(returns) < 5:
                continue
            for name, matched in conditions(technical).items():
                if matched:
                    results[name].append((compound(returns[:5]), compound(returns[:20]) if len(returns) >= 20 else None))
    rows = [summarize(name, results[name]) for name in names]
    OUT.write_text(json.dumps({
        "updated_at": datetime.now(JST).isoformat(timespec="seconds"),
        "method": "日次スナップショットの条件成立後、次の5・20営業日相当を集計。未来データは条件判定に使用しない。",
        "rows": rows,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"technical snapshots={len(history)}")


if __name__ == "__main__":
    main()
