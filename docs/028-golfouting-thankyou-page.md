# kofcwebsite — Build the new /golfouting thank-you page

Prompt 027 archived the 2026 event page to `src/app/(public)/archive/golfouting2026/` and left `/golfouting` empty. This prompt fills `/golfouting` with a thank-you/recap page for the completed 2026 outing. This is now the live, indexed page (no noindex) — it's what sponsors and golfers see when they follow up via `presentationgolfouting.com`.

Source facts, images, and copy tone from the archived page at `src/app/(public)/archive/golfouting2026/` — don't re-invent them.

## Page sections, in order

1. **Hero** — reuse the existing banner image (`Activities_signature2.jpg`, same asset as the archived page). Overlay copy:
   - Title: "Thank You — 2026 Presentation Golf Outing"
   - Subtitle: "Monday, September 14, 2026 · Darlington Golf Course, Mahwah"

2. **Thank-you / recap body** — pull from the archived page's facts:
   - Date, venue (Darlington Golf Course, 277 Campgaw Road, Mahwah, NJ), dinner (The Mason Jar)
   - Impact line: over $500,000 distributed to charities since the outing began in 2000
   - Beneficiaries: Parish Food Pantry, Medical Mission in Haiti, Covenant House, Thanksgiving Turkey Drive, parish youth activities, local Ambulance Corps, organizations supporting abused women and single mothers, Lighthouse pregnancy services, and others
   - Close with a thank-you to golfers and sponsors for supporting the cause
   - Link to `/charities`: "See what your support makes possible →"

3. **Sponsor recognition** — six tiers, in this order, each a subheading followed by a name list. Preserve the exact names and exact order given below within each tier — do NOT re-alphabetize or re-sort.

   **Gold Sponsor**
   Inserra Supermarkets

   **Silver Sponsor**
   Ed and Donna Dowd

   **Bronze Sponsors**
   Darren L. Hugo, CFP - The Meridian Group; Horton Family; Martha & Rick; Mary Lynch; Mike and Julie O'Brien; Sterling Affair – Peter Fazio

   **Outing Partners**
   Bobby and Carol Williams; Charlie Miraglia, KofC Insurance Agent; Downes Tree Service; Gregg Romanzo; Guy Gaudenzi's Golfing Buddies; K2 Physical Therapy; Kevin R. Birdsall CPA, LLC; Presentation Men's Wednesday 6:00am; Terrie O'Connor Realtors / Sean Farley; Wannamaker & Carlough Funeral Home

   **Friends of the Knights**
   Bill and Margaret Pangert, In Memory of Bill; Blue Hill Golf Course; Corrado & Giovanna Toxiri; Driscoll Foods; Paramus Golf Course; Presentation Men's Cornerstone Team; PSC / Professional Security Consultants Inc.; Old Tappan Golf Course; Spook Rock Golf Course

   **Hole Sponsors**
   Allendale Bar & Grill; Becker Funeral Home; Bergen Tire of Mahwah; Bon Venture Services, LLC; Brady's at the Station; Carol Reilly-McDermott; Cutler Wealth Planning; Dark Star Electric; Dave Powers; Ditomaso Landscape Group; Donna and Ed Kennedy; ECI Edmonds Contracting Inc.; Friends of Nova Hope for Haiti; Gene Boyle; In Memory of Connie D'Angelo; Jim & Terri McKeown; Jimmy the Junk Man, LLC; Kay and Jack Julian; Lawrence & Jacqueline McGee; Mahwah Bar and Grill; Mahwah Sunoco; Matt & Gerry Harold; Matthews Colonial Restaurant; Maureen and Brian Murphy; McPeek's Garage; Mercedes-Benz of Paramus; Northern New Jersey Title Services; Reno's Appliance Paterson, NJ; Rosemary and Barry Ervin; Schreiber Foods International Inc.; Silex Financial Group, Inc.; Spring Street Cleaners; The Corcoran Law Group, LLC; The Mahoney Group at Raymond James; Thomas Napolitano; Ulrich, Inc.; Valley Diagnostic Medical Center; Van Emburgh-Sneider-Pernice Funeral Home; Vince & Roseann Barra; Vince Giovinco; Wells, Jaworski & Liebman, LLP

   Layout: plain text lists, no cards, no links on sponsor names (these are personal/business names, not all have a URL to point to — don't guess one). Gold/Silver/Bronze stay single-column (short tiers). Outing Partners, Friends of the Knights, and Hole Sponsors use a multi-column layout on desktop (CSS columns, 2–3 depending on width) so the page doesn't turn into one long single-column scroll; collapse to single column on mobile.

4. **Closing section** — soft close, no registration links or QR codes (the event is over, don't carry those forward from the archived page):
   - A generic forward-looking line with no specific date: something like "Interested in next year's outing? Watch this page for details, or reach out below."
   - Contact line (same as archived page): "Questions? For sponsorships, contact Sean Farley at (201) 286-7206. For golf, contact Ed Dowd at (201) 787-9385. Or email us at kofc6033@churchofpresentation.org."

## Implementation notes

- New page at `src/app/(public)/golfouting/` — normal public layout/chrome, normal indexing (no noindex — this is the current live page, unlike the archive).
- Hardcoded content, same pattern as the archived page — no Supabase queries needed.
- Reuse existing page patterns/components (hero, content sections) from elsewhere on the site rather than inventing new ones.
- The footer's "Golf Outing" link already points to `/golfouting` (unchanged from prompt 027) — no footer changes needed.
- `presentationgolfouting.com` needs no changes — it's a DNS/Vercel-level mapping to this path.

## Verify (non-obvious only — visuals I'll check myself)

- `npm run build` / `tsc` / lint clean.
- Confirm all 6 sponsor tiers are present with the correct name count per tier (Gold 1, Silver 1, Bronze 6, Outing Partners 10, Friends of the Knights 9, Hole Sponsors 40) — easy to drop a name during transcription, worth a count check.
- Confirm the multi-column sponsor lists don't break mid-name (a name split awkwardly across columns) at common breakpoints.
- Confirm the `/charities` link resolves.

Build, verify locally, stop for review. Do NOT commit.
