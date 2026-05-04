import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Join',
  description: 'How to become a Knight at Presentation Council #6033 — Upper Saddle River, NJ.',
}

export default function JoinPage() {
  return (
    <>
      <PageHero />
      <QuickFactsStrip />
      <WhyJoinSection />
      <HowToJoinSection />
      <ApplicationDetailsSection />
      <MembershipContactSection />
      <CtaBand />
      <JoinStyles />
    </>
  )
}

// ─── Page Hero ────────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="jn-hero">
      <div className="jn-hero-inner">
        <div>
          <nav className="jn-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="jn-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">Join</span>
          </nav>
          <span className="eyebrow">Presentation Council #6033</span>
          <h1>Become a Knight at Council&nbsp;#6033.</h1>
          <p className="jn-hero-lede">
            Practical Catholic men, 18 and over, in communion with the Holy See
            &mdash; we&rsquo;d love to meet you.
          </p>
        </div>

        <aside className="jn-hero-meta" aria-label="Council facts">
          <div className="jn-meta-row">
            <span className="jn-meta-k">Founded</span>
            <span className="jn-meta-v">1968</span>
          </div>
          <div className="jn-meta-row">
            <span className="jn-meta-k">Members</span>
            <span className="jn-meta-v">100+ active</span>
          </div>
          <div className="jn-meta-row">
            <span className="jn-meta-k">Annual dues</span>
            <span className="jn-meta-v">$40/year</span>
          </div>
          <div className="jn-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="jn-meta-k">Sign-up fee</span>
            <span className="jn-meta-v">Waived</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── Quick Facts Strip ────────────────────────────────────────────────────────

function QuickFactsStrip() {
  return (
    <section className="jn-facts-strip">
      <div className="wrap">
        <div className="jn-facts-grid">
          <JnFact num="1968" lbl="Founded" />
          <JnFact num="100+" lbl="Active members" />
          <JnFact num="$40" lbl="Annual dues" />
          <JnFact num="Waived" lbl="Sign-up fee with promo" />
        </div>
      </div>
    </section>
  )
}

function JnFact({ num, lbl }: { num: string; lbl: string }) {
  return (
    <div className="jn-fact">
      <div className="jn-fact-num">{num}</div>
      <div className="jn-fact-lbl">{lbl}</div>
    </div>
  )
}

// ─── Why Join ─────────────────────────────────────────────────────────────────

function WhyJoinSection() {
  return (
    <section id="why-join">
      <div className="wrap">
        <span className="eyebrow">Why become a Knight</span>
        <h2>Four reasons that matter.</h2>
        <span className="flourish" />
        <div className="jn-benefits-grid">
          <JnBenefit
            title="Faith"
            body="Grow as a Catholic husband, father, and disciple alongside brothers who hold each other up."
          />
          <JnBenefit
            title="Fellowship"
            body="A circle of Catholic men in your parish — at first communions and at funerals, in joys and in trials. Monthly meetings, council socials, and shared meals."
          />
          <JnBenefit
            title="Charity"
            body="Hands-on service that matters. Food pantry, soup kitchen, Covenant House, and many other initiatives that put faith into action."
          />
          <JnBenefit
            title="Member Benefits"
            body="Top-rated insurance, retirement, and family protection products available exclusively to Knights and their families."
          />
        </div>
      </div>
    </section>
  )
}

function JnBenefit({ title, body }: { title: string; body: string }) {
  return (
    <div className="jn-benefit">
      <h3>{title}</h3>
      <span className="flourish" />
      <p>{body}</p>
    </div>
  )
}

// ─── How to Join ──────────────────────────────────────────────────────────────

function HowToJoinSection() {
  return (
    <section id="how-to-join" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <span className="eyebrow">How it works</span>
        <h2>Three simple steps.</h2>
        <span className="flourish" />
        <div className="jn-steps-grid">
          <JnStep
            num="1"
            title="Apply online"
            body="Visit kofc.org/join and complete the short online application. Use the information below so your application is routed directly to Council #6033 with no signup fee."
          />
          <JnStep
            num="2"
            title="Visit a meeting"
            body="Join us on the third Wednesday of any month at 7:30 PM, in the Community Room at Church of the Presentation. No commitment, just refreshments, conversation, and a look at what we do."
          />
          <JnStep
            num="3"
            title="Take your degree"
            body="When you're ready, complete the Exemplification of Charity, Unity, and Fraternity. From that moment, you're a brother knight."
          />
        </div>
      </div>
    </section>
  )
}

