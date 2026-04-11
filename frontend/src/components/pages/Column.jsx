import { useState, useEffect } from 'react'
import COLUMNS from './columnData'

const CATEGORIES = ['すべて', 'テーマ', '入門', '分析手法', '投資手法', '用語解説']

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
    '半導体','AI・クラウド','防衛・宇宙','インバウンド','EV・脱炭素','造船',
    '再生可能エネルギー','ゲーム・エンタメ','銀行・金融','地方銀行','保険','不動産',
    '医薬品・バイオ','ヘルスケア・介護','食品・飲料','小売・EC','通信',
    '鉄鋼・素材','化学','建設・インフラ','輸送・物流','フィンテック',
    'ロボット・自動化','レアアース・資源','サイバーセキュリティ','ドローン',
    '観光・ホテル・レジャー','農業・フードテック','教育・HR・人材','宇宙・衛星',
    '親子上場','バフェット銘柄','フィジカルAI','パワー半導体','NISA','光通信','国土強靭化','イラク',
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

  if (activeCol) {
    const col = COLUMNS.find(c => c.id === activeCol)
    if (!col) { setActiveCol(null); return null }
    const cat = CAT_COLORS[col.category] || CAT_COLORS['入門']
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

        {/* テーマデータへのリンクボタン */}
        {(() => {
          const CAT_TO_THEME = {
            '半導体':'半導体','AI・クラウド':'AI・クラウド','防衛・宇宙':'防衛・宇宙',
            'インバウンド':'インバウンド','EV・脱炭素':'EV・電気自動車','造船':'造船',
            'ゲーム・エンタメ':'ゲーム・エンタメ','銀行・金融':'銀行・金融',
            '地方銀行':'地方銀行','保険':'保険','不動産':'不動産',
            '医薬品・バイオ':'医薬品・バイオ','ヘルスケア・介護':'ヘルスケア・介護',
            '食品・飲料':'食品・飲料','小売・EC':'小売・EC','通信':'通信',
            '鉄鋼・素材':'鉄鋼・素材','化学':'化学','建設・インフラ':'建設・インフラ',
            '輸送・物流':'輸送・物流','フィンテック':'フィンテック',
            'ロボット・自動化':'ロボット・自動化','レアアース・資源':'レアアース・資源',
            'サイバーセキュリティ':'サイバーセキュリティ','ドローン':'ドローン',
            '観光・ホテル・レジャー':'観光・ホテル・レジャー',
            '農業・フードテック':'農業・フードテック','教育・HR・人材':'教育・HR・人材',
            '宇宙・衛星':'宇宙・衛星','パワー半導体':'パワー半導体',
            '光通信':'光通信','国土強靭化':'国土強靭化',
            '再生可能エネルギー':'再生可能エネルギー',
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
          onChange={e => setSearchQuery(e.target.value)}
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
          <button key={cat} onClick={() => setActiveCat(cat)} style={{
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

      {/* コラム一覧 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }} className="col-grid">
        {filtered.filter(Boolean).map((col, i) => {
          const cat = CAT_COLORS[col.category] || CAT_COLORS['入門']
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

      <style>{`
        @media (max-width:640px) { .col-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
