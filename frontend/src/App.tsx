import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { warmupBackendInBackground } from './api/backendReady'
import { alreadySeenIntro, IntroVideo } from './components/IntroVideo'
import { GuestStateProvider } from './context/GuestState'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { UploadPage } from './pages/UploadPage'

const SITE_THEME_COLOR = '#1059FF'
const INTRO_THEME_COLOR = '#6ea8d4'

export default function App() {
  const [introOpen, setIntroOpen] = useState(() => !alreadySeenIntro())

  useEffect(() => {
    warmupBackendInBackground()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const appRoot = document.getElementById('root')
    const themeMeta = document.querySelector('meta[name="theme-color"]')

    root.classList.toggle('intro-open', introOpen)
    body.classList.toggle('intro-open', introOpen)
    appRoot?.classList.toggle('intro-open', introOpen)
    themeMeta?.setAttribute('content', introOpen ? INTRO_THEME_COLOR : SITE_THEME_COLOR)

    return () => {
      root.classList.remove('intro-open')
      body.classList.remove('intro-open')
      appRoot?.classList.remove('intro-open')
      themeMeta?.setAttribute('content', SITE_THEME_COLOR)
    }
  }, [introOpen])

  return (
    <GuestStateProvider>
      {introOpen ? <IntroVideo onFinished={() => setIntroOpen(false)} /> : null}
      <div className="page-shell">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GuestStateProvider>
  )
}
