import { useEffect, useRef, useState } from 'react'
import { eventConfig } from '../config/eventConfig'
import { IconVolume, IconVolumeMute } from './Icons'

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
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const lastAudibleRef = useRef(1)
  const finished = useRef(false)
  onFinishedRef.current = onFinished

  function applyAudio(nextMuted: boolean, nextVolume: number) {
    const video = videoRef.current
    if (!video) return
    video.volume = nextVolume
    video.muted = nextMuted || nextVolume === 0
    video.defaultMuted = video.muted
  }

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
        main.volume = lastAudibleRef.current
        await main.play()
        setMuted(false)
        setVolume(lastAudibleRef.current)
        setSoundUi('hidden')
        syncBlur()
      } catch {
        try {
          main.muted = true
          main.defaultMuted = true
          await main.play()
          setMuted(true)
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
      const restore = lastAudibleRef.current > 0 ? lastAudibleRef.current : 1
      video.volume = restore
      video.muted = false
      video.defaultMuted = false
      await video.play()
      setVolume(restore)
      setMuted(false)
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

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    if (!video.muted && video.volume > 0) {
      lastAudibleRef.current = video.volume
      setMuted(true)
      applyAudio(true, volume)
      return
    }
    const restore = lastAudibleRef.current > 0 ? lastAudibleRef.current : 0.7
    setVolume(restore)
    setMuted(false)
    applyAudio(false, restore)
    void video.play().then(() => setSoundUi('hidden')).catch(() => setSoundUi('start'))
  }

  function onVolumeInput(value: number) {
    const next = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
    if (next > 0) lastAudibleRef.current = next
    const nextMuted = next === 0
    setVolume(next)
    setMuted(nextMuted)
    applyAudio(nextMuted, next)
    if (!nextMuted) {
      const video = videoRef.current
      if (video) {
        void video.play().then(() => setSoundUi('hidden')).catch(() => undefined)
      }
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
      <div className="intro-video__audio">
        <button
          className="intro-video__mute"
          type="button"
          onClick={toggleMute}
          aria-label={muted || volume === 0 ? 'Sesi Aç' : 'Sesi Kapat'}
          aria-pressed={muted || volume === 0}
        >
          {muted || volume === 0 ? <IconVolumeMute size={18} /> : <IconVolume size={18} />}
        </button>
        <input
          className="intro-video__volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          aria-label="Ses seviyesi"
          onChange={(event) => onVolumeInput(Number(event.target.value))}
        />
      </div>
      {soundUi !== 'hidden' ? (
        <button className="btn btn--warm intro-video__sound" type="button" onClick={() => void startWithSound()}>
          {soundUi === 'unmute' ? 'Sesi Aç' : 'Sesli Başlat'}
        </button>
      ) : null}
    </div>
  )
}
