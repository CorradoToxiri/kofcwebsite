# Admin UI — Slice 4: Charities Editor (completes Tier 1)

Build the **Charities** management section of the admin UI, following the SAME patterns established for Events and Officers (list → create/edit → delete, shared form, "Visible on website" toggle, plain-language validation/errors, auto success confirmation, delete-with-confirmation). The admin shell, sidebar, auth, and route protection already exist. This slice fills in the Charities section (currently a placeholder) and completes the Tier 1 content editors.

This is the last Tier 1 editor and reuses patterns already proven in Events and Officers. Image handling here is **upload-only** and simpler than Officers (no "pick existing" picker).

## Before building — read the real schema and existing code

1. Read the actual `charities` table. Columns: `id`, `slug`, `name`, `short_description`, `body`, `logo_url`, `photo_url`, `external_url`, `sort_order`, `is_published`, `category`, `created_at`, `updated_at`.

## Field handling

`category` allowed values (from the DB check constraint): `parish_major`, `parish_minor`, `external`.

**Form fields (show ALL fields always, regardless of category — see note below):**
- **Name** (`name`) — required text.
- **Category** (`category`) — required dropdown showing friendly labels (Main Parish Ministries / Other Parish Ministries / Beyond Our Parish), storing `parish_major` / `parish_minor` / `external`.
- **Short description** (`short_description`) — text (the card subtitle / one-liner). Can be multi-line-ish; a normal text input or small textarea.
- **Body** (`body`) — optional, multi-line text area (the longer card paragraph).
- **Photo** (`photo_url`) — image upload; see Image Handling below.
- **External URL** (`external_url`) — optional text (the "Learn more →" link target).
- **Sort order** (`sort_order`) — integer; controls order within the category group. Simple number input.
- **Visible on website** (`is_published`) — clear toggle, default ON.

**Do NOT include `logo_url` in the form** — it is unused. Leave it untouched.
**Auto-managed, hidden:** `id`, `slug` (auto-generated, unique, collision-safe, never shown — same as Events/Officers), `created_at`, `updated_at`.

**Note on the three categories:** The public charities page renders the categories differently — `parish_major` and `external` render as full cards (using name, short_description, body, photo, external_url), while `parish_minor` renders as a compact one-line list (name + short_description only, no image/body/link). The admin form does NOT need to adapt to this — **show all fields always.** A minor-ministry record simply leaves body / photo / external_url empty, and the public page ignore those for the compact list. Keep the form uniform; do not build category-conditional field hiding. This allows to move charities between categories if they ever change relevance through the years.

## Screens (same structure as Events/Officers)

- **List — `/admin/charities`**: table of charities. Suggested columns: Name · Category (friendly label) · Sort order · Visible on website (Yes/No). **Order the list by category then sort_order**, mirroring the public page grouping (so the admin list order matches what visitors see). Each row: Edit and Delete actions. Prominent "+ Add New Charity" button. (No page-size selector or Duplicate needed — the list is small.)
- **Create — `/admin/charities/new`**: shared form, empty, "Visible on website" ON by default.
- **Edit — `/admin/charities/[id]/edit`**: same shared form, pre-filled. Delete action with confirmation ("Delete '[name]'? This can't be undone.").
- Create and Edit use the SAME form component.

## Image Handling — upload only, KEEP IT SIMPLE

Charity card images live in the existing Supabase `public-photos` bucket. This is simpler than the officer image handling — **UPLOAD ONLY, no "pick existing" picker.**

- Accept ONLY `.jpg`, `.jpeg`, `.png`. Reject anything else with a plain-language message ("Please use a JPG or PNG image.").
- Max file size **5 MB**. Reject larger with a plain-language message ("Please use an image under 5 MB.").
- **Do NOT** validate or enforce aspect ratio / dimensions. Instead, show a small helper hint near the upload control: **"Landscape images (roughly 16:9) look best."** Accept any image regardless; the page's existing CSS fits images into the cards.
- **Do NOT** convert formats (no HEIC handling), compress, or resize.
- Upload to the `public-photos` bucket. Normalize the filename: replace spaces with underscores. (No special prefix required for charity images — unlike the officer `Head_` convention.) Use upsert so re-uploading the same filename overwrites (newer wins). A cache-busting `?v=<timestamp>` on the preview URL is acceptable so the admin sees the new image immediately.
- After upload, set `photo_url` to the uploaded file's public URL and show it in a **preview** so the admin confirms. When editing an existing charity, show the current photo in the preview. Provide a "Remove photo" option that clears `photo_url` (leaves the file in storage — do not delete).

Old photos are intentionally NOT deleted when replaced or removed. Do not build cleanup.

## Quality & safety (same standard as Events/Officers)
- Validate required fields (name, category) before save, plain-language messages.
- Plain-language success/error feedback; never raw Supabase errors.
- Writes go through the authenticated admin session, subject to existing RLS (admin-only writes) and the Storage policies added in the Officers slice (which already allow admin uploads to `public-photos` — reuse them; no new Storage policy should be needed. If an upload fails on policy, report it rather than loosening silently).
- Slug auto-generated, unique, collision-safe, hidden from admins (same as Events/Officers).

## Verify before stopping (ONLY the non-obvious checks — I test the UI visually myself)
- Creating a charity auto-generates a unique slug (no collision failure even with a duplicate name), and `logo_url` is left untouched.
- Category dropdown reuses the same label wording as the public charities page (confirm shared or consistent, not contradictory).
- Image upload succeeds under the existing Storage policies from the Officers slice (no new policy needed); filename spaces are normalized; re-upload overwrites via upsert.
- A `parish_minor` charity saved with empty body/photo/external_url still renders correctly as a compact list item on the public page, and a `parish_major`/`external` charity renders as a full card — i.e. the shared form works for all three categories without breaking the public rendering.
- The admin list order (category then sort_order) matches the public page grouping.

(I will visually verify the form, preview, list, and general look myself — no need to drive a browser for those.)

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Do NOT commit. Report anything about the category mapping or Storage policies I should double-check.
