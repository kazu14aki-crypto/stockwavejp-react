import { stockWaveScoreLabel } from '../utils/stockWaveScore'

export default function StockWaveScoreCard({ result, locale='en', compact=false }) {
  const isJa=locale==='ja'
  const score=result?.score
  const label=stockWaveScoreLabel(score,locale)
  const pct=value=>value==null?'—':`${Math.round(value*100)}%`
  const num=value=>value==null?'—':`${value>=0?'+':''}${value.toFixed(2)}%`

  return (
    <section className={compact?'stockwave-score compact':'stockwave-score'} style={{
      background:'linear-gradient(135deg,rgba(74,158,255,.09),rgba(170,119,255,.06))',
      border:'1px solid rgba(74,158,255,.24)', borderRadius:'10px', padding:compact?'10px 12px':'13px 15px',
      marginBottom:compact?0:'12px', minWidth:0,
    }} title={isJa
      ? '上昇銘柄比率40%、中央値25%、上位3銘柄への集中度20%、テーマ平均15%で算出。投資推奨ではありません。'
      : 'Calculated from breadth (40%), median confirmation (25%), top-three concentration (20%) and theme-average momentum (15%). Not investment advice.'}>
      <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:'9px',fontWeight:800,letterSpacing:'.08em',color:'var(--accent)'}}>{isJa?'STOCKWAVE スコア':'STOCKWAVE SCORE'}</div>
          <div style={{display:'flex',alignItems:'baseline',gap:'7px',marginTop:'3px'}}>
            <strong style={{fontSize:compact?'22px':'28px',fontFamily:'var(--mono)',color:'var(--text)'}}>{score??'—'}</strong>
            <span style={{fontSize:'10px',color:'var(--text3)'}}>/ 100</span>
            <span style={{fontSize:'11px',fontWeight:700,color:'var(--accent)'}}>{label}</span>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(80px,1fr))',gap:'6px',flex:'1 1 360px'}} className="stockwave-score-breakdown">
          {[
            [isJa?'上昇比率':'Breadth',pct(result?.breadth)],
            [isJa?'中央値':'Median',num(result?.median)],
            [isJa?'上位3集中':'Top-3 concentration',pct(result?.concentration)],
            [isJa?'構成銘柄':'Constituents',result?.constituents??'—'],
          ].map(([name,value])=><div key={name} style={{padding:'7px 8px',borderRadius:'7px',background:'rgba(0,0,0,.12)',border:'1px solid rgba(255,255,255,.05)'}}><div style={{fontSize:'8px',color:'var(--text3)'}}>{name}</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text2)',marginTop:'2px'}}>{value}</div></div>)}
        </div>
      </div>
      {!compact&&<div style={{fontSize:'9px',color:'var(--text3)',lineHeight:1.6,marginTop:'8px'}}>{isJa?'テーマの強さと広がりを0〜100で可視化します。高スコアでも割高・反落リスクは別途確認してください。':'A 0–100 measure of theme strength and breadth. Valuation, liquidity and reversal risk must still be assessed separately.'}</div>}
      <style>{`@media(max-width:640px){.stockwave-score-breakdown{grid-template-columns:repeat(2,minmax(0,1fr))!important}}`}</style>
    </section>
  )
}
