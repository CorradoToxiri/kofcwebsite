# Second Polish Pass — pre-officer review

A focused cleanup pass before showing the site to the Council Officers for their review. All changes are content fixes and small layout adjustments — no new features, no new pages.

The pass is organized in three batches so it can be executed in 2–3 sessions if preferred. Each batch ends with a clear stopping point. After each batch, build, verify locally with `npm run dev`, hard-refresh to clear `.next` cache, and stop for review.

---

## Batch 1 — Homepage content fixes

### 1.1 — Footer "Volunteer" link

Remove the "Volunteer" link from the footer "Get Involved" column. Do not replace it — let the column have one fewer item.

### 1.2 — Homepage history milestones

The "A short history" section on the homepage currently lists four milestones. Replace them with **exactly three** milestones:

- **1968** — Council chartered
- **2000** — First Charity Golf Outing
- **2025** — `$--K` raised for charity

The `$--K` placeholder must read as a clearly visible placeholder (not a real number). Use the same `--` convention as a literal `$--K` in the milestone label.

### 1.3 — Homepage history narrative text

Rewrite the narrative paragraphs of the "A short history" section to:

- Remove the specific number "48 founding members" — reword so no specific founder count appears anywhere
- Remove the name "William F. Hennessy" as the first Grand Knight by rewording the paragraph (do not name a first Grand Knight at all)
- Replace "we have served three pastors" with "we have served multiple pastors"

The rewrite should preserve the warm, parish-scaled tone but contain no unverified specifics. Keep references to the charter date (May 1968), the parish name, and general themes (serving the parish, supporting the priest, caring for the poor, walking together in faith).

### 1.4 — Homepage Charity pillar narrative

In the Four Pillars section on the homepage, replace the reference to "Coats for Kids drive" in the **Charity** pillar paragraph. The new text should reference **Covenant House Newark** instead.

Suggested rewrite (adjust as needed to match existing voice):

> "From the food pantry collection to our work with Covenant House Newark, we are our parish's hands and feet for those in need."

The "$47,200 given in 2025" stat that appears below the pillar text on this card needs to be replaced — see 1.5 below for the placeholder convention.

### 1.5 — Homepage 2025 Impact section ("What 100 brothers can do")

This section currently shows four stat cards with fabricated numbers. Replace all four cards as follows:

| Card | Current | Replace with |
|---|---|---|
| Donated to charity this year | `$47,200` | `$--K` (clearly visible placeholder) |
| Volunteer hours logged | `3,840` | `--` (clearly visible placeholder) |
| Coats given to children in Bergen County | `412 / Coats for Kids` | `$--K` donated to Covenant House Newark (replace both the number and the description) |
| New brothers welcomed | `22` | `7` (verified real number) |

For the placeholder cards, retain the small subtitle below each stat (e.g., "// food pantry · seminarians · pro-life") but adjust the wording so it reflects the placeholder nature where appropriate. Wherever a `$--K` placeholder appears, it must be visually obvious as a placeholder so officers see it as a question, not a claim.

The Charity pillar card and the homepage stats card with `$47K` should also use the same `$--K` placeholder for consistency.

### 1.6 — Homepage "Three simple steps" wording

In Step 2 of the "Three simple steps" section on the homepage, replace "coffee, fellowship" with "refreshments, conversation" — to match the wording used on the Join page Step 2.

Current text: "No obligation, just coffee, fellowship, and a look behind the curtain."

New text: "No obligation, just refreshments, conversation, and a look behind the curtain."

### 1.7 — Homepage "This week at Council" sidebar

Two changes:

- **Rename** the sidebar from "This week at Council #6033" to **"Coming up at Council #6033"**
- **Change the query**: instead of filtering events to the current week, fetch the **next three upcoming events** sorted by `starts_at ASC`, regardless of timeframe. Match the existing visual treatment of each event row (date, title, time).

The Server Component query becomes something like:
```
select * from events
where starts_at >= now()
  and is_published = true
order by starts_at asc
limit 3
```

Keep the existing graceful empty-state fallback ("No upcoming events scheduled — see the full calendar.") for the rare case when no future events exist.

