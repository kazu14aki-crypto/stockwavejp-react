const clamp = (value, min=0, max=1) => Math.min(max, Math.max(min, value))

/**
 * Individual-stock attention score (0–100).
 * Uses the same factors as the "注目銘柄ピックアップ": return, volume change,
 * recent price acceleration, and trading value. This is a relative attention
 * indicator, not an investment recommendation.
 */
export function calculateStockAttentionScore(stock={}) {
  const pct=Number(stock?.pct) || 0
  const volumeChange=Number(stock?.volume_chg) || 0
  const tradingValue=Number(stock?.trade_value) || 0
  const pctPoints=Math.min(40,Math.max(0,pct*2))
  const volumePoints=Math.min(25,Math.max(0,volumeChange*0.5))
  const tradingValuePoints=tradingValue>0 ? Math.min(15,Math.log10(tradingValue)*1.5) : 0
  const spark=Array.isArray(stock?.spark) ? stock.spark.map(Number).filter(Number.isFinite) : []
  let accelerationPoints=0

  if (spark.length>=6) {
    const midpoint=Math.floor(spark.length/2)
    const firstAverage=spark.slice(0,midpoint).reduce((sum,value)=>sum+value,0)/midpoint
    const lastAverage=spark.slice(midpoint).reduce((sum,value)=>sum+value,0)/(spark.length-midpoint)
    accelerationPoints=Math.min(20,Math.max(0,(lastAverage-firstAverage)*3))
  }

  return Math.min(100,Math.max(0,pctPoints+volumePoints+tradingValuePoints+accelerationPoints))
}

const medianOf = values => {
  if (!values.length) return null
  const sorted=[...values].sort((a,b)=>a-b)
  const mid=Math.floor(sorted.length/2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2
}

/**
 * StockWave Score (0–100)
 * 40: breadth (share of advancers)
 * 25: median-return confirmation
 * 20: dispersion quality (lower top-three concentration is better)
 * 15: theme-average momentum
 * Missing or invalid constituent values are excluded rather than treated as zero.
 */
export function calculateStockWaveScore(stocks=[], themeAverage=null) {
  const valid=(Array.isArray(stocks)?stocks:[])
    .map(stock=>Number(stock?.pct))
    .filter(Number.isFinite)

  if (!valid.length) {
    return { score:null, breadth:null, median:null, concentration:null, average:null, advancers:0, constituents:0, confidence:'none' }
  }

  const advancers=valid.filter(value=>value>0).length
  const breadthRatio=advancers/valid.length
  const median=medianOf(valid)
  const average=Number.isFinite(Number(themeAverage))
    ? Number(themeAverage)
    : valid.reduce((sum,value)=>sum+value,0)/valid.length

  const absolute=valid.map(Math.abs).sort((a,b)=>b-a)
  const absoluteTotal=absolute.reduce((sum,value)=>sum+value,0)
  const topThreeConcentration=absoluteTotal>0
    ? absolute.slice(0,3).reduce((sum,value)=>sum+value,0)/absoluteTotal
    : 1

  const breadthPoints=breadthRatio*40
  const medianPoints=clamp((median+5)/10)*25
  const dispersionPoints=(1-clamp(topThreeConcentration))*20
  const momentumPoints=clamp((average+5)/10)*15
  const score=Math.round(breadthPoints+medianPoints+dispersionPoints+momentumPoints)

  return {
    score,
    breadth:breadthRatio,
    median,
    concentration:topThreeConcentration,
    average,
    advancers,
    constituents:valid.length,
    confidence:valid.length>=15?'high':valid.length>=8?'medium':'low',
    breakdown:{ breadthPoints, medianPoints, dispersionPoints, momentumPoints },
  }
}

export function stockWaveScoreLabel(score, locale='en') {
  if (score == null) return locale==='ja' ? '算出不可' : 'Unavailable'
  if (score>=80) return locale==='ja' ? '非常に強い' : 'Very strong'
  if (score>=65) return locale==='ja' ? '強い' : 'Strong'
  if (score>=50) return locale==='ja' ? '中立' : 'Neutral'
  if (score>=35) return locale==='ja' ? '弱い' : 'Weak'
  return locale==='ja' ? '非常に弱い' : 'Very weak'
}
