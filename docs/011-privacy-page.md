Build out the **Privacy** page at `/privacy`, replacing the current "Coming Soon" stub with full content.

This is a simple, static, plain-English privacy statement. All content is hardcoded in the page component — nothing comes from the database. The site collects no personal information from visitors, so the page is short, but it should read as warm and honest, matching the rest of the site's voice.

---

## Layout

Use the standard `pagehero` pattern from the other inner pages (Officers, About, Calendar), then a single readable content column for the body prose. This is a text page — no cards, no images, no stats strip. Keep it clean and easy to read, with comfortable line length and generous spacing. Section sub-headings in the site's serif navy style; body in the standard sans-serif.

A closing CTA strip is NOT needed here — a privacy page should end quietly. (If the site's footer already provides navigation, that's sufficient.)

## Page hero
- Breadcrumb: Home / Privacy
- H1: "Privacy"
- Subtitle: "How we handle your information — in plain language."

## Body sections (in order)

Render each heading as a sub-section heading, with the paragraph beneath it.

**The short version**
> This website is a simple, public presentation of Knights of Columbus Presentation Council #6033. We don't ask visitors to create accounts, fill out forms, or share personal information to browse the site. We're not in the business of collecting your data.

**What we collect**
> Almost nothing. You can read every page on this site without telling us who you are. We don't use advertising trackers, and we don't sell or share information about our visitors — because we don't gather it in the first place.

**A note on technical basics**
> Like nearly every website, our site is hosted on servers (provided by Vercel) that keep standard technical logs — things like the general request information every web server records. We don't use this to identify you, and we don't combine it with anything else. If we ever add visitor analytics in the future, we'll update this page to say so.

**Links to other sites**
> Our site includes links to trusted outside services — for example, the official Knights of Columbus join page, Venmo for donations, our volunteer signup page, Google Maps for event locations, and the websites of the charities we support. Once you follow one of those links, you're on someone else's site, and their privacy practices apply, not ours. We'd encourage you to review their policies if you have questions.

**Information about our officers**
> Our Officers page lists the names, roles, and contact email of council officers. This information is published with their knowledge, so that members and parishioners can reach the council. If you're an officer and would like your information updated, just let us know.

**Council administrators**
> A small number of council officers can sign in to manage the site's content. We store only what's needed for them to log in securely. This doesn't involve any information from general visitors.

**Questions?**
> If you have any questions about this site or how we handle information, email us at kofc6033@churchofpresentation.org — we're happy to help.

## Footer line
Below the last section, a small, de-emphasized line:
> Last updated: June 2026

## Detail

- The email `kofc6033@churchofpresentation.org` in the "Questions?" section must be a working `mailto:` link.
- The footer "Privacy" link should already point to `/privacy`; confirm it now resolves to this real page rather than the stub.

## Verify before stopping

- The page renders with the hero and all seven sections in order
- The email is a working mailto: link
- "Last updated: June 2026" appears at the bottom, visually de-emphasized
- The footer "Privacy" link resolves to the real page (no longer the stub)
- Mobile viewport (390px): text is readable, comfortable line length, no overflow
- No console errors, no new 404s

Build, verify locally with `npm run dev`, hard-refresh to clear the `.next` cache, and stop for review.
