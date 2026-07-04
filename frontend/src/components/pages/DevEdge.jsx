import { useState, useEffect, useMemo } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'

// ═══════════════════════════════════════════════════════════════
// DevEdge.jsx — 開発者専用エッジ・ダッシュボード（plan==='dev'のみ表示）
//
// 目的: 「勝率と期待値を構造的に高める4要素」を1画面に集約する
//   ① 資金流入の初動検知（複合シグナル・スキャナ）
//   ② 需給イベントの事前把握（イベントカレンダー）
//   ③ 株主構成イベントの先回り（大株主エッジ・スキャン）
//   ④ 損失の限定（ポジションサイズ計算機・マイルール）
// ═══════════════════════════════════════════════════════════════

// ── 需給・マクロイベント（手動更新。SQは第2金曜で確定、他は発表後に更新） ──
const EVENTS = [
  { date: '7/8前後',  label: 'ETF分配金 捻出売り①',       type: 'sell',  note: '例年計1兆円規模。下げは押し目候補' },
  { date: '7/10(金)', label: 'オプションSQ + ETF分配金②', type: 'sell',  note: 'SQ通過後の切り返しに注目' },
  { date: '7/14前後', label: '米CPI（6月分）',             type: 'macro', note: '利上げ観測の再点火リスク。日付要確認' },
  { date: '7月下旬',  label: '日銀金融政策決定会合',        type: 'macro', note: '短観DI+22後の情報発信に注意' },
  { date: '7月末〜',  label: '4-6月期決算ピーク',           type: 'event', note: '安川電機など先陣組→本命はAI・半導体' },
  { date: '8/14(金)', label: 'オプションSQ',               type: 'sell',  note: 'お盆薄商い×SQは荒れやすい' },
  { date: '9/11(金)', label: 'メジャーSQ',                 type: 'sell',  note: '' },
]

// ── キートリガー（相場の分岐点。達成/破断で戦略を切り替える） ──
const DEFAULT_TRIGGERS =
`キオクシア(285A) 25日線 → 奪還ならAI半導体押し目買い再開 / 割れ定着なら調整長期化
日経平均 6週線(≒68,000円) → 割れたら新規買い停止・現金比率UP
ドル円 160円 → 円高加速なら自動車・輸出のバリュー買いを縮小
サイバーセキュリティ・テーマ 週間+5%超の継続 → 国策物色の持続確認
米SOX指数 前日比±4%超 → 翌日の東京半導体は同方向に寄り付く前提で指値`

// ── マイルール（エントリー前チェックリスト） ──
const DEFAULT_RULES = [
  '損切りラインを注文前に決めた（値幅でなく「シナリオ破綻点」で）',
  '1トレードの想定損失は口座の1%以内に収めた',
  '信用建玉の合計は自己資金の2倍以内',
  'このテーマは「初動〜継続」局面か（過熱局面の高値掴みでないか）',
  '需給イベント（SQ・分配金売り・決算）をまたぐ場合、サイズを半分にした',
  '「上がりそう」ではなく「下がったらどこで逃げるか」から考えた',
]

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// zスコア計算ヘルパー
const zscores = (arr) => {
  const nums = arr.filter(v => Number.isFinite(v))
  if (!nums.length) return arr.map(() => 0)
  const mean = nums.reduce((s, v) => s + v, 0) / nums.length
  const sd = Math.sqrt(nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length) || 1
  return arr.map(v => Number.isFinite(v) ? (v - mean) / sd : 0)
}

