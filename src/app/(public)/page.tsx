import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import { eventDateParts, shortWeekdayTimeRange, shortWeekdayDateTimeRange, monthYearPill, shortDate, formatTimeRange } from '@/lib/utils/dates'
import { PillarsGrid } from '@/components/PillarsGrid'
import { getSiteSettings, type SiteSettingsMap } from '@/lib/site-settings'
import { getYearsServing } from '@/lib/utils/yearsServing'

// ─── Data fetching ──────────────────────────────────────────────────────────

async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

async function getNextThreeEvents(): Promise<Pick<Event, 'id' | 'title' | 'starts_at' | 'ends_at'>[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('events')
      .select('id, title, starts_at, ends_at')
      .eq('is_published', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

async function getGrandKnight(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('officers')
      .select('full_name')
      .eq('title', 'Grand Knight')
      .eq('is_published', true)
      .limit(1)
      .single()
    if (!data) {
      console.warn('[homepage] No Grand Knight row found in officers table')
      return null
    }
    return data.full_name
  } catch {
    console.warn('[homepage] Failed to fetch Grand Knight name')
    return null
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const EVENT_TYPE_LABEL: Record<string, string> = {
  council_meeting:   'Meeting',
  officers_meeting:  'Officers',
  volunteer_activity:'Volunteer',
  social_event:      'Social',
  charity_event:     'Charity',
  degree_ceremony:   'Degree',
  other:             'Event',
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [upcomingEvents, nextEvents, grandKnightName, settings] = await Promise.all([
    getUpcomingEvents(),
    getNextThreeEvents(),
    getGrandKnight(),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSection settings={settings} />
      <WelcomeSection nextEvents={nextEvents} grandKnightName={grandKnightName} settings={settings} />
      <PillarsSection settings={settings} />
      <ImpactSection settings={settings} />
      <ActivitiesSection events={upcomingEvents} />
      <JoinSection />
      <HistorySection settings={settings} />
      <HomeStyles />
    </>
  )
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function HeroSection({ settings }: { settings: SiteSettingsMap }) {
  return (
    <section className="hero-section">
      <div className="hero-inner">

        {/* Left — copy */}
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            Presentation Council · Est. 1968
          </span>

          <h1>
            Faith, family, and <em>fraternity</em> —{' '}
            rooted at Presentation Parish.
          </h1>

          <p className="hero-lede">
            We are Catholic men of Upper Saddle River, Saddle River, Allendale,
            and the surrounding towns — gathering each month to serve our parish,
            support our neighbors in need, and grow as husbands, fathers, and disciples.
          </p>

          <div className="hero-cta-row">
            <Link href="/join" className="btn btn-primary">
              Join Our Brotherhood <span aria-hidden="true">→</span>
            </Link>
            <Link href="/charities" className="btn btn-secondary">
              Support Our Charities
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">{getYearsServing()}</div>
              <div className="stat-lbl">Years serving the parish</div>
            </div>
            <div className="stat">
              <div className="stat-num">{settings.active_members}</div>
              <div className="stat-lbl">Active brother knights</div>
            </div>
            <div className="stat">
              <div className="stat-num">{settings.charity_raised}</div>
              <div className="stat-lbl">Raised for charity in {settings.reporting_year}</div>
            </div>
          </div>
        </div>

        {/* Right — photo */}
        <div className="hero-photo">
          <div className="photo-frame">
            <div className="hero-photo-wrap">
              <Image
                src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/hero.png"
                alt="Our Knights helping the Soup Kitchen Ministry"
                fill
                className="hero-photo-img"
                sizes="(max-width: 980px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="photo-caption">Our Knights helping the Soup Kitchen Ministry</div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Welcome / Grand Knight ─────────────────────────────────────────────────

function WelcomeSection({
  nextEvents,
  grandKnightName,
  settings,
}: {
  nextEvents: Pick<Event, 'id' | 'title' | 'starts_at' | 'ends_at'>[]
  grandKnightName: string | null
  settings: SiteSettingsMap
}) {
  return (
    <section className="welcome-section">
      <div className="wrap">
        <div className="welcome-grid">

          {/* Grand Knight quote */}
          <div className="welcome-quote">
            <span className="eyebrow">A word from the Grand Knight</span>
            <span className="flourish" />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', lineHeight: 1.45, color: 'var(--color-ink)', fontWeight: 400, margin: 0 }}>
              <span className="opening-quote">&ldquo;</span>
              {settings.grand_knight_quote}
            </p>
            <div className="welcome-attrib">
              <span className="attrib-line" />
              {grandKnightName ? (
                <span>
                  <strong style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                    {grandKnightName}
                  </strong>
                  {' '}· Grand Knight, 2025–2026
                </span>
              ) : (
                <span style={{ color: 'var(--color-muted)' }}>Grand Knight</span>
              )}
            </div>
          </div>

          {/* Upcoming events sidebar */}
          <aside className="welcome-side" aria-label="Coming up at the council">
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-navy)', fontSize: '17px', marginBottom: '4px' }}>
              Coming up at Council #6033
            </h4>
            <span className="flourish" style={{ margin: '6px 0 4px' }} />

            {nextEvents.length > 0 ? (
              <ul className="week-list">
                {nextEvents.map((ev) => (
                  <li key={ev.id} className="week-item">
                    <span className="week-what">{ev.title}</span>
                    <span className="week-when">{shortWeekdayDateTimeRange(ev.starts_at, ev.ends_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--color-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
                No upcoming events scheduled —{' '}
                <Link href="/calendar" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                  see the full calendar
                </Link>
                .
              </p>
            )}
          </aside>

        </div>
      </div>
    </section>
  )
}

// ─── Four Pillars ───────────────────────────────────────────────────────────

function PillarsSection({ settings }: { settings: SiteSettingsMap }) {
  return (
    <section className="pillars-section">
      <div className="wrap">
        <div className="pillars-head">
          <div>
            <span className="eyebrow">Our principles</span>
            <h2>Four pillars, one fraternity.</h2>
            <span className="flourish" />
          </div>
          <p className="pillars-desc">
            Founded in 1882 by Blessed Michael McGivney, the Knights stand on four principles.
            Our council lives them out at the parish level — week in, week out.
          </p>
        </div>

        <PillarsGrid
          charityRaised={settings.charity_raised}
          reportingYear={settings.reporting_year}
          parishEventsPerYear={settings.parish_events_per_year}
          activeMembers={settings.active_members}
          fourthDegreeKnights={settings.fourth_degree_knights}
        />
      </div>
    </section>
  )
}

// ─── Impact band ────────────────────────────────────────────────────────────

function ImpactSection({ settings }: { settings: SiteSettingsMap }) {
  return (
    <section className="impact-section">
      <div className="wrap">
        <div className="impact-head">
          <span className="eyebrow" style={{ color: '#F7C04A' }}>Our {settings.reporting_year} impact</span>
          <h2 style={{ color: '#fff' }}>What 100 brothers can do, by God&rsquo;s grace.</h2>
          <span className="flourish" />
          <p style={{ color: '#cfd6e8', fontSize: '17px', margin: 0 }}>
            Every dollar, every hour, every coat — accounted for and given back to our parish,
            our town, and the families who call us neighbor.
          </p>
        </div>
        <div className="impact-grid">
          <ImpactCell num={settings.charity_raised} lbl="Donated to charity this year"        sub="// food pantry · seminarians · pro-life" />
          <ImpactCell num={settings.volunteer_hours} lbl="Volunteer hours logged"              sub="" />
          <ImpactCell num={settings.covenant_house_donation} lbl="Donated to Covenant House New Jersey" sub={`// Covenant House New Jersey · ${settings.reporting_year}`} />
          <ImpactCell num={settings.new_brothers} lbl="New brothers welcomed"                  sub={`// exemplified at Presentation, ${settings.reporting_year}`} />
        </div>
      </div>
    </section>
  )
}

function ImpactCell({ num, lbl, sub }: { num: string; lbl: string; sub: string }) {
  return (
    <div className="impact-cell">
      <div className="impact-num">{num}</div>
      <div className="impact-lbl">{lbl}</div>
      <div className="impact-sub">{sub}</div>
    </div>
  )
}

// ─── Activities + sidebar ───────────────────────────────────────────────────

function ActivitiesSection({ events }: { events: Event[] }) {
  return (
    <section>
      <div className="wrap">
        <div className="activities-wrap">

          {/* ── Events list ── */}
          <div>
            <span className="eyebrow">What&rsquo;s ahead</span>
            <h2>Upcoming activities at the council.</h2>
            <span className="flourish" />
            <p style={{ color: 'var(--color-muted)', maxWidth: '560px', marginTop: '6px' }}>
              All events at Church of the Presentation unless otherwise noted.
              Members and parishioners welcome — bring a friend.
            </p>

            <div className="activity-list">
              {events.length > 0 ? events.map((ev) => (
                <EventRow key={ev.id} event={ev} />
              )) : (
                <p style={{ padding: '32px 0', color: 'var(--color-muted)', fontSize: '15px' }}>
                  No upcoming events yet —{' '}
                  <Link href="/calendar" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                    check the full calendar
                  </Link>
                  .
                </p>
              )}
            </div>

            <div style={{ marginTop: '28px' }}>
              <Link href="/calendar" className="btn btn-secondary">
                View full calendar →
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="sidebar" aria-label="Council details">

            {/* Meeting info card */}
            <div className="card">
              <span className="eyebrow" style={{ fontSize: '12px' }}>Council essentials</span>
              <h3 style={{ marginTop: '4px' }}>Where &amp; when we meet</h3>
              <span className="flourish" />
              <div className="meeting-row">
                <span className="meeting-k">Council meeting</span>
                <span className="meeting-v">3rd Wed · 7:30 PM</span>
              </div>
              <div className="meeting-row">
                <span className="meeting-k">Officers&rsquo; meeting</span>
                <span className="meeting-v">2nd Tue · 7:30 PM</span>
              </div>
              <div className="meeting-row">
                <span className="meeting-k">Location</span>
                <span className="meeting-v">Church of the Presentation</span>
              </div>
              <div className="meeting-row">
                <span className="meeting-k">Address</span>
                <span className="meeting-v">271 W Saddle River Rd</span>
              </div>
              <div className="meeting-row" style={{ borderBottom: 'none' }}>
                <span className="meeting-k">City</span>
                <span className="meeting-v">Upper Saddle River, NJ</span>
              </div>
              <p className="meeting-note">
                All baptized Catholic men 18 and over are welcome to attend a
                meeting and learn more — no commitment required.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </section>
  )
}

function EventRow({ event }: { event: Event }) {
  const { month, day, dowYear } = eventDateParts(event.starts_at)
  const tag = EVENT_TYPE_LABEL[event.event_type] ?? 'Event'
  const timeDisplay = formatTimeRange(event.starts_at, event.ends_at)
  const locationTime = [event.location_name, timeDisplay].filter(Boolean).join(' · ')
  const hasSignup = Boolean(event.signup_url)

  const rsvpText = (() => {
    if (event.signup_deadline) {
      const dl = new Date(event.signup_deadline)
      if (dl > new Date()) return `RSVP by ${shortDate(event.signup_deadline)}`
    }
    return 'All welcome'
  })()

  return (
    <article className="activity-row">
      <div className="activity-date">
        <div className="activity-month">{month}</div>
        <div className="activity-day">{day}</div>
        <div className="activity-dowyear">{dowYear}</div>
      </div>

      <div className="activity-body">
        <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>{event.title}</h3>
        {event.description && (
          <p style={{ fontSize: '15px', color: 'var(--color-ink-soft)', margin: 0, lineHeight: 1.5, maxWidth: '520px' }}>
            {event.description}
          </p>
        )}
        <div className="activity-meta">
          <span className="activity-tag">{tag}</span>
          {locationTime && <span>{locationTime}</span>}
        </div>
      </div>

      <div className="activity-right">
        {hasSignup ? (
          <a className="btn btn-ghost" href={event.signup_url!} target="_blank" rel="noopener noreferrer">
            Sign Up →
          </a>
        ) : (
          <Link className="btn btn-ghost" href="/calendar">
            Details →
          </Link>
        )}
        <div className="activity-rsvp">{rsvpText}</div>
      </div>
    </article>
  )
}

// ─── Join CTA ───────────────────────────────────────────────────────────────

function JoinSection() {
  return (
    <section className="join-section">
      <div className="wrap">
        <div className="join-grid">

          <div className="join-copy">
            <span className="eyebrow" style={{ color: '#F7C04A' }}>Join the Knights</span>
            <h2 style={{ color: '#fff' }}>Become the man your family deserves.</h2>
            <span className="flourish" />
            <p style={{ color: '#cfd6e8', fontSize: '17px', lineHeight: 1.6, margin: '0 0 18px' }}>
              Membership at Council #6033 is open to practical Catholic men, 18 years or older,
              in communion with the Holy See. The first step is the easiest one: come to a meeting.
            </p>
            <ul className="join-benefits">
              <li>Grow in faith with brothers who hold you to it.</li>
              <li>Serve your parish in concrete, hands-on ways.</li>
              <li>Protect your family with member-only insurance and benefits.</li>
              <li>Pass something good on to your sons and grandsons.</li>
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
              <Link href="/join" className="btn btn-on-navy">
                Begin Your Membership <span aria-hidden="true">→</span>
              </Link>
              <Link href="/about#contact" className="btn btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
                Talk to a Knight first
              </Link>
            </div>
          </div>

          <div className="join-card">
            <span className="eyebrow">How it works</span>
            <h3>Three simple steps.</h3>
            <span className="flourish" />
            <ol className="join-steps">
              <li>
                <div>
                  <strong>Reach out</strong>
                  <span>Email our Membership Director or fill out the short interest form. We&rsquo;ll call within a week.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Visit a meeting</strong>
                  <span>Join us on the third Wednesday of any month. No obligation, just refreshments, conversation, and a look behind the curtain.</span>
                </div>
              </li>
              <li>
                <div>
                  <strong>Take your degree</strong>
                  <span>When you&rsquo;re ready, complete the Exemplification of Charity, Unity, and Fraternity — and you&rsquo;re a brother knight.</span>
                </div>
              </li>
            </ol>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── History ────────────────────────────────────────────────────────────────

function HistorySection({ settings }: { settings: SiteSettingsMap }) {
  return (
    <section style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <div className="history-grid">

          {/* Charter card — temp emblem stand-in until real photo is available */}
          <div aria-hidden="true">
            <div className="photo-frame" style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '5 / 4', background: '#f5f2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image
                  src="/kofc-emblem.png"
                  alt="Knights of Columbus emblem"
                  width={220}
                  height={220}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="photo-caption">Original charter signed by Supreme Knight John W. McDevitt // council archive · framed in hall</div>
            </div>
          </div>

          <div>
            <span className="eyebrow">A short history</span>
            <h2>{getYearsServing()} years of brothers, one parish.</h2>
            <span className="flourish" />
            <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
              Presentation Council #6033 was chartered in May 1968 at Church of the Presentation
              in Upper Saddle River, New Jersey. From its first pancake breakfast that autumn to
              today, the council has been bound to the rhythms of parish life here.
            </p>
            <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
              We have buried our brothers and welcomed new ones; we have served multiple pastors and
              seen the parish grow around us. The work has never changed: support the priest, care
              for the poor, and walk together in faith.
            </p>
            <div className="timeline">
              <TimelineNode year="1968" label="Council chartered" />
              <TimelineNode year="2000" label="First Charity Golf Outing" />
              <TimelineNode year={settings.reporting_year} label={`${settings.charity_raised} raised for charity`} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function TimelineNode({ year, label }: { year: string; label: string }) {
  return (
    <div className="tnode">
      <div className="tnode-year">{year}</div>
      <div className="tnode-label">{label}</div>
    </div>
  )
}

// ─── Page-scoped styles ──────────────────────────────────────────────────────

function HomeStyles() {
  return (
    <style>{`
      /* ── Hero ── */
      .hero-section { background: var(--color-surface-alt); padding: 0; overflow: hidden; }
      .hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 64px 32px 72px;
        display: grid; grid-template-columns: 1.05fr .95fr; gap: 56px; align-items: center;
      }
      .hero-badge {
        display: inline-flex; align-items: center; gap: 10px;
        background: #fff; border: 1px solid var(--color-border); border-radius: 999px;
        padding: 6px 14px; font-size: 13px; color: var(--color-ink-soft); font-weight: 500;
        margin-bottom: 22px;
      }
      .hero-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-gold); flex-shrink: 0; }
      .hero-copy h1 { font-size: 60px; line-height: 1.05; }
      .hero-copy h1 em { font-style: italic; color: var(--color-navy); font-weight: 500; }
      .hero-lede { font-size: 19px; line-height: 1.55; color: var(--color-ink-soft); margin: 22px 0 28px; max-width: 560px; }
      .hero-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
      .hero-stats {
        display: flex; flex-wrap: wrap; gap: 28px; margin-top: 36px;
        border-top: 1px solid var(--color-border-strong); padding-top: 24px;
      }
      .stat-num { font-family: var(--font-serif); font-size: 32px; color: var(--color-navy); font-weight: 600; line-height: 1; }
      .stat-lbl { font-size: 13px; color: var(--color-muted); margin-top: 6px; letter-spacing: .02em; }

      /* Hero photo */
      .hero-photo { position: relative; }
      .photo-frame {
        position: relative; border-radius: 6px; overflow: hidden;
        background: #fff; border: 1px solid var(--color-border); box-shadow: var(--shadow-lift);
      }
      .hero-photo-wrap { position: relative; width: 100%; aspect-ratio: 4 / 3; }
      .hero-photo-img { object-fit: cover; }
      .photo-placeholder {
        width: 100%; aspect-ratio: 4 / 5;
        background: repeating-linear-gradient(135deg, rgba(0,48,135,.06) 0 14px, rgba(0,48,135,.10) 14px 28px),
          linear-gradient(180deg, #dfe6f1, #c8d3e4);
        display: flex; align-items: center; justify-content: center;
        color: var(--color-navy-dark);
      }
      .ph-inner {
        text-align: center; font-family: var(--font-mono); font-size: 12px;
        background: rgba(255,255,255,.85); padding: 14px 18px; border-radius: 3px;
        border: 1px solid rgba(0,31,92,.18); max-width: 78%; letter-spacing: .04em;
        line-height: 1.6;
      }
      .ph-title { font-family: var(--font-serif); font-size: 16px; font-weight: 600; color: var(--color-navy); margin-bottom: 4px; letter-spacing: 0; }
      .photo-caption {
        position: absolute; left: 18px; bottom: 18px;
        background: rgba(0,31,92,.92); color: #fff;
        font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .04em;
        padding: 7px 12px; border-radius: 3px; border-left: 3px solid var(--color-gold);
      }
      @media (max-width: 980px) {
        .hero-inner { grid-template-columns: 1fr; gap: 36px; padding: 40px 24px 48px; }
        .hero-copy h1 { font-size: 42px; }
      }

      /* ── Welcome ── */
      .welcome-section { background: #fff; border-bottom: 1px solid var(--color-border); }
      .welcome-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 56px; align-items: start; }
      .opening-quote { font-size: 62px; line-height: .4; color: var(--color-gold); vertical-align: -12px; margin-right: 6px; font-family: var(--font-serif); }
      .welcome-attrib { margin-top: 24px; font-size: 14px; color: var(--color-muted); display: flex; align-items: center; gap: 14px; }
      .attrib-line { width: 36px; height: 1px; background: var(--color-border-strong); flex-shrink: 0; }
      .welcome-side {
        background: var(--color-surface-alt); border-radius: 6px; padding: 28px;
        border-left: 4px solid var(--color-gold);
      }
      .week-list { list-style: none; padding: 0; margin: 14px 0 0; }
      .week-item {
        display: flex; justify-content: space-between; gap: 14px;
        padding: 12px 0; border-bottom: 1px dashed var(--color-border-strong); font-size: 14.5px;
      }
      .week-item:last-child { border-bottom: none; }
      .week-what { color: var(--color-ink-soft); font-weight: 500; }
      .week-when { color: var(--color-muted); font-variant-numeric: tabular-nums; font-family: var(--font-mono); font-size: 12.5px; white-space: nowrap; }
      @media (max-width: 880px) { .welcome-grid { grid-template-columns: 1fr; gap: 32px; } }

      /* ── Pillars ── */
      .pillars-section { background: var(--color-surface-alt); }
      .pillars-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 36px; flex-wrap: wrap; }
      .pillars-head h2 { font-size: 36px; }
      .pillars-desc { max-width: 420px; color: var(--color-ink-soft); font-size: 16px; margin: 0; }

      /* ── Impact ── */
      .impact-section { background: var(--color-navy); color: #fff; position: relative; overflow: hidden; }
      .impact-section::before {
        content: ""; position: absolute; inset: 0;
        background: radial-gradient(60% 80% at 85% 20%, rgba(242,169,0,.10), transparent 60%);
      }
      .impact-section .wrap { position: relative; }
      .impact-head { max-width: 680px; margin-bottom: 36px; }
      .impact-head .flourish { background: var(--color-gold); }
      .impact-grid {
        display: grid; grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid rgba(255,255,255,.18);
      }
      .impact-cell { padding: 30px 24px 30px 0; border-right: 1px solid rgba(255,255,255,.18); }
      .impact-cell:last-child { border-right: none; }
      .impact-num { font-family: var(--font-serif); font-size: 46px; font-weight: 600; color: var(--color-gold); line-height: 1; }
      .impact-lbl { font-size: 14.5px; color: #dde3f1; margin-top: 10px; line-height: 1.4; }
      .impact-sub { font-size: 12.5px; color: #9aa6c4; margin-top: 6px; font-family: var(--font-mono); }
      @media (max-width: 880px) {
        .impact-grid { grid-template-columns: repeat(2, 1fr); }
        .impact-cell { border-bottom: 1px solid rgba(255,255,255,.18); padding: 24px 20px 24px 0; }
        .impact-cell:nth-child(2) { border-right: none; }
        .impact-cell:nth-child(3), .impact-cell:nth-child(4) { border-bottom: none; }
      }

      /* ── Activities ── */
      .activities-wrap { display: grid; grid-template-columns: 1.55fr 1fr; gap: 48px; align-items: start; }
      .activity-list { display: flex; flex-direction: column; margin-top: 32px; border-top: 1px solid var(--color-border); }
      .activity-row {
        display: grid; grid-template-columns: 120px 1fr auto; gap: 28px;
        padding: 24px 0; border-bottom: 1px solid var(--color-border); align-items: start;
      }
      .activity-date { font-family: var(--font-serif); color: var(--color-navy); }
      .activity-month { font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); font-weight: 600; font-family: var(--font-sans); }
      .activity-day { font-size: 38px; font-weight: 600; line-height: 1; margin-top: 4px; }
      .activity-dowyear { font-size: 13px; color: var(--color-muted); margin-top: 4px; font-family: var(--font-mono); }
      .activity-meta { margin-top: 10px; font-size: 13px; color: var(--color-muted); display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
      .activity-tag {
        font-family: var(--font-sans); font-weight: 600; font-size: 11.5px;
        letter-spacing: .06em; text-transform: uppercase;
        color: var(--color-navy); background: var(--color-surface-alt); padding: 3px 8px; border-radius: 3px;
      }
      .activity-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding-top: 6px; }
      .activity-rsvp { font-size: 12.5px; color: var(--color-muted); font-family: var(--font-mono); white-space: nowrap; }

      /* Sidebar */
      .sidebar { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 24px; }
      .meeting-row { display: flex; justify-content: space-between; font-size: 14px; padding: 10px 0; border-bottom: 1px dashed var(--color-border-strong); }
      .meeting-k { color: var(--color-muted); }
      .meeting-v { color: var(--color-ink); font-weight: 600; font-family: var(--font-mono); font-size: 13px; }
      .meeting-note { margin-top: 12px; font-size: 13px; color: var(--color-ink-soft); line-height: 1.5; }

      @media (max-width: 980px) {
        .activities-wrap { grid-template-columns: 1fr; gap: 32px; }
        .sidebar { position: static; }
        .activity-row { grid-template-columns: 80px 1fr; gap: 20px; }
        .activity-right { grid-column: 1 / -1; flex-direction: row; justify-content: space-between; align-items: center; }
      }

      /* ── Join ── */
      .join-section {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .join-section::before {
        content: ""; position: absolute; left: -120px; bottom: -120px; width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
      }
      .join-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 56px; align-items: center; position: relative; }
      .join-copy h2 { color: #fff; font-size: 40px; }
      .join-copy .flourish { background: var(--color-gold); }
      .join-benefits { margin: 18px 0 28px; padding: 0; list-style: none; }
      .join-benefits li { display: flex; gap: 12px; padding: 8px 0; color: #dde3f1; font-size: 15.5px; }
      .join-benefits li::before { content: ""; width: 6px; height: 6px; background: var(--color-gold); border-radius: 50%; margin-top: 11px; flex-shrink: 0; }
      .join-card {
        background: #fff; color: var(--color-ink); border-radius: 8px; padding: 32px 28px;
        box-shadow: var(--shadow-lift);
      }
      .join-card h3 { font-size: 22px; }
      .join-card .flourish { margin-top: 8px; }
      .join-steps { counter-reset: step; list-style: none; padding: 0; margin: 18px 0 0; }
      .join-steps li {
        counter-increment: step; display: grid; grid-template-columns: 38px 1fr; gap: 14px;
        padding: 14px 0; border-bottom: 1px solid var(--color-border); align-items: start;
      }
      .join-steps li:last-child { border-bottom: none; }
      .join-steps li::before {
        content: counter(step, decimal-leading-zero);
        font-family: var(--font-serif); font-size: 18px; color: var(--color-gold-dark); font-weight: 600;
      }
      .join-steps strong { color: var(--color-navy); display: block; font-family: var(--font-serif); font-size: 16px; margin-bottom: 2px; }
      .join-steps span { color: var(--color-ink-soft); font-size: 14px; line-height: 1.45; }
      @media (max-width: 880px) { .join-grid { grid-template-columns: 1fr; gap: 32px; } }

      /* ── History ── */
      .history-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 56px; align-items: center; }
      .timeline { display: flex; gap: 32px; margin-top: 28px; flex-wrap: wrap; }
      .tnode-year { font-family: var(--font-serif); font-size: 24px; color: var(--color-navy); font-weight: 600; }
      .tnode-label { font-size: 13px; color: var(--color-muted); margin-top: 4px; max-width: 160px; line-height: 1.35; }
      @media (max-width: 880px) { .history-grid { grid-template-columns: 1fr; gap: 32px; } }
    `}</style>
  )
}
