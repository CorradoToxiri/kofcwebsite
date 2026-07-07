import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import EditEventClient from '../../_components/EditEventClient'

export const metadata = { title: 'Edit Event · Admin' }

async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).single()
  return data
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council calendar</span>
          <h1 className="evp-title">Edit Event</h1>
        </div>
      </div>

      <EditEventClient event={event} />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}
