const PAGE_LINKS = {
  'ホーム': [
    ['📊','テーマ一覧','強いテーマを探す'],
    ['🔥','テーマヒートマップ','資金流入を俯瞰'],
    ['🔎','銘柄検索','会社名・コードから探す'],
    ['📰','レポート','継続性を確認'],
  ],
  'テーマ一覧': [
    ['🔥','テーマヒートマップ','出来高と騰落率を確認'],
    ['🔍','テーマ別詳細','構成銘柄を比較'],
    ['🔎','銘柄検索','気になる銘柄を検索'],
    ['📰','レポート','前回順位を検証'],
  ],
  'テーマヒートマップ': [
    ['📊','テーマ一覧','順位で比較'],
    ['🔍','テーマ別詳細','構成銘柄を見る'],
    ['🔎','銘柄検索','銘柄を直接調べる'],
  ],
  'テーマ別詳細': [
    ['📊','テーマ一覧','別テーマと比較'],
    ['🔥','テーマヒートマップ','資金流入を確認'],
    ['🔎','銘柄検索','構成銘柄を深掘り'],
    ['📰','レポート','継続性を確認'],
  ],
  '銘柄検索': [
    ['📊','テーマ一覧','テーマから候補を探す'],
    ['🔍','テーマ別詳細','所属テーマを比較'],
    ['🎨','カスタムテーマ','ウォッチリストへ整理'],
    ['📰','レポート','市場の流れへ戻る'],
  ],
  '銘柄詳細': [
    ['🔎','銘柄検索','別の銘柄を調べる'],
    ['📊','テーマ一覧','関連テーマを探す'],
    ['🎨','カスタムテーマ','比較リストを作る'],
  ],
  'カスタムテーマ': [
    ['🔎','銘柄検索','銘柄を追加'],
    ['📊','テーマ一覧','公式テーマと比較'],
    ['📰','レポート','市場環境を確認'],
  ],
  'レポート': [
    ['📊','テーマ一覧','現在順位を確認'],
    ['🔥','テーマヒートマップ','資金流入を見る'],
    ['🔎','銘柄検索','掲載銘柄を調べる'],
  ],
  'コラム・解説': [
    ['📊','テーマ一覧','データで確認'],
    ['🔍','テーマ別詳細','構成銘柄を見る'],
    ['🔎','銘柄検索','企業を調べる'],
  ],
  '市場別詳細': [
    ['📊','テーマ一覧','テーマ分析へ'],
    ['🔎','銘柄検索','銘柄を深掘り'],
    ['🎯','Dev Edge','検証画面へ'],
  ],
}

export function hasRelatedPageNav(currentPage) {
  return Boolean(PAGE_LINKS[currentPage]?.length)
}

export default function RelatedPageNav({ currentPage, onNavigate }) {
  const links = PAGE_LINKS[currentPage]
  if (!links?.length) return null
  return (
    <div className="related-page-nav" style={{
      position:'sticky', top:'var(--header)', zIndex:180,
      minHeight:'var(--related-nav-height)', boxSizing:'border-box',
      padding:'8px 12px', borderBottom:'1px solid var(--border)',
      background:'color-mix(in srgb, var(--bg2) 96%, transparent)',
      backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
      boxShadow:'0 4px 12px rgba(0,0,0,0.12)',
    }}>
      <div className="related-page-nav-scroll" style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', alignItems:'center', gap:'7px', overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'thin' }}>
        <span className="related-page-nav-title" style={{ fontSize:'10px', color:'var(--text3)', fontWeight:700, whiteSpace:'nowrap', marginRight:'2px' }}>関連ページ</span>
        {links.map(([icon,label,desc]) => (
          <button key={label} onClick={() => onNavigate?.(label)} title={desc} style={{
            display:'flex', alignItems:'center', gap:'5px', padding:'6px 10px', minHeight:'34px',
            border:'1px solid var(--border)', borderRadius:'8px', background:'var(--bg3)',
            color:'var(--text2)', cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
          }}>
            <span style={{ fontSize:'12px' }}>{icon}</span>
            <span style={{ fontSize:'11px', fontWeight:700, whiteSpace:'nowrap' }}>{label}</span>
            <span className="related-page-nav-desc" style={{ fontSize:'9px', color:'var(--text3)', whiteSpace:'nowrap' }}>{desc}</span>
          </button>
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .related-page-nav { padding:6px 8px !important; }
          .related-page-nav-title { display:none !important; }
          .related-page-nav-desc { display:none !important; }
          .related-page-nav-scroll { gap:5px !important; }
          .related-page-nav button { min-height:36px !important; padding:6px 10px !important; }
        }
      `}</style>
    </div>
  )
}
