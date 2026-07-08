import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Charity } from '@/lib/supabase/types'
import { getSiteSettings, type SiteSettingsMap } from '@/lib/site-settings'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Charities & Ministries',
  description: 'The causes and ministries Presentation Council #6033 is proud to support.',
}

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getCharities(): Promise<Charity[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CharitiesPage() {
  const [all, settings] = await Promise.all([getCharities(), getSiteSettings()])
  const parishMajor = all.filter((c) => c.category === 'parish_major')
  const parishMinor = all.filter((c) => c.category === 'parish_minor')
  const external    = all.filter((c) => c.category === 'external')

  return (
    <>
      <PageHero settings={settings} />
      <ParishAnchor />
      <MajorMinistriesSection charities={parishMajor} />
      <MinorMinistriesSection charities={parishMinor} />
      <ExternalCharitiesSection charities={external} />
      <ClosingBlock />
      <CharitiesStyles />
    </>
  )
}

// ─── Page Hero ───────────────────────────────────────────────────────────────

function PageHero({ settings }: { settings: SiteSettingsMap }) {
  return (
    <section className="cha-hero">
      <div className="cha-hero-inner">
        <div>
          <nav className="cha-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="cha-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">Charities</span>
          </nav>
          <span className="eyebrow">Presentation Council #6033</span>
          <h1>
            Charities &amp;{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 500 }}>Ministries.</em>
          </h1>
          <p className="cha-hero-lede">
            The causes and ministries our council is proud to support.
          </p>
        </div>
        <aside className="cha-hero-meta" aria-label="Charity facts">
          <div className="cha-meta-row">
            <span className="cha-meta-k">Parish home</span>
            <span className="cha-meta-v">Church of the Presentation</span>
          </div>
          <div className="cha-meta-row">
            <span className="cha-meta-k">Charities supported</span>
            <span className="cha-meta-v">{settings.charities_supported} organizations</span>
          </div>
          <div className="cha-meta-row">
            <span className="cha-meta-k">Raised in {settings.reporting_year}</span>
            <span className="cha-meta-v">{settings.charity_raised} for charity</span>
          </div>
          <div className="cha-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="cha-meta-k">Council</span>
            <span className="cha-meta-v">#6033 · Upper Saddle River, NJ</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── Tier 1: Parish Anchor ───────────────────────────────────────────────────

function ParishAnchor() {
  return (
    <section style={{ padding: '64px 0', background: '#fff' }}>
      <div className="wrap">
        <div className="cha-anchor-inner">
          <div className="cha-anchor-photo">
            <a
              href="https://www.churchofpresentation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="cha-anchor-photo-link"
            >
              <Image
                src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_2-1.jpg"
                alt="Church of the Presentation"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </a>
          </div>
          <div className="cha-anchor-text">
            <span className="eyebrow">Our parish home</span>
            <h2 className="cha-anchor-heading">
              <a
                href="https://www.churchofpresentation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="cha-anchor-heading-link"
              >
                Everything begins at Presentation.
              </a>
            </h2>
            <span className="flourish" />
            <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', lineHeight: 1.65, margin: 0 }}>
              We are Catholic men gathering to serve our parish, support our neighbors in need,
              and grow as husbands, fathers, and disciples. Most of what we do flows through the
              ministries of Church of the Presentation — the parish that has been our home since
              1968. When the parish has a need, the Knights are there: in the kitchen, on the
              mission field, and alongside our young people.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Tier 2: Major Parish Ministries ─────────────────────────────────────────

function MajorMinistriesSection({ charities }: { charities: Charity[] }) {
  return (
    <section style={{ padding: '64px 0', background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <div className="cha-section-head">
          <span className="eyebrow">Our parish, our first call</span>
          <h2>Ministries at the heart of our parish.</h2>
          <span className="flourish" />
        </div>
        <div className="cha-card-grid">
          {charities.map((c) => (
            <CharityCard key={c.id} charity={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Tier 3: Minor Parish Ministries ─────────────────────────────────────────

function MinorMinistriesSection({ charities }: { charities: Charity[] }) {
  return (
    <section className="cha-minor">
      <div className="cha-minor-banner">
        <Image
          src="https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_volunteer.jpg"
          alt="Knights volunteers serving the parish"
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div className="cha-minor-overlay" />
        <div className="cha-minor-banner-text">
          <div className="wrap">
            <span className="eyebrow" style={{ color: '#F7C04A' }}>Other Parish Ministries We Support</span>
            <h2 style={{ color: '#fff', margin: 0 }}>In the parish, every month of the year.</h2>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: '36px', paddingBottom: '52px' }}>
        <ul className="cha-minor-list">
          {charities.map((c) => (
            <li key={c.id} className="cha-minor-item">
              <span className="cha-minor-name">{c.name}</span>
              {' — '}
              {c.short_description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─── Tier 4: External Charities ───────────────────────────────────────────────

function ExternalCharitiesSection({ charities }: { charities: Charity[] }) {
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="wrap">
        <div className="cha-section-head">
          <span className="eyebrow">Beyond our parish</span>
          <h2>Reaching beyond our doors.</h2>
          <span className="flourish" />
          <p style={{ color: 'var(--color-ink-soft)', fontSize: '17px', margin: '0 0 40px', maxWidth: '560px' }}>
            Our commitment to charity doesn&rsquo;t end at the parish doors — we support
            organizations throughout our region doing work we believe in.
          </p>
        </div>
        <div className="cha-card-grid">
          {charities.map((c) => (
            <CharityCard key={c.id} charity={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Charity Card (shared Tier 2 & 4) ────────────────────────────────────────

function CharityCard({ charity: c }: { charity: Charity }) {
  return (
    <article className="cha-card">
      {c.photo_url && (
        <div className="cha-card-photo">
          <Image
            src={c.photo_url}
            alt={c.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="cha-card-body">
        <div className="cha-card-name">{c.name}</div>
        {c.short_description && (
          <p className="cha-card-short">{c.short_description}</p>
        )}
        {c.body && (
          <p className="cha-card-desc">{c.body}</p>
        )}
        {c.external_url && (
          <a
            href={c.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cha-card-link"
          >
            Learn more →
          </a>
        )}
      </div>
    </article>
  )
}

// ─── Tier 5: Closing Block ────────────────────────────────────────────────────

function ClosingBlock() {
  return (
    <section className="cha-closing">
      <div className="wrap">
        <span className="eyebrow" style={{ color: '#F7C04A' }}>And many more</span>
        <h2 style={{ color: '#fff' }}>The work doesn&rsquo;t stop here.</h2>
        <span className="flourish" style={{ background: 'var(--color-gold)' }} />
        <p style={{ color: '#cfd6e8', fontSize: '17px', lineHeight: 1.65, maxWidth: '620px', margin: '0 0 32px' }}>
          Beyond the ministries and organizations above, Council #6033 supports a wide range of
          causes throughout the year — among them groups serving abused women and single mothers,
          Lighthouse pregnancy services, and Special Olympics New Jersey. Wherever there is a need
          in our parish or our community, the Knights look for a way to help.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/donate" className="btn btn-on-navy">Support our work →</Link>
          <Link href="/join" className="btn btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
            Become a Knight
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function CharitiesStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .cha-hero {
        background: var(--color-surface-alt);
        position: relative; overflow: hidden;
      }
      .cha-hero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .cha-hero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .cha-hero h1 { font-size: 52px; line-height: 1.05; }
      .cha-hero-lede {
        font-size: 18px; color: var(--color-ink-soft);
        max-width: 540px; margin: 18px 0 0; line-height: 1.5;
      }
      .cha-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 18px; display: flex; gap: 0; align-items: center;
      }
      .cha-crumbs a { color: var(--color-muted); }
      .cha-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .cha-crumbs-sep { margin: 0 8px; opacity: .5; }
      .cha-hero-meta {
        border-left: 3px solid var(--color-gold);
        padding: 6px 0 6px 22px;
      }
      .cha-meta-row {
        display: flex; justify-content: space-between;
        font-size: 14px; gap: 14px;
        border-bottom: 1px dashed var(--color-border-strong);
        padding-bottom: 12px; margin-bottom: 12px;
      }
      .cha-meta-k { color: var(--color-muted); }
      .cha-meta-v {
        color: var(--color-navy); font-weight: 600;
        font-family: var(--font-mono); font-size: 13px; text-align: right;
      }
      @media (max-width: 880px) {
        .cha-hero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .cha-hero h1 { font-size: 38px; }
      }

      /* ── Parish Anchor (Tier 1) ── */
      .cha-anchor-inner {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 52px; align-items: center;
      }
      @media (max-width: 880px) {
        .cha-anchor-inner { grid-template-columns: 1fr; gap: 32px; }
      }
      .cha-anchor-photo {
        position: relative; aspect-ratio: 4 / 3;
        border-radius: 6px; overflow: hidden;
        box-shadow: var(--shadow-card);
      }
      .cha-anchor-photo-link { display: block; position: absolute; inset: 0; }
      .cha-anchor-heading { font-size: 36px; line-height: 1.12; margin: 12px 0; }
      .cha-anchor-heading-link { color: inherit; text-decoration: none; }
      .cha-anchor-heading-link:hover { color: var(--color-navy); text-decoration: underline; }

      /* ── Shared section heading ── */
      .cha-section-head { margin-bottom: 36px; }
      .cha-section-head h2 { font-size: 36px; line-height: 1.1; margin: 8px 0 12px; }

      /* ── Charity cards (Tier 2 & 4) ── */
      .cha-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
      }
      .cha-card {
        background: #fff; border: 1px solid var(--color-border); border-radius: 6px;
        overflow: hidden; display: flex; flex-direction: column;
        box-shadow: var(--shadow-card);
      }
      .cha-card-photo {
        position: relative; aspect-ratio: 16 / 9;
        overflow: hidden; background: var(--color-surface-alt);
      }
      .cha-card-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
      .cha-card-name {
        font-family: var(--font-serif); font-size: 20px; font-weight: 600;
        color: var(--color-navy); margin-bottom: 10px; line-height: 1.2;
      }
      .cha-card-short {
        font-size: 15px; color: var(--color-ink); line-height: 1.55;
        font-style: italic; margin: 0 0 14px;
        border-left: 3px solid var(--color-gold); padding-left: 10px;
      }
      .cha-card-desc {
        font-size: 15px; color: var(--color-ink-soft); line-height: 1.7;
        margin: 0 0 18px; flex: 1;
      }
      .cha-card-link {
        display: inline-block; font-size: 14px; font-weight: 600;
        color: var(--color-navy); align-self: flex-start; margin-top: auto;
      }
      .cha-card-link:hover { color: var(--color-gold-dark); text-decoration: none; }

      /* ── Minor ministries (Tier 3) ── */
      .cha-minor { background: var(--color-surface-alt); }
      .cha-minor-banner { position: relative; height: 240px; overflow: hidden; }
      @media (max-width: 600px) { .cha-minor-banner { height: 180px; } }
      .cha-minor-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(0,20,70,.62), rgba(0,20,70,.56));
      }
      .cha-minor-banner-text {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; justify-content: center;
      }
      .cha-minor-banner-text h2 { font-size: 28px; }
      @media (max-width: 600px) { .cha-minor-banner-text h2 { font-size: 22px; } }
      .cha-minor-list {
        list-style: none; padding: 0; margin: 0;
        display: flex; flex-direction: column; gap: 18px;
      }
      .cha-minor-item {
        font-size: 16px; color: var(--color-ink-soft); line-height: 1.65;
        padding-left: 14px; border-left: 2px solid var(--color-border-strong);
      }
      .cha-minor-name { font-weight: 700; color: var(--color-navy); }

      /* ── Closing block (Tier 5) ── */
      .cha-closing {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .cha-closing::before {
        content: ""; position: absolute; left: -120px; bottom: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
        pointer-events: none;
      }
    `}</style>
  )
}