### 1.8 — Council Essentials strip — add a fifth line

The Council Essentials strip on the homepage currently has four lines:
1. Council meeting · 3rd Wed · 7:30 PM
2. Officers' meeting · 2nd Tue · 7:30 PM
3. Location · Church of the Presentation
4. Address · 271 W Saddle River Rd

Add a **fifth line** below "Address" with the same visual styling:

5. **City** — Upper Saddle River, NJ

The label on the left ("City") and the value on the right ("Upper Saddle River, NJ") should match the formatting of the four rows above exactly.

---

**End of Batch 1.** Build, verify locally, hard-refresh, stop for review.

---

## Batch 2 — About page content fixes

### 2.1 — About page milestones

The history section on the About page currently has four milestones. Replace them with **exactly three** milestones, identical to the homepage version:

- **1968** — Council chartered
- **2000** — First Charity Golf Outing
- **2025** — `$--K` raised for charity

Use the same `$--K` placeholder convention.

### 2.2 — About page Pillar narratives — update dated 2025 numbers

The long-form Charity and Fraternity pillar narratives currently reference "2017" stats. Update them to **2025** numbers:

In the **Charity** pillar paragraph, change:

> "In 2017 alone, the Knights of Columbus gave more than $185 million to charitable causes."

to:

> "In 2025 alone, the Knights of Columbus gave more than $193 million to charitable causes."

In the **Fraternity** pillar paragraph, change:

> "Knights gave more than 75.6 million service hours in 2017, illustrating how Catholics serve each other in fraternity and mercy."

to:

> "Knights gave more than 47.5 million service hours in 2025, illustrating how Catholics serve each other in fraternity and mercy."

Preserve the surrounding sentence structure of both pillar paragraphs — only the year and number change.

---

**End of Batch 2.** Build, verify locally, hard-refresh, stop for review.

---

## Batch 3 — Join, Donate, and responsive layout fixes

### 3.1 — Join page duplicated stats sections (responsive fix)

The Join page currently shows two consecutive stats strips with the same content (compact strip on top, larger feature-style strip below). Implement the following responsive behavior:

- **Desktop and tablet** (`md:` breakpoint and above): keep both strips visible, exactly as they are now
- **Mobile** (below `md:` breakpoint): hide the upper compact strip, show only the larger lower strip

Use Tailwind's responsive utilities (e.g., `hidden md:flex` or `hidden md:block` on the upper compact strip's container).

### 3.2 — Donate page duplicated stats sections (same responsive fix)

Apply the identical pattern from 3.1 to the Donate page: keep both stats strips on desktop and tablet, hide the upper compact strip on mobile only.

### 3.3 — Donate page "$40" vs "$40/year" inconsistency

The Donate page currently displays the dues amount inconsistently: one stats strip says "$40/year" and the other says just "$40."

Sync to **"$40/year"** everywhere on the Donate page where the dues amount appears as a stat or label. The big-number visual treatment can still emphasize the "$40" portion if it adds visual weight, but the "/year" must be visible (e.g., as a smaller subscript or trailing on the same line).

---

**End of Batch 3.** Build, verify locally, hard-refresh, stop for review.

---

## General notes for all batches

- All changes must preserve the existing visual styling and typography. No new components, no design system changes.
- Where placeholder text is introduced (`$--K`, `--`), it must be visually obvious as a placeholder so it reads as a question rather than a claim. Use the same convention consistently across all pages.
- Verify the homepage and About page show identical milestones after the changes (same three: 1968, 2000, 2025).
- After all three batches are complete, click through the entire site and confirm: no references to "Coats for Kids," no references to "Tootsie Roll drive," no references to a specific number of founding members, no reference to "William F. Hennessy" or any first Grand Knight by name, no "2017" stats anywhere, no "three pastors" phrasing.
- do not commit any of the changes to git, I will do this manually after checking the results.

### Things to verify before each batch's stopping point

- Page renders without console errors
- Mobile viewport (390px) layout is intact
- All links still work, no new 404s introduced
- Placeholder text is visible and obvious where intended
- Homepage and About page milestone timelines match exactly
