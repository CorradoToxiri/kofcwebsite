import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Officer } from '@/lib/supabase/types'

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Council Officers',
  description:
    'Meet the elected and appointed officers leading Presentation Council #6033, Knights of Columbus, for the 2025–2026 Columbian Year.',
}

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getOfficers(): Promise<Officer[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('officers')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  const cleaned = name.replace(/^(SK|Rev\.|Dr\.)\s+/i, '').trim()
  const parts = cleaned.split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return (first + last).toUpperCase()
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function OfficersPage() {
  const officers = await getOfficers()

  const featured  = officers.filter((o) => o.is_featured)
  const elected   = officers.filter((o) => !o.is_featured && o.category === 'officer')
  const trustees  = officers.filter((o) => o.category === 'trustee' || o.category === 'director')

  return (
    <>
      <PageHero />
      <FeaturedSection officers={featured} />
      <ElectedSection officers={elected} />
      <TrusteesSection officers={trustees} />
      <CtaBand />
      <OfficersStyles />
    </>
  )
}

// ─── Page Hero ───────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section className="off-pagehero">
      <div className="off-pagehero-inner">
        <div>
          <nav className="off-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="off-crumbs-sep" aria-hidden="true">/</span>
            <Link href="/about">About</Link>
            <span className="off-crumbs-sep" aria-hidden="true">/</span>
            <span aria-current="page">Officers</span>
          </nav>
          <span className="eyebrow">Council Officers · Columbian Year 2025–2026</span>
          <h1>
            The brothers entrusted with{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 500 }}>leading</em> our council.
          </h1>
          <p className="off-pagehero-lede">
            Each year, our council elects officers from among its members to oversee its meetings,
            finances, charitable work, and faith life — serving without compensation, in fraternity
            with our pastor and parish.
          </p>
        </div>
        <aside className="off-pagehero-meta" aria-label="Council facts">
          <div className="off-meta-row">
            <span className="off-meta-k">Columbian Year</span>
            <span className="off-meta-v">Jul 2025 – Jun 2026</span>
          </div>
          <div className="off-meta-row">
            <span className="off-meta-k">Officers seated</span>
            <span className="off-meta-v">14 brothers</span>
          </div>
          <div className="off-meta-row">
            <span className="off-meta-k">Term begins</span>
            <span className="off-meta-v">First Wed of July</span>
          </div>
          <div className="off-meta-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="off-meta-k">Council home</span>
            <span className="off-meta-v">Church of the Presentation</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

// ─── Featured (Grand Knight + Chaplain) ─────────────────────────────────────

function FeaturedSection({ officers }: { officers: Officer[] }) {
  return (
    <section style={{ paddingBottom: '24px' }}>
      <div className="wrap">
        <div className="off-group-head">
          <div>
            <span className="eyebrow">The shepherds of our council</span>
            <h2>Grand Knight &amp; Chaplain</h2>
            <span className="flourish" />
          </div>
          <p className="off-group-desc">
            Our Grand Knight presides over council business and life; our Chaplain is appointed by
            the pastor as the spiritual heart of our brotherhood.
          </p>
        </div>

        {officers.length > 0 ? (
          <div className="off-feat-grid">
            {officers.map((o) => (
              <FeaturedCard key={o.id} officer={o} />
            ))}
          </div>
        ) : (
          <FeaturedPlaceholderGrid />
        )}
      </div>
    </section>
  )
}

