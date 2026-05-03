import type { Metadata } from 'next'
import Link from 'next/link'
import { PillarsGrid } from '@/components/PillarsGrid'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'About Our Council',
  description:
    'Learn about Presentation Council #6033 — our 58-year history, our mission and four pillars, and where and when we meet.',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <HistorySection />
      <MissionSection />
      <ContactSection />
      <CtaBand />
      <AboutStyles />
    </>
  )
}

// ─── Page Hero ───────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="abt-hero">
      <div className="abt-hero-inner">
        <div>
          <nav className="abt-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="abt-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">About</span>
          </nav>
          <span className="eyebrow">Presentation Council #6033 · Knights of Columbus</span>
          <h1>
            Fifty-eight years of brothers,{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 500 }}>one parish.</em>
          </h1>
          <p className="abt-hero-lede">
            Presentation Council #6033 is a fellowship of Catholic men at Church of the
            Presentation in Upper Saddle River, New Jersey — living out the four principles
            of the Knights of Columbus since March 10, 1968.
          </p>
        </div>

        <aside className="abt-hero-meta" aria-label="Council facts">
          <div className="abt-meta-row">
            <span className="abt-meta-k">Founded</span>
            <span className="abt-meta-v">March 10, 1968</span>
          </div>
          <div className="abt-meta-row">
            <span className="abt-meta-k">Parish</span>
            <span className="abt-meta-v">Church of the Presentation</span>
          </div>
          <div className="abt-meta-row">
            <span className="abt-meta-k">Council meeting</span>
            <span className="abt-meta-v">3rd Wed · 7:30 PM</span>
          </div>
          <div className="abt-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="abt-meta-k">Members</span>
            <span className="abt-meta-v">100+ brother knights</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── History ─────────────────────────────────────────────────────────────────

