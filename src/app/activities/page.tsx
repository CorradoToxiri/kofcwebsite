import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Activities',
  description: 'What we do throughout the year — service, fellowship, and parish life.',
}

export default function ActivitiesPage() {
  return (
    <>
      <StubHero title="Activities" subtitle="What we do throughout the year — service, fellowship, and parish life." />
      <ComingSoon />
      <StubCta />
    </>
  )
}

function StubHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section style={{ background: 'var(--color-surface-alt)' }}>
      <div className="wrap">
        <nav style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em', marginBottom: '18px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: .5 }}>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <span className="eyebrow">Presentation Council #6033</span>
        <h1>{title}</h1>
        <p style={{ fontSize: '18px', color: 'var(--color-ink-soft)', maxWidth: '520px', margin: '18px 0 0', lineHeight: 1.55 }}>
          {subtitle}
        </p>
      </div>
    </section>
  )
}

function ComingSoon() {
  return (
    <section>
      <div className="wrap">
        <p style={{ fontSize: '17px', color: 'var(--color-ink-soft)', lineHeight: 1.65, maxWidth: '600px' }}>
          This page is coming soon. Check back shortly, or{' '}
          <Link href="/about#contact" style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
            contact us in the meantime
          </Link>
          .
        </p>
      </div>
    </section>
  )
}

function StubCta() {
  return (
    <section style={{ background: 'linear-gradient(180deg, var(--color-navy-dark), var(--color-navy))', color: '#fff' }}>
      <div className="wrap">
        <span className="eyebrow" style={{ color: '#F7C04A' }}>Presentation Council #6033</span>
        <h2 style={{ color: '#fff' }}>Questions? Come to a meeting.</h2>
        <span className="flourish" style={{ background: 'var(--color-gold)' }} />
        <p style={{ color: '#cfd6e8', fontSize: '16.5px', margin: '0 0 20px', lineHeight: 1.6, maxWidth: '480px' }}>
          Every question is welcome. Council meetings are on the third Wednesday of each month at 7:30 PM.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/about#contact" className="btn btn-on-navy">Contact us →</Link>
          <Link href="/calendar" className="btn btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>View calendar</Link>
        </div>
      </div>
    </section>
  )
}
