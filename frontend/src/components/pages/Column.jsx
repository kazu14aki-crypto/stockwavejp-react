import { useState, useEffect } from 'react'
import COLUMNS from './columnData'

const CATEGORIES = ['すべて', 'テーマ', '入門', '分析手法', '投資手法', '用語解説', '個別銘柄']

const CAT_COLORS = {
  '入門':       { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff',  border:'rgba(74,158,255,0.25)' },
  '半導体':     { bg:'rgba(255,69,96,0.1)',   color:'#ff4560',  border:'rgba(255,69,96,0.25)' },
  'AI・クラウド':{ bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '防衛・宇宙': { bg:'rgba(76,175,130,0.1)',  color:'#4caf82',  border:'rgba(76,175,130,0.25)' },
  'インバウンド':{ bg:'rgba(255,140,66,0.1)',  color:'#ff8c42',  border:'rgba(255,140,66,0.25)' },
  'EV・脱炭素': { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0',  border:'rgba(6,214,160,0.25)' },
  '分析手法':   { bg:'rgba(255,214,25,0.1)',  color:'#ffd619',  border:'rgba(255,214,25,0.25)' },
  '防衛・宇宙': { bg:'rgba(76,175,130,0.1)',  color:'#4caf82',  border:'rgba(76,175,130,0.25)' },
  '造船':       { bg:'rgba(91,156,246,0.1)',  color:'#5b9cf6',  border:'rgba(91,156,246,0.25)' },
  '親子上場':   { bg:'rgba(255,140,66,0.1)',  color:'#ff8c42',  border:'rgba(255,140,66,0.25)' },
  'バフェット銘柄': { bg:'rgba(255,214,25,0.1)', color:'#ffd619', border:'rgba(255,214,25,0.25)' },
  'フィジカルAI': { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '再生可能エネルギー': { bg:'rgba(6,214,160,0.12)', color:'#06d6a0', border:'rgba(6,214,160,0.3)' },
  'エッジAI':   { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  'パワー半導体': { bg:'rgba(255,69,96,0.1)',  color:'#ff4560',  border:'rgba(255,69,96,0.25)' },
  'NISA':       { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0',  border:'rgba(6,214,160,0.25)' },
  '光通信':     { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff',  border:'rgba(74,158,255,0.25)' },
  '国土強靭化': { bg:'rgba(76,175,130,0.1)',  color:'#4caf82',  border:'rgba(76,175,130,0.25)' },
  'イラク':     { bg:'rgba(180,120,80,0.1)',  color:'#b47850',  border:'rgba(180,120,80,0.25)' },
  'ゲーム・エンタメ':    { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '銀行・金融':         { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff', border:'rgba(74,158,255,0.25)' },
  '地方銀行':           { bg:'rgba(74,158,255,0.08)', color:'#4a9eff', border:'rgba(74,158,255,0.2)' },
  '保険':               { bg:'rgba(76,175,130,0.1)',  color:'#4caf82', border:'rgba(76,175,130,0.25)' },
  '不動産':             { bg:'rgba(255,140,66,0.1)',  color:'#ff8c42', border:'rgba(255,140,66,0.25)' },
  '医薬品・バイオ':     { bg:'rgba(255,69,96,0.1)',   color:'#ff4560', border:'rgba(255,69,96,0.25)' },
  'ヘルスケア・介護':   { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0', border:'rgba(6,214,160,0.25)' },
  '食品・飲料':         { bg:'rgba(255,214,25,0.1)',  color:'#ffd619', border:'rgba(255,214,25,0.25)' },
  '小売・EC':           { bg:'rgba(255,140,66,0.1)',  color:'#ff8c42', border:'rgba(255,140,66,0.25)' },
  '通信':               { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff', border:'rgba(74,158,255,0.25)' },
  '鉄鋼・素材':         { bg:'rgba(180,120,80,0.1)',  color:'#b47850', border:'rgba(180,120,80,0.25)' },
  '化学':               { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0', border:'rgba(6,214,160,0.25)' },
  '建設・インフラ':     { bg:'rgba(76,175,130,0.1)',  color:'#4caf82', border:'rgba(76,175,130,0.25)' },
  '輸送・物流':         { bg:'rgba(91,156,246,0.1)',  color:'#5b9cf6', border:'rgba(91,156,246,0.25)' },
  'フィンテック':       { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  'ロボット・自動化':   { bg:'rgba(255,69,96,0.1)',   color:'#ff4560', border:'rgba(255,69,96,0.25)' },
  'レアアース・資源':   { bg:'rgba(180,120,80,0.1)',  color:'#b47850', border:'rgba(180,120,80,0.25)' },
  'サイバーセキュリティ':{ bg:'rgba(74,158,255,0.1)', color:'#4a9eff', border:'rgba(74,158,255,0.25)' },
  'ドローン':           { bg:'rgba(6,214,160,0.1)',   color:'#06d6a0', border:'rgba(6,214,160,0.25)' },
  '観光・ホテル・レジャー':{ bg:'rgba(255,214,25,0.1)',color:'#ffd619',border:'rgba(255,214,25,0.25)' },
  '農業・フードテック': { bg:'rgba(76,175,130,0.1)',  color:'#4caf82', border:'rgba(76,175,130,0.25)' },
  '教育・HR・人材':     { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '宇宙・衛星':         { bg:'rgba(74,158,255,0.1)',  color:'#4a9eff', border:'rgba(74,158,255,0.25)' },
  '投資手法':           { bg:'rgba(255,140,66,0.1)',  color:'#ff8c42', border:'rgba(255,140,66,0.25)' },
  '用語解説':           { bg:'rgba(170,119,255,0.1)', color:'#aa77ff', border:'rgba(170,119,255,0.25)' },
  '個別銘柄':           { bg:'rgba(255,69,96,0.1)',   color:'#ff4560', border:'rgba(255,69,96,0.25)' },
}

// Markdown風テキストを簡易レンダリング
function RenderBody({ text }) {
  const lines = text.trim().split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }
    if (line.startsWith('H2: ')) {
      elements.push(
        <h2 key={i} style={{ fontSize:'16px', fontWeight:700, color:'#e8f0ff',
          margin:'24px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
          {line.slice(4)}
        </h2>
      )
    } else if (line.startsWith('H3: ')) {
      elements.push(
        <h3 key={i} style={{ fontSize:'14px', fontWeight:700, color:'var(--accent)', margin:'16px 0 6px' }}>
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontSize:'16px', fontWeight:700, color:'#e8f0ff',
          margin:'24px 0 10px', borderBottom:'1px solid var(--border)', paddingBottom:'6px' }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} style={{ fontSize:'13px', fontWeight:700, color:'var(--accent)', margin:'14px 0 6px' }}>
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin:'6px 0 12px', paddingLeft:'20px' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize:'13px', color:'#e8f0ff', lineHeight:1.8, marginBottom:'2px' }}>
              {item.includes('（') ? (
                <>
                  <span style={{ color:'var(--text)', fontWeight:600 }}>{item.split('：')[0]}</span>
                  {item.includes('：') ? <span style={{ color:'var(--text2)' }}>：{item.split('：').slice(1).join('：')}</span> : null}
                </>
              ) : item}
            </li>
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('| ')) {
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('| ')) {
        if (!lines[i].includes('---')) {
          rows.push(lines[i].trim().split('|').filter(c => c.trim()).map(c => c.trim()))
        }
        i++
      }
      if (rows.length > 0) {
        elements.push(
          <div key={`table-${i}`} style={{ overflowX:'auto', margin:'12px 0 20px' }}>
            <table style={{ borderCollapse:'collapse', fontSize:'12px', width:'100%', minWidth:'400px' }}>
              <thead>
                <tr>
                  {rows[0].map((h, j) => (
                    <th key={j} style={{ padding:'8px 12px', textAlign:'left', borderBottom:'1px solid var(--border)',
                      color:'var(--text3)', fontWeight:600, background:'var(--bg3)', whiteSpace:'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding:'8px 12px', color:'#e8f0ff', lineHeight:1.6 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    } else {
      elements.push(
        <p key={i} style={{ fontSize:'13px', color:'#e8f0ff', lineHeight:1.9, margin:'0 0 12px' }}>
          {line}
        </p>
      )
    }
    i++
  }
  return <div>{elements}</div>
}

export default function Column({ initialArticleId = null, onNavigate }) {
  const [activeCat,  setActiveCat]  = useState('すべて')
  const [activeCol,  setActiveCol]  = useState(initialArticleId)
  const [searchQuery, setSearchQuery] = useState('')
  const [page,        setPage]        = useState(1)
  const ITEMS_PER_PAGE = 20

  // テーマ一覧・テーマ詳細から特定記事IDで来たときに追従
  useEffect(() => {
    if (initialArticleId) {
      setActiveCol(initialArticleId)
      window.history.replaceState(null, '', `#column/${initialArticleId}`)
    }
  }, [initialArticleId])

  const openArticle = (id) => {
    setActiveCol(id)
    window.history.replaceState(null, '', `#column/${id}`)
    window.scrollTo(0, 0)
  }
  const closeArticle = () => {
    setActiveCol(null)
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo(0, 0)
  }

  const THEME_CATS = [
    '半導体製造装置','半導体検査装置','半導体材料','メモリ','パワー半導体','次世代半導体',
    '生成AI','AIデータセンター','フィジカルAI','AI半導体','AI人材','エッジAI',
    'EV・電気自動車','全固体電池','自動運転','ドローン','輸送・物流','造船',
    '再生可能エネルギー','太陽光発電','核融合発電','原子力発電','電力会社',
    'LNG','石油','蓄電池','資源（水素・ヘリウム・水）','IOWN','光通信',
    '通信','量子コンピューター','SaaS','ウェアラブル端末','仮想通貨','ネット銀行',
    '鉄鋼・素材','化学','建築資材','塗料',
    '医薬品・バイオ','ヘルスケア・介護','薬局・ドラッグストア',
    '銀行・金融','地方銀行','保険','フィンテック',
    '不動産','建設・インフラ','国土強靭化計画','下水道',
    '食品・飲料','農業・フードテック','小売・EC','観光・ホテル・レジャー',
    'インバウンド','リユース・中古品',
    '防衛・航空','宇宙・衛星','ロボット・自動化',
    'レアアース・資源','バフェット銘柄',
    'サイバーセキュリティ','警備','脱炭素・ESG',
    '教育・HR・人材','人材派遣','ゲーム・エンタメ',
  ]
  const _base = activeCat === 'すべて'
    ? COLUMNS
    : activeCat === 'テーマ'
    ? COLUMNS.filter(c => THEME_CATS.includes(c.category))
    : COLUMNS.filter(c => c.category === activeCat)

  const filtered = [..._base]
    .filter(col => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.trim().toLowerCase()
      return (
        col.title.toLowerCase().includes(q) ||
        col.summary.toLowerCase().includes(q) ||
        (col.keywords || []).some(k => k.toLowerCase().includes(q)) ||
        (col.themes || []).some(t => t.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pagedItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (activeCol) {
    const col = COLUMNS.find(c => c.id === activeCol)
    if (!col) { setActiveCol(null); return null }
    const cat = CAT_COLORS[col.category] || { bg:'rgba(74,158,255,0.1)', color:'#4a9eff', border:'rgba(74,158,255,0.25)' }
    return (
      <div style={{ padding:'20px 32px 60px', maxWidth:'760px', margin:'0 auto' }}>
        <button onClick={() => closeArticle()} style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:'transparent', border:'none', color:'var(--accent)',
          fontSize:'13px', cursor:'pointer', fontFamily:'var(--font)',
          padding:'0', marginBottom:'20px',
        }}>
          ← コラム一覧に戻る
        </button>
        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px',
          background:cat.bg, color:cat.color, border:`1px solid ${cat.border}`,
          display:'inline-block', marginBottom:'12px' }}>
          {col.category}
        </span>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'#e8f0ff', lineHeight:1.5, marginBottom:'8px' }}>
          {col.title}
        </h1>
        <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'24px' }}>
          {col.date}
        </div>
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px',
          padding:'6px 20px 20px', marginBottom:'28px' }}>
          <RenderBody text={col.body} />
        </div>
        <div style={{ background:'rgba(255,140,66,0.07)', border:'1px solid rgba(255,140,66,0.2)',
          borderRadius:'8px', padding:'14px 18px', fontSize:'12px', color:'#e8f0ff', lineHeight:1.8 }}>
          ⚠️ 本コラムは情報提供を目的としており、特定の銘柄・投資方法を推奨するものではありません。
          実際の投資判断はご自身の責任において行ってください。
        </div>

        {/* ⑤ 関連テーマセクション（col.themesフィールドベース） */}
        {col.themes && col.themes.length > 0 && onNavigate && (
          <div style={{ marginTop:'24px', padding:'16px 20px',
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'10px' }}>
            <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text3)',
              letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'10px' }}>
              🔗 関連テーマ
            </div>
            <p style={{ fontSize:'12px', color:'var(--text2)', lineHeight:1.8, marginBottom:'12px' }}>
              {'関連テーマ: ' + col.themes.join('、')}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {col.themes.map(theme => (
                <button key={theme}
                  onClick={() => onNavigate('テーマ別詳細', theme)}
                  style={{ padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:600,
                    background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                    color:'#aa77ff', cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(170,119,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(170,119,255,0.1)'}
                >
                  📊 {theme}テーマのデータを見る
                </button>
              ))}
            </div>
          </div>
        )}

        {/* テーマデータへのリンクボタン */}
        {(() => {
          const CAT_TO_THEME = {
            '半導体製造装置':'半導体製造装置','半導体検査装置':'半導体検査装置',
            '半導体材料':'半導体材料','メモリ':'メモリ','パワー半導体':'パワー半導体',
            '次世代半導体':'次世代半導体','生成AI':'生成AI','AIデータセンター':'AIデータセンター',
            'フィジカルAI':'フィジカルAI','AI半導体':'AI半導体','AI人材':'AI人材','エッジAI':'エッジAI',
            'EV・電気自動車':'EV・電気自動車','全固体電池':'全固体電池','自動運転':'自動運転',
            'ドローン':'ドローン','輸送・物流':'輸送・物流','造船':'造船',
            '再生可能エネルギー':'再生可能エネルギー','太陽光発電':'太陽光発電',
            '核融合発電':'核融合発電','原子力発電':'原子力発電','電力会社':'電力会社',
            'LNG':'LNG','石油':'石油','蓄電池':'蓄電池',
            '資源（水素・ヘリウム・水）':'資源（水素・ヘリウム・水）',
            'IOWN':'IOWN','光通信':'光通信','通信':'通信',
            '量子コンピューター':'量子コンピューター','SaaS':'SaaS',
            'ウェアラブル端末':'ウェアラブル端末','仮想通貨':'仮想通貨','ネット銀行':'ネット銀行',
            '鉄鋼・素材':'鉄鋼・素材','化学':'化学','建築資材':'建築資材','塗料':'塗料',
            '医薬品・バイオ':'医薬品・バイオ','ヘルスケア・介護':'ヘルスケア・介護',
            '薬局・ドラッグストア':'薬局・ドラッグストア',
            '銀行・金融':'銀行・金融','地方銀行':'地方銀行','保険':'保険','フィンテック':'フィンテック',
            '不動産':'不動産','建設・インフラ':'建設・インフラ',
            '国土強靭化計画':'国土強靭化計画','下水道':'下水道',
            '食品・飲料':'食品・飲料','農業・フードテック':'農業・フードテック',
            '小売・EC':'小売・EC','観光・ホテル・レジャー':'観光・ホテル・レジャー',
            'インバウンド':'インバウンド','リユース・中古品':'リユース・中古品',
            '防衛・航空':'防衛・航空','宇宙・衛星':'宇宙・衛星','ロボット・自動化':'ロボット・自動化',
            'レアアース・資源':'レアアース・資源','バフェット銘柄':'バフェット銘柄',
            'サイバーセキュリティ':'サイバーセキュリティ','警備':'警備','脱炭素・ESG':'脱炭素・ESG',
            '教育・HR・人材':'教育・HR・人材','人材派遣':'人材派遣','ゲーム・エンタメ':'ゲーム・エンタメ',
          }
          const themeName = CAT_TO_THEME[col.category]
          if (!themeName || !onNavigate) return null
          return (
            <div style={{ marginTop:'20px', display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <button
                onClick={() => onNavigate('テーマ別詳細', themeName)}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  background:'rgba(74,158,255,0.1)', border:'1px solid rgba(74,158,255,0.3)',
                  borderRadius:'8px', color:'var(--accent)', cursor:'pointer',
                  fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
                  padding:'10px 20px', transition:'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(74,158,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(74,158,255,0.1)' }}
              >
                📊 {themeName}テーマのデータを見る
              </button>
              <button
                onClick={() => onNavigate('テーマ一覧')}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  background:'rgba(170,119,255,0.1)', border:'1px solid rgba(170,119,255,0.3)',
                  borderRadius:'8px', color:'#aa77ff', cursor:'pointer',
                  fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
                  padding:'10px 20px', transition:'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(170,119,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(170,119,255,0.1)' }}
              >
                📈 全テーマ一覧を見る
              </button>
            </div>
          )
        })()}

        {/* 下部の戻るボタン */}
        <div style={{ marginTop:'32px', paddingTop:'24px', borderTop:'1px solid var(--border)', textAlign:'center' }}>
          <button onClick={() => closeArticle()} style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'8px', color:'var(--text2)', cursor:'pointer',
            fontFamily:'var(--font)', fontSize:'13px', fontWeight:600,
            padding:'10px 28px', transition:'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text2)' }}
          >
            ← コラム一覧に戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'20px 32px 60px' }}>
      <h1 style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.02em', color:'#e8f0ff', marginBottom:'4px' }}>
        コラム・解説
      </h1>
      <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'24px' }}>
        テーマ株投資の基礎から各テーマの詳細解説まで、投資判断に役立つ情報を提供します。
      </p>

      {/* キーワード・テーマ検索 */}
      <div style={{ position:'relative', marginBottom:'12px', maxWidth:'400px' }}>
        <input
          type="text"
          placeholder="キーワード・テーマ名で検索..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
          style={{
            width:'100%', padding:'9px 36px 9px 14px',
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'8px', color:'var(--text)', fontSize:'13px',
            fontFamily:'var(--font)', outline:'none', boxSizing:'border-box',
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{
            position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
            fontSize:'14px', padding:'2px 4px',
          }}>✕</button>
        )}
      </div>

      {/* カテゴリフィルタ */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'24px' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setActiveCat(cat); setPage(1) }} style={{
            padding:'5px 14px', borderRadius:'20px', fontSize:'12px', cursor:'pointer',
            fontFamily:'var(--font)', transition:'all 0.15s',
            border: activeCat === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
            background: activeCat === cat ? 'rgba(74,158,255,0.12)' : 'transparent',
            color: activeCat === cat ? 'var(--accent)' : 'var(--text3)',
            fontWeight: activeCat === cat ? 600 : 400,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ページ情報 */}
      {filtered.length > 0 && (
        <div style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'12px' }}>
          {filtered.length}件中 {(page-1)*ITEMS_PER_PAGE+1}〜{Math.min(page*ITEMS_PER_PAGE, filtered.length)}件表示
        </div>
      )}

      {/* コラム一覧 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'14px' }} className="col-grid">
        {pagedItems.filter(Boolean).map((col, i) => {
          const cat = CAT_COLORS[col.category] || { bg:'rgba(74,158,255,0.1)', color:'#4a9eff', border:'rgba(74,158,255,0.25)' }
          return (
            <div key={col.id} onClick={() => openArticle(col.id)} style={{
              background:'var(--bg2)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'18px 20px', cursor:'pointer',
              animation:`fadeUp 0.3s ease ${i * 0.05}s both`,
              transition:'border-color 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(74,158,255,0.3)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)' }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <span style={{ fontSize:'20px' }}>{col.icon}</span>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'12px',
                  background:cat.bg, color:cat.color, border:`1px solid ${cat.border}` }}>
                  {col.category}
                </span>
                <span style={{ fontSize:'10px', color:'var(--text3)', marginLeft:'auto', fontFamily:'var(--mono)' }}>
                  {col.date}
                </span>
              </div>
              <h2 style={{ fontSize:'13px', fontWeight:700, color:'#e8f0ff', lineHeight:1.5, marginBottom:'8px' }}>
                {col.title}
              </h2>
              <p style={{ fontSize:'12px', color:'var(--text3)', lineHeight:1.7, margin:0,
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {col.summary}
              </p>
              <div style={{ marginTop:'12px', fontSize:'11px', color:'var(--accent)', fontWeight:600 }}>
                続きを読む →
              </div>
            </div>
          )
        })}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
          gap:'8px', marginTop:'28px', flexWrap:'wrap' }}>
          <button onClick={() => { setPage(p => Math.max(1, p-1)); window.scrollTo(0,0) }}
            disabled={page === 1}
            style={{ padding:'6px 14px', borderRadius:'6px', border:'1px solid var(--border)',
              background: page === 1 ? 'transparent' : 'var(--bg2)',
              color: page === 1 ? 'var(--text3)' : 'var(--text)',
              cursor: page === 1 ? 'default' : 'pointer',
              fontFamily:'var(--font)', fontSize:'12px' }}>
            ← 前へ
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setPage(p); window.scrollTo(0,0) }}
              style={{ padding:'6px 12px', borderRadius:'6px', fontSize:'12px',
                fontFamily:'var(--font)', cursor:'pointer',
                border: p === page ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: p === page ? 'rgba(74,158,255,0.15)' : 'var(--bg2)',
                color: p === page ? 'var(--accent)' : 'var(--text)',
                fontWeight: p === page ? 700 : 400 }}>
              {p}
            </button>
          ))}
          <button onClick={() => { setPage(p => Math.min(totalPages, p+1)); window.scrollTo(0,0) }}
            disabled={page === totalPages}
            style={{ padding:'6px 14px', borderRadius:'6px', border:'1px solid var(--border)',
              background: page === totalPages ? 'transparent' : 'var(--bg2)',
              color: page === totalPages ? 'var(--text3)' : 'var(--text)',
              cursor: page === totalPages ? 'default' : 'pointer',
              fontFamily:'var(--font)', fontSize:'12px' }}>
            次へ →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width:640px) { .col-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; } }
        @media (max-width:640px) { .col-grid > div { padding: 12px 12px !important; } }
      `}</style>
    </div>
  )
}
