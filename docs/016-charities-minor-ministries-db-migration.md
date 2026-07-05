Refactor the **Charities page** (`/charities`) so the "minor parish ministries" group is rendered from the Supabase `charities` table instead of being hardcoded in the page component. This is prep work for the future admin UI, making all charity content uniformly database-driven.

**Prerequisite (already done):** A migration has been run in Supabase that (1) re-added `parish_minor` to the `charities.category` check constraint, and (2) inserted the three minor ministries (Parish Food Pantry, Thanksgiving Turkey Drive, Packathon) as rows with `category = 'parish_minor'`, their one-line text in `short_description`, and `body`/`external_url`/`photo_url` all null. Read the current `charities` table to confirm before editing.

## What to change

The Charities page currently renders three tiers, but only two come from the database:
- `parish_major` (major ministries) — already from the database
- `external` (external charities) — already from the database
- **minor parish ministries** — currently HARDCODED in the page component as a static list

Change the minor ministries group to render from the database, exactly like the other two groups already do.

## Specifics

1. **Extend the existing data fetch.** The page already queries the `charities` table and splits results by category. Add `parish_minor` to that handling. The single fetch should now produce three groups: `parish_major`, `parish_minor`, and `external`. Filter/split in code by the `category` field, ordered by `sort_order ASC` within each group. (One query, split in code — same pattern already in use.)

2. **Render the `parish_minor` group with its EXISTING visual treatment.** This is important: the minor ministries must look EXACTLY as they do now — the same compact, lighter-weight list treatment (not full cards like the major/external groups). Only the *data source* changes, not the appearance. Each minor item displays its `name` (bold) and its `short_description` (the one-line text). No images per item, no "Learn more" links (their `external_url` is null).

3. **Keep the shared section image hardcoded.** The minor ministries share one section-header image, `CoP_volunteer.jpg` (from Supabase `public-photos`), which currently sits above/around the compact list as the group's header. This stays hardcoded in the page component — it is a section header, NOT a per-item image, so it does not come from the database. Leave it exactly where and how it is.

4. **Remove the now-obsolete hardcoded minor-ministries data.** Delete the hardcoded array/text of the three minor ministries (name + description) from the component, since that content now comes from the database. Do NOT remove the section heading ("Other Parish Ministries We Support" or whatever it currently reads) or the shared section image — only the hardcoded per-item name/description content is replaced by the database render.

5. **Leave the anchor block and closing block alone.** The page's opening anchor block ("Everything begins at Presentation") and closing block ("The work doesn't stop here") are hardcoded page furniture and stay exactly as they are. This change is ONLY about the minor ministries list.

## Verify before stopping

- The Charities page renders identically to before — a visitor sees no visual difference. The three tiers appear in the same order with the same treatments (major full cards, minor compact list, external full cards).
- The three minor ministries (Food Pantry, Turkey Drive, Packathon) now come from the database, in `sort_order` (Food Pantry, Turkey Drive, Packathon = 20, 21, 22).
- The minor group still uses the compact/lighter list style, NOT full cards.
- The shared `CoP_volunteer.jpg` section image still appears as the group header.
- The anchor block and closing block are unchanged.
- No hardcoded minor-ministry name/description text remains in the component.
- Confirm the query handles all three categories cleanly and nothing else on the page regressed.
- No console errors.

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Compare the page against the current live version to confirm it looks identical.
