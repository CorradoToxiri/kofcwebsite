# Admin UI — Slice 3: Officers Editor (with image upload)

Build the **Officers** management section of the admin UI, following the SAME patterns established for Events (list → create/edit → delete, shared form, "Visible on website" toggle, plain-language validation/errors, auto success confirmation). The admin shell, sidebar, auth, and route protection already exist. This slice fills in the Officers section (currently a placeholder).

The NEW capability in this slice is **image upload** for officer photos — kept deliberately simple (see the Image Handling section; do NOT over-engineer it).

## Before building — read the real schema and existing code

1. Read the actual `officers` table. Columns: `id`, `full_name`, `title`, `sort_order`, `category`, `photo_url`, `email`, `phone`, `bio`, `is_published`, `is_featured`, `created_at`, `updated_at`.
2. **Find and reuse the existing category label/heading mapping** on the public officers page (the officers page maps `category` values to display labels/section headings). Reuse that mapping for the admin category dropdown — do not create a parallel one. If it isn't already a shared/importable module, refactor it into one shared place both the public page and the admin form import (same approach used for event-type labels).

## Field handling

`category` allowed values (from the DB check constraint): `officer`, `trustee`, `director`.

**Form fields:**
- **Full name** (`full_name`) — required text.
- **Title** (`title`) — required, FREE TEXT (the person's specific role, e.g. "Grand Knight", "Chaplain", "Membership Director"). This is separate from category.
- **Category** (`category`) — required dropdown showing the friendly labels (from the reused mapping), storing `officer` / `trustee` / `director`.
- **Sort order** (`sort_order`) — integer; controls display order within the group. A simple number input is fine.
- **Photo** (`photo_url`) — see Image Handling below.
- **Email** (`email`) — optional text.
- **Phone** (`phone`) — optional text.
- **Bio** (`bio`) — optional, multi-line text area.
- **Visible on website** (`is_published`) — clear toggle, default ON.
- **"Place at the Top of the Officer's Page"** (`is_featured`) — a toggle, default OFF. (This flag places the officer in the top/featured section of the public page — used for the Grand Knight and Chaplain.) Use exactly that plain-language label, not "is_featured".

**Auto-managed, hidden:** `id`, `created_at`, `updated_at`.

## Screens (same structure as Events)

- **List — `/admin/officers`**: table of officers. Suggested columns: Name · Title · Category (friendly label) · Visible on website (Yes/No). Order the list sensibly (e.g. by category then sort_order, mirroring the public page). Each row: Edit and Delete actions. Prominent "+ Add New Officer" button. (No page-size selector or Duplicate needed here — the officer list is small.)
- **Create — `/admin/officers/new`**: shared form, empty, "Visible on website" ON by default, "Place at top" OFF.
- **Edit — `/admin/officers/[id]/edit`**: same shared form, pre-filled. Delete action with confirmation dialog ("Delete '[name]'? This can't be undone.").
- Create and Edit use the SAME form component.

## Image Handling — KEEP IT SIMPLE (do not over-engineer)

Officer photos live in the existing Supabase `public-photos` bucket. Officer headshots follow the naming convention `Head_FirstNameLastName.jpg` (a `Head_` prefix).

Provide TWO ways to set an officer's photo, sharing ONE preview:

**A) Upload a new image:**
- Accept ONLY `.jpg`, `.jpeg`, `.png`. Reject anything else with a plain-language message ("Please use a JPG or PNG image.").
- Max file size **5 MB**. Reject larger with a plain-language message ("Please use an image under 5 MB.").
- **Do NOT** validate or enforce aspect ratio / dimensions. The public page already handles anything from square to 3:4 (normal headshot range). No cropping, no ratio checks.
- **Do NOT** convert formats (no HEIC handling), **do NOT** compress or resize. Just the format + size checks above. Keep it simple.
- **Filename normalization before storing**, in this order:
  1. Replace spaces with underscores.
  2. If the name does not already start with `Head_`, prepend `Head_` (do not double-prefix an already-`Head_` name).
  3. Upload to the `public-photos` bucket using upsert (overwrite) — if a file with the resulting name already exists, the new upload OVERWRITES it (newer wins, one file per name).
- After upload, set the officer's `photo_url` to the uploaded file's public URL and show it in the preview.
- Note: because uploads overwrite by filename, Supabase's CDN may briefly serve a cached old image after an overwrite. This is expected; do not build elaborate cache-busting, but appending a simple cache-busting query param (e.g. `?v=<timestamp>`) to the preview image URL is acceptable to help the admin see the new image immediately.

**B) Pick an existing image from the bucket:**
- Show a list of files in the `public-photos` bucket whose filename **starts with `Head_`** (filter to officer headshots only — do not list the whole bucket). The filenames are human-meaningful (e.g. `Head_Edward_Dowd.jpg`), so a simple selectable list of filenames is sufficient — a full thumbnail gallery is NOT required.
- When the admin selects a filename, show that image in the SAME preview used for uploads, so they visually confirm they picked the right person, then set `photo_url` accordingly.

**Shared preview:** both paths (upload / pick) display the resulting image in one preview area so the admin confirms the photo before saving. Also show the officer's current photo in the preview when editing an existing officer.

Keep the whole image feature lean: format check, size check, filename normalization, upload-or-pick, one preview. Nothing more.

## Quality & safety (same standard as Events)
- Validate required fields (full_name, title, category) before save, plain-language messages.
- Plain-language success/error feedback; never raw Supabase errors.
- Writes go through the authenticated admin session, subject to existing RLS (admin-only writes). Confirm create/edit/delete and image upload actually work against live RLS and Storage policies. (Note: uploading to Storage may require a Storage policy allowing authenticated admins to write to the bucket — check whether the current Storage policies permit admin uploads, and if not, report what needs adding rather than loosening it silently.)
- Old photos are intentionally NOT deleted when replaced — leave them in the bucket. Do not build cleanup.

## Verify before stopping (ONLY the non-obvious checks — I test the UI visually myself)
- Image upload correctly normalizes the filename: spaces→underscores, `Head_` prefix added only if missing (no double prefix), and an upload whose normalized name matches an existing file OVERWRITES it (upsert), rather than erroring or creating a duplicate.
- The "pick existing" list is correctly filtered to only `Head_*` files in the bucket (not the entire bucket).
- Storage upload actually succeeds under the current RLS/Storage policies for an authenticated admin (or, if it fails, report exactly which Storage policy needs to be added — do not weaken policies silently).
- The category dropdown reuses the SAME mapping as the public officers page (confirm shared, not duplicated).
- `is_featured` ("Place at the Top…") round-trips correctly and the public page places featured officers at the top.

(I will visually verify the form layout, the preview, the list, and general look myself — no need to drive a browser for those.)

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Do NOT commit. Report anything about Storage policies or the category-mapping refactor I should double-check.
