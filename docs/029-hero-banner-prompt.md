# Animated homepage hero (replace static hero on Home)

## Goal
Replace the current Home page hero section with an animated hero component. The reference implementation is `docs/reference/hero-banner.html` (self-contained HTML/CSS/JS). Port it to a React client component; keep the visual behavior, not the exact code.

## Component
- New file: `src/components/HeroBanner.tsx` (`"use client"`), used in place of the existing hero markup on `src/app/page.tsx`.
- Drop the existing "Presentation Council · Est. 1968" eyebrow pill (the site header already carries the name). Keep the H1 with italic "fraternity", lede, two CTAs to `/join` and `/charities` and the three stats (58 / 100+ / $31K). Pull stats from `site_settings` if they already live there; otherwise hard-code as today.
- Scope all styles to the component (CSS module or a page-scoped `<style>` block). If using a scoped `<style>` block, any `@media` override must come AFTER the base rule for the same selector.

## Behavior to reproduce
1. **Background photo cross-fade**: stack of Supabase `public-photos` images, in this order: `hero.png`, `Activities_service1.jpg`, `Activities_faith1.jpg`, `Activities_service2.png`, `Activities_signature1.jpg`, `Activities_faith2.jpg`, `CoP_volunteer.jpg`, one visible at a time, 1.8s opacity fade every 7s, slow Ken Burns zoom (scale 1.04 → 1.14 over 9s). Use `next/image` with `fill`, `sizes="100vw"`, `priority` on the first image only; lazy-load the rest. Navy gradient scrim over photos (left side darker for text legibility).
2. **Headline word-rise** on first load (0.07s stagger, 0.9s each).
3. **Four Principles ticker** below the CTAs: roman numeral I–IV + name + one line + stat, auto-advancing every 5.2s with a 4-segment progress bar; hover/click a segment jumps to it and pauses auto-advance for 9s.
4. **Stat counters** count up once on mount (1.6s ease-out, 0.9s delay).

## Constraints
- `prefers-reduced-motion: reduce`: no Ken Burns, no auto-advance, no counters, headline renders immediately.
- Clean up every rAF, interval and timeout on unmount.
- No layout shift: the hero's height must not change as ticker text swaps (reserve min-height for the text block).
- Ticker must be keyboard-accessible (segments are buttons with `aria-label`, visible focus ring) and the text container `aria-live="polite"`.

## Stop
Build, verify locally, stop for review.

## Checks (non-visual)
- Lighthouse on `/` (mobile): CLS stays < 0.05 and LCP is not worse than the current hero.
- React StrictMode double-mount does not leave two photo/ticker timers running.
- Supabase image host is already allowed in `next.config` `images.remotePatterns`; do not add a second entry.
