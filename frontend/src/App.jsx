import { useState, useEffect } from 'react'
import { useStatus }   from './hooks/useMarketData'
import { AuthProvider } from './hooks/useAuth.jsx'
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
import WeeklyReport from './components/pages/WeeklyReport'

const PAGES = [
  { icon:'🏠', label:'ホーム',                   component:TopPage       },
  { icon:'📊', label:'テーマ一覧',                component:ThemeList     },
  { icon:'🔍', label:'テーマ別詳細',              component:ThemeDetail   },
  { icon:'📋', label:'市場別詳細',           component:MarketRank    },
  { icon:'🔥', label:'ヒートマップ',              component:Heatmap       },
  { icon:'🎨', label:'カスタムテーマ',             component:CustomTheme   },
]
const PAGES_OTHER = [
  { icon:'🏢', label:'当サイトについて',    component:SiteInfo      },
  { icon:'📣', label:'お知らせ',            component:News          },
  { icon:'📖', label:'使い方',              component:HowTo         },
  { icon:'📰', label:'週次レポート',          component:WeeklyReport  },
  { icon:'📝', label:'コラム・解説',        component:Column        },
  { icon:'⚙️', label:'設定',               component:Settings      },
  { icon:'⚖️', label:'免責事項',           component:Disclaimer    },
  { icon:'🔒', label:'プライバシーポリシー', component:PrivacyPolicy },
  { icon:'📋', label:'利用規約',             component:TermsOfService},
]

// お問い合わせGoogleフォームURL（実際のURLに変更してください）
const CONTACT_FORM_URL = 'https://forms.gle/XjNypTdmZt265Kib6'
const ALL_PAGES     = [...PAGES, ...PAGES_OTHER]
const COLOR_THEME_KEY = 'swjp_color_theme'

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
  const [isMobile,    setIsMobile]    = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)
  const [colorTheme,  setColorTheme]  = useState(
    () => localStorage.getItem(COLOR_THEME_KEY) || 'dark'
  )
  const status = useStatus()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    localStorage.setItem(COLOR_THEME_KEY, colorTheme)
  }, [colorTheme])

  useEffect(() => {
    const check = () => {
      if (viewMode === 'mobile') { setIsMobile(true); return }
      if (viewMode === 'pc')     { setIsMobile(false); return }
      setIsMobile(window.innerWidth <= 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [viewMode])

  const currentPageObj = ALL_PAGES.find(p => p.label === currentPage)
  const PageComponent  = currentPageObj?.component
  const handlePageChange = (label, articleId = null) => {
    setCurrentPage(label)
    setSidebarOpen(false)
    setTargetArticleId(articleId)
    // テーマ別詳細の場合はテーマ名を保存
    if (label === 'テーマ別詳細') {
      setTargetTheme(articleId || null)
    } else {
      setTargetTheme(null)
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
    if (currentPage === '設定') return { viewMode, onViewModeChange:setViewMode, colorTheme, onColorThemeChange:setColorTheme }
    if (currentPage === 'ホーム') return { onNavigate: handlePageChange }
    if (currentPage === 'コラム・解説') return { initialArticleId: targetArticleId, onNavigate: handlePageChange }
    if (currentPage === 'テーマ一覧') return { onNavigate: handlePageChange }
    if (currentPage === 'テーマ別詳細') return { onNavigate: handlePageChange, initialTheme: targetTheme }
    if (currentPage === 'ヒートマップ') return { onNavigate: handlePageChange }
    if (currentPage === '週次レポート') return { onNavigate: handlePageChange }
    if (currentPage === '市場別詳細') return { onNavigate: handlePageChange }
    return {}
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
        pages={PAGES} pagesOther={PAGES_OTHER}
        currentPage={currentPage} onPageChange={handlePageChange}
        isOpen={sidebarOpen} isMobile={isMobile}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
        contactUrl={CONTACT_FORM_URL}
      />

      <main style={{
        marginLeft: isMobile ? '0' : 'var(--sidebar)',
        paddingTop: 'var(--header)',
        minHeight: '100vh',
        transition: 'margin-left 0.25s',
        background: 'var(--bg)',
      }}>
        {PageComponent ? (
          <PageComponent {...pageProps} />
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
            height:'calc(100vh - var(--header))', flexDirection:'column', gap:'16px', color:'var(--text3)' }}>
            <div style={{ fontSize:'48px' }}>{currentPageObj?.icon}</div>
            <div style={{ fontSize:'18px', fontWeight:600, color:'var(--text2)' }}>{currentPage}</div>
            <div style={{ fontSize:'13px' }}>このページは準備中です</div>
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

// 旧バージョンのLocalStorageキャッシュを自動削除
;(function cleanOldCache() {
  const CURRENT = 'swjp_v3_'
  const OLD_PREFIXES = ['swjp_', 'swjp_v1_', 'swjp_v2_']
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(k => {
      const isOld = OLD_PREFIXES.some(p => k.startsWith(p))
      const isCurrent = k.startsWith(CURRENT)
      if (isOld && !isCurrent) {
        localStorage.removeItem(k)
      }
    })
  } catch {}
})()

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
