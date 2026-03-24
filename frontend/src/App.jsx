import { useState, useEffect } from 'react'
import Header      from './components/Header'
import Sidebar     from './components/Sidebar'
import TopPage     from './components/pages/TopPage'
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
  { icon:'🏠', label:'ホーム',           component:TopPage     },
  { icon:'📊', label:'テーマ一覧',        component:ThemeList   },
  { icon:'📡', label:'騰落モメンタム',     component:Momentum    },
  { icon:'💹', label:'資金フロー',         component:FundFlow    },
  { icon:'📈', label:'騰落推移',           component:Trend       },
  { icon:'🔥', label:'ヒートマップ',       component:Heatmap     },
  { icon:'📊', label:'テーマ・マクロ比較', component:Compare     },
  { icon:'📋', label:'市場別ランキング',   component:MarketRank  },
  { icon:'🔍', label:'テーマ別詳細',       component:ThemeDetail },
]
const PAGES_OTHER = [
  { icon:'🎨', label:'カスタムテーマ', component:CustomTheme },
  { icon:'📣', label:'お知らせ',       component:News        },
  { icon:'📖', label:'使い方',         component:HowTo       },
  { icon:'⚙️', label:'設定',           component:Settings    },
  { icon:'⚖️', label:'免責事項',       component:Disclaimer  },
]
const ALL_PAGES = [...PAGES, ...PAGES_OTHER]
const COLOR_THEME_KEY = 'swjp_color_theme'

export default function App() {
  const [currentPage, setCurrentPage] = useState('ホーム')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode,    setViewMode]    = useState('auto')
  const [isMobile,    setIsMobile]    = useState(false)
  const [status,      setStatus]      = useState({ time:'--:--', is_open:false, label:'...' })
  const [colorTheme,  setColorTheme]  = useState(
    () => localStorage.getItem(COLOR_THEME_KEY) || 'dark'
  )

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

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const res  = await fetch(apiBase + '/api/status')
        const data = await res.json()
        setStatus({
          ...data,
          label: data.is_open ? '市場オープン中' : '市場クローズ中',
        })
      } catch {
        const now = new Date()
        const jst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000)
        setStatus({
          time: `${String(jst.getHours()).padStart(2,'0')}:${String(jst.getMinutes()).padStart(2,'0')} JST`,
          is_open: false, label: '接続エラー',
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
  const handleLogoClick  = () => { setCurrentPage('ホーム'); setSidebarOpen(false) }

  const pageProps = (() => {
    if (currentPage === '設定') return { viewMode, onViewModeChange: setViewMode, colorTheme, onColorThemeChange: setColorTheme }
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
