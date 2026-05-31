import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support our charitable work and pay your annual dues — Presentation Council #6033.',
}

export default function DonatePage() {
  return (
    <>
      <PageHero />
      <QuickFactsStrip />
      <DuesOrDonateSection />
      <PaymentMethodsSection />
      <WhereMoneyGoesSection />
      <ContactSection />
      <CtaBand />
      <DonateStyles />
    </>
  )
}

// ─── Page Hero ────────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="don-hero">
      <div className="don-hero-inner">
        <div>
          <nav className="don-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="don-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">Donate</span>
          </nav>
          <span className="eyebrow">Presentation Council #6033</span>
          <h1>Support our work.</h1>
          <p className="don-hero-lede">
            Whether you&rsquo;re a member paying annual dues or a friend of the council
            making a gift, your support fuels everything we do at Presentation.
          </p>
        </div>

        <aside className="don-hero-meta" aria-label="Council giving facts">
          <div className="don-meta-row">
            <span className="don-meta-k">Raised for charity</span>
            <span className="don-meta-v">$31K in 2025</span>
          </div>
          <div className="don-meta-row">
            <span className="don-meta-k">Goes to programs</span>
            <span className="don-meta-v">100%</span>
          </div>
          <div className="don-meta-row">
            <span className="don-meta-k">Annual member dues</span>
            <span className="don-meta-v">$40/year</span>
          </div>
          <div className="don-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="don-meta-k">Founded</span>
            <span className="don-meta-v">1968</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── Quick Facts Strip ────────────────────────────────────────────────────────

function QuickFactsStrip() {
  return (
    <section className="don-facts-strip">
      <div className="wrap">
        <div className="don-facts-grid">
          <DonFact num="$31K" lbl="Raised for charity in 2025" />
          <DonFact num="100%" lbl="Goes to council programs" />
          <DonFact num="$40/year" lbl="Annual member dues" />
          <DonFact num="1968" lbl="Year founded" />
        </div>
      </div>
    </section>
  )
}

function DonFact({ num, lbl }: { num: string; lbl: string }) {
  return (
    <div className="don-fact">
      <div className="don-fact-num">{num}</div>
      <div className="don-fact-lbl">{lbl}</div>
    </div>
  )
}

// ─── Dues or Donate ───────────────────────────────────────────────────────────

