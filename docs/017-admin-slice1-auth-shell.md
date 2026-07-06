# Admin UI — Slice 1: Authentication, Route Protection, RLS, and Admin Shell

This is the FIRST of three slices building the admin UI for the kofcwebsite. Slice 1 builds the **security foundation and the empty admin shell** — login, route protection, database RLS hardening, and the admin layout/dashboard. **No content editing (Events/Officers/Charities CRUD) is built in this slice** — that comes in Slice 2. The deliverable is: an admin can log in, is blocked if not authorized, lands on a dashboard, and can log out — inside a proper admin shell.

This slice is security-critical. Prioritize correctness and defense-in-depth over speed. Ask before proceeding if anything about the auth or RLS design is ambiguous.

## Context / current state

- Next.js (App Router, TypeScript, Tailwind) + Supabase + Vercel. `@supabase/ssr` is installed.
- The public site is complete and lives under a `(public)` route group (or the current top-level structure — inspect and confirm). The admin area must NOT inherit the public layout (header, footer, golf banner).
- Supabase schema already has a `profiles` table with a `role` column (`viewer` / `admin`), an `is_admin()` helper function, and a trigger creating a profile row on new auth user signup. Confirm these exist before relying on them.
- A first admin account has been created manually in Supabase (auth user + `profiles.role = 'admin'`), so login can be tested.

## Part 1 — Route structure & admin shell

Create the admin area under `/admin`, structurally separated from the public site with its OWN layout (route group or dedicated `admin/layout.tsx`) so it does not inherit the public header/footer/golf banner.

Routes for this slice:
```
/admin              → dashboard landing (protected)
/admin/login        → login screen (public — the only unprotected /admin route)
```
(The /admin/events, /officers, /charities routes come in later slices — sidebar links to them can exist but may point to placeholder "coming soon" states or be visually present but inert for now. Use your judgment; do not build their CRUD.)

**Admin shell** (the layout wrapping all protected admin pages):

- **Left sidebar** with navigation items: Dashboard, Events, Officers, Charities. Only Dashboard is functional this slice; the others are visible (this is the intended final nav) but lead to placeholder/coming-soon pages. Style the sidebar cleanly and app-like.
- **Top bar**, adapted from the existing public header component but stripped down:
  - Left: a wordmark "KofC 6033 · Admin" (or emblem + "Admin") that links to `/admin` (the dashboard).
  - Right: a **Preview** button that opens the public site homepage (`/`) in a new tab (`target="_blank" rel="noopener noreferrer"`), and a **Log out** button that shows a confirmation ("Log out of the admin?") before signing out.
  - Remove all public nav links (Home/About/Officers/Calendar/Activities/Charities) and the public Join/Donate CTAs.
- **A persistent gold banner** (reuse the visual slot/style of the existing golf announcement banner) that always reads: **"ADMIN MODE — logged in as [name/email]"**. This must appear on every protected admin page as an unmistakable "you are editing" indicator. Use the logged-in user's display name (from `profiles`) or email.
- Use the site's navy/gold palette and fonts so it feels related to the public site, but with a clearly distinct admin feel (e.g., a different background tone) so it is never mistaken for the live public site.

**Dashboard** (`/admin`): a simple welcome landing — "Welcome, [name]" and three clear cards/links to Events, Officers, Charities (functional once their slices exist). Keep it clean and unintimidating; this is the home base for non-technical (but capable) officer-admins.

## Part 2 — Authentication

Use Supabase Auth via `@supabase/ssr` (the SSR-friendly cookie-based session pattern for Next.js App Router — NOT the deprecated auth-helpers).

**Login screen** (`/admin/login`):
- Primary method: **email + password**.
- Alternative method: **email OTP** — an option like "Email me a login code instead" that sends a one-time code to the entered email (Supabase `signInWithOtp`), then a screen to enter the 6-digit code. Both methods land the user in the same authenticated session.
- A **"Forgot password?"** link that triggers Supabase's `resetPasswordForEmail` flow.
- Plain-language error messages ("That email or password doesn't match," "That code isn't right or has expired") — never raw Supabase errors.
- After successful login, redirect to `/admin` (the dashboard).
- Use Supabase's default session length/expiry (do not customize session duration in this slice).

