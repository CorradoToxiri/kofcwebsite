import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import { eventDateParts, shortDate, isSameCalendarDay } from '@/lib/utils/dates'
import { EVENT_TYPE_LABEL } from '@/lib/utils/eventTypes'
import { getColumbianYear } from '@/lib/utils/columbianYear'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Calendar',
  description:
    'Upcoming and past events for Presentation Council #6033, Knights of Columbus — meetings, activities, and service events.',
}

// ─── Config ──────────────────────────────────────────────────────────────────

const TZ = 'America/New_York'

const PDF_URL =
  'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/documents/KofC6033_Calendar.pdf'

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

async function getPastEvents(): Promise<Event[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const now = new Date()
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .lt('starts_at', now.toISOString())
      .gte('starts_at', sixMonthsAgo.toISOString())
      .neq('event_type', 'council_meeting')
      .neq('event_type', 'officers_meeting')
      .order('starts_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function monthKey(iso: string): string {
  const d = new Date(iso)
  const year  = d.toLocaleString('en-US', { year: 'numeric', timeZone: TZ })
  const month = d.toLocaleString('en-US', { month: '2-digit', timeZone: TZ })
  return `${year}-${month}` // sortable: "2026-05"
}

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: TZ })
}

function groupByMonth(events: Event[]) {
  const map = new Map<string, { label: string; events: Event[] }>()
  for (const ev of events) {
    const key = monthKey(ev.starts_at)
    if (!map.has(key)) map.set(key, { label: monthLabel(ev.starts_at), events: [] })
    map.get(key)!.events.push(ev)
  }
  return Array.from(map.entries()).map(([key, g]) => ({ key, label: g.label, events: g.events }))
}

