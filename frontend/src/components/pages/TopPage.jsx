import { useState } from 'react'
import FirstVisitTutorial from '../FirstVisitTutorial'
import { DataStateBanner } from '../DataStateBanner'
import { useThemes, useMacro } from '../../hooks/useMarketData'
import MacroLineChart, { MacroCard, SHead } from '../MacroLineChart'

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
  '光ファイバー・光部品':            'optical-communication',
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

const ALL_NEWS = [
  { date:'2026/07/20', tag:'UPDATE', title:'開発中ページの公開範囲とページ間ナビを改善' },
  { date:'2026/07/20', tag:'UPDATE', title:'開発中機能の公開範囲を調整' },
  { date:'2026/07/20', tag:'UPDATE', title:'初回ガイド・利用ステップ・契約管理を改善' },
  { date:'2026/07/20', tag:'COLUMN', title:'世界株安とKOSPI急落を分析した新コラムを公開' },
  { date:'2026/07/20', tag:'UPDATE', title:'障害耐性と初回ガイドを改善／データ状態表示を追加' },
  { date:'2026/07/19', tag:'UPDATE', title:'料金プラン・更新頻度を更新／テーマ選定基準を公開' },
  { date:'2026/05/29', tag:'NEW',    title:'MLCCテーマ追加・村田製作所＆MLCC解説コラム公開' },
  { date:'2026/05/29', tag:'NEW',    title:'週次レポート（5/25〜5/29）公開' },
  { date:'2026/05/22', tag:'NEW',    title:'週次レポート（5/18〜5/22）公開' },
  { date:'2026/05/18', tag:'UPDATE', title:'カスタムテーマに取得価格・損益管理機能を追加' },
  { date:'2026/05/15', tag:'NEW',    title:'週次レポート（5/11〜5/15）公開' },
  { date:'2026/05/08', tag:'NEW',    title:'週次レポート（5/4〜5/8）公開' },
  { date:'2026/03/14', tag:'NEW',    title:'StockWaveJP React版リリース' },
]
// 降順ソート・最新3件
const NEWS_LIST = [...ALL_NEWS].sort((a,b) => b.date.localeCompare(a.date)).slice(0,3)
const TAG_COLORS = {
  'NEW':    { bg:'rgba(255,83,112,0.15)', color:'var(--red)',    border:'rgba(255,83,112,0.3)' },
  'UPDATE': { bg:'rgba(91,156,246,0.12)', color:'var(--accent)', border:'rgba(91,156,246,0.25)' },
  'INFO':   { bg:'rgba(76,175,130,0.12)', color:'var(--green)',  border:'rgba(76,175,130,0.25)' },
}

