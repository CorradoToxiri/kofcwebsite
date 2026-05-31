Add a new **"Online Payment"** section to the Golf Outing page (`/golfouting`). It introduces a Zelle payment option for golfers and sponsors, with a worked example screenshot.

## Placement

Insert the new section **after the two existing registration cards** ("Register to Play" and "Become a Sponsor") and **before the "Download the Brochure (PDF)" button.** The page flow becomes: register cards → Online Payment section → brochure download → contact line.

## Section structure

- A section heading: **"Online Payment"** (use the same section-heading treatment as "Register today." above it — eyebrow + serif heading style, whatever the existing pattern is).
- Below the heading, **two cards side by side** (matching the visual style and layout of the existing two registration cards above — same card component, same widths, same gap). On mobile they stack vertically, left card first.

### Left card — "Pay with Zelle"

This reuses the Zelle card content from the Donate page, with one omission.

- **Card heading:** "Pay with Zelle"
- **QR code image:** `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/QR_Code_Zelle.png`
  - This is the same Zelle QR used on the Donate page: 345×420 px, portrait. Preserve the aspect ratio — do not distort or force square. Display at the same scannable size used on the Donate page Zelle card. Alt text: "Zelle QR code for Knights of Columbus #6033".
- **Handle line:** kofc6033@churchofpresentation.org (shown as the Zelle recipient identifier; not a mailto link)
- **Verification line:** "Verify the payee reads KNIGHTS OF COLUMBUS before sending."
- **IMPORTANT — omit the message-field instruction here.** The Donate page version ends with a sentence beginning "Open your bank app... Enter the amount, and in the 'Message to recipient' field..." — on THIS golf page, keep the "Open your bank app and look for the 'Pay with Zelle' section, then scan the QR code above." opening instruction, but do NOT include the "Enter the amount, and in the 'Message to recipient' field, specify whether this is a donation or for the yearly dues" sentence. That guidance is replaced by the right card's golf-specific version.

### Right card — "Example Payment"

- **Card heading:** "Example Payment"
- **Image:** `https://vsmwjkqqoqatkoalslci.supabase.co/storage/v1/object/public/public-photos/Example_Zelle_Payment.png`
  - Same dimensions as the Zelle QR (345×420, portrait). It's a screenshot of a text/payment screen, so preserving the aspect ratio and avoiding distortion is especially important — distortion would make the example text hard to read. Display at the same size as the QR in the left card so the two cards are visually balanced.
  - Alt text: "Example of a completed Zelle payment screen".
- **Text below the image:** "Enter the amount, and in the 'Message to recipient' field, add your name and specify whether this is a sponsorship or a payment for the golfer fees."

## Visual balance

The two new cards should mirror each other: same card style, same image display size (both images are 345×420 portrait), headings aligned, and the explanatory text positioned consistently. The goal is a clean "scan here / here's what it looks like" pairing.

## Notes

- Use Next.js `<Image>` for both images. The Supabase `public-photos` domain is already in `next.config.ts` remotePatterns.
- Do not change the existing registration cards, the brochure button, the contact line, the banner, or anything else on the page — only insert the new Online Payment section in the specified location.

## Verify before stopping

- The "Online Payment" section appears after the two registration cards and before the brochure download button
- Left card "Pay with Zelle": shows the Zelle QR (undistorted, portrait), the email handle, the "Verify the payee reads KNIGHTS OF COLUMBUS" line, and the opening "Open your bank app..." instruction — but NOT the "Enter the amount / Message to recipient" dues-or-donation sentence
- Right card "Example Payment": shows the example screenshot (undistorted, portrait, same size as the QR) with the golf-specific message-field instruction beneath it
- The two cards are visually balanced and side by side on desktop, stacked on mobile (left/"Pay with Zelle" first)
- Both images preserve their 345×420 aspect ratio at all screen sizes
- Nothing else on the page changed
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
