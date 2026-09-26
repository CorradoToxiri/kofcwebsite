'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroBanner.module.css'

// ─── Config ─────────────────────────────────────────────────────────────────

const PHOTO_BASE =
  'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/'
const PHOTOS = [
  'hero.png',
  'Activities_service1.jpg',
  'Activities_faith1.jpg',
  'Activities_service2.png',
  'Activities_signature1.jpg',
  'Activities_faith2.jpg',
  'CoP_volunteer.jpg',
]

const PHOTO_INTERVAL_MS = 7000
const PILLAR_INTERVAL_MS = 5200
const PILLAR_PAUSE_MS = 9000
const PILLAR_SWAP_MS = 420
const COUNT_DELAY_MS = 900
const COUNT_DURATION_MS = 1600

const HEADLINE: { text: string; em?: boolean; glue?: boolean }[] = [
  { text: 'Faith,' },
  { text: 'family,' },
  { text: 'and' },
  { text: 'fraternity', em: true, glue: true },
  { text: '—' },
  { text: 'rooted' },
  { text: 'at' },
  { text: 'Presentation' },
  { text: 'Parish.' },
]

type Settings = Record<string, string>

// ─── Reduced-motion ─────────────────────────────────────────────────────────

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

// Server snapshot is `false`; React re-renders on the client if the user prefers reduced motion.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function HeroBanner({
  settings,
  yearsServing,
}: {
  settings: Settings
  yearsServing: number
}) {
  const reduce = usePrefersReducedMotion()

  const pillars = [
    {
      numeral: 'I.',
      name: 'Charity',
      copy: "From the food pantry collection to our work with Covenant House Newark, we are our parish's hands and feet for those in need.",
      stat: `${settings.charity_raised} given in ${settings.reporting_year}`,
    },
    {
      numeral: 'II.',
      name: 'Unity',
      copy: 'None of us is as good as all of us. We work shoulder-to-shoulder with our pastor, our parish, and our community.',
      stat: `${settings.parish_events_per_year} parish events a year`,
    },
    {
      numeral: 'III.',
      name: 'Fraternity',
      copy: 'A circle of Catholic men who hold each other up — at first communions and at funerals, in joys and in trials.',
      stat: `${settings.active_members} brother knights`,
    },
    {
      numeral: 'IV.',
      name: 'Patriotism',
      copy: 'Faithful citizens who honor our country, support our veterans, and stand for the dignity of every life among us.',
      stat: `${settings.fourth_degree_knights} Fourth Degree Knights`,
    },
  ]

  return (
    <section className={styles.hero} aria-label="Presentation Council #6033">
      <PhotoStack reduce={reduce} />
      <div className={styles.scrim} />

      <div className={styles.inner}>
        <h1 className={styles.title}>
          {HEADLINE.map((w, i) => {
            const word = (
              <span
                className={styles.word}
                style={{ animationDelay: `${0.15 + i * 0.07}s` }}
              >
                {w.text}
              </span>
            )
            return (
              <span key={i}>
                {w.em ? <em>{word}</em> : word}
                {i < HEADLINE.length - 1 ? (w.glue ? ' ' : ' ') : null}
              </span>
            )
          })}
        </h1>

        <p className={styles.lede}>
          We are Catholic men of Upper Saddle River, Saddle River, Allendale,
          and the surrounding towns — gathering each month to serve our parish,
          support our neighbors in need, and grow as husbands, fathers, and disciples.
        </p>

        <div className={styles.ctas}>
          <Link href="/join" className={`${styles.btn} ${styles.primary}`}>
            Join Our Brotherhood <span aria-hidden="true">→</span>
          </Link>
          <Link href="/charities" className={`${styles.btn} ${styles.ghost}`}>
            Support Our Charities
          </Link>
        </div>

        <PrincipleTicker pillars={pillars} reduce={reduce} />

        <div className={styles.stats}>
          <Stat value={String(yearsServing)} label="Years serving the parish" reduce={reduce} />
          <Stat value={settings.active_members} label="Active brother knights" reduce={reduce} />
          <Stat
            value={settings.charity_raised}
            label={`Raised for charity in ${settings.reporting_year}`}
            reduce={reduce}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Photo cross-fade ───────────────────────────────────────────────────────

function PhotoStack({ reduce }: { reduce: boolean }) {
  // `reached` is the highest index that has been shown; photos are mounted
  // progressively (current + next) so only the first competes with LCP.
  const [state, setState] = useState({ cur: 0, prev: -1, reached: 0 })

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setState((s) => {
        const cur = (s.cur + 1) % PHOTOS.length
        return { cur, prev: s.cur, reached: Math.max(s.reached, cur) }
      })
    }, PHOTO_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduce])

  const mountCount = Math.min(PHOTOS.length, state.reached + (reduce ? 1 : 2))

  return (
    <div className={styles.photos} aria-hidden="true">
      {PHOTOS.slice(0, mountCount).map((file, i) => {
        const cls = [
          styles.photo,
          i === state.cur ? styles.on : i === state.prev ? styles.prev : '',
        ].join(' ')
        return (
          <Image
            key={file}
            src={PHOTO_BASE + file}
            alt=""
            fill
            sizes="100vw"
            className={cls}
            preload={i === 0}
          />
        )
      })}
    </div>
  )
}

