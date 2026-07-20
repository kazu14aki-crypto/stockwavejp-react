import { useState, useEffect, useMemo } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'
import { supabase } from '../../lib/supabase'

// ═══════════════════════════════════════════════════════════════
// StockDetail.jsx — 個別銘柄詳細ページ
// テーマ別詳細・銘柄検索などから遷移（サイドバー非表示）
//   ・株価情報＋1年チャート＋テクニカル（全ユーザー）
//   ・PER/PBR/PEG等バリュエーション（サブスク限定・無料は🔒）
//   ・大株主情報（無料は上位3名まで、4位以下は🔒）
// ═══════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const CATEGORY_META = {
  individual: { label:'個人',       color:'#ffd700' },
  treasury:   { label:'自己株式',   color:'#8b949e' },
  employee:   { label:'持株会',     color:'#aa77ff' },
  trust:      { label:'信託口',     color:'#4a9eff' },
  foreign:    { label:'外国機関',   color:'#00c48c' },
  financial:  { label:'銀行・保険', color:'#5ab0ff' },
  securities: { label:'証券',       color:'#7ac0ff' },
  government: { label:'政府系',     color:'#ff8c42' },
  foundation: { label:'財団等',     color:'#c9a0ff' },
  corporate:  { label:'事業法人',   color:'#ff5370' },
  other:      { label:'その他',     color:'#8b949e' },
}

function computeTech(hist) {
  if (!hist || hist.length < 30) return null
  const r = hist.map(d => 1 + d.pct / 100)
  const last = r[r.length - 1]
  const ma = (n) => r.length < n ? null : (last / (r.slice(-n).reduce((a, b) => a + b, 0) / n) - 1) * 100
  const hi = Math.max(...r)
  let gain = 0, loss = 0
  const t = r.slice(-15)
  for (let i = 1; i < t.length; i++) { const d = t[i] - t[i - 1]; if (d >= 0) gain += d; else loss -= d }
  return {
    ma25: ma(25), ma75: ma(75),
    off52w: (last / hi - 1) * 100,
    rsi: gain + loss === 0 ? 50 : (gain / (gain + loss)) * 100,
  }
}

const fmtLarge = (v) => !Number.isFinite(v) ? '—' : v >= 1e12 ? (v / 1e12).toFixed(2) + '兆' : v >= 1e8 ? (v / 1e8).toFixed(0) + '億' : Math.round(v).toLocaleString()

