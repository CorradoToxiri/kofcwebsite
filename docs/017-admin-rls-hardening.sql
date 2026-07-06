-- ============================================================================
-- kofcwebsite — Admin Slice 1: RLS hardening (defense in depth)
-- ============================================================================
-- Run this in Supabase Studio > SQL Editor.
--
-- Context: the content-table RLS policies from 03-supabase-schema.sql were
-- verified against the LIVE database (2026-07-05) and found correct — see the
-- "VERIFIED" block below. This file adds ONE new safeguard (a trigger locking
-- profiles.role changes out of the app) and re-asserts the existing policies
-- idempotently so this file is a complete, re-runnable source of truth.
--
-- Nothing here weakens public read access, so the live public site is unaffected.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- VERIFIED (2026-07-05) — no change required, re-asserted below for the record
-- ----------------------------------------------------------------------------
--  * RLS is ENABLED on: profiles, officers, events, news, activities, charities,
--    photos.
--  * Public/anon SELECT returns ONLY rows where is_published = true (checked
--    empirically across every content table — no unpublished rows leaked).
--  * Anon INSERT is rejected (error 42501); anon UPDATE/DELETE affect 0 rows
--    (the USING (is_admin()) clause matches nothing for a non-admin).
--  * profiles is not readable by anon; is_admin() exists and returns false for
--    anon.
-- ----------------------------------------------------------------------------


-- ----------------------------------------------------------------------------
-- NEW — Lock profiles.role out of the app layer
-- ----------------------------------------------------------------------------
-- Role management is intentionally a manual Supabase task. The existing
-- profiles_admin_write policy lets an admin UPDATE profile rows (e.g. to fix a
-- display name), which would also let them rewrite `role`. This trigger blocks
-- any role change that originates from an authenticated app session (auth.uid()
-- is non-null). Changes made from the SQL editor / service role (auth.uid() is
-- null) are still allowed, so an administrator can promote a user manually.
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    if new.role is distinct from old.role and auth.uid() is not null then
        raise exception
            'Role changes must be made by a Supabase administrator, not through the app.';
    end if;
    return new;
end;
$$;

drop trigger if exists trg_profiles_role_lock on public.profiles;
create trigger trg_profiles_role_lock
    before update on public.profiles
    for each row execute procedure public.prevent_profile_role_change();


-- ----------------------------------------------------------------------------
-- Re-assert existing policies (idempotent; identical to 03-supabase-schema.sql)
-- ----------------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.officers   enable row level security;
alter table public.events     enable row level security;
alter table public.news       enable row level security;
alter table public.activities enable row level security;
alter table public.charities  enable row level security;
alter table public.photos     enable row level security;

-- profiles: a user reads only their own row (admins read all); writes admin-only
-- (and role changes are further blocked by the trigger above).
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
    for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
    for all using (public.is_admin()) with check (public.is_admin());

-- Content tables: public reads published rows; admins do everything.
do $$
declare t text;
begin
    foreach t in array array['officers','events','news','activities','charities','photos']
    loop
        execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
        execute format(
            'create policy %I on public.%I for select using (is_published = true or public.is_admin())',
            t || '_public_read', t
        );
        execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
        execute format(
            'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())',
            t || '_admin_write', t
        );
    end loop;
end $$;

-- ============================================================================
-- End
-- ============================================================================
