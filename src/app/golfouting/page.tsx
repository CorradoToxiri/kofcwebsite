import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Golf Outing 2026',
  description:
    'Join us for the 2026 Presentation Golf Outing — Monday, September 14 at Darlington Golf Course. Register to play or become a sponsor.',
}

const SUPABASE_PHOTOS = 'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos'

export default function GolfOutingPage() {
  return (
    <>
      <Banner />
      <LeadSection />
      <DetailsBlock />
      <RegistrationSection />
      <OnlinePaymentSection />
      <BrochureSection />
      <ContactSection />
      <GolfStyles />
    </>
  )
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function Banner() {
  return (
    <section className="go-banner" aria-label="Golf Outing banner">
      <Image
        src={`${SUPABASE_PHOTOS}/Activities_signature2.jpg`}
        alt="Golfers on a sunny fairway at Darlington Golf Course"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        sizes="100vw"
      />
      <div className="go-banner-scrim" aria-hidden="true" />
      <div className="go-banner-text">
        <p className="go-banner-eyebrow">Presentation Council #6033</p>
        <h1 className="go-banner-title">The 2026 Presentation Golf Outing</h1>
        <p className="go-banner-date">Monday, September 14, 2026 · Darlington Golf Course, Mahwah</p>
      </div>
    </section>
  )
}

// ─── Lead section ─────────────────────────────────────────────────────────────

function LeadSection() {
  return (
    <section className="go-lead-section">
      <div className="wrap">
        <nav className="go-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="go-crumbs-sep" aria-hidden="true">/</span>
          <span aria-current="page">Golf Outing</span>
        </nav>
        <p className="go-lead">
          Come join us for a great day of golf! Since our first outing in 2000, the Presentation
          Golf Outing has distributed over $500,000 to worthy charities — funding our Parish Food
          Pantry, the Medical Mission in Haiti, Covenant House, the Thanksgiving Turkey Drive,
          parish youth activities, our local Ambulance Corps, and many others. It&rsquo;s our
          biggest day of the year: a beautiful course, good-natured competition, old friends and
          new, and a casual dinner to cap it off — all for causes that reach thousands of families
          across Bergen, Rockland, and Orange Counties.
        </p>
      </div>
    </section>
  )
}

// ─── Details block ────────────────────────────────────────────────────────────

function DetailsBlock() {
  return (
    <section className="go-details-section">
      <div className="wrap">
        <span className="eyebrow">The day at a glance</span>
        <dl className="go-details">
          <div className="go-detail-row">
            <dt>When</dt>
            <dd>Monday, September 14, 2026</dd>
          </div>
          <div className="go-detail-row">
            <dt>Where</dt>
            <dd>Darlington Golf Course, 277 Campgaw Road, Mahwah, NJ</dd>
          </div>
          <div className="go-detail-row" style={{ borderBottom: 'none' }}>
            <dt>Dinner</dt>
            <dd>Casual dinner with beer and wine at The Mason Jar</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

// ─── Registration section ─────────────────────────────────────────────────────

function RegistrationSection() {
  return (
    <section className="go-reg-section">
      <div className="wrap">
        <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>
          Join us on the course
        </span>
        <h2 className="go-reg-heading">Register today.</h2>
        <span className="flourish flourish-center" />
        <div className="go-reg-panels">
          <RegPanel
            heading="Register to Play"
            body="Grab your foursome — or sign up solo and we'll pair you up."
            buttonLabel="Golfer Registration →"
            buttonHref="https://forms.gle/LnauYv1wJyNPVLsu9"
            qrSrc={`${SUPABASE_PHOTOS}/QR_Code_GolferRegistration2026.jpg`}
            qrAlt="QR code for golfer registration"
            qrCaption="Scan to register"
          />
          <RegPanel
            heading="Become a Sponsor"
            body="Support the cause and reach 4,000+ families through our parish bulletin. Sponsorship levels from Hole Sponsors to Diamond."
            buttonLabel="Sponsor Registration →"
            buttonHref="https://forms.gle/tUcrqw3ENENr4QzP6"
            qrSrc={`${SUPABASE_PHOTOS}/QR_Code_SponsorRegistration2026.jpg`}
            qrAlt="QR code for sponsor registration"
            qrCaption="Scan to sponsor"
          />
        </div>
      </div>
    </section>
  )
}

interface RegPanelProps {
  heading: string
  body: string
  buttonLabel: string
  buttonHref: string
  qrSrc: string
  qrAlt: string
  qrCaption: string
}

function RegPanel({ heading, body, buttonLabel, buttonHref, qrSrc, qrAlt, qrCaption }: RegPanelProps) {
  return (
    <div className="go-reg-panel">
      <h3 className="go-reg-panel-heading">{heading}</h3>
      <p className="go-reg-panel-body">{body}</p>
      <a
        href={buttonHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        {buttonLabel}
      </a>
      <div className="go-qr-wrap">
        <Image
          src={qrSrc}
          alt={qrAlt}
          width={180}
          height={180}
          style={{ display: 'block' }}
        />
        <p className="go-qr-caption">{qrCaption}</p>
      </div>
    </div>
  )
}

// ─── Online Payment section ───────────────────────────────────────────────────

function OnlinePaymentSection() {
  return (
    <section className="go-pay-section">
      <div className="wrap">
        <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>
          Pay online
        </span>
        <h2 className="go-pay-heading">Online Payment</h2>
        <span className="flourish flourish-center" />
        <div className="go-reg-panels">

          <div className="go-reg-panel">
            <h3 className="go-reg-panel-heading">Pay with Zelle</h3>
            <div className="go-pay-img-wrap">
              <Image
                src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/QR_Code_Zelle.png"
                alt="Zelle QR code for Knights of Columbus #6033"
                width={345}
                height={420}
                style={{ borderRadius: '4px', maxWidth: '260px', width: '100%', height: 'auto' }}
              />
            </div>
            <p className="go-pay-handle">kofc6033@churchofpresentation.org</p>
            <p className="go-pay-verify">
              Verify the payee reads KNIGHTS OF COLUMBUS before sending.
            </p>
            <p className="go-reg-panel-body">
              Open your bank app and look for the &lsquo;Pay with Zelle&rsquo; section,
              then scan the QR code above.
            </p>
          </div>

          <div className="go-reg-panel">
            <h3 className="go-reg-panel-heading">Example Payment</h3>
            <div className="go-pay-img-wrap">
              <Image
                src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/Example_Zelle_Payment.png"
                alt="Example of a completed Zelle payment screen"
                width={345}
                height={420}
                style={{ borderRadius: '4px', maxWidth: '260px', width: '100%', height: 'auto' }}
              />
            </div>
            <p className="go-reg-panel-body">
              Enter the amount, and in the &lsquo;Message to recipient&rsquo; field, add your
              name and specify whether this is a sponsorship or a payment for the golfer fees.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Brochure section ─────────────────────────────────────────────────────────

function BrochureSection() {
  return (
    <section className="go-brochure-section">
      <div className="wrap go-brochure-inner">
        <a
          href="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/documents/KOC%20Golf%20Outing%20Brochure%202026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          Download the Brochure (PDF)
        </a>
        <p className="go-brochure-note">
          Prefer to register by mail? The brochure has a printable form.
        </p>
      </div>
    </section>
  )
}

// ─── Contact section ──────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section className="go-contact-section">
      <div className="wrap">
        <p className="go-contact">
          Questions? For sponsorships, contact Sean Farley at (201) 286-7206. For golf, contact
          Ed Dowd at (201) 787-9385. Or email us at{' '}
          <a href="mailto:kofc6033@churchofpresentation.org">
            kofc6033@churchofpresentation.org
          </a>
          .
        </p>
      </div>
    </section>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function GolfStyles() {
  return (
    <style>{`
      /* ── Banner ── */
      .go-banner {
        position: relative;
        height: 420px;
        overflow: hidden;
        background: var(--color-navy-dark);
      }
      @media (max-width: 600px) { .go-banner { height: 280px; } }

      .go-banner-scrim {
        position: absolute; inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 20, 70, 0.28) 0%,
          rgba(0, 20, 70, 0.65) 60%,
          rgba(0, 20, 70, 0.80) 100%
        );
      }
      .go-banner-text {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        justify-content: flex-end;
        padding: 0 32px 44px;
        max-width: var(--width-content);
        margin: 0 auto; left: 0; right: 0;
      }
      .go-banner-eyebrow {
        font-family: var(--font-sans); font-size: 13px; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--color-gold); margin: 0 0 10px;
      }
      .go-banner-title {
        font-family: var(--font-serif); font-size: 46px; font-weight: 600;
        color: #fff; line-height: 1.06; margin: 0 0 12px;
        letter-spacing: -0.01em;
      }
      .go-banner-date {
        font-family: var(--font-mono); font-size: 15px;
        color: #e2e8f4; margin: 0;
      }
      @media (max-width: 600px) {
        .go-banner-text { padding: 0 20px 28px; }
        .go-banner-title { font-size: 28px; }
        .go-banner-date { font-size: 13px; }
      }

      /* ── Lead ── */
      .go-lead-section {
        background: #fff;
        padding: 40px 0 0;
      }
      .go-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 20px; display: flex; gap: 0; align-items: center;
      }
      .go-crumbs a { color: var(--color-muted); }
      .go-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .go-crumbs-sep { margin: 0 8px; opacity: .5; }
      .go-lead {
        font-size: 19px; line-height: 1.68; color: var(--color-ink-soft);
        max-width: 760px; margin: 0 0 0;
        padding-bottom: 56px;
      }
      @media (max-width: 600px) { .go-lead { font-size: 16px; } }

      /* ── Details block ── */
      .go-details-section {
        background: var(--color-surface-alt);
        padding: 52px 0;
      }
      .go-details-section .eyebrow { margin-bottom: 20px; }
      .go-details {
        margin: 0; padding: 0;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        background: #fff;
        max-width: 560px;
        overflow: hidden;
        box-shadow: var(--shadow-card);
      }
      .go-detail-row {
        display: flex; align-items: baseline; gap: 16px;
        padding: 16px 22px;
        border-bottom: 1px solid var(--color-border);
      }
      .go-detail-row dt {
        font-family: var(--font-sans); font-size: 12px; font-weight: 700;
        letter-spacing: 0.14em; text-transform: uppercase;
        color: var(--color-muted); min-width: 56px; flex-shrink: 0;
      }
      .go-detail-row dd {
        margin: 0; font-size: 15.5px;
        color: var(--color-ink); font-weight: 500;
      }

      /* ── Registration ── */
      .go-reg-section {
        background: #fff;
        padding: 64px 0;
      }
      .go-reg-heading {
        font-size: 38px; text-align: center; margin: 6px 0 0;
      }
      .go-reg-section .flourish { margin: 14px auto 36px; }
      .go-reg-panels {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
      }
      @media (max-width: 700px) {
        .go-reg-panels { grid-template-columns: 1fr; }
        .go-reg-panel { min-width: 0; }
      }
      .go-reg-panel {
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 32px;
        display: flex; flex-direction: column;
        gap: 16px;
        box-shadow: var(--shadow-card);
      }
      .go-reg-panel-heading {
        font-size: 24px; margin: 0; line-height: 1.2;
      }
      .go-reg-panel-body {
        font-size: 16px; color: var(--color-ink-soft);
        line-height: 1.6; margin: 0;
      }
      .go-qr-wrap {
        display: flex; flex-direction: column;
        align-items: flex-start; gap: 8px;
        margin-top: 4px;
      }
      .go-qr-caption {
        font-size: 12px; color: var(--color-muted);
        font-family: var(--font-mono); margin: 0;
        letter-spacing: .04em;
      }

      /* ── Online Payment ── */
      .go-pay-section {
        background: var(--color-surface-alt);
        padding: 64px 0;
      }
      .go-pay-heading {
        font-size: 38px; text-align: center; margin: 6px 0 0;
      }
      .go-pay-section .flourish { margin: 14px auto 36px; }
      .go-pay-section .go-reg-panel { background: #fff; }
      .go-pay-img-wrap { margin-bottom: 4px; }
      .go-pay-handle {
        font-family: var(--font-mono); font-size: 16px; font-weight: 700;
        color: var(--color-navy); margin: 0;
      }
      .go-pay-verify {
        font-size: 13px; color: var(--color-muted); line-height: 1.45; margin: 0;
      }

      /* ── Brochure ── */
      .go-brochure-section {
        background: var(--color-surface-alt);
        padding: 48px 0;
      }
      .go-brochure-inner {
        display: flex; flex-wrap: wrap;
        align-items: center; gap: 18px;
      }
      .go-brochure-note {
        font-size: 15px; color: var(--color-muted);
        margin: 0; font-style: italic;
      }

      /* ── Contact ── */
      .go-contact-section {
        background: #fff;
        padding: 40px 0 56px;
      }
      .go-contact {
        font-size: 16px; color: var(--color-ink-soft);
        line-height: 1.65; margin: 0;
        max-width: 680px;
        border-left: 3px solid var(--color-gold);
        padding-left: 18px;
      }
      .go-contact a { color: var(--color-navy); font-weight: 600; }
      .go-contact a:hover { color: var(--color-gold-dark); }

      /* ── Mobile ── */
      @media (max-width: 480px) {
        .go-reg-panel { padding: 16px; }
        .go-pay-handle { font-size: 12px; white-space: nowrap; }
      }
    `}</style>
  )
}
