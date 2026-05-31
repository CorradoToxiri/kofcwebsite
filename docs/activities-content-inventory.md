# Activities Page — Content Inventory

Finalized content for the kofcwebsite `/activities` page. Source of truth for all copy,
photo placement, and structure. Developed collaboratively, May 2026.

**Page concept:** An inspirational, text-led page conveying the WHAT and HOW of council life —
the fun and brotherhood — to inspire prospective members. (About = who, Charities = why,
Activities = what/how.) NOT a card grid. Thematic prose groupings with ambient photography.

**Storage decision:** ALL content on this page is HARDCODED page furniture. Nothing comes from
the `activities` table. The activities rarely change; low maintenance is the priority.

**Photo treatment:** Photos are ambient/atmospheric, NOT matched to individual activity entries.
One photo anchors the top of each theme section; leftovers form a closing mosaic.

---

## Page hero (standard pagehero component)

- **Breadcrumb:** Home / Activities
- **H1:** "The best part is the brotherhood."
- **Subtitle:** "Service is our calling — but the friendships are what keep us coming back. Here's a year in the life of Council #6033."

## Lead-in paragraph (below hero, above first section)

> Ask any Knight why he stays, and he won't start with the charity work — he'll start with the men beside him. A council year is full: pancake griddles and golf carts, soup kitchens and Christmas parties, early mornings and late dinners. Some of it is hard work, most of it is a good time, and all of it is done shoulder to shoulder. This is what we do together.

## Opening hero band (full-width ambient image)

- **Image:** `Activities_faith1.jpg`
- Optional overlaid line: "A year of brotherhood at Presentation."

---

## SECTION 1 — Faith & Fellowship

- **Header image:** `Activities_faith2.jpg`
- **Section intro:** "Everything we do begins in faith — and often, around a table."

Entries (name + evergreen description):

1. **Pancake Breakfast** — Our annual parish pancake breakfast is a Presentation tradition, with the Knights working the griddle to support the Youth Ministry's summer mission trips. Bring the family; leave full.
2. **Saint Nick's Breakfast** — A joyful morning for parish families as the Christmas season begins, with a special visit that delights the children.
3. **Breakfast for the Discipleship Weekend** — When the parish gathers for its Discipleship Weekend, the Knights are in the kitchen at dawn, serving breakfast to those deepening their faith.
4. **Serving Breakfast at Cornerstone** — Brother Knights rise early to cook and serve breakfast at the Cornerstone Retreat, a quiet act of service that means the world to those on retreat.
5. **Knight's Memorial Mass & Reception** — Each year we gather to remember the brothers we've lost, with a memorial Mass and a reception that honors their place in our council family.
6. **Packathon** — A hands-on outreach where volunteers package nutritious meals for families in need, including those served through Holy Name's Haiti Health Promise. The Knights handle setup and bring the muscle.

---

## SECTION 2 — Food & Festivities

- **Header image:** `Activities_service3.jpg`
- **Section intro:** "We take fellowship seriously. That means we eat well and celebrate often."

Entries:

1. **Knight's Summer BBQ** — An evening of great food, cold drinks, and easy company — most recently hosted at the home of Sean and Ellen Farley. The kind of night that turns members into friends.
2. **Parish Christmas Party** — The whole parish comes together for our annual Christmas celebration, and the Knights are proud to help make it merry.
3. **Christmas Social** — Our December council meeting trades business for cheer — good food, fellowship, and the warmth of the season among brothers.
4. **Charity Dinner at Limoncello** — A fine evening out with a purpose: great Italian food, great company, and funds raised for those we serve.

---

## SECTION 3 — Service, Side by Side

- **Header image:** `Activities_service1.jpg`
- **Section intro:** "When the parish or the community needs hands, the Knights show up — together."

Entries:

1. **Soup Kitchen Cooking** — Several times a year, brother Knights cover their own shifts cooking for our parish's Soup Kitchen Ministry, preparing meals delivered to Newark and Harlem.
2. **Serving Thanksgiving at Covenant House** — Each year we serve a Thanksgiving meal to young people at Covenant House in Newark — donating the food, then staying to serve it ourselves.
3. **Thanksgiving Turkey Drive** — Brothers bring frozen turkeys to the November meeting, collected for local families in need and for the Soup Kitchen's Thanksgiving dinner.
4. **Intellectual Disabilities Drive** — Our annual collection drive, a longstanding Knights of Columbus tradition, supporting those with intellectual and developmental disabilities.
5. **Vaccination Drive at Presentation** — The Knights help the parish host a community vaccination drive, caring for the health of our neighbors.
6. **Sisters of Charity Kids' Picnic** — Each summer we welcome children from the Bronx, Brooklyn, Manhattan, and Morristown for a day of fun at Presentation, in partnership with the Sisters of Charity.
7. **4th Degree Krispy Kreme / Wreaths Across America Drive** — Our Fourth Degree Knights raise funds to lay remembrance wreaths on the graves of veterans through Wreaths Across America.

---

## SECTION 4 — Signature Events

- **Header image:** `Activities_signature1.jpg`
- **Section intro:** "Some traditions are the highlight of the whole year."

Entries (TWO separate golf outings — keep distinct):

1. **Presentation Golf Outing** — Our annual Presentation Golf Outing is a council highlight and one of our biggest fundraisers — a day of good-natured competition, fellowship, and support for the year's charitable work.
2. **Knights Golf Outing at Old Tappan** — A second day on the links at Old Tappan, bringing brothers together for friendly competition and a shared good cause. (Registration moves online here in a future phase.)

---

## Closing mosaic band (ambient collage, no captions)

- **Images:** `Activities_service2.png`, `Activities_service4.jpg`, `Activities_signature2.jpg`
- A small "moments together" collage before the closing CTA.

## Closing CTA strip

- **Heading:** "This could be your council, too."
- **Body:** "Every one of these days is better with more brothers. If any of this looks like time well spent, come see for yourself."
- **Buttons:** "Join the Knights" → /join · "Come to a Meeting" → /calendar

---

## Photo map (all in Supabase `public-photos` bucket)

| Slot | Photo |
|---|---|
| Opening hero band | `Activities_faith1.jpg` |
| Faith & Fellowship header | `Activities_faith2.jpg` |
| Food & Festivities header | `Activities_service3.jpg` |
| Service, Side by Side header | `Activities_service1.jpg` |
| Signature Events header | `Activities_signature1.jpg` |
| Closing mosaic | `Activities_service2.png`, `Activities_service4.jpg`, `Activities_signature2.jpg` |

---

## Footer link cleanup (related change)

The footer previously had links to `/activities#pancake` and `/activities#golf`. The new page has
no per-activity anchors, so these should point to `/activities` (the whole page) instead.
