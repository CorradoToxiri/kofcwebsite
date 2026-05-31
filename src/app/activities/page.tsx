import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Activities',
  description: 'Service is our calling — but the friendships are what keep us coming back. A year in the life of Council #6033.',
}

// ─── Content data ─────────────────────────────────────────────────────────────

const BASE = 'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/'
const img  = (file: string) => `${BASE}${file}`

type Entry = { name: string; desc: string }
type Theme = { title: string; image: string; imageAlt: string; intro: string; entries: Entry[] }

const THEMES: Theme[] = [
  {
    title:    'Faith & Fellowship',
    image:    'Activities_faith2.jpg',
    imageAlt: 'Knights gathered in faith and fellowship',
    intro:    'Everything we do begins in faith — and often, around a table.',
    entries: [
      {
        name: 'Pancake Breakfast',
        desc: "Our annual parish pancake breakfast is a Presentation tradition, with the Knights working the griddle to support the Youth Ministry's summer mission trips. Bring the family; leave full.",
      },
      {
        name: "Saint Nick's Breakfast",
        desc: 'A joyful morning for parish families as the Christmas season begins, with a special visit that delights the children.',
      },
      {
        name: 'Breakfast for the Discipleship Weekend',
        desc: 'When the parish gathers for its Discipleship Weekend, the Knights are in the kitchen at dawn, serving breakfast to those deepening their faith.',
      },
      {
        name: 'Serving Breakfast at Cornerstone',
        desc: 'Brother Knights rise early to cook and serve breakfast at the Cornerstone Retreat, a quiet act of service that means the world to those on retreat.',
      },
      {
        name: "Knight's Memorial Mass & Reception",
        desc: "Each year we gather to remember the brothers we've lost, with a memorial Mass and a reception that honors their place in our council family.",
      },
      {
        name: 'Packathon',
        desc: "A hands-on outreach where volunteers package nutritious meals for families in need, including those served through Holy Name's Haiti Health Promise. The Knights handle setup and bring the muscle.",
      },
    ],
  },
  {
    title:    'Food & Festivities',
    image:    'Activities_service3.jpg',
    imageAlt: 'Knights celebrating together',
    intro:    'We take fellowship seriously. That means we eat well and celebrate often.',
    entries: [
      {
        name: "Knight's Summer BBQ",
        desc: 'An evening of great food, cold drinks, and easy company — most recently hosted at the home of Sean and Ellen Farley. The kind of night that turns members into friends.',
      },
      {
        name: 'Parish Christmas Party',
        desc: 'The whole parish comes together for our annual Christmas celebration, and the Knights are proud to help make it merry.',
      },
      {
        name: 'Christmas Social',
        desc: 'Our December council meeting trades business for cheer — good food, fellowship, and the warmth of the season among brothers.',
      },
      {
        name: 'Charity Dinner at Limoncello',
        desc: 'A fine evening out with a purpose: great Italian food, great company, and funds raised for those we serve.',
      },
    ],
  },
  {
    title:    'Service, Side by Side',
    image:    'Activities_service1.jpg',
    imageAlt: 'Knights serving the community together',
    intro:    'When the parish or the community needs hands, the Knights show up — together.',
    entries: [
      {
        name: 'Soup Kitchen Cooking',
        desc: "Several times a year, brother Knights cover their own shifts cooking for our parish's Soup Kitchen Ministry, preparing meals delivered to Newark and Harlem.",
      },
      {
        name: 'Serving Thanksgiving at Covenant House',
        desc: 'Each year we serve a Thanksgiving meal to young people at Covenant House in Newark — donating the food, then staying to serve it ourselves.',
      },
      {
        name: 'Thanksgiving Turkey Drive',
        desc: "Brothers bring frozen turkeys to the November meeting, collected for local families in need and for the Soup Kitchen's Thanksgiving dinner.",
      },
      {
        name: 'Intellectual Disabilities Drive',
        desc: 'Our annual collection drive, a longstanding Knights of Columbus tradition, supporting those with intellectual and developmental disabilities.',
      },
      {
        name: 'Vaccination Drive at Presentation',
        desc: 'The Knights help the parish host a community vaccination drive, caring for the health of our neighbors.',
      },
      {
        name: "Sisters of Charity Kids' Picnic",
        desc: 'Each summer we welcome children from the Bronx, Brooklyn, Manhattan, and Morristown for a day of fun at Presentation, in partnership with the Sisters of Charity.',
      },
      {
        name: '4th Degree Krispy Kreme / Wreaths Across America Drive',
        desc: 'Our Fourth Degree Knights raise funds to lay remembrance wreaths on the graves of veterans through Wreaths Across America.',
      },
    ],
  },
  {
    title:    'Signature Events',
    image:    'Activities_signature1.jpg',
    imageAlt: 'Knights at a signature council event',
    intro:    'Some traditions are the highlight of the whole year.',
    entries: [
      {
        name: 'Presentation Golf Outing',
        desc: "Our annual Presentation Golf Outing is a council highlight and one of our biggest fundraisers — a day of good-natured competition, fellowship, and support for the year's charitable work.",
      },
      {
        name: 'Knights Golf Outing at Old Tappan',
        desc: 'A second day on the links at Old Tappan, bringing brothers together for friendly competition and a shared good cause.',
      },
    ],
  },
]

