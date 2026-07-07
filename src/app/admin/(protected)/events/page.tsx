import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/supabase/types'
import EventsTable from './_components/EventsTable'

export const metadata = { title: 'Events · Admin' }

// Supabase/PostgREST caps rows per request (default 1,000) regardless of an
// explicit .limit() above that cap, so we page through with .range() to
// fetch every event no matter how many there are.
const FETCH_PAGE_SIZE = 1000

async function getEvents(): Promise<Event[]> {
  const supabase = await createSupabaseServerClient()
  const all: Event[] = []
  let from = 0
  for (;;) {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: false })
      .range(from, from + FETCH_PAGE_SIZE - 1)
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < FETCH_PAGE_SIZE) break
    from += FETCH_PAGE_SIZE
  }
  return all
}

const SUCCESS_MESSAGE: Record<string, string> = {
  created: 'Event created.',
  updated: 'Event updated.',
  deleted: 'Event deleted.',
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const [events, { success }] = await Promise.all([getEvents(), searchParams])
  const successMessage = success ? SUCCESS_MESSAGE[success] : null

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council calendar</span>
          <h1 className="evp-title">Events</h1>
        </div>
        <Link href="/admin/events/new" className="btn btn-primary">
          + Add New Event
        </Link>
      </div>

      {successMessage && (
        <div className="evp-success" role="status">{successMessage}</div>
      )}

      <EventsTable events={events} />

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
