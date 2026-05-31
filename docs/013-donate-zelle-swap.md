Update the **Donate** page (`/donate`) to replace the Venmo payment method with Zelle. The council no longer uses Venmo. The "By Check" payment method stays exactly as-is — do not touch it.

There are three groups of changes, all on the Donate page.

---

## Change 1 — The two CTA buttons in the "Dues or a donation" section

In the upper section with the two cards ("Pay Annual Dues" and "Make a Donation"), the buttons currently read:
- "Pay with Venmo →"  →  change to **"Pay with Zelle →"**
- "Donate with Venmo →"  →  change to **"Donate with Zelle →"**

Both buttons keep their existing anchor link to the payment-methods section (`#payment-methods`). Only the label text changes.

## Change 2 — Replace the "Venmo" payment card with a "Zelle" card

In the "How to pay" section, the first card is currently "Venmo." Replace it entirely with a "Zelle" card. The card structure stays the same (heading, QR image, handle line, verification line, instructions) — only the content changes:

- **Card heading:** "Venmo"  →  **"Zelle"**

- **QR code image:** replace `/VenmoKnights.png` with the Zelle QR at:
  `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/QR_Code_Zelle.png`
  - The image is 345×420 px (portrait, ~0.82:1 aspect ratio). Preserve this aspect ratio — do NOT force it into a square or distort it. Display it at a natural, scannable size that respects the portrait shape (e.g., constrain by width and let height follow, or set an appropriate max-width/max-height that keeps the ratio). On smaller screens it may scale down proportionally, which is fine, but it must never be stretched or squashed.
  - Update the image alt text from the Venmo wording to something like "Zelle QR code for Knights of Columbus #6033".

- **Handle line:** `@presentationknights`  →  **kofc6033@churchofpresentation.org**
  (Display the email as the Zelle identifier. It does not need to be a mailto link here — it's the Zelle recipient handle, shown for reference.)

- **Verification line:** currently "Verify the display name reads 'Presentation Knights — Joe Lupino' before sending."  →  change to: **"Verify the payee reads KNIGHTS OF COLUMBUS before sending."**

- **Instructions paragraph:** currently "Scan the QR with the Venmo app, or search for the handle above. Add a note in the payment indicating whether it's for dues or a donation."  →  replace with:
  **"Open your bank app and look for the 'Pay with Zelle' section, then scan the QR code above. Enter the amount, and in the 'Message to recipient' field, specify whether this is a donation or for the yearly dues."**

## Change 3 — Check for any other Venmo references on the page

Search the Donate page (and any shared components it uses) for remaining mentions of "Venmo" or "presentationknights" and confirm none remain after the changes above. The word "Venmo" should not appear anywhere on the Donate page once done. (Leave the `VenmoKnights.png` file in the repo/storage for now — just stop referencing it.)

---

## Verify before stopping

- Both upper CTA buttons read "Pay with Zelle →" and "Donate with Zelle →"
- The first payment card is titled "Zelle" and shows the new QR (`QR_Code_Zelle.png`), undistorted, preserving its portrait aspect ratio
- The handle line shows kofc6033@churchofpresentation.org
- The verification line reads "Verify the payee reads KNIGHTS OF COLUMBUS before sending."
- The instructions paragraph matches the new Zelle wording exactly
- The "By Check" card is unchanged
- No instance of the word "Venmo" or "presentationknights" remains anywhere on the Donate page
- Mobile (390px): the Zelle QR scales down proportionally (no distortion), the card stacks cleanly above the By Check card
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
