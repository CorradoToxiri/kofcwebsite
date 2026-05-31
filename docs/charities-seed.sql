-- ============================================================================
-- kofcwebsite — Charities seed data + schema patch
-- ============================================================================
-- Run in Supabase Studio > SQL Editor.
-- Step 1 adds the category column; Step 2 seeds the 5 full-card charities.
-- Minor ministries, anchor block, and closing block are hardcoded in the page,
-- NOT stored here. The category column allows only the two values actually used
-- by full-card charities; if minor ministries are ever moved into the database,
-- a value can be added back with a one-line alter.
-- ============================================================================

-- Step 1: add category column
alter table public.charities
    add column if not exists category text not null default 'external'
    check (category in ('parish_major', 'external'));

-- Step 2: seed the full-card charities
insert into public.charities (
    slug, name, short_description, body, external_url, photo_url, category, sort_order, is_published
) values
    (
        'soup-kitchen-ministry',
        'Soup Kitchen Ministry',
        'Feeding the hungry in Newark and Harlem — and seeing the face of Jesus in those we serve.',
        'The Soup Kitchen Ministry lives out the call of the Gospel by feeding the poor — seeing in every guest someone hungry not only for food, but for love and compassion. Each week, teams prepare meals in the parish kitchen and deliver them to soup kitchens in Newark and Harlem, serving guests through the year and at every holiday. The Knights proudly cover their own shifts several times a year, cooking and serving alongside our parish family.',
        'https://www.churchofpresentation.org/soup-kitchen/',
        'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/hero.png',
        'parish_major',
        1,
        true
    ),
    (
        'haiti-medical-mission',
        'Haiti Medical Mission',
        'A parish mission that grew into a year-round medical clinic in Cavaillon, Haiti.',
        'What began in 2002 as a parish twinning relationship became one of Presentation''s proudest works. Volunteer medical teams once traveled to Haiti to care for over a thousand people a week; today that mission has grown into NOVA Hope for Haiti, an independent charity that has run a permanent clinic in Cavaillon since 2014 — staffed by doctors, nurses, and pharmacists 52 weeks a year. The parish still sends volunteer teams, and the Knights support the events that fund the mission, contributing $2,000 this past year.',
        'http://www.novahope.org/',
        'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_nova.jpg',
        'parish_major',
        2,
        true
    ),
    (
        'youth-ministry',
        'Youth Ministry',
        'Walking with our parish''s young people as they grow in faith, friendship, and service.',
        'Presentation''s Youth Ministry gives young people a community where they can grow in faith and build friendships that last a lifetime. The Knights are proud to support it in hands-on ways: serving breakfast at the Antioch Retreat, cooking alongside the youth groups at the Parish Pancake Breakfast, and this year sponsoring three winners of a Youth Essay Contest — an initiative inviting our young parishioners to reflect on their faith, values, and community through writing.',
        'https://www.churchofpresentation.org/youthministry/',
        'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_youth.jpg',
        'parish_major',
        3,
        true
    ),
    (
        'covenant-house-nj',
        'Covenant House New Jersey',
        'Walking with young people facing homelessness and survivors of human trafficking.',
        'Covenant House New Jersey helps young people facing homelessness and survivors of human trafficking begin a new chapter in their lives. The Knights support their work in several ways: a yearly $2,000 donation to sponsor their scholarship program, participation in the "Sleep Out" fundraiser, and serving Thanksgiving dinner each year to more than 100 guests — donating the food and serving it ourselves.',
        'https://covenanthousenj.org/',
        'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CHNJ.jpg',
        'external',
        10,
        true
    ),
    (
        'usr-ambulance-corps',
        'Upper Saddle River Volunteer Ambulance Corps',
        'Neighbors answering the call when our community needs help most.',
        'Formed in 1958 by borough residents who wanted to help others in their time of greatest need, the Upper Saddle River Volunteer Ambulance Corps has served our community for more than sixty years. The Knights are proud to support their work with financial contributions, helping equip the volunteers who answer that call for our neighbors.',
        'https://www.usrems.org/home',
        'https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/USR_Ambulance.jpg',
        'external',
        11,
        true
    )
on conflict (slug) do nothing;

-- Verify:
-- select name, category, sort_order from public.charities order by sort_order;