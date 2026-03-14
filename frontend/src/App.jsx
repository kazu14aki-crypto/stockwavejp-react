import { useState, useEffect } from 'react'
import Header      from './components/Header'
import Sidebar     from './components/Sidebar'
import ThemeList   from './components/pages/ThemeList'
import Momentum    from './components/pages/Momentum'
import FundFlow    from './components/pages/FundFlow'
import Trend       from './components/pages/Trend'
import Heatmap     from './components/pages/Heatmap'
import Compare     from './components/pages/Compare'
import MarketRank  from './components/pages/MarketRank'
import ThemeDetail from './components/pages/ThemeDetail'
import CustomTheme from './components/pages/CustomTheme'
import News        from './components/pages/News'
import HowTo       from './components/pages/HowTo'
import Settings    from './components/pages/Settings'
import Disclaimer  from './components/pages/Disclaimer'

const PAGES = [
  { icon:'投', label:'繝・・繝樔ｸ隕ｧ',        component:ThemeList   },
  { icon:'藤', label:'鬨ｰ關ｽ繝｢繝｡繝ｳ繧ｿ繝',     component:Momentum    },
  { icon:'鳥', label:'雉・≡繝輔Ο繝ｼ',         component:FundFlow    },
  { icon:'嶋', label:'鬨ｰ關ｽ謗ｨ遘ｻ',           component:Trend       },
  { icon:'櫨', label:'繝偵・繝医・繝・・',       component:Heatmap     },
  { icon:'投', label:'繝・・繝槭・繝槭け繝ｭ豈碑ｼ・, component:Compare     },
  { icon:'搭', label:'蟶ょｴ蛻･繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ',   component:MarketRank  },
  { icon:'剥', label:'繝・・繝槫挨隧ｳ邏ｰ',       component:ThemeDetail },
]
const PAGES_OTHER = [
  { icon:'耳', label:'繧ｫ繧ｹ繧ｿ繝繝・・繝・, component:CustomTheme },
  { icon:'謄', label:'縺顔衍繧峨○',       component:News        },
  { icon:'当', label:'菴ｿ縺・婿',         component:HowTo       },
  { icon:'笞呻ｸ・, label:'險ｭ螳・,           component:Settings    },
  { icon:'笞厄ｸ・, label:'蜈崎ｲｬ莠矩・,       component:Disclaimer  },
]
const ALL_PAGES = [...PAGES, ...PAGES_OTHER]

const COLOR_THEME_KEY = 'swjp_color_theme'

export default function App() {
  const [currentPage, setCurrentPage]  = useState('繝・・繝樔ｸ隕ｧ')
  const [sidebarOpen, setSidebarOpen]  = useState(false)
  const [viewMode,    setViewMode]     = useState('auto')
  const [isMobile,    setIsMobile]     = useState(false)
  const [status,      setStatus]       = useState({ time:'--:--', is_open:false, label:'...' })
  const [colorTheme,  setColorTheme]   = useState(
    () => localStorage.getItem(COLOR_THEME_KEY) || 'dark'
  )

  // 繧ｫ繝ｩ繝ｼ繝・・繝槭ｒdocument螻樊ｧ縺ｫ蜿肴丐
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    localStorage.setItem(COLOR_THEME_KEY, colorTheme)
  }, [colorTheme])

  // 逕ｻ髱｢蟷・愛螳・  useEffect(() => {
    const check = () => {
      if (viewMode === 'mobile') { setIsMobile(true); return }
      if (viewMode === 'pc')     { setIsMobile(false); return }
      setIsMobile(window.innerWidth <= 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [viewMode])

  // 繧ｹ繝・・繧ｿ繧ｹ蜿門ｾ・  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res  = await fetch('(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/status'')
        const data = await res.json()
        setStatus(data)
      } catch {
        const now = new Date()
        const jst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000)
        setStatus({
          time:`${String(jst.getHours()).padStart(2,'0')}:${String(jst.getMinutes()).padStart(2,'0')} JST`,
          is_open:false, label:'謗･邯壹お繝ｩ繝ｼ',
        })
      }
    }
    fetchStatus()
    const id = setInterval(fetchStatus, 30000)
    return () => clearInterval(id)
  }, [])

  const currentPageObj = ALL_PAGES.find(p => p.label === currentPage)
  const PageComponent  = currentPageObj?.component

  const handlePageChange = (label) => { setCurrentPage(label); setSidebarOpen(false) }

  // 蜷・・繝ｼ繧ｸ縺ｫ貂｡縺冪rops
  const pageProps = (() => {
    if (currentPage === '險ｭ螳・) return { viewMode, onViewModeChange: setViewMode, colorTheme, onColorThemeChange: setColorTheme }
    return {}
  })()

  return (
    <div style={{ minHeight:'100vh' }}>
      <Header
        status={status}
        onMenuClick={() => setSidebarOpen(o => !o)}
        sidebarOpen={sidebarOpen}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:800,
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
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',
            height:'calc(100vh - var(--header))',flexDirection:'column',gap:'16px',color:'var(--text3)' }}>
            <div style={{ fontSize:'48px' }}>{currentPageObj?.icon}</div>
            <div style={{ fontSize:'18px',fontWeight:600,color:'var(--text2)' }}>{currentPage}</div>
            <div style={{ fontSize:'13px' }}>縺薙・繝壹・繧ｸ縺ｯ貅門ｙ荳ｭ縺ｧ縺・/div>
          </div>
        )}

        <footer style={{ borderTop:'1px solid var(--border)', padding:'24px 32px',
          textAlign:'center', color:'var(--text3)', fontSize:'11px' }}>
          <span style={{ color:'#e63030',fontWeight:700 }}>Stock</span>
          <span style={{ fontWeight:700,color:'var(--text)' }}>Wave</span>
          <span style={{ color:'#e63030',fontWeight:700,fontSize:'10px' }}>JP</span>
          {'  窶・ stockwavejp.com  窶・ 謚戊ｳ・勧險縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ  窶・ ﾂｩ 2026'}
        </footer>
      </main>
    </div>
  )
}