export default function DevEdge({ isMobile, onNavigate }) {
  const { isDev } = useSubscription()
  const [themeData, setThemeData] = useState(null)   // /api/themes (1w相当)
  const [momentum, setMomentum]   = useState(null)   // /api/momentum
  const [holders, setHolders]     = useState(null)   // /data/stockholders/index.json
  const [loading, setLoading]     = useState(true)
  const [rulesChecked, setRulesChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('swjp_dev_rules') || '[]') } catch { return [] }
  })
  const [triggers, setTriggers] = useState(() => localStorage.getItem('swjp_dev_triggers') || DEFAULT_TRIGGERS)
  // ポジションサイズ計算機
  const [calc, setCalc] = useState({ capital: '3000000', riskPct: '1', entry: '', stop: '', market: 'JP' })

  useEffect(() => {
    if (!isDev) return
    let cancelled = false
    ;(async () => {
      try {
        const [tRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/api/themes?period=5d`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`${API_BASE}/api/momentum?period=1mo`).then(r => r.ok ? r.json() : null).catch(() => null),
        ])
        if (!cancelled) { setThemeData(tRes); setMomentum(mRes) }
        const hRes = await fetch(`/data/stockholders/index.json?t=${Date.now()}`).then(r => r.ok ? r.json() : null).catch(() => null)
        if (!cancelled) setHolders(hRes)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [isDev])

  useEffect(() => { localStorage.setItem('swjp_dev_rules', JSON.stringify(rulesChecked)) }, [rulesChecked])
  useEffect(() => { localStorage.setItem('swjp_dev_triggers', triggers) }, [triggers])

  // ── A. 地合い判定 ──
  const regime = useMemo(() => {
    const s = themeData?.summary
    if (!s) return null
    const breadth = s.rise / Math.max(1, s.total)   // 上昇テーマ比率
    let label, color, advice
    if (breadth >= 0.65 && s.avg > 1) {
      label = 'リスクオン'; color = '#ff5370'
      advice = '順張り優位。初動〜継続シグナルのテーマに乗る。ただし過熱テーマの新規追撃は禁止'
    } else if (breadth <= 0.35 && s.avg < -1) {
      label = 'リスクオフ'; color = '#00c48c'
      advice = '新規買い停止・現金温存。逆行高テーマ（資金の退避先）だけ監視し、セリクラ待ち'
    } else {
      label = '中立・ローテーション'; color = '#ffd700'
      advice = '指数より個別。上昇テーマと下落テーマの入れ替わり（資金循環）を複合スキャナで特定する'
    }
    return { ...s, breadth, label, color, advice }
  }, [themeData])

  // ── B. 複合シグナル・スキャナ ──
  const signals = useMemo(() => {
    const themes = themeData?.themes
    if (!themes?.length) return null
    const stateMap = {}
    for (const d of (momentum?.data || [])) stateMap[d.theme] = d.state || ''
    const pctZ = zscores(themes.map(t => t.pct))
    const volZ = zscores(themes.map(t => Number.isFinite(t.volume_chg) ? t.volume_chg : 0))
    const rows = themes.map((t, i) => {
      const score = 0.6 * pctZ[i] + 0.4 * volZ[i]
      const st = stateMap[t.theme] || ''
      let sig = '—'
      if (t.pct > 0 && volZ[i] > 0.8 && !st.includes('加速')) sig = '🌱初動'       // 出来高先行・まだ加速認定前
      else if (st.includes('加速'))                            sig = '🔥継続'
      else if (t.pct > 6 && volZ[i] < 0)                       sig = '⚠️過熱'      // 上げ続くが出来高細り
      else if (t.pct < -4 && volZ[i] > 1.2)                    sig = '🩸セリクラ?'  // 投げの出来高急増
      else if (st.includes('転換↑'))                           sig = '↗転換'
      return { ...t, score, state: st, sig }
    })
    const ranked = [...rows].sort((a, b) => b.score - a.score)
    return {
      top: ranked.slice(0, 8),
      bottom: ranked.slice(-4).reverse(),
      early: rows.filter(r => r.sig === '🌱初動').sort((a, b) => b.score - a.score).slice(0, 5),
      capit: rows.filter(r => r.sig === '🩸セリクラ?').slice(0, 4),
    }
  }, [themeData, momentum])

  // ── D. 大株主エッジ ──
  const holderEdge = useMemo(() => {
    const items = holders?.items
    if (!items?.length) return null
    return {
      owners: items.filter(i => (i.individualTotal || 0) >= 30)
                   .sort((a, b) => b.individualTotal - a.individualTotal).slice(0, 12),
      corporate: items.filter(i => i.topHolderCategory === 'corporate').slice(0, 12),
      total: items.length,
    }
  }, [holders])

  // ── E. ポジションサイズ計算 ──
  const position = useMemo(() => {
    const cap = parseFloat(calc.capital), risk = parseFloat(calc.riskPct)
    const entry = parseFloat(calc.entry), stop = parseFloat(calc.stop)
    if (!(cap > 0 && risk > 0 && entry > 0 && stop > 0) || entry === stop) return null
    const riskAmount = cap * risk / 100
    const perShare = Math.abs(entry - stop)
    const unit = calc.market === 'JP' ? 100 : 1
    const rawShares = riskAmount / perShare
    const shares = Math.floor(rawShares / unit) * unit
    if (shares <= 0) return { error: `この損切り幅では最小単位（${unit}株）でもリスク${risk}%を超えます。損切り幅を狭めるか見送りを。` }
    const exposure = shares * entry
    const leverage = exposure / cap
    const isShort = stop > entry
    return {
      shares, exposure, leverage, isShort,
      actualRisk: shares * perShare,
      actualRiskPct: (shares * perShare / cap) * 100,
      warn: leverage > 2 ? '⚠️ 建玉が自己資金の2倍超。信用の追証リスク領域です' :
            leverage > 1 ? '△ 建玉が自己資金超（信用利用）。イベント前はサイズ半減を' : null,
    }
  }, [calc])

  // ── ガード ──
  if (!isDev) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text3)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <div style={{ fontSize: '14px' }}>このページは開発者専用です</div>
      </div>
    )
  }

  const S = {
    page:  { padding: isMobile ? '16px 12px' : '24px 28px', maxWidth: '1180px', margin: '0 auto' },
    card:  { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: isMobile ? '14px' : '18px 20px', marginBottom: '16px' },
    h2:    { fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' },
    small: { fontSize: '11px', color: 'var(--text3)', lineHeight: 1.7 },
    mono:  { fontFamily: 'var(--mono)', fontVariantNumeric: 'tabular-nums' },
    th:    { textAlign: 'left', fontSize: '10px', color: 'var(--text3)', fontWeight: 500, padding: '5px 8px', borderBottom: '1px solid var(--border)' },
    td:    { fontSize: '12px', padding: '7px 8px', borderBottom: '1px solid var(--border)' },
    input: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', padding: '7px 10px', fontSize: '12px', fontFamily: 'var(--mono)', width: '100%' },
  }

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>🎯 Dev Edge</h1>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffd700', border: '1px solid #ffd70055', background: '#ffd70012', padding: '2px 8px', borderRadius: '4px' }}>DEVELOPER ONLY</span>
      </div>
      <div style={{ ...S.small, marginBottom: '18px' }}>
        エッジ＝確率の偏りであり、保証ではありません。このページの役割は「①資金流入の初動を検知し ②需給イベントを避け/使い ③株主構成イベントを先回りし ④1回の負けを浅く保つ」ことで、<b style={{ color: 'var(--text2)' }}>期待値がプラスの行動だけを繰り返せる状態</b>を作ることです。
      </div>

      {/* ── A. 地合い判定 ── */}
      <div style={S.card}>
        <div style={S.h2}>🌡️ 今日の地合い（直近1週・全{themeData?.summary?.total ?? '—'}テーマ）</div>
        {loading && !regime ? <div style={S.small}>読み込み中…</div> : regime ? (
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: regime.color }}>{regime.label}</div>
            <div style={{ ...S.mono, fontSize: '12px', color: 'var(--text2)' }}>
              上昇 <b style={{ color: '#ff5370' }}>{regime.rise}</b> / 下落 <b style={{ color: '#00c48c' }}>{regime.fall}</b>
              　平均 <b style={{ color: regime.avg >= 0 ? '#ff5370' : '#00c48c' }}>{regime.avg >= 0 ? '+' : ''}{regime.avg}%</b>
              　騰落比率 <b>{(regime.breadth * 100).toFixed(0)}%</b>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.7, flex: 1, minWidth: '240px' }}>▶ {regime.advice}</div>
          </div>
        ) : <div style={S.small}>データ取得に失敗しました（バックエンド起動を確認）</div>}
      </div>

      {/* ── B. 複合シグナル・スキャナ ── */}
      <div style={S.card}>
        <div style={S.h2}>📡 複合シグナル・スキャナ<span style={{ ...S.small, fontWeight: 400 }}>スコア = 騰落率z×0.6 + 出来高変化z×0.4</span></div>
        <div style={{ ...S.small, marginBottom: '10px' }}>
          狙うのは <b style={{ color: '#7ed321' }}>🌱初動</b>（価格上昇＋出来高急増だが加速認定前＝乗り遅れていない）と <b style={{ color: '#ff8c42' }}>🔥継続</b> の押し目。
          <b style={{ color: '#ffd700' }}>⚠️過熱</b>（上昇継続でも出来高が細る）は新規禁止・利確検討。<b style={{ color: '#ff5370' }}>🩸セリクラ?</b>（急落＋出来高急増）は投げ一巡の逆張り候補。
        </div>
        {signals ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: 700, marginBottom: '4px' }}>▲ 資金流入 上位</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th style={S.th}>テーマ</th><th style={S.th}>1週</th><th style={S.th}>出来高Δ</th><th style={S.th}>状態</th><th style={S.th}>シグナル</th></tr></thead>
                <tbody>{signals.top.map(t => (
                  <tr key={t.theme} style={{ cursor: 'pointer' }} onClick={() => onNavigate?.('テーマ別詳細', null, t.theme)}>
                    <td style={{ ...S.td, color: 'var(--text)' }}>{t.theme}</td>
                    <td style={{ ...S.td, ...S.mono, color: t.pct >= 0 ? '#ff5370' : '#00c48c' }}>{t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%</td>
                    <td style={{ ...S.td, ...S.mono, color: 'var(--text2)' }}>{Number.isFinite(t.volume_chg) ? `${t.volume_chg >= 0 ? '+' : ''}${t.volume_chg.toFixed(0)}%` : '—'}</td>
                    <td style={{ ...S.td, fontSize: '11px' }}>{t.state || '—'}</td>
                    <td style={{ ...S.td, fontSize: '11px' }}>{t.sig}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#7ed321', fontWeight: 700, marginBottom: '4px' }}>🌱 初動候補（最重要ゾーン）</div>
              {signals.early.length ? signals.early.map(t => (
                <div key={t.theme} onClick={() => onNavigate?.('テーマ別詳細', null, t.theme)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}>{t.theme}</span>
                  <span style={{ ...S.mono, color: 'var(--text2)' }}>+{t.pct?.toFixed(1)}% / 出来高{t.volume_chg >= 0 ? '+' : ''}{t.volume_chg?.toFixed(0)}%</span>
                </div>
              )) : <div style={S.small}>現在、初動条件を満たすテーマはありません（＝無理に建てない日）</div>}
              <div style={{ fontSize: '11px', color: '#ff5370', fontWeight: 700, margin: '12px 0 4px' }}>🩸 セリクラ候補（逆張りは指値・打診のみ）</div>
              {signals.capit.length ? signals.capit.map(t => (
                <div key={t.theme} onClick={() => onNavigate?.('テーマ別詳細', null, t.theme)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}>{t.theme}</span>
                  <span style={{ ...S.mono, color: '#00c48c' }}>{t.pct?.toFixed(1)}% / 出来高+{t.volume_chg?.toFixed(0)}%</span>
                </div>
              )) : <div style={S.small}>該当なし</div>}
            </div>
          </div>
        ) : <div style={S.small}>{loading ? '読み込み中…' : 'テーマデータの取得に失敗しました'}</div>}
      </div>

      {/* ── C. 需給・イベントカレンダー ── */}
      <div style={S.card}>
        <div style={S.h2}>📅 需給・イベントカレンダー<span style={{ ...S.small, fontWeight: 400 }}>（DevEdge.jsx冒頭のEVENTSで手動更新）</span></div>
        {EVENTS.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ ...S.mono, color: 'var(--text3)', minWidth: '72px' }}>{e.date}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
              color: e.type === 'sell' ? '#ff8c42' : e.type === 'macro' ? '#4a9eff' : '#aa77ff',
              background: e.type === 'sell' ? '#ff8c4215' : e.type === 'macro' ? '#4a9eff15' : '#aa77ff15' }}>
              {e.type === 'sell' ? '需給' : e.type === 'macro' ? 'マクロ' : '決算'}</span>
            <span style={{ color: 'var(--text)' }}>{e.label}</span>
            {e.note && <span style={{ ...S.small }}>— {e.note}</span>}
          </div>
        ))}
      </div>

      {/* ── D. 大株主エッジ・スキャン ── */}
      <div style={S.card}>
        <div style={S.h2}>🏛️ 大株主エッジ・スキャン<span style={{ ...S.small, fontWeight: 400 }}>EDINET有報データから（対象{holderEdge?.total ?? 0}社）</span></div>
        {holderEdge ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#ffd700', fontWeight: 700, marginBottom: '4px' }}>👑 オーナー系（個人合計30%以上）— MBO・事業承継イベント候補</div>
              {holderEdge.owners.length ? holderEdge.owners.map(i => (
                <div key={i.secCode} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}><span style={{ ...S.mono, color: 'var(--text3)', fontSize: '10px' }}>{i.secCode}</span> {i.issuerName}</span>
                  <span style={{ ...S.mono, color: '#ffd700' }}>{i.individualTotal?.toFixed(1)}%</span>
                </div>
              )) : <div style={S.small}>該当なし</div>}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#ff5370', fontWeight: 700, marginBottom: '4px' }}>🏢 筆頭株主が事業法人 — 親子上場解消・TOB思惑の監視リスト</div>
              {holderEdge.corporate.length ? holderEdge.corporate.map(i => (
                <div key={i.secCode} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}><span style={{ ...S.mono, color: 'var(--text3)', fontSize: '10px' }}>{i.secCode}</span> {i.issuerName}</span>
                  <span style={{ ...S.small }}>{i.topHolder?.slice(0, 14)}</span>
                </div>
              )) : <div style={S.small}>該当なし</div>}
            </div>
          </div>
        ) : (
          <div style={S.small}>
            大株主データが未生成です。GitHub Actionsの「Update EDINET Major Shareholders」をdays=370で手動実行するか、
            ローカルで <span style={S.mono}>python fetch_edinet_holders.py --backfill 370</span> を実行してください。
          </div>
        )}
      </div>

      {/* ── E. ポジションサイズ計算機 ── */}
      <div style={S.card}>
        <div style={S.h2}>🧮 ポジションサイズ計算機<span style={{ ...S.small, fontWeight: 400 }}>「何株買うか」は感覚でなくリスクから逆算する</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: '10px', marginBottom: '12px' }}>
          <label style={S.small}>口座資金（円/ドル）<input style={S.input} value={calc.capital} onChange={e => setCalc(c => ({ ...c, capital: e.target.value }))} inputMode="decimal" /></label>
          <label style={S.small}>許容リスク %<input style={S.input} value={calc.riskPct} onChange={e => setCalc(c => ({ ...c, riskPct: e.target.value }))} inputMode="decimal" /></label>
          <label style={S.small}>エントリー価格<input style={S.input} value={calc.entry} onChange={e => setCalc(c => ({ ...c, entry: e.target.value }))} inputMode="decimal" /></label>
          <label style={S.small}>損切り価格<input style={S.input} value={calc.stop} onChange={e => setCalc(c => ({ ...c, stop: e.target.value }))} inputMode="decimal" /></label>
          <label style={S.small}>市場
            <select style={S.input} value={calc.market} onChange={e => setCalc(c => ({ ...c, market: e.target.value }))}>
              <option value="JP">日本株（100株単位）</option>
              <option value="US">米国株（1株単位）</option>
            </select>
          </label>
        </div>
        {position ? position.error ? (
          <div style={{ fontSize: '12px', color: '#ff8c42' }}>{position.error}</div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'baseline' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}><span style={S.mono}>{position.shares.toLocaleString()}</span> 株{position.isShort ? '（売り建て）' : ''}</div>
            <div style={{ ...S.mono, fontSize: '12px', color: 'var(--text2)' }}>建玉 {Math.round(position.exposure).toLocaleString()}　実リスク {Math.round(position.actualRisk).toLocaleString()}（{position.actualRiskPct.toFixed(2)}%）　レバレッジ {position.leverage.toFixed(2)}x</div>
            {position.warn && <div style={{ fontSize: '12px', color: '#ff8c42', fontWeight: 600 }}>{position.warn}</div>}
          </div>
        ) : <div style={S.small}>4項目を入力すると、リスク許容額から株数を逆算します。損切り価格＞エントリーなら空売りとして計算します。</div>}
      </div>

      {/* ── F. キートリガー & マイルール ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.h2}>🚨 キートリガー監視<span style={{ ...S.small, fontWeight: 400 }}>（自動保存）</span></div>
          <textarea value={triggers} onChange={e => setTriggers(e.target.value)} rows={9}
            style={{ ...S.input, resize: 'vertical', lineHeight: 1.8, fontSize: '11.5px' }} />
        </div>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.h2}>✅ エントリー前チェック<span style={{ ...S.small, fontWeight: 400 }}>全部✓できない注文は見送る</span></div>
          {DEFAULT_RULES.map((r, i) => (
            <label key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', fontSize: '12px', color: rulesChecked.includes(i) ? 'var(--text)' : 'var(--text2)', cursor: 'pointer', alignItems: 'flex-start', lineHeight: 1.6 }}>
              <input type="checkbox" checked={rulesChecked.includes(i)}
                onChange={() => setRulesChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                style={{ marginTop: '2px' }} />
              {r}
            </label>
          ))}
          <button onClick={() => setRulesChecked([])} style={{ marginTop: '8px', fontSize: '11px', padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text3)', cursor: 'pointer' }}>リセット（次のトレード）</button>
        </div>
      </div>

      <div style={{ ...S.small, marginTop: '16px' }}>
        ※ 本ページの表示は統計的な傾向・公開情報の整理であり、利益を保証するものではありません。シグナルは「候補の絞り込み」に使い、最終判断は個別銘柄の出来高・板・材料で行ってください。
      </div>
    </div>
  )
}
