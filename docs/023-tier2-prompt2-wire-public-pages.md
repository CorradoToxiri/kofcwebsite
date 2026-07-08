# Admin UI — Tier 2, Prompt 2: Wire public pages to site_settings

Second of three Tier 2 prompts. Prompt 1 created/seeded the `site_settings` table and built the admin editor. This prompt replaces the hardcoded values on the public pages with reads from `site_settings`. The seed holds the exact current strings, so **the site must look visually identical after this change** — the goal is a pure source swap, no visual change.

## Scope

Replace hardcoded values with `site_settings` reads on: Home, About, Charities, Donate, Join. Each setting is read from the DB (anon SELECT is already allowed) and rendered where its hardcoded string currently sits.

Settings and where they map (verify exact locations against the code — these are the known occurrences):

- `charity_raised` ($31K) — Home (hero, charity pillar, 2025 impact, milestone), Charities (top strip "Raised in 2025"), Donate (two spots)
- `annual_dues` ($40) — Donate (3 spots), Join (2 spots)
- `reporting_year` (2025) — every label tied to the charity/impact figures ("in 2025", "Raised in 2025", "Our 2025 impact", milestone year, About pillar "in 2025")
- `active_members` (100+) — Home, Join (2 spots), AND PillarsGrid.tsx
- `covenant_house_donation` ($2K) — Home impact stat ONLY (see note below)
- `volunteer_hours` (Hundreds) — Home impact
- `new_brothers` (7) — Home impact
- `fourth_degree_knights` (20) — Home
- `parish_events_per_year` (12) — Home
- `charities_supported` (10+) — Charities top strip
- `national_donated` ($193 million) — About pillar
- `national_service_hours` (47.5 million) — About pillar
- `grand_knight_quote` — Home

## Two specific items

**1. Fix the 100/100+ drift.** PillarsGrid.tsx currently reads "100 brother knights" (no +) while everywhere else is "100+". Wire BOTH to `active_members` so they agree. After this, the value comes only from the setting.

**2. Covenant House — stat only, NOT the card body.** Wire ONLY the Home impact stat to `covenant_house_donation`. Do NOT touch the "$2,000" in the Charities card body — that text lives in the `charities` table `body` column (already admin-editable) and is intentionally left as-is. Leave it alone.

## Reading pattern

These pages are largely server components; read `site_settings` server-side (single query, map by key) and pass values down. Avoid N separate queries — fetch all settings once per page and look up by key. If a shared helper (e.g. `getSiteSettings()`) is cleaner for reuse across the five pages, create one.

## Do NOT
- Do NOT change any value's displayed string (seed = current values; no visual change).
- Do NOT build the year-calculation formulas (that's prompt 3) — leave "58 years"/copyright hardcoded for now.
- Do NOT touch the Covenant House charity card body, referral number, promo code, or membership contact block (staying hardcoded per decision).

## Verify (non-obvious only — I check visuals myself)
- Every page still renders the identical strings it showed before (diff should be source-only, not visual).
- All five pages fetch settings without N+1 queries (one settings fetch per page or a shared cached helper).
- `active_members` now drives BOTH the "100" PillarsGrid spot and the "100+" spots — no remaining hardcoded member count.
- Editing a value in the admin Settings editor now changes it on the corresponding public page(s) — confirm the full round-trip works for at least `charity_raised` (appears in the most places) and `reporting_year`.
- No hardcoded occurrence of a wired value remains (grep for "$31K", "100+", "2025", etc. — flag any stragglers not converted).

Build, verify locally, hard-refresh, stop for review. Do NOT commit. Report any hardcoded occurrences you found that weren't in my mapping list.
