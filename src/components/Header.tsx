import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/officers',   label: 'Officers' },
  { href: '/activities', label: 'Activities' },
  { href: '/charities',  label: 'Charities' },
  { href: '/calendar',   label: 'Calendar' },
]

export default function Header() {
  return (
    <div>
      {/* ── Utility bar ── */}
      <div style={{ background: 'var(--color-navy-deeper)', color: '#cfd6e8', fontSize: '13px' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{
              background: 'rgba(242,169,0,.15)',
              color: '#F7C04A',
              border: '1px solid rgba(242,169,0,.35)',
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}>
              COUNCIL #6033
            </span>
            <span>Church of the Presentation · Upper Saddle River, NJ</span>
          </div>
          <div style={{ display: 'flex', gap: '22px' }}>
            <Link href="/calendar" style={{ color: '#cfd6e8' }}>Calendar</Link>
            <Link href="/about#contact" style={{ color: '#cfd6e8' }}>Contact</Link>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header style={{
        background: 'linear-gradient(180deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)',
        color: '#fff',
        borderBottom: '3px solid var(--color-gold)',
      }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', paddingTop: '18px', paddingBottom: '18px' }}>

          {/* Brand / logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#fff', textDecoration: 'none' }}>
            <Image
              src="/kofc-emblem-reversed.png"
              alt="Knights of Columbus emblem"
              width={62}
              height={62}
              style={{ flexShrink: 0 }}
              priority
            />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F7C04A', fontWeight: 600 }}>
                Knights of Columbus
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '23px', fontWeight: 600, marginTop: '4px', letterSpacing: '-0.005em' }}>
                Presentation Council #6033
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: '#bcc6dd', marginTop: '3px', letterSpacing: '0.02em' }}>
                Chartered 1968 · Upper Saddle River, New Jersey
              </span>
            </span>
          </Link>

          {/* Primary nav — hidden below 1000px */}
          <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="site-nav">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 500, padding: '10px 14px', borderRadius: '4px' }}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons — visible on desktop alongside nav */}
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }} className="header-ctas">
            <Link href="/join" className="btn btn-on-navy" style={{ fontSize: '14px', padding: '10px 16px' }}>
              Join
            </Link>
            <Link href="/donate" className="btn btn-primary" style={{ fontSize: '14px', padding: '10px 16px' }}>
              Donate
            </Link>
          </div>

        </div>
      </header>

      <style>{`
        @media (max-width: 1000px) {
          .site-nav { display: none !important; }
          .header-ctas { display: none !important; }
        }
        .nav-link:hover {
          background: rgba(255,255,255,.08);
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}
