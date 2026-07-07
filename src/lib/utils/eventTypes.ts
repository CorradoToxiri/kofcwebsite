import type { EventType } from '@/lib/supabase/types'

// Single source of truth for event_type labels. Used by the public calendar
// page and the admin events form/table — keep them here so they can't drift.
export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  council_meeting:    'Council Meeting',
  officers_meeting:   "Officers' Meeting",
  volunteer_activity: 'Volunteer Activity',
  social_event:       'Social Event',
  charity_event:      'Charity Event',
  degree_ceremony:    'Degree Ceremony',
  other:              'Event',
}

// Fixed order matching the DB check constraint on events.event_type.
export const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  'council_meeting',
  'officers_meeting',
  'volunteer_activity',
  'social_event',
  'charity_event',
  'degree_ceremony',
  'other',
].map((value) => ({ value: value as EventType, label: EVENT_TYPE_LABEL[value as EventType] }))
