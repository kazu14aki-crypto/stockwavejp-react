#!/usr/bin/env python3
import json, math
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'frontend/public/data'
JST=timezone(timedelta(hours=9))
HIST=DATA/'dev_edge_signal_history.json'
OUT=DATA/'dev_edge_signal_validation.json'

def load(p,d):
    try:return json.loads(p.read_text(encoding='utf-8'))
    except Exception:return d

def classify(pct,vol,state):
    if pct>=1 and vol>=30 and '加速' not in state:return '🌱初動'
    if pct>0 and ('加速' in state or vol>=10):return '🔥継続'
    if pct>=3 and vol<0:return '⚠️過熱'
    if pct<=-3 and vol>=30:return '🩸セリクラ'
    return None

def compound(vals):
    x=1.0
    for v in vals:x*=1+v/100
    return (x-1)*100

def main():
    market=load(DATA/'market.json',{})
    day={x['theme']:x for x in market.get('themes_1d',{}).get('themes',[])}
    week={x['theme']:x for x in market.get('themes_5d',{}).get('themes',[])}
    mom={x['theme']:x for x in market.get('momentum_1mo',{}).get('data',[])}
    date=datetime.now(JST).date().isoformat()
    history=load(HIST,[])
    snapshot={'date':date,'themes':{}}
    for theme,d in day.items():
        w=week.get(theme,{});m=mom.get(theme,{})
        pct=float(w.get('pct') or 0);vol=float(w.get('volume_chg') or 0);state=str(m.get('state') or '')
        snapshot['themes'][theme]={'daily_pct':float(d.get('pct') or 0),'signal':classify(pct,vol,state)}
    history=[h for h in history if h.get('date')!=date]+[snapshot]
    history=sorted(history,key=lambda x:x['date'])[-260:]
    HIST.write_text(json.dumps(history,ensure_ascii=False,indent=2),encoding='utf-8')
    rows=[]
    for sig in ['🌱初動','🔥継続','⚠️過熱','🩸セリクラ']:
        outcomes=[]
        for i,h in enumerate(history):
            for theme,v in h.get('themes',{}).items():
                if v.get('signal')!=sig:continue
                future=[history[j].get('themes',{}).get(theme,{}).get('daily_pct') for j in range(i+1,min(len(history),i+21))]
                future=[float(x) for x in future if x is not None]
                if len(future)>=5:outcomes.append((compound(future[:5]),compound(future[:20]) if len(future)>=20 else None))
        five=[x[0] for x in outcomes];twenty=[x[1] for x in outcomes if x[1] is not None]
        avg5=sum(five)/len(five) if five else 0;avg20=sum(twenty)/len(twenty) if twenty else 0
        win=sum(x>0 for x in five)/len(five)*100 if five else 0
        dd=min(five) if five else 0
        rows.append({'signal':sig,'count':len(five),'avg_5d':avg5,'avg_20d':avg20,'win_rate':win,'max_drawdown':dd,'edge':len(five)>=30 and avg5>0 and win>=52})
    OUT.write_text(json.dumps({'updated_at':datetime.now(JST).isoformat(timespec='seconds'),'rows':rows},ensure_ascii=False,indent=2),encoding='utf-8')
    print('snapshots',len(history))
if __name__=='__main__':main()
