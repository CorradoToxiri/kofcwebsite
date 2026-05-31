Build out the **Activities** page at `/activities`, replacing the current "Coming Soon" stub with full content.

This page has a deliberately different feel from the rest of the site. Where Officers, Charities, etc. use structured card grids, the Activities page is an **inspirational, text-led, editorial page** meant to convey the fun and brotherhood of council life to prospective members. Think "a year in the life" photo-essay, NOT a catalog of cards.

**All content on this page is hardcoded** in the page component. Nothing comes from the Supabase `activities` table — do not query it. The content rarely changes and low maintenance is the priority.

**Photos are ambient/atmospheric** — they set a mood and are NOT matched to individual activity entries. One photo anchors the top of each theme section; three leftovers form a closing mosaic.

---

## Design intent

- Keep the site's visual DNA (navy/gold palette, Source Serif 4 headings, Source Sans 3 body, existing spacing language) so it feels like the same website.
- But trade the rigid card grid for a flowing, vertical editorial rhythm: a section per theme, each led by a wide atmospheric image and a short intro line, followed by the activities as readable text entries (a styled list — name in bold/serif + an evergreen description sentence). NOT bordered cards.
- Generous whitespace. Large images. The page should feel warm and full of life, conveying "look how much we do together."

---

## Page structure (top to bottom)

### Page hero (standard `pagehero` component)
- Breadcrumb: Home / Activities
- H1: "The best part is the brotherhood."
- Subtitle: "Service is our calling — but the friendships are what keep us coming back. Here's a year in the life of Council #6033."

### Lead-in paragraph
Directly below the hero, a short framing paragraph (prose, full width or comfortable reading column):
> Ask any Knight why he stays, and he won't start with the charity work — he'll start with the men beside him. A council year is full: pancake griddles and golf carts, soup kitchens and Christmas parties, early mornings and late dinners. Some of it is hard work, most of it is a good time, and all of it is done shoulder to shoulder. This is what we do together.

### Opening hero band
Full-width ambient image: `Activities_faith1.jpg`. Optionally overlay the line "A year of brotherhood at Presentation." If overlaying text, ensure legible contrast (scrim/gradient over the image).

### Four theme sections
Each theme section consists of: a wide header image, a short italic/serif intro line, then the activity entries as a styled text list (bold name + description sentence). Use consistent treatment across all four.

**SECTION 1 — Faith & Fellowship**
- Header image: `Activities_faith2.jpg`
- Intro: "Everything we do begins in faith — and often, around a table."
- Entries:
  - **Pancake Breakfast** — Our annual parish pancake breakfast is a Presentation tradition, with the Knights working the griddle to support the Youth Ministry's summer mission trips. Bring the family; leave full.
  - **Saint Nick's Breakfast** — A joyful morning for parish families as the Christmas season begins, with a special visit that delights the children.
  - **Breakfast for the Discipleship Weekend** — When the parish gathers for its Discipleship Weekend, the Knights are in the kitchen at dawn, serving breakfast to those deepening their faith.
  - **Serving Breakfast at Cornerstone** — Brother Knights rise early to cook and serve breakfast at the Cornerstone Retreat, a quiet act of service that means the world to those on retreat.
  - **Knight's Memorial Mass & Reception** — Each year we gather to remember the brothers we've lost, with a memorial Mass and a reception that honors their place in our council family.
  - **Packathon** — A hands-on outreach where volunteers package nutritious meals for families in need, including those served through Holy Name's Haiti Health Promise. The Knights handle setup and bring the muscle.

**SECTION 2 — Food & Festivities**
- Header image: `Activities_service3.jpg`
- Intro: "We take fellowship seriously. That means we eat well and celebrate often."
- Entries:
  - **Knight's Summer BBQ** — An evening of great food, cold drinks, and easy company — most recently hosted at the home of Sean and Ellen Farley. The kind of night that turns members into friends.
  - **Parish Christmas Party** — The whole parish comes together for our annual Christmas celebration, and the Knights are proud to help make it merry.
  - **Christmas Social** — Our December council meeting trades business for cheer — good food, fellowship, and the warmth of the season among brothers.
  - **Charity Dinner at Limoncello** — A fine evening out with a purpose: great Italian food, great company, and funds raised for those we serve.

