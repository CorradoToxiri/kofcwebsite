Fix a **mobile-only horizontal overflow** on two pages: the Donate page (`/donate`) and the Golf Outing page (`/golfouting`). On phones (iPhone 13, ~390px viewport), the white cards extend past the right edge of the page background — every card overflows by roughly the same amount, there is horizontal scrolling, and the page background shows through on the right side of the cards.

**Important context about the cause:** ALL cards on these pages overflow by a consistent amount — including cards with no long text (the "By Check" card on Donate and the "Example Payment" card on Golf Outing). Because cards with completely different content all overflow equally, this is a **container/layout problem, not a content problem.** Do not assume it's caused by any single piece of text. The most likely culprit is a card-pair section (the two-column card layouts) whose grid/flex container is not collapsing to a single column on mobile, or has a fixed/min width, negative margin, or `100vw`-type width that exceeds the viewport. Both pages recently got new two-card sections (the Zelle/By-Check pair on Donate, the Pay-with-Zelle/Example-Payment pair on Golf Outing), so inspect those layouts first.

## Step 1 — Diagnose (do this before editing)

Inspect the actual layout/CSS of the card sections on both pages and identify the real source of the horizontal overflow at mobile width. Check specifically for:
- A two-column grid or flex row that does not collapse to one column at small breakpoints
- Any fixed `width`, `min-width`, `100vw`, or negative margins on the cards or their containing section/row
- Any element with `white-space: nowrap` or a wide unbreakable child forcing a min-width
- Padding/margin math that makes a full-width section compute wider than the viewport

Identify which of these is actually causing it before making changes — the fix should target the real cause, not a guess.

## Step 2 — Fix the overflow (mobile only)

Apply the fix that addresses the real cause found in Step 1. The end state must be: on a 390px viewport, all cards on both pages fit fully within the screen with the normal page side padding, no horizontal scrolling, no background gap on the right. Typically this means ensuring the card-pair containers collapse to a single column on mobile and that cards use `max-width: 100%` / fluid widths rather than fixed widths.

**Do NOT change the desktop or tablet layout.** On desktop both pages render correctly, even at minimum browser width. Scope the fix to small/mobile breakpoints so desktop/tablet remain visually identical to now.

Do NOT change the QR code images, the example-payment screenshot, or their aspect-ratio handling — they are not the cause.

## Step 3 — Shrink the recipient email on mobile (separate, explicit requirement)

Independently of the overflow fix: on mobile, the long recipient email `kofc6033@churchofpresentation.org` (in the Zelle "Pay with Zelle" cards on both pages) should be made to fit on a SINGLE line by **reducing its font size on small screens** — do NOT let it wrap to two lines, and do not let it clip. Keep it on one line, just smaller on mobile. On desktop its size stays as-is.

## Constraints

- Desktop and tablet rendering must remain pixel-identical to current.
- Apply fixes consistently across both pages. If the card sections share a component, fix once; if separate, apply the same fix to both.
- Don't change text content, headings, or which cards appear — only the layout/sizing needed to fix the overflow and the mobile email size.

## Verify before stopping

- On 390px (iPhone 13): every card on both Donate and Golf Outing fits fully within the screen — no overflow, no horizontal scroll, no right-side background gap
- This holds for ALL cards, including "By Check" (Donate) and "Example Payment" (Golf Outing), not just the Zelle cards
- The recipient email stays on ONE line on mobile (shrunk, not wrapped, not clipped)
- QR code and example screenshot images are unchanged and undistorted
- Desktop and tablet layouts are visually unchanged from before
- Test at 360px, 390px, 768px, and desktop to confirm
- No console errors

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
