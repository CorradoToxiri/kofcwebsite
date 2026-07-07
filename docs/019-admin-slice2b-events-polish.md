# Admin UI — Slice 2b: Events Polish (Duplicate, Page-Size Selector, Row Alignment Fix)

This is the final Events slice, adding polish on top of the working Events CRUD from Slice 2a. Three items: a Duplicate row action, a page-size selector on the events list, and a fix for a row/button vertical-alignment bug. All work is on the admin events list and the create/edit flow — do not touch auth, RLS, or other sections.

## 1 — Duplicate row action

Add a **Duplicate** action button to each row in the events list (`/admin/events`), alongside the existing Edit and Delete buttons.

Clicking Duplicate opens the **Create event** form (the same `/admin/events/new` form), **pre-filled** with the source event's values, EXCEPT the following fields, which must be left **blank/empty**:
- `starts_at` (start date/time) — blank
- `ends_at` (end date/time) — blank
- `signup_url` (signup link) — blank
- `signup_deadline` — blank

All other fields carry over from the source event: `title`, `event_type`, `location_name`, `location_address`, `location_map_url`, `description`, and the `is_published` / "Visible on website" value.

Important:
- The duplicate is NOT saved automatically — it opens the pre-filled Create form so the admin reviews it, sets the new date(s), and saves manually. It's a create, not an instant copy.
- On save, a **fresh unique slug** is auto-generated (same auto-slug logic as any new event — the admin never sees or sets the slug). The source event's slug must NOT carry over.
- The four blanked fields being empty is intentional (they're specific to each occurrence); the required-field validation still applies, so the admin must set a start date before saving (that's expected and correct).

Implementation note: the simplest robust approach is to pass the source event's data into the Create form pre-filled, with the four fields cleared — e.g. via a "duplicate from" query param or equivalent. Use whatever mechanism fits the existing create/edit form cleanly. Do not create a separate third form; reuse the existing shared event form.

## 2 — Page-size selector on the events list

Add a page-size selector to the events list with options **20 / 50 / All**, defaulting to **50**.

- Default view shows 50 events (newest-first by `starts_at`, as already implemented).
- **"All" must handle the Supabase default 1,000-row query limit** — Supabase caps queries at 1,000 rows unless explicitly overridden. For "All", set an explicit high limit (or paginate) so every event is returned even if there are more than 1,000. (The council won't have 1,000+ events for years, but handle it correctly so it never silently truncates.)
- Keep it simple: this can be a straightforward client-side or server-side page-size control; full pagination with page numbers is NOT required — just the ability to show 20, 50, or all events. If 20 or 50 is selected and more exist, showing the first N (newest) is fine; the selector is primarily about not rendering a huge list by default.

## 3 — Fix the row / action-button vertical alignment bug

There is a vertical-alignment bug in the events list table, visible when the browser window is narrow enough that cell text wraps to multiple lines.

**Symptom:** When a row's content wraps to 2-3 lines (narrow window), the row grows taller, but the Edit/Delete action buttons stay anchored near the TOP of the row instead of being vertically centered. This makes the buttons visually misalign with their row — e.g. the buttons appear up near the row's first line while the row extends well below them. On a wide window (single-line rows) the problem isn't visible because all rows are the same height. There's also a related inconsistency where the action column's row dividers don't line up with the rest of the table's row boundaries.

**Fix:** Make the action-button cell/column vertically center its content within the row, and ensure all cells in a row share consistent vertical alignment, so the Edit/Delete/Duplicate buttons stay centered regardless of how tall the row grows from wrapped text. Inspect the actual events-list markup first to determine whether it's a real HTML `<table>` (use `vertical-align: middle` on the cells) or a CSS grid/flex layout (use `align-items: center` on the row) — apply the correct mechanism for the actual structure. The row dividers should align across all columns including the actions column.

After the fix, the Edit/Delete/Duplicate buttons should remain vertically centered against their row at ALL window widths, including narrow widths where titles/types/dates wrap to multiple lines.

## Verify before stopping (only the non-obvious checks — I'll test the UI visually myself)
- Duplicate produces a NEW event on save with a fresh unique slug (the source slug is not reused, and saving a duplicate of an event with the same title does not fail on the slug UNIQUE constraint).
- The four blanked fields (start, end, signup_url, signup_deadline) are genuinely empty in the pre-filled duplicate form, while the other fields carry over.
- "All" page size returns every event even if the count were to exceed the Supabase 1,000-row default limit (confirm the limit override is in place).

(I will visually verify the button alignment at various widths, the page-size selector behavior, and the general look myself — no need to spin up a browser to check those.)

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Do NOT commit.