function HistorySection() {
  return (
    <section id="history" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <span className="eyebrow">Our council</span>
        <h2>How we got here</h2>
        <span className="flourish" />

        <div className="abt-history-grid">
          <div className="abt-history-prose">
            <p>
              Presentation Council #6033 was formally constituted on{' '}
              <strong>March 10, 1968</strong>, by Catholic men of Church of the Presentation
              in Upper Saddle River, New Jersey. For nearly six decades the council has served
              its parish and its neighbors with the same conviction that animated its founders:
              that Catholic men, organized and purposeful, multiply the good they can do in
              the world.
            </p>
            <p>
              The council&rsquo;s calendar reflects that conviction. Year after year, brothers
              gather for an Annual <strong>Golf Outing</strong>, a parish{' '}
              <strong>Pancake Breakfast</strong> supporting Youth Ministry mission trips,
              a <strong>Christmas Dinner Dance</strong>, and a{' '}
              <strong>Lenten Fish Fry</strong>. Beyond the council hall, members support the
              local <strong>Food Pantry</strong>, partner with{' '}
              <strong>Nova Hope for Haiti</strong> on medical missions, fund{' '}
              <strong>Angels Among Us</strong>, award academic <strong>scholarships</strong>,
              serve meals at <strong>Covenant House</strong>, support{' '}
              <strong>Catholic schools</strong> in the diocese, and stand with{' '}
              <strong>Right to Life</strong> organizations.
            </p>
          </div>

          <div>
            <div className="abt-timeline">
              <AbtTimelineNode year="1968" label="Council constituted — March 10" />
              <AbtTimelineNode year="1970s" label="Annual Pancake Breakfast established" />
              <AbtTimelineNode year="2002" label="Fourth Degree assembly formed" />
              <AbtTimelineNode year="2025" label="$47K raised — record charitable year" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AbtTimelineNode({ year, label }: { year: string; label: string }) {
  return (
    <div className="abt-tnode">
      <div className="abt-tnode-year">{year}</div>
      <div className="abt-tnode-label">{label}</div>
    </div>
  )
}

// ─── Mission ──────────────────────────────────────────────────────────────────

function MissionSection() {
  return (
    <section id="mission">
      <div className="wrap">
        <div className="abt-mission-head">
          <div>
            <span className="eyebrow">Our mission</span>
            <h2>Four pillars, one fraternity.</h2>
            <span className="flourish" />
          </div>
          <p className="abt-mission-desc">
            Founded in 1882 by Blessed Michael McGivney, the Knights of Columbus stand on
            four principles. Our council lives them out at the parish level — week in, week out.
          </p>
        </div>

        <PillarsGrid />

        <div className="abt-pillar-narratives">
          <div className="abt-pillar-narrative">
            <h3>Charity</h3>
            <span className="flourish" />
            <p>
              &ldquo;Love thy neighbor as thyself&rdquo; is not a slogan &mdash; it is a
              discipline. Knights councils around the world put charity into practice through
              food drives, fundraisers, and direct service to families in need. In 2017 alone,
              the Knights of Columbus gave more than $185&nbsp;million to charitable causes.
              Council #6033 carries that spirit to every parish ministry it touches.
            </p>
          </div>

          <div className="abt-pillar-narrative">
            <h3>Unity</h3>
            <span className="flourish" />
            <p>
              What one man cannot accomplish, a brotherhood can. The Knights were built on
              the conviction that Catholic men working together multiply their effect on the
              parish, the diocese, and the wider world. We work alongside our pastor, our
              parish organizations, and our community institutions to carry out works of
              service that no single person could manage alone.
            </p>
          </div>

          <div className="abt-pillar-narrative">
            <h3>Fraternity</h3>
            <span className="flourish" />
            <p>
              Father Michael McGivney founded the Knights to protect the widows and orphans
              of Catholic immigrant families who had no safety net &mdash; and the insurance
              program was his practical answer to that need. Today, fraternity means something
              broader: brothers who show up at first communions and funerals, who carry meals
              to sick families, and who hold each other accountable in faith. Knights gave
              more than 75.6&nbsp;million service hours in 2017, illustrating how Catholics
              serve each other in fraternity and mercy.
            </p>
            {/* Source note: the uknight.org source repeated the service-hours sentence twice
                within this paragraph. The duplicate has been removed. */}
          </div>

          <div className="abt-pillar-narrative">
            <h3>Patriotism</h3>
            <span className="flourish" />
            <p>
              A Knight&rsquo;s devotion to God and devotion to country reinforce each other.
              Members demonstrate that love publicly and privately: honoring veterans and
              active-duty service members, standing for the dignity of every human life, and
              participating as engaged citizens in the public square. Our assembly of Fourth
              Degree Knights takes this dimension of membership especially to heart.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <span className="eyebrow">Find us</span>
        <h2>Where &amp; when we meet.</h2>
        <span className="flourish" />
        <p className="abt-contact-intro">
          All meetings are held at Church of the Presentation. All baptized Catholic men
          18 and over are welcome to attend a council meeting &mdash; no commitment required.
        </p>

        <div className="abt-contact-grid">

          {/* Meeting location */}
          <div className="card abt-contact-card">
            <div className="abt-card-icon" aria-hidden="true">
              <MapPinIcon />
            </div>
            <h3>Meeting Location</h3>
            <span className="flourish" />
            <address className="abt-address">
              <strong>Church of the Presentation</strong><br />
              271 West Saddle River Road<br />
              Upper Saddle River, NJ 07458
            </address>
            <div className="abt-meeting-rows">
              <div className="abt-meeting-row">
                <span className="abt-meeting-k">Council meeting</span>
                <span className="abt-meeting-v">3rd Wed · 7:30 PM</span>
              </div>
              <div className="abt-meeting-row" style={{ borderBottom: 'none' }}>
                <span className="abt-meeting-k">Officers&rsquo; meeting</span>
                <span className="abt-meeting-v">2nd Tue · 7:30 PM</span>
              </div>
            </div>
            <a href="mailto:kofc6033@churchofpresentation.org" className="abt-council-email">
              <MailIcon />
              kofc6033@churchofpresentation.org
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=271+West+Saddle+River+Road+Upper+Saddle+River+NJ+07458"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary abt-card-btn"
            >
              Get Directions →
            </a>
          </div>

          {/* Parish */}
          <div className="card abt-contact-card">
            <div className="abt-card-icon" aria-hidden="true">
              <ChurchIcon />
            </div>
            <h3>Our Parish</h3>
            <span className="flourish" />
            <p className="abt-card-desc">
              Presentation Council #6033 is the Knights of Columbus council at{' '}
              <strong>Church of the Presentation</strong> in Upper Saddle River, New Jersey.
              Everything we do is rooted in the life of this parish, its pastor, and its people.
            </p>
            <a
              href="https://www.churchofpresentation.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary abt-card-btn"
            >
              Visit Parish Website →
            </a>
          </div>

          {/* Insurance field agent */}
          <div className="card abt-contact-card">
            <div className="abt-card-icon" aria-hidden="true">
              <ShieldIcon />
            </div>
            <h3>Insurance Field Agent</h3>
            <span className="flourish" />
            <div className="abt-agent-block">
              <p className="abt-agent-name">Charles F. Miraglia, FICF</p>
              <p className="abt-agent-role">General Agent · Knights of Columbus</p>
              <address className="abt-address">
                420 US Highway 46 East, Suite 11<br />
                Fairfield, NJ 07004
              </address>
            </div>
            <div className="abt-agent-links">
              <a href="tel:+18886322257" className="abt-agent-link">
                (888) 632-2257
              </a>
              <a href="mailto:charles.miraglia@kofc.org" className="abt-agent-link">
                charles.miraglia@kofc.org
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── CTA Band ────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <section className="abt-cta-band">
      <div className="wrap">
        <div className="abt-cta-grid">
          <div>
            <span className="eyebrow" style={{ color: '#F7C04A' }}>Come see for yourself</span>
            <h2 style={{ color: '#fff' }}>
              Want to see what we&rsquo;re about?{' '}
              Come to a meeting.
            </h2>
            <span className="flourish" style={{ background: 'var(--color-gold)' }} />
            <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6 }}>
              All baptized Catholic men 18 and over are welcome to join us on the third
              Wednesday of any month at 7:30 PM &mdash; no obligation, no commitment. Just
              come, meet the brothers, and see for yourself what fraternity looks like at
              Presentation Parish.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/join" className="btn btn-on-navy">
                Begin Your Membership <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="#contact"
                className="btn btn-secondary"
                style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
              >
                Contact us first
              </Link>
            </div>
          </div>

          <div className="abt-cta-card">
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>
              Council Meeting
            </h3>
            <span className="flourish" style={{ margin: '8px 0 12px', background: 'var(--color-gold)' }} />
            <div className="abt-cta-row">
              <span className="abt-cta-k">When</span>
              <span className="abt-cta-v">3rd Wed · 7:30 PM</span>
            </div>
            <div className="abt-cta-row">
              <span className="abt-cta-k">Where</span>
              <span className="abt-cta-v">Church of the Presentation</span>
            </div>
            <div className="abt-cta-row">
              <span className="abt-cta-k">Open to</span>
              <span className="abt-cta-v">Catholic men, 18+</span>
            </div>
            <div className="abt-cta-row" style={{ borderBottom: 'none' }}>
              <span className="abt-cta-k">Officers&rsquo; meeting</span>
              <span className="abt-cta-v">2nd Tue · 7:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function ChurchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 21h18M5 21V10l7-7 7 7v11M10 21v-6h4v6M12 3V7M10 5h4" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6l8 6 8-6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.2 8 11.5C16.5 22.2 20 17.25 20 12V6l-8-4z" />
    </svg>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function AboutStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .abt-hero {
        background: var(--color-surface-alt);
        position: relative; overflow: hidden;
      }
      .abt-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .abt-hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .abt-hero h1 { font-size: 52px; line-height: 1.05; }
      .abt-hero-lede {
        font-size: 18px; color: var(--color-ink-soft);
        max-width: 540px; margin: 18px 0 0; line-height: 1.55;
      }
      .abt-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 18px; display: flex; align-items: center;
      }
      .abt-crumbs a { color: var(--color-muted); }
      .abt-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .abt-crumbs-sep { margin: 0 8px; opacity: .5; }
      .abt-hero-meta {
        border-left: 3px solid var(--color-gold);
        padding: 6px 0 6px 22px;
      }
      .abt-meta-row {
        display: flex; justify-content: space-between; gap: 14px;
        font-size: 14px;
        border-bottom: 1px dashed var(--color-border-strong);
        padding-bottom: 12px; margin-bottom: 12px;
      }
      .abt-meta-k { color: var(--color-muted); }
      .abt-meta-v {
        color: var(--color-navy); font-weight: 600;
        font-family: var(--font-mono); font-size: 13px; text-align: right;
      }
      @media (max-width: 880px) {
        .abt-hero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .abt-hero h1 { font-size: 38px; }
      }

      /* ── History ── */
      .abt-history-grid {
        display: grid; grid-template-columns: 1.25fr .75fr;
        gap: 56px; align-items: start; margin-top: 4px;
      }
      .abt-history-prose p {
        color: var(--color-ink-soft); font-size: 17px; line-height: 1.65; margin: 0 0 18px;
      }
      .abt-history-prose strong { color: var(--color-ink); font-weight: 600; }
      .abt-timeline { display: flex; flex-direction: column; gap: 22px; }
      .abt-tnode { border-left: 3px solid var(--color-gold); padding-left: 18px; }
      .abt-tnode-year {
        font-family: var(--font-serif); font-size: 22px;
        color: var(--color-navy); font-weight: 600; line-height: 1;
      }
      .abt-tnode-label {
        font-size: 13.5px; color: var(--color-muted); margin-top: 4px; line-height: 1.4;
      }
      @media (max-width: 880px) {
        .abt-history-grid { grid-template-columns: 1fr; gap: 36px; }
      }

      /* ── Mission ── */
      .abt-mission-head {
        display: flex; justify-content: space-between; align-items: end;
        gap: 24px; margin-bottom: 36px; flex-wrap: wrap;
      }
      .abt-mission-head h2 { font-size: 36px; }
      .abt-mission-desc { max-width: 420px; color: var(--color-ink-soft); font-size: 16px; margin: 0; }
      .abt-pillar-narratives {
        display: grid; grid-template-columns: repeat(2, 1fr);
        gap: 36px 52px; margin-top: 52px;
        border-top: 1px solid var(--color-border); padding-top: 44px;
      }
      .abt-pillar-narrative h3 { font-size: 22px; }
      .abt-pillar-narrative .flourish { margin: 10px 0 14px; }
      .abt-pillar-narrative p {
        font-size: 15.5px; color: var(--color-ink-soft); line-height: 1.65; margin: 0;
      }
      @media (max-width: 780px) {
        .abt-pillar-narratives { grid-template-columns: 1fr; gap: 32px; }
      }

      /* ── Contact ── */
      .abt-contact-intro {
        color: var(--color-ink-soft); font-size: 17px;
        max-width: 600px; margin: 0 0 40px; line-height: 1.55;
      }
      .abt-contact-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
      }
      .abt-contact-card { display: flex; flex-direction: column; }
      .abt-card-icon {
        width: 44px; height: 44px; border-radius: 50%;
        background: #fff; border: 1px solid var(--color-border);
        display: flex; align-items: center; justify-content: center;
        color: var(--color-navy); margin-bottom: 14px; flex-shrink: 0;
      }
      .abt-contact-card h3 { font-size: 19px; }
      .abt-contact-card .flourish { margin: 10px 0 14px; }
      .abt-address {
        font-style: normal; font-size: 14.5px; line-height: 1.65;
        color: var(--color-ink-soft); margin: 0 0 16px;
      }
      .abt-address strong { color: var(--color-ink); font-weight: 600; }
      .abt-meeting-rows { margin-bottom: 20px; }
      .abt-meeting-row {
        display: flex; justify-content: space-between;
        font-size: 14px; padding: 9px 0;
        border-bottom: 1px dashed var(--color-border-strong);
      }
      .abt-meeting-k { color: var(--color-muted); }
      .abt-meeting-v {
        color: var(--color-ink); font-weight: 600;
        font-family: var(--font-mono); font-size: 13px;
      }
      .abt-council-email {
        display: inline-flex; align-items: center; gap: 7px;
        font-size: 13.5px; color: var(--color-navy); font-weight: 600;
        font-family: var(--font-mono); margin-bottom: 14px;
      }
      .abt-council-email:hover { color: var(--color-gold-dark); text-decoration: none; }
      .abt-card-btn { margin-top: auto; font-size: 14px; padding: 10px 16px; }
      .abt-card-desc {
        font-size: 15px; color: var(--color-ink-soft);
        line-height: 1.55; margin: 0 0 20px; flex: 1;
      }
      .abt-agent-block { margin-bottom: 16px; flex: 1; }
      .abt-agent-name {
        font-family: var(--font-serif); font-size: 18px; font-weight: 600;
        color: var(--color-navy); margin: 0 0 3px;
      }
      .abt-agent-role { font-size: 13px; color: var(--color-muted); margin: 0 0 10px; }
      .abt-agent-links { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }
      .abt-agent-link {
        font-size: 14px; color: var(--color-navy); font-weight: 600;
        font-family: var(--font-mono);
      }
      .abt-agent-link:hover { color: var(--color-gold-dark); text-decoration: none; }
      @media (max-width: 880px) {
        .abt-contact-grid { grid-template-columns: 1fr; gap: 20px; }
        .abt-contact-card { max-width: 480px; }
      }

      /* ── CTA Band ── */
      .abt-cta-band {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .abt-cta-band::before {
        content: ""; position: absolute; left: -120px; bottom: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
      }
      .abt-cta-grid {
        display: grid; grid-template-columns: 1.3fr .9fr;
        gap: 48px; align-items: center; position: relative;
      }
      .abt-cta-grid h2 { color: #fff; font-size: 36px; }
      @media (max-width: 880px) { .abt-cta-grid { grid-template-columns: 1fr; gap: 28px; } }
      .abt-cta-card {
        background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.18);
        border-radius: 6px; padding: 24px; backdrop-filter: blur(2px);
      }
      .abt-cta-row {
        display: flex; justify-content: space-between;
        padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,.15); font-size: 14px;
      }
      .abt-cta-row:last-child { border-bottom: none; }
      .abt-cta-k { color: #cfd6e8; }
      .abt-cta-v { color: #fff; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }

      /* ── Anchor scroll offset ── */
      #history, #mission, #contact { scroll-margin-top: 80px; }
    `}</style>
  )
}
