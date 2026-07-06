import Link from 'next/link'

// Placeholder for admin sections whose CRUD arrives in a later slice. The nav
// items are intentionally present now (this is the final navigation), but they
// land here until their slice is built.
export default function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="cs">
      <span className="cs-eyebrow">Coming soon</span>
      <h1 className="cs-title">{title}</h1>
      <p className="cs-blurb">{blurb}</p>
      <Link href="/admin" className="cs-back">← Back to dashboard</Link>

      <style>{`
        .cs {
          max-width: 560px; background: #fff; border: 1px solid var(--color-border);
          border-radius: 12px; padding: 40px 36px; box-shadow: var(--shadow-card);
        }
        .cs-eyebrow {
          font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark);
        }
        .cs-title { font-size: 30px; margin: 10px 0 12px; color: var(--color-navy); }
        .cs-blurb { color: var(--color-ink-soft); font-size: 16px; line-height: 1.6; margin: 0 0 22px; }
        .cs-back { font-weight: 600; color: var(--color-navy); }
      `}</style>
    </div>
  )
}
