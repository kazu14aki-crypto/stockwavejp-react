import React, { useState, useEffect } from 'react'
import { useHeatmap, useMonthlyHeatmap, useMomentum } from '../../hooks/useMarketData'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const THEME_ARTICLE_MAP = {
  '半導体製造装置':    'semiconductor-theme',
  '半導体検査装置':    'semiconductor-theme',
  '半導体材料':        'semiconductor-theme',
  'メモリ':            'semiconductor-theme',
  'パワー半導体':      'power-semiconductor',
  '次世代半導体':      'semiconductor-theme',
  '生成AI':            'ai-cloud-theme',
  'AIデータセンター':  'ai-cloud-theme',
  'フィジカルAI':      'physical-ai-edge-ai',
  'AI半導体':          'semiconductor-theme',
  'AI人材':            'education-hr-theme',
  'エッジAI':          'physical-ai-edge-ai',
  'EV・電気自動車':    'ev-green-theme',
  '全固体電池':        'ev-green-theme',
  '自動運転':          'ev-green-theme',
  'ドローン':          'drone-theme',
  '輸送・物流':        'transport-logistics-theme',
  '造船':              'shipbuilding-theme',
  '再生可能エネルギー':'renewable-energy-theme',
  '太陽光発電':        'renewable-energy-theme',
  '核融合発電':        'renewable-energy-theme',
  '原子力発電':        'renewable-energy-theme',
  '電力会社':          'renewable-energy-theme',
  'LNG':               'inpex-analysis',
  '石油':              'inpex-analysis',
  '蓄電池':            'ev-green-theme',
  '資源（水素・ヘリウム・水）': 'rare-earth-resources-theme',
  'IOWN':              'optical-communication',
  '光通信':            'optical-communication',
  '通信':              'telecom-theme',
  '量子コンピューター':'ai-cloud-theme',
  'SaaS':              'fintech-theme',
  'ウェアラブル端末':  'game-entertainment-theme',
  '仮想通貨':          'fintech-theme',
  'ネット銀行':        'banking-finance-theme',
  '鉄鋼・素材':        'steel-materials-theme',
  '化学':              'chemical-theme',
  '建築資材':          'construction-infra-theme',
  '塗料':              'chemical-theme',
  '医薬品・バイオ':    'pharma-bio-theme',
  'ヘルスケア・介護':  'healthcare-nursing-theme',
  '薬局・ドラッグストア': 'healthcare-nursing-theme',
  '銀行・金融':        'banking-finance-theme',
  '地方銀行':          'regional-bank-theme',
  '保険':              'insurance-theme',
  'フィンテック':      'fintech-theme',
  '不動産':            'real-estate-theme',
  '建設・インフラ':    'construction-infra-theme',
  '国土強靭化計画':    'national-resilience',
  '下水道':            'construction-infra-theme',
  '食品・飲料':        'food-beverage-theme',
  '農業・フードテック':'agritech-foodtech-theme',
  '小売・EC':          'retail-ec-theme',
  '観光・ホテル・レジャー': 'tourism-hotel-theme',
  'インバウンド':      'inbound-theme',
  'リユース・中古品':  'retail-ec-theme',
  '防衛・航空':        'defense-theme',
  '宇宙・衛星':        'space-satellite-theme',
  'ロボット・自動化':  'robot-automation-theme',
  'レアアース・資源':  'rare-earth-resources-theme',
  'バフェット銘柄':    'sogo-shosha-analysis',
  'サイバーセキュリティ': 'cybersecurity-theme',
  '警備':              'cybersecurity-theme',
  '脱炭素・ESG':       'ev-green-theme',
  '教育・HR・人材':    'education-hr-theme',
  '人材派遣':          'education-hr-theme',
  'ゲーム・エンタメ':  'game-entertainment-theme',
}

const STATE_COLORS = {
  '🔥加速':  '#ff4560',
  '↗転換↑': '#ff8c42',
  '→横ばい': 'var(--text3)',
  '↘転換↓': '#4a9eff',
  '❄️失速':  '#00c48c',
}

const selStyle = {
  background: 'var(--bg3)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: '6px',
  fontFamily: 'var(--font)', fontSize: '13px',
  padding: '6px 12px', cursor: 'pointer', outline: 'none',
}

function Loading() {
  return (
    <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
      {[0,0.2,0.4].map((d,i) => (
        <span key={i} style={{
          display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
          background:'var(--accent)', margin:'0 3px',
          animation:`pulse 1.2s ease-in-out ${d}s infinite`,
        }} />
      ))}

    </div>
  )
}

function pctColor(v) {
  if (v === null || v === undefined) return 'var(--text3)'
  return v > 0 ? '#ff5370' : v < 0 ? '#4caf82' : 'var(--text3)'
}

function cellBg(v) {
  if (v === null || v === undefined) return 'transparent'
  const ratio = Math.min(Math.abs(v) / 10, 1)
  if (v > 0) { const r = Math.round(255*ratio); const g = Math.round(40*(1-ratio)); return `rgb(${r},${g},${g})` }
  const g = Math.round(196*ratio); const b = Math.round(140*ratio); return `rgb(0,${g},${b})`
}

