import { createSupabaseServerClient } from '@/lib/supabase/server'

export type SiteSettingsMap = Record<string, string>

// Matches the seed in docs/022-site-settings-seed.sql — used as a fallback
// if the settings fetch fails or a row is ever missing, so a DB hiccup
// degrades to "shows the old hardcoded value" rather than a blank/broken page.
export const SITE_SETTINGS_DEFAULTS: SiteSettingsMap = {
  reporting_year: '2025',
  charity_raised: '$31K',
  annual_dues: '$40',
  active_members: '100+',
  covenant_house_donation: '$2K',
  volunteer_hours: 'Hundreds',
  new_brothers: '7',
  fourth_degree_knights: '20',
  parish_events_per_year: '12',
  charities_supported: '10+',
  national_donated: '$193 million',
  national_service_hours: '47.5 million',
  grand_knight_quote:
    'Whether you have been a Knight for forty years or are simply curious about who we are, you have a brother in this council. Come to a meeting, share a meal, and see for yourself what fraternity feels like at Presentation.',
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const fetched = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]))
    return { ...SITE_SETTINGS_DEFAULTS, ...fetched }
  } catch {
    return SITE_SETTINGS_DEFAULTS
  }
}
