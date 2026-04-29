export type Officer = {
  id: string
  full_name: string
  title: string
  sort_order: number
  category: 'officer' | 'trustee' | 'director'
  is_featured: boolean
  photo_url: string | null
  email: string | null
  phone: string | null
  bio: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export type EventType =
  | 'council_meeting'
  | 'officers_meeting'
  | 'volunteer_activity'
  | 'social_event'
  | 'charity_event'
  | 'degree_ceremony'
  | 'other'

export type Event = {
  id: string
  slug: string
  title: string
  event_type: EventType
  starts_at: string
  ends_at: string | null
  location_name: string | null
  location_address: string | null
  location_map_url: string | null
  description: string | null
  hero_image_url: string | null
  signup_url: string | null
  signup_deadline: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export type NewsPost = {
  id: string
  slug: string
  title: string
  summary: string | null
  body: string | null
  hero_image_url: string | null
  published_at: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  slug: string
  title: string
  short_description: string | null
  body: string | null
  hero_image_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Charity = {
  id: string
  slug: string
  name: string
  short_description: string | null
  body: string | null
  logo_url: string | null
  photo_url: string | null
  external_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type Photo = {
  id: string
  storage_path: string
  caption: string | null
  alt_text: string | null
  taken_at: string | null
  activity_id: string | null
  charity_id: string | null
  event_id: string | null
  sort_order: number
  is_published: boolean
  created_at: string
}
