-- ============================================================================
-- kofcwebsite — Supabase Schema (Phase 1A)
-- ============================================================================
-- Presentation Council #6033 — Knights of Columbus
-- Run this in Supabase Studio > SQL Editor, or via `supabase db push` if
-- you adopt the Supabase CLI.
--
-- This schema supports Phase 1A (public presentation site) with RLS policies
-- stubbed for Phase 1B (admin UI). Phase 2 (volunteer signup system) tables
-- are included at the bottom as commented scaffolding for future work.
--
-- Conventions:
--   - snake_case table and column names
--   - UUID primary keys (with gen_random_uuid() default)
--   - created_at / updated_at on every content table
--   - slug columns for URL-friendly identifiers where relevant
--   - is_published boolean to allow draft content in Phase 1B
-- ============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles — admin users (Phase 1B, created now for RLS policy readiness)
-- ----------------------------------------------------------------------------
-- Extends Supabase's built-in auth.users table. A row is created automatically
-- via trigger when a new auth user signs up. Only users with role = 'admin'
-- can mutate content.

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    display_name text,
    role text not null default 'viewer' check (role in ('viewer', 'admin')),
    created_at timestamptz not null default now()
);

-- Auto-create a profile row on new auth user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, display_name)
    values (new.id, new.email, split_part(new.email, '@', 1));
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Helper function used by RLS policies below
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

