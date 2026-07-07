import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Officer } from '@/lib/supabase/types'
import EditOfficerClient from '../../_components/EditOfficerClient'

export const metadata = { title: 'Edit Officer · Admin' }

async function getOfficer(id: string): Promise<Officer | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('officers').select('*').eq('id', id).single()
  return data
}

export default async function EditOfficerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const officer = await getOfficer(id)
  if (!officer) notFound()

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council leadership</span>
          <h1 className="evp-title">Edit Officer</h1>
        </div>
      </div>

      <EditOfficerClient officer={officer} />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}