// ── 市場コメント自動生成 ──
function AutoComment({ lines }) {
  // 防御的処理: null/undefined/空/文字列に対応
  let safeLines = lines
  if (!safeLines) return null
  if (typeof safeLines === 'string') safeLines = safeLines.split('\n').filter(Boolean)
  if (!Array.isArray(safeLines) || !safeLines.length) return null

  const rendered = safeLines.map((line, i) => {
    if (typeof line !== 'string') return null
    if (line.startsWith('【')) {
      const e = line.indexOf('】')
      if (e < 0) return <div key={i} style={{ fontSize:'12px', color:'var(--text2)', lineHeight:'1.8', marginBottom:'4px', paddingLeft:'4px' }}>{line}</div>
      const h = line.slice(1, e), r = line.slice(e + 1).trim()
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
      const text = si > 0 ? line.slice(si + 1) : ''
      const ci = text.indexOf('：'), label = ci > 0 ? text.slice(0, ci) : null, body = ci > 0 ? text.slice(ci + 1).trim() : text
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

function generateMarketComment(themeData, macro) {
  if (!themeData || !themeData.themes) return null
  const s = themeData.summary
  if (!s) return null
  const t = themeData.themes

  const riseCount = s.rise
  const fallCount = s.fall
  const total     = s.total
  const avg       = s.avg ?? 0

  // 市場全体の状態
  const mktState = riseCount >= total*0.7 ? '広範な上昇相場' :
                   riseCount >= total*0.55 ? '上昇優勢の相場' :
                   fallCount >= total*0.7  ? '広範な下落相場' :
                   fallCount >= total*0.55 ? '下落優勢の相場' : '方向感の定まらない相場'

  const top3 = [...t].sort((a,b)=>b.pct-a.pct).slice(0,3)
  const bot3 = [...t].sort((a,b)=>a.pct-b.pct).slice(0,3)
  const volUp = [...t].filter(x=>(x.volume_chg||0)>20).sort((a,b)=>(b.volume_chg||0)-(a.volume_chg||0)).slice(0,3)
  const hotThemes  = t.filter(x=>x.pct>=5)
  const coldThemes = t.filter(x=>x.pct<=-5)

  // マクロ情報
  const macroKeys = macro ? Object.keys(macro) : []
  const nikkei = macro?.['国内主要株(1321)'] || macro?.['日経225連動型(1321)']
  const topix  = macro?.['TOPIX連動型上場投信(1306)'] || macro?.['TOPIX指数'] || macro?.['TOPIX連動型(1306)'] || macro?.['1306.T']
  const sp500  = macro?.['S&P500 ETF(SPY)']
  const usdjpy = macro?.['ドル円']
  const lastNK = nikkei ? nikkei[nikkei.length-1]?.pct : null
  const lastTP = topix  ? topix[topix.length-1]?.pct  : null
  const lastSP = sp500  ? sp500[sp500.length-1]?.pct  : null
  const lastFX = usdjpy ? usdjpy[usdjpy.length-1]?.pct : null

  const lines = []

  // 全体概況
  lines.push(`【マーケット概況】現在の日本株テーマ相場は${mktState}です。全${total}テーマ中${riseCount}テーマが上昇・${fallCount}テーマが下落し、テーマ平均騰落率は${avg>=0?'+':''}${avg.toFixed(2)}%。${hotThemes.length>0?`+5%超の急騰テーマが${hotThemes.length}個、`:''  }${coldThemes.length>0?`-5%超の急落テーマが${coldThemes.length}個あります。`:''}`)

  // マクロ環境
  if (lastNK != null || lastSP != null) {
    const macroLine = [
      lastNK != null ? `日経225連動型${lastNK>=0?'+':''}${lastNK.toFixed(1)}%` : null,
      lastTP != null ? `TOPIX連動型${lastTP>=0?'+':''}${lastTP.toFixed(1)}%` : null,
      lastSP != null ? `S&P500 ${lastSP>=0?'+':''}${lastSP.toFixed(1)}%` : null,
      lastFX != null ? `ドル円${lastFX>=0?'+':''}${lastFX.toFixed(1)}%` : null,
    ].filter(Boolean).join(' / ')
    const riskMode = lastSP != null ? (lastSP > 1 ? 'リスクオン（米国株高）でテーマ株にも追い風。' : lastSP < -1 ? 'リスクオフ（米国株安）で地合いは慎重。' : '米国株は横ばい。') : ''
    lines.push(`【マクロ指標（参照期間）】${macroLine}。${riskMode}${lastFX != null ? (lastFX > 1 ? '円安傾向で輸出・グローバル銘柄に有利な環境。' : lastFX < -1 ? '円高傾向で内需・消費系に資金が向かいやすい局面。' : '') : ''}`)
  }

  // 上昇テーマ
  if (top3.length && top3[0].pct > 0) {
    const upNames = top3.filter(x=>x.pct>0).map(x=>`「${x.theme}」(${x.pct>=0?'+':''}${x.pct.toFixed(1)}%)`).join('、')
    lines.push(`▲ 上昇が目立つテーマ：${upNames}。${volUp.length>0&&top3.some(top=>volUp.some(v=>v.theme===top.theme))?`特に「${top3[0].theme}」は出来高も急増しており、資金の本格流入が始まっている可能性がある。`:''}`)
  }

  // 下落テーマ
  if (bot3.length && bot3[0].pct < 0) {
    const dnNames = bot3.filter(x=>x.pct<0).map(x=>`「${x.theme}」(${x.pct.toFixed(1)}%)`).join('、')
    lines.push(`▼ 下落が目立つテーマ：${dnNames}。${coldThemes.length>3?'広範な売り圧力がかかっており、個別テーマの選別が重要。':'下落幅が大きく過熱感の解消や外部要因が影響している可能性がある。'}`)
  }

  // 出来高増加テーマ
  if (volUp.length > 0) {
    lines.push(`📊 出来高が前期比+20%超で急増しているテーマ：「${volUp.map(x=>x.theme).join('」「')}」。出来高増加は大口資金の動きを先行して示すことが多く、今後の株価動向を見極めるうえで重要なシグナル。`)
  }

  // 出来高急増かつ上昇テーマ → 特に注目
  const hotWithVol = hotThemes.filter(h => volUp.some(v => v.theme === h.theme))
  if (hotWithVol.length > 0) {
    lines.push(`🔥 急騰かつ出来高急増テーマ：「${hotWithVol.map(t=>t.theme).join('」「')}」。価格上昇と出来高増加が同時発生しており、強いトレンドの初期段階である可能性が高い。`)
  }

  // 下落幅が大きいが出来高も増加（底値模索か）
  const coldWithVolUp = coldThemes.filter(h => volUp.some(v => v.theme === h.theme))
  if (coldWithVolUp.length > 0) {
    lines.push(`📉 下落テーマでも出来高増加：「${coldWithVolUp.map(t=>t.theme).join('」「')}」。売り圧力が強いが出来高増は底値模索の兆しの可能性もある。反転サインを確認してから判断したい。`)
  }

  lines.push(`💡 本日のポイント：${avg >= 2 ? '全体的に強い相場環境。強気テーマへの集中投資が奏功しやすい局面。' : avg <= -2 ? '全体的に弱い地合い。守備的なテーマ（通信・医薬品等）や現金比率を高める局面。' : '方向感が定まらないため、モメンタムの強いテーマに絞り込み、出来高増加を確認してから参入するのが有効。'}`)

  return lines
}


function Dots() {
  return (
    <span style={{ display:'inline-flex', gap:'3px', alignItems:'center' }}>
      {[0,0.15,0.3].map((d,i)=>(
        <span key={i} style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%',
          background:'var(--accent)', animation:`pulse 1.2s ease-in-out ${d}s infinite` }}/>
      ))}
    </span>
  )
}

function KpiCard({ label, value, valueColor, sub, delay=0, loading=false, arrow=null }) {
  const ArrowIcon = () => {
    if (!arrow) return null
    return (
      <span style={{
        fontSize:'18px', marginLeft:'4px', lineHeight:1,
        color: arrow === 'up' ? 'var(--red)' : 'var(--green)',
        display:'inline-block',
      }}>
        {arrow === 'up' ? '↗' : '↘'}
      </span>
    )
  }
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'16px 18px',
      animation:`fadeUp 0.4s ease ${delay}s both`,
      transition:'border-color 0.2s, transform 0.15s',
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(91,156,246,0.3)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}
    >
      <div style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.1em', color:'var(--text3)', textTransform:'uppercase', marginBottom:'10px' }}>{label}</div>
      <div style={{ fontFamily:'var(--mono)', fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, marginBottom:'6px', color:valueColor||'var(--text)' }}>
        {loading ? <Dots /> : value}
      </div>
      <div style={{ fontSize:'11px', color:'var(--text3)' }}>{sub}</div>
    </div>
  )
}