function FeaturedCard({ officer: o }: { officer: Officer }) {
  const isGrandKnight = o.title.toLowerCase().includes('grand knight')

  return (
    <article className="off-feat">
      <div className="off-feat-portrait">
        {o.photo_url ? (
          <Image
            src={o.photo_url}
            alt={o.full_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="240px"
          />
        ) : (
          <div className="off-ph">
            <div className="off-monogram">{initials(o.full_name)}</div>
          </div>
        )}
        <span
          className="off-role-tab"
          style={isGrandKnight ? { background: 'var(--color-gold)', color: 'var(--color-navy-dark)' } : undefined}
        >
          {o.title}
        </span>
      </div>

      <div className="off-feat-body">
        <div className="off-post" style={{ color: isGrandKnight ? 'var(--color-gold-dark)' : undefined }}>
          {isGrandKnight ? 'Elected officer · Presiding' : 'Appointed by the Pastor · Spiritual director'}
        </div>
        <div className="off-feat-name">{o.full_name}</div>
        <span className="off-post-flourish" />
        {o.bio && <p className="off-feat-bio">{o.bio}</p>}
        <div className="off-feat-actions">
          {o.email && (
            <a className="off-email" href={`mailto:${o.email}`}>
              <EmailIcon />
              {isGrandKnight ? 'Email the Grand Knight' : `Email ${o.full_name.split(' ').pop()}`}
            </a>
          )}
          <span className="off-term">{isGrandKnight ? 'Term · 2025–2026' : 'Pastoral appointment'}</span>
        </div>
      </div>
    </article>
  )
}

function FeaturedPlaceholderGrid() {
  return (
    <div className="off-feat-grid">
      <FeaturedPlaceholder
        monogram="ED"
        title="Grand Knight"
        roleStyle={{ background: 'var(--color-gold)', color: 'var(--color-navy-dark)' }}
        postLabel="Elected officer · Presiding"
        postColor="var(--color-gold-dark)"
        name="SK Edward G. Dowd"
        bio="Presides over all meetings of the council, appoints chairmen and committees, and represents Council #6033 to the pastor, the district deputy, and the state council."
        emailLabel="Email the Grand Knight"
        termLabel="Term · 2025–2026"
      />
      <FeaturedPlaceholder
        monogram="RS"
        title="Chaplain"
        roleStyle={undefined}
        postLabel="Appointed by the Pastor · Spiritual director"
        postColor={undefined}
        name="Rev. Robert B. Stagg"
        bio="Our council chaplain leads us in prayer, opens our meetings, celebrates the council's memorial Mass, and supports our brothers and their families in moments of joy and grief alike."
        emailLabel="Email Father Stagg"
        termLabel="Pastoral appointment"
      />
    </div>
  )
}

function FeaturedPlaceholder({
  monogram, title, roleStyle, postLabel, postColor, name, bio, emailLabel, termLabel,
}: {
  monogram: string; title: string; roleStyle: React.CSSProperties | undefined
  postLabel: string; postColor: string | undefined; name: string; bio: string
  emailLabel: string; termLabel: string
}) {
  return (
    <article className="off-feat">
      <div className="off-feat-portrait">
        <div className="off-ph"><div className="off-monogram">{monogram}</div></div>
        <span className="off-role-tab" style={roleStyle}>{title}</span>
      </div>
      <div className="off-feat-body">
        <div className="off-post" style={{ color: postColor }}>{postLabel}</div>
        <div className="off-feat-name">{name}</div>
        <span className="off-post-flourish" />
        <p className="off-feat-bio">{bio}</p>
        <div className="off-feat-actions">
          <span className="off-email off-email-placeholder">
            <EmailIcon />{emailLabel}
          </span>
          <span className="off-term">{termLabel}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Elected Officers ────────────────────────────────────────────────────────

function ElectedSection({ officers }: { officers: Officer[] }) {
  return (
    <section style={{ paddingTop: '36px' }}>
      <div className="wrap">
        <div className="off-group-head">
          <div>
            <span className="eyebrow">Section I · Elected officers</span>
            <h2>The elected line.</h2>
            <span className="flourish" />
          </div>
          <p className="off-group-desc">
            Six brothers elected by the council in May, installed at the first meeting of July,
            to lead the council's business and ceremonial life through the Columbian year.
          </p>
        </div>

        <div className="off-grid">
          {officers.length > 0
            ? officers.map((o) => <OfficerCard key={o.id} officer={o} />)
            : ELECTED_PLACEHOLDERS.map((p) => <OfficerCardPlaceholder key={p.monogram + p.title} {...p} />)
          }
        </div>
      </div>
    </section>
  )
}

// ─── Trustees + Appointed ────────────────────────────────────────────────────

function TrusteesSection({ officers }: { officers: Officer[] }) {
  return (
    <section style={{ paddingTop: '36px', background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <div className="off-group-head">
          <div>
            <span className="eyebrow">Section II · Trustees &amp; appointed</span>
            <h2>Trustees and the Financial Secretary.</h2>
            <span className="flourish" />
          </div>
          <p className="off-group-desc">
            Three Trustees rotate through one-, two-, and three-year terms, providing oversight and
            continuity. The Financial Secretary is appointed by Supreme upon nomination of the council.
          </p>
        </div>

        <div className="off-grid">
          {officers.length > 0
            ? officers.map((o) => <OfficerCard key={o.id} officer={o} />)
            : TRUSTEE_PLACEHOLDERS.map((p) => <OfficerCardPlaceholder key={p.monogram + p.title} {...p} />)
          }
        </div>
      </div>
    </section>
  )
}

// ─── Officer Card (live data) ─────────────────────────────────────────────────

function OfficerCard({ officer: o }: { officer: Officer }) {
  return (
    <article className="off-card">
      <div className="off-card-portrait">
        {o.photo_url ? (
          <Image
            src={o.photo_url}
            alt={o.full_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw"
          />
        ) : (
          <div className="off-ph"><div className="off-monogram">{initials(o.full_name)}</div></div>
        )}
        <span className="off-role-tab">{o.title}</span>
        {!o.photo_url && (
          <span className="off-photo-tag">PHOTO · PENDING</span>
        )}
      </div>
      <div className="off-card-body">
        <div className="off-card-name">{o.full_name}</div>
        <span className="off-post-flourish" />
        <div className="off-card-post">{o.title}</div>
        {o.bio && <p className="off-card-bio">{o.bio}</p>}
        <div className="off-card-actions">
          {o.email ? (
            <a className="off-email" href={`mailto:${o.email}`}>
              <EmailIcon />Email
            </a>
          ) : (
            <span />
          )}
          <span className="off-term">2025–2026</span>
        </div>
      </div>
    </article>
  )
}

// ─── Officer Card (placeholder, no DB data yet) ───────────────────────────────

type PlaceholderProps = {
  monogram: string; title: string; name: string; bio: string; term: string
}

function OfficerCardPlaceholder({ monogram, title, name, bio, term }: PlaceholderProps) {
  return (
    <article className="off-card">
      <div className="off-card-portrait">
        <div className="off-ph"><div className="off-monogram">{monogram}</div></div>
        <span className="off-role-tab">{title}</span>
        <span className="off-photo-tag">PHOTO · PENDING</span>
      </div>
      <div className="off-card-body">
        <div className="off-card-name">{name}</div>
        <span className="off-post-flourish" />
        <div className="off-card-post">{title}</div>
        <p className="off-card-bio">{bio}</p>
        <div className="off-card-actions">
          <span />
          <span className="off-term">{term}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Static placeholder data ──────────────────────────────────────────────────

const ELECTED_PLACEHOLDERS: PlaceholderProps[] = [
  {
    monogram: 'JL', title: 'Deputy Grand Knight', name: 'Joseph R. Lupino', term: '2025–2026',
    bio: 'Stands ready to assume the duties of the Grand Knight, oversees committee work, and chairs council programs in his absence.',
  },
  {
    monogram: 'CT', title: 'Chancellor', name: 'Corrado Toxiri', term: '2025–2026',
    bio: 'Strengthens the bonds of fraternity among brothers, assists the Grand Knight, and supports new members through their first year in the council.',
  },
  {
    monogram: 'JL', title: 'Recorder', name: 'SK Jeremiah P. Lynch', term: '2025–2026',
    bio: 'Keeps a true record of council meetings, manages correspondence, and preserves the institutional memory of Council #6033.',
  },
  {
    monogram: 'KB', title: 'Treasurer', name: 'Kevin R. Birdsall', term: '2025–2026',
    bio: "Receives moneys from the Financial Secretary, deposits funds in the council's name, and pays orders of the council as authorized.",
  },
  {
    monogram: 'RP', title: 'Warden', name: 'Roy Polizzi', term: '2025–2026',
    bio: 'Sets up the council chamber, safeguards regalia, and supervises the inside and outside guards during meetings and ceremonials.',
  },
  {
    monogram: 'SF', title: 'Inside Guard', name: 'Sean M. Farley', term: '2025–2026',
    bio: 'Attends the inner door of the council chamber, admits members in good standing, and assists the Warden in keeping good order.',
  },
  {
    monogram: 'RT', title: 'Outside Guard', name: 'Rene A. Tenazas', term: '2025–2026',
    bio: 'Attends the outside door of the council chamber and ensures that none but those entitled gain admission to the meeting.',
  },
  {
    monogram: 'RS', title: 'Outside Guard', name: 'Dr. Robert G. Stevenson, EdD', term: '2025–2026',
    bio: 'Serves alongside the warden in the ceremonial duties of the council, ensuring decorum at all council meetings and exemplifications.',
  },
]

const TRUSTEE_PLACEHOLDERS: PlaceholderProps[] = [
  {
    monogram: 'SC', title: 'Three-Year Trustee', name: 'Sal J. Canariato', term: 'Term ends 2028',
    bio: "Senior trustee. Reviews the council's books quarterly with his fellow trustees and counsels the elected line on continuity and good governance.",
  },
  {
    monogram: 'PF', title: 'Two-Year Trustee', name: 'Peter E. Finlay', term: 'Term ends 2027',
    bio: 'Conducts the semi-annual audit of council finances and assists in ceremonial functions, drawing on prior service in the elected line.',
  },
  {
    monogram: 'BE', title: 'One-Year Trustee', name: 'Barry W. Ervin', term: 'Term ends 2026',
    bio: 'Junior trustee. Brings the most recent experience as Grand Knight to the trustee line and serves as a steady counsel to the seated officers.',
  },
  {
    monogram: 'KB', title: 'Financial Secretary · appointed', name: 'Keith R. Birdsall', term: 'Three-year appointment',
    bio: 'Keeps the membership rolls, collects dues and assessments, and corresponds with Supreme. Appointed to a three-year term by the Supreme Knight.',
  },
]

// ─── CTA Band ────────────────────────────────────────────────────────────────

function CtaBand() {
  return (
    <section className="off-cta-band">
      <div className="wrap">
        <div className="off-cta-grid">
          <div>
            <span className="eyebrow" style={{ color: '#F7C04A' }}>Considering service?</span>
            <h2 style={{ color: '#fff' }}>Officers are made from members.</h2>
            <span className="flourish" />
            <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6 }}>
              Every Grand Knight on our wall began as a brother who simply showed up, served on a
              committee, and let the Holy Spirit do the rest. If service in the line of office is on
              your heart, speak to any current officer — or come to a meeting and see for yourself.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/join" className="btn btn-on-navy">
                Begin Your Membership <span aria-hidden="true">→</span>
              </Link>
              <a
                href="mailto:gk@kofc6033.org"
                className="btn btn-secondary"
                style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}
              >
                Email the Grand Knight
              </a>
            </div>
          </div>

          <div className="off-cta-card">
            <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>Officers&rsquo; Meeting</h3>
            <span className="flourish" style={{ margin: '8px 0 12px' }} />
            <div className="off-cta-row">
              <span className="off-cta-k">When</span>
              <span className="off-cta-v">2nd Tue · 7:30 PM</span>
            </div>
            <div className="off-cta-row">
              <span className="off-cta-k">Where</span>
              <span className="off-cta-v">Church of the Presentation</span>
            </div>
            <div className="off-cta-row">
              <span className="off-cta-k">Open to</span>
              <span className="off-cta-v">All officers</span>
            </div>
            <div className="off-cta-row" style={{ borderBottom: 'none' }}>
              <span className="off-cta-k">Council meeting</span>
              <span className="off-cta-v">3rd Wed · 7:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Icon ────────────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6l8 6 8-6" />
    </svg>
  )
}

// ─── Page-scoped styles ───────────────────────────────────────────────────────

function OfficersStyles() {
  return (
    <style>{`
      /* ── Page Hero ── */
      .off-pagehero {
        background: var(--color-surface-alt);
        position: relative; overflow: hidden;
      }
      .off-pagehero::before {
        content: ""; position: absolute; right: -80px; top: -80px;
        width: 380px; height: 380px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,48,135,.08), transparent 65%);
        pointer-events: none;
      }
      .off-pagehero-inner {
        max-width: var(--width-content); margin: 0 auto; padding: 60px 32px 56px;
        display: grid; grid-template-columns: 1.2fr .8fr;
        gap: 48px; align-items: end; position: relative;
      }
      .off-pagehero h1 { font-size: 52px; line-height: 1.05; }
      .off-pagehero-lede {
        font-size: 18px; color: var(--color-ink-soft);
        max-width: 540px; margin: 18px 0 0;
      }
      .off-crumbs {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em;
        margin-bottom: 18px; display: flex; gap: 0; align-items: center;
      }
      .off-crumbs a { color: var(--color-muted); }
      .off-crumbs a:hover { color: var(--color-navy); text-decoration: none; }
      .off-crumbs-sep { margin: 0 8px; opacity: .5; }
      .off-pagehero-meta {
        border-left: 3px solid var(--color-gold);
        padding: 6px 0 6px 22px;
      }
      .off-meta-row {
        display: flex; justify-content: space-between;
        font-size: 14px; gap: 14px;
        border-bottom: 1px dashed var(--color-border-strong);
        padding-bottom: 12px; margin-bottom: 12px;
      }
      .off-meta-k { color: var(--color-muted); }
      .off-meta-v {
        color: var(--color-navy); font-weight: 600;
        font-family: var(--font-mono); font-size: 13px; text-align: right;
      }
      @media (max-width: 880px) {
        .off-pagehero-inner { grid-template-columns: 1fr; gap: 28px; padding: 40px 24px; }
        .off-pagehero h1 { font-size: 38px; }
      }

      /* ── Group heading ── */
      .off-group-head {
        display: flex; align-items: end; justify-content: space-between;
        gap: 24px; flex-wrap: wrap; margin-bottom: 32px;
      }
      .off-group-head h2 { font-size: 30px; }
      .off-group-desc { max-width: 440px; color: var(--color-ink-soft); font-size: 15.5px; line-height: 1.55; margin: 0; }

      /* ── Featured card (horizontal) ── */
      .off-feat-grid {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;
        margin-bottom: 18px;
      }
      @media (max-width: 880px) { .off-feat-grid { grid-template-columns: 1fr; } }
      .off-feat {
        background: #fff; border: 1px solid var(--color-border); border-radius: 6px;
        overflow: hidden; display: grid; grid-template-columns: 240px 1fr;
        box-shadow: var(--shadow-card);
      }
      @media (max-width: 560px) {
        .off-feat { grid-template-columns: 1fr; }
        .off-feat-portrait { aspect-ratio: 4 / 3 !important; }
      }
      .off-feat-portrait {
        position: relative; background: linear-gradient(180deg, #dfe6f1, #c8d3e4);
        overflow: hidden; min-height: 220px;
      }
      .off-feat-body {
        padding: 26px 28px; display: flex; flex-direction: column; justify-content: center;
      }
      .off-feat-name {
        font-family: var(--font-serif); font-size: 26px; font-weight: 600;
        color: var(--color-navy); line-height: 1.15;
      }
      .off-feat-bio {
        font-size: 15px; color: var(--color-ink-soft); line-height: 1.55; margin: 0 0 16px;
      }
      .off-feat-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
      .off-post {
        font-size: 12px; font-family: var(--font-sans); font-weight: 600;
        letter-spacing: .18em; text-transform: uppercase; margin-bottom: 8px;
        color: var(--color-muted);
      }

      /* ── Standard officer card (vertical) ── */
      .off-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
      }
      @media (max-width: 980px) { .off-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 560px) { .off-grid { grid-template-columns: 1fr; } }

      .off-card {
        background: #fff; border: 1px solid var(--color-border); border-radius: 6px;
        overflow: hidden; display: flex; flex-direction: column;
        box-shadow: var(--shadow-sm); transition: transform .15s, box-shadow .15s;
      }
      .off-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
      .off-card-portrait {
        position: relative; aspect-ratio: 4 / 5;
        background: linear-gradient(180deg, #dfe6f1, #c8d3e4); overflow: hidden;
      }
      .off-card-body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
      .off-card-name {
        font-family: var(--font-serif); font-size: 21px; font-weight: 600;
        color: var(--color-navy); line-height: 1.2;
      }
      .off-card-post {
        font-size: 13px; color: var(--color-muted);
        font-family: var(--font-mono); letter-spacing: .04em; margin-bottom: 12px;
      }
      .off-card-bio {
        font-size: 14.5px; color: var(--color-ink-soft); line-height: 1.5;
        margin: 0 0 16px; flex: 1;
      }
      .off-card-actions {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        border-top: 1px solid var(--color-border); padding-top: 14px; margin-top: auto;
      }

      /* ── Shared portrait elements ── */
      .off-ph {
        position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        background: repeating-linear-gradient(135deg, rgba(0,48,135,.06) 0 14px, rgba(0,48,135,.10) 14px 28px);
      }
      .off-monogram {
        font-family: var(--font-serif); font-size: 58px; font-weight: 600;
        color: rgba(0,31,92,.55); letter-spacing: -.01em;
        background: rgba(255,255,255,.7); width: 106px; height: 106px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid rgba(242,169,0,.55); box-shadow: 0 2px 6px rgba(10,20,50,.08);
      }
      .off-role-tab {
        position: absolute; left: 14px; top: 14px;
        background: var(--color-navy-dark); color: #fff;
        font-family: var(--font-sans); font-size: 11px; font-weight: 600;
        letter-spacing: .14em; text-transform: uppercase;
        padding: 5px 10px; border-radius: 3px; border-left: 3px solid var(--color-gold);
      }
      .off-photo-tag {
        position: absolute; right: 12px; bottom: 12px;
        background: rgba(0,31,92,.85); color: #fff;
        font-family: var(--font-mono); font-size: 10px; letter-spacing: .06em;
        padding: 4px 8px; border-radius: 2px;
      }
      .off-post-flourish {
        display: block; width: 36px; height: 3px;
        background: var(--color-gold); border-radius: 2px; margin: 10px 0 12px;
      }

      /* ── Email link ── */
      .off-email {
        display: inline-flex; align-items: center; gap: 8px;
        font-size: 14px; font-weight: 600; color: var(--color-navy);
      }
      .off-email:hover { color: var(--color-gold-dark); text-decoration: none; }
      .off-email-placeholder { opacity: .5; cursor: default; }
      .off-term {
        font-family: var(--font-mono); font-size: 11.5px;
        color: var(--color-muted); letter-spacing: .04em;
      }

      /* ── CTA band ── */
      .off-cta-band {
        background: linear-gradient(180deg, var(--color-navy-dark), var(--color-navy));
        color: #fff; position: relative; overflow: hidden;
      }
      .off-cta-band::before {
        content: ""; position: absolute; left: -120px; bottom: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(242,169,0,.18), transparent 65%);
      }
      .off-cta-grid {
        display: grid; grid-template-columns: 1.3fr .9fr;
        gap: 48px; align-items: center; position: relative;
      }
      @media (max-width: 880px) { .off-cta-grid { grid-template-columns: 1fr; gap: 28px; } }
      .off-cta-card {
        background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.18);
        border-radius: 6px; padding: 24px; backdrop-filter: blur(2px);
      }
      .off-cta-row {
        display: flex; justify-content: space-between;
        padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,.15); font-size: 14px;
      }
      .off-cta-row:last-child { border-bottom: none; }
      .off-cta-k { color: #cfd6e8; }
      .off-cta-v { color: #fff; font-family: var(--font-mono); font-size: 13px; font-weight: 600; }
    `}</style>
  )
}
