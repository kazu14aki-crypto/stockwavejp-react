import { useState, useEffect } from 'react'
import { useStatus }   from './hooks/useMarketData'
import { AuthProvider }        from './hooks/useAuth.jsx'
import { SubscriptionProvider } from './hooks/useSubscription.jsx'
import Header      from './components/Header'
import Sidebar     from './components/Sidebar'
import TopPage     from './components/pages/TopPage'
import ThemeList   from './components/pages/ThemeList'
import Heatmap     from './components/pages/Heatmap'
import MarketRank  from './components/pages/MarketRank'
import ThemeDetail from './components/pages/ThemeDetail'
import CustomTheme from './components/pages/CustomTheme'
import News        from './components/pages/News'
import HowTo       from './components/pages/HowTo'
import Settings    from './components/pages/Settings'
import Disclaimer  from './components/pages/Disclaimer'
import Column      from './components/pages/Column'
import PrivacyPolicy from './components/pages/PrivacyPolicy'
import TermsOfService from './components/pages/TermsOfService'
import SiteInfo    from './components/pages/SiteInfo'
import ReportHub from './components/pages/ReportHub'
import InstitutionalHoldings from './components/pages/InstitutionalHoldings'
import StockSearch  from './components/pages/StockSearch'
import LegalNotice  from './components/pages/LegalNotice'
import Plan         from './components/pages/Plan'
import DevEdge      from './components/pages/DevEdge'
import StockDetail  from './components/pages/StockDetail'
import ErrorBoundary from './components/ErrorBoundary'
import RelatedPageNav, { hasRelatedPageNav } from './components/RelatedPageNav'
import { useSubscription } from './hooks/useSubscription.jsx'

const PAGES = [
  { icon:'🏠', label:'ホーム',            component:TopPage              },
  { icon:'📊', label:'テーマ一覧',         component:ThemeList            },
  { icon:'🔥', label:'テーマヒートマップ',   component:Heatmap              },
  { icon:'🔍', label:'テーマ別詳細',       component:ThemeDetail          },
  { icon:'🔎', label:'銘柄検索',           component:StockSearch          },
  { icon:'🎨', label:'カスタムテーマ',      component:CustomTheme          },
  { icon:'📰', label:'レポート',            component:ReportHub            },
  { icon:'📝', label:'コラム・解説',       component:Column               },
]
const PAGES_OTHER = [
  { icon:'🏢', label:'当サイトについて',  component:SiteInfo   },
  { icon:'📣', label:'お知らせ',          component:News       },
  { icon:'📖', label:'使い方',            component:HowTo      },
  { icon:'💰', label:'プラン・料金',      component:Plan       },
  { icon:'⚙️', label:'設定',             component:Settings   },
]

const PAGES_FOOTER = [
  { icon:'⚖️', label:'免責事項',               component:Disclaimer    },
  { icon:'🔒', label:'プライバシーポリシー',     component:PrivacyPolicy },
  { icon:'📋', label:'利用規約',                component:TermsOfService},
  { icon:'🛒', label:'特定商取引法に基づく表示', component:LegalNotice   },
]

// お問い合わせGoogleフォームURL（実際のURLに変更してください）
const CONTACT_FORM_URL = 'https://forms.gle/XjNypTdmZt265Kib6'
const DEV_PAGE = { icon:'🎯', label:'Dev Edge', component:DevEdge }
const MARKET_DEV_PAGE = { icon:'📋', label:'市場別詳細', component:MarketRank }
const INSTITUTIONAL_DEV_PAGE = { icon:'🏦', label:'機関投資家保有', component:InstitutionalHoldings }
const DEV_PAGES = [DEV_PAGE, MARKET_DEV_PAGE, INSTITUTIONAL_DEV_PAGE]
const DEV_ONLY_LABELS = new Set(DEV_PAGES.map(p => p.label))
const STOCK_PAGE = { icon:'📈', label:'銘柄詳細', component:StockDetail }  // サイドバー非表示（クリック遷移専用）
const STATIC_PAGES = [STOCK_PAGE, ...PAGES_OTHER, ...PAGES_FOOTER]
const COLOR_THEME_KEY = 'swjp_color_theme'
const COLOR_DIR_KEY   = 'sw_color_dir'

