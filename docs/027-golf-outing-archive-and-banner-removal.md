# kofcwebsite — Remove golf banner + archive the 2026 Golf Outing page

The 2026 Golf Outing is complete. Two cleanup tasks. Building the new /golfouting content is a separate, later prompt — do NOT build it here.

## Task 1 — Remove the sitewide golf announcement banner

Set `SHOW_GOLF_BANNER = false` in `src/components/GolfBanner.tsx` (line 4) — this is the existing kill switch, built for exactly this moment. Do NOT delete the component; it may be reused for a future season's announcement.

Verify: banner no longer renders on any page, and no leftover empty spacing/gap remains where it used to sit in the layout.

## Task 2 — Archive the current /golfouting page

Establish and apply this convention: archived event pages live under `src/app/(public)/archive/<event-slug><year>/`. This is the first one: `archive/golfouting2026`. Future years follow the same pattern (e.g. `archive/golfouting2027`).

- `git mv` the current golf outing page folder from `src/app/(public)/golfouting/` to `src/app/(public)/archive/golfouting2026/`. Preserve ALL content exactly as-is — text, images, QR codes, Google Form links, brochure PDF link. This is a relocation, not a content edit (next year it'll be duplicated and only dates/details changed).
- The archived page keeps the normal public layout/chrome (header, footer) — it's just not linked from any navigation. Same "reachable by direct URL only" pattern as `/admin`, but with no auth — it's unlinked, not protected.
- Add a `noindex` meta robots tag to the archived page so search engines don't keep surfacing a dated event announcement.
- Search the codebase for hardcoded references to `/golfouting` or `golfouting` (nav, footer, homepage, sitemap generator if one exists) and check each:
  - The footer's "Golf Outing" link should stay pointing at `/golfouting` (unchanged) — that route will hold new content shortly.
  - Any reference that assumed the OLD page's content lives at `/golfouting` should be flagged, not silently changed.
  - If a `sitemap.ts`/sitemap generator exists, exclude `/archive/*` paths from it.
- Do NOT create a redirect from `/golfouting` to the archive. Leave `/golfouting` with no page for now (a new page is coming in the next prompt). If removing the folder causes a build error from an empty route segment, report it rather than papering over it with a placeholder.
- No action needed on the `presentationgolfouting.com` domain — that's a DNS/Vercel-level mapping to the `/golfouting` path, unaffected by this code change.

## Verify (non-obvious only — visuals I'll check myself)
- `npm run build` / `tsc` / lint clean after the move (no orphaned imports from the old path).
- Confirm via `git status`/`git log` that this was a tracked move, not a delete+recreate (preserves file history).
- Confirm nothing else in the repo still assumes `/golfouting` serves the 2026 event content (report anything found).
- Confirm the archived page's images/forms/PDF links still resolve correctly from the new path.

Build, verify locally, stop for review. Do NOT commit.
