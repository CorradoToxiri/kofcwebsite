# Admin UI — Tier 2, Prompt 4: Annual Calendar PDF generator

Add an admin feature to generate a printable annual calendar PDF from the events table, for a selected Columbian year. Two output actions: download to the admin's machine, and publish (overwrite the public downloadable calendar file). Lives in the admin UI.

## Generation approach

Use **@react-pdf/renderer** for server-side PDF generation (reliable on Next.js/Vercel serverless — pure JS, no headless-browser/Chromium dependency). Generate via a server route/action, not client-side.

## Where it lives

Add to the admin UI — either a new "Calendar PDF" sub-section, or a panel on an existing admin page (your judgment; keep consistent with the admin shell/styling). Reachable by an authenticated admin only (existing route protection).

## Controls

- A **Columbian year picker**: admin picks the start year (e.g. 2026); the range is auto-set to **Jul 1 (start year) – Jun 30 (start year + 1)**. Default the picker to the current Columbian year using the existing `getColumbianYear()` util logic (src/lib/utils/columbianYear.ts) — i.e. default to the year range that's current as of today.
- Two action buttons:
  - **Download PDF** — generates and downloads the file to the admin's machine. No effect on the public site.
  - **Publish to site** — Uploads and OVERWRITES the current public downloadable calendar file in Supabase Storage (see storage note). Use a confirmation step before overwriting ("This will replace the calendar that visitors download. Continue?").

## Content / data

- Include only **published events** (`is_published = true`) with `starts_at` within the selected Jul 1 – Jun 30 range.
- Order chronologically.

## Layout (keep it simple/clean — NOT a replica of the old styled PDF)

- Title header: Knights of Columbus + Logo, council name + "Calendar" + the Columbian year range (e.g. "Presentation Council #6033 — Calendar 2026–2027").
- Subtitle: Council Meetings are on the 3rd Wed of the Month - 7:30pm at the Church
- **Group events by month**, with a month heading (e.g. "September 2026"), events listed by date under each month.
- Each event line: date (e.g. "Wed Sep 16"), event title. 
- Months with no events can be omitted (summer months are usually empty — don't print empty month headings).
- Two-column format to have all months in one single page.
- Clean, readable, printable on standard letter paper. No need to match the existing KofC6033_Calendar.pdf styling.

## Storage note (for "Publish to site")

**Detect the current downloadable calendar file's exact storage path/filename and the public download link before wiring publish** — do NOT assume. Find where the current "download annual calendar (PDF)" button points (likely a file in a Supabase Storage bucket), and have "Publish to site" overwrite that same file (upsert) so the existing public download link serves the new PDF without any link change. Report the path you found.

## Do NOT
- No TBD/approximate-date handling — all events have real dates.
- Do NOT change the public download button/link itself (just overwrite the file it already points to).
- Do NOT include unpublished events.

## Verify (non-obvious only)
- Date-range filter is correct: an event on Jun 30 (end year) is included, Jul 1 (end year) is excluded; an event on Jul 1 (start year) is included.
- "Publish" uploads a new file and overwrites the correct existing file (report the detected path) and the existing public download link serves the new file with no link change.
- Only published events appear.
- PDF generates without serverless errors (confirm @react-pdf/renderer works in the deployed/runtime environment, not just locally — note any Vercel runtime concerns).

Build, verify locally, hard-refresh, stop for review. Do NOT commit. Report the detected storage path for the current calendar file.
