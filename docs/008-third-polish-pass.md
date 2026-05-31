# Third Polish Pass — verified numbers & charter card

A short content pass to replace the remaining placeholders with verified data from the officers, plus a fix to the homepage charter card. All changes are content/asset swaps — no new features, no layout restructuring.

Build, verify locally with `npm run dev`, hard-refresh to clear `.next` cache, and stop for review.

---

## 1 — Replace the charity total placeholder with $31K (four locations)

The verified total raised/donated for charity in 2025 is **$31,000**, displayed in the compact format **$31K** to match the existing stat-card design. Replace the `$--K` placeholder with `$31K` in all of these locations:

- **Homepage hero stats strip** — "Raised for charity in 2025" card
- **Homepage Four Pillars section** — the Charity pillar card subtitle ("$--K given in 2025" → "$31K given in 2025")
- **Homepage 2025 Impact section** — the "Donated to charity this year" card
- **Homepage history milestones** — the "2025" milestone line ("$--K raised for charity" → "$31K raised for charity")
- **About page history milestones** — the matching "2025" milestone line (same change)

Use `$31K` consistently in all five spots.

## 2 — Volunteer hours stat (homepage 2025 Impact section)

The exact volunteer-hours figure isn't available. Update the "Volunteer hours logged" card in the 2025 Impact section as follows:

- Change the main stat value from `--` to the text **"Hundreds"** (or render "Hundreds of volunteer hours logged" as the card's primary text if that fits the card layout better — use your judgment to make it read cleanly within the existing card design)
- **Remove** the subtitle line "// reported to Supreme, Form 1728" entirely

The goal is for the card to read naturally as "Hundreds of volunteer hours logged" without referencing the specific reporting form.

## 3 — Covenant House Newark donation stat (homepage 2025 Impact section)

Replace the `$--K` placeholder in the "Donated to Covenant House Newark" card with **$2,000** (render as `$2K` if matching the compact card format used by the other cards, or `$2,000` if the card has room — match whichever format looks most consistent with the adjacent cards in that section).

The subtitle "// Covenant House Newark · 2025" stays as-is.

## 4 — Homepage charter card

The homepage "A short history" area includes a charter card that currently displays placeholder text "PHOTO_07 · CHARTER_1968" where an image should be.

Make these changes:

- **Replace the placeholder image** with a Knights of Columbus emblem as a temporary stand-in. Use an existing emblem asset already in the project. Prefer a version that displays well on a light/card background — if a non-reversed emblem asset exists (e.g., `kofc-emblem.png` or similar), use that; otherwise use the available emblem (`kofc-emblem-reversed.png`) on whatever background makes it legible.
- **Remove** the visible placeholder text "PHOTO_07 · CHARTER_1968" entirely.
- **Keep** the existing caption text exactly as-is: "Original charter signed by Supreme Knight John W. McDevitt // council archive · framed in hall".

This is a temporary stand-in; a real charter photo will replace the emblem later.

---

## Verify before stopping

- `$31K` appears in all five locations (hero, charity pillar, 2025 impact, home milestone, about milestone) and nowhere still shows `$--K`
- The volunteer-hours card reads "Hundreds of volunteer hours logged" with no Form 1728 reference
- The Covenant House card shows $2,000 / $2K
- The charter card shows an emblem image, no "PHOTO_07" text, caption intact
- No `$--K` or `--` placeholders remain anywhere on the homepage or About page
- Mobile viewport (390px) layout still intact for the 2025 Impact cards and charter card
- No console errors, no new 404s
