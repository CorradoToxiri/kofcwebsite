'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import styles from './AboutVideo.module.css'

const BASE = 'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/'
const VIDEO_URL = BASE + 'KofC6033_About_720p.mp4'
const POSTER_URL = BASE + 'KofC6033_About_poster.jpg'

const RESTART_BEFORE_SECONDS = 3
const VISIBLE_THRESHOLD = 0.25

// ─── Autoplay policy ────────────────────────────────────────────────────────

type NetworkInformationLike = EventTarget & { saveData?: boolean }
type Policy = 'server' | 'allow' | 'deny'

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function getConnection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection
}

function subscribePolicy(cb: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY)
  const conn = getConnection()
  mq.addEventListener('change', cb)
  conn?.addEventListener('change', cb)
  return () => {
    mq.removeEventListener('change', cb)
    conn?.removeEventListener('change', cb)
  }
}

function getPolicy(): Policy {
  const reduce = window.matchMedia(REDUCE_QUERY).matches
  const saveData = getConnection()?.saveData === true
  return reduce || saveData ? 'deny' : 'allow'
}

// 'server' until hydrated, so the server HTML never contains a <video> that could
// start loading before we know whether autoplay is allowed.
function useAutoplayPolicy(): Policy {
  return useSyncExternalStore(subscribePolicy, getPolicy, () => 'server')
}

// ─── Icons ──────────────────────────────────────────────────────────────────

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
)
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
)
const SoundOnIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
  </svg>
)
const SoundOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0a6.9 6.9 0 0 1-.9 3.4l1.5 1.5A8.9 8.9 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
  </svg>
)
const ReplayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" />
  </svg>
)

// ─── Component ──────────────────────────────────────────────────────────────

export function AboutVideo() {
  const boxRef = useRef<HTMLDivElement>(null)
  const policy = useAutoplayPolicy()
  const [manual, setManual] = useState(false)   // viewer pressed Play
  const [blocked, setBlocked] = useState(false) // play() was rejected

  const showVideo = manual || (policy === 'allow' && !blocked)
  const showPlay = !showVideo && policy !== 'server'

  const handleBlocked = useCallback(() => {
    setManual(false)
    setBlocked(true)
  }, [])

  return (
    <div ref={boxRef} className={styles.box} style={{ backgroundImage: `url("${POSTER_URL}")` }}>
      {showVideo && <VideoPlayer boxRef={boxRef} onBlocked={handleBlocked} />}
      {showPlay && (
        <button
          type="button"
          className={`${styles.centerBtn} ${styles.playBtn}`}
          aria-label="Play video"
          onClick={() => setManual(true)}
        >
          <PlayIcon />
        </button>
      )}
    </div>
  )
}

// Mounted only when the video should load, so nothing but the poster is fetched otherwise.
function VideoPlayer({
  boxRef,
  onBlocked,
}: {
  boxRef: RefObject<HTMLDivElement | null>
  onBlocked: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)  // viewer paused it themselves: don't auto-resume
  const autoPaused = useRef(false)  // we paused it because it scrolled away
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)

  // Play a promise-returning start; only a real autoplay refusal falls back to the poster.
  const start = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch((err: unknown) => {
      // AbortError = we paused (e.g. scrolled out) while play() was pending; not a refusal.
      if ((err as DOMException)?.name !== 'AbortError') onBlocked()
    })
  }, [onBlocked])

  // Kick off playback (muted, so autoplay is permitted).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    start()
  }, [start])

  // Pause when scrolled out of view; resume on return unless the viewer paused it.
  useEffect(() => {
    const box = boxRef.current
    const v = videoRef.current
    if (!box || !v || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!v.paused && !v.ended) {
            autoPaused.current = true
            v.pause()
          }
        } else if (autoPaused.current) {
          autoPaused.current = false
          if (!userPaused.current && !v.ended) start()
        }
      },
      { threshold: VISIBLE_THRESHOLD },
    )
    io.observe(box)
    return () => io.disconnect()
  }, [boxRef, start])

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    if (v.muted) {
      v.muted = false
      if (v.currentTime < RESTART_BEFORE_SECONDS) v.currentTime = 0
    } else {
      v.muted = true
    }
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      start()
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  const replay = () => {
    const v = videoRef.current
    if (!v) return
    userPaused.current = false
    v.currentTime = 0
    start()
  }

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="metadata"
        poster={POSTER_URL}
        onPlay={() => { setPlaying(true); setEnded(false) }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setEnded(true) }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {ended ? (
        <button
          type="button"
          className={`${styles.centerBtn} ${styles.replayBtn}`}
          onClick={replay}
        >
          <ReplayIcon /> Replay
        </button>
      ) : null}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          title={muted ? 'Turn sound on' : 'Turn sound off'}
          onClick={toggleSound}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
        {!ended && (
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={playing ? 'Pause video' : 'Play video'}
            title={playing ? 'Pause video' : 'Play video'}
            onClick={togglePlay}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </>
  )
}
