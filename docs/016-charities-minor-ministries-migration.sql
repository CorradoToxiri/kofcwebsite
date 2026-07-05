-- ============================================================================
-- kofcwebsite -- Migrate minor parish ministries into the charities table
-- ============================================================================
-- Run in Supabase Studio > SQL Editor.
--
-- Purpose: bring the three hardcoded 'minor parish ministries' (Food Pantry,
-- Thanksgiving Turkey Drive, Packathon) into the charities table so ALL charity
-- content is database-driven and uniformly manageable by the future admin UI.
--
-- This re-adds the 'parish_minor' category value that was previously removed
-- (documented at the time as: 'a value can be added back with a one-line alter
-- if the decision changes' -- this is that moment).
--
-- Notes:
--   * The one-line description goes in short_description; body stays null.
--   * No per-row image: the shared section image (CoP_volunteer.jpg) remains
--     hardcoded in the page component as the group's section header.
--   * No external_url: minor ministries have no individual links.
--   * sort_order 20-22 places them after majors (1-3) and before/around
--     externals (10-11) is not required -- rendering groups by category, and
--     sort_order only orders WITHIN a group. 20-22 keeps them cleanly numbered.
--   * Safe to re-run: ON CONFLICT (slug) DO NOTHING.
-- ============================================================================

-- Step 1: re-add 'parish_minor' to the category check constraint.
-- Must drop and recreate the constraint to change its allowed values.
alter table public.charities
    drop constraint if exists charities_category_check;

alter table public.charities
    add constraint charities_category_check
    check (category in ('parish_major', 'parish_minor', 'external'));

-- Step 2: insert the three minor ministries.
insert into public.charities (
    slug, name, short_description, body, external_url, photo_url, category, sort_order, is_published
) values
    (
        'parish-food-pantry',
        'Parish Food Pantry',
        'A pantry of food and household essentials for local families facing financial hardship; the Knights help fund it through events like the Parish Pasta Dinner.',
        NULL,
        NULL,
        NULL,
        'parish_minor',
        20,
        true
    ),
    (
        'thanksgiving-turkey-drive',
        'Thanksgiving Turkey Drive',
        'Each November, the council collects frozen turkeys for local families in need and for the Soup Kitchen''s Thanksgiving dinner, with members donating turkeys at the November meeting.',
        NULL,
        NULL,
        NULL,
        'parish_minor',
        21,
        true
    ),
    (
        'packathon',
        'Packathon',
        'A yearly food-packing event at Presentation, organized with Haiti Health Promise of Holy Name (Teaneck), benefiting the people of Milot, Haiti; the Knights handle setup and cleanup and sponsor a packing team.',
        NULL,
        NULL,
        NULL,
        'parish_minor',
        22,
        true
    )
on conflict (slug) do nothing;

-- Step 3: verify.
-- select name, category, sort_order, short_description
-- from public.charities order by
--   case category when 'parish_major' then 1 when 'parish_minor' then 2 else 3 end,
--   sort_order;