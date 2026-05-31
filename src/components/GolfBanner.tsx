import Link from 'next/link'

// Seasonal announcement bar — set SHOW_GOLF_BANNER = false to disable after Sept 14, 2026
const SHOW_GOLF_BANNER = true

export default function GolfBanner() {
  if (!SHOW_GOLF_BANNER) return null

  return (
    <>
      <div className="golf-banner" role="banner">
        <Link href="/golfouting" className="golf-banner-link">
          <span className="golf-banner-full">
            ⛳ The 2026 Presentation Golf Outing — Monday, September 14 at Darlington. Register today →
          </span>
          <span className="golf-banner-short">
            ⛳ 2026 Golf Outing — Sept 14. Register →
          </span>
        </Link>
      </div>
      <style>{`
        .golf-banner {
          background: var(--color-gold);
          text-align: center;
        }
        .golf-banner-link {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 9px 20px;
          color: var(--color-navy-dark);
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          text-decoration: none;
        }
        .golf-banner-link:hover {
          background: var(--color-gold-dark);
          text-decoration: none;
          color: var(--color-navy-dark);
        }
        .golf-banner-short { display: none; }
        @media (max-width: 600px) {
          .golf-banner-full  { display: none; }
          .golf-banner-short { display: inline; }
          .golf-banner-link  { min-height: 44px; }
        }
      `}</style>
    </>
  )
}