function HeatmapTable({ data, columns }) {
  if (!data || !columns?.length) return null
  const themes = Object.keys(data)
  return (
    <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
      <table style={{ borderCollapse:'collapse', fontSize:'11px', minWidth:'600px', width:'100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign:'left', padding:'6px 10px', color:'var(--text3)', fontWeight:600, position:'sticky', left:0, background:'var(--bg3)', minWidth:'120px' }}>テーマ</th>
            {columns.map(col => (
              <th key={col} style={{ textAlign:'center', padding:'6px 8px', color:'var(--text3)', fontWeight:600, minWidth:'56px' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {themes.map(theme => (
            <tr key={theme}>
              <td style={{ padding:'5px 10px', color:'var(--text2)', fontWeight:500, position:'sticky', left:0, background:'var(--bg2)', borderBottom:'1px solid var(--border)' }}>{theme}</td>
              {columns.map(col => {
                const v = data[theme]?.[col]
                return (
                  <td key={col} style={{
                    textAlign:'center', padding:'5px 4px',
                    background: cellBg(v), color:'#fff',
                    fontFamily:'var(--mono)', fontWeight:600,
                    borderBottom:'1px solid rgba(255,255,255,0.05)',
                  }}>
                    {v != null ? `${v>0?'+':''}${v.toFixed(1)}` : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

function AutoComment({ lines }) {
  let safeLines = lines
  if (!safeLines) return null
  if (typeof safeLines === 'string') safeLines = safeLines.split('\n').filter(Boolean)
  if (!Array.isArray(safeLines) || !safeLines.length) return null
  const rendered = safeLines.map((line, i) => {
    if (typeof line !== 'string') return null
    if (line.startsWith('【')) {
      const e = line.indexOf('】')
      if (e < 0) return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
      const h = line.slice(1, e), r = line.slice(e+1).trim()
      return (
        <div key={i} style={{ marginBottom:'10px', marginTop: i > 0 ? '14px' : '0' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--accent)', letterSpacing:'0.04em', marginBottom:'4px', borderLeft:'3px solid var(--accent)', paddingLeft:'8px' }}>{h}</div>
          {r && <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', paddingLeft:'11px' }}>{r}</div>}
        </div>
      )
    }
    const icons = ['▲','▼','📊','🔥','❄️','↗','↘','💡','✅','⚠️','📉']
    if (icons.some(ic => line.startsWith(ic))) {
      const si = line.indexOf(' '), icon = si > 0 ? line.slice(0, si) : line[0]
      const text = si > 0 ? line.slice(si+1) : ''
      const ci = text.indexOf('：'), label = ci > 0 ? text.slice(0, ci) : null, body = ci > 0 ? text.slice(ci+1).trim() : text
      return (
        <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'7px', paddingLeft:'4px', alignItems:'flex-start' }}>
          <span style={{ fontSize:'13px', flexShrink:0, marginTop:'1px', lineHeight:1.5 }}>{icon}</span>
          <div style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', flex:1 }}>
            {label && <span style={{ fontWeight:600, color:'var(--text)' }}>{label}：</span>}{body}
          </div>
        </div>
      )
    }
    return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
  }).filter(Boolean)
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', padding:'16px 18px', marginBottom:'20px' }}>
      {rendered}

    </div>
  )
}

function genHeatmapComment(data, tab, months) {
  if (!data) return null
  const themes = Object.keys(data)
  if (!themes.length) return null
  const lines = []
  if (tab === 'period') {
    const periods = ['1W','1M','3M','6M','1Y']
    const bullAll = themes.filter(t => periods.every(p => (data[t]?.[p] ?? 0) > 0))
    const bearAll = themes.filter(t => periods.every(p => (data[t]?.[p] ?? 0) < 0))
    const risingStart = themes.filter(t => (data[t]?.['1W'] ?? 0) > 1 && (data[t]?.['1M'] ?? 0) > 0 && (data[t]?.['3M'] ?? 0) < 0)
    const topZone = themes.filter(t => (data[t]?.['1W'] ?? 0) < -1 && (data[t]?.['1M'] ?? 0) < 0 && (data[t]?.['3M'] ?? 0) > 5)
    const byYear = [...themes].sort((a,b) => (data[b]?.['1Y']||0)-(data[a]?.['1Y']||0))
    const topYear = byYear.slice(0,3), botYear = byYear.slice(-3).reverse()
    lines.push(`【期間別ヒートマップ分析】全${themes.length}テーマの短期〜長期騰落率を俯瞰。1年間で最も強いテーマは「${topYear[0]}」(+${data[topYear[0]]?.['1Y']?.toFixed(1)}%)、「${topYear[1]}」「${topYear[2]}」が続く。最弱は「${botYear[0]}」(${data[botYear[0]]?.['1Y']?.toFixed(1)}%)。`)
    if (bullAll.length > 0) lines.push(`✅ 全期間一貫上昇：「${bullAll.slice(0,4).join('」「')}」。強いトレンドが継続中でモメンタム戦略に適する。`)
    if (bearAll.length > 0) lines.push(`⚠️ 全期間一貫下落：「${bearAll.slice(0,4).join('」「')}」。構造的な弱さが続いており底値確認には時間が必要。`)
    if (risingStart.length > 0) lines.push(`↗ 上がり始めシグナル（短期プラス転換・中長期はまだマイナス）：「${risingStart.slice(0,3).join('」「')}」。底値反転初動の可能性。出来高増加を確認できれば仕込み場として注目。`)
    if (topZone.length > 0) lines.push(`↘ 天井圏・調整の可能性（短期急落・長期はまだ強い）：「${topZone.slice(0,3).join('」「')}」。高値からの利確売りが出ている状態。押し目水準を見極めたい。`)
    lines.push(`💡 活用法：全期間緑から週次・月次が赤に転換したテーマは「底値から上がり始め」のサイン。逆に全期間赤から直近が緑に転じたテーマは「高値から下落し始め」の注意サイン。`)
  } else {
    const recentMonths = months?.slice(-3) || []
    if (!recentMonths.length) return null
    const streak3 = themes.filter(t => recentMonths.every(m => (data[t]?.[m] ?? 0) > 0))
    const fall3   = themes.filter(t => recentMonths.every(m => (data[t]?.[m] ?? 0) < 0))
    const lastM = recentMonths[recentMonths.length-1], prevM = recentMonths[recentMonths.length-2]
    const freshRising  = themes.filter(t => (data[t]?.[lastM] ?? 0) > 1 && (data[t]?.[prevM] ?? 0) < 0)
    const freshFalling = themes.filter(t => (data[t]?.[lastM] ?? 0) < -1 && (data[t]?.[prevM] ?? 0) > 0)
    const avg = themes.map(t => data[t]?.[lastM] ?? 0).reduce((s,v)=>s+v,0) / (themes.length||1)
    lines.push(`【月次ヒートマップ分析】直近月（${lastM}）の平均騰落率は${avg>=0?'+':''}${avg.toFixed(1)}%。${streak3.length > 0 ? `直近3ヶ月連続上昇：「${streak3.slice(0,4).join('」「')}」が強いトレンドを維持。` : '3ヶ月連続上昇テーマは少なく上昇は散発的。'}`)
    if (freshRising.length > 0)  lines.push(`↗ 今月プラス転換（前月まで下落）：「${freshRising.slice(0,4).join('」「')}」。下落から反転した初動の可能性。`)
    if (freshFalling.length > 0) lines.push(`↘ 今月マイナス転換（前月まで上昇）：「${freshFalling.slice(0,4).join('」「')}」。上昇トレンドが一服。調整か転換かを見極めたい。`)
    if (fall3.length > 0)        lines.push(`⚠️ 直近3ヶ月連続下落：「${fall3.slice(0,4).join('」「')}」。中期的な下落が継続中。反転サインを待ちたい。`)
    lines.push(`💡 見方：「緑→赤→赤」パターンは上昇初期段階、「赤→緑→緑」は調整入りのサインとして機能しやすい。`)
  }
  return lines
}

function genMomentumComment(momentumData, period) {
  const data = momentumData?.data || momentumData || []
  if (!data.length) return null
  const periodLabel = { '1d':'本日','5d':'週間','1mo':'1ヶ月','3mo':'3ヶ月','6mo':'6ヶ月','1y':'1年間' }[period] || period
  const accel  = data.filter(t => t.state?.includes('加速'))
  const decel  = data.filter(t => t.state?.includes('失速'))
  const turnUp = data.filter(t => t.state?.includes('転換↑'))
  const turnDn = data.filter(t => t.state?.includes('転換↓'))
  const flat   = data.filter(t => t.state?.includes('横ばい'))
  const avg    = data.length ? data.reduce((s,t)=>s+(t.pct||0),0)/data.length : 0
  const lines  = []
  lines.push(`【${periodLabel}の騰落モメンタム概況】全${data.length}テーマ、上昇${data.filter(t=>t.pct>0).length}・下落${data.filter(t=>t.pct<0).length}テーマ。平均騰落率${avg>=0?'+':''}${avg.toFixed(2)}%。モメンタム別：加速${accel.length}・転換↑${turnUp.length}・横ばい${flat.length}・転換↓${turnDn.length}・失速${decel.length}テーマ。`)
  if (accel.length  > 0) lines.push(`🔥 加速（${accel.length}テーマ）：「${accel.slice(0,4).map(t=>t.theme).join('」「')}」など。短中期ともに上昇加速中。トレンドフォロー戦略が有効。`)
  if (turnUp.length > 0) lines.push(`↗ 転換↑（${turnUp.length}テーマ）：「${turnUp.slice(0,3).map(t=>t.theme).join('」「')}」など。下落から上昇への転換初動。出来高増加を確認できれば仕込み場の可能性。`)
  if (flat.length   > 0) lines.push(`→ 横ばい（${flat.length}テーマ）：「${flat.slice(0,3).map(t=>t.theme).join('」「')}」など。方向感が定まらない状態。ブレイクの方向を見極めてから参入が無難。`)
  if (turnDn.length > 0) lines.push(`↘ 転換↓（${turnDn.length}テーマ）：「${turnDn.slice(0,3).map(t=>t.theme).join('」「')}」など。上昇トレンドが失速し始めたシグナル。利益確定を検討する局面。`)
  if (decel.length  > 0) lines.push(`❄️ 失速（${decel.length}テーマ）：「${decel.slice(0,4).map(t=>t.theme).join('」「')}」など。下落継続・加速中。反転サインが出るまで慎重姿勢。`)
  lines.push(`💡 活用法：「加速」＋「転換↑」が最も強い買いシグナル。「転換↓」＋「失速」は売り圧力継続中のサイン。週次で状態変化を追うことでトレンド転換を先読みできる。`)
  return lines
}

// ═══════════════════════════════════════════════════════════════
// 📊 資金フロー散布図（バブルチャート）
// X軸 = 騰落率   Y軸 = 出来高急増率   円サイズ = 売買代金   色 = 騰落率
// ═══════════════════════════════════════════════════════════════
function BubbleScatter({ data, mPeriod, setMPeriod, onNavigate }) {
  const [hovered, setHovered] = React.useState(null)
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 })

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
        データを読み込み中...
      </div>
    )
  }
  // ── レイアウト定数 ──────────────────────────────
  const W = 900, H = 520
  const PL = 68, PR = 30, PT = 48, PB = 52
  const GW = W - PL - PR
  const GH = H - PT - PB

  // ── データ準備 ──────────────────────────────────
  // volume_chg が数値として存在するものだけ使う（未取得の場合はpctのみでフォールバック）
  const hasVolChg = data.some(d => typeof d.volume_chg === 'number')
  const filtered = data.filter(d =>
    d.pct != null && !isNaN(d.pct) &&
    (hasVolChg ? typeof d.volume_chg === 'number' : true)
  )

  // volume_chg がない場合は week_diff で代替表示
  const getY = d => {
    if (typeof d.volume_chg === 'number') return d.volume_chg
    if (typeof d.week_diff  === 'number') return d.week_diff
    return 0
  }
  const yAxisLabel = hasVolChg ? '出来高急増率' : '先週比'

  const pcts    = filtered.map(d => d.pct)
  const volChgs = filtered.map(d => getY(d))
  const tvs     = filtered.map(d => d.trade_value ?? 0)

  // 軸の範囲（最小でも1以上の幅を確保してゼロ除算防止）
  const rawXMin = pcts.length ? Math.min(...pcts) : -5
  const rawXMax = pcts.length ? Math.max(...pcts) : 5
  const rawYMin = volChgs.length ? Math.min(...volChgs) : -10
  const rawYMax = volChgs.length ? Math.max(...volChgs) : 10
  const xMin = rawXMin - 1.5
  const xMax = rawXMax + 1.5
  const yMin = rawYMin - 8
  const yMax = rawYMax + 8
  const tvMax = Math.max(...tvs.filter(v => v > 0), 1)

  // データが不足している場合（GitHub Actions未実行等）はフォールバック表示
  if (filtered.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text3)',
        background:'var(--bg2)', borderRadius:'10px', border:'1px solid var(--border)' }}>
        <div style={{ fontSize:'24px', marginBottom:'12px' }}>📊</div>
        <div style={{ fontSize:'13px', marginBottom:'6px', color:'var(--text2)' }}>
          散布図データを準備中です
        </div>
        <div style={{ fontSize:'11px' }}>
          GitHub Actions「Fetch Market Data」を手動実行すると表示されます
        </div>
      </div>
    )
  }

  // スケール関数（ゼロ除算ガード付き）
  const xRange = (xMax - xMin) || 1
  const yRange = (yMax - yMin) || 1
  const xS = v => PL + ((v - xMin) / xRange) * GW
  const yS = v => PT + GH - ((v - yMin) / yRange) * GH

  // 円サイズ（売買代金に比例、最小8・最大40px）
  const rS = tv => {
    if (!tv || tv === 0) return 7
    const ratio = tv / tvMax
    return 8 + ratio * 34
  }

  // 色（騰落率）
  const bColor = pct => {
    if (pct >= 5)   return '#e03030'
    if (pct >= 2)   return '#e06040'
    if (pct >= 0.5) return '#c08060'
    if (pct >= 0)   return '#907060'
    if (pct >= -2)  return '#406860'
    if (pct >= -5)  return '#2a9060'
    return '#1a7850'
  }

  // ゼロライン位置
  const x0 = xS(0)
  const y0 = yS(0)

  // ── ゾーン定義 ──
  const zones = [
    { label:'注目ゾーン 上昇+出来高増',  x:x0, y:PT,  w:PL+GW-x0, h:y0-PT,    bg:'rgba(220,60,60,0.06)',  border:'rgba(220,60,60,0.15)'  },
    { label:'売り圧力 下落+出来高増',    x:PL, y:PT,  w:x0-PL,    h:y0-PT,    bg:'rgba(30,160,100,0.05)', border:'rgba(30,160,100,0.12)' },
    { label:'静かな上昇 出来高少',       x:x0, y:y0,  w:PL+GW-x0, h:PT+GH-y0, bg:'rgba(200,120,60,0.04)', border:'none'                  },
    { label:'静かな下落',                x:PL, y:y0,  w:x0-PL,    h:PT+GH-y0, bg:'rgba(20,120,80,0.03)',  border:'none'                  },
  ]

  // 目盛り生成
  const xTicks = []
  const xStep = Math.ceil((xMax - xMin) / 7)
  for (let v = Math.ceil(xMin); v <= xMax; v += xStep || 1) xTicks.push(v)

  const yTicks = []
  const yStep = Math.ceil((yMax - yMin) / 6)
  for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep || 1) yTicks.push(v)

  const fmtL = tv => {
    if (!tv) return '-'
    if (tv >= 1e8) return (tv/1e8).toFixed(0) + '億'
    if (tv >= 1e4) return (tv/1e4).toFixed(0) + '万'
    return tv.toLocaleString()
  }

  return (
    <div>
      {/* 期間セレクタ */}
      <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'16px' }}>
        <select value={mPeriod} onChange={e => setMPeriod(e.target.value)}
          style={{ background:'var(--bg3)', color:'var(--text)',
            border:'1px solid var(--border)', borderRadius:'6px',
            fontFamily:'var(--font)', fontSize:'13px',
            padding:'6px 12px', cursor:'pointer', outline:'none' }}>
          {[{v:'1d',l:'1日'},{v:'5d',l:'1週間'},{v:'1mo',l:'1ヶ月'},{v:'3mo',l:'3ヶ月'},{v:'6mo',l:'6ヶ月'}].map(p => (
            <option key={p.v} value={p.v}>{p.l}</option>
          ))}
        </select>
        <span style={{ fontSize:'11px', color:'var(--text3)' }}>
          X軸=騰落率　Y軸={yAxisLabel}　円サイズ=売買代金
        </span>
      </div>

      {/* ゾーン説明 */}
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'12px', fontSize:'11px' }}>
        {[
          { label:'🔥 注目ゾーン（右上）', desc:'上昇＋出来高急増＝最強シグナル', color:'rgba(220,60,60,0.8)' },
          { label:'⚠️ 売り圧力（左上）',   desc:'下落＋出来高急増＝強い売り',    color:'rgba(30,160,100,0.7)' },
          { label:'📈 静かな上昇（右下）',  desc:'上昇＋出来高少=じわり上昇',     color:'rgba(200,120,60,0.6)' },
          { label:'❄️ 静かな下落（左下）',  desc:'弱含みだが動意なし',             color:'rgba(100,160,130,0.5)' },
        ].map(z => (
          <div key={z.label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:z.color, flexShrink:0 }} />
            <span style={{ color:'var(--text3)' }}>{z.label}：</span>
            <span style={{ color:'var(--text2)' }}>{z.desc}</span>
          </div>
        ))}
      </div>

      {/* SVGチャート */}
      <div style={{ width:'100%', overflowX:'auto', position:'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width:'100%', minWidth:'560px', display:'block',
            background:'var(--bg2)', borderRadius:'10px',
            border:'1px solid var(--border)' }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* ゾーン背景 */}
          {zones.map((z, i) => (
            <g key={i}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h}
                fill={z.bg} rx="4"
                stroke={z.border || 'none'} strokeWidth={z.border ? 0.8 : 0}
                strokeDasharray="4,3" />
            </g>
          ))}

          {/* グリッド線 */}
          {xTicks.map(v => (
            <line key={v} x1={xS(v)} y1={PT} x2={xS(v)} y2={PT+GH}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}
          {yTicks.map(v => (
            <line key={v} x1={PL} y1={yS(v)} x2={PL+GW} y2={yS(v)}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}

          {/* ゼロライン */}
          <line x1={x0} y1={PT} x2={x0} y2={PT+GH}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeDasharray="6,3" />
          <line x1={PL} y1={y0} x2={PL+GW} y2={y0}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeDasharray="6,3" />

          {/* ゾーンラベル */}
          <text x={x0+8} y={PT+14} fontSize="10" fill="rgba(220,80,80,0.7)" fontWeight="600">🔥 注目ゾーン</text>
          <text x={PL+6} y={PT+14} fontSize="10" fill="rgba(30,160,100,0.6)" fontWeight="600">⚠️ 売り圧力</text>
          <text x={x0+8} y={PT+GH-6} fontSize="10" fill="rgba(200,120,60,0.55)" fontWeight="600">📈 静かな上昇</text>
          <text x={PL+6} y={PT+GH-6} fontSize="10" fill="rgba(80,160,120,0.5)" fontWeight="600">❄️ 静かな下落</text>

          {/* バブル（ホバーされていないものを先に描画） */}
          {filtered
            .filter(d => d.theme !== hovered?.theme)
            .map(d => {
              const cx = xS(d.pct)
              const cy = yS(d.volume_chg ?? 0)
              const r  = rS(d.trade_value)
              const col = bColor(d.pct)
              return (
                <g key={d.theme}
                  style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                  onMouseEnter={e => {
                    const svg = e.currentTarget.closest('svg')
                    const rect = svg.getBoundingClientRect()
                    const scaleX = W / rect.width
                    setHovered(d)
                    setTooltipPos({
                      x: cx,
                      y: cy - r - 6,
                    })
                  }}
                  onClick={() => onNavigate && onNavigate('テーマ別詳細', d.theme)}
                >
                  <circle cx={cx} cy={cy} r={r}
                    fill={col} fillOpacity="0.75"
                    stroke={col} strokeWidth="1.2" strokeOpacity="0.9" />
                  {r >= 16 && (
                    <text x={cx} y={cy+3} textAnchor="middle"
                      fontSize={Math.min(10, r * 0.55)} fill="white"
                      fontWeight="600" style={{ pointerEvents:'none' }}>
                      {d.theme.length > 6 ? d.theme.slice(0, 6) + '…' : d.theme}
                    </text>
                  )}
                </g>
              )
            })
          }

          {/* ホバー中のバブル（最前面） */}
          {hovered && (() => {
            const d = hovered
            const cx = xS(d.pct)
            const cy = yS(d.volume_chg ?? 0)
            const r  = rS(d.trade_value)
            const col = bColor(d.pct)
            return (
              <g key="hovered"
                style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                onMouseEnter={() => setHovered(d)}
                onClick={() => onNavigate && onNavigate('テーマ別詳細', d.theme)}
              >
                <circle cx={cx} cy={cy} r={r + 3}
                  fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
                <circle cx={cx} cy={cy} r={r}
                  fill={col} fillOpacity="0.9"
                  stroke={col} strokeWidth="1.5" />
                <text x={cx} y={cy+4} textAnchor="middle"
                  fontSize="10" fill="white" fontWeight="700"
                  style={{ pointerEvents:'none' }}>
                  {d.theme.length > 8 ? d.theme.slice(0,8)+'…' : d.theme}
                </text>

                {/* ツールチップ */}
                {(() => {
                  const tx = Math.min(cx, W - 170)
                  const ty = Math.max(PT + 4, cy - r - 72)
                  return (
                    <g style={{ pointerEvents:'none' }}>
                      <rect x={tx} y={ty} width="162" height="66"
                        rx="6" fill="#1a1f2e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <text x={tx+10} y={ty+16} fontSize="11" fill="#e8f0ff" fontWeight="700">
                        {d.theme}
                      </text>
                      <text x={tx+10} y={ty+31} fontSize="10" fill={bColor(d.pct)}>
                        {'騰落率: ' + (d.pct >= 0 ? '+' : '') + (d.pct?.toFixed(1) ?? '-') + '%'}
                      </text>
                      <text x={tx+10} y={ty+45} fontSize="10" fill={(d.volume_chg ?? 0) >= 0 ? '#ff8c42' : '#4a9eff'}>
                        {(yAxisLabel + ': ') + (getY(d) >= 0 ? '+' : '') + getY(d).toFixed(0) + '%'}
                      </text>
                      <text x={tx+10} y={ty+59} fontSize="10" fill="#8b949e">
                        {'売買代金: ' + fmtL(d.trade_value)}
                      </text>
                    </g>
                  )
                })()}
              </g>
            )
          })()}

          {/* X軸ラベル */}
          {xTicks.map(v => (
            <text key={v} x={xS(v)} y={PT+GH+16}
              textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">
              {v >= 0 ? '+' : ''}{v}%
            </text>
          ))}
          <text x={PL + GW/2} y={H-4}
            textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)">
            ← 下落　　騰落率　　上昇 →
          </text>

          {/* Y軸ラベル */}
          {yTicks.map(v => (
            <text key={v} x={PL-6} y={yS(v)+4}
              textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.4)">
              {v >= 0 ? '+' : ''}{v}%
            </text>
          ))}
          <text x={16} y={PT + GH/2}
            textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)"
            transform={`rotate(-90, 16, ${PT + GH/2})`}>
            {yAxisLabel}
          </text>

          {/* 凡例（売買代金バブルサイズ） */}
          {[{tv:500e8,l:'5000億'},{tv:100e8,l:'1000億'},{tv:20e8,l:'200億'}].map((item, i) => {
            const r = rS(item.tv)
            const bx = PL + GW + PR - 24
            const by = PT + 20 + i * 44
            return (
              <g key={i}>
                <circle cx={bx} cy={by + r} r={r}
                  fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <text x={bx} y={by + r*2 + 12}
                  textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.4)">
                  {item.l}
                </text>
              </g>
            )
          })}

          {/* クリック誘導 */}
          {onNavigate && (
            <text x={PL + GW/2} y={PT - 12}
              textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)">
              バブルをクリック → テーマ別詳細へ
            </text>
          )}
        </svg>
      </div>

      {/* 上位テーマリスト（注目ゾーン） */}
      {(() => {
        const hot = filtered
          .filter(d => d.pct > 0 && (d.volume_chg ?? 0) > 0)
          .sort((a, b) => (b.pct * 0.6 + (b.volume_chg ?? 0) * 0.4) - (a.pct * 0.6 + (a.volume_chg ?? 0) * 0.4))
          .slice(0, 5)
        if (!hot.length) return null
        return (
          <div style={{ marginTop:'16px', padding:'14px 18px',
            background:'rgba(220,60,60,0.06)', border:'1px solid rgba(220,60,60,0.15)',
            borderRadius:'8px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'rgba(220,80,80,0.9)',
              marginBottom:'10px', letterSpacing:'0.08em' }}>
              🔥 注目ゾーン上位（上昇＋出来高増加）
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {hot.map(d => (
                <div key={d.theme} style={{
                  background:'var(--bg2)', border:'1px solid rgba(220,60,60,0.2)',
                  borderRadius:'6px', padding:'6px 12px',
                  display:'flex', alignItems:'center', gap:'8px',
                }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text)' }}>{d.theme}</span>
                  <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color:'#ff5370', fontWeight:700 }}>
                    {d.pct >= 0 ? '+' : ''}{d.pct?.toFixed(1)}%
                  </span>
                  <span style={{ fontSize:'11px', fontFamily:'var(--mono)', color:'#ff8c42' }}>
                    {'出来高' + (d.volume_chg >= 0 ? '+' : '') + d.volume_chg?.toFixed(0) + '%'}
                  </span>
                  {onNavigate && (
                    <button onClick={() => onNavigate('テーマ別詳細', d.theme)}
                      style={{ padding:'2px 8px', borderRadius:'4px', fontSize:'10px',
                        background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                        color:'#aa77ff', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                      詳細 →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default function Heatmap({ onNavigate }) {
  const [tab,        setTab]        = useState('period')
  const [loading,    setLoading]    = useState(true)
  const [heatmapData, setHeatmapData] = useState(null)
  const [monthlyData, setMonthlyData] = useState(null)
  const [months,     setMonths]     = useState([])
  const [mPeriod,    setMPeriod]    = useState('1mo')
  const [sortKey,    setSortKey]    = useState('騰落率（降順）')

  const { data: momentumRaw, loading: loadingM } = useMomentum(mPeriod)
  const momentumData = momentumRaw?.data || []

  // ヒートマップデータ取得
  useEffect(() => {
    if (tab !== 'period' && tab !== 'monthly') return
    setLoading(true)
    const CACHE_KEY = `heatmap_${tab}`
    ;(async () => {
      try {
        const cached = JSON.parse(localStorage.getItem('swjp_v3_' + CACHE_KEY) || 'null')
        if (cached?.data) {
          if (tab === 'period')  setHeatmapData(cached.data.heatmap || cached.data)
          else { setMonthlyData(cached.data.heatmap || cached.data); setMonths(cached.data.months || []) }
          setLoading(false)
        }
      } catch {}
      try {
        const res  = await fetch('/data/market.json?t=' + Date.now())
        const json = await res.json()
        if (tab === 'period' && json.heatmap) {
          setHeatmapData(json.heatmap.data)
          localStorage.setItem('swjp_v3_' + CACHE_KEY, JSON.stringify({ data:{ heatmap:json.heatmap.data }, ts:Date.now() }))
          setLoading(false); return
        }
        if (tab === 'monthly' && json.heatmap_monthly) {
          setMonthlyData(json.heatmap_monthly.data)
          setMonths(json.heatmap_monthly.months || [])
          localStorage.setItem('swjp_v3_' + CACHE_KEY, JSON.stringify({ data:{ heatmap:json.heatmap_monthly.data, months:json.heatmap_monthly.months }, ts:Date.now() }))
          setLoading(false); return
        }
      } catch {}
      try {
        if (tab === 'period') {
          const res = await fetch(`${API}/api/heatmap`); const json = await res.json()
          setHeatmapData(json.data)
        } else {
          const res = await fetch(`${API}/api/heatmap/monthly`); const json = await res.json()
          setMonthlyData(json.data); setMonths(json.months)
        }
      } catch {}
      setLoading(false)
    })()
  }, [tab])

  const TABS = [
    { key:'period',   label:'🟥 期間別ヒートマップ' },
    { key:'monthly',  label:'📅 月次ヒートマップ' },
    { key:'momentum', label:'📡 騰落モメンタム' },
    { key:'scatter',  label:'📊 資金フロー散布図' },
  ]

  let sorted = [...momentumData]
  if (sortKey === '騰落率（降順）') sorted.sort((a,b) => b.pct - a.pct)
  if (sortKey === '騰落率（昇順）') sorted.sort((a,b) => a.pct - b.pct)

  const heatComment     = tab === 'momentum' ? null : genHeatmapComment(tab==='period'?heatmapData:monthlyData, tab, months)
  const momentumComment = tab === 'momentum' ? genMomentumComment(momentumData, mPeriod) : null

  return (
    <div style={{ padding:'20px 24px 48px', maxWidth:'1280px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
        ヒートマップ・モメンタム
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>
        67テーマの騰落率をヒートマップと騰落モメンタムで多角的に分析できます。
      </p>


      {/* 注目テーマ誘導（ヒートマップ・モメンタム共通） */}
      {onNavigate && (() => {
        const top3Themes = tab === 'momentum'
          ? [...momentumData].sort((a,b)=>b.pct-a.pct).slice(0,3).map(d=>d.theme)
          : (() => {
              if (!heatmapData) return []
              return Object.entries(heatmapData)
                .map(([k,v])=>({ theme:k, pct: (v['1M']||v['1W']||0) }))
                .sort((a,b)=>b.pct-a.pct).slice(0,3).map(d=>d.theme)
            })()
        if (!top3Themes.length) return null
        return (
          <div style={{ marginBottom:'16px', padding:'12px 14px',
            background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px' }}>
            <div style={{ fontSize:'11px', color:'var(--text3)', fontWeight:600,
              letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>
              🔎 上位TOP3テーマ
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'10px' }}>
              {top3Themes.map((theme, i) => (
                <div key={theme} style={{
                  background:'rgba(255,255,255,0.03)', borderRadius:'6px', padding:'8px 12px',
                  borderLeft:`3px solid ${i===0?'#ffd166':i===1?'rgba(192,192,192,0.6)':'rgba(205,127,50,0.6)'}`,
                }}>
                  <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px', fontWeight:600 }}>
                    {i===0?'🥇 注目テーマ No.1':i===1?'🥈 注目テーマ No.2':'🥉 注目テーマ No.3'}
                  </div>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'6px' }}>
                    {theme}
                  </div>
                  <div style={{ display:'flex', gap:'5px' }}>
                    <button onClick={() => onNavigate('テーマ別詳細', theme)}
                      style={{ padding:'4px 10px', borderRadius:'5px', fontSize:'11px',
                        background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                        color:'#aa77ff', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                      📊 テーマ詳細へ
                    </button>
                    {THEME_ARTICLE_MAP[theme] && (
                      <button onClick={() => onNavigate('コラム・解説', THEME_ARTICLE_MAP[theme])}
                        style={{ padding:'4px 10px', borderRadius:'5px', fontSize:'11px',
                          background:'rgba(74,158,255,0.07)', border:'1px solid rgba(74,158,255,0.2)',
                          color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                        📖 解説コラムへ
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('週次レポート')}
              style={{ padding:'5px 12px', borderRadius:'5px', fontSize:'11px',
                background:'rgba(255,140,66,0.1)', border:'1px solid rgba(255,140,66,0.3)',
                color:'#ff8c42', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
              📰 最新週次レポートを読む →
            </button>
          </div>
        )
      })()}

      {/* タブ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        gap:'4px', marginBottom:'20px', width:'100%', maxWidth:'480px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding:'8px 6px', borderRadius:'6px', fontSize:'11px', fontWeight:600,
            cursor:'pointer', fontFamily:'var(--font)', whiteSpace:'nowrap',
            textAlign:'center', lineHeight:1.3,
            border: tab === t.key ? '2px solid var(--accent)' : '1px solid var(--border)',
            background: tab === t.key ? 'rgba(74,158,255,0.12)' : 'var(--bg2)',
            color: tab === t.key ? 'var(--accent)' : 'var(--text3)',
            transition:'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 期間別ヒートマップ */}
      {tab === 'period' && (
        <>
          <AutoComment lines={heatComment} />
          {loading ? <Loading /> : heatmapData
            ? <HeatmapTable data={heatmapData} columns={['1W','1M','3M','6M','1Y']} />
            : <div style={{ color:'var(--text3)', fontSize:'13px' }}>データを取得できませんでした</div>
          }
        </>
      )}

      {/* 月次ヒートマップ */}
      {tab === 'monthly' && (
        <>
          <AutoComment lines={heatComment} />
          {loading ? <Loading /> : monthlyData
            ? <HeatmapTable data={monthlyData} columns={months.slice(-6)} />
            : <div style={{ color:'var(--text3)', fontSize:'13px' }}>データを取得できませんでした</div>
          }
        </>
      )}

      {/* 騰落モメンタム */}
      {tab === 'momentum' && (
        <>
          {/* コントロール */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px', alignItems:'center' }}>
            <select value={mPeriod} onChange={e => setMPeriod(e.target.value)} style={selStyle}>
              {[{v:'1d',l:'1日'},{v:'5d',l:'1週間'},{v:'1mo',l:'1ヶ月'},{v:'3mo',l:'3ヶ月'},{v:'6mo',l:'6ヶ月'},{v:'1y',l:'1年'}].map(p => (
                <option key={p.v} value={p.v}>{p.l}</option>
              ))}
            </select>
            <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={selStyle}>
              {['騰落率（降順）','騰落率（昇順）'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <AutoComment lines={momentumComment} />
          {loadingM ? <Loading /> : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 70px 110px',
                gap:'8px', padding:'4px 12px', fontSize:'11px', color:'var(--text3)', fontWeight:600,
                marginBottom:'4px' }}>
                <span>テーマ名</span>
                <span style={{ textAlign:'right' }}>騰落率</span>
                <span style={{ textAlign:'right' }}>先週比</span>
                <span style={{ textAlign:'center' }}>状態</span>
              </div>
              {sorted.map((d, i) => (
                <div key={d.theme} style={{
                  display:'grid', gridTemplateColumns:'1fr 80px 70px 110px',
                  gap:'8px', alignItems:'center',
                  background:'var(--bg2)', border:'1px solid var(--border)',
                  borderRadius:'6px', padding:'8px 12px', marginBottom:'4px',
                  animation:`fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) ${i*0.02}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(74,158,255,0.04)'; e.currentTarget.style.borderColor='rgba(74,158,255,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.borderColor='var(--border)' }}
                >
                  <span style={{ fontSize:'13px', color:'var(--text2)', fontWeight:500 }}>
                    <span style={{ fontSize:'11px', color:'var(--text3)', fontFamily:'var(--mono)', marginRight:'8px' }}>
                      {String(i+1).padStart(2,'0')}
                    </span>
                    {d.theme}
                  </span>
                  <span style={{ fontFamily:'var(--mono)', fontSize:'14px', fontWeight:700, textAlign:'right', color:pctColor(d.pct) }}>
                    {d.pct>=0?'+':''}{ d.pct?.toFixed(1)}%
                  </span>
                  <span style={{ fontFamily:'var(--mono)', fontSize:'13px', textAlign:'right', color:pctColor(d.week_diff) }}>
                    {d.week_diff>=0?'+':''}{ d.week_diff?.toFixed(1)}pt
                  </span>
                  <span style={{ fontSize:'12px', fontWeight:600, textAlign:'center',
                    color: STATE_COLORS[d.state] || 'var(--text3)',
                    background:'rgba(128,128,128,0.08)', borderRadius:'20px',
                    padding:'2px 8px', whiteSpace:'nowrap' }}>
                    {d.state || '—'}
                  </span>
                </div>
              ))}
              {sorted.length === 0 && (
                <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'13px' }}>
                  データがありません
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 📊 資金フロー散布図 */}
      {tab === 'scatter' && (
        <BubbleScatter data={momentumData} mPeriod={mPeriod} setMPeriod={setMPeriod} onNavigate={onNavigate} />
      )}

    </div>
  )
}
