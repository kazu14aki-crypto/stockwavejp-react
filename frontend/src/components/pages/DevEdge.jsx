import { useState, useEffect, useMemo } from 'react'
import { useSubscription } from '../../hooks/useSubscription.jsx'
import { supabase } from '../../lib/supabase'

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

// ── 需給イベントの自動生成（SQ=毎月第2金曜など日付が確定的なものはコードで算出） ──
function autoEvents(now = new Date()) {
  const ev = []
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}(${'日月火水木金土'[d.getDay()]})`
  for (let k = 0; k < 3; k++) {
    const y = now.getFullYear(), m = now.getMonth() + k
    // 第2金曜
    const first = new Date(y, m, 1)
    const firstFri = 1 + ((5 - first.getDay() + 7) % 7)
    const sq = new Date(y, m, firstFri + 7)
    if (sq >= now) {
      const major = [2, 5, 8, 11].includes(sq.getMonth())
      ev.push({ date: fmt(sq), label: major ? 'メジャーSQ' : 'オプションSQ', type: 'sell', note: 'SQ週は仕掛け的な値動きに注意', _d: sq })
    }
    // ETF分配金捻出売り（毎年7月上旬）
    if (new Date(y, m, 1).getMonth() === 6) {
      const etf = new Date(y, 6, 8)
      if (etf >= now) ev.push({ date: `7/8前後`, label: 'ETF分配金 捻出売り', type: 'sell', note: '例年計1兆円規模。売り一巡後は押し目候補', _d: etf })
    }
    // 決算シーズン（1・4・7・10月下旬〜）
    if ([0, 3, 6, 9].includes(new Date(y, m, 1).getMonth())) {
      const kessan = new Date(y, new Date(y, m, 1).getMonth(), 25)
      if (kessan >= now) ev.push({ date: `${kessan.getMonth() + 1}月下旬〜`, label: '決算発表ピーク', type: 'event', note: '持ち越しはサイズ管理を', _d: kessan })
    }
  }
  return ev.sort((a, b) => a._d - b._d)
}

// ── 月別アノマリー（日本株の季節性の目安。過信せず「逆らっていないか」の確認用） ──
const MONTH_ANOMALY = {
  1: '1月効果（小型株優位）・新年資金流入。後半は米決算待ちで停滞しやすい',
  2: '節分天井の警戒月。中旬以降は3月期末に向けた配当取りが始まる',
  3: '期末対策・配当権利取りで堅調→権利落ち後は需給悪化。月末リバランス売りに注意',
  4: '新年度資金流入で年間有数の強い月（4月効果）。機関の新年度ポジション構築',
  5: 'セルインメイ。GW明けの決算出尽くしと海外勢の利益確定が重なりやすい',
  6: 'メジャーSQ・配当再投資（下旬）で需給イベント多め。株主総会シーズン',
  7: '前半はETF分配金売りで需給悪化→通過後はサマーラリーに転じやすい',
  8: 'お盆の薄商いで急変しやすい月。夏枯れ相場・8月円高アノマリー',
  9: '年間で最も弱い月の一つ。中間配当権利取りと期末リバランスが交錯',
  10: '10月効果（安値をつけて反転しやすい）。米国も年間底打ちの統計月',
  11: '年末ラリーの起点。米感謝祭以降は例年堅調',
  12: '掉尾の一振・年末ラリー。前半は節税の損出し売りで個別に歪みが出る',
}

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
  '投資アノマリーを確認した（月の癖・SQ週・月初資金流入・セルインメイ等に逆らっていないか）',
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


// ── 並列実行プール（Render無料枠に配慮しつつ72テーマを取得） ──
async function runPool(tasks, limit = 6, onProgress) {
  const results = new Array(tasks.length)
  let idx = 0, done = 0
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      try { results[i] = await tasks[i]() } catch { results[i] = null }
      done++; onProgress?.(done, tasks.length)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
  return results
}

// ── テクニカル指標計算（/api/stock-history の累積騰落率系列から） ──
function computeTech(hist) {
  if (!hist || hist.length < 30) return null
  const r = hist.map(d => 1 + d.pct / 100)               // 相対価格系列
  const last = r[r.length - 1]
  const ma = (n) => {
    if (r.length < n) return null
    const s = r.slice(-n).reduce((a, b) => a + b, 0) / n
    return (last / s - 1) * 100                           // MA乖離率%
  }
  const hi = Math.max(...r)
  const off52w = (last / hi - 1) * 100                    // 期間高値からの位置%
  // RSI(14)
  let gain = 0, loss = 0
  const tail = r.slice(-15)
  for (let i = 1; i < tail.length; i++) {
    const d = tail[i] - tail[i - 1]
    if (d >= 0) gain += d; else loss -= d
  }
  const rsi = gain + loss === 0 ? 50 : (gain / (gain + loss)) * 100
  // 20日ボラティリティ（日次リターン標準偏差%）
  const rets = []
  const t20 = r.slice(-21)
  for (let i = 1; i < t20.length; i++) rets.push((t20[i] / t20[i - 1] - 1) * 100)
  const mean = rets.reduce((a, b) => a + b, 0) / (rets.length || 1)
  const vol20 = Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length || 1))
  const ma25 = ma(25), ma75 = ma(75)
  let trend
  if (ma25 !== null && ma25 > 0 && (ma75 === null || ma75 > 0)) trend = off52w > -3 ? '上昇トレンド・高値圏' : '上昇トレンド'
  else if (ma25 !== null && ma25 < 0 && ma75 !== null && ma75 < 0) trend = '下落トレンド'
  else trend = 'もみ合い・トレンド転換点'
  return { ma25, ma75, off52w, rsi, vol20, trend }
}

const GRADES = [
  { g: 'S', pct: 0.03, color: '#ffd700' }, { g: 'A', pct: 0.10, color: '#ff5370' },
  { g: 'B', pct: 0.30, color: '#ff8c42' }, { g: 'C', pct: 0.70, color: '#4a9eff' },
  { g: 'D', pct: 1.01, color: '#8b949e' },
]
const gradeOf = (rank, total) => {
  const p = rank / Math.max(1, total)
  return GRADES.find(x => p <= x.pct) || GRADES[GRADES.length - 1]
}
const stockSignal = (pct, pctZ, volZ) => {
  if (pct > 0 && volZ > 1.0 && pctZ < 1.5) return '🌱初動'
  if (pctZ > 1.2 && volZ > 0)              return '🔥継続'
  if (pctZ > 1.2 && volZ < -0.3)           return '⚠️過熱'
  if (pctZ < -1.2 && volZ > 1.2)           return '🩸セリクラ?'
  if (pctZ < -1.0)                          return '❄️弱勢'
  return '→中立'
}
// ── 長期ファクター評価 ──────────────────────────────
// 過去30年超・世界の市場データで検証されてきたクロスセクション・リターン因子を、
// 現在取得可能なデータ（1年日足・バリュエーション・時価総額）から計算する。
// 各因子の根拠: 12-1モメンタム(Jegadeesh&Titman 1993)、52週高値(George&Hwang 2004)、
// 低ボラティリティ(Haugen系/Baker et al.)、バリュー(Fama&French 1992)、
// 収益性=質(Novy-Marx 2013; ROE近似=PBR/PER)
function pct01(v, lo, hi) {  // vをlo→0点, hi→100点に線形写像（クリップ）
  if (!Number.isFinite(v)) return null
  return Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100))
}
function percentileIn(arr, v, lowerIsBetter = false) {
  const xs = arr.filter(Number.isFinite)
  if (!Number.isFinite(v) || xs.length < 20) return null
  const below = xs.filter(x => x < v).length / xs.length * 100
  return lowerIsBetter ? 100 - below : below
}
function computeLongFactors(hist, sel, scanRows) {
  const out = { factors: [], score: null, note: null }
  const r = (hist || []).map(d => 1 + d.pct / 100)
  const enough = r.length >= 230
  // ① 12-1ヶ月モメンタム（直近1ヶ月≒21営業日を除外した年間リターン）
  let mom = null
  if (enough) mom = (r[r.length - 22] / r[0] - 1) * 100
  out.factors.push({ key: 'mom', name: '12-1ヶ月モメンタム', w: 0.30,
    raw: mom == null ? null : `${mom >= 0 ? '+' : ''}${mom.toFixed(1)}%`,
    pts: mom == null ? null : pct01(mom, -40, 80),
    ev: '直近1ヶ月を除く過去1年の上昇率。最も頑健な因子で、勝者は勝ち続けやすい（世界の市場で確認）' })
  // ② 52週高値近接（高値付近＝アンカリングによる過小反応）
  let near52 = null
  if (r.length >= 60) near52 = (r[r.length - 1] / Math.max(...r) - 1) * 100  // 0に近いほど高値圏
  out.factors.push({ key: 'hi52', name: '52週高値への近さ', w: 0.15,
    raw: near52 == null ? null : `高値から${near52.toFixed(1)}%`,
    pts: near52 == null ? null : pct01(near52, -50, 0),
    ev: '高値更新圏の銘柄はその後も優位という実証（心理的アンカーへの過小反応）' })
  // ③ 低ボラティリティ（年率σが低いほど質の高いリターン）
  let annVol = null
  if (r.length >= 60) {
    const rets = []
    for (let i = 1; i < r.length; i++) rets.push(r[i] / r[i - 1] - 1)
    const m = rets.reduce((a, b) => a + b, 0) / rets.length
    annVol = Math.sqrt(rets.reduce((a, b) => a + (b - m) ** 2, 0) / rets.length) * Math.sqrt(250) * 100
  }
  out.factors.push({ key: 'vol', name: '低ボラティリティ', w: 0.15,
    raw: annVol == null ? null : `年率σ ${annVol.toFixed(0)}%`,
    pts: annVol == null ? null : pct01(-annVol, -80, -18),
    ev: '値動きの穏やかな銘柄はリスク調整後リターンが高い（低ボラ・アノマリー）' })
  // ④ バリュー（PER/PBR/PEGのユニバース内百分位。低いほど高スコア）
  const rows = scanRows || []
  const pPer = percentileIn(rows.map(x => x.per), sel?.per, true)
  const pPbr = percentileIn(rows.map(x => x.pbr), sel?.pbr, true)
  const pPeg = percentileIn(rows.map(x => x.peg), sel?.peg, true)
  const valParts = [pPer, pPbr, pPeg].filter(Number.isFinite)
  const valPts = valParts.length ? valParts.reduce((a, b) => a + b, 0) / valParts.length : null
  out.factors.push({ key: 'val', name: 'バリュー（割安度）', w: 0.25,
    raw: sel?.per != null ? `PER ${sel.per} / PBR ${sel.pbr ?? '—'} / PEG ${sel.peg ?? '—'}` : null,
    pts: valPts,
    ev: '割安株の長期超過リターン（PBR・PER等）。ユニバース内百分位で評価。2010年代のような長い逆風期もある点に注意' })
  // ⑤ 質（疑似ROE = PBR ÷ PER。高収益企業ほど優位）
  let roe = null
  if (Number.isFinite(sel?.per) && Number.isFinite(sel?.pbr) && sel.per > 0) roe = (sel.pbr / sel.per) * 100
  out.factors.push({ key: 'q', name: '収益性（疑似ROE）', w: 0.15,
    raw: roe == null ? null : `ROE≈${roe.toFixed(1)}%`,
    pts: roe == null ? null : pct01(roe, 2, 25),
    ev: '高収益（質）の企業は割高でも長期に優位。ROEはPBR÷PERで近似' })
  // 合成（データ欠損因子はウェイト再配分）
  const avail = out.factors.filter(f => Number.isFinite(f.pts))
  if (avail.length >= 2) {
    const wsum = avail.reduce((a, f) => a + f.w, 0)
    out.score = Math.round(avail.reduce((a, f) => a + f.pts * (f.w / wsum), 0))
  }
  if (!enough) out.note = '上場からの日数が短く、12-1モメンタムは計算対象外です（他因子のみで合成）'
  if (valPts == null) out.note = (out.note ? out.note + '。' : '') + 'バリュー・質はデータ提供元との連携後に自動反映されます'
  return out
}

const fmtOku = (v) => !Number.isFinite(v) ? '—' : v >= 1e12 ? (v / 1e12).toFixed(1) + '兆' : v >= 1e8 ? (v / 1e8).toFixed(0) + '億' : Math.round(v).toLocaleString()

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

  // ═══ 銘柄スコアリング（スキャン＋照会） ═══
  const [stockIndex, setStockIndex] = useState(null)      // 静的インデックス（検索用）
  const [scan, setScan] = useState(() => {                 // 前回スキャン結果（60分キャッシュ）
    try {
      const s = JSON.parse(localStorage.getItem('swjp_dev_scan_v1') || 'null')
      return s && Date.now() - s.ts < 60 * 60 * 1000 ? s : null
    } catch { return null }
  })
  const [scanning, setScanning] = useState(false)
  const [scanProg, setScanProg] = useState([0, 0])
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(null)                     // 選択銘柄（評価カード）
  const [selTech, setSelTech] = useState(null)
  const [selHist, setSelHist] = useState(null)   // 長期ファクター計算用の生系列
  const [selHolders, setSelHolders] = useState(null)
  const [selLoading, setSelLoading] = useState(false)
  // cis式・本源的価値チェッカー（再構築コスト法）
  const [ic, setIc] = useState({ q: '', code: '', name: '', mcap: '', profit: '', peMin: '10', peMax: '20', moat: '3', supply: '3' })

  useEffect(() => {
    if (!isDev) return
    fetch(`/data/stock_index.json?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : null).then(d => setStockIndex(d)).catch(() => {})
  }, [isDev])

  // ── 全テーマ横断スキャン：サイトで確認できる全銘柄を複合スコア化 ──
  const runScan = async () => {
    if (scanning) return
    setScanning(true); setScanProg([0, 0])
    try {
      let uid = null
      try { uid = (await supabase.auth.getSession())?.data?.session?.user?.id || null } catch {}
      let themePct = {}
      for (const t of (themeData?.themes || [])) themePct[t.theme] = t.pct
      const map = {}
      // 優先: サーバー側集約API（テーマ増減・将来の全銘柄収録に自動追随、1コールで完結）
      const uni = await fetch(`${API_BASE}/api/stock-universe?period=5d${uid ? `&uid=${uid}` : ''}`)
        .then(r => r.ok ? r.json() : null).catch(() => null)
      if (uni?.data?.length) {
        setScanProg([1, 1])
        if (uni.theme_pct) themePct = { ...themePct, ...uni.theme_pct }
        for (const s of uni.data) {
          const code = String(s.ticker || '').replace('.T', '')
          if (!code) continue
          map[code] = { code, name: s.name, price: s.price, pct: s.pct,
            volume_chg: s.volume_chg, trade_value: s.trade_value, mcap: s.market_cap ?? null,
            per: s.per ?? null, pbr: s.pbr ?? null, peg: s.peg ?? null,
            themes: s.themes || [] }
        }
      } else {
        // フォールバック: クライアント側でテーマ巡回（旧方式・バックエンド未デプロイ時）
        const namesRes = await fetch(`${API_BASE}/api/theme-names`).then(r => r.json())
        const names = namesRes?.themes || []
        const tasks = names.map(n => () =>
          fetch(`${API_BASE}/api/theme-detail/${encodeURIComponent(n)}?period=5d${uid ? `&uid=${uid}` : ''}`)
            .then(r => r.ok ? r.json() : null).then(d => ({ theme: n, stocks: d?.data?.stocks || d?.data || [] })))
        const results = await runPool(tasks, 6, (d, t) => setScanProg([d, t]))
        for (const res of results) {
          if (!res) continue
          for (const s of res.stocks) {
            const code = String(s.ticker || '').replace('.T', '')
            if (!code) continue
            if (!map[code]) map[code] = { code, name: s.name, price: s.price, pct: s.pct,
              volume_chg: s.volume_chg, trade_value: s.trade_value, mcap: s.market_cap ?? null,
              per: s.per ?? null, pbr: s.pbr ?? null, peg: s.peg ?? null, themes: [] }
            const m = map[code]
            m.themes.push(res.theme)
            if (m.per == null && s.per != null) { m.per = s.per; m.pbr = s.pbr; m.peg = s.peg }
          }
        }
      }
      let rows = Object.values(map).filter(r => Number.isFinite(r.pct))
      // 所属テーマの追い風（テーマ1週騰落の平均）と1ヶ月モメンタム（静的インデックスから）
      for (const r of rows) {
        const tp = r.themes.map(t => themePct[t]).filter(Number.isFinite)
        r.themeTail = tp.length ? tp.reduce((a, b) => a + b, 0) / tp.length : 0
        r.pct1mo = stockIndex?.[`${r.code}.T`]?.pct ?? null
        if (r.mcap == null) r.mcap = stockIndex?.[`${r.code}.T`]?.market_cap ?? null
      }
      const z1 = zscores(rows.map(r => r.pct))
      const z2 = zscores(rows.map(r => Number.isFinite(r.volume_chg) ? r.volume_chg : 0))
      const z3 = zscores(rows.map(r => r.themeTail))
      const z4 = zscores(rows.map(r => Number.isFinite(r.trade_value) && r.trade_value > 0 ? Math.log10(r.trade_value) : 6))
      const z5 = zscores(rows.map(r => Number.isFinite(r.pct1mo) ? r.pct1mo : 0))
      rows = rows.map((r, i) => ({ ...r,
        z: { mom: z1[i], vol: z2[i], theme: z3[i], liq: z4[i], mom1m: z5[i] },
        score: 0.30 * z1[i] + 0.20 * z2[i] + 0.25 * z3[i] + 0.10 * z4[i] + 0.15 * z5[i],
        sig: stockSignal(r.pct, z1[i], z2[i]),
      }))
      rows.sort((a, b) => b.score - a.score)
      rows.forEach((r, i) => { r.rank = i + 1 })
      const payload = { ts: Date.now(), total: rows.length, rows }
      setScan(payload)
      try { localStorage.setItem('swjp_dev_scan_v1', JSON.stringify(payload)) } catch {}
    } finally { setScanning(false) }
  }

  // ── 銘柄照会：スキャン結果＋テクニカル＋大株主を統合表示 ──
  const selectStock = async (codeRaw, fallbackName) => {
    const code = String(codeRaw).replace('.T', '').trim().toUpperCase()
    const fromScan = scan?.rows?.find(r => r.code === code)
    const fromIdx = stockIndex?.[`${code}.T`]
    let base = fromScan || (fromIdx ? { code, name: fromIdx.name, price: fromIdx.price, pct1mo: fromIdx.pct, themes: fromIdx.themes || [], mcap: fromIdx.market_cap } : { code, name: fallbackName || code, themes: [] })
    setSel(base); setSelTech(null); setSelHist(null); setSelHolders(null); setSelLoading(true); setQ('')
    try {
      const [hist, hold, info] = await Promise.all([
        fetch(`${API_BASE}/api/stock-history/${code}.T?period=1y`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/data/stockholders/${code}.json?t=${Date.now()}`).then(r => r.ok ? r.json() : null).catch(() => null),
        (!fromScan && !fromIdx) ? fetch(`${API_BASE}/api/stock-info/${code}.T`).then(r => r.ok ? r.json() : null).catch(() => null) : Promise.resolve(null),
      ])
      setSelTech(computeTech(hist?.data))
      setSelHist(hist?.data || null)
      setSelHolders(hold)
      if (info?.name) setSel(s => ({ ...s, name: info.name, price: info.price, pct1mo: info.pct }))
    } finally { setSelLoading(false) }
  }

  // 長期ファクター評価（30年の実証研究に基づく因子群）
  const longFactors = useMemo(() => {
    if (!sel) return null
    return computeLongFactors(selHist, sel, scan?.rows)
  }, [sel, selHist, scan])

  // 検索候補
  const matches = useMemo(() => {
    const query = q.trim()
    if (!query || !stockIndex) return []
    const qU = query.toUpperCase()
    return Object.values(stockIndex)
      .filter(s => String(s.ticker).replace('.T', '').startsWith(qU) || (s.name || '').includes(query))
      .slice(0, 8)
  }, [q, stockIndex])

  // 本源的価値チェッカー: 検索候補と時価総額の自動取得
  const icMatches = useMemo(() => {
    const query = ic.q.trim()
    if (!query || !stockIndex) return []
    const qU = query.toUpperCase()
    return Object.values(stockIndex)
      .filter(s => String(s.ticker).replace('.T', '').startsWith(qU) || (s.name || '').includes(query))
      .slice(0, 6)
  }, [ic.q, stockIndex])

  const selectIcStock = (m) => {
    const code = String(m.ticker).replace('.T', '')
    const fromScan = scan?.rows?.find(r => r.code === code)
    const mcapYen = fromScan?.mcap ?? m.market_cap ?? null
    setIc(c => ({ ...c, q: '', code, name: m.name,
      mcap: Number.isFinite(mcapYen) ? (mcapYen / 1e12).toFixed(2) : c.mcap }))
  }

  // cis氏の考え方を、公開決算から使える「利益逆算」に置き換える。
  const icResult = useMemo(() => {
    const mcap = parseFloat(ic.mcap), profit = parseFloat(ic.profit)
    const peMin = parseFloat(ic.peMin), peMax = parseFloat(ic.peMax)
    const moat = parseFloat(ic.moat), supply = parseFloat(ic.supply)
    if (!(mcap > 0 && profit > 0 && peMin > 0 && peMax >= peMin)) return null
    const fairLo = profit * peMin, fairHi = profit * peMax
    const currentPe = mcap / profit
    const requiredProfitLo = mcap / peMax
    const requiredProfitHi = mcap / peMin
    const durability = Math.max(0, Math.min(100, ((moat || 0) + (6 - (supply || 0))) / 10 * 100))
    const adjustedHi = fairHi * (0.75 + durability / 200)
    let judge, color
    if (mcap <= fairLo) { judge = '現在利益だけでも保守的な評価レンジ以下。利益の再現性を確認できれば割安候補です'; color = '#00c48c' }
    else if (mcap <= adjustedHi) { judge = '現在利益と競争優位を前提に説明可能な範囲です。成長率と需給を確認してください'; color = '#4a9eff' }
    else if (currentPe <= peMax * 1.5) { judge = '成長期待を相当織り込んでいます。期待利益に届くまでの年数と新規参入を点検してください'; color = '#ffd700' }
    else { judge = '高利益の長期継続と競争不在を強く織り込む水準です。cis氏のキオクシア判断に近い「供給反応リスク」を重点監視してください'; color = '#ff8c42' }
    return { fairLo, fairHi: adjustedHi, currentPe, requiredProfitLo, requiredProfitHi, durability, judge, color }
  }, [ic])

  // 総合評価文（ルールベース生成）
  const verdict = useMemo(() => {
    if (!sel) return null
    const parts = []
    if (sel.rank) {
      const g = gradeOf(sel.rank, scan.total)
      parts.push(`複合スコアは全${scan.total}銘柄中${sel.rank}位（上位${((sel.rank / scan.total) * 100).toFixed(0)}%・${g.g}評価）。`)
      if (sel.sig === '🌱初動') parts.push('出来高を伴う初動シグナル。押し目を待たず打診→増し玉の分割が定石です。')
      else if (sel.sig === '🔥継続') parts.push('トレンド継続中。新規は5日線・25日線への押しを待つのが有利です。')
      else if (sel.sig === '⚠️過熱') parts.push('価格先行で出来高が細る過熱兆候。新規は見送り、保有分は利益確定の分割を検討。')
      else if (sel.sig === '🩸セリクラ?') parts.push('投げ売り出来高が出ています。逆張りは指値・小玉に限定を。')
      else if (sel.sig === '❄️弱勢') parts.push('相対的に資金流出側。戻り売りの対象で、買いエッジはありません。')
    } else parts.push('スキャン未実行のためランキング評価なし。上の「全銘柄スキャン」を実行すると相対評価が出ます。')
    if (selTech) {
      if (selTech.trend.includes('上昇') && selTech.off52w > -3) parts.push(`テクニカルは${selTech.trend}（高値から${selTech.off52w.toFixed(1)}%）。ブレイク直後以外の飛び乗りは不利です。`)
      else if (selTech.trend === '下落トレンド') parts.push(`テクニカルは下落トレンド（25日線乖離${selTech.ma25?.toFixed(1)}%）。逆張りはトレンド転換の確認後に。`)
      else parts.push(`テクニカルは${selTech.trend}。25日線乖離${selTech.ma25 == null ? '—' : selTech.ma25.toFixed(1)}%、RSI${selTech.rsi.toFixed(0)}。`)
      if (selTech.vol20 > 4) parts.push(`日次ボラ${selTech.vol20.toFixed(1)}%と値動きが荒いため、通常の半分のサイズを推奨（下の計算機で損切り幅を広めに）。`)
    }
    if (Number.isFinite(sel.themeTail)) parts.push(sel.themeTail > 1.5 ? '所属テーマに追い風あり。' : sel.themeTail < -1.5 ? '所属テーマ全体が逆風で、個別好材料が出ても上値は重くなりがちです。' : '')
    if (sel.rank && selTech) {
      // 短期×長期のホライズン整理
      parts.push('【時間軸の整理】上記スコアはスイング（数日〜数週）の相対評価です。中長期（6ヶ月〜）の保有候補としての評価は「長期ファクター評価」を参照し、両方が高い銘柄が最有力、短期のみ高い銘柄は利食い前提、長期のみ高い銘柄は押し目待ちが定石です。')
    }
    const ind = selHolders?.latestSummary?.individual_total
    if (Number.isFinite(ind) && ind >= 30) parts.push(`個人（創業家系）保有${ind.toFixed(0)}%のオーナー系。浮動株が少なく値が軽い一方、MBO・承継イベントの候補でもあります。`)
    else if (selHolders?.latest?.[0]?.category === 'corporate') parts.push(`筆頭株主が事業法人（${selHolders.latest[0].name}）。親子上場・再編思惑の監視対象です。`)
    return parts.filter(Boolean).join('')
  }, [sel, selTech, selHolders, scan])

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
                  <tr key={t.theme} style={{ cursor: 'pointer' }} onClick={() => onNavigate?.('テーマ別詳細', t.theme)}>
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
                <div key={t.theme} onClick={() => onNavigate?.('テーマ別詳細', t.theme)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}>{t.theme}</span>
                  <span style={{ ...S.mono, color: 'var(--text2)' }}>+{t.pct?.toFixed(1)}% / 出来高{t.volume_chg >= 0 ? '+' : ''}{t.volume_chg?.toFixed(0)}%</span>
                </div>
              )) : <div style={S.small}>現在、初動条件を満たすテーマはありません（＝無理に建てない日）</div>}
              <div style={{ fontSize: '11px', color: '#ff5370', fontWeight: 700, margin: '12px 0 4px' }}>🩸 セリクラ候補（逆張りは指値・打診のみ）</div>
              {signals.capit.length ? signals.capit.map(t => (
                <div key={t.theme} onClick={() => onNavigate?.('テーマ別詳細', t.theme)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}>{t.theme}</span>
                  <span style={{ ...S.mono, color: '#00c48c' }}>{t.pct?.toFixed(1)}% / 出来高+{t.volume_chg?.toFixed(0)}%</span>
                </div>
              )) : <div style={S.small}>該当なし</div>}
            </div>
          </div>
        ) : <div style={S.small}>{loading ? '読み込み中…' : 'テーマデータの取得に失敗しました'}</div>}
      </div>

      {/* ── B2. 銘柄スコア・スキャナ ── */}
      <div style={S.card}>
        <div style={S.h2}>🏆 銘柄スコア・スキャナ
          <span style={{ ...S.small, fontWeight: 400 }}>全テーマ横断・複合スコア = 1週騰落30% + 出来高20% + テーマ追い風25% + 流動性10% + 1ヶ月モメンタム15%</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button onClick={runScan} disabled={scanning} style={{ padding: '8px 18px', background: scanning ? 'var(--bg)' : 'var(--accent)', color: scanning ? 'var(--text3)' : '#fff', border: '1px solid var(--border)', borderRadius: '8px', cursor: scanning ? 'default' : 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font)' }}>
            {scanning ? `スキャン中… ${scanProg[0]}/${scanProg[1]}テーマ` : scan ? '🔄 再スキャン' : '▶ 全銘柄スキャン実行'}
          </button>
          {scan && <span style={S.small}>対象 <b style={{ color: 'var(--text2)' }}>{scan.total}</b>銘柄　取得 {new Date(scan.ts).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}（60分キャッシュ）</span>}
          {!scan && !scanning && <span style={S.small}>初回は72テーマ分のAPI取得で1〜2分かかります（サーバー側キャッシュ後は高速）</span>}
        </div>
        {scan && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: 700, marginBottom: '4px' }}>▲ 総合スコア TOP20（クリックで詳細評価）</div>
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr><th style={S.th}>#</th><th style={S.th}>銘柄</th><th style={S.th}>評価</th><th style={S.th}>1週</th><th style={S.th}>出来高Δ</th><th style={S.th}>シグナル</th></tr></thead>
                  <tbody>{scan.rows.slice(0, 20).map(r => {
                    const g = gradeOf(r.rank, scan.total)
                    return (
                      <tr key={r.code} style={{ cursor: 'pointer' }} onClick={() => selectStock(r.code)}>
                        <td style={{ ...S.td, ...S.mono, color: 'var(--text3)' }}>{r.rank}</td>
                        <td style={{ ...S.td, color: 'var(--text)' }}><span style={{ ...S.mono, fontSize: '10px', color: 'var(--text3)' }}>{r.code}</span> {r.name}</td>
                        <td style={S.td}><span style={{ fontSize: '11px', fontWeight: 800, color: g.color }}>{g.g}</span> <span style={{ ...S.mono, fontSize: '10px', color: 'var(--text3)' }}>{r.score.toFixed(2)}</span></td>
                        <td style={{ ...S.td, ...S.mono, color: r.pct >= 0 ? '#ff5370' : '#00c48c' }}>{r.pct >= 0 ? '+' : ''}{r.pct?.toFixed(1)}%</td>
                        <td style={{ ...S.td, ...S.mono, color: 'var(--text2)' }}>{Number.isFinite(r.volume_chg) ? `${r.volume_chg >= 0 ? '+' : ''}${r.volume_chg.toFixed(0)}%` : '—'}</td>
                        <td style={{ ...S.td, fontSize: '11px' }}>{r.sig}</td>
                      </tr>)
                  })}</tbody>
                </table>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#7ed321', fontWeight: 700, marginBottom: '4px' }}>🌱 初動シグナル銘柄</div>
              {scan.rows.filter(r => r.sig === '🌱初動').slice(0, 6).map(r => (
                <div key={r.code} onClick={() => selectStock(r.code)} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text)' }}><span style={{ ...S.mono, fontSize: '10px', color: 'var(--text3)' }}>{r.code}</span> {r.name}</span>
                  <span style={{ ...S.mono, color: 'var(--text2)' }}>+{r.pct?.toFixed(1)}% / Vol+{r.volume_chg?.toFixed(0)}%</span>
                </div>))}
              {scan.rows.filter(r => r.sig === '🌱初動').length === 0 && <div style={S.small}>該当なし（無理に建てない）</div>}
              <div style={{ fontSize: '11px', color: '#00c48c', fontWeight: 700, margin: '12px 0 4px' }}>▼ スコア最下位（買いエッジなし・戻り売り側）</div>
              {scan.rows.slice(-8).reverse().map(r => (
                <div key={r.code} onClick={() => selectStock(r.code)} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text2)' }}><span style={{ ...S.mono, fontSize: '10px', color: 'var(--text3)' }}>{r.code}</span> {r.name}</span>
                  <span style={{ ...S.mono, color: '#00c48c' }}>{r.pct?.toFixed(1)}% {r.sig}</span>
                </div>))}
            </div>
          </div>
        )}
      </div>

      {/* ── B3. 銘柄照会・総合評価カード ── */}
      <div style={S.card}>
        <div style={S.h2}>🔎 銘柄照会<span style={{ ...S.small, fontWeight: 400 }}>証券コードまたは銘柄名で、スコア・順位・テクニカル・大株主を統合評価</span></div>
        <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '12px' }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="例: 5803 / フジクラ / 285A"
            style={{ ...S.input, padding: '9px 12px' }} />
          {matches.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, overflow: 'hidden' }}>
              {matches.map(m => (
                <div key={m.ticker} onClick={() => selectStock(m.ticker, m.name)}
                  style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <span style={{ ...S.mono, color: 'var(--text3)', fontSize: '10px' }}>{String(m.ticker).replace('.T', '')}</span> {m.name}
                </div>))}
            </div>
          )}
        </div>

        {sel && (
          <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: isMobile ? '12px' : '16px 18px', background: 'var(--bg)' }}>
            {/* ヘッダー */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>
                <span style={{ ...S.mono, fontSize: '11px', color: 'var(--text3)' }}>{sel.code}</span> {sel.name}
              </div>
              {sel.rank ? (() => { const g = gradeOf(sel.rank, scan.total); return (
                <span style={{ fontSize: '13px', fontWeight: 800, color: g.color, border: `1px solid ${g.color}55`, background: `${g.color}12`, padding: '2px 10px', borderRadius: '6px' }}>
                  {g.g}評価　{sel.rank}位 / {scan.total}銘柄</span>) })() :
                <span style={{ ...S.small }}>（スキャン未実行のため順位なし）</span>}
              {sel.sig && <span style={{ fontSize: '12px' }}>{sel.sig}</span>}
              {selLoading && <span style={S.small}>詳細取得中…</span>}
            </div>

            {/* ファクター内訳 */}
            {sel.z && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ ...S.small, fontWeight: 700, marginBottom: '4px' }}>スコア内訳（z値：市場平均との乖離）</div>
                {[['1週モメンタム', sel.z.mom, 0.30], ['出来高変化', sel.z.vol, 0.20], ['テーマ追い風', sel.z.theme, 0.25], ['流動性', sel.z.liq, 0.10], ['1ヶ月モメンタム', sel.z.mom1m, 0.15]].map(([lab, z, w]) => (
                  <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}>
                    <span style={{ ...S.small, width: '110px', flexShrink: 0 }}>{lab} <span style={{ opacity: .6 }}>×{w}</span></span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--bg2)', borderRadius: '4px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }} />
                      <div style={{ position: 'absolute', top: 0, bottom: 0, borderRadius: '4px',
                        left: z >= 0 ? '50%' : `${50 - Math.min(Math.abs(z), 2.5) * 20}%`,
                        width: `${Math.min(Math.abs(z), 2.5) * 20}%`,
                        background: z >= 0 ? '#ff5370' : '#00c48c' }} />
                    </div>
                    <span style={{ ...S.mono, fontSize: '10px', color: 'var(--text2)', width: '42px', textAlign: 'right' }}>{z >= 0 ? '+' : ''}{z.toFixed(2)}σ</span>
                  </div>))}
              </div>
            )}

            {/* テクニカル＋基礎データ */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(6, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {[['25日線乖離', selTech?.ma25 == null ? '—' : `${selTech.ma25 >= 0 ? '+' : ''}${selTech.ma25.toFixed(1)}%`],
                ['75日線乖離', selTech?.ma75 == null ? '—' : `${selTech.ma75 >= 0 ? '+' : ''}${selTech.ma75.toFixed(1)}%`],
                ['1年高値から', selTech ? `${selTech.off52w.toFixed(1)}%` : '—'],
                ['RSI(14)', selTech ? selTech.rsi.toFixed(0) : '—'],
                ['日次ボラ(20d)', selTech ? `${selTech.vol20.toFixed(1)}%` : '—'],
                ['時価総額', fmtOku(sel.mcap)],
              ].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 9px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text3)' }}>{l}</div>
                  <div style={{ ...S.mono, fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{v}</div>
                </div>))}
            </div>

            {/* バリュエーション */}
            <div style={{ ...S.small, marginBottom: '10px' }}>
              バリュエーション：PER <b style={{ ...S.mono, color: 'var(--text2)' }}>{sel.per ?? '—'}</b>　PBR <b style={{ ...S.mono, color: 'var(--text2)' }}>{sel.pbr ?? '—'}</b>　PEG <b style={{ ...S.mono, color: 'var(--text2)' }}>{sel.peg ?? '—'}</b>
              {sel.per == null && '（Infoway契約後に自動表示）'}
            </div>

            {/* 長期ファクター評価 */}
            {longFactors && (
              <div style={{ marginBottom: '12px', padding: '12px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>🧭 長期ファクター評価</span>
                  <span style={{ ...S.small }}>過去30年超・世界の市場で検証された因子に基づく中長期（6ヶ月〜）の期待値評価</span>
                  {longFactors.score != null && (
                    <span style={{ marginLeft: 'auto', fontSize: '16px', fontWeight: 800, fontFamily: 'var(--mono)',
                      color: longFactors.score >= 70 ? '#ffd700' : longFactors.score >= 50 ? '#ff8c42' : '#8b949e' }}>
                      {longFactors.score}<span style={{ fontSize: '10px', color: 'var(--text3)' }}> /100</span></span>
                  )}
                </div>
                {longFactors.factors.map(f => (
                  <div key={f.key} style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--text2)', width: '150px', flexShrink: 0 }}>{f.name} <span style={{ opacity: .55 }}>×{f.w}</span></span>
                      <div style={{ flex: 1, height: '7px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                        {Number.isFinite(f.pts) && <div style={{ width: `${f.pts}%`, height: '100%', borderRadius: '4px',
                          background: f.pts >= 70 ? '#ffd700' : f.pts >= 45 ? '#ff8c42' : '#4a9eff' }} />}
                      </div>
                      <span style={{ ...S.mono, fontSize: '10.5px', color: 'var(--text2)', width: '150px', textAlign: 'right' }}>{f.raw ?? 'データ待ち'}{Number.isFinite(f.pts) && ` ・ ${Math.round(f.pts)}点`}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', lineHeight: 1.6, marginLeft: '158px' }}>{f.ev}</div>
                  </div>
                ))}
                {longFactors.note && <div style={{ ...S.small, marginTop: '6px', color: '#ff8c42' }}>※ {longFactors.note}</div>}
                <div style={{ ...S.small, marginTop: '6px' }}>
                  ※ 各因子の「プレミアム」は長期・多数銘柄の平均であり、毎年・全銘柄で成立するものではありません（例：バリューは2010年代に約10年の逆風）。短期シグナル（上のスコア）はスイング用、本評価は中長期の保有候補選別用と使い分けてください。
                </div>
              </div>
            )}

            {/* 所属テーマ */}
            {sel.themes?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {sel.themes.map(t => {
                  const tp = themeData?.themes?.find(x => x.theme === t)?.pct
                  return (
                    <span key={t} onClick={() => onNavigate?.('テーマ別詳細', t)} style={{ fontSize: '10.5px', padding: '3px 9px', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', background: 'var(--bg2)' }}>
                      {t}{Number.isFinite(tp) && <b style={{ ...S.mono, color: tp >= 0 ? '#ff5370' : '#00c48c', marginLeft: '4px' }}>{tp >= 0 ? '+' : ''}{tp.toFixed(1)}%</b>}
                    </span>)
                })}
              </div>
            )}

            {/* 大株主サマリー */}
            {selHolders ? (
              <div style={{ ...S.small, marginBottom: '10px', lineHeight: 1.9 }}>
                🏛️ 大株主（{selHolders.latestDate}有報）：筆頭 <b style={{ color: 'var(--text)' }}>{selHolders.latest?.[0]?.name}</b>（{selHolders.latest?.[0]?.ratio?.toFixed(1)}%・{selHolders.latest?.[0]?.category_label}）
                　個人系合計 <b style={{ color: '#ffd700' }}>{selHolders.latestSummary?.individual_total?.toFixed(1)}%</b>
                　上位10名計 <b style={{ color: 'var(--text2)' }}>{selHolders.latestSummary?.top10_total?.toFixed(1)}%</b>
              </div>
            ) : !selLoading && <div style={{ ...S.small, marginBottom: '10px' }}>🏛️ 大株主データ未取得（EDINETバッチ実行後に自動表示）</div>}

            {/* 総合評価 */}
            {verdict && (
              <div style={{ padding: '10px 14px', background: 'rgba(74,158,255,0.07)', border: '1px solid rgba(74,158,255,0.25)', borderRadius: '8px', fontSize: '12px', color: 'var(--text2)', lineHeight: 1.9 }}>
                💡 <b style={{ color: 'var(--text)' }}>総合評価</b>：{verdict}
              </div>
            )}
          </div>
        )}
        {!sel && <div style={S.small}>コードか銘柄名を入力すると、スコア順位・ファクター内訳・テクニカル位置・大株主構成・所属テーマの追い風までを1枚のカードに統合して評価します。TOP20の行クリックでも開きます。</div>}
      </div>

      {/* ── C. 需給・イベントカレンダー ── */}
      <div style={S.card}>
        <div style={S.h2}>📅 需給・イベントカレンダー<span style={{ ...S.small, fontWeight: 400 }}>SQ・分配金・決算期は自動算出／マクロ日程はEVENTSで手動更新</span></div>
        <div style={{ padding: '8px 12px', marginBottom: '10px', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', fontSize: '11.5px', color: 'var(--text2)', lineHeight: 1.7 }}>
          🗓️ <b style={{ color: '#ffd700' }}>{new Date().getMonth() + 1}月のアノマリー</b>：{MONTH_ANOMALY[new Date().getMonth() + 1]}
        </div>
        {(() => {
          const auto = autoEvents()
          const manual = EVENTS.filter(e => !auto.some(a => a.label === e.label))
          return [...auto, ...manual]
        })().map((e, i) => (
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

      {/* ── E2. 利益逆算・供給反応チェッカー ── */}
      <div style={S.card}>
        <div style={S.h2}>💰 利益逆算・供給反応チェッカー<span style={{ ...S.small, fontWeight: 400 }}>cis氏の発想を、決算資料だけで使える形に簡略化</span></div>
        <div style={{ ...S.small, marginBottom: '12px' }}>
          再構築コストを自分で積算する代わりに、現在の時価総額が「どれほどの利益を、どれほど長く維持する前提か」を逆算します。必要なのは直近12か月の純利益だけです。
        </div>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input style={{ ...S.input, width: '100%' }} value={ic.q} onChange={e => setIc(c => ({ ...c, q: e.target.value }))} placeholder="銘柄コード・会社名で検索" />
          {icMatches.length > 0 && <div style={{ position:'absolute', zIndex:20, top:'100%', left:0, right:0, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden' }}>
            {icMatches.map(m => <div key={m.ticker} onClick={() => selectIcStock(m)} style={{ padding:'8px 10px', cursor:'pointer', fontSize:'12px', borderBottom:'1px solid var(--border)' }}>{String(m.ticker).replace('.T','')} {m.name}</div>)}
          </div>}
        </div>
        {ic.name && <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text)', marginBottom:'10px' }}>{ic.code} {ic.name}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'8px', marginBottom:'12px' }}>
          <label style={S.small}>時価総額（兆円）<input style={S.input} value={ic.mcap} onChange={e=>setIc(c=>({...c,mcap:e.target.value}))} inputMode="decimal" placeholder="自動取得または入力" /></label>
          <label style={S.small}>直近12か月純利益（兆円）<input style={S.input} value={ic.profit} onChange={e=>setIc(c=>({...c,profit:e.target.value}))} inputMode="decimal" placeholder="例: 0.25" /></label>
          <label style={S.small}>妥当PER 下限<input style={S.input} value={ic.peMin} onChange={e=>setIc(c=>({...c,peMin:e.target.value}))} inputMode="decimal" /></label>
          <label style={S.small}>妥当PER 上限<input style={S.input} value={ic.peMax} onChange={e=>setIc(c=>({...c,peMax:e.target.value}))} inputMode="decimal" /></label>
          <label style={S.small}>参入障壁 1〜5<input style={S.input} type="number" min="1" max="5" value={ic.moat} onChange={e=>setIc(c=>({...c,moat:e.target.value}))} /></label>
          <label style={S.small}>供給増加リスク 1〜5<input style={S.input} type="number" min="1" max="5" value={ic.supply} onChange={e=>setIc(c=>({...c,supply:e.target.value}))} /></label>
        </div>
        {icResult ? <>
          <div style={{ padding:'12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', marginBottom:'10px' }}>
            <div style={{ fontSize:'12px', color:'var(--text2)' }}>現在PER相当 <b style={{...S.mono,color:'var(--text)'}}>{icResult.currentPe.toFixed(1)}倍</b></div>
            <div style={{ fontSize:'12px', color:'var(--text2)' }}>利益基準の価値レンジ <b style={{...S.mono,color:'#4a9eff'}}>{icResult.fairLo.toFixed(2)}〜{icResult.fairHi.toFixed(2)}兆円</b></div>
            <div style={{ fontSize:'12px', color:'var(--text2)' }}>現在時価総額を正当化する純利益 <b style={{...S.mono,color:'#ffd700'}}>{icResult.requiredProfitLo.toFixed(2)}〜{icResult.requiredProfitHi.toFixed(2)}兆円</b></div>
          </div>
          <div style={{ padding:'12px', border:`1px solid ${icResult.color}55`, borderLeft:`3px solid ${icResult.color}`, borderRadius:'8px', color:icResult.color, fontSize:'12px', lineHeight:1.8, marginBottom:'10px' }}>{icResult.judge}</div>
          <div style={S.small}>確認事項：①その利益は市況ピークではないか ②競合が増産・参入できるか ③設備投資後に供給過剰にならないか ④指数組入れ・個人信用買いなど需給が過熱していないか ⑤売却判断は価値だけでなく売買代金と需給反転を待つ。</div>
        </> : <div style={S.small}>時価総額と直近12か月純利益を入力すると、現在価格が要求する利益水準と競争リスクを表示します。</div>}
      </div>

      {/* ── F. キートリガー & マイルール ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.h2}>🚨 キートリガー監視<span style={{ ...S.small, fontWeight: 400 }}>（手動リスト＝自動保存／下段はデータから自動検知）</span></div>
          {signals && (() => {
            const alerts = []
            for (const t of (themeData?.themes || [])) {
              if (t.pct >= 5) alerts.push(`▲ ${t.theme} が週間+${t.pct.toFixed(1)}%（資金集中）`)
              if (t.pct <= -5) alerts.push(`▼ ${t.theme} が週間${t.pct.toFixed(1)}%（資金流出）`)
            }
            if (signals.early.length) alerts.push(`🌱 初動シグナル: ${signals.early.map(x => x.theme).join('・')}`)
            if (signals.capit.length) alerts.push(`🩸 セリクラ候補: ${signals.capit.map(x => x.theme).join('・')}`)
            return alerts.length ? (
              <div style={{ marginBottom: '8px', padding: '8px 10px', background: 'rgba(74,158,255,0.06)', border: '1px solid rgba(74,158,255,0.2)', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#4a9eff', marginBottom: '4px' }}>本日の自動検知（データ更新のたびに変化）</div>
                {alerts.slice(0, 6).map((a, i) => <div key={i} style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.8 }}>{a}</div>)}
              </div>
            ) : null
          })()}
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
