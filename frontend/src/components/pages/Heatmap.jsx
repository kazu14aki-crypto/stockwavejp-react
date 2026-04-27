import React, { useState } from 'react'
import { useMomentum } from '../../hooks/useMarketData'

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

function BubbleScatter({ data, mPeriod, setMPeriod, onNavigate }) {
  const [hovered, setHovered] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'60px', color:'var(--text3)' }}>
        データを読み込み中...
      </div>
    )
  }
  // ── レイアウト定数 ──────────────────────────────
  const W = 800, H = 400
  const PL = 60, PR = 28, PT = 40, PB = 48
  const GW = W - PL - PR
  const GH = H - PT - PB

  // ── データ準備 ──────────────────────────────────
  const filtered = data.filter(d => d.pct != null && !isNaN(d.pct))

  // Y軸: volume_chgが有効データ（0以外が1つでもある）なら出来高急増率、なければweek_diff
  const volChgValues = filtered.map(d => typeof d.volume_chg === 'number' ? d.volume_chg : null)
  const hasRealVolChg = volChgValues.some(v => v !== null && v !== 0)

  const getY = d => {
    if (hasRealVolChg && typeof d.volume_chg === 'number') return d.volume_chg
    if (typeof d.week_diff === 'number') return d.week_diff
    return 0
  }
  const yAxisLabel = hasRealVolChg ? '出来高急増率 (%)' : '先週比 (pt)'

  // Y軸: trade_valueが有効かどうか
  const tvValues = filtered.map(d => d.trade_value ?? 0)
  const hasRealTV = tvValues.some(v => v > 0)

  const getSizeVal = d => hasRealTV ? (d.trade_value ?? 0) : Math.abs(d.pct ?? 0) * 10e8

  const pcts    = filtered.map(d => d.pct)
  const volChgs = filtered.map(d => getY(d))
  const tvs     = filtered.map(d => getSizeVal(d))

  // 軸の範囲（ゼロ除算防止）
  const rawXMin = pcts.length ? Math.min(...pcts) : -5
  const rawXMax = pcts.length ? Math.max(...pcts) : 5
  const rawYMin = volChgs.length ? Math.min(...volChgs) : -10
  const rawYMax = volChgs.length ? Math.max(...volChgs) : 10
  // Y軸が全て同じ値の場合は強制的に範囲を広げる
  const xMargin = Math.max((rawXMax - rawXMin) * 0.15, 1.5)
  const yMargin = Math.max((rawYMax - rawYMin) * 0.15, 2)
  const xMin = rawXMin - xMargin
  const xMax = rawXMax + xMargin
  const yMin = rawYMin - yMargin
  const yMax = rawYMax + yMargin
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

  // 色（騰落率）サイトのred/green変数に合わせる
  const bColor = pct => {
    if (pct >= 8)   return '#ff2244'
    if (pct >= 4)   return '#ff5370'
    if (pct >= 1.5) return '#ff8c42'
    if (pct >= 0)   return '#e8a040'
    if (pct >= -1.5)return '#3db88a'
    if (pct >= -4)  return '#00c48c'
    return '#00a878'
  }

  // ゼロライン位置
  const x0 = xS(0)
  const y0 = yS(0)

  // ── ゾーン定義（サイトカラーに合わせた暗いトーン）──
  const zones = [
    { label:'注目ゾーン 上昇+出来高増',  x:x0, y:PT,  w:PL+GW-x0, h:y0-PT,    bg:'rgba(255,83,112,0.14)', border:'rgba(255,83,112,0.40)' },
    { label:'売り圧力 下落+出来高増',    x:PL, y:PT,  w:x0-PL,    h:y0-PT,    bg:'rgba(0,196,140,0.12)',  border:'rgba(0,196,140,0.35)'  },
    { label:'静かな上昇 出来高少',       x:x0, y:y0,  w:PL+GW-x0, h:PT+GH-y0, bg:'rgba(255,140,66,0.10)', border:'rgba(255,140,66,0.30)' },
    { label:'静かな下落',                x:PL, y:y0,  w:x0-PL,    h:PT+GH-y0, bg:'rgba(74,158,255,0.08)', border:'rgba(74,158,255,0.25)' },
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
      <div className="scatter-zone-desc">
        {[
          { label:'🔥 注目ゾーン（右上）', desc:'上昇＋出来高急増＝最強シグナル', color:'#ff5370' },
          { label:'⚠️ 売り圧力（左上）',   desc:'下落＋出来高急増＝強い売り',    color:'#00c48c' },
          { label:'📈 静かな上昇（右下）',  desc:'上昇＋出来高少＝じわり上昇',    color:'#ff8c42' },
          { label:'❄️ 静かな下落（左下）',  desc:'弱含みだが動意なし',             color:'#4a9eff' },
        ].map(z => (
          <div key={z.label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:z.color, flexShrink:0 }} />
            <span style={{ color:'var(--text3)' }}>{z.label}：</span>
            <span style={{ color:'var(--text2)' }}>{z.desc}</span>
          </div>
        ))}
      </div>

      {/* SVGチャート */}
      <div style={{ width:'100%', overflowX:'auto', position:'relative', WebkitOverflowScrolling:'touch' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width:'100%', minWidth:'380px', display:'block',
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
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,4" />
          ))}
          {yTicks.map(v => (
            <line key={v} x1={PL} y1={yS(v)} x2={PL+GW} y2={yS(v)}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,4" />
          ))}

          {/* ゼロライン */}
          <line x1={x0} y1={PT} x2={x0} y2={PT+GH}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5,3" />
          <line x1={PL} y1={y0} x2={PL+GW} y2={y0}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5,3" />

          {/* ゾーンラベル */}
          <text x={x0+8} y={PT+16} fontSize="11" fill="rgba(255,83,112,0.85)" fontWeight="700">🔥 注目ゾーン</text>
          <text x={PL+6} y={PT+16} fontSize="11" fill="rgba(0,196,140,0.8)" fontWeight="700">⚠️ 売り圧力</text>
          <text x={x0+8} y={PT+GH-8} fontSize="11" fill="rgba(255,140,66,0.7)" fontWeight="600">📈 静かな上昇</text>
          <text x={PL+6} y={PT+GH-8} fontSize="11" fill="rgba(74,158,255,0.65)" fontWeight="600">❄️ 静かな下落</text>

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

                {/* ⑥ ツールチップ（大きく表示） */}
                {(() => {
                  const TW = 210, TH = 90
                  const tx = cx + r + 8 > W - TW ? cx - TW - r - 4 : cx + r + 4
                  const ty = Math.max(PT, Math.min(PT + GH - TH, cy - TH/2))
                  return (
                    <g style={{ pointerEvents:'none' }}>
                      <rect x={tx} y={ty} width={TW} height={TH}
                        rx="8" fill="#1a1f2e" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
                      <text x={tx+12} y={ty+20} fontSize="13" fill="#e8f0ff" fontWeight="700">
                        {d.theme}
                      </text>
                      <text x={tx+12} y={ty+38} fontSize="12" fill={bColor(d.pct)}>
                        {'騰落率: ' + (d.pct >= 0 ? '+' : '') + (d.pct?.toFixed(2) ?? '-') + '%'}
                      </text>
                      <text x={tx+12} y={ty+56} fontSize="12" fill={(d.volume_chg ?? 0) >= 0 ? '#ff8c42' : '#4a9eff'}>
                        {(yAxisLabel + ': ') + (getY(d) >= 0 ? '+' : '') + getY(d).toFixed(1) + '%'}
                      </text>
                      <text x={tx+12} y={ty+74} fontSize="12" fill="#8b949e">
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
  const [mPeriod, setMPeriod] = useState('1mo')
  const { data: momentumRaw, loading: loadingM } = useMomentum(mPeriod)
  const momentumData = momentumRaw?.data || []

  return (
    <div style={{ padding:'20px 24px 48px', maxWidth:'1280px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>
        テーマヒートマップ
      </h1>
      <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'16px' }}>
        67テーマの騰落率をテーマヒートマップと騰落モメンタムで多角的に分析できます。
      </p>

      {/* ⑥ タブ削除・散布図を直接表示 */}
      <BubbleScatter data={momentumData} mPeriod={mPeriod} setMPeriod={setMPeriod} onNavigate={onNavigate} />

      <style>{`
        /* ⑥ PC版：注目ゾーン説明を横並び4列 */
        .scatter-zone-desc {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .scatter-zone-desc > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        @media (max-width: 640px) {
          .scatter-zone-desc {
            grid-template-columns: 1fr 1fr;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}
