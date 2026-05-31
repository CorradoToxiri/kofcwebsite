# Polish Notes — kofcwebsite Phase 1A

Notes collected during page build. Most Phase 1A polish is now complete.
Remaining open items are tracked below.

---

## Home page (/)

### Text edits
- [X] Grand Knight quote: replace placeholder [Grand Knight Name] with full_name from officers table where title is 'Grand Knight'
- [X] Stats card "Raised for charity in 2025": verified number is $31K (third polish pass)
- [X] Use the actual number under the charity pillar and 2025 impact section: $31K (third polish pass)
- [X] Review the 2025 impact section overall with real Council facts *(Numbers done: $31K charity, Hundreds of volunteer hours, $2,000 Covenant House, 7 new brothers. Deeper qualitative review optional later.)*
- [X] Council Essentials: we meet at "Church of the Presentation", not at the "Parish Hall"
- [X] Remove "From the Bulletin" box. Remove "Brothers helping brothers" box.
- [X] Update the short history section / milestone events (1968 / 2000 / 2025, $31K; founder details removed; "multiple pastors")
- [X] Charter card: replace "PHOTO_07 · CHARTER_1968" placeholder with KofC emblem stand-in, keep caption (third polish pass). *(Real charter photo to replace emblem later — see Deferred.)*
- [X] Replace \$--K placeholders with verified $31K across hero, charity pillar, 2025 impact, milestone
- [X] Replace volunteer hours placeholder with "Hundreds of volunteer hours logged"; remove Form 1728 subtitle
- [X] Replace Covenant House Newark placeholder with $2,000

### Visual / layout
- [X] Replace favicon with a small kofc logo

### Data / content
- [X] Add the full calendar of planned events in the database

---

## Officers page (/officers)

### Text edits
- [X] Columbian year as a calculated value (two locations + under officer cards)

### Data / content
- [X] Add email for all officers *(Added in Supabase; envelope icon + "email" label, real address in mailto: link)*
- [X] Replace medal placeholders with real portraits as photos arrive *(DEFERRED — waiting on photos)*

---

## About page (/about)

### Text edits
- [X] Update the short history section / milestone events (synced to homepage: 1968 / 2000 / 2025, $31K)
- [X] H2 changed to "How we got here"
- [X] Refresh pillar long-form with 2025 data ($193M donated, 47.5M service hours) — complete, no further rewrite needed
- [X] Add a mailto link to kofc6033@churchofpresentation.org in about#contact

---

## Calendar page (/calendar)

- [X] Address and map link for events added
- [X] Event end times shown (calendar page + homepage upcoming activities)

---

## Activities & Charities pages

- [X] Build out the Activities and Charities pages with full content. 

---

## Deferred (not ready / waiting on external input)

- [X] Officer portraits — waiting on real photos to replace medal placeholders
- [ ] Real charter photo — emblem stand-in in place; replace when photo available

---

## Cross-cutting / sitewide

- [X] Officers' Meeting consistently shows "2nd Tue · 7:30 PM" everywhere
- [X] Footer "Contact the Webmaster" email is kofc6033@churchofpresentation.org
- [X] Parish website corrected to churchofpresentation.org everywhere
- [X] Mobile hamburger menu for top navigation
- [X] Calendar link moved to fourth position in top menu
- [X] Footer "Volunteer" link removed (Get Involved column)
- [X] Join + Donate duplicated stats strips: hidden on mobile, kept on desktop/tablet
- [X] Donate "$40/year" consistency

---

## Legend

- \`[ ]\` — Pending / deferred (not yet addressed or waiting on external input)
- \`[-]\` — In progress (partially done or actively being worked)
- \`[X]\` — Done (verified live)
