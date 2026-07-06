import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata = { title: 'Dashboard · Admin' }

const cards = [
  {
    href: '/admin/events',
    label: 'Events',
    blurb: 'Meetings, activities, and charity events shown across the site.',
  },
  {
    href: '/admin/officers',
    label: 'Officers',
    blurb: 'Officers, trustees, and directors on the Officers page.',
  },
  {
    href: '/admin/charities',
    label: 'Charities',
    blurb: 'Ministries and charities the council supports.',
  },
]

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', user!.id)
    .single()

  const name = profile?.display_name?.trim() || profile?.email?.split('@')[0] || 'Knight'

  return (
    <div className="dash">
      <span className="dash-eyebrow">Presentation Council #6033</span>
      <h1 className="dash-title">Welcome, {name}.</h1>
      <p className="dash-lede">
        This is your home base for keeping the council website current. Choose a section
        below to get started — editing tools arrive here section by section.
      </p>

      <div className="dash-grid">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="dash-card">
            <span className="dash-card-label">{c.label}</span>
            <span className="dash-card-blurb">{c.blurb}</span>
            <span className="dash-card-cta">Open →</span>
          </Link>
        ))}
      </div>

      <style>{`
        .dash { max-width: 940px; }
        .dash-eyebrow {
          font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark);
        }
        .dash-title { font-size: 34px; margin: 10px 0 12px; color: var(--color-navy); }
        .dash-lede { color: var(--color-ink-soft); font-size: 17px; line-height: 1.6; margin: 0 0 34px; max-width: 640px; }
        .dash-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px;
        }
        .dash-card {
          display: flex; flex-direction: column; gap: 8px;
          background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
          padding: 24px 22px; text-decoration: none; box-shadow: var(--shadow-card);
          border-top: 3px solid var(--color-gold); transition: transform .12s, box-shadow .12s;
        }
        .dash-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); text-decoration: none; }
        .dash-card-label { font-family: var(--font-serif); font-size: 21px; font-weight: 600; color: var(--color-navy); }
        .dash-card-blurb { color: var(--color-ink-soft); font-size: 14.5px; line-height: 1.5; flex: 1; }
        .dash-card-cta { font-size: 14px; font-weight: 700; color: var(--color-gold-dark); margin-top: 6px; }
      `}</style>
    </div>
  )
}