// ─── Four principles ticker ─────────────────────────────────────────────────

type Pillar = { numeral: string; name: string; copy: string; stat: string }

function PrincipleTicker({ pillars, reduce }: { pillars: Pillar[]; reduce: boolean }) {
  const [active, setActive] = useState(0)   // drives the progress bar
  const [shown, setShown] = useState(0)     // drives the text (lags `active` during the fade)
  const [paused, setPaused] = useState(false)
  const [manualTick, setManualTick] = useState(0) // restarts the pause timer on repeat hovers/clicks

  // Auto-advance, or resume-then-advance after a manual pause.
  useEffect(() => {
    if (reduce) return
    const id = setTimeout(
      () => {
        setPaused(false)
        setActive((a) => (a + 1) % pillars.length)
      },
      paused ? PILLAR_PAUSE_MS : PILLAR_INTERVAL_MS,
    )
    return () => clearTimeout(id)
  }, [active, paused, manualTick, reduce, pillars.length])

  // Swap the visible copy once the fade-out has finished.
  useEffect(() => {
    if (shown === active) return
    const id = setTimeout(() => setShown(active), reduce ? 0 : PILLAR_SWAP_MS)
    return () => clearTimeout(id)
  }, [active, shown, reduce])

  const jump = (k: number) => {
    setActive(k)
    setPaused(true)
    setManualTick((t) => t + 1)
  }

  const swapping = shown !== active
  const p = pillars[shown]

  return (
    <div className={styles.pillars}>
      <div
        className={`${styles.numeral} ${styles.swap} ${swapping ? styles.out : ''}`}
        aria-hidden="true"
      >
        {p.numeral}
      </div>

      <div className={styles.pillarText} aria-live="polite">
        <div className={`${styles.pillarBody} ${styles.swap} ${swapping ? styles.out : ''}`}>
          <div className={styles.pillarName}>{p.name}</div>
          <div className={styles.pillarCopy}>{p.copy}</div>
          <div className={styles.pillarStat}>{p.stat}</div>
        </div>
        {/* Invisible copies reserve the height of the tallest pillar. */}
        {pillars.map((s) => (
          <div key={s.name} className={`${styles.pillarBody} ${styles.sizer}`} aria-hidden="true">
            <div className={styles.pillarName}>{s.name}</div>
            <div className={styles.pillarCopy}>{s.copy}</div>
            <div className={styles.pillarStat}>{s.stat}</div>
          </div>
        ))}
      </div>

      <div
        className={styles.dots}
        role="group"
        aria-label="Four principles"
        style={{ '--dur': `${PILLAR_INTERVAL_MS}ms` } as React.CSSProperties}
      >
        {pillars.map((s, k) => {
          const isActive = k === active
          const done = k < active || (isActive && paused)
          const running = isActive && !paused
          return (
            <button
              key={s.name}
              type="button"
              className={[styles.dot, done ? styles.done : '', running ? styles.running : ''].join(' ')}
              aria-label={`${s.numeral} ${s.name}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => jump(k)}
              onMouseEnter={() => jump(k)}
            >
              {/* keyed so the fill animation restarts each time the segment becomes active */}
              <i key={running ? `run-${active}` : 'idle'} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Stat counters ──────────────────────────────────────────────────────────

function Stat({ value, label, reduce }: { value: string; label: string; reduce: boolean }) {
  return (
    <div className={styles.stat}>
      <b>
        <Counter value={value} reduce={reduce} />
      </b>
      <span>{label}</span>
    </div>
  )
}

// Counts up when the value is "<prefix><digits><suffix>" (e.g. "$31K", "100+", "58");
// anything else (e.g. "Hundreds") is shown as-is. Server render shows the final value.
const COUNTABLE = /^(\D*)(\d+)(\D*)$/

function Counter({ value, reduce }: { value: string; reduce: boolean }) {
  const match = COUNTABLE.exec(value)
  const [n, setN] = useState<number | null>(null)

  useEffect(() => {
    const m = COUNTABLE.exec(value)
    if (reduce || !m) return
    const end = Number(m[2])
    const t0 = performance.now() + COUNT_DELAY_MS
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / COUNT_DURATION_MS))
      setN(Math.round(end * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduce])

  if (!match || reduce || n === null) return <>{value}</>
  return <>{match[1] + n + match[3]}</>
}
