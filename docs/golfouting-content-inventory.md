# Golf Outing Page — Content Inventory

Finalized content for the kofcwebsite `/golfouting` page. Source of truth for copy, links,
and assets. Developed collaboratively, May 2026.

**Concept:** A static presentation + registration-linking page for the 2026 Presentation Golf
Outing. This is the Phase 3 "lite" version — NOT an on-site registration engine. Registration
happens through external Google Forms (links + QR codes) and a downloadable PDF brochure for
those who prefer to mail in. A full on-site registration system is a future phase.

**Storage:** Hardcoded page furniture. Nothing from the database.

**Navigation:** Surfaced via a SEASONAL announcement bar below the site header (not a third
orange button), plus a footer link. The bar is removable with a one-line change after the
outing passes, and re-enabled next year with a new date.

---

## Key facts (from the 2026 brochure)

- **Event:** Presentation Golf Outing 2026
- **Date:** Monday, September 14, 2026
- **Venue:** Darlington Golf Course, 277 Campgaw Road, Mahwah, NJ 07430
- **Dinner:** The Mason Jar (casual dinner with beer and wine)
- **Impact headline:** Over $500,000 distributed to charities since the outing began in 2000
- **Beneficiaries:** Parish Food Pantry, Medical Mission in Haiti, Covenant House, Thanksgiving
  Turkey Drive, parish youth activities, local Ambulance Corps, organizations supporting abused
  women and single mothers, Lighthouse pregnancy services, and others
- **Reach:** Sponsors listed in the parish bulletin, which reaches 4,000+ families across
  Bergen, Rockland, and Orange Counties
- **Contacts:** Sponsorships — Sean Farley (201) 286-7206 · Golf — Ed Dowd (201) 787-9385 ·
  Email — kofc6033@churchofpresentation.org

(Note: price $225/golfer and the detailed hour-by-hour schedule are intentionally OMITTED from
the page per Corrado's instruction — those live in the brochure for anyone who wants them.)

---

## Seasonal announcement bar (site-wide, below header)

- Slim full-width band (navy or gold), appears on all pages
- Text: "⛳ The 2026 Presentation Golf Outing — Monday, September 14 at Darlington. Register today →"
- Links to `/golfouting`
- Built so it can be toggled off with a single change after the event

---

## Page hero / banner

- **Banner image:** `Activities_signature2.jpg` (full-width)
- **Overlaid title:** "The 2026 Presentation Golf Outing"
- **Overlaid subtitle / date line:** "Monday, September 14, 2026 · Darlington Golf Course, Mahwah"

## Inspirational lead text

> Come join us for a great day of golf! Since our first outing in 2000, the Presentation Golf Outing has distributed over $500,000 to worthy charities — funding our Parish Food Pantry, the Medical Mission in Haiti, Covenant House, the Thanksgiving Turkey Drive, parish youth activities, our local Ambulance Corps, and many others. It's our biggest day of the year: a beautiful course, good-natured competition, old friends and new, and a casual dinner to cap it off — all for causes that reach thousands of families across Bergen, Rockland, and Orange Counties.

## The day at a glance (light details block — venue & dinner only, NO price/schedule)

- **When:** Monday, September 14, 2026
- **Where:** Darlington Golf Course, 277 Campgaw Road, Mahwah, NJ
- **Dinner:** Casual dinner with beer and wine at The Mason Jar

## Registration — two paths, side by side

### Play golf
- Heading: "Register to Play"
- Short line: "Grab your foursome — or sign up solo and we'll pair you up."
- Button/link: Golfer Registration → https://forms.gle/LnauYv1wJyNPVLsu9
- QR code image: `QR_Code_GolferRegistration2026.jpg`

### Become a sponsor
- Heading: "Become a Sponsor"
- Short line: "Support the cause and reach 4,000+ families through our parish bulletin. Sponsorship levels from Hole Sponsors to Diamond."
- Button/link: Sponsor Registration → https://forms.gle/tUcrqw3ENENr4QzP6
- QR code image: `QR_Code_SponsorRegistration2026.jpg`

## Download the brochure

- Button: "Download the Brochure (PDF)"
- Links to: https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/documents/KOC%20Golf%20Outing%20Brochure%202026.pdf
- Opens in new tab
- Small note: "Prefer to register by mail? The brochure has a printable form."

## Contact line

> Questions? For sponsorships, contact Sean Farley at (201) 286-7206. For golf, contact Ed Dowd at (201) 787-9385. Or email us at kofc6033@churchofpresentation.org.

---

## Asset URLs (Supabase)

| Asset | URL / filename |
|---|---|
| Banner image | `Activities_signature2.jpg` (public-photos) |
| Golfer QR | `QR_Code_GolferRegistration2026.jpg` (public-photos) |
| Sponsor QR | `QR_Code_SponsorRegistration2026.jpg` (public-photos) |
| Golfer form | https://forms.gle/LnauYv1wJyNPVLsu9 |
| Sponsor form | https://forms.gle/tUcrqw3ENENr4QzP6 |
| Brochure PDF | https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/documents/KOC%20Golf%20Outing%20Brochure%202026.pdf |

---

## Notes / future

- This is the Phase 3 "lite" page. A full on-site registration system (golfers, sponsors,
  Venmo payment) is deferred to a future phase — this year's registration is already running on
  the external Google Forms + existing system.
- The brochure PDF filename contains spaces ("KOC Golf Outing Brochure 2026.pdf"), already
  URL-encoded as %20 in the link above. Per the no-spaces preference, consider renaming the
  file in Supabase to KOC_Golf_Outing_Brochure_2026.pdf and updating the link.
- After the Sept 14 outing passes, disable the announcement bar (one-line change) and consider
  leaving the page up in a "see you next year" state or pointing it back to results/photos.
