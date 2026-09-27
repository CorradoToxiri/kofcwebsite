import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Golf Outing — Thank You',
  description:
    'Thank you to everyone who golfed, sponsored, and supported the 2026 Presentation Golf Outing at Darlington Golf Course.',
}

const SUPABASE_PHOTOS = 'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos'

export default function GolfOutingPage() {
  return (
    <>
      <Banner />
      <RecapSection />
      <SponsorsSection />
      <ClosingSection />
      <GolfStyles />
    </>
  )
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function Banner() {
  return (
    <section className="gty-banner" aria-label="Golf Outing banner">
      <Image
        src={`${SUPABASE_PHOTOS}/Activities_signature2.jpg`}
        alt="Golfers on a sunny fairway at Darlington Golf Course"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        sizes="100vw"
      />
      <div className="gty-banner-scrim" aria-hidden="true" />
      <div className="gty-banner-text">
        <p className="gty-banner-eyebrow">Presentation Council #6033</p>
        <h1 className="gty-banner-title">Thank You — 2026 Presentation Golf Outing</h1>
        <p className="gty-banner-date">Monday, September 14, 2026 · Darlington Golf Course, Mahwah</p>
      </div>
    </section>
  )
}

// ─── Recap section ────────────────────────────────────────────────────────────

function RecapSection() {
  return (
    <section className="gty-recap-section">
      <div className="wrap">
        <nav className="gty-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="gty-crumbs-sep" aria-hidden="true">/</span>
          <span aria-current="page">Golf Outing</span>
        </nav>
        <p className="gty-recap">
          Thank you to everyone who joined us on Monday, September 14, 2026 at Darlington Golf
          Course, 277 Campgaw Road, Mahwah, NJ, for a beautiful day of golf followed by a casual
          dinner at The Mason Jar. Since our first outing in 2000, the Presentation Golf Outing
          has distributed over $500,000 to worthy causes — funding our Parish Food Pantry, the
          Medical Mission in Haiti, Covenant House, the Thanksgiving Turkey Drive, parish youth
          activities, our local Ambulance Corps, organizations supporting abused women and single
          mothers, Lighthouse pregnancy services, and many others.
        </p>
        <p className="gty-recap">
          None of it happens without the golfers who came out to play and the sponsors who backed
          the cause. Thank you for another outing that made a real difference for families across
          Bergen, Rockland, and Orange Counties.
        </p>
        <Link href="/charities" className="gty-charities-link">
          See what your support makes possible →
        </Link>
      </div>
    </section>
  )
}

// ─── Sponsors section ─────────────────────────────────────────────────────────

const SPONSOR_TIERS: { heading: string; layout: 'single' | 'columns'; names: string[] }[] = [
  {
    heading: 'Gold Sponsor',
    layout: 'single',
    names: ['Inserra Supermarkets'],
  },
  {
    heading: 'Silver Sponsor',
    layout: 'single',
    names: ['Ed and Donna Dowd'],
  },
  {
    heading: 'Bronze Sponsors',
    layout: 'single',
    names: [
      'Darren L. Hugo, CFP - The Meridian Group',
      'Horton Family',
      'Martha & Rick',
      'Mary Lynch',
      "Mike and Julie O'Brien",
      'Sterling Affair – Peter Fazio',
    ],
  },
  {
    heading: 'Outing Partners',
    layout: 'columns',
    names: [
      'Bobby and Carol Williams',
      'Charlie Miraglia, KofC Insurance Agent',
      'Downes Tree Service',
      'Gregg Romanzo',
      "Guy Gaudenzi's Golfing Buddies",
      'K2 Physical Therapy',
      'Kevin R. Birdsall CPA, LLC',
      "Presentation Men's Wednesday 6:00am",
      "Terrie O'Connor Realtors / Sean Farley",
      'Victor Hartanto',
      'Wannamaker & Carlough Funeral Home',
    ],
  },
  {
    heading: 'Friends of the Knights',
    layout: 'columns',
    names: [
      'Bill and Margaret Pangert, In Memory of Bill',
      'Blue Hill Golf Course',
      'Corrado & Giovanna Toxiri',
      'Driscoll Foods',
      'Paramus Golf Course',
      "Presentation Men's Cornerstone Team",
      'PSC / Professional Security Consultants',
      'Old Tappan Golf Course',
      'Spook Rock Golf Course',
    ],
  },
  {
    heading: 'Hole Sponsors',
    layout: 'columns',
    names: [
      'Allendale Bar & Grill',
      'Becker Funeral Home',
      'Bergen Tire of Mahwah',
      'Bon Venture Services, LLC',
      "Brady's at the Station",
      'Carol Reilly-McDermott',
      'Cutler Wealth Planning',
      'Dark Star Electric',
      'Dave Powers',
      'Ditomaso Landscape Group',
      'Donna and Ed Kennedy',
      'ECI Edmonds Contracting Inc.',
      'Friends of Nova Hope for Haiti',
      'Gene Boyle',
      "In Memory of Connie D'Angelo",
      'Jim & Terri McKeown',
      'Jimmy the Junk Man, LLC',
      'Kay and Jack Julian',
      'Lawrence & Jacqueline McGee',
      'Mahwah Bar and Grill',
      'Mahwah Sunoco',
      'Matt & Gerry Harold',
      'Matthews Colonial Restaurant',
      'Maureen and Brian Murphy',
      "McPeek's Garage",
      'Mercedes-Benz of Paramus',
      'Northern New Jersey Title Services',
      "Reno's Appliance Paterson, NJ",
      'Rosemary and Barry Ervin',
      'Schreiber Foods International Inc.',
      'Silex Financial Group, Inc.',
      'Spring Street Cleaners',
      'The Corcoran Law Group, LLC',
      'The Mahoney Group at Raymond James',
      'Thomas Napolitano',
      'Ulrich, Inc.',
      'Valley Diagnostic Medical Center',
      'Van Emburgh-Sneider-Pernice Funeral Home',
      'Vince & Roseann Barra',
      'Vince Giovinco',
      'Wells, Jaworski & Liebman, LLP',
    ],
  },
]

function SponsorsSection() {
  return (
    <section className="gty-sponsors-section">
      <div className="wrap">
        <span className="eyebrow" style={{ textAlign: 'center', display: 'block' }}>
          With gratitude
        </span>
        <h2 className="gty-sponsors-heading">Our 2026 Sponsors</h2>
        <span className="flourish flourish-center" />
        {SPONSOR_TIERS.map((tier) => (
          <div className="gty-tier" key={tier.heading}>
            <h3 className="gty-tier-heading">{tier.heading}</h3>
            <ul className={tier.layout === 'columns' ? 'gty-tier-list gty-tier-list-columns' : 'gty-tier-list'}>
              {tier.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Closing section ──────────────────────────────────────────────────────────

function ClosingSection() {
  return (
    <section className="gty-closing-section">
      <div className="wrap">
        <p className="gty-closing-note">
          Interested in next year&rsquo;s outing? Watch this page for details, or reach out below.
        </p>
        <p className="gty-contact">
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
      .gty-banner {
        position: relative;
        height: 420px;
        overflow: hidden;
        background: var(--color-navy-dark);
      }
      @media (max-width: 600px) { .gty-banner { height: 280px; } }

      .gty-banner-scrim {
        position: absolute; inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 20, 70, 0.28) 0%,
          rgba(0, 20, 70, 0.65) 60%,
          rgba(0, 20, 70, 0.80) 100%
        );
      }
      .gty-banner-text {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        justify-content: flex-end;
        padding: 0 32px 44px;
        max-width: var(--width-content);
        margin: 0 auto; left: 0; right: 0;
      }
      .gty-banner-eyebrow {
        font-family: var(--font-sans); font-size: 13px; font-weight: 600;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--color-gold); margin: 0 0 10px;
      }
      .gty-banner-title {
        font-family: var(--font-serif); font-size: 42px; font-weight: 600;
        color: #fff; line-height: 1.1; margin: 0 0 12px;
        letter-spacing: -0.01em;
      }
      .gty-banner-date {
        font-family: var(--font-mono); font-size: 15px;
        color: #e2e8f4; margin: 0;
      }
      @media (max-width: 600px) {
        .gty-banner-text { padding: 0 20px 28px; }
        .gty-banner-title { font-size: 26px; }
        .gty-banner-date { font-size: 13px; }
      }

      /* ── Recap ── */
      .gty-recap-section {
        background: #fff;
        padding: 40px 0 56px;
      }
      .gty-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 20px; display: flex; gap: 0; align-items: center;
      }
      .gty-crumbs a { color: var(--color-muted); }
      .gty-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .gty-crumbs-sep { margin: 0 8px; opacity: .5; }
      .gty-recap {
        font-size: 19px; line-height: 1.68; color: var(--color-ink-soft);
        max-width: 760px; margin: 0 0 22px;
      }
      .gty-recap:last-of-type { margin-bottom: 28px; }
      @media (max-width: 600px) { .gty-recap { font-size: 16px; } }
      .gty-charities-link {
        display: inline-block;
        font-family: var(--font-sans); font-weight: 600; font-size: 16px;
        color: var(--color-navy);
      }
      .gty-charities-link:hover { color: var(--color-gold-dark); }

      /* ── Sponsors ── */
      .gty-sponsors-section {
        background: var(--color-surface-alt);
        padding: 64px 0;
      }
      .gty-sponsors-heading {
        font-size: 38px; text-align: center; margin: 6px 0 0;
      }
      .gty-sponsors-section .flourish { margin: 14px auto 40px; }
      .gty-tier { max-width: 900px; margin: 0 auto 40px; }
      .gty-tier:last-child { margin-bottom: 0; }
      .gty-tier-heading {
        font-size: 20px; margin: 0 0 12px;
        color: var(--color-navy);
      }
      .gty-tier-list {
        list-style: none; margin: 0; padding: 0;
        font-size: 16px; color: var(--color-ink-soft); line-height: 1.9;
      }
      .gty-tier-list li { break-inside: avoid; }
      .gty-tier-list-columns {
        columns: 3 260px;
        column-gap: 32px;
      }
      @media (max-width: 700px) {
        .gty-tier-list-columns { columns: 1; }
      }

      /* ── Closing ── */
      .gty-closing-section {
        background: #fff;
        padding: 48px 0 56px;
      }
      .gty-closing-note {
        font-size: 17px; color: var(--color-ink-soft);
        line-height: 1.6; margin: 0 0 24px;
        max-width: 680px;
      }
      .gty-contact {
        font-size: 16px; color: var(--color-ink-soft);
        line-height: 1.65; margin: 0;
        max-width: 680px;
        border-left: 3px solid var(--color-gold);
        padding-left: 18px;
      }
      .gty-contact a { color: var(--color-navy); font-weight: 600; }
      .gty-contact a:hover { color: var(--color-gold-dark); }
    `}</style>
  )
}
