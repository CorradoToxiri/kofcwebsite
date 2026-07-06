import type { Metadata } from 'next'
import Link from 'next/link'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How we handle your information — in plain language.',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <>
      <PageHero />
      <PrivacyBody />
      <PrivacyStyles />
    </>
  )
}

// ─── Page Hero ───────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="prv-hero">
      <div className="prv-hero-inner">
        <nav className="prv-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="prv-crumbs-sep" aria-hidden="true">/</span>
          <span aria-current="page">Privacy</span>
        </nav>
        <span className="eyebrow">Presentation Council #6033</span>
        <h1>Privacy</h1>
        <p className="prv-hero-lede">How we handle your information — in plain language.</p>
      </div>
    </section>
  )
}

// ─── Body ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    heading: 'The short version',
    body: 'This website is a simple, public presentation of Knights of Columbus Presentation Council #6033. We don’t ask visitors to create accounts, fill out forms, or share personal information to browse the site. We’re not in the business of collecting your data.',
  },
  {
    heading: 'What we collect',
    body: 'Almost nothing. You can read every page on this site without telling us who you are. We don’t use advertising trackers, and we don’t sell or share information about our visitors — because we don’t gather it in the first place.',
  },
  {
    heading: 'A note on technical basics',
    body: 'Like nearly every website, our site is hosted on servers (provided by Vercel) that keep standard technical logs — things like the general request information every web server records. We don’t use this to identify you, and we don’t combine it with anything else. If we ever add visitor analytics in the future, we’ll update this page to say so.',
  },
  {
    heading: 'Links to other sites',
    body: 'Our site includes links to trusted outside services — for example, the official Knights of Columbus join page, Venmo for donations, our volunteer signup page, Google Maps for event locations, and the websites of the charities we support. Once you follow one of those links, you’re on someone else’s site, and their privacy practices apply, not ours. We’d encourage you to review their policies if you have questions.',
  },
  {
    heading: 'Information about our officers',
    body: 'Our Officers page lists the names, roles, and contact email of council officers. This information is published with their knowledge, so that members and parishioners can reach the council. If you’re an officer and would like your information updated, just let us know.',
  },
  {
    heading: 'Council administrators',
    body: 'A small number of council officers can sign in to manage the site’s content. We store only what’s needed for them to log in securely. This doesn’t involve any information from general visitors.',
  },
]

function PrivacyBody() {
  return (
    <section className="prv-body">
      <div className="wrap">
        <div className="prv-content">
          {SECTIONS.map((s) => (
            <div key={s.heading} className="prv-section">
              <h2 className="prv-section-heading">{s.heading}</h2>
              <p className="prv-section-body">{s.body}</p>
            </div>
          ))}

          <div className="prv-section">
            <h2 className="prv-section-heading">Questions?</h2>
            <p className="prv-section-body">
              If you have any questions about this site or how we handle information, email us at{' '}
              <a href="mailto:kofc6033@churchofpresentation.org" className="prv-email">
                kofc6033@churchofpresentation.org
              </a>{' '}
              — we’re happy to help.
            </p>
          </div>

          <p className="prv-updated">Last updated: June 2026</p>
        </div>
      </div>
    </section>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function PrivacyStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .prv-hero {
        background: var(--color-surface-alt);
        position: relative; overflow: hidden;
      }
      .prv-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .prv-hero-inner {
        max-width: var(--width-content); margin: 0 auto;
        padding: 60px 32px 56px; position: relative;
      }
      .prv-hero h1 { font-size: 52px; line-height: 1.05; }
      .prv-hero-lede {
        font-size: 18px; color: var(--color-ink-soft);
        max-width: 480px; margin: 18px 0 0; line-height: 1.5;
      }
      .prv-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 18px; display: flex; align-items: center;
      }
      .prv-crumbs a { color: var(--color-muted); }
      .prv-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .prv-crumbs-sep { margin: 0 8px; opacity: .5; }
      @media (max-width: 640px) {
        .prv-hero-inner { padding: 40px 24px 44px; }
        .prv-hero h1 { font-size: 38px; }
      }

      /* ── Body ── */
      .prv-body { background: #fff; }
      .prv-body .wrap { padding-top: 56px; padding-bottom: 72px; }
      .prv-content { max-width: 660px; }
      .prv-section { margin-bottom: 40px; }
      .prv-section-heading {
        font-family: var(--font-serif); font-size: 22px; font-weight: 600;
        color: var(--color-navy); margin: 0 0 12px; line-height: 1.2;
      }
      .prv-section-body {
        font-size: 17px; color: var(--color-ink-soft);
        line-height: 1.75; margin: 0;
      }
      .prv-email {
        color: var(--color-navy); font-weight: 600;
      }
      .prv-email:hover { color: var(--color-gold-dark); }
      .prv-updated {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin: 16px 0 0; border-top: 1px dashed var(--color-border-strong);
        padding-top: 20px;
      }
    `}</style>
  )
}
