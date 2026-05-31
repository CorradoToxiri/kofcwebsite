Build a new **Golf Outing** page at `/golfouting`, plus a site-wide **seasonal announcement bar** that links to it. This surfaces the 2026 Presentation Golf Outing — the council's biggest annual fundraiser.

All content is hardcoded in the page component — nothing from the database. Registration happens through external Google Forms (linked, with QR codes) and a downloadable PDF brochure; this page does NOT collect registrations itself.

---

## Part 1 — Seasonal announcement bar (site-wide)

Add a slim, full-width announcement bar that appears on every page, positioned directly below the main site header (above the page content).

- **Style:** A thin band in the site's navy or gold (pick whichever reads well and stays legible — gold band with navy text, or navy band with gold/white text). It should feel distinct from the header but harmonious with it. Keep it slim (single line on desktop).
- **Content:** "⛳ The 2026 Presentation Golf Outing — Monday, September 14 at Darlington. Register today →"
- **Link:** The whole bar (or the "Register today →" portion) links to `/golfouting`.
- **Mobile:** The text may shorten gracefully on narrow screens (e.g., "⛳ 2026 Golf Outing — Sept 14. Register →") but must remain tappable with an adequate tap target.
- **Important — make it easy to disable:** Implement the bar so it can be turned off with a single, obvious change after the outing passes (e.g., a boolean constant like `SHOW_GOLF_BANNER = true` in one place, or a single component include that can be commented out). Add a brief code comment noting it's a seasonal banner to be disabled after Sept 14, 2026.

Do NOT add a third orange button to the header nav — the announcement bar is the chosen approach specifically to avoid competing with the Join and Donate buttons. Also add a "Golf Outing" link to the site footer (in a sensible column) so the page remains reachable even after the seasonal bar is eventually removed.

## Part 2 — The Golf Outing page (`/golfouting`)

### Banner
Full-width banner image: `Activities_signature2.jpg` (from Supabase `public-photos` bucket). Overlay a title and date line with a legible scrim/gradient:
- Title: "The 2026 Presentation Golf Outing"
- Subtitle: "Monday, September 14, 2026 · Darlington Golf Course, Mahwah"

### Inspirational lead text
A prominent intro paragraph below the banner:
> Come join us for a great day of golf! Since our first outing in 2000, the Presentation Golf Outing has distributed over $500,000 to worthy charities — funding our Parish Food Pantry, the Medical Mission in Haiti, Covenant House, the Thanksgiving Turkey Drive, parish youth activities, our local Ambulance Corps, and many others. It's our biggest day of the year: a beautiful course, good-natured competition, old friends and new, and a casual dinner to cap it off — all for causes that reach thousands of families across Bergen, Rockland, and Orange Counties.

### "The day at a glance" details block
A clean, simple details block (NOT a heavy card grid). Include ONLY these three items — do not add price or a detailed hour-by-hour schedule:
- **When:** Monday, September 14, 2026
- **Where:** Darlington Golf Course, 277 Campgaw Road, Mahwah, NJ
- **Dinner:** Casual dinner with beer and wine at The Mason Jar

### Registration — two paths side by side
Two parallel panels (stack on mobile), visually balanced:

**Panel 1 — Register to Play**
- Heading: "Register to Play"
- Line: "Grab your foursome — or sign up solo and we'll pair you up."
- A primary button: "Golfer Registration →" linking to `https://forms.gle/LnauYv1wJyNPVLsu9` (open in new tab, `rel="noopener noreferrer"`)
- Below the button, display the QR code image `QR_Code_GolferRegistration2026.jpg` at a scannable size (~160-200px), with a small caption like "Scan to register"

**Panel 2 — Become a Sponsor**
- Heading: "Become a Sponsor"
- Line: "Support the cause and reach 4,000+ families through our parish bulletin. Sponsorship levels from Hole Sponsors to Diamond."
- A primary button: "Sponsor Registration →" linking to `https://forms.gle/tUcrqw3ENENr4QzP6` (open in new tab, `rel="noopener noreferrer"`)
- Below the button, display the QR code image `QR_Code_SponsorRegistration2026.jpg` at the same scannable size, with "Scan to sponsor"

### Download the brochure
A secondary button: "Download the Brochure (PDF)" linking to:
`https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/documents/KOC%20Golf%20Outing%20Brochure%202026.pdf`
Open in a new tab. Add a small note beside/below it: "Prefer to register by mail? The brochure has a printable form."

### Contact line
A simple closing line (not a heavy card):
> Questions? For sponsorships, contact Sean Farley at (201) 286-7206. For golf, contact Ed Dowd at (201) 787-9385. Or email us at kofc6033@churchofpresentation.org.

Make the email a `mailto:` link.

---

## Design notes

- Keep the site's visual DNA (navy/gold, Source Serif 4 headings, Source Sans 3 body, existing spacing). Use the standard breadcrumb if other pages have one (Home / Golf Outing), though the banner may serve as the page header here — use judgment so it doesn't feel redundant.
- All images via Next.js `<Image>`. Supabase `public-photos` domain should already be in `next.config.ts` remotePatterns.
- The QR codes are images to be displayed (and scanned), not links.
- This page has a celebratory, inviting tone — it's a fundraiser people should *want* to attend.

## Verify before stopping

- The announcement bar appears on every page, below the header, linking to `/golfouting`
- The bar can be disabled via a single clearly-marked change (verify the mechanism exists and is commented)
- No third orange button was added to the header
- A "Golf Outing" link exists in the footer
- The `/golfouting` page renders: banner with overlaid title/date, lead text, the 3-item details block (no price, no schedule), two registration panels with working external form links AND visible QR images, the brochure download button, and the contact line
- Both Google Form links open in a new tab
- Both QR code images load and are large enough to scan
- The brochure PDF link opens (mind the %20-encoded spaces in the filename)
- The mailto link works
- Mobile (390px): banner legible, panels stack, QR codes remain scannable, announcement bar shortens gracefully
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