-- ----------------------------------------------------------------------------
-- officers
-- ----------------------------------------------------------------------------
create table if not exists public.officers (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    title text not null,                    -- e.g., "Grand Knight"
    sort_order int not null default 0,      -- controls display order on the page
    category text not null default 'officer' check (category in ('officer', 'trustee', 'director')),
    photo_url text,                         -- URL to Supabase Storage or external source
    email text,
    phone text,
    bio text,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- events
-- ----------------------------------------------------------------------------
-- Single source of truth for all events: council meetings, officer meetings,
-- volunteer activities, social events, charity drives. The homepage's "Next
-- Meetings" bar and "Upcoming Activities" carousel both read from this table.

create table if not exists public.events (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    event_type text not null check (event_type in (
        'council_meeting',
        'officers_meeting',
        'volunteer_activity',
        'social_event',
        'charity_event',
        'degree_ceremony',
        'other'
    )),
    starts_at timestamptz not null,
    ends_at timestamptz,
    location_name text,
    location_address text,
    location_map_url text,                  -- Google Maps link
    description text,
    hero_image_url text,
    signup_url text,                        -- external signup.com link (Phase 1A)
    signup_deadline timestamptz,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_events_starts_at on public.events(starts_at);
create index if not exists idx_events_event_type on public.events(event_type);

-- ----------------------------------------------------------------------------
-- news — news posts and announcements
-- ----------------------------------------------------------------------------
create table if not exists public.news (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    summary text,
    body text,                              -- markdown
    hero_image_url text,
    published_at timestamptz,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_news_published_at on public.news(published_at desc);

-- ----------------------------------------------------------------------------
-- activities — recurring annual activities for /activities page
-- ----------------------------------------------------------------------------
-- These are the "things we do every year" (Golf Outing, Pancake Breakfast,
-- Fish Fry, etc.) — distinct from individual event instances in the events
-- table. A specific instance of Golf Outing 2026 would be a row in events;
-- the general description of "our annual Golf Outing" is a row here.

create table if not exists public.activities (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    short_description text,
    body text,                              -- markdown
    hero_image_url text,
    sort_order int not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- charities — supported charities for /charities page
-- ----------------------------------------------------------------------------
create table if not exists public.charities (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    short_description text,
    body text,                              -- markdown
    logo_url text,
    photo_url text,                         -- e.g., check presentation photo
    external_url text,
    sort_order int not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- photos — general photo library, tagged to activities or charities
-- ----------------------------------------------------------------------------
create table if not exists public.photos (
    id uuid primary key default gen_random_uuid(),
    storage_path text not null,             -- path in Supabase Storage
    caption text,
    alt_text text,
    taken_at date,
    activity_id uuid references public.activities(id) on delete set null,
    charity_id uuid references public.charities(id) on delete set null,
    event_id uuid references public.events(id) on delete set null,
    sort_order int not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now()
);

create index if not exists idx_photos_activity_id on public.photos(activity_id);
create index if not exists idx_photos_charity_id on public.photos(charity_id);

-- ----------------------------------------------------------------------------
-- updated_at triggers — auto-maintain updated_at on UPDATE
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

do $$
declare
    t text;
begin
    for t in select unnest(array['officers', 'events', 'news', 'activities', 'charities']) loop
        execute format(
            'drop trigger if exists trg_%I_updated_at on public.%I;
             create trigger trg_%I_updated_at
                 before update on public.%I
                 for each row execute procedure public.set_updated_at();',
            t, t, t, t
        );
    end loop;
end $$;

-- ============================================================================
-- Row-Level Security (RLS)
-- ============================================================================
-- Strategy:
--   - Enable RLS on all public tables
--   - Anonymous visitors: SELECT allowed where is_published = true
--   - Authenticated admins: full CRUD (gated by is_admin() helper)
--   - profiles table: users can read their own row; only admins can modify roles
-- ============================================================================

alter table public.profiles   enable row level security;
alter table public.officers   enable row level security;
alter table public.events     enable row level security;
alter table public.news       enable row level security;
alter table public.activities enable row level security;
alter table public.charities  enable row level security;
alter table public.photos     enable row level security;

-- profiles: users see own row; admins see all
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
    for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
    for all using (public.is_admin()) with check (public.is_admin());

-- Generic pattern for public-readable content tables
-- officers
drop policy if exists "officers_public_read" on public.officers;
create policy "officers_public_read" on public.officers
    for select using (is_published = true or public.is_admin());

drop policy if exists "officers_admin_write" on public.officers;
create policy "officers_admin_write" on public.officers
    for all using (public.is_admin()) with check (public.is_admin());

-- events
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
    for select using (is_published = true or public.is_admin());

drop policy if exists "events_admin_write" on public.events;
create policy "events_admin_write" on public.events
    for all using (public.is_admin()) with check (public.is_admin());

-- news
drop policy if exists "news_public_read" on public.news;
create policy "news_public_read" on public.news
    for select using (is_published = true or public.is_admin());

drop policy if exists "news_admin_write" on public.news;
create policy "news_admin_write" on public.news
    for all using (public.is_admin()) with check (public.is_admin());

-- activities
drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read" on public.activities
    for select using (is_published = true or public.is_admin());

drop policy if exists "activities_admin_write" on public.activities;
create policy "activities_admin_write" on public.activities
    for all using (public.is_admin()) with check (public.is_admin());

-- charities
drop policy if exists "charities_public_read" on public.charities;
create policy "charities_public_read" on public.charities
    for select using (is_published = true or public.is_admin());

drop policy if exists "charities_admin_write" on public.charities;
create policy "charities_admin_write" on public.charities
    for all using (public.is_admin()) with check (public.is_admin());

-- photos
drop policy if exists "photos_public_read" on public.photos;
create policy "photos_public_read" on public.photos
    for select using (is_published = true or public.is_admin());

drop policy if exists "photos_admin_write" on public.photos;
create policy "photos_admin_write" on public.photos
    for all using (public.is_admin()) with check (public.is_admin());

-- Add is_featured column to officers for the homepage/officers page featured layout
alter table public.officers
    add column if not exists is_featured boolean not null default false;

-- ============================================================================
-- Storage buckets (run separately, or create via Supabase Studio UI)
-- ============================================================================
-- Recommended buckets:
--   public-photos  (public read, admin write)  — officer headshots, event photos
--   documents      (public read, admin write)  — PDF calendar, bulletins
--   admin-uploads  (admin read/write)          — staging before publishing
--
-- Via Supabase Studio: Storage > New Bucket > set "Public bucket" as needed
-- for the first two. RLS policies on storage.objects should be configured
-- there using is_admin() helper for write operations.

-- ============================================================================
-- Phase 2 scaffolding (commented out — uncomment when Phase 2 begins)
-- ============================================================================
-- Tables for the volunteer signup system that will replace signup.com.
-- Included here so the data model is visible end-to-end from the start.
--
-- create table if not exists public.signup_slots (
--     id uuid primary key default gen_random_uuid(),
--     event_id uuid not null references public.events(id) on delete cascade,
--     role_label text not null,          -- e.g., "Serving Breakfast", "Setup Crew"
--     slot_starts_at timestamptz not null,
--     slot_ends_at timestamptz not null,
--     capacity int not null default 1,
--     notes text,
--     sort_order int not null default 0,
--     created_at timestamptz not null default now()
-- );
--
-- create table if not exists public.signups (
--     id uuid primary key default gen_random_uuid(),
--     slot_id uuid not null references public.signup_slots(id) on delete cascade,
--     volunteer_name text not null,
--     volunteer_phone text not null,
--     volunteer_email text,
--     notes text,
--     created_at timestamptz not null default now()
-- );

-- ============================================================================
-- End of schema
-- ============================================================================
