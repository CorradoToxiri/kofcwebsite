import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event, NewsPost } from '@/lib/supabase/types'
import { eventDateParts, shortWeekdayTime, monthYearPill, shortDate } from '@/lib/utils/dates'

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

async function getThisWeekEvents(): Promise<Pick<Event, 'id' | 'title' | 'starts_at'>[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const now = new Date()
    const weekEnd = new Date(now)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const { data } = await supabase
      .from('events')
      .select('id, title, starts_at')
      .eq('is_published', true)
      .gte('starts_at', now.toISOString())
      .lte('starts_at', weekEnd.toISOString())
      .order('starts_at', { ascending: true })
      .limit(6)
    return data ?? []
  } catch {
    return []
  }
}

async function getLatestNews(): Promise<Pick<NewsPost, 'id' | 'title' | 'summary' | 'published_at'> | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('news')
      .select('id, title, summary, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
    return data ?? null
  } catch {
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
  const [upcomingEvents, weekEvents, latestNews] = await Promise.all([
    getUpcomingEvents(),
    getThisWeekEvents(),
    getLatestNews(),
  ])

  return (
    <>
      <HeroSection />
      <WelcomeSection weekEvents={weekEvents} />
      <PillarsSection />
      <ImpactSection />
      <ActivitiesSection events={upcomingEvents} latestNews={latestNews} />
      <JoinSection />
      <HistorySection />
      <HomeStyles />
    </>
  )
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function HeroSection() {
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
              <div className="stat-num">58</div>
              <div className="stat-lbl">Years serving the parish</div>
            </div>
            <div className="stat">
              <div className="stat-num">100+</div>
              <div className="stat-lbl">Active brother knights</div>
            </div>
            <div className="stat">
              <div className="stat-num">$47K</div>
              <div className="stat-lbl">Raised for charity in 2025</div>
            </div>
          </div>
        </div>

        {/* Right — photo placeholder */}
        <div className="hero-photo" aria-hidden="true">
          <div className="photo-frame">
            <div className="photo-placeholder">
              <div className="ph-inner">
                <div className="ph-title">Hero photograph</div>
                Brothers gathered after the<br />
                annual Tootsie Roll Drive · 2025<br />
                <span style={{ color: 'var(--color-muted)' }}>// supplied by council photo library</span>
              </div>
            </div>
            <div className="photo-caption">PHOTO_01 · COUNCIL ARCHIVE</div>
          </div>
          <div className="hero-stamp">
            <div className="stamp-seal">VI</div>
            <div className="stamp-text">
              <strong>Council #6033</strong>
              Chartered May 1968
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Welcome / Grand Knight ─────────────────────────────────────────────────

function WelcomeSection({
  weekEvents,
}: {
  weekEvents: Pick<Event, 'id' | 'title' | 'starts_at'>[]
}) {
  return (
    <section className="welcome-section">
      <div className="wrap">
        <div className="welcome-grid">

          {/* Grand Knight quote */}
          <div className="welcome-quote">
            <span className="eyebrow">A word from the Grand Knight</span>
            <span className="flourish" />
            {/* TODO: Replace with real Grand Knight name and welcome message — awaiting content from council */}
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', lineHeight: 1.45, color: 'var(--color-ink)', fontWeight: 400, margin: 0 }}>
              <span className="opening-quote">&ldquo;</span>
              Whether you have been a Knight for forty years or are simply curious
              about who we are, you have a brother in this council. Come to a meeting,
              share a meal, and see for yourself what fraternity feels like at Presentation.
            </p>
            <div className="welcome-attrib">
              <span className="attrib-line" />
              {/* TODO: Replace with real Grand Knight name */}
              <span>
                <strong style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
                  [Grand Knight Name]
                </strong>
                {' '}· Grand Knight, 2025–2026
              </span>
            </div>
          </div>

          {/* This week sidebar */}
          <aside className="welcome-side" aria-label="This week at the council">
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-navy)', fontSize: '17px', marginBottom: '4px' }}>
              This week at Council #6033
            </h4>
            <span className="flourish" style={{ margin: '6px 0 4px' }} />

            {weekEvents.length > 0 ? (
              <ul className="week-list">
                {weekEvents.map((ev) => (
                  <li key={ev.id} className="week-item">
                    <span className="week-what">{ev.title}</span>
                    <span className="week-when">{shortWeekdayTime(ev.starts_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--color-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
                No events scheduled this week —{' '}
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

function PillarsSection() {
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

        <div className="pillars-grid">
          <PillarCard
            num="I."
            title="Charity"
            body="From the food pantry collection to the Coats for Kids drive, we are our parish's hands and feet for those in need."
            meta="$47,200 given in 2025"
            icon={
              <path d="M12 21s-7-4.5-9.2-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.2 12c-2.2 4.5-9.2 9-9.2 9z"
                stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
            }
          />
          <PillarCard
            num="II."
            title="Unity"
            body="None of us is as good as all of us. We work shoulder-to-shoulder with our pastor, our parish, and our community."
            meta="12 parish events / year"
            icon={<>
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M3.5 12h17M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17"
                stroke="currentColor" strokeWidth="1.6" fill="none" />
            </>}
          />
          <PillarCard
            num="III."
            title="Fraternity"
            body="A circle of Catholic men who hold each other up — at first communions and at funerals, in joys and in trials."
            meta="100 brother knights"
            icon={
              <path d="M5 20a7 7 0 0 1 14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            }
          />
          <PillarCard
            num="IV."
            title="Patriotism"
            body="Faithful citizens who honor our country, support our veterans, and stand for the dignity of every life among us."
            meta="20 Fourth Degree Knights"
            icon={<>
              <path d="M4 5h16v9l-8 5-8-5V5z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
              <path d="M4 9h16M12 5v14" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </>}
          />
        </div>
      </div>
    </section>
  )
}

function PillarCard({
  num, title, body, meta, icon,
}: {
  num: string; title: string; body: string; meta: string; icon: React.ReactNode
}) {
  return (
    <div className="pillar">
      <svg className="pillar-ico" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
      <div className="pillar-num">{num}</div>
      <h3>{title}</h3>
      <span className="flourish" />
      <p>{body}</p>
      <div className="pillar-meta">{meta}</div>
    </div>
  )
}

// ─── Impact band ────────────────────────────────────────────────────────────

function ImpactSection() {
  return (
    <section className="impact-section">
      <div className="wrap">
        <div className="impact-head">
          <span className="eyebrow" style={{ color: '#F7C04A' }}>Our 2025 impact</span>
          <h2 style={{ color: '#fff' }}>What 100 brothers can do, by God&rsquo;s grace.</h2>
          <span className="flourish" />
          <p style={{ color: '#cfd6e8', fontSize: '17px', margin: 0 }}>
            Every dollar, every hour, every coat — accounted for and given back to our parish,
            our town, and the families who call us neighbor.
          </p>
        </div>
        <div className="impact-grid">
          <ImpactCell num="$47,200" lbl="Donated to charity this year"          sub="// food pantry · seminarians · pro-life" />
          <ImpactCell num="3,840"   lbl="Volunteer hours logged"                sub="// reported to Supreme, Form 1728" />
          <ImpactCell num="412"     lbl="Coats given to children in Bergen County" sub="// Coats for Kids · winter 2025" />
          <ImpactCell num="22"      lbl="New brothers welcomed"                 sub="// exemplified at Presentation, 2025" />
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

function ActivitiesSection({
  events,
  latestNews,
}: {
  events: Event[]
  latestNews: Pick<NewsPost, 'id' | 'title' | 'summary' | 'published_at'> | null
}) {
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
                <span className="meeting-v">Parish Hall, USR</span>
              </div>
              <div className="meeting-row" style={{ borderBottom: 'none' }}>
                <span className="meeting-k">Address</span>
                <span className="meeting-v">271 W Saddle River Rd</span>
              </div>
              <p className="meeting-note">
                All baptized Catholic men 18 and over are welcome to attend a
                meeting and learn more — no commitment required.
              </p>
            </div>

            {/* Bulletin card — latest news post */}
            <div className="card bulletin-card">
              <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                From the bulletin
                {latestNews?.published_at && (
                  <span className="bulletin-pill">
                    {monthYearPill(latestNews.published_at)}
                  </span>
                )}
              </h3>
              <span className="flourish" />
              {latestNews ? (
                <>
                  <p style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--color-ink)', margin: '0 0 6px' }}>
                    {latestNews.title}
                  </p>
                  {latestNews.summary && (
                    <p style={{ fontSize: '14px', color: 'var(--color-ink-soft)', margin: 0, lineHeight: 1.5 }}>
                      {latestNews.summary}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', margin: 0 }}>
                  No bulletin items yet.
                </p>
              )}
            </div>

            {/* Family Director card */}
            <div className="card family-card">
              <span className="eyebrow" style={{ color: '#F7C04A', fontSize: '12px' }}>Need a hand?</span>
              <h3 style={{ color: '#fff', marginTop: '6px' }}>Brothers helping brothers.</h3>
              <span className="flourish" />
              <p style={{ fontSize: '14.5px', color: '#cfd6e8', margin: '0 0 16px', lineHeight: 1.5 }}>
                If a fellow Knight or parishioner is sick, grieving, or in need, our Family
                Director will quietly coordinate help.
              </p>
              <Link href="/about#contact" className="btn btn-on-navy" style={{ fontSize: '14px', padding: '10px 16px' }}>
                Contact the Family Director
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </section>
  )
}

function EventRow({ event }: { event: Event }) {
  const { month, day, dowYear, time } = eventDateParts(event.starts_at)
  const tag = EVENT_TYPE_LABEL[event.event_type] ?? 'Event'
  const locationTime = [event.location_name, time].filter(Boolean).join(' · ')
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
                  <span>Join us on the third Wednesday of any month. No obligation, just coffee, fellowship, and a look behind the curtain.</span>
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

function HistorySection() {
  return (
    <section style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <div className="history-grid">

          {/* Photo placeholder */}
          <div aria-hidden="true">
            <div className="photo-frame" style={{ position: 'relative' }}>
              <div className="photo-placeholder" style={{ aspectRatio: '5 / 4' }}>
                <div className="ph-inner">
                  <div className="ph-title">Charter document, 1968</div>
                  Original charter signed by<br />
                  Supreme Knight John W. McDevitt<br />
                  <span style={{ color: 'var(--color-muted)' }}>// council archive · framed in hall</span>
                </div>
              </div>
              <div className="photo-caption">PHOTO_07 · CHARTER_1968</div>
            </div>
          </div>

          <div>
            <span className="eyebrow">A short history</span>
            <h2>Fifty-eight years of brothers, one parish.</h2>
            <span className="flourish" />
            <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
              Presentation Council #6033 was chartered in May 1968 by 48 founding members under
              the leadership of our first Grand Knight, William F. Hennessy. From its first pancake
              breakfast that autumn to today, the council has been bound to the rhythms of parish
              life at Church of the Presentation.
            </p>
            <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
              We have buried our brothers and welcomed new ones; we have served three pastors and
              seen the parish grow around us. The work has never changed: support the priest, care
              for the poor, and walk together in faith.
            </p>
            <div className="timeline">
              <TimelineNode year="1968" label="Council chartered with 48 founders" />
              <TimelineNode year="1991" label="Founded annual Tootsie Roll drive" />
              <TimelineNode year="2002" label="Patriotic (4th) Degree formed" />
              <TimelineNode year="2025" label="$47K raised — record year" />
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
      .hero-stamp {
        position: absolute; left: -22px; top: 32px;
        background: #fff; border: 1px solid var(--color-border); box-shadow: var(--shadow-card);
        padding: 14px 18px; border-radius: 4px; display: flex; align-items: center; gap: 14px;
      }
      .stamp-seal {
        width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
        border: 2px solid var(--color-gold); display: flex; align-items: center; justify-content: center;
        font-family: var(--font-serif); font-weight: 700; color: var(--color-navy); font-size: 14px;
        line-height: 1;
      }
      .stamp-text { font-size: 12.5px; line-height: 1.25; color: var(--color-ink-soft); }
      .stamp-text strong { display: block; color: var(--color-navy); font-family: var(--font-serif); font-size: 14px; font-weight: 600; }

      @media (max-width: 980px) {
        .hero-inner { grid-template-columns: 1fr; gap: 36px; padding: 40px 24px 48px; }
        .hero-copy h1 { font-size: 42px; }
        .hero-stamp { left: 0; top: -18px; }
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
      .pillars-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      .pillar {
        background: #fff; border: 1px solid var(--color-border); border-radius: 6px; padding: 28px 26px;
        box-shadow: var(--shadow-sm); position: relative; transition: transform .15s, box-shadow .15s;
      }
      .pillar:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
      .pillar-ico { width: 34px; height: 34px; color: var(--color-navy); margin-bottom: 6px; stroke: currentColor; fill: none; }
      .pillar-num { font-family: var(--font-serif); font-size: 13px; font-weight: 600; color: var(--color-gold-dark); letter-spacing: .18em; }
      .pillar h3 { margin-top: 14px; }
      .pillar p { font-size: 15px; color: var(--color-ink-soft); margin: 0 0 18px; line-height: 1.55; }
      .pillar-meta { font-size: 13px; color: var(--color-muted); font-family: var(--font-mono); }
      @media (max-width: 980px) { .pillars-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 520px) { .pillars-grid { grid-template-columns: 1fr; } }

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
      .bulletin-card { background: var(--color-surface-warm); border-color: #E5D9B6; }
      .bulletin-pill { font-family: var(--font-mono); font-size: 11px; color: var(--color-gold-dark); letter-spacing: .08em; background: rgba(0,0,0,.06); padding: 3px 8px; border-radius: 3px; font-weight: 600; }
      .family-card { background: var(--color-navy); border-color: var(--color-navy); color: #fff; }
      .family-card h3 { color: #fff; }
      .family-card .flourish { background: var(--color-gold); }

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
