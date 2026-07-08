import type { Charity } from '@/lib/supabase/types'

export type CharityCategory = Charity['category']

// Single source of truth for charities.category labels. Used by the admin
// charities form/table — wording kept consistent with the public charities
// page section headings (same approach as OFFICER_CATEGORY_LABEL).
export const CHARITY_CATEGORY_LABEL: Record<CharityCategory, string> = {
  parish_major: 'Main Parish Ministries',
  parish_minor: 'Other Parish Ministries',
  external: 'Beyond Our Parish',
}

// Fixed order matching the DB check constraint on charities.category, and
// the section order on the public charities page.
export const CHARITY_CATEGORY_OPTIONS: { value: CharityCategory; label: string }[] = [
  'parish_major',
  'parish_minor',
  'external',
].map((value) => ({ value: value as CharityCategory, label: CHARITY_CATEGORY_LABEL[value as CharityCategory] }))
