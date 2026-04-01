import { useState, useEffect } from 'react'
import { useStatus }   from './hooks/useMarketData'
import { AuthProvider } from './hooks/useAuth.jsx'
import Header      from './components/Header'
import Sidebar     from './components/Sidebar'
import TopPage     from './components/pages/TopPage'
import ThemeList   from './components/pages/ThemeList'
import FlowMomentum from './components/pages/FlowMomentum'
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
import SiteInfo    from './components/pages/SiteInfo'

const PAGES = [
  { icon:'🏠', label:'ホーム',                   component:TopPage       },
  { icon:'📊', label:'テーマ一覧',                component:ThemeList     },
  { icon:'🔍', label:'テーマ別詳細',              component:ThemeDetail   },
  { icon:'📋', label:'市場別詳細',           component:MarketRank    },
  { icon:'🔥', label:'ヒートマップ',              component:Heatmap       },
  { icon:'💹', label:'資金フロー・騰落モメンタム', component:FlowMomentum  },
  { icon:'🎨', label:'カスタムテーマ',             component:CustomTheme   },
]
const PAGES_OTHER = [
  { icon:'🏢', label:'当サイトについて',    component:SiteInfo      },
  { icon:'📣', label:'お知らせ',            component:News          },
  { icon:'📖', label:'使い方',              component:HowTo         },
  { icon:'📝', label:'コラム・解説',        component:Column        },
  { icon:'⚙️', label:'設定',               component:Settings      },
  { icon:'⚖️', label:'免責事項',           component:Disclaimer    },
  { icon:'🔒', label:'プライバシーポリシー', component:PrivacyPolicy },
]
const ALL_PAGES     = [...PAGES, ...PAGES_OTHER]
const COLOR_THEME_KEY = 'swjp_color_theme'

function AppInner() {
  const [currentPage, setCurrentPage] = useState('ホーム')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode,    setViewMode]    = useState('auto')
  const [isMobile,    setIsMobile]    = useState(false)
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
  const handlePageChange = (label) => { setCurrentPage(label); setSidebarOpen(false) }
  const handleLogoClick  = () => { setCurrentPage('ホーム'); setSidebarOpen(false) }

  const pageProps = (() => {
    if (currentPage === '設定') return { viewMode, onViewModeChange:setViewMode, colorTheme, onColorThemeChange:setColorTheme }
    if (currentPage === 'ホーム') return { onNavigate: handlePageChange }
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

        <footer style={{ borderTop:'1px solid var(--border)', padding:'20px 32px',
          textAlign:'center', color:'var(--text3)', fontSize:'11px' }}>
          <span style={{ color:'#e63030', fontWeight:700 }}>Stock</span>
          <span style={{ fontWeight:700, color:'var(--text2)' }}>Wave</span>
          <span style={{ color:'#e63030', fontWeight:700, fontSize:'10px' }}>JP</span>
          {'  —  stockwavejp.com  —  投資助言ではありません  —  © 2026'}
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