**SECTION 3 — Service, Side by Side**
- Header image: `Activities_service1.jpg`
- Intro: "When the parish or the community needs hands, the Knights show up — together."
- Entries:
  - **Soup Kitchen Cooking** — Several times a year, brother Knights cover their own shifts cooking for our parish's Soup Kitchen Ministry, preparing meals delivered to Newark and Harlem.
  - **Serving Thanksgiving at Covenant House** — Each year we serve a Thanksgiving meal to young people at Covenant House in Newark — donating the food, then staying to serve it ourselves.
  - **Thanksgiving Turkey Drive** — Brothers bring frozen turkeys to the November meeting, collected for local families in need and for the Soup Kitchen's Thanksgiving dinner.
  - **Intellectual Disabilities Drive** — Our annual collection drive, a longstanding Knights of Columbus tradition, supporting those with intellectual and developmental disabilities.
  - **Vaccination Drive at Presentation** — The Knights help the parish host a community vaccination drive, caring for the health of our neighbors.
  - **Sisters of Charity Kids' Picnic** — Each summer we welcome children from the Bronx, Brooklyn, Manhattan, and Morristown for a day of fun at Presentation, in partnership with the Sisters of Charity.
  - **4th Degree Krispy Kreme / Wreaths Across America Drive** — Our Fourth Degree Knights raise funds to lay remembrance wreaths on the graves of veterans through Wreaths Across America.

**SECTION 4 — Signature Events**
- Header image: `Activities_signature1.jpg`
- Intro: "Some traditions are the highlight of the whole year."
- Entries (these are TWO separate outings — keep them distinct, do not merge):
  - **Presentation Golf Outing** — Our annual Presentation Golf Outing is a council highlight and one of our biggest fundraisers — a day of good-natured competition, fellowship, and support for the year's charitable work.
  - **Knights Golf Outing at Old Tappan** — A second day on the links at Old Tappan, bringing brothers together for friendly competition and a shared good cause. (Online registration coming in a future phase.)

### Closing mosaic band
A small "moments together" photo collage (no captions), using these three images:
- `Activities_service2.png`
- `Activities_service4.jpg`
- `Activities_signature2.jpg`

Lay them out as a simple responsive mosaic/grid. Atmospheric only — no text overlays needed.

### Closing CTA strip
Use the standard closing CTA pattern from other pages:
- Heading: "This could be your council, too."
- Body: "Every one of these days is better with more brothers. If any of this looks like time well spent, come see for yourself."
- Buttons: "Join the Knights" → `/join` · "Come to a Meeting" → `/calendar`

---

## Image handling

- All images are in the Supabase `public-photos` bucket. Full URL pattern:
  `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/<filename>`
- Use Next.js `<Image>` for optimization. The Supabase storage domain should already be in `next.config.ts` `images.remotePatterns` from earlier work.
- Note one filename is a `.png` (`Activities_service2.png`); the rest are `.jpg`. Use exact filenames as listed.

## Footer link cleanup (include in this change)

The footer currently has two links pointing to `/activities#pancake` and `/activities#golf`. The new Activities page has no per-activity anchor targets, so update both links to point to `/activities` (the page itself). If that produces two identical "Activities"-type links in the same footer column, consolidate to a single sensible link rather than duplicating.

---

## Verify before stopping

- The page reads as a flowing editorial page, not a card grid
- All four theme sections render in order: Faith & Fellowship → Food & Festivities → Service, Side by Side → Signature Events
- Each section has its header image, intro line, and text entries
- Both golf outings appear as separate entries in Signature Events
- The opening hero band shows `Activities_faith1.jpg`
- The closing mosaic shows the three leftover images
- All 8 images load correctly (mind the one `.png`)
- The closing CTA buttons link to /join and /calendar
- Footer no longer has dead `#pancake` / `#golf` anchors
- The footer "Activities" link resolves to the real page (no longer the stub)
- Mobile viewport (390px): images scale, sections stack, text remains readable, the mosaic reflows cleanly
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
