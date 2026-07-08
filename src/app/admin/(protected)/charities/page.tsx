import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Charity } from '@/lib/supabase/types'
import CharitiesTable from './_components/CharitiesTable'

export const metadata = { title: 'Charities · Admin' }

async function getCharities(): Promise<Charity[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('charities')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

const SUCCESS_MESSAGE: Record<string, string> = {
  created: 'Charity created.',
  updated: 'Charity updated.',
  deleted: 'Charity deleted.',
}

export default async function AdminCharitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [charities, { success }] = await Promise.all([getCharities(), searchParams])
  const successMessage = success ? SUCCESS_MESSAGE[success] : null

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Charitable outreach</span>
          <h1 className="evp-title">Charities</h1>
        </div>
        <Link href="/admin/charities/new" className="btn btn-primary">
          + Add New Charity
        </Link>
      </div>

      {successMessage && (
        <div className="evp-success" role="status">{successMessage}</div>
      )}

      <CharitiesTable charities={charities} />

      <style>{`
        .evp-head { display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; margin-bottom: 22px; flex-wrap: wrap; }
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 0; color: var(--color-navy); }
        .evp-success {
          background: #E4F5E9; border: 1px solid #B9E3C6; color: #1F7A3D;
          border-radius: 8px; padding: 12px 16px; font-size: 14px; margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}
