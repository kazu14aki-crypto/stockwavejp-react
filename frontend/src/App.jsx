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
import SiteInfo    from './components/pages/SiteInfo'

const PAGES = [
  { icon:'匠', label:'繝帙・繝',                   component:TopPage       },
  { icon:'投', label:'繝・・繝樔ｸ隕ｧ',                component:ThemeList     },
  { icon:'剥', label:'繝・・繝槫挨隧ｳ邏ｰ',              component:ThemeDetail   },
  { icon:'搭', label:'蟶ょｴ蛻･隧ｳ邏ｰ',           component:MarketRank    },
  { icon:'櫨', label:'繝偵・繝医・繝・・繝ｻ繝｢繝｡繝ｳ繧ｿ繝',              component:Heatmap       },
  { icon:'耳', label:'繧ｫ繧ｹ繧ｿ繝繝・・繝・,             component:CustomTheme   },
]
const PAGES_OTHER = [
  { icon:'召', label:'蠖薙し繧､繝医↓縺､縺・※',    component:SiteInfo      },
  { icon:'謄', label:'縺顔衍繧峨○',            component:News          },
  { icon:'当', label:'菴ｿ縺・婿',              component:HowTo         },
  { icon:'統', label:'繧ｳ繝ｩ繝繝ｻ隗｣隱ｬ',        component:Column        },
  { icon:'笞呻ｸ・, label:'險ｭ螳・,               component:Settings      },
  { icon:'笞厄ｸ・, label:'蜈崎ｲｬ莠矩・,           component:Disclaimer    },
  { icon:'白', label:'繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ', component:PrivacyPolicy },
]

// 縺雁撫縺・粋繧上○Google繝輔か繝ｼ繝URL・亥ｮ滄圀縺ｮURL縺ｫ螟画峩縺励※縺上□縺輔＞・・const CONTACT_FORM_URL = 'https://forms.gle/XjNypTdmZt265Kib6'
const ALL_PAGES     = [...PAGES, ...PAGES_OTHER]
const COLOR_THEME_KEY = 'swjp_color_theme'

function AppInner() {
  const [currentPage,   setCurrentPage]   = useState('繝帙・繝')
  const [targetArticleId, setTargetArticleId] = useState(null)
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
  }

  const handleLogoClick  = () => { setCurrentPage('繝帙・繝'); setSidebarOpen(false) }

  const pageProps = (() => {
    if (currentPage === '險ｭ螳・) return { viewMode, onViewModeChange:setViewMode, colorTheme, onColorThemeChange:setColorTheme }
    if (currentPage === '繝帙・繝') return { onNavigate: handlePageChange }
    if (currentPage === '繧ｳ繝ｩ繝繝ｻ隗｣隱ｬ') return { initialArticleId: targetArticleId, onNavigate: handlePageChange }
    if (currentPage === '繝・・繝樔ｸ隕ｧ') return { onNavigate: handlePageChange }
    if (currentPage === '繝・・繝槫挨隧ｳ邏ｰ') return { onNavigate: handlePageChange }
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
            <div style={{ fontSize:'13px' }}>縺薙・繝壹・繧ｸ縺ｯ貅門ｙ荳ｭ縺ｧ縺・/div>
          </div>
        )}

        <footer style={{ borderTop:'1px solid var(--border)', padding:'16px 24px',
          textAlign:'center', color:'var(--text3)', fontSize:'11px' }}>
          <div style={{ marginBottom:'8px', display:'flex', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
            <button onClick={() => handlePageChange('蜈崎ｲｬ莠矩・)} style={{
              background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
              fontSize:'11px', fontFamily:'var(--font)', padding:0,
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>蜈崎ｲｬ莠矩・/button>
            <button onClick={() => handlePageChange('繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ')} style={{
              background:'none', border:'none', color:'var(--text3)', cursor:'pointer',
              fontSize:'11px', fontFamily:'var(--font)', padding:0,
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ</button>
            <a href={CONTACT_FORM_URL} target="_blank" rel="noopener noreferrer" style={{
              color:'var(--text3)', fontSize:'11px', fontFamily:'var(--font)',
              textDecoration:'underline', textUnderlineOffset:'2px',
            }}>縺雁撫縺・粋繧上○</a>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'2px 0', alignItems:'center' }}>
            <span style={{ color:'#e63030', fontWeight:700 }}>Stock</span>
            <span style={{ fontWeight:700, color:'var(--text2)' }}>Wave</span>
            <span style={{ color:'#e63030', fontWeight:700, fontSize:'10px' }}>JP</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;窶・nbsp;stockwavejp.com</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;窶・nbsp;謚戊ｳ・勧險縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ</span>
            <span style={{ whiteSpace:'nowrap' }}>&nbsp;窶・nbsp;ﾂｩ 2026</span>
          </div>
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
