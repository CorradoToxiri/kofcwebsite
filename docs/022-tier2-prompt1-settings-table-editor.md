# Admin UI — Tier 2, Prompt 1: Site Settings table + admin editor

This begins Tier 2 of the admin UI: making a curated set of variable site-wide text values editable. This is the FIRST of three prompts:
1. **(this one)** Create the `site_settings` table, seed it with current values, and build the admin Settings editor. **This does NOT touch any public page** — the public site keeps showing its current hardcoded values afterward.
2. (next) Wire the public pages to read from `site_settings`.
3. (later) Add the auto-calculating year formulas.

Because this prompt has ZERO public impact, it can be built and verified in isolation: you'll be able to edit settings in the admin and confirm they save, with no change to the live site.

## Part 1 — Create the `site_settings` table

Create a simple key-value table for site-wide editable settings. Suggested structure:

```
create table public.site_settings (
  key text primary key,
  value text not null,
  label text not null,          -- human-friendly label shown in the admin editor
  section text not null,        -- grouping in the editor: 'annual_figures' | 'national_stats' | 'grand_knight'
  sort_order integer not null default 0,  -- display order within its section
  updated_at timestamptz not null default now()
);
```
Add an updated_at trigger consistent with the other tables (the project uses a `set_updated_at` trigger function). Enable RLS with the SAME pattern as the other content tables: public/anon can SELECT (the public pages will read these in the next prompt), and only authenticated admins (`is_admin()`) can UPDATE. INSERT/DELETE are not needed by the app (settings are a fixed set seeded here) — restrict writes to admin UPDATE only, or admin-all; do not allow anon writes.

## Part 2 — Seed the table with EXACT current values

**Read the actual current values from the page code** (Home, About, Charities, Donate, Join) and seed the table with those exact strings, so that when the public pages are later wired up (prompt 2), NOTHING changes visually. The table must launch holding precisely what the site shows today.

Seed these settings (read the real current string for each from the code; the values below are what I observed but VERIFY against the code and use the code's exact strings):

**Section: annual_figures**
- `reporting_year` — "2025" — label "Reporting year (for charity/impact figures)"
- `charity_raised` — "$31K" — label "Raised for charity"
- `annual_dues` — "$40" — label "Annual member dues"
- `active_members` — "100+" — label "Active members"
- `covenant_house_donation` — "$2K" — label "Covenant House donation" (NOTE: the site currently shows this as both "$2K" in the impact stat and "$2,000" in the Covenant House card body — UNIFY to "$2K" for both; this one setting will be used in both places in prompt 2)
- `volunteer_hours` — "Hundreds" — label "Volunteer hours logged"
- `new_brothers` — "7" — label "New brothers welcomed"
- `fourth_degree_knights` — "20" — label "Fourth Degree Knights"
- `parish_events_per_year` — "12" — label "Parish events per year"
- `charities_supported` — "10+" — label "Charities/organizations supported"

**Section: national_stats**
- `national_donated` — "$193M" — label "KofC national — donated"
- `national_service_hours` — "47.5M" — label "KofC national — service hours"

**Section: grand_knight**
- `grand_knight_quote` — (read the exact current Grand Knight quote text from the homepage) — label "Grand Knight quote"

If, while reading the code, you find the observed value differs from what's listed above, use the CODE's actual value and note the discrepancy in your summary. If you find additional reused variable values I may have missed on those five pages, list them in your summary (do NOT add them as settings yet — just flag them for me to decide).

Provide the seed as a SQL file (`docs/022-site-settings-seed.sql`) for me to run in Supabase Studio, consistent with this project's manual-SQL workflow — do NOT apply it via code. (You may create the table in the same SQL file or a separate one — your call, just make it clear what I run.)

## Part 3 — Build the admin Settings editor

Add a **Settings** section to the admin UI, following the established admin patterns (same shell, same styling, plain-language, save confirmation).

- **Add "Settings" to the admin sidebar** as a new item after Charities (Dashboard / Events / Officers / Charities / Settings). Use a sensible icon.
- **Route: `/admin/settings`** — a SINGLE page (not a list/CRUD — this is a fixed set of fields, edited in place).
- The page reads all `site_settings` rows and renders them as **free-text input fields**, grouped into sections by the `section` column, with a heading per section:
  - "Annual Figures"
  - "National Statistics"
  - "Grand Knight Quote" (this one is a multi-line textarea, since it's a quote)
- Each field shows its friendly `label` and current `value` in an editable text input (textarea for the quote). Fields ordered by `sort_order` within each section.
- A **Save** button that writes changes back to `site_settings` (UPDATE by key). Show a clear success confirmation on save.
- Because these values appear on the public site, add a brief, subtle helper note near the top or the save button, e.g.: "These values appear on the public website. After saving, use Preview to check how they look." (Light-touch reminder — NOT a validation system. Values are free text; the admin types exactly what should appear.)
- No per-field validation beyond "not empty" for required values — free text is intentional (values like "Hundreds" and "100+" aren't plain numbers).

## What NOT to do in this prompt
- Do NOT modify any public page (Home/About/Charities/Donate/Join). They keep their hardcoded values for now — wiring them up is the NEXT prompt. This prompt is admin-only + the table/seed.
- Do NOT build the year-calculation formulas (that's prompt 3).
- Do NOT add settings for values that are being auto-calculated later (years-serving, copyright year) — those are not settings.

## Verify before stopping (only the non-obvious checks — I test the UI myself)
- The `site_settings` RLS matches the established pattern: anon can SELECT, only admin can UPDATE, anon cannot write.
- The seed values read from the actual page code match what's currently live (so the future wire-up causes no visual change) — note any value where the code differed from my list.
- Saving a setting in the editor actually persists to the DB (UPDATE by key works under admin RLS).
- The public site is completely unchanged by this prompt (no public file touched).

(I will visually verify the Settings page layout, grouping, and fields myself.)

Build, verify locally with `npm run dev`, hard-refresh, and stop for review. Do NOT commit. In your summary: confirm the exact seeded values (flag any that differed from my list), and list any additional reused variable values you noticed on the five pages that I might want to add later.
