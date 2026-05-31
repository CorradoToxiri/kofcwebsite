Build out the **Charities** page at `/charities`, replacing the current "Coming Soon" stub with full content.

The page presents the charities and ministries Council #6033 supports, in a deliberate four-tier visual hierarchy. Some content comes from the Supabase `charities` table; some is hardcoded page furniture (see each section below).

**Prerequisite:** The `charities-seed.sql` script has been run in Supabase, which (1) added a `category` column to the `charities` table allowing the values `parish_major` and `external`, and (2) seeded 5 full-card charities (3 `parish_major`, 2 `external`). Read the current `charities` table schema before writing queries.

---

## Page structure (top to bottom)

### Tier 1 — Parish anchor block (HARDCODED in the page component)

A prominent lead section, visually distinct from the cards below it (wider, or a different background treatment) — this is the page's anchor, establishing the parish as the center of everything.

- **Eyebrow label:** "Our parish home"
- **Heading:** "Everything begins at Presentation."
- **Image:** `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_2-1.jpg`
- **Body text:** "We are Catholic men gathering to serve our parish, support our neighbors in need, and grow as husbands, fathers, and disciples. Most of what we do flows through the ministries of Church of the Presentation — the parish that has been our home since 1968. When the parish has a need, the Knights are there: in the kitchen, on the mission field, and alongside our young people."
- The heading or image should link to https://www.churchofpresentation.org/ (open in new tab, `rel="noopener noreferrer"`)

Suggested treatment: a hero-style split (image one side, text the other) similar to the pattern used elsewhere on the site, but clearly the page's opening statement.

### Tier 2 — Major parish ministries (DATABASE: `category = 'parish_major'`)

Section heading: something like "Ministries at the heart of our parish."

Full cards, fetched from the `charities` table where `category = 'parish_major'` and `is_published = true`, ordered by `sort_order ASC`. Each card displays: photo (`photo_url`), name, short_description, body, and a "Learn more →" link to `external_url` (open in new tab). Use the existing card component pattern from the site (consistent with the Officers/Activities card styling). There are 3 of these.

### Tier 3 — Minor parish ministries (HARDCODED in the page component)

Section heading: "Other Parish Ministries We Support"
Shared section image: `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/CoP_volunteer.jpg`

A visually lighter, more compact treatment than the full cards — a styled list or small items, not full cards. De-emphasized relative to Tier 2 (think of the "past events" treatment on the Calendar page: present but clearly secondary). The shared image can serve as a section header/banner for this group.

Three items, each a bolded name + one-line description:

- **Parish Food Pantry** — A pantry of food and household essentials for local families facing financial hardship; the Knights help fund it through events like the Parish Pasta Dinner.
- **Thanksgiving Turkey Drive** — Each November, the council collects frozen turkeys for local families in need and for the Soup Kitchen's Thanksgiving dinner, with members donating turkeys at the November meeting.
- **Packathon** — A yearly food-packing event at Presentation, organized with Haiti Health Promise of Holy Name (Teaneck), benefiting the people of Milot, Haiti; the Knights handle setup and cleanup and sponsor a packing team.

### Tier 4 — External charities (DATABASE: `category = 'external'`)

Section heading: something like "Beyond our parish."

Full cards, same component and treatment as Tier 2, fetched from the `charities` table where `category = 'external'` and `is_published = true`, ordered by `sort_order ASC`. There are 2 of these.

### Tier 5 — Closing block (HARDCODED in the page component)

A text-only closing section that mirrors the anchor block's style (no image, no cards):

- **Eyebrow label:** "And many more"
- **Heading:** "The work doesn't stop here."
- **Body text:** "Beyond the ministries and organizations above, Council #6033 supports a wide range of causes throughout the year — among them groups serving abused women and single mothers, Lighthouse pregnancy services, and Special Olympics New Jersey. Wherever there is a need in our parish or our community, the Knights look for a way to help."

Optionally follow with the standard closing CTA strip used on other pages (e.g., a link to /join or /donate), if it fits naturally.

---

## Page hero / breadcrumb

Start the page with the standard `pagehero` pattern used on Officers, About, Calendar (breadcrumb Home / Charities, H1 in serif navy, short subtitle). Suggested H1: "Charities & Ministries." Suggested subtitle: "The causes and ministries our council is proud to support." The Tier 1 anchor block comes after this page hero.

---

## Data fetching

- Single Server Component fetch from the `charities` table, then split the results by `category` in the component (one query, filter in code into the parish_major group and the external group). Use the same Supabase server client pattern used on the Officers and Calendar pages.
- The minor ministries (Tier 3), anchor (Tier 1), and closing (Tier 5) are hardcoded — they are NOT in the database, do not query for them.

---

## Related homepage fix (include in this same change)

On the homepage 2025 Impact section, there is a stat card currently labeled "Covenant House Newark." Change the label to "Covenant House New Jersey" for sitewide naming consistency. The dollar figure ($2,000 / $2K) and everything else about the card stays the same — only the org name label changes.

---

## Image note

All charity card images should use the Next.js `<Image>` component for optimization. Confirm the Supabase storage domain is already in `next.config.ts` `images.remotePatterns` (it should be from earlier work, since officer photos load from the same bucket).

---

## Verify before stopping

- The page renders all five tiers in order: anchor → major ministries → minor list → external charities → closing
- Tier 2 shows exactly 3 cards (Soup Kitchen, Haiti Medical Mission, Youth Ministry) in sort_order
- Tier 4 shows exactly 2 cards (Covenant House New Jersey, USR Ambulance Corps) in sort_order
- The minor ministries (Tier 3) render as a clearly lighter/secondary treatment, not full cards
- All `external_url` links open in a new tab
- All images load
- The homepage "Covenant House Newark" label now reads "Covenant House New Jersey"
- The footer "Charities" link now resolves to a real page (no longer the stub)
- Mobile viewport (390px): cards stack cleanly, the anchor and closing blocks remain readable, the minor list stays compact
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