function DuesOrDonateSection() {
  return (
    <section id="give">
      <div className="wrap">
        <span className="eyebrow">How to give</span>
        <h2>Dues or a donation &mdash; both matter.</h2>
        <span className="flourish" />
        <div className="don-give-grid">

          <div className="don-give-card">
            <h3>Pay Annual Dues</h3>
            <p className="don-give-subhead">$40/year for active members</p>
            <span className="flourish" />
            <p className="don-give-body">
              Council dues fund our charitable activities, parish events, and operating
              expenses. Members receive a reminder annually, but you can pay anytime
              via the methods below.
            </p>
            <a href="#payment-methods" className="btn btn-primary don-give-btn">Pay with Zelle →</a>
          </div>

          <div className="don-give-card">
            <h3>Make a Donation</h3>
            <p className="don-give-subhead">Any amount, any time</p>
            <span className="flourish" />
            <p className="don-give-body">
              Friends and family of the council can support our work directly. Every
              dollar goes to our charitable initiatives and parish programs &mdash;
              none to overhead.
            </p>
            <a href="#payment-methods" className="btn btn-primary don-give-btn">Donate with Zelle →</a>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Payment Methods ──────────────────────────────────────────────────────────

function PaymentMethodsSection() {
  return (
    <section id="payment-methods" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <span className="eyebrow">Payment methods</span>
        <h2>How to pay.</h2>
        <span className="flourish" />
        <div className="don-pay-grid">

          <div className="card don-pay-card">
            <h3>Zelle</h3>
            <span className="flourish" />
            <div className="don-qr-wrap">
              <Image
                src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/QR_Code_Zelle.png"
                alt="Zelle QR code for Knights of Columbus #6033"
                width={345}
                height={420}
                style={{ borderRadius: '4px', maxWidth: '260px', width: '100%', height: 'auto' }}
              />
            </div>
            <p className="don-venmo-handle">kofc6033@churchofpresentation.org</p>
            <p className="don-venmo-verify">
              Verify the payee reads KNIGHTS OF COLUMBUS before sending.
            </p>
            <p className="don-pay-body">
              Open your bank app and look for the &lsquo;Pay with Zelle&rsquo; section, then scan the QR
              code above. Enter the amount, and in the &lsquo;Message to recipient&rsquo; field, specify
              whether this is a donation or for the yearly dues.
            </p>
          </div>

          <div className="card don-pay-card">
            <h3>By Check</h3>
            <span className="flourish" />
            <div className="don-check-block">
              <div className="don-check-row">
                <span className="don-check-k">Make checks payable to</span>
                <span className="don-check-v">&ldquo;Knights of Columbus #6033&rdquo;</span>
              </div>
              <div className="don-check-row">
                <span className="don-check-k">Mail to</span>
                <address className="don-check-address">
                  Knights of Columbus #6033<br />
                  c/o Church of the Presentation<br />
                  271 West Saddle River Road<br />
                  Upper Saddle River, NJ 07458
                </address>
              </div>
            </div>
            <p className="don-pay-body">
              Parishioners may also drop checks in the KofC mailbox in the parish office.
            </p>
            <p className="don-pay-note">
              Please write &ldquo;dues&rdquo; or &ldquo;donation&rdquo; in the memo line so we
              can apply the gift correctly.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Where Money Goes ─────────────────────────────────────────────────────────

function WhereMoneyGoesSection() {
  return (
    <section id="where-it-goes">
      <div className="wrap">
        <span className="eyebrow">Your gift at work</span>
        <h2>Where your support goes.</h2>
        <span className="flourish" />
        <ul className="don-uses-list">
          <li>
            <strong>Food Pantry</strong> &mdash; direct support for Bergen County
            families in need
          </li>
          <li>
            <strong>Soup Kitchen Cooking</strong> &mdash; meals for our local soup
            kitchen ministry
          </li>
          <li>
            <strong>Charity Fund</strong> &mdash; annual gifts to Covenant House
            Newark, Nova Hope for Haiti, Right to Life, and others
          </li>
          <li>
            <strong>Parish Programs</strong> &mdash; Pancake Breakfasts, Christmas
            Dinner Dance, and parish events
          </li>
        </ul>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <div className="card don-contact-card">
          <p className="don-contact-lead">
            Questions about dues, donations, or the Council&rsquo;s finances?
            We&rsquo;re happy to help.
          </p>
          <a href="mailto:kofc6033@churchofpresentation.org" className="don-contact-email">
            <MailIcon />
            kofc6033@churchofpresentation.org
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <section className="don-cta-band">
      <div className="wrap don-cta-wrap">
        <span className="eyebrow" style={{ color: '#F7C04A' }}>Presentation Council #6033</span>
        <h2 style={{ color: '#fff' }}>
          Thank you for supporting our parish and our community.
        </h2>
        <span className="flourish" style={{ background: 'var(--color-gold)' }} />
        <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6, maxWidth: '520px' }}>
          Every contribution &mdash; dues or donation, large or small &mdash; fuels the
          charitable work and parish programs we carry out year after year at
          Church of the Presentation.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/about" className="btn btn-on-navy">
            Learn about our mission →
          </Link>
          <Link
            href="/calendar"
            className="btn btn-secondary"
            style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
          >
            See upcoming events
          </Link>
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

function DonateStyles() {
  return (
    <style>{`
      /* ── Hero ── */
      .don-hero { background: var(--color-surface-alt); position: relative; overflow: hidden; }
      .don-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .don-hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .don-hero h1 { font-size: 52px; line-height: 1.05; }
      .don-hero-lede { font-size: 18px; color: var(--color-ink-soft); max-width: 540px; margin: 18px 0 0; line-height: 1.55; }
      .don-crumbs { font-size: 13px; color: var(--color-muted); font-family: var(--font-mono); letter-spacing: .04em; margin-bottom: 18px; display: flex; align-items: center; }
      .don-crumbs a { color: var(--color-muted); }
      .don-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .don-crumbs-sep { margin: 0 8px; opacity: .5; }
      .don-hero-meta { border-left: 3px solid var(--color-gold); padding: 6px 0 6px 22px; }
      .don-meta-row { display: flex; justify-content: space-between; gap: 14px; font-size: 14px; border-bottom: 1px dashed var(--color-border-strong); padding-bottom: 12px; margin-bottom: 12px; }
      .don-meta-k { color: var(--color-muted); }
      .don-meta-v { color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); font-size: 13px; text-align: right; }
      @media (max-width: 880px) {
        .don-hero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .don-hero h1 { font-size: 38px; }
        .don-hero-meta { display: none; }
      }

      /* ── Facts Strip ── */
      .don-facts-strip { background: var(--color-navy); padding: 44px 0; }
      .don-facts-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
      .don-fact { padding: 12px 24px 12px 0; border-right: 1px solid rgba(255,255,255,.15); }
      .don-fact:last-child { border-right: none; padding-right: 0; }
      .don-fact-num { font-family: var(--font-serif); font-size: 34px; color: var(--color-gold); line-height: 1; margin-bottom: 6px; }
      .don-fact-lbl { font-size: 13px; color: #dde3f1; }
      @media (max-width: 880px) {
        .don-facts-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 0; }
        .don-fact:nth-child(2) { border-right: none; }
        .don-fact:nth-child(4) { border-right: none; }
      }
      @media (max-width: 520px) {
        .don-facts-grid { grid-template-columns: 1fr; }
        .don-fact { border-right: none; border-bottom: 1px solid rgba(255,255,255,.12); padding: 14px 0; }
        .don-fact:last-child { border-bottom: none; }
      }

      /* ── Give Cards ── */
      .don-give-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; margin-top: 32px; }
      .don-give-card { background: #fff; border: 1px solid var(--color-border); border-radius: 6px; padding: 32px 28px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; }
      .don-give-card h3 { font-size: 22px; }
      .don-give-subhead { font-size: 14px; color: var(--color-muted); margin: 4px 0 0; font-family: var(--font-mono); }
      .don-give-card .flourish { margin: 14px 0 18px; }
      .don-give-body { font-size: 15.5px; color: var(--color-ink-soft); line-height: 1.65; margin: 0; flex: 1; }
      .don-give-btn { margin-top: 24px; align-self: flex-start; }
      @media (max-width: 680px) { .don-give-grid { grid-template-columns: 1fr; } }

      /* ── Payment Methods ── */
      .don-pay-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; margin-top: 32px; }
      .don-pay-card { display: flex; flex-direction: column; }
      .don-pay-card h3 { font-size: 21px; }
      .don-pay-card .flourish { margin: 10px 0 20px; }
      .don-qr-wrap { margin: 0 0 16px; }
      .don-venmo-handle { font-family: var(--font-mono); font-size: 18px; font-weight: 700; color: var(--color-navy); margin: 0 0 8px; }
      .don-venmo-verify { font-size: 13px; color: var(--color-muted); line-height: 1.45; margin: 0 0 16px; }
      .don-pay-body { font-size: 15px; color: var(--color-ink-soft); line-height: 1.6; margin: 0 0 12px; }
      .don-check-block { margin-bottom: 20px; }
      .don-check-row { margin-bottom: 16px; }
      .don-check-k { display: block; font-size: 12px; color: var(--color-muted); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; }
      .don-check-v { font-size: 15px; color: var(--color-navy); font-weight: 600; }
      .don-check-address { font-style: normal; font-size: 14.5px; color: var(--color-ink); line-height: 1.7; margin: 4px 0 0; font-family: var(--font-mono); }
      .don-pay-note { font-size: 13px; color: var(--color-muted); line-height: 1.5; margin: 0; font-style: italic; }
      @media (max-width: 680px) { .don-pay-grid { grid-template-columns: 1fr; } }

      /* ── Where Money Goes ── */
      .don-uses-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 48px; }
      .don-uses-list li { font-size: 15.5px; color: var(--color-ink-soft); line-height: 1.55; padding-left: 14px; border-left: 2px solid var(--color-gold); }
      .don-uses-list strong { color: var(--color-navy); }
      @media (max-width: 680px) { .don-uses-list { grid-template-columns: 1fr; } }

      /* ── Contact ── */
      .don-contact-card { max-width: 560px; padding: 28px 32px; }
      .don-contact-lead { font-size: 17px; color: var(--color-ink-soft); line-height: 1.6; margin: 0 0 16px; }
      .don-contact-email { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; color: var(--color-navy); font-weight: 600; font-family: var(--font-mono); }
      .don-contact-email:hover { color: var(--color-gold-dark); text-decoration: none; }

      /* ── CTA Band ── */
      .don-cta-band { background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy)); color: #fff; position: relative; overflow: hidden; }
      .don-cta-band::before { content: ""; position: absolute; left: -120px; bottom: -120px; width: 420px; height: 420px; background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%); }
      .don-cta-wrap { position: relative; }
      .don-cta-band h2 { color: #fff; font-size: 36px; max-width: 640px; }
      .don-cta-band .flourish { margin: 14px 0 18px; }
      @media (max-width: 780px) { .don-cta-band h2 { font-size: 28px; } }

      /* ── Scroll offsets ── */
      #give, #payment-methods, #where-it-goes, #contact { scroll-margin-top: 80px; }
    `}</style>
  )
}
