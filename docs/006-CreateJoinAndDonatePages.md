Build out the **Join** and **Donate** pages with full content, replacing the "Coming Soon" stubs created in the polish pass. Both are mostly static content — no Supabase queries needed for either page.

Address both pages in this single batch and commit once at the end.

---

### Page 1 — Join (`/join`)

This is one of the highest-priority pages on the site. Real prospects will use it to start their membership process.

**Page structure:**

1. **Page hero** — same `pagehero` pattern as Officers, About, and Calendar. Breadcrumb (Home / Join). H1 in serif navy: something like "Become a Knight at Council #6033." Short subtitle: "Practical Catholic men, 18 and over, in communion with the Holy See — we'd love to meet you."

2. **Stats / quick facts strip** — same component pattern as other inner pages. Suggested facts:
   - "Founded — 1968"
   - "Members — 100+ active"
   - "Dues — $40/year"
   - "Sign-up fee — Waived (promo BLESSEDMCGIVNEY)"

3. **Why join section ("Why become a Knight")** — four benefit cards in a 2×2 or 4-column grid. Reuse the existing card component pattern from elsewhere on the site. The four benefits:
   - **Faith** — "Grow as a Catholic husband, father, and disciple alongside brothers who hold each other up."
   - **Fellowship** — "A circle of Catholic men in your parish — at first communions and at funerals, in joys and in trials. Monthly meetings, council socials, and shared meals."
   - **Charity** — "Hands-on service that matters. Food pantry, soup kitchen, Covenant House, and many other initiatives that put faith into action."
   - **Member Benefits** — "Top-rated insurance, retirement, and family protection products available exclusively to Knights and their families."

4. **How to join section** — three numbered steps, similar to the existing "Three simple steps" pattern from the homepage. Build it as a similar visual layout (numbered cards or a numbered list with prominent step numbers):
   - **Step 1: Apply online** — "Visit kofc.org/join and complete the short online application. Use the information below so your application is routed directly to Council #6033 with no signup fee."
   - **Step 2: Visit a meeting** — "Join us on the third Wednesday of any month at 7:30 PM, in the Community Room at Church of the Presentation. No commitment, just refreshments, conversation, and a look at what we do."
   - **Step 3: Take your degree** — "When you're ready, complete the Exemplification of Charity, Unity, and Fraternity. From that moment, you're a brother knight."

5. **Application details box** — a clearly-styled "info card" or "callout" component containing the actual fields the prospect needs when they fill out the kofc.org form. This should be visually distinct (a bordered card, a tinted background, or similar) so it stands out as practical instructions:

   Title: **"When you fill out the application, use these details:"**
   
   Fields (use a clear label/value visual structure):
   - Preferred Local Council: **6033**
   - Member Referral Number: **4838999**
   - Church Parish Name: **Church of the Presentation**
   - Church Parish City: **Upper Saddle River, NJ**
   - Promo Code: **BLESSEDMCGIVNEY** (waives the $40 signup fee)
   
   Below the field list, add a primary CTA button: **"Apply on kofc.org →"** that links to `https://www.kofc.org/secure/en/join/join-kofc.html` and opens in a new tab (`target="_blank" rel="noopener noreferrer"`).

6. **Contact / "Talk to a Knight first" section** — a dedicated card with the Membership Director's information. Use this exact content (do NOT pull from the officers table — keep this hardcoded since the Membership Director role and contact convention is specifically for the join flow):
   
   - Name: **Corrado Toxiri**
   - Title: **Deputy Grand Knight & Membership Director**
   - Council: **Council 6033 — Church of the Presentation, Upper Saddle River, NJ 07458**
   - Email: **kofc6033@churchofpresentation.org** (use a `mailto:` link)
   
   Lead-in copy: "Have questions before applying? Want to come to a meeting first? Reach out — we'd be glad to hear from you."

7. **Closing CTA strip** — consistent with the closing pattern on Officers, About, and Calendar. Something like "The first step is the easiest one: come to a meeting." with a link to `/calendar` and the "Apply on kofc.org" button.

**Implementation notes for Join:**

