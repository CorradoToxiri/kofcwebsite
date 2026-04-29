# kofcwebsite — Requirements & Architecture Spec

**Project:** Knights of Columbus Presentation Council #6033 Website
**Council:** Presentation Council #6033
**Parish:** Church of the Presentation
**Location:** 271 West Saddle River Road, Upper Saddle River, NJ 07458
**Founded:** March 10, 1968
**Stack:** Next.js (App Router, TypeScript, Tailwind) + Supabase + Vercel
**Repo:** github.com/[owner]/kofcwebsite
**Local path:** C:\Users\corra\Documents\DevProjects\kofcwebsite

---

## 1. Goals

Build a presentation-quality website for Council #6033 that (a) introduces the council to prospective members and the parish community, (b) drives signups for volunteer activities and events, (c) accepts donations and dues payments, and (d) scales into a lightweight CMS and a full volunteer signup system over three phases.

## 2. Phasing

### Phase 1A — Public presentation site (ship first)
All public-facing pages. Content lives in Supabase but is seeded manually via Supabase Studio or SQL. No admin UI, no auth. This is what goes live.

### Phase 1B — Admin UI
Supabase Auth with role-based access. Protected `/admin` routes with forms to create/edit events, news, officers, activities, and charities. Enables 2-3 officers to maintain the site without developer involvement.

### Phase 2 — Volunteer signup system
Activities with configurable time slots and role assignments, public signup with hidden contact info, organizer reminders, printable rosters for authorized users. Replaces the council's current use of signup.com.

### Phase 3 — Golf outing registration
Golfer registration (single/double/foursome), sponsor registration, Venmo QR payment flow. Requirements to be detailed closer to build time.

---

## 3. Information Architecture

### Top navigation
- **Home** — `/`
- **About** — `/about`
- **Activities** — `/activities`
- **Charities** — `/charities`
- **Officers** — `/officers`
- **Calendar** — `/calendar`
- **Join** — `/join` (CTA, styled prominently)
- **Donate** — `/donate` (CTA, styled prominently)

### Footer
Three or four columns:
- **About** — links to About, Officers, History, Mission
- **Get Involved** — links to Join, Donate, Calendar, Volunteer Signup (external, Phase 1A)
- **Resources** — links to kofc.org, NJ State Council, Church of the Presentation, Supreme Council
- **Contact** — council mailing address, insurance agent contact, social icons

### URL structure
```
/                          Home
/about                     About the council
/officers                  Council officers grid
/activities                Volunteer activities overview
/activities/[slug]         Individual activity detail (optional for 1A)
/charities                 Supported charities
/calendar                  Full calendar of events
/join                      How to join
/donate                    Donate / pay dues
/admin                     (Phase 1B) Admin login
/admin/events              (Phase 1B) Manage events
/admin/officers            (Phase 1B) Manage officers
/admin/news                (Phase 1B) Manage news posts
```

---

## 4. Page-Level Requirements

### Home page (`/`)
- **Header** with council logo + name, top nav, Join/Donate CTAs
- **Hero** — image of council members in action (e.g., charity work), short intro ("Presentation Council #6033 — Catholic men building a bridge back to faith"), primary CTAs: "Join the Knights" and "Donate"
- **Next Meetings bar** — "Next Officers' Meeting: [date] | Next Council Meeting: [date]" (pulled from `events` table where `event_type = 'officers_meeting' | 'council_meeting'`)
- **Upcoming Volunteer Activities** — 2-3 cards showing the next volunteer opportunities, each with image, title, date, "Sign Up" link (external to signup.com for Phase 1A). Includes a "Download Full Calendar (PDF)" link and "See All Activities" link.
- **Mission callout** — short statement of mission, pulled from About page content
- **Quick links strip** — Join, Donate, Full Calendar, Volunteer Signup
- **Footer**

### About page (`/about`)
- Hero with page title
- Council history (the founding date, 50+ year narrative)
- Mission statement (the four pillars: Charity, Unity, Fraternity, Patriotism)
- Primary meeting location + mailing address
- Parish served (Church of the Presentation, with link)
- Insurance field agent contact card

### Officers page (`/officers`)
- Grid of officer cards, styled like the "Our Leadership" screenshot from kofc.org
- Each card: photo, name, title (e.g., "Grand Knight"), optional "Read More" for bio
- **Initial implementation:** photos pulled from uknight.org/CouncilSite; self-host them in Supabase Storage as a later upgrade
- Two tabs or sections: **Council Officers** and **Trustees/Directors** (if applicable)

