-- ============================================================================
-- Slice 3 (Officers editor): Storage RLS policies for the public-photos bucket
-- ============================================================================
-- Verified live (2026-07-07) against the actual project: authenticated admin
-- uploads to the `public-photos` bucket currently FAIL with
-- "new row violates row-level security policy" (403). Listing objects also
-- returns zero rows for both anon and authenticated-admin sessions.
--
-- Public reads of individual files by URL still work (the bucket's "Public
-- bucket" flag serves object downloads directly, bypassing storage.objects
-- RLS) — that's why photo_url images already render fine on /officers. But
-- storage.objects has no policies at all permitting authenticated admins to
-- SELECT (list) or INSERT/UPDATE (upload, including upsert overwrites),
-- which the new Officers image-upload feature needs.
--
-- Run this in Supabase Studio > SQL Editor. Mirrors the public.is_admin()
-- pattern already used for officers/events/etc. in 03-supabase-schema.sql.
-- ============================================================================

drop policy if exists "public_photos_admin_select" on storage.objects;
create policy "public_photos_admin_select" on storage.objects
    for select to authenticated
    using (bucket_id = 'public-photos' and public.is_admin());

drop policy if exists "public_photos_admin_insert" on storage.objects;
create policy "public_photos_admin_insert" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'public-photos' and public.is_admin());

-- Needed because upsert-overwrite of an existing filename is an UPDATE on
-- the existing storage.objects row, not a second INSERT.
drop policy if exists "public_photos_admin_update" on storage.objects;
create policy "public_photos_admin_update" on storage.objects
    for update to authenticated
    using (bucket_id = 'public-photos' and public.is_admin())
    with check (bucket_id = 'public-photos' and public.is_admin());