function AppInner() {
  const [currentPage,   setCurrentPage]   = useState('ホーム')
  const [targetArticleId, setTargetArticleId] = useState(null)
  const [targetTheme,     setTargetTheme]     = useState(null)

  // URLハッシュからページ・記事IDを初期化
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash.startsWith('column/')) {
      const articleId = hash.replace('column/', '')
      setCurrentPage('コラム・解説')
      setTargetArticleId(articleId)
    } else if (hash === 'terms') {
      setCurrentPage('利用規約')
    } else if (hash === 'privacy') {
      setCurrentPage('プライバシーポリシー')
    }
    // ハッシュ変化を監視
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '')
      if (h.startsWith('column/')) {
        const aid = h.replace('column/', '')
        setCurrentPage('コラム・解説')
        setTargetArticleId(aid)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode,    setViewMode]    = useState('auto')
  const [isMobile,    setIsMobile]    = useState(() => typeof window !== 'undefined' && window.innerWidth <= 1280)
  const [colorDir,    setColorDir]    = useState(
    () => localStorage.getItem(COLOR_DIR_KEY) || 'jp'
  )
  const [colorTheme,  setColorTheme]  = useState(
    () => localStorage.getItem(COLOR_THEME_KEY) || 'dark'
  )
  const status = useStatus()


  // ④ 上昇下落カラー方向のuseEffect
  useEffect(() => {
    localStorage.setItem(COLOR_DIR_KEY, colorDir)
    const root = document.documentElement
    if (colorDir === 'us') {
      root.style.setProperty('--red',   '#1a9a50')  // 米国式: 緑=上昇
      root.style.setProperty('--green', '#e63030')  // 米国式: 赤=下落
    } else {
      root.style.setProperty('--red',   '')          // 日本式: デフォルトに戻す
      root.style.setProperty('--green', '')
    }
  }, [colorDir])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    localStorage.setItem(COLOR_THEME_KEY, colorTheme)
    // Supabaseへのテーマ保存（ログイン時）
  }, [colorTheme])

  useEffect(() => {
    const check = () => {
      if (viewMode === 'mobile') { setIsMobile(true); return }
      if (viewMode === 'pc')     { setIsMobile(false); return }
      // iPad Pro横向き(1366px)まで対応するため1280px以下をタブレット扱い
      setIsMobile(window.innerWidth <= 1280)
    }
    check()
    window.addEventListener('resize', check)
    const onOrientChange = () => setTimeout(check, 150)
    window.addEventListener('orientationchange', onOrientChange)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', onOrientChange)
    }
  }, [viewMode])

  const { isDev, loading: subscriptionLoading } = useSubscription()
  const visibleMainPages = isDev ? [...PAGES, ...DEV_PAGES] : PAGES
  const availablePages = [...visibleMainPages, ...STATIC_PAGES]
  const currentPageObj = availablePages.find(p => p.label === currentPage)
  const PageComponent  = currentPageObj?.component
  const [targetStock, setTargetStock] = useState(null)

  useEffect(() => {
    if (!subscriptionLoading && DEV_ONLY_LABELS.has(currentPage) && !isDev) {
      setCurrentPage('ホーム')
      setSidebarOpen(false)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [currentPage, isDev, subscriptionLoading])

  const handlePageChange = (label, articleId = null) => {
    if (DEV_ONLY_LABELS.has(label) && !isDev) {
      label = 'ホーム'
      articleId = null
    }
    setCurrentPage(label)
    setSidebarOpen(false)
    setTargetArticleId(articleId)
    // ⑥ ページ遷移時に必ず最上部にスクロール
    window.scrollTo({ top: 0, behavior: 'instant' })
    // テーマ別詳細の場合はテーマ名を保存
    if (label === 'テーマ別詳細') {
      setTargetTheme(articleId || null)
    } else {
      setTargetTheme(null)
    }
    // 銘柄詳細の場合はティッカーを保存
    if (label === '銘柄詳細') {
      setTargetStock(articleId || null)
    }
    // URLハッシュを更新（SEO・直接リンク対応）
    if (label === 'コラム・解説' && articleId) {
      window.history.replaceState(null, '', `#column/${articleId}`)
    } else if (label === '利用規約') {
      window.history.replaceState(null, '', '#terms')
    } else if (label === 'プライバシーポリシー') {
      window.history.replaceState(null, '', '#privacy')
    } else {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  const handleLogoClick  = () => { setCurrentPage('ホーム'); setSidebarOpen(false) }

  const pageProps = (() => {
    if (currentPage === '設定') return { viewMode, onViewModeChange:setViewMode, colorTheme, onColorThemeChange:setColorTheme, colorDir, onColorDirChange:setColorDir, isMobile, onNavigate: handlePageChange }
    if (currentPage === 'ホーム') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === 'コラム・解説') return { initialArticleId: targetArticleId, onNavigate: handlePageChange, isMobile }
    if (currentPage === 'テーマ一覧') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === 'テーマ別詳細') return { onNavigate: handlePageChange, initialTheme: targetTheme, isMobile }
    if (currentPage === 'テーマヒートマップ') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === 'レポート') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === '市場別詳細') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === 'Dev Edge') return { onNavigate: handlePageChange, isMobile }
    if (currentPage === '銘柄詳細') return { ticker: targetStock, onNavigate: handlePageChange, isMobile }
    if (currentPage === '機関投資家保有') return { onNavigate: handlePageChange, isMobile }
    return { isMobile }
  })()

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header
        status={status}
        onMenuClick={() => setSidebarOpen(o => !o)}
        sidebarOpen={sidebarOpen}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onLogoClick={handleLogoClick}
      />

      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:800,
        }} />
      )}

      <Sidebar
        pages={visibleMainPages} pagesOther={PAGES_OTHER}
        currentPage={currentPage} onPageChange={handlePageChange}
        isOpen={sidebarOpen} isMobile={isMobile}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        contactUrl={CONTACT_FORM_URL}
      />

      <main className={hasRelatedPageNav(currentPage) ? 'has-related-page-nav' : ''} style={{
        marginLeft: isMobile ? '0' : 'var(--sidebar)',
        paddingTop: 'var(--header)',
        minHeight: '100vh',
        transition: 'margin-left 0.25s',
        background: 'var(--bg)',
      }}>
        <RelatedPageNav currentPage={currentPage} onNavigate={handlePageChange} />
        {PageComponent ? (
          <ErrorBoundary resetKey={currentPage} pageName={currentPage}>
            <PageComponent {...pageProps} />
          </ErrorBoundary>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            height:'calc(100vh - var(--header))', flexDirection:'column', gap:'16px', color:'var(--text3)' }}>
            <div style={{ fontSize:'48px' }}>🔒</div>
            <div style={{ fontSize:'18px', fontWeight:600, color:'var(--text2)' }}>このページは利用できません</div>
            <button onClick={() => handlePageChange('ホーム')} style={{ padding:'8px 14px', borderRadius:'8px', border:'1px solid var(--border)', background:'var(--bg2)', color:'var(--accent)', cursor:'pointer', fontFamily:'var(--font)' }}>ホームへ戻る</button>
          </div>
        )}

        <footer style={{ borderTop:'1px solid var(--border)', padding:'16px 24px',
          textAlign:'center', color:'var(--text3)', fontSize:'11px' }}>
          <div style={{ marginBottom:'8px', display:'flex', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
            <button onClick={() => handlePageChange('免責事項')} style={{
              background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
              fontSize:'11px', fontFamily:'var(--font)', padding:0,
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>免責事項</button>
            <button onClick={() => handlePageChange('プライバシーポリシー')} style={{
              background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
              fontSize:'11px', fontFamily:'var(--font)', padding:0,
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>プライバシーポリシー</button>
            <button onClick={() => handlePageChange('利用規約')} style={{
              background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
              fontSize:'11px', fontFamily:'var(--font)', padding:0,
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>利用規約</button>
            <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer" style={{
              color:'var(--text3)', fontSize:'11px', fontFamily:'var(--font)',
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>お問い合わせ</a>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2px 0', alignItems:'center' }}>
            <span style={{ color:'#e63030', fontWeight:700 }}>Stock</span>
            <span style={{ fontWeight:700, color:'var(--text2)' }}>Wave</span>
            <span style={{ color:'#e63030', fontWeight:700, fontSize:'10px' }}>JP</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;—&nbsp;stockwavejp.com</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;—&nbsp;投資助言ではありません</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;—&nbsp;© 2026</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

// 旧バージョンの市場データキャッシュだけを一度削除する。
// 設定・お気に入り・初回ガイドなど、現在利用中のswjp_*キーは削除しない。
;(function cleanOldMarketCacheOnce() {
  const MIGRATION_KEY = 'swjp_v3_cache_migration_done'
  try {
    if (localStorage.getItem(MIGRATION_KEY) === '1') return
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('swjp_v1_') || k.startsWith('swjp_v2_') || k.startsWith('swjp_cache_')) {
        localStorage.removeItem(k)
      }
    })
    localStorage.setItem(MIGRATION_KEY, '1')
  } catch {}
})()

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
      <AppInner />
    </SubscriptionProvider>
    </AuthProvider>
  )
}
