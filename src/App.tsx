import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { LibraryPage } from './features/library/LibraryPage'
import { SessionBar } from './features/session/SessionBar'
import { useSessionStore } from './features/session/useSessionStore'
import { RoutineProvider } from './features/routines/RoutineContext'
import './App.css'

const SavedPage = lazy(() => import('./features/saved/SavedPage'))
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'))
const RoutineDetailPage = lazy(
  () => import('./features/routines/RoutineDetailPage'),
)

function AppLayout() {
  const isRunning = useSessionStore((state) => state.isRunning)
  const tick = useSessionStore((state) => state.tick)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!isRunning) return
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [isRunning, tick])

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="Bấm giờ tập luyện - Trang chủ">
          <span className="brand-mark" aria-hidden="true">✿</span>
          <span>mimo<span className="brand-light">fit</span></span>
        </NavLink>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Kho bài tập
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Đã lưu
          </NavLink>
          <NavLink to="/routines" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Giáo án
          </NavLink>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          <span>{theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}</span>
        </button>
      </header>

      <main className="main-content">
        <Suspense fallback={<p className="loading-message">Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineDetailPage />} />
            <Route path="*" element={<LibraryPage />} />
          </Routes>
        </Suspense>
      </main>
      <SessionBar />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <RoutineProvider>
          <AppLayout />
        </RoutineProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
