import { useEffect, useRef, useState } from 'react'
import { eventConfig } from '../config/eventConfig'

const STORAGE_KEY = 'sunnet-intro-done'

export function alreadySeenIntro() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

type Props = {
  onFinished: () => void
}

type SoundUi = 'hidden' | 'unmute' | 'start'

export function IntroVideo({ onFinished }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const blurRef = useRef<HTMLVideoElement | null>(null)
  const onFinishedRef = useRef(onFinished)
  const [leaving, setLeaving] = useState(false)
  const [soundUi, setSoundUi] = useState<SoundUi>('hidden')
  const finished = useRef(false)
  onFinishedRef.current = onFinished

  useEffect(() => {
    const video = videoRef.current
    const blur = blurRef.current
    if (!video) return
    const main = video

    function prepare(node: HTMLVideoElement, muted: boolean) {
      node.muted = muted
      node.defaultMuted = muted
      node.setAttribute('playsinline', 'true')
      node.setAttribute('webkit-playsinline', 'true')
    }

    prepare(main, false)
    if (blur) prepare(blur, true)

    function finish() {
      if (finished.current) return
      finished.current = true
      markSeen()
      setLeaving(true)
      window.setTimeout(() => onFinishedRef.current(), 480)
    }

    function syncBlur() {
      if (!blur) return
      blur.muted = true
      blur.currentTime = main.currentTime
      void blur.play().catch(() => undefined)
    }

    main.addEventListener('ended', finish)
    main.addEventListener('error', finish)

    const play = async () => {
      try {
        main.muted = false
        main.defaultMuted = false
        await main.play()
        setSoundUi('hidden')
        syncBlur()
      } catch {
        try {
          main.muted = true
          main.defaultMuted = true
          await main.play()
          setSoundUi('unmute')
          syncBlur()
        } catch {
          setSoundUi('start')
        }
      }
    }

    void play()
    return () => {
      main.removeEventListener('ended', finish)
      main.removeEventListener('error', finish)
    }
  }, [])

  async function startWithSound() {
    const video = videoRef.current
    const blur = blurRef.current
    if (!video) return
    try {
      video.muted = false
      video.defaultMuted = false
      video.volume = 1
      await video.play()
      setSoundUi('hidden')
      if (blur) {
        blur.muted = true
        blur.currentTime = video.currentTime
        void blur.play().catch(() => undefined)
      }
    } catch {
      setSoundUi('start')
    }
  }

  function skip() {
    if (finished.current) return
    finished.current = true
    markSeen()
    setLeaving(true)
    window.setTimeout(() => onFinishedRef.current(), 480)
  }

  return (
    <div className={leaving ? 'intro-video is-leaving' : 'intro-video'} role="dialog" aria-label="Açılış videosu">
      <video
        ref={blurRef}
        className="intro-video__blur"
        src={eventConfig.introVideoSrc}
        muted
        playsInline
        loop
        preload="metadata"
        aria-hidden
        tabIndex={-1}
      />
      <video
        ref={videoRef}
        className="intro-video__media"
        src={eventConfig.introVideoSrc}
        playsInline
        preload="metadata"
      />
      <button className="btn btn--skip" type="button" onClick={skip}>
        Geç
      </button>
      {soundUi !== 'hidden' ? (
        <button className="btn btn--warm intro-video__sound" type="button" onClick={() => void startWithSound()}>
          {soundUi === 'unmute' ? 'Sesi Aç' : 'Sesli Başlat'}
        </button>
      ) : null}
    </div>
  )
}
