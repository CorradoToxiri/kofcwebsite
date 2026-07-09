import type { SupabaseClient } from '@supabase/supabase-js'
import type { Event } from '@/lib/supabase/types'
import { getColumbianYearBounds } from '@/lib/utils/columbianYear'

// Published events within the Columbian year beginning July 1 of `startYear`,
// chronological. Half-open range: includes Jun 30 (end year), excludes Jul 1
// (end year) — see getColumbianYearBounds.
export async function getCalendarEvents(
  supabase: SupabaseClient,
  startYear: number
): Promise<Event[]> {
  const { startISO, endISO } = getColumbianYearBounds(startYear)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('starts_at', startISO)
    .lt('starts_at', endISO)
    .order('starts_at', { ascending: true })

  if (error) throw error
  return data ?? []
}
