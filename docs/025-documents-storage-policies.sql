-- ============================================================================
-- Tier 2, Prompt 4 (Calendar PDF generator): Storage RLS policies for the
-- `documents` bucket
-- ============================================================================
-- Same gap as public-photos before 020-officers-storage-policies.sql: the
-- `documents` bucket is only described as a "recommended bucket" in
-- 03-supabase-schema.sql with a to-do comment ("RLS policies on storage.objects
-- should be configured there using is_admin() helper") — no policies were ever
-- added. The bucket's "Public bucket" flag serves existing file downloads by
-- URL fine (that's why the public Calendar page's download link already
-- works), but storage.objects has no policy permitting an authenticated admin
-- to INSERT or UPDATE (upsert-overwrite) objects in this bucket — needed for
-- the new "Publish to site" action, which overwrites
-- documents/KofC6033_Calendar.pdf in place.
--
-- Run this in Supabase Studio > SQL Editor. Mirrors
-- 020-officers-storage-policies.sql exactly, bucket swapped.
-- ============================================================================

drop policy if exists "documents_admin_select" on storage.objects;
create policy "documents_admin_select" on storage.objects
    for select to authenticated
    using (bucket_id = 'documents' and public.is_admin());

drop policy if exists "documents_admin_insert" on storage.objects;
create policy "documents_admin_insert" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'documents' and public.is_admin());

-- Needed because upsert-overwrite of an existing filename (KofC6033_Calendar.pdf
-- already exists) is an UPDATE on the existing storage.objects row, not a
-- second INSERT.
drop policy if exists "documents_admin_update" on storage.objects;
create policy "documents_admin_update" on storage.objects
    for update to authenticated
    using (bucket_id = 'documents' and public.is_admin())
    with check (bucket_id = 'documents' and public.is_admin());
