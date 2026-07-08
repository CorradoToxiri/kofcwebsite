-- ============================================================================
-- kofcwebsite — site_settings table + RLS + seed data
-- ============================================================================
-- Run in Supabase Studio > SQL Editor.
-- Step 1 creates the site_settings table.
-- Step 2 adds the updated_at trigger.
-- Step 3 enables RLS with the same anon-SELECT / admin-write pattern used by
-- every other content table.
-- Step 4 seeds the current, exact, live values read from the page code
-- (Home/About/Charities/Donate/Join) as of 2026-07-07, so the public site
-- keeps looking identical after this runs — nothing reads from this table yet
-- (that's the next prompt).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Step 1: create table
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
    key text primary key,
    value text not null,
    label text not null,
    section text not null,
    sort_order integer not null default 0,
    updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Step 2: updated_at trigger (reuses the existing set_updated_at() function)
-- ----------------------------------------------------------------------------
drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
    before update on public.site_settings
    for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Step 3: RLS — anon/public can SELECT, only admins can write
-- ----------------------------------------------------------------------------
alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
    for select using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
    for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Step 4: seed current values (exact strings from the live page code)
-- ----------------------------------------------------------------------------
insert into public.site_settings (key, value, label, section, sort_order) values
    ('reporting_year',            '2025',          'Reporting year (for charity/impact figures)', 'annual_figures', 10),
    ('charity_raised',             '$31K',          'Raised for charity',                          'annual_figures', 20),
    ('annual_dues',                 '$40',           'Annual member dues',                          'annual_figures', 30),
    ('active_members',             '100+',          'Active members',                              'annual_figures', 40),
    ('covenant_house_donation',    '$2K',           'Covenant House donation',                     'annual_figures', 50),
    ('volunteer_hours',            'Hundreds',      'Volunteer hours logged',                      'annual_figures', 60),
    ('new_brothers',                '7',             'New brothers welcomed',                       'annual_figures', 70),
    ('fourth_degree_knights',      '20',            'Fourth Degree Knights',                       'annual_figures', 80),
    ('parish_events_per_year',     '12',            'Parish events per year',                      'annual_figures', 90),
    ('charities_supported',        '10+',           'Charities/organizations supported',           'annual_figures', 100),
    ('national_donated',           '$193 million',  'KofC national — donated',                     'national_stats', 10),
    ('national_service_hours',     '47.5 million',  'KofC national — service hours',               'national_stats', 20),
    ('grand_knight_quote',
     'Whether you have been a Knight for forty years or are simply curious about who we are, you have a brother in this council. Come to a meeting, share a meal, and see for yourself what fraternity feels like at Presentation.',
     'Grand Knight quote', 'grand_knight', 10)
on conflict (key) do nothing;