function JnStep({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="jn-step">
      <div className="jn-step-num" aria-hidden="true">{num}</div>
      <h3 className="jn-step-title">{title}</h3>
      <p className="jn-step-body">{body}</p>
    </div>
  )
}

// ─── Application Details ──────────────────────────────────────────────────────

function ApplicationDetailsSection() {
  return (
    <section id="apply">
      <div className="wrap">
        <div className="jn-app-box">
          <h2 className="jn-app-box-title">
            When you fill out the application, use these details:
          </h2>
          <div className="jn-app-fields">
            <div className="jn-app-row">
              <span className="jn-app-k">Preferred Local Council</span>
              <span className="jn-app-v">6033</span>
            </div>
            <div className="jn-app-row">
              <span className="jn-app-k">Member Referral Number</span>
              <span className="jn-app-v">4838999</span>
            </div>
            <div className="jn-app-row">
              <span className="jn-app-k">Church Parish Name</span>
              <span className="jn-app-v">Church of the Presentation</span>
            </div>
            <div className="jn-app-row">
              <span className="jn-app-k">Church Parish City</span>
              <span className="jn-app-v">Upper Saddle River, NJ</span>
            </div>
            <div className="jn-app-row jn-app-row-last">
              <span className="jn-app-k">Promo Code</span>
              <span className="jn-app-v-promo">
                <code className="jn-promo">BLESSEDMCGIVNEY</code>
                <span className="jn-promo-note">(waives the $40 signup fee)</span>
              </span>
            </div>
          </div>
          <a
            href="https://www.kofc.org/secure/en/join/join-kofc.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Apply on kofc.org →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Membership Contact ───────────────────────────────────────────────────────

function MembershipContactSection() {
  return (
    <section id="contact" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <span className="eyebrow">Have questions?</span>
        <h2>Talk to a Knight first.</h2>
        <span className="flourish" />
        <div className="jn-contact-layout">
          <div className="card jn-contact-card">
            <p className="jn-contact-name">Corrado Toxiri</p>
            <p className="jn-contact-role">Deputy Grand Knight &amp; Membership Director</p>
            <p className="jn-contact-council">
              Council 6033 &mdash; Church of the Presentation, Upper Saddle River, NJ 07458
            </p>
            <a href="mailto:kofc6033@churchofpresentation.org" className="jn-contact-email">
              <MailIcon />
              kofc6033@churchofpresentation.org
            </a>
          </div>
          <div className="jn-contact-prose">
            <p>
              Have questions before applying? Want to come to a meeting first?
              Reach out &mdash; we&rsquo;d be glad to hear from you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <section className="jn-cta-band">
      <div className="wrap">
        <div className="jn-cta-grid">
          <div>
            <span className="eyebrow" style={{ color: '#F7C04A' }}>
              The first step is the easiest one
            </span>
            <h2 style={{ color: '#fff' }}>Come to a meeting.</h2>
            <span className="flourish" style={{ background: 'var(--color-gold)' }} />
            <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6 }}>
              No obligation, no commitment. Third Wednesday of any month at 7:30&nbsp;PM
              &mdash; just come, meet the brothers, and see for yourself what
              fraternity looks like at Presentation Parish.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href="https://www.kofc.org/secure/en/join/join-kofc.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-on-navy"
              >
                Apply on kofc.org →
              </a>
              <Link
                href="/calendar"
                className="btn btn-secondary"
                style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
              >
                View calendar
              </Link>
            </div>
          </div>

          <div className="jn-cta-card">
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>
              Council Meeting
            </h3>
            <span className="flourish" style={{ margin: '8px 0 12px', background: 'var(--color-gold)' }} />
            <div className="jn-cta-row">
              <span className="jn-cta-k">When</span>
              <span className="jn-cta-v">3rd Wed · 7:30 PM</span>
            </div>
            <div className="jn-cta-row">
              <span className="jn-cta-k">Where</span>
              <span className="jn-cta-v">Community Room · Church of the Presentation</span>
            </div>
            <div className="jn-cta-row">
              <span className="jn-cta-k">Open to</span>
              <span className="jn-cta-v">Catholic men, 18+</span>
            </div>
            <div className="jn-cta-row" style={{ borderBottom: 'none' }}>
              <span className="jn-cta-k">Commitment</span>
              <span className="jn-cta-v">None required to visit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6l8 6 8-6" />
    </svg>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function JoinStyles() {
  return (
    <style>{`
      /* ── Hero ── */
      .jn-hero { background: var(--color-surface-alt); position: relative; overflow: hidden; }
      .jn-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .jn-hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .jn-hero h1 { font-size: 52px; line-height: 1.05; }
      .jn-hero-lede { font-size: 18px; color: var(--color-ink-soft); max-width: 540px; margin: 18px 0 0; line-height: 1.55; }
      .jn-crumbs { font-size: 13px; color: var(--color-muted); font-family: var(--font-mono); letter-spacing: .04em; margin-bottom: 18px; display: flex; align-items: center; }
      .jn-crumbs a { color: var(--color-muted); }
      .jn-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .jn-crumbs-sep { margin: 0 8px; opacity: .5; }
      .jn-hero-meta { border-left: 3px solid var(--color-gold); padding: 6px 0 6px 22px; }
      .jn-meta-row { display: flex; justify-content: space-between; gap: 14px; font-size: 14px; border-bottom: 1px dashed var(--color-border-strong); padding-bottom: 12px; margin-bottom: 12px; }
      .jn-meta-k { color: var(--color-muted); }
      .jn-meta-v { color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); font-size: 13px; text-align: right; }
      @media (max-width: 880px) {
        .jn-hero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .jn-hero h1 { font-size: 38px; }
        .jn-hero-meta { display: none; }
      }

      /* ── Facts Strip ── */
      .jn-facts-strip { background: var(--color-navy); padding: 44px 0; }
      .jn-facts-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
      .jn-fact { padding: 12px 24px 12px 0; border-right: 1px solid rgba(255,255,255,.15); }
      .jn-fact:last-child { border-right: none; padding-right: 0; }
      .jn-fact-num { font-family: var(--font-serif); font-size: 34px; color: var(--color-gold); line-height: 1; margin-bottom: 6px; }
      .jn-fact-lbl { font-size: 13px; color: #dde3f1; }
      @media (max-width: 880px) {
        .jn-facts-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 0; }
        .jn-fact:nth-child(2) { border-right: none; }
        .jn-fact:nth-child(4) { border-right: none; }
      }
      @media (max-width: 520px) {
        .jn-facts-grid { grid-template-columns: 1fr; }
        .jn-fact { border-right: none; border-bottom: 1px solid rgba(255,255,255,.12); padding: 14px 0; }
        .jn-fact:last-child { border-bottom: none; }
      }

      /* ── Benefits Grid ── */
      .jn-benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 32px; }
      .jn-benefit { background: #fff; border: 1px solid var(--color-border); border-radius: 6px; padding: 28px 24px; box-shadow: var(--shadow-sm); transition: transform .15s ease, box-shadow .15s ease; }
      .jn-benefit:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
      .jn-benefit h3 { font-size: 20px; }
      .jn-benefit .flourish { margin: 10px 0 14px; }
      .jn-benefit p { font-size: 15.5px; color: var(--color-ink-soft); line-height: 1.65; margin: 0; }
      @media (max-width: 980px) { .jn-benefits-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 520px) { .jn-benefits-grid { grid-template-columns: 1fr; } }

      /* ── Steps ── */
      .jn-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; margin-top: 32px; }
      .jn-step { background: #fff; border: 1px solid var(--color-border); border-radius: 6px; padding: 28px 24px; box-shadow: var(--shadow-sm); }
      .jn-step-num { font-family: var(--font-serif); font-size: 56px; color: var(--color-gold); line-height: 1; opacity: .65; margin-bottom: 12px; }
      .jn-step-title { font-size: 20px; }
      .jn-step-body { font-size: 15.5px; color: var(--color-ink-soft); line-height: 1.65; margin: 12px 0 0; }
      @media (max-width: 780px) { .jn-steps-grid { grid-template-columns: 1fr; gap: 20px; } }

      /* ── Application Box ── */
      .jn-app-box {
        background: var(--color-surface-warm); border: 1px solid #D4C5A3;
        border-left: 4px solid var(--color-gold); border-radius: 6px;
        padding: 36px 40px; max-width: 720px; margin: 0 auto;
      }
      .jn-app-box-title { font-size: 21px; margin-bottom: 28px; line-height: 1.3; }
      .jn-app-fields { margin-bottom: 28px; }
      .jn-app-row { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; font-size: 14.5px; padding: 11px 0; border-bottom: 1px dashed var(--color-border-strong); flex-wrap: wrap; }
      .jn-app-row-last { border-bottom: none; padding-bottom: 0; }
      .jn-app-k { color: var(--color-muted); flex-shrink: 0; }
      .jn-app-v { color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); font-size: 13.5px; text-align: right; }
      .jn-app-v-promo { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
      .jn-promo { background: rgba(0,48,135,.08); color: var(--color-navy); font-family: var(--font-mono); font-size: 13.5px; font-weight: 700; letter-spacing: .04em; padding: 2px 8px; border-radius: 3px; border: 1px solid rgba(0,48,135,.15); }
      .jn-promo-note { font-size: 12px; color: var(--color-muted); font-weight: 400; font-family: var(--font-sans); }
      @media (max-width: 600px) {
        .jn-app-box { padding: 24px 20px; }
        .jn-app-row { flex-direction: column; gap: 4px; }
        .jn-app-v { text-align: left; }
        .jn-app-v-promo { justify-content: flex-start; }
      }

      /* ── Contact ── */
      .jn-contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; max-width: 860px; margin-top: 4px; }
      .jn-contact-card { padding: 28px; }
      .jn-contact-name { font-family: var(--font-serif); font-size: 22px; color: var(--color-navy); font-weight: 600; margin: 0 0 4px; }
      .jn-contact-role { font-size: 13.5px; color: var(--color-muted); margin: 0 0 8px; }
      .jn-contact-council { font-size: 13.5px; color: var(--color-ink-soft); margin: 0 0 18px; line-height: 1.45; }
      .jn-contact-email { display: inline-flex; align-items: center; gap: 7px; font-size: 13.5px; color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); }
      .jn-contact-email:hover { color: var(--color-gold-dark); text-decoration: none; }
      .jn-contact-prose p { font-size: 17px; color: var(--color-ink-soft); line-height: 1.65; margin: 0; }
      @media (max-width: 780px) { .jn-contact-layout { grid-template-columns: 1fr; gap: 24px; } }

      /* ── CTA Band ── */
      .jn-cta-band { background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy)); color: #fff; position: relative; overflow: hidden; }
      .jn-cta-band::before { content: ""; position: absolute; left: -120px; bottom: -120px; width: 420px; height: 420px; background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%); }
      .jn-cta-grid { display: grid; grid-template-columns: 1.3fr .9fr; gap: 48px; align-items: center; position: relative; }
      .jn-cta-grid h2 { color: #fff; font-size: 36px; }
      @media (max-width: 880px) { .jn-cta-grid { grid-template-columns: 1fr; gap: 28px; } }
      .jn-cta-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.18); border-radius: 6px; padding: 24px; backdrop-filter: blur(2px); }
      .jn-cta-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,.15); font-size: 14px; }
      .jn-cta-row:last-child { border-bottom: none; }
      .jn-cta-k { color: #cfd6e8; }
      .jn-cta-v { color: #fff; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }

      /* ── Scroll offsets ── */
      #why-join, #how-to-join, #apply, #contact { scroll-margin-top: 80px; }
    `}</style>
  )
}