const MOSAIC = [
  { file: 'Activities_service2.png',  alt: 'Knights at service' },
  { file: 'Activities_service4.jpg',  alt: 'Council moments together' },
  { file: 'Activities_signature2.jpg', alt: 'Knights at a signature event' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ActivitiesPage() {
  return (
    <>
      <PageHero />
      <LeadIn />
      <HeroBand />
      {THEMES.map((theme, i) => (
        <ThemeSection key={theme.title} theme={theme} alt={i % 2 !== 0} />
      ))}
      <ClosingMosaic />
      <ClosingCta />
      <ActivitiesStyles />
    </>
  )
}

// ─── Page Hero ───────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="act-hero">
      <div className="act-hero-inner">
        <nav className="act-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="act-crumbs-sep" aria-hidden="true">/</span>
          <span aria-current="page">Activities</span>
        </nav>
        <span className="eyebrow">Presentation Council #6033</span>
        <h1>The best part is the brotherhood.</h1>
        <p className="act-hero-lede">
          Service is our calling — but the friendships are what keep us coming back.
          Here&rsquo;s a year in the life of Council #6033.
        </p>
      </div>
    </section>
  )
}

// ─── Lead-in paragraph ───────────────────────────────────────────────────────

function LeadIn() {
  return (
    <section className="act-leadin">
      <div className="wrap">
        <p className="act-leadin-p">
          Ask any Knight why he stays, and he won&rsquo;t start with the charity work —
          he&rsquo;ll start with the men beside him. A council year is full: pancake griddles
          and golf carts, soup kitchens and Christmas parties, early mornings and late dinners.
          Some of it is hard work, most of it is a good time, and all of it is done shoulder
          to shoulder. This is what we do together.
        </p>
      </div>
    </section>
  )
}

// ─── Opening hero band ───────────────────────────────────────────────────────