**Password reset handling:** implement the reset-password callback page so the "forgot password" email link lands somewhere that lets the user set a new password.

**Note on the invite/first-login flow:** other admins will later be invited via Supabase (they set their own password on first login). For THIS slice, only the already-created admin account needs to work. But build the login/reset flows in a way that will also work for invited users setting a password for the first time (i.e., handle the Supabase recovery/invite token landing).

## Part 3 — Route protection (the security perimeter)

Implement middleware (Next.js `middleware.ts`) that protects all `/admin/*` routes EXCEPT `/admin/login` and the password-reset callback:

- If the request is not authenticated → redirect to `/admin/login`.
- If authenticated but the user is NOT an admin (their `profiles.role` is not `'admin'`) → deny access (redirect to login or a clear "not authorized" state; do not let non-admins into the admin UI).
- Authenticated admins → allow through.
- Refresh the Supabase session in middleware per the `@supabase/ssr` recommended pattern so sessions stay valid.

The admin/not-admin check must rely on the actual `profiles.role` / `is_admin()` source of truth, not on anything client-controlled.

## Part 4 — Database RLS hardening (defense in depth)

Independently of the UI/route protection, lock down the database so unauthorized writes are rejected at the data layer even if someone bypassed the UI. Review the current RLS policies on the content tables (`events`, `officers`, `charities`, `photos`, and any others that back the public site) and ensure, for each:

- **Public read:** anonymous/public users can SELECT only published rows (`is_published = true`) — this must not break the existing public site, which currently reads these tables.
- **Admin write:** INSERT / UPDATE / DELETE are allowed ONLY for authenticated users where `is_admin()` is true. No writes for anon or non-admin authenticated users.
- Confirm `profiles` policies are sane: a user can read their own profile; role changes are not something a normal admin can do to themselves via the app (role management stays a manual Supabase task).

If policies already exist from earlier work, verify they match the above and tighten anything that's too permissive. Report what you found and what you changed. **Do not weaken any existing public-read behavior that the live site depends on** — the public pages must continue to render after this.

## What NOT to do in this slice
- Do NOT build Events/Officers/Charities create/edit/delete forms or list tables (that's Slice 2+).
- Do NOT build a user-management UI (admins are provisioned manually in Supabase).
- Do NOT customize session duration.
- Do NOT add any link to `/admin` from the public site (admins reach it by direct URL/bookmark).

## Verify before stopping
- Visiting `/admin` while logged out redirects to `/admin/login`.
- Logging in with the test admin's email + password succeeds and lands on `/admin` with the shell (sidebar, top bar, gold "ADMIN MODE — logged in as ..." banner) visible.
- The email-OTP alternative works: requesting a code emails one, and entering it logs in.
- "Forgot password" sends a reset email that lands on a working set-new-password page.
- Log out (with confirmation) returns to a logged-out state; `/admin` is protected again afterward.
- A non-admin (if you can test one) or logged-out user cannot reach any protected `/admin` page.
- The public site still renders correctly (RLS public-read intact) — spot check the homepage, /calendar, /officers, /charities.
- Attempting a write to a content table as anon/non-admin is rejected by RLS (note how you verified this).
- The admin shell does NOT show the public header/footer/golf banner; the public site does NOT show admin chrome.
- No console errors on either the admin or public side.

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review. Report clearly what RLS policies existed vs. what you changed, and note anything about the auth setup I should verify in the Supabase dashboard (e.g., email templates, redirect URLs).

**Important — auth redirect URLs:** Supabase Auth requires configured redirect URLs for OTP/reset/invite links to work. Note in your summary which redirect URLs I need to add in the Supabase dashboard (Authentication → URL Configuration) for local dev (localhost:3000) and production (the real domain), so the email links resolve correctly.