### Activities page (`/activities`)
- Static presentation of typical annual activities (golf outing, pancake breakfast, Lenten fish fry, Christmas Dinner Dance, charity work)
- Each activity: title, description, hero photo, gallery of past-event photos (from Corrado's 19-photo collection)
- Designed to convey "this is what we do" to prospective members

### Charities page (`/charities`)
- Grid of supported charities: Covenant House Newark, Nova Hope for Haiti, Presentation Food Pantry, Angels Among Us, Right to Life, Catholic schools, scholarships
- Each charity: logo/image, short description, optional photo of check presentation
- Layout similar to the "Charitable Initiatives" card grid from the kofc.org/Charity screenshot

### Calendar page (`/calendar`)
- Full calendar view (month view + list toggle) pulling from `events` table
- Event detail: title, date, time, location, description, signup link (if applicable)
- Filter by event type (meetings, volunteer activities, social events, charity events)
- "Download PDF calendar" button

### Join page (`/join`)
- Clear explanation of membership benefits
- Step-by-step instructions to join online (link to kofc.org/join form with council #6033 referral code)
- Contact info for the Membership Director

### Donate page (`/donate`)
- Venmo QR code (prominent, scannable)
- Explanation of what dues/donations fund
- Link to online payment alternative if available
- Annual dues amount

---

## 5. Data Model (Supabase — Phase 1A)

See `03-supabase-schema.sql` for the actual DDL. High-level tables:

| Table | Purpose | Phase |
|---|---|---|
| `officers` | Council officer roster with photos and bios | 1A |
| `events` | All events: meetings, volunteer activities, socials, charity events | 1A |
| `news` | News posts and announcements for homepage and news feed | 1A |
| `activities` | The recurring annual activities showcased on `/activities` | 1A |
| `charities` | Supported charities for `/charities` | 1A |
| `photos` | Photo library with captions, tied to activities/charities | 1A |
| `profiles` | User profiles for admin users (extends Supabase `auth.users`) | 1B |
| `signup_slots` | Time slots and role assignments for a volunteer activity | 2 |
| `signups` | Individual signups against a slot | 2 |

**RLS strategy:** All public-read tables (everything in 1A) allow anonymous SELECT. Mutations (INSERT/UPDATE/DELETE) are locked to authenticated users with `role = 'admin'` in the `profiles` table. Policies are stubbed in Phase 1A and enforced in Phase 1B.

**Storage buckets:**
- `public-photos` — officer headshots, activity photos, charity images (public read)
- `documents` — PDF calendar, bulletin archives (public read)
- `admin-uploads` — staging area for photos before publishing (authenticated write)

---

## 6. Integrations & External Services (Phase 1A)

- **Signup.com** — existing volunteer signup system, linked externally until Phase 2 replaces it
- **Venmo** — QR code image on Donate page; no API integration
- **kofc.org** — referral link for the Join flow
- **Google Maps** — embed for meeting location on About and footer
- **Google Calendar** — optional export/subscribe link from Calendar page

## 7. Non-Functional Requirements

- **Responsive** — mobile, tablet, desktop; audience skews 40-80, so generous tap targets and body text ≥ 16px
- **Accessible** — WCAG AA contrast, semantic HTML, alt text on all photos
- **Performant** — Next.js image optimization, lazy-loading, Vercel edge caching
- **SEO** — proper meta tags, structured data for events, sitemap.xml, Open Graph images
- **Fast to update** — content in Supabase so additions don't require a redeploy

## 8. Out of Scope for Phase 1A

- Volunteer signup system (Phase 2)
- Golf outing registration (Phase 3)
- Member directory / member-only content (future)
- Prayer request submission form (future)
- Multi-language support
- Online dues payment processing beyond Venmo QR
- Email newsletter system

---

## 9. Handoff Plan

1. This doc + `02-visual-design-brief.md` → used in Claude Design to generate homepage and a couple of key inner pages
2. `03-supabase-schema.sql` → executed in Supabase Studio to create tables and policies
3. Claude Design handoff bundle → sent to Claude Code running in the `kofcwebsite` folder
4. Claude Code scaffolds pages, wires Supabase, implements the design
5. Seed data added via Supabase Studio; site goes live on Vercel
6. Iterate on Phase 1A for 1-2 weeks until stable
7. Begin Phase 1B (admin UI) as a separate focused sprint
