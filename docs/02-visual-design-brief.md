# kofcwebsite — Visual Design Brief

*This document is designed to be pasted into Claude Design as context, alongside the three reference screenshots from kofc.org (KofC_Home.png, KofC_Charity.png, KofC_Officers.png) and the official KofC brand assets.*

---

## Project summary

A presentation website for **Knights of Columbus Presentation Council #6033**, a local Catholic men's fraternal organization serving the Church of the Presentation parish in Upper Saddle River, NJ. Founded 1968. Audience skews 40-80, community-minded, parish-connected. The site introduces the council, showcases charitable work, drives membership and volunteer signups, and accepts donations.

## Aesthetic direction

**Traditional, dignified, welcoming. Not corporate, not startup-flashy, not overly modern.** The visual language should feel like an extension of the national Knights of Columbus brand (see reference screenshots) while staying warm and parish-scaled. Think "a well-made community bulletin given the treatment of a serious institution" — not a glossy marketing site.

Key adjectives: **institutional, serene, faithful, reliable, warm**.

Avoid: dark mode, gradient-heavy hero sections, neon accents, aggressive animations, trendy asymmetric layouts, sans-serif headings, sparse editorial minimalism.

## Color palette

Drawn from the official Knights of Columbus brand and the reference screenshots:

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Navy blue | `#003087` | Headers, primary buttons, H1/H2 text |
| Primary dark | Deeper navy | `#001F5C` | Header background gradient top |
| Accent | KofC gold | `#F2A900` | Primary CTAs ("Donate Now", "Join Now"), underline flourishes |
| Secondary accent | KofC red | `#C8102E` | Sparingly — used for patriotic or urgent callouts only |
| Surface light | Pale blue-grey | `#E8EEF5` | Page section backgrounds (like the hero band on kofc.org) |
| Surface | White | `#FFFFFF` | Card backgrounds, main content |
| Text primary | Near-black | `#1A1A1A` | Body text |
| Text secondary | Cool grey | `#5A6478` | Captions, metadata |
| Border | Light grey | `#D9DEE5` | Card borders, dividers |

The reference pages use navy as the dominant chrome color with gold for accent touches (the short underline below section headings, primary action buttons). Keep that ratio — mostly navy and white, gold used intentionally, red used rarely.

## Typography

**Headings:** A traditional serif that reads as institutional but not stuffy. Something in the family of **Merriweather**, **Source Serif 4**, or **Lora**. The kofc.org screenshots use a serif that feels close to a modernized Baskerville — clean, readable, dignified.

**Body:** A neutral, highly-readable sans-serif. **Inter**, **Source Sans 3**, or **Noto Sans** all work. Avoid geometric/tech-feeling fonts (no Montserrat, no Poppins).

**Size scale** (audience is older, so err toward larger):
- H1: 48-56px, serif, navy
- H2: 32-36px, serif, navy
- H3: 22-24px, serif or sans bold, navy
- Body: 17-18px, sans, dark grey
- Caption/meta: 14-15px, sans, cool grey

**Signature flourish:** Short gold underline (3-4px tall, ~60px wide) sitting just below H2 and H3 headings, left-aligned under the heading text. This is visible across all three reference screenshots and is a key brand identifier.

## Layout principles

- **Generous whitespace** — the reference pages breathe; don't crowd
- **Card-based content sections** — white cards with soft shadow on the pale blue-grey band; rounded corners at 8px
- **Breadcrumb navigation** at the top of every inner page
- **Hero pattern** — photo on one side, text block + CTAs on the other, on a pale blue-grey background band (see Charity reference screenshot for the canonical example)
- **Container width** — max 1280px, centered, with comfortable side padding on desktop
- **Grid** — 3-column on desktop, 2-column on tablet, 1-column on mobile for card grids

## Component patterns

### Header
- Deep navy gradient background (darker at top)
- Top utility bar: thin strip with "Join", "Donate", "Sign In" (if Phase 1B) links, right-aligned, small text
- Main bar: council logo + "Presentation Council #6033" wordmark on left; main nav (Home, About, Officers, Activities, Charities, Calendar) centered or right; search icon far right
- Mobile: hamburger menu that slides in from the right

### Hero (pages other than home)
- Pale blue-grey background band
- Breadcrumb, then H1 page title in serif navy, left-aligned
- Short descriptive subtitle below in body text

### Hero (home)
- Full-width photo behind a subtle dark overlay, OR photo + text split like the Charity reference screenshot
- H1 + short intro + two CTAs (Join, Donate)

### Card (generic)
- White background, 8px rounded corners, subtle shadow (`0 2px 8px rgba(0,0,0,0.06)`)
- Internal padding: 24-32px
- Icon or image at top (when used)
- Serif heading with gold underline flourish
- Body text
- "Learn More" pill button in gold at bottom

### Primary button (CTA)
- Gold background (`#F2A900`), navy text
- 12px × 24px padding
- Rounded corners 4-6px
- Hover: slightly darker gold
- Used for: "Donate Now", "Join Now", "Sign Up", "Learn More"

### Secondary button
- White background, navy border (2px), navy text
- Same dimensions as primary
- Used for: "Our History", "Read More" on inner cards

### Footer
- Light grey or pale navy background
- Four columns: About / Get Involved / Resources / Contact
- Small council logo + address block on the right
- Social icons row above copyright line
- Mirrors the footer pattern in all three reference screenshots

## Imagery direction

- **Warm, authentic photos of members** doing charity work, serving at events, in fraternity — not staged stock photos
- **Minimal filter/color grading** — keep photos natural
- **Respectful framing** — people's faces should be dignified, event photos should feel celebratory rather than performative
- Use the user's supplied photo library (19 event photos + check-presentation photos for charities)

## Iconography

- Line icons, 1.5-2px stroke, navy color
- Heroicons or Lucide style, NOT colorful flat icons
- Used sparingly in card headers and feature callouts

## Motion

- Subtle fade-in on scroll for sections
- No aggressive parallax, no auto-playing video heroes
- Hover states on cards: slight lift (1-2px translateY) with shadow deepening
- Button hover: color shift only, no scaling

## Tone & voice (microcopy)

- Warm and welcoming, not salesy
- Clear and direct, not corporate-jargon
- Faith-forward where appropriate, not preachy
- Examples:
  - ✅ "Join Our Brotherhood" / ❌ "Unlock Your Membership"
  - ✅ "Support Our Charities" / ❌ "Drive Impact Today"
  - ✅ "Next Council Meeting: Wed, Nov 19 at 7:30pm" / ❌ "Upcoming Engagement"

## Pages to generate first in Claude Design

1. **Home page** — highest priority, sets the visual language for everything else
2. **Officers page** — test the card-grid pattern with the uknight.org photos
3. **About page** — test the long-form content layout with the council's actual history and mission text

Once these three feel right, the visual system is established and Claude Code can implement the remaining pages from the requirements spec directly.

## Reference attachments

- `KofC_Home.png` — reference for overall header/hero/card grid / footer pattern
- `KofC_Charity.png` — reference for inner page hero + initiatives card grid
- `KofC_Officers.png` — reference for the officer card grid layout
- Official KofC brand asset folder — logos and emblems
- Council photo library — 19 event photos + check-presentation photos