- Do NOT make the Member Referral Number field display as a clickable link — it's a value to be copied into a form, not a URL
- The promo code BLESSEDMCGIVNEY should be presented in a way that invites copying (e.g., a `<code>` element with monospace styling, or a copy-button if you want to be slick — but don't overengineer; plain monospace text is fine)
- Don't use checkmark/bullet icons for the four-benefit grid; let the cards stand on their own visual weight
- The page should feel inviting, not bureaucratic — the application instructions need to be visible but shouldn't dominate the page

---

### Page 2 — Donate (`/donate`)

**Page structure:**

1. **Page hero** — same `pagehero` pattern. Breadcrumb (Home / Donate). H1: something like "Support our work." Short subtitle: "Whether you're a member paying annual dues or a friend of the council making a gift, your support fuels everything we do at Presentation."

2. **Stats / quick facts strip** — suggested facts:
   - "$47K — Raised for charity in 2025" (matches homepage stat for now; will be updated with verified numbers later)
   - "100% — Goes to council programs"
   - "$40/year — Annual member dues"
   - "1968 — Year founded"

3. **Two-column primary section** with two distinct CTA cards side-by-side (stacked on mobile):

   **Left card — "Pay Your Annual Dues"**
   - Headline: "Pay Annual Dues"
   - Subhead: "$40/year for active members"
   - Body: "Council dues fund our charitable activities, parish events, and operating expenses. Members receive a reminder annually, but you can pay anytime via the methods below."
   - This card is targeted at existing members
   
   **Right card — "Make a Donation"**
   - Headline: "Make a Donation"
   - Subhead: "Any amount, any time"
   - Body: "Friends and family of the council can support our work directly. Every dollar goes to our charitable initiatives and parish programs — none to overhead."
   - This card is targeted at non-members or members making additional gifts

   Both cards should look visually parallel — same dimensions, same component style, same button treatment. Each card has a CTA button "Pay with Venmo →" or similar that anchors to the Venmo section below (or each card just feeds into the same Venmo flow if a single QR works for both).

4. **Payment methods section** — a clear, well-organized presentation of how to pay. Use a two-card or two-column layout:

   **Method 1: Venmo (online)**
   - Display the Venmo QR code image from `/public/VenmoKnights.png` at a prominent, scannable size (at least 240×240 px on desktop)
   - Below the QR, display the Venmo handle as text: **@presentationknights**
   - Below the handle, display a smaller verification line: "Verify the display name reads 'Presentation Knights — Joe Lupino' before sending."
   - Brief instruction: "Scan the QR with the Venmo app, or search for the handle above. Add a note in the payment indicating whether it's for dues or a donation."

   **Method 2: Check by mail or drop-off**
   - Headline: "By Check"
   - Body content (use this exact structure):
     - Make checks payable to: **"Knights of Columbus #6033"**
     - Mail to:
       ```
       Knights of Columbus #6033
       c/o Church of the Presentation
       271 West Saddle River Road
       Upper Saddle River, NJ 07458
       ```
     - "Parishioners may also drop checks in the KofC mailbox in the parish office."
     - Add a note: "Please write 'dues' or 'donation' in the memo line so we can apply the gift correctly."

5. **Where your money goes** (optional, but recommended) — a brief, dignified section with three or four small bullet items showing how funds are used. Examples:
   - "Food Pantry — direct support for Bergen County families in need"
   - "Soup Kitchen Cooking — meals for our local soup kitchen ministry"
   - "Charity Fund — annual gifts to Covenant House Newark, Nova Hope for Haiti, Right to Life, and others"
   - "Parish Programs — Pancake Breakfasts, Christmas Dinner Dance, and parish events"
   
   Keep this short and factual. No marketing language.

6. **Contact section** — a smaller card noting that questions about dues, donations, or the council's finances can be directed to:
   - Email: **kofc6033@churchofpresentation.org**
   - Lead-in: "Questions about dues, donations, or the Council's finances? We're happy to help."

7. **Closing CTA strip** — same pattern as other pages. Something like "Thank you for supporting our parish and our community." with a soft link back to `/about` or `/charities`.

**Implementation notes for Donate:**

- Do NOT include any tax-deductibility language anywhere on the page. The council has a special process for tax-deductible giving (through KofC charities or the parish) that is too complex for the public site
- Don't use a Venmo button or web link — Venmo's payment requires the user to scan the QR or open the app. A `<button>` that does nothing would be misleading
- The check-mailing address must include "c/o Church of the Presentation" on its own line — the church address is the council's effective mailing address, but the council itself is the recipient
- The Venmo QR image is already in place at `public/VenmoKnights.png` — reference it with the path `/VenmoKnights.png` from the page component
- Use Next.js's `<Image>` component for the QR display so it gets optimized and lazy-loaded
- The Venmo handle `@presentationknights` should NOT be a link (Venmo doesn't have a reliable web profile URL pattern) — it's a value the user copies into the Venmo app
- Do NOT reuse the `EventListItem` component or any event-related components — these are content cards, not events

---

### Cross-cutting requirements for both pages

- Both pages should feel finished, not stubbed — anyone visiting them should believe they're production-ready
- Reuse existing components wherever possible: `pagehero`, the stats strip, card patterns, the closing CTA strip
- Mobile layout: both pages need to flow cleanly at 390px viewport. The two-column "Dues vs Donate" section on the Donate page must stack on mobile. The four-benefit grid on the Join page must stack appropriately (1 column on mobile, 2 on tablet, 4 on desktop is ideal)
- All `mailto:` links should use the consistent email `kofc6033@churchofpresentation.org`
- All external links (kofc.org/join) must open in a new tab with `target="_blank" rel="noopener noreferrer"`
- The brand voice for both pages: warm, parish-scaled, direct. Not salesy on Join. Not guilt-inducing on Donate. Just clear and welcoming.

### Things to verify before committing

- All four benefit cards on Join render with appropriate spacing on desktop, tablet, and mobile
- The application details box on Join is visually distinct enough that prospects will notice it
- The promo code BLESSEDMCGIVNEY is presented in a copy-friendly way (monospace, distinguishable from prose)
- The "Apply on kofc.org" button works and opens in a new tab
- The Membership Director contact card displays correctly with all four fields
- The two-column dues-vs-donate section on Donate stacks cleanly on mobile
- Both Venmo and check methods are presented with equal visual weight on Donate
- The Venmo QR image renders correctly from `/VenmoKnights.png`
- The Venmo handle and display-name verification line are both visible
- The check payable line and mailing address are exactly as specified above
- No tax-deductibility language anywhere on Donate
- Both pages have working closing CTA strips that point to logical next destinations
- Footer "Become a Knight" link now leads to a real page, not the stub
- Footer "Make a Donation" link now leads to a real page, not the stub
- Header utility bar links work correctly

### Process

Build both pages, verify locally with `npm run dev`, hard-refresh to clear `.next` cache, click through every link to confirm no 404s, check mobile viewport. 
