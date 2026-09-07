import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { warmupBackendInBackground } from './api/backendReady'
import { alreadySeenIntro, IntroVideo } from './components/IntroVideo'
import { GuestStateProvider } from './context/GuestState'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { UploadPage } from './pages/UploadPage'

export default function App() {
  const [introOpen, setIntroOpen] = useState(() => !alreadySeenIntro())

  useEffect(() => {
    warmupBackendInBackground()
  }, [])

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
