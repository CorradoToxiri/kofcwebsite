import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Charity } from '@/lib/supabase/types'
import EditCharityClient from '../../_components/EditCharityClient'

export const metadata = { title: 'Edit Charity · Admin' }

async function getCharity(id: string): Promise<Charity | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('charities').select('*').eq('id', id).single()
  return data
}

export default async function EditCharityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const charity = await getCharity(id)
  if (!charity) notFound()

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Charitable outreach</span>
          <h1 className="evp-title">Edit Charity</h1>
        </div>
      </div>

      <EditCharityClient charity={charity} />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}