function HeroBand() {
  return (
    <div className="act-band">
      <Image
        src={img('Activities_faith1.jpg')}
        alt="A year of brotherhood at Presentation"
        fill
        style={{ objectFit: 'cover' }}
        sizes="100vw"
        priority
      />
      <div className="act-band-overlay" />
      <div className="act-band-text">
        <div className="wrap">
          <p className="act-band-tagline">A year of brotherhood at Presentation.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Theme section ────────────────────────────────────────────────────────────

function ThemeSection({ theme, alt }: { theme: Theme; alt: boolean }) {
  return (
    <section className={`act-theme${alt ? ' act-theme--alt' : ''}`}>
      <div className="act-section-img-wrap">
        <Image
          src={img(theme.image)}
          alt={theme.imageAlt}
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
      </div>
      <div className="wrap">
        <div className="act-section-head">
          <h2 className="act-section-title">{theme.title}</h2>
          <p className="act-section-intro">{theme.intro}</p>
          <span className="flourish" />
        </div>
        <ul className="act-entries">
          {theme.entries.map((e) => (
            <li key={e.name} className="act-entry">
              <span className="act-entry-name">{e.name}</span>
              {' — '}
              {e.desc}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─── Closing mosaic ───────────────────────────────────────────────────────────

function ClosingMosaic() {
  return (
    <div className="act-mosaic">
      {MOSAIC.map(({ file, alt }) => (
        <div key={file} className="act-mosaic-item">
          <Image
            src={img(file)}
            alt={alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}

// ─── Closing CTA ─────────────────────────────────────────────────────────────

function ClosingCta() {
  return (
    <section className="act-cta">
      <div className="wrap">
        <span className="eyebrow" style={{ color: '#F7C04A' }}>Presentation Council #6033</span>
        <h2 style={{ color: '#fff' }}>This could be your council, too.</h2>
        <span className="flourish" style={{ background: 'var(--color-gold)' }} />
        <p style={{ color: '#cfd6e8', fontSize: '17px', lineHeight: 1.65, maxWidth: '560px', margin: '0 0 32px' }}>
          Every one of these days is better with more brothers. If any of this looks like
          time well spent, come see for yourself.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/join" className="btn btn-on-navy">Join the Knights →</Link>
          <Link
            href="/calendar"
            className="btn btn-secondary"
            style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
          >
            Come to a Meeting
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function ActivitiesStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .act-hero {
        background: var(--color-surface-alt);
        position: relative; overflow: hidden;
      }
      .act-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .act-hero-inner {
        max-width: var(--width-content); margin: 0 auto;
        padding: 60px 32px 56px; position: relative;
      }
      .act-hero h1 { font-size: 52px; line-height: 1.05; max-width: 720px; }
      .act-hero-lede {
        font-size: 19px; color: var(--color-ink-soft);
        max-width: 640px; margin: 20px 0 0; line-height: 1.55;
      }
      .act-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 18px; display: flex; align-items: center;
      }
      .act-crumbs a { color: var(--color-muted); }
      .act-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .act-crumbs-sep { margin: 0 8px; opacity: .5; }
      @media (max-width: 640px) {
        .act-hero-inner { padding: 40px 24px 44px; }
        .act-hero h1 { font-size: 36px; }
        .act-hero-lede { font-size: 17px; }
      }

      /* ── Lead-in ── */
      .act-leadin { background: #fff; }
      .act-leadin .wrap { padding-top: 52px; padding-bottom: 52px; }
      .act-leadin-p {
        font-size: 18px; line-height: 1.8; color: var(--color-ink);
        max-width: 700px; margin: 0;
      }

      /* ── Opening hero band ── */
      .act-band { position: relative; height: 480px; overflow: hidden; }
      .act-band-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(170deg, rgba(0,20,70,.15) 0%, rgba(0,20,70,.60) 100%);
      }
      .act-band-text {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; justify-content: flex-end;
      }
      .act-band-text .wrap { padding-bottom: 44px; }
      .act-band-tagline {
        font-family: var(--font-serif); font-size: 28px; font-style: italic;
        color: #fff; margin: 0; letter-spacing: -.01em;
        text-shadow: 0 1px 8px rgba(0,0,0,.35);
      }
      @media (max-width: 640px) {
        .act-band { height: 280px; }
        .act-band-tagline { font-size: 21px; }
      }

      /* ── Theme sections ── */
      .act-theme { background: #fff; }
      .act-theme--alt { background: var(--color-surface-alt); }
      .act-section-img-wrap {
        position: relative; aspect-ratio: 21 / 9; overflow: hidden;
      }
      @media (max-width: 640px) {
        .act-section-img-wrap { aspect-ratio: 16 / 9; }
      }
      .act-theme .wrap { padding-top: 48px; padding-bottom: 72px; }
      .act-section-head { margin-bottom: 36px; }
      .act-section-title { font-size: 36px; line-height: 1.08; margin: 0 0 14px; }
      @media (max-width: 640px) { .act-section-title { font-size: 28px; } }
      .act-section-intro {
        font-family: var(--font-serif); font-size: 19px; font-style: italic;
        color: var(--color-ink-soft); line-height: 1.5; margin: 0 0 16px;
        max-width: 580px;
      }

      /* ── Entry list ── */
      .act-entries {
        list-style: none; padding: 0; margin: 0;
        display: flex; flex-direction: column; gap: 22px;
        max-width: 800px;
      }
      .act-entry { font-size: 17px; line-height: 1.75; color: var(--color-ink-soft); }
      .act-entry-name {
        font-family: var(--font-serif); font-size: 19px; font-weight: 600;
        color: var(--color-navy);
      }

      /* ── Closing mosaic ── */
      .act-mosaic {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 5px;
      }
      .act-mosaic-item {
        position: relative; aspect-ratio: 4 / 3; overflow: hidden;
        background: var(--color-surface-alt);
      }
      @media (max-width: 640px) {
        .act-mosaic { grid-template-columns: 1fr; }
        .act-mosaic-item { aspect-ratio: 16 / 9; }
      }

      /* ── Closing CTA ── */
      .act-cta {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .act-cta::before {
        content: ""; position: absolute; left: -120px; bottom: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
        pointer-events: none;
      }
    `}</style>
  )
}
