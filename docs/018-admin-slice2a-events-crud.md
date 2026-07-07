# Admin UI — Slice 2a: Events Core CRUD

This is the SECOND slice of the admin UI, building on the Slice 1 foundation (auth, route protection, admin shell, RLS — all live and working). Slice 2a builds the **core Events management**: list, create, edit, delete. The Events-specific extras (Duplicate action, page-size selector) come in Slice 2b — do NOT build those here.

The admin shell, sidebar, auth, and route protection already exist and work. This slice fills in the Events section that currently shows a "coming soon" placeholder.

## Before building — read the real schema and existing code

1. **Read the actual `events` table schema** from the codebase / Supabase, and the existing seed file, to confirm exact columns and types. Do not assume — match the real schema. The events table has these columns: `id`, `slug`, `title`, `event_type`, `starts_at`, `ends_at`, `location_name`, `location_address`, `location_map_url`, `description`, `hero_image_url`, `signup_url`, `signup_deadline`, `is_published`, `created_at`, `updated_at`.

2. **Find the existing event-type label mapping.** The public calendar page translates `event_type` enum values (e.g. `council_meeting`) into human-readable labels (e.g. "Council Meeting" / "COUNCIL MEETING"). Locate that existing mapping and REUSE it for the admin dropdown — do not create a second, parallel mapping (they would drift out of sync). If it's not currently a reusable/shared module, refactor it into one shared place that both the public page and the admin form import.

## Field handling

The `event_type` allowed values (from the DB check constraint) are exactly:
`council_meeting`, `officers_meeting`, `volunteer_activity`, `social_event`, `charity_event`, `degree_ceremony`, `other`.

**Form fields to build:**
- **Title** — required text.
- **Event type** — required; a **dropdown** showing the friendly labels (from the existing mapping) and storing the enum value. Must only allow the 7 valid values.
- **Starts at** — required; a date+time picker (writes to `starts_at`, a timestamptz).
- **Ends at** — optional; date+time picker (`ends_at`). May be left empty.
- **Location name** — optional text.
- **Location address** — optional text.
- **Location map URL** — optional text (a link to Google Maps etc.).
- **Description** — optional, multi-line text area.
- **Signup URL** — optional text (link to signup.com / Google Form).
- **Signup deadline** — optional date+time picker (`signup_deadline`).
- **Visible on website** — a clear, prominent toggle mapping to `is_published` (default ON / true for new events). Use the plain-language label "Visible on website", not "published".

**Fields NOT in the form (auto-managed or out of scope):**
- `id`, `created_at`, `updated_at` — auto-managed; never shown.
- `slug` — **auto-generated and hidden from admins entirely.** Generate a URL-safe slug automatically (e.g. from the title) on create, ensuring uniqueness (the `slug` column has a UNIQUE constraint — handle collisions, e.g. append a short suffix, so a save never fails on a duplicate slug). The admin never sees or edits the slug.
- `hero_image_url` — **omit from the form for this slice.** Events image upload is out of scope (image upload arrives in the later Officers slice). Leave `hero_image_url` null on create. Do not build an image field.

## Screens to build

All under the existing protected `/admin` area, using the existing admin shell (sidebar, top bar, gold ADMIN MODE banner).

**1. Events list — `/admin/events`**
- A table listing all events.
- Columns: Title · Event type (friendly label) · Starts at (nicely formatted date/time) · Visible on website (a clear Yes/No indicator or badge).
- **Sort order: by `starts_at`, newest first (descending) by default.** Make column headers sortable (at least by date and title) if reasonable; default is newest-first by date.
- Each row: an **Edit** action (clicking the row or an Edit button navigates to the edit page) and a **Delete** action.
- A prominent **"+ Add New Event"** button at the top.
- (Do NOT add the page-size selector or Duplicate action here — those are Slice 2b. For now, list all events; if the list is very long that's acceptable for this slice, but be mindful the Supabase default 1000-row query limit exists — a simple high `.limit()` is fine for now.)

**2. Create event — `/admin/events/new`**
- The shared event form (see below) with empty fields, "Visible on website" defaulting to ON.
- **Save** (creates the row, auto-generates slug, returns to the list with a success confirmation) and **Cancel** (returns to the list without saving).

**3. Edit event — `/admin/events/[id]/edit`**
- The SAME form component as Create, pre-filled with the event's current values.
- **Save** (updates the row, returns to list with success confirmation) and **Cancel**.
- A **Delete** action with a confirmation dialog ("Delete '[event title]'? This can't be undone.") — never a one-click delete. On confirm, delete and return to the list.

**Shared form component:** Create and Edit must use the SAME form component (empty vs. pre-filled) so they stay identical and there's one place to maintain.

## Quality & safety requirements
- **Validation:** required fields (title, event type, starts at) must be validated before save, with clear plain-language messages indicating what's missing. Don't allow a save that would violate the DB constraints.
- **Sensible input controls:** real date/time pickers for the timestamp fields (not raw text), a real dropdown for event type. `ends_at`, `signup_deadline` optional and clearable.
- **Success/error feedback:** clear confirmation on successful save/delete; plain-language error messages on failure (never raw Supabase errors).
- **Writes go through the authenticated admin session** and are subject to the existing RLS (admin-only writes). Confirm create/edit/delete actually work against the live RLS policies.
- **Timezone care:** `starts_at`/`ends_at` are timestamptz. Make sure the date/time picker round-trips correctly (what the admin enters is what shows on the public calendar) — be careful not to introduce a timezone shift between input, storage, and the public display. Council events are local (US Eastern); verify an entered time displays the same on the public calendar.

## Verify before stopping
- `/admin/events` lists existing events, newest-first by date, with Title / Type (friendly label) / Starts at / Visible columns.
- "+ Add New Event" opens an empty form; saving creates an event (with an auto-generated unique slug, hero_image_url null) and it appears in the list and — if published — on the public `/calendar`.
- Editing an event pre-fills the form, saves changes, and the changes reflect on the public calendar.
- The "Visible on website" toggle works: turning it off removes the event from the public calendar but keeps it in the admin list.
- Delete asks for confirmation and removes the event.
- The event-type dropdown uses the SAME label mapping as the public calendar (verify they match; confirm you reused/shared one mapping).
- Entered times display correctly (no timezone shift) on the public calendar.
- Validation blocks saving without title/type/start, with clear messages.
- Non-admin/logged-out users still cannot reach `/admin/events` (Slice 1 protection intact).
- The public site is unaffected; no console errors.

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Do NOT commit. Report anything about timezone handling or the event-type mapping refactor that I should double-check.
