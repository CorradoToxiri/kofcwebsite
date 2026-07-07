import type { Officer } from '@/lib/supabase/types'

export type OfficerCategory = Officer['category']

// Single source of truth for officers.category labels. Used by the public
// officers page and the admin officers form/table — keep them here so they
// can't drift (same approach as EVENT_TYPE_LABEL for events).
export const OFFICER_CATEGORY_LABEL: Record<OfficerCategory, string> = {
  officer: 'Officer',
  trustee: 'Trustee',
  director: 'Director',
}

// Fixed order matching the DB check constraint on officers.category.
export const OFFICER_CATEGORY_OPTIONS: { value: OfficerCategory; label: string }[] = [
  'officer',
  'trustee',
  'director',
].map((value) => ({ value: value as OfficerCategory, label: OFFICER_CATEGORY_LABEL[value as OfficerCategory] }))
