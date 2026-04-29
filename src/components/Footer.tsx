import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-navy-deeper)', color: '#cfd6e8', paddingTop: '64px' }}>
      <div className="wrap">

        {/* ── 5-column grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.1fr',
          gap: '36px',
          paddingBottom: '48px',
        }} className="footer-grid">

          {/* Brand block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Image
              src="/kofc-horizontal-reversed.png"
              alt="Knights of Columbus"
              width={200}
              height={93}
            />
            <p style={{ margin: 0, color: '#F7C04A', fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>
              Presentation Council #6033
            </p>
            <address style={{ fontStyle: 'normal', fontSize: '13.5px', color: '#cfd6e8', lineHeight: 1.6 }}>
              <strong style={{ color: '#fff', fontWeight: 600 }}>Church of the Presentation</strong><br />
              271 West Saddle River Road<br />
              Upper Saddle River, NJ 07458<br />
              (201) 327-1313
            </address>
            {/* Social icons */}
            <div aria-label="Follow our council" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <SocialLink href="#" label="Facebook">
                <path d="M14 8h2.5V5H14c-2 0-3 1.5-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V8.5c0-.3.2-.5.5-.5z" fill="currentColor" stroke="none" />
              </SocialLink>
              <SocialLink href="mailto:contact@kofc6033.org" label="Email">
                <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
                <path d="M4 6l8 6 8-6" />
              </SocialLink>
              <SocialLink href="/calendar" label="Calendar">
                <rect x="4" y="5" width="16" height="15" rx="1.5" />
                <path d="M4 9h16M8 3v4M16 3v4" />
              </SocialLink>
              <SocialLink href="tel:+12013271313" label="Phone">
                <path d="M5 5l3-1 2 4-2 1a10 10 0 0 0 6 6l1-2 4 2-1 3a2 2 0 0 1-2 1A14 14 0 0 1 4 7a2 2 0 0 1 1-2z" />
              </SocialLink>
            </div>
          </div>

          {/* About Us */}
          <FooterCol title="About Us">
            <FooterLink href="/about">Our Council</FooterLink>
            <FooterLink href="/officers">Officers</FooterLink>
            <FooterLink href="/about#history">History</FooterLink>
            <FooterLink href="/about#mission">Our Mission</FooterLink>
          </FooterCol>

          {/* Get Involved */}
          <FooterCol title="Get Involved">
            <FooterLink href="/join">Become a Knight</FooterLink>
            <FooterLink href="/activities">Volunteer</FooterLink>
            <FooterLink href="/donate">Make a Donation</FooterLink>
            <FooterLink href="/calendar">Full Calendar</FooterLink>
          </FooterCol>

          {/* Activities */}
          <FooterCol title="Activities">
            <FooterLink href="/calendar">Calendar</FooterLink>
            <FooterLink href="/activities">All Activities</FooterLink>
            <FooterLink href="/charities">Charities</FooterLink>
            <FooterLink href="/activities#golf">Golf Outing</FooterLink>
            <FooterLink href="/activities#pancake">Pancake Breakfast</FooterLink>
          </FooterCol>

          {/* Resources */}
          <FooterCol title="Resources">
            <FooterLink href="https://www.kofc.org" external>Knights of Columbus (Supreme)</FooterLink>
            <FooterLink href="https://www.njkofc.org" external>NJ State Council</FooterLink>
            <FooterLink href="https://www.churchofthepresentation.org" external>Church of the Presentation</FooterLink>
            <FooterLink href="https://www.kofc.org/insurance" external>Member Insurance</FooterLink>
          </FooterCol>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,.12)',
          padding: '22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '13px',
          color: '#9aa6c4',
        }}>
          <div>© 2026 Presentation Council #6033, Knights of Columbus. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '22px' }}>
            <Link href="/privacy" style={{ color: '#9aa6c4' }}>Privacy</Link>
            <Link href="mailto:webmaster@kofc6033.org" style={{ color: '#9aa6c4' }}>Contact the Webmaster</Link>
          </div>
        </div>

      </div>

      <style>{`
        .footer-grid a { color: #cfd6e8; }
        .footer-grid a:hover { color: #F7C04A; text-decoration: none; }
        @media (max-width: 980px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 style={{
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        marginBottom: '14px',
        fontWeight: 600,
      }}>
        {title}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {children}
      </ul>
    </div>
  )
}

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <li style={{ padding: '5px 0', fontSize: '14.5px' }}>
      <Link href={href} {...props}>{children}</Link>
    </li>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      style={{
        width: '34px',
        height: '34px',
        border: '1px solid rgba(255,255,255,.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#cfd6e8',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
      className="social-icon"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {children}
      </svg>
    </a>
  )
}