export default function TopPage({ onNavigate }) {
  const { data: themes, loading: loadingT, dataState, reason, fetchedAt, dataAsOf, nextUpdate, refresh } = useThemes('1mo')
  const { data: macroRaw, loading: loadingM } = useMacro('1mo')
  const macro   = macroRaw?.data || {}
  const loading = loadingT || loadingM

  const s = themes?.summary

  return (
    <div style={{ padding:'20px 24px 48px', maxWidth:'100%', overflowX:'hidden' }}>
      <FirstVisitTutorial onNavigate={onNavigate} />

      {/* ヒーロー */}
      <div style={{
        background:'linear-gradient(135deg,rgba(91,156,246,0.07) 0%,rgba(255,83,112,0.05) 100%)',
        border:'1px solid var(--border)', borderRadius:'var(--radius)',
        padding:'20px 24px', marginBottom:'16px', animation:'fadeUp 0.5s ease both',
      }}>
        <h1 style={{ fontSize:'22px', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:'8px' }}>
          <span style={{ color:'var(--logo-red)' }}>Stock</span>Wave
          <span style={{ color:'var(--logo-red)', fontSize:'13px' }}>JP</span>
        </h1>
        {/* PC:1行 / SP:折り返し */}
        <p style={{ fontSize:'11px', color:'var(--text2)', lineHeight:1.7, marginBottom:'12px' }} className="hero-desc">
          日本株の資金が、今どのテーマへ向かっているかを可視化する。テーマの強さを市場平均、出来高、構成銘柄、過去分布から確認し、個別銘柄を調べる起点を提供します。
        </p>
        <button
          type="button"
          onClick={() => onNavigate?.('使い方')}
          style={{
            display:'inline-flex', alignItems:'center', gap:'7px', padding:'8px 13px',
            borderRadius:'7px', border:'1px solid rgba(74,158,255,0.3)',
            background:'rgba(74,158,255,0.08)', color:'var(--accent)', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'11px', fontWeight:700,
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(74,158,255,0.14)' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(74,158,255,0.08)' }}
        >
          <span>初めての方へ</span>
          <span style={{ color:'var(--text2)', fontWeight:600 }}>StockWaveJPの詳しい使い方を見る</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <DataStateBanner state={dataState} reason={reason} onRetry={refresh} />
<div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(215px,1fr))', gap:'8px', marginBottom:'18px' }}>
        {[
          { n:'1', title:'強いテーマを探す', page:'テーマ一覧', detail:'期間を「1週間」、表示指標を「市場超過騰落率」に切り替え、TOPIXを上回るテーマを確認します。', example:'例：テーマ騰落率 +3.2%／市場 +1.0%なら、市場超過は +2.2pt' },
          { n:'2', title:'資金流入と過熱度を見る', page:'テーマ別詳細', detail:'候補テーマを開き、出来高グラフと成績分布を確認します。構成銘柄の一部だけが急騰していないかも見ます。', example:'例：出来高増加と上昇銘柄比率がともに高ければ、広い資金流入の可能性' },
          { n:'3', title:'投資候補を絞る', page:'テーマ別詳細・銘柄検索', detail:'構成銘柄表から業績、流動性、開示資料を比較し、テーマが強いという理由だけで購入しないようにします。', example:'例：同じテーマでも受注残、利益率、割高感を銘柄ごとに比較' },
          { n:'4', title:'継続か失速か追う', page:'レポート', detail:'週次レポートの「前回ランキングの事後成績」で、前週上位テーマが翌週も市場を上回ったか確認します。', example:'例：順位上位でも翌週の市場超過がマイナスなら、短期過熱の可能性' },
        ].map(step => (
          <button key={step.n} type="button" onClick={() => onNavigate?.(step.n==='1' ? 'テーマ一覧' : step.n==='4' ? 'レポート' : 'テーマ別詳細')}
            style={{padding:'13px 14px',border:'1px solid var(--border)',borderRadius:'9px',background:'var(--bg2)',textAlign:'left',cursor:'pointer',fontFamily:'var(--font)'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(74,158,255,.45)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)' }}>
            <div style={{display:'flex',justifyContent:'space-between',gap:'8px',alignItems:'center'}}>
              <div style={{fontSize:'10px',fontWeight:800,color:'var(--accent)'}}>STEP {step.n}</div>
              <div style={{fontSize:'9px',fontWeight:700,color:'var(--accent)',background:'rgba(74,158,255,.08)',border:'1px solid rgba(74,158,255,.22)',borderRadius:'12px',padding:'2px 7px'}}>{step.page}</div>
            </div>
            <div style={{fontSize:'12px',fontWeight:700,color:'var(--text)',margin:'7px 0 5px'}}>{step.title}</div>
            <div style={{fontSize:'10px',color:'var(--text2)',lineHeight:1.7}}>{step.detail}</div>
            <div style={{fontSize:'9px',color:'var(--text3)',lineHeight:1.65,marginTop:'7px',paddingTop:'7px',borderTop:'1px dashed var(--border)'}}>{step.example}</div>
          </button>
        ))}
      </div>

      {/* お知らせ（小見出しのみ・コンパクト） */}
      <SHead title="📣 お知らせ" />
      <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginBottom:'4px' }}>
        {NEWS_LIST.map((n,i)=>{
          const tc = TAG_COLORS[n.tag]||TAG_COLORS['INFO']
          return (
            <div key={i} onClick={() => onNavigate?.('お知らせ')}
              style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'6px', padding:'7px 12px',
              display:'flex', alignItems:'center', gap:'8px',
              animation:`fadeUp 0.25s ease ${i*0.05}s both`,
              minWidth:0, cursor:'pointer', transition:'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(74,158,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <span style={{ fontSize:'9px', fontWeight:700, padding:'1px 7px', borderRadius:'20px', flexShrink:0,
                background:tc.bg, color:tc.color, border:`1px solid ${tc.border}` }}>{n.tag}</span>
              <span style={{ fontSize:'12px', fontWeight:600, color:'var(--text)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</span>
              <span style={{ fontSize:'10px', color:'var(--text3)', fontFamily:'var(--mono)', whiteSpace:'nowrap', flexShrink:0 }}>{n.date}</span>
            </div>
          )
        })}
      </div>

      {/* KPIカード */}
      <SHead title="📊 マーケットサマリー（1ヶ月）" />
      <div className="responsive-grid-4" style={{ marginBottom:'4px' }}>
        <KpiCard delay={0.05} loading={loading} label="上昇テーマ"
          value={<span>{s?s.rise:'-'}<span style={{ fontSize:'14px', color:'var(--text3)', fontWeight:400 }}>{s?` / ${s.total}`:''}</span></span>}
          valueColor="var(--red)"
          arrow={s ? (s.rise > s.fall ? 'up' : s.rise < s.fall ? 'down' : null) : null}
          sub="全テーマ中"/>
        <KpiCard delay={0.1} loading={loading} label="平均騰落率"
          value={s?`${s.avg>=0?'+':''}${s.avg?.toFixed(2)}%`:'-'}
          valueColor={s?.avg>=0?'var(--red)':'var(--green)'}
          arrow={s ? (s.avg >= 0 ? 'up' : 'down') : null}
          sub="期間:1ヶ月"/>
        <KpiCard delay={0.15} loading={loading} label="資金流入TOP"
          value={<span>{s?.top?.theme||'-'}</span>}
          valueColor="var(--red)"
          arrow="up"
          sub={s?.top?<span style={{ color:'var(--red)', fontWeight:600 }}>+{s.top.pct.toFixed(1)}%</span>:'-'}/>
        <KpiCard delay={0.2} loading={loading} label="資金流出TOP"
          value={<span>{s?.bot?.theme||'-'}</span>}
          valueColor="var(--green)"
          arrow="down"
          sub={s?.bot?<span style={{ color:'var(--green)', fontWeight:600 }}>{s.bot.pct.toFixed(1)}%</span>:'-'}/>
      </div>

      {/* 市場コメント自動生成 */}
      {!loading && themes && (
        <div style={{
          background:'rgba(74,158,255,0.05)', border:'1px solid rgba(74,158,255,0.18)',
          borderRadius:'8px', padding:'12px 16px', marginBottom:'4px',
          animation:'fadeUp 0.4s ease 0.25s both',
        }}>
          <div style={{ fontSize:'10px', fontWeight:700, color:'var(--accent)',
            letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'6px' }}>
            📝 本日のマーケットコメント（自動生成・1ヶ月集計）
          </div>
          <AutoComment lines={generateMarketComment(themes, macro)} />

          {/* 注目テーマ誘導ボタン */}
          {themes?.themes?.length > 0 && onNavigate && (() => {
            const top3 = [...(themes.themes||[])].sort((a,b)=>b.pct-a.pct).slice(0,3)
            return (
              <div style={{ marginTop:'14px' }}>
                <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'10px',
                  fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  🔎 注目テーマ TOP3
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'12px' }} className="top3-grid">
                  {top3.map((t, i) => (
                    <div key={t.theme} style={{
                      background:'var(--bg2)', border:'1px solid var(--border)',
                      borderRadius:'8px', padding:'10px 14px',
                      borderTop:`3px solid ${i===0?'#ffd166':i===1?'rgba(192,192,192,0.6)':'rgba(205,127,50,0.6)'}`,
                    }}>
                      <div style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'4px', fontWeight:600 }}>
                        {i===0?'🥇 注目テーマ No.1':i===1?'🥈 注目テーマ No.2':'🥉 注目テーマ No.3'}
                      </div>
                      <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>
                        {t.theme}
                        <span style={{ marginLeft:'8px', fontSize:'12px', fontWeight:700,
                          color: t.pct >= 0 ? 'var(--red)' : 'var(--green)',
                          fontFamily:'var(--mono)' }}>
                          {t.pct >= 0 ? '+' : ''}{t.pct?.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ display:'flex', gap:'6px' }}>
                        <button onClick={() => onNavigate('テーマ別詳細', t.theme)}
                          style={{ padding:'5px 12px', borderRadius:'5px', fontSize:'11px',
                            background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                            color:'#aa77ff', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                          📊 テーマ詳細へ
                        </button>
                        {THEME_ARTICLE_MAP[t.theme] && (
                          <button onClick={() => onNavigate('コラム・解説', THEME_ARTICLE_MAP[t.theme])}
                            style={{ padding:'5px 12px', borderRadius:'5px', fontSize:'11px',
                              background:'rgba(74,158,255,0.07)', border:'1px solid rgba(74,158,255,0.2)',
                              color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                            📖 解説コラムへ
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => onNavigate('レポート')}
                  style={{ padding:'6px 14px', borderRadius:'6px', fontSize:'11px',
                    background:'rgba(255,140,66,0.1)', border:'1px solid rgba(255,140,66,0.3)',
                    color:'#ff8c42', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600 }}>
                  📰 最新週次レポートを読む →
                </button>
              </div>
            )
          })()}
        </div>
      )}

      {/* マーケット指標（ミニカード＋比較グラフ統合）*/}
      <SHead title="📈 マーケット指標・比較（1ヶ月）" />
      {loading ? (
        <div style={{ color:'var(--text3)', fontSize:'13px', padding:'12px 0' }}><Dots /></div>
      ) : (
        <MacroLineChart macro={macro} />
      )}

      <style>{`
        .col-quick-grid { grid-template-columns: 1fr 1fr 1fr; }
        .macro-mini-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width:640px) {
          .col-quick-grid { grid-template-columns: 1fr !important; }
          .macro-mini-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .top3-grid { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width:640px) {
          .top3-grid { grid-template-columns: 1fr !important; }
        }
        .hero-desc { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (max-width:900px) {
          .hero-desc { white-space:normal !important; overflow:visible !important; text-overflow:unset !important; }
        }
      `}</style>
    </div>
  )
}