export default function StockDetail({ ticker, onNavigate, isMobile }) {
  const { isStandard, isDev } = useSubscription()
  const code = String(ticker || '').replace('.T', '')
  const [info, setInfo] = useState(null)
  const [hist, setHist] = useState(null)
  const [val, setVal] = useState(null)
  const [holders, setHolders] = useState(null)
  const [idxEntry, setIdxEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    setLoading(true); setInfo(null); setHist(null); setVal(null); setHolders(null); setIdxEntry(null)
    ;(async () => {
      let uid = null
      try { uid = (await supabase.auth.getSession())?.data?.session?.user?.id || null } catch {}
      const [i, h, v, ho, sx] = await Promise.all([
        fetch(`${API_BASE}/api/stock-info/${code}.T`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${API_BASE}/api/stock-history/${code}.T?period=1y`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${API_BASE}/api/stock-valuation/${code}.T${uid ? `?uid=${uid}` : ''}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/data/stockholders/${code}.json?t=${Date.now()}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/data/stock_index.json`).then(r => r.ok ? r.json() : null).catch(() => null),
      ])
      if (cancelled) return
      setInfo(i); setHist(h?.data || null); setVal(v); setHolders(ho)
      setIdxEntry(sx?.[`${code}.T`] || null)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [code])

  const tech = useMemo(() => computeTech(hist), [hist])

  // 1年チャート（累積騰落率のSVG折れ線）
  const chart = useMemo(() => {
    if (!hist || hist.length < 2) return null
    const W = 640, H = 180, PAD = 6
    const vals = hist.map(d => d.pct)
    const min = Math.min(...vals, 0), max = Math.max(...vals, 0)
    const range = max - min || 1
    const x = (i) => PAD + (i / (hist.length - 1)) * (W - PAD * 2)
    const y = (v) => PAD + (1 - (v - min) / range) * (H - PAD * 2)
    const points = hist.map((d, i) => `${x(i).toFixed(1)},${y(d.pct).toFixed(1)}`).join(' ')
    const lastPct = vals[vals.length - 1]
    return { W, H, points, zeroY: y(0), color: lastPct >= 0 ? '#ff5370' : '#00c48c', lastPct }
  }, [hist])

  const S = {
    page: { padding: isMobile ? '16px 12px' : '24px 28px', maxWidth: '980px', margin: '0 auto' },
    card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: isMobile ? '14px' : '18px 20px', marginBottom: '16px' },
    h2:   { fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' },
    small:{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.7 },
    mono: { fontFamily: 'var(--mono)', fontVariantNumeric: 'tabular-nums' },
    lock: { fontSize: '11px', color: 'var(--text3)' },
  }

  if (!code) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text3)' }}>銘柄が指定されていません。銘柄検索またはテーマ別詳細から銘柄を選択してください。</div>
  }

  const name = info?.name || idxEntry?.name || code
  const pct1mo = info?.pct

  return (
    <div style={S.page}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          <span style={{ ...S.mono, fontSize: '12px', color: 'var(--text3)', marginRight: '8px' }}>{code}</span>{name}
        </h1>
        {info?.price != null && <span style={{ ...S.mono, fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>¥{Number(info.price).toLocaleString()}</span>}
        {Number.isFinite(pct1mo) && <span style={{ ...S.mono, fontSize: '14px', fontWeight: 700, color: pct1mo >= 0 ? '#ff5370' : '#00c48c' }}>1ヶ月 {pct1mo >= 0 ? '+' : ''}{pct1mo.toFixed(1)}%</span>}
        {loading && <span style={S.small}>読み込み中…</span>}
      </div>

      {/* 所属テーマ */}
      {idxEntry?.themes?.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {idxEntry.themes.map(t => (
            <span key={t} onClick={() => onNavigate?.('テーマ別詳細', t)}
              style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', background: 'var(--bg2)' }}>{t}</span>
          ))}
        </div>
      )}

      {/* チャート */}
      <div style={S.card}>
        <div style={S.h2}>📈 1年チャート（累積騰落率）{chart && <span style={{ ...S.mono, marginLeft: '10px', color: chart.color }}>{chart.lastPct >= 0 ? '+' : ''}{chart.lastPct.toFixed(1)}%</span>}</div>
        {chart ? (
          <svg viewBox={`0 0 ${chart.W} ${chart.H}`}
            style={{ width: '100%', display: 'block', maxHeight: '40vh' }}>
            <line x1="0" x2={chart.W} y1={chart.zeroY} y2={chart.zeroY} stroke="var(--border)" strokeDasharray="4 4" />
            <polyline points={chart.points} fill="none" stroke={chart.color} strokeWidth="1.8" />
          </svg>
        ) : <div style={S.small}>{loading ? '読み込み中…' : 'チャートデータを取得できませんでした'}</div>}
      </div>

      {/* テクニカル */}
      <div style={S.card}>
        <div style={S.h2}>📐 テクニカル</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '8px' }}>
          {[['25日線乖離', tech?.ma25 == null ? '—' : `${tech.ma25 >= 0 ? '+' : ''}${tech.ma25.toFixed(1)}%`],
            ['75日線乖離', tech?.ma75 == null ? '—' : `${tech.ma75 >= 0 ? '+' : ''}${tech.ma75.toFixed(1)}%`],
            ['1年高値から', tech ? `${tech.off52w.toFixed(1)}%` : '—'],
            ['RSI(14)', tech ? tech.rsi.toFixed(0) : '—'],
          ].map(([l, v]) => (
            <div key={l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 11px' }}>
              <div style={{ fontSize: '9px', color: 'var(--text3)' }}>{l}</div>
              <div style={{ ...S.mono, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{v}</div>
            </div>))}
        </div>
      </div>

      {/* バリュエーション（サブスク限定） */}
      <div style={S.card}>
        <div style={S.h2}>💹 バリュエーション {(val?.valuation_locked || !isStandard) && <span style={{ fontSize: '10px', color: '#ffd700', marginLeft: '6px' }}>🔒 サブスク限定</span>}</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap: '8px' }}>
          {[['PER', val?.per], ['来期PER', val?.per_fwd], ['PBR', val?.pbr], ['来期PBR', val?.pbr_fwd], ['PEG', val?.peg], ['来期PEG', val?.peg_fwd]].map(([l, v]) => (
            <div key={l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '9px 11px' }}>
              <div style={{ fontSize: '9px', color: 'var(--text3)' }}>{l}</div>
              <div style={{ ...S.mono, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                {(val?.valuation_locked || !isStandard) ? '🔒' : (v ?? '—')}
              </div>
            </div>))}
        </div>
        {(val?.valuation_locked || !isStandard) ? (
          <div style={{ ...S.small, marginTop: '10px' }}>
            PER・PBR・PEG等の指標はサブスクリプション加入者限定です。
            <button onClick={() => onNavigate?.('プラン・料金')} style={{ marginLeft: '8px', padding: '4px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font)' }}>プランを見る</button>
          </div>
        ) : (val?.per == null && <div style={{ ...S.small, marginTop: '8px' }}>データ提供元との連携準備中のため、現在は「—」表示です。</div>)}
      </div>

      {/* 大株主（無料: 上位3名 / サブスク: 全員） */}
      <div style={S.card}>
        <div style={S.h2}>🏛️ 大株主の状況{holders && <span style={{ ...S.small, fontWeight: 400, marginLeft: '8px' }}>有価証券報告書（{holders.latestDate}提出）より</span>}</div>
        {holders ? (
          <>
            {(holders.latest || []).map((sh, i) => {
              const locked = !isStandard && i >= 3
              const meta = CATEGORY_META[sh.category] || CATEGORY_META.other
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <span style={{ ...S.mono, fontSize: '11px', color: 'var(--text3)', width: '20px', flexShrink: 0 }}>{sh.rank}.</span>
                    {locked ? (
                      <span style={{ fontSize: '13px', color: 'var(--text3)' }}>🔒 サブスク限定</span>
                    ) : (
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sh.name}</div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}40`, padding: '1px 6px', borderRadius: '4px' }}>{meta.label}</span>
                        {sh.is_founder_family && <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffd700', marginLeft: '4px' }}>創業家?</span>}
                      </div>
                    )}
                  </div>
                  <span style={{ ...S.mono, fontSize: '13px', fontWeight: 700, color: locked ? 'var(--text3)' : '#4a9eff', minWidth: '54px', textAlign: 'right' }}>
                    {locked ? '🔒' : sh.ratio != null ? `${sh.ratio.toFixed(2)}%` : '—'}
                  </span>
                </div>
              )
            })}
            {!isStandard && (holders.latest || []).length > 3 && (
              <div style={{ ...S.small, marginTop: '10px' }}>
                4位以下の大株主・属性構成・前期比較はサブスクリプション加入者限定です。
                <button onClick={() => onNavigate?.('プラン・料金')} style={{ marginLeft: '8px', padding: '4px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font)' }}>プランを見る</button>
              </div>
            )}
            {isStandard && holders.latestSummary && (
              <div style={{ ...S.small, marginTop: '10px' }}>
                個人系合計 <b style={{ color: '#ffd700' }}>{holders.latestSummary.individual_total?.toFixed(1)}%</b>
                　上位10名計 <b style={{ color: 'var(--text2)' }}>{holders.latestSummary.top10_total?.toFixed(1)}%</b>
                {isDev && <>　詳細分析は <span onClick={() => onNavigate?.('機関投資家保有')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>機関投資家保有ページ</span> へ</>}
              </div>
            )}
          </>
        ) : (
          <div style={S.small}>{loading ? '読み込み中…' : 'この銘柄の有価証券報告書データは未取得です（EDINETバッチの巡回後に自動表示されます）。'}</div>
        )}
      </div>

      <div style={S.small}>
        ※ 本ページは情報提供を目的としており、投資勧誘を目的としたものではありません。投資判断はご自身の責任でお願いします。
      </div>
    </div>
  )
}
