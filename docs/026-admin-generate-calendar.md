# Admin UI — "Generate Calendar" (roll events forward to a new Columbian year)

Add an admin feature that generates a draft set of next-year events from an existing Columbian year's events, using the same weekday/week-of-year mapping, and lets the admin review/edit them in an on-page table before uploading to the `events` table. This replaces a manual SQL process.

## Placement & navigation

Add a new admin section **"Generate Calendar"**, placed **under the "Calendar PDF" section** in the admin sidebar/nav. Authenticated-admin only (existing route protection). Desktop-oriented (a wide review table is fine — no mobile layout needed).

## Controls (top of page)

- **Source Columbian year** dropdown and **Destination Columbian year** dropdown.
  - Populate both from a range anchored to the current Columbian year: **current − 5 through current + 2**. Use the existing `getColumbianYear()` util (src/lib/utils/columbianYear.ts) to determine "current".
  - Display each as the range label (e.g. "2025–2026").
  - Defaults: **Source = previous Columbian year, Destination = current Columbian year.**
- A **"Generate Events"** button.

## Generate behavior (client-side, results held in state)

On "Generate Events":
1. Read all events from the `events` table whose `starts_at` falls within the **source** Columbian year (Jul 1 source-start-year → Jun 30 following year), in America/New_York.
2. If none found, show "No events found for the selected source year." with an empty table.
3. For each source event, compute the destination event:
   - **Date mapping:** same ISO week number + same ISO weekday, in the destination Columbian year. Preserve the local (America/New_York) wall-clock time of day. (This is the same rule proven previously: e.g. Sat 2025-10-18 → Sat 2026-10-17; Tue 2025-11-25 → Tue 2026-11-24.) Apply this rule to **ALL event types**.
   - **Slug:** regenerate as the source slug with its trailing `-YYYY-MM` (or `-YYYY`) replaced by the destination event's new year/month. Keep it unique-safe (the events table slug is UNIQUE — collisions are handled at upload, see below).
   - **Copy all other fields** from the source event (title, event_type, location_name, location_address, location_map_url, description, ends_at [remapped preserving duration], hero_image_url).
   - **Clear** `signup_url` and `signup_deadline` (blank).
   - **is_published:** default true (see per-row toggle).
   
4. Hold the generated list in component state and render it in the review table below. Nothing is written to the DB yet.

**Note on boundary spillover:** an event in the last ISO week of June can map to early July (outside the destination year). Show whatever the mapping produces — the admin will see the date and can edit or deselect it. No special handling needed.

## Review table (below the controls, after Generate)

One row per generated event. Columns, left to right:

1. **Select toggle** — default ON. If OFF, the row is excluded from upload (used when an event won't recur).
2. **TBC toggle** — default OFF. If ON, the uploaded title is prefixed with `*TBC* ` (literal, note the trailing space). If OFF, title uploads as-is. Do not show the prefix in the title cell — apply it at upload; if a cell already has a `*TBC* ` in the title, the admin will take care of it, don't apply any special logic to handle it.
3. **Title** — show the (source) title. (Display only; editing title text is not required.)
4. **Type** — event_type (friendly label, reuse the existing event-type label mapping from eventTypes.ts).
5. **Start date/time** — an editable date/time picker, in **America/New_York**, pre-filled with the generated start. Edits update the in-state row. (Reuse the same TZ-safe date/time picker pattern the existing Events editor uses — display/edit Eastern, store UTC.)
6. **End date/time** — same, editable, may be empty.
7. **Visible on website** toggle — default ON — sets `is_published` for that row.

The three toggles and the two pickers all mutate the in-memory generated list. No DB writes until Upload.

## Upload

- An **"Upload Events"** button below the table.
- On click: insert all rows whose **Select toggle is ON**, in a single batch, into the `events` table, applying:
  - TBC prefix to title where that row's TBC toggle is ON.
  - The (possibly edited) start/end date-times, converted Eastern→UTC.
  - signup_url / signup_deadline null.
  - is_published per the row's Visible toggle.
  - The generated slug.
- **Slug collision handling:** if a slug already exists (UNIQUE violation), that row fails — do NOT silently skip. After the batch, show a **success/failure summary**: a list of all events, highligthing any that failed with the reason (e.g. "slug already exists"). Use an approach that lets the batch continue past individual failures so one conflict doesn't abort the rest (e.g. insert with conflict reporting, or per-row insert collecting results, while still presenting it as one "Upload" action with a combined summary).
- Writes go through the authenticated admin session under existing RLS (admin-only writes).

## Do NOT
- Do NOT special-case officers/council meetings (no 2nd-Tue/3rd-Wed logic — pure ISO mapping for all).
- Do NOT auto-apply *TBC* (per-row toggle only).
- Do NOT write anything to the DB during Generate — only on Upload.
- Do NOT carry over signup_url/signup_deadline.

Build, verify locally, hard-refresh, stop for review. Do NOT commit.