function formatDateTime(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt)
  const date = start.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ,
  })
  if (!endsAt) {
    const time = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    return `${date} · ${time}`
  }
  if (isSameCalendarDay(startsAt, endsAt)) {
    const t1 = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    const t2 = new Date(endsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    return `${date} · ${t1} – ${t2}`
  }
  // Multi-day: omit time, show date range only
  const startShort = start.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ,
  })
  const endFull = new Date(endsAt).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ,
  })
  return `${startShort} – ${endFull}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CalendarPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])

  return (
    <>
      <PageHero />
      <PdfDownloadStrip />
      <UpcomingSection events={upcoming} />
      {past.length > 0 && <PastSection events={past} />}
      <CtaBand />
      <CalendarStyles />
    </>
  )
}

// ─── Page Hero ────────────────────────────────────────────────────────────────

function PageHero() {
  const columbianYear = getColumbianYear()
  return (
    <section className="cal-hero">
      <div className="cal-hero-inner">
        <div>
          <nav className="cal-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="cal-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">Calendar</span>
          </nav>
          <span className="eyebrow">Events &amp; meetings · Columbian Year {columbianYear}</span>
          <h1>
            The year ahead at{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 500 }}>Council #6033.</em>
          </h1>
          <p className="cal-hero-lede">
            Every meeting, activity, and service event for Presentation Council #6033 &mdash;
            in one place, always up to date.
          </p>
        </div>

        <aside className="cal-hero-meta" aria-label="Schedule facts">
          <div className="cal-meta-row">
            <span className="cal-meta-k">Council meeting</span>
            <span className="cal-meta-v">3rd Wed · 7:30 PM</span>
          </div>
          <div className="cal-meta-row">
            <span className="cal-meta-k">Officers&rsquo; meeting</span>
            <span className="cal-meta-v">2nd Tue · 7:30 PM</span>
          </div>
          <div className="cal-meta-row">
            <span className="cal-meta-k">Location</span>
            <span className="cal-meta-v">Church of the Presentation</span>
          </div>
          <div className="cal-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="cal-meta-k">All events open to</span>
            <span className="cal-meta-v">Members &amp; parishioners</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── PDF Download Strip ───────────────────────────────────────────────────────

function PdfDownloadStrip() {
  return (
    <div className="cal-pdf-strip">
      <div className="wrap cal-pdf-wrap">
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary cal-pdf-btn"
        >
          <FileDownIcon />
          Download Annual Calendar (PDF)
        </a>
        <p className="cal-pdf-note">Printable annual calendar for Council #6033.</p>
      </div>
    </div>
  )
}

// ─── Upcoming Section ─────────────────────────────────────────────────────────

function UpcomingSection({ events }: { events: Event[] }) {
  const groups = groupByMonth(events)

  return (
    <section>
      <div className="wrap">
        <span className="eyebrow">What&rsquo;s ahead</span>
        <h2 className="cal-upcoming-h2">Upcoming events.</h2>
        <span className="flourish" />

        {events.length === 0 ? (
          <div className="cal-empty">
            <p className="cal-empty-msg">
              No upcoming events scheduled yet. Check back soon, or{' '}
              <Link href="/about#contact">contact the Grand Knight</Link>{' '}
              for the latest schedule.
            </p>
          </div>
        ) : (
          <div className="cal-upcoming-list">
            {groups.map((group) => (
              <div key={group.key}>
                <div className="cal-month-div">
                  <span className="cal-month-lbl">{group.label}</span>
                </div>
                {group.events.map((ev) => (
                  <UpcomingEventItem key={ev.id} event={ev} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function UpcomingEventItem({ event: ev }: { event: Event }) {
  const { month, day } = eventDateParts(ev.starts_at)
  const dow      = new Date(ev.starts_at).toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const typeLabel = EVENT_TYPE_LABEL[ev.event_type] ?? 'Event'
  const hasSignup = Boolean(ev.signup_url)

  const rsvpNote = (() => {
    if (ev.signup_deadline) {
      const dl = new Date(ev.signup_deadline)
      if (dl > new Date()) return `RSVP by ${shortDate(ev.signup_deadline)}`
    }
    return null
  })()

  return (
    <article className="cal-uitem">
      {/* Date badge */}
      <div className="cal-ubadge" aria-label={`${month} ${day}`}>
        <div className="cal-ubadge-month">{month}</div>
        <div className="cal-ubadge-day">{day}</div>
        <div className="cal-ubadge-dow">{dow}</div>
      </div>

      {/* Main content */}
      <div className="cal-uitem-body">
        <div className="cal-uitem-meta">
          <span className="cal-type-tag">{typeLabel}</span>
          {ev.location_name && (
            <span className="cal-uitem-loc">{ev.location_name}</span>
          )}
        </div>
        {ev.location_address && (
          <p className="cal-uitem-addr">{ev.location_address}</p>
        )}
        {ev.location_map_url && (
          <a
            href={ev.location_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cal-uitem-map"
          >
            📍 View map
          </a>
        )}
        <h3 className="cal-uitem-title">{ev.title}</h3>
        <p className="cal-uitem-dt">{formatDateTime(ev.starts_at, ev.ends_at)}</p>
        {ev.description && (
          <p className="cal-uitem-desc">{ev.description}</p>
        )}
        {hasSignup && (
          <div className="cal-uitem-actions">
            <a
              href={ev.signup_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary cal-signup-btn"
            >
              Sign Up →
            </a>
            {rsvpNote && <span className="cal-rsvp-note">{rsvpNote}</span>}
          </div>
        )}
      </div>

      {/* Thumbnail — omit if no image */}
      {ev.hero_image_url && (
        <div className="cal-uitem-thumb" aria-hidden="true">
          <Image
            src={ev.hero_image_url}
            alt={ev.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="160px"
          />
        </div>
      )}
    </article>
  )
}

// ─── Past Events Section ──────────────────────────────────────────────────────

function PastSection({ events }: { events: Event[] }) {
  const groups = groupByMonth(events)

  return (
    <section className="cal-past-section">
      <div className="wrap">
        <div className="cal-past-head">
          <h2 className="cal-past-h2">Past events</h2>
          <p className="cal-past-sub">Activities from the past six months.</p>
        </div>

        <div className="cal-past-list">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="cal-month-div cal-month-div--past">
                <span className="cal-month-lbl cal-month-lbl--past">{group.label}</span>
              </div>
              {group.events.map((ev) => (
                <PastEventItem key={ev.id} event={ev} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PastEventItem({ event: ev }: { event: Event }) {
  const { month, day } = eventDateParts(ev.starts_at)
  const dow       = new Date(ev.starts_at).toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const typeLabel = EVENT_TYPE_LABEL[ev.event_type] ?? 'Event'

  return (
    <article className="cal-pitem">
      <div className="cal-pbadge" aria-label={`${month} ${day}`}>
        <div className="cal-pbadge-month">{month}</div>
        <div className="cal-pbadge-day">{day}</div>
        <div className="cal-pbadge-dow">{dow}</div>
      </div>
      <div className="cal-pitem-body">
        <span className="cal-ptype-tag">{typeLabel}</span>
        <span className="cal-pitem-title">{ev.title}</span>
        {ev.location_name && (
          <span className="cal-pitem-loc">{ev.location_name}</span>
        )}
      </div>
    </article>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <section className="cal-cta-band">
      <div className="wrap">
        <div className="cal-cta-grid">
          <div>
            <span className="eyebrow" style={{ color: '#F7C04A' }}>Want to be part of it?</span>
            <h2 style={{ color: '#fff' }}>Come to a meeting. See for yourself.</h2>
            <span className="flourish" style={{ background: 'var(--color-gold)' }} />
            <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6 }}>
              Every event on this calendar is part of the life of Presentation Council #6033.
              All baptized Catholic men 18 and over are welcome to attend a council meeting
              &mdash; no commitment required.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/join" className="btn btn-on-navy">
                Begin Your Membership <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/about#contact"
                className="btn btn-secondary"
                style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
              >
                Contact us first
              </Link>
            </div>
          </div>

          <div className="cal-cta-card">
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>Next Meeting</h3>
            <span className="flourish" style={{ margin: '8px 0 12px', background: 'var(--color-gold)' }} />
            <div className="cal-cta-row">
              <span className="cal-cta-k">Council meeting</span>
              <span className="cal-cta-v">3rd Wed · 7:30 PM</span>
            </div>
            <div className="cal-cta-row">
              <span className="cal-cta-k">Officers&rsquo; meeting</span>
              <span className="cal-cta-v">2nd Tue · 7:30 PM</span>
            </div>
            <div className="cal-cta-row">
              <span className="cal-cta-k">Where</span>
              <span className="cal-cta-v">Church of the Presentation</span>
            </div>
            <div className="cal-cta-row" style={{ borderBottom: 'none' }}>
              <span className="cal-cta-k">Address</span>
              <span className="cal-cta-v">271 W Saddle River Rd, USR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function FileDownIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 18v-6" />
      <path d="M9 15l3 3 3-3" />
    </svg>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function CalendarStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .cal-hero {
        background: var(--color-surface-alt); position: relative; overflow: hidden;
      }
      .cal-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .cal-hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .cal-hero h1 { font-size: 52px; line-height: 1.05; }
      .cal-hero-lede { font-size: 18px; color: var(--color-ink-soft); max-width: 540px; margin: 18px 0 0; line-height: 1.55; }
      .cal-crumbs { font-size: 13px; color: var(--color-muted); font-family: var(--font-mono); letter-spacing: .04em; margin-bottom: 18px; display: flex; align-items: center; }
      .cal-crumbs a { color: var(--color-muted); }
      .cal-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .cal-crumbs-sep { margin: 0 8px; opacity: .5; }
      .cal-hero-meta { border-left: 3px solid var(--color-gold); padding: 6px 0 6px 22px; }
      .cal-meta-row { display: flex; justify-content: space-between; gap: 14px; font-size: 14px; border-bottom: 1px dashed var(--color-border-strong); padding-bottom: 12px; margin-bottom: 12px; }
      .cal-meta-k { color: var(--color-muted); }
      .cal-meta-v { color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); font-size: 13px; text-align: right; }
      @media (max-width: 880px) {
        .cal-hero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .cal-hero h1 { font-size: 38px; }
      }

      /* ── PDF strip ── */
      .cal-pdf-strip { background: #fff; border-bottom: 1px solid var(--color-border); padding: 18px 0; }
      .cal-pdf-wrap { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      .cal-pdf-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14.5px; padding: 11px 18px; }
      .cal-pdf-note { font-size: 13px; color: var(--color-muted); margin: 0; }

      /* ── Upcoming section ── */
      .cal-upcoming-h2 { font-size: 34px; }
      .cal-upcoming-list { margin-top: 8px; }

      /* Month divider */
      .cal-month-div { display: flex; align-items: center; gap: 14px; margin: 32px 0 4px; }
      .cal-month-div::after { content: ""; flex: 1; height: 1px; background: var(--color-border); }
      .cal-month-div:first-child { margin-top: 4px; }
      .cal-month-lbl {
        font-family: var(--font-sans); font-size: 11.5px; font-weight: 700;
        letter-spacing: .18em; text-transform: uppercase;
        color: var(--color-navy); white-space: nowrap;
      }

      /* Upcoming event item */
      .cal-uitem {
        display: flex; gap: 24px; align-items: flex-start;
        padding: 22px 0; border-bottom: 1px solid var(--color-border);
      }
      .cal-uitem:last-child { border-bottom: none; }

      /* Date badge */
      .cal-ubadge {
        flex-shrink: 0; width: 78px; text-align: center;
        background: #fff; border: 1px solid var(--color-border); border-radius: 6px;
        border-top: 3px solid var(--color-gold);
        padding: 8px 8px 10px; box-shadow: var(--shadow-sm);
      }
      .cal-ubadge-month { font-family: var(--font-sans); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--color-gold-dark); }
      .cal-ubadge-day { font-family: var(--font-serif); font-size: 34px; font-weight: 600; color: var(--color-navy); line-height: 1.1; margin: 2px 0; }
      .cal-ubadge-dow { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--color-muted); }

      /* Item body */
      .cal-uitem-body { flex: 1; min-width: 0; }
      .cal-uitem-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 5px; }
      .cal-type-tag {
        font-family: var(--font-sans); font-weight: 600; font-size: 11.5px;
        letter-spacing: .06em; text-transform: uppercase;
        color: var(--color-navy); background: var(--color-surface-alt);
        padding: 3px 8px; border-radius: 3px;
      }
      .cal-uitem-loc { font-size: 13px; color: var(--color-muted); }
      .cal-uitem-title { font-size: 22px; color: var(--color-navy); margin: 0 0 4px; line-height: 1.2; }
      .cal-uitem-dt { font-family: var(--font-mono); font-size: 13px; color: var(--color-muted); margin: 0 0 8px; letter-spacing: .02em; }
      .cal-uitem-desc { font-size: 15px; color: var(--color-ink-soft); line-height: 1.55; margin: 0; }
      .cal-uitem-addr { font-size: 13px; color: var(--color-muted); margin: 3px 0 0; }
      .cal-uitem-map { font-size: 12.5px; color: var(--color-muted); text-decoration: none; display: inline-block; margin-top: 2px; }
      .cal-uitem-map:hover { color: var(--color-navy); text-decoration: underline; }
      .cal-uitem-actions { margin-top: 14px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .cal-signup-btn { font-size: 14px; padding: 10px 18px; }
      .cal-rsvp-note { font-family: var(--font-mono); font-size: 12.5px; color: var(--color-muted); }

      /* Thumbnail */
      .cal-uitem-thumb {
        flex-shrink: 0; position: relative; width: 148px; height: 111px;
        border-radius: 5px; overflow: hidden;
        border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);
      }
      @media (max-width: 880px) {
        .cal-uitem-thumb { display: none; }
        .cal-ubadge-day { font-size: 28px; }
        .cal-ubadge { width: 68px; }
        .cal-uitem { gap: 16px; }
      }

      /* Empty state */
      .cal-empty { padding: 40px 0 20px; }
      .cal-empty-msg { font-size: 17px; color: var(--color-ink-soft); line-height: 1.6; max-width: 560px; }
      .cal-empty-msg a { color: var(--color-navy); font-weight: 600; }

      /* ── Past section ── */
      .cal-past-section { background: var(--color-surface-alt); border-top: 2px solid var(--color-border); }
      .cal-past-head { margin-bottom: 4px; }
      .cal-past-h2 { font-family: var(--font-serif); font-size: 20px; font-weight: 600; color: #4a5568; margin: 0; }
      .cal-past-sub { font-size: 13.5px; color: #6b7280; margin: 5px 0 0; }

      .cal-month-div--past { margin: 20px 0 4px; }
      .cal-month-div--past::after { background: #d1d5db; }
      .cal-month-lbl--past { color: #6b7280; font-size: 10.5px; letter-spacing: .14em; }

      .cal-past-list { margin-top: 8px; }
      .cal-pitem {
        display: flex; gap: 16px; align-items: center;
        padding: 10px 0; border-bottom: 1px solid #e5e7eb;
      }
      .cal-pitem:last-child { border-bottom: none; }

      /* Past date badge */
      .cal-pbadge {
        flex-shrink: 0; width: 58px; text-align: center;
        background: #f9fafb; border: 1px solid #d1d5db; border-radius: 5px;
        border-top: 3px solid #9ca3af; padding: 5px 6px 7px;
      }
      .cal-pbadge-month { font-family: var(--font-sans); font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #9ca3af; }
      .cal-pbadge-day { font-family: var(--font-serif); font-size: 20px; font-weight: 600; color: #4b5563; line-height: 1.15; margin: 1px 0; }
      .cal-pbadge-dow { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: .08em; text-transform: uppercase; color: #9ca3af; }

      /* Past item body */
      .cal-pitem-body { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; flex: 1; min-width: 0; }
      .cal-ptype-tag {
        font-family: var(--font-sans); font-size: 10.5px; font-weight: 600;
        letter-spacing: .06em; text-transform: uppercase;
        color: #9ca3af; background: #f3f4f6; padding: 2px 6px; border-radius: 2px; flex-shrink: 0;
      }
      .cal-pitem-title { font-family: var(--font-serif); font-size: 15px; font-weight: 600; color: #374151; }
      .cal-pitem-loc { font-size: 12.5px; color: #9ca3af; font-family: var(--font-mono); margin-left: auto; white-space: nowrap; }
      @media (max-width: 640px) { .cal-pitem-loc { display: none; } }

      /* ── CTA Band ── */
      .cal-cta-band {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .cal-cta-band::before {
        content: ""; position: absolute; left: -120px; bottom: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
      }
      .cal-cta-grid { display: grid; grid-template-columns: 1.3fr .9fr; gap: 48px; align-items: center; position: relative; }
      .cal-cta-grid h2 { color: #fff; font-size: 36px; }
      @media (max-width: 880px) { .cal-cta-grid { grid-template-columns: 1fr; gap: 28px; } }
      .cal-cta-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.18); border-radius: 6px; padding: 24px; backdrop-filter: blur(2px); }
      .cal-cta-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,.15); font-size: 14px; }
      .cal-cta-row:last-child { border-bottom: none; }
      .cal-cta-k { color: #cfd6e8; }
      .cal-cta-v { color: #fff; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
    `}</style>
  )
}
