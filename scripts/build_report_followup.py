#!/usr/bin/env python3
import json, math
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'frontend/public/data'
JST=timezone(timedelta(hours=9))

def load(path, default):
    try:return json.loads(path.read_text(encoding='utf-8'))
    except Exception:return default

def main():
    index=load(DATA/'weekly_reports/index.json',[])
    if len(index)<2:return print('not enough reports')
    market=load(DATA/'market.json',{})
    themes={x['theme']:x for x in market.get('themes_5d',{}).get('themes',[])}
    macro=market.get('macro_5d',{}).get('data',{}).get('TOPIX連動型上場投信(1306)',[])
    market_pct=float(macro[-1].get('pct',0)) if macro else 0.0
    current, previous=index[0],index[1]
    current_path=DATA/'weekly_reports'/f"{current['week']}.json"
    report=load(current_path,{})
    rows=[]
    for rank,item in enumerate(previous.get('top5_themes',[])[:5],1):
        theme=item.get('theme'); ret=themes.get(theme,{}).get('pct')
        ret=float(ret) if ret is not None else None
        excess=ret-market_pct if ret is not None else None
        rows.append({'rank':rank,'theme':theme,'return_pct':ret,'market_pct':market_pct,'excess_pct':excess,'hit':excess is not None and excess>0})
    report['ranking_followup']={'source_week':previous.get('week'),'note':f"前回（{previous.get('title','')}）TOP5の翌週成績。市場平均はTOPIX連動型ETF(1306)。",'rows':rows,'updated_at':datetime.now(JST).isoformat(timespec='seconds')}
    current_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    latest=DATA/'weekly_report.json'
    if latest.exists():latest.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print('updated',current_path)
if __name__=='__main__':main()
