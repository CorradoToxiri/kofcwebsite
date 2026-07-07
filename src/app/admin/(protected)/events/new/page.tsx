import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import EventForm from '../_components/EventForm'

export const metadata = { title: 'Add Event · Admin' }

async function getDuplicateSource(id: string): Promise<Event | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).single()
  return data
}

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicateFrom?: string }>
}) {
  const { duplicateFrom } = await searchParams
  const duplicateOf = duplicateFrom ? await getDuplicateSource(duplicateFrom) : null

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council calendar</span>
          <h1 className="evp-title">Add New Event</h1>
        </div>
      </div>

      <EventForm mode="create" duplicateOf={duplicateOf ?? undefined} />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}
