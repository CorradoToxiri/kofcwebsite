# Privacy Page — Content Inventory

Finalized content for the kofcwebsite `/privacy` page. Source of truth for the copy.
Developed collaboratively, May 2026. Launch: June 2026.

**Concept:** A plain-English, honest privacy statement. The site collects no personal
information from visitors (no public accounts, no forms storing data). The page is simple
but accurate — it acknowledges hosting logs, third-party links, published officer info, and
the forthcoming admin login, rather than over-promising "we collect nothing."

**Storage:** Hardcoded page furniture. Nothing from the database.

**Context for why this page is simple:**
- Phase 2 (volunteer signup) is deferred — the Calendar page links out to signup.com for now.
- Phase 3 (golf registration) will be a static page with links/QR codes to the existing
  external registration, not an on-site form.
- So the public site collects no personal data at launch.

---

## Page hero (standard pagehero component)

- **Breadcrumb:** Home / Privacy
- **H1:** Privacy
- **Subtitle:** How we handle your information — in plain language.

## Body content (hardcoded prose sections)

### The short version
> This website is a simple, public presentation of Knights of Columbus Presentation Council #6033. We don't ask visitors to create accounts, fill out forms, or share personal information to browse the site. We're not in the business of collecting your data.

### What we collect
> Almost nothing. You can read every page on this site without telling us who you are. We don't use advertising trackers, and we don't sell or share information about our visitors — because we don't gather it in the first place.

### A note on technical basics
> Like nearly every website, our site is hosted on servers (provided by Vercel) that keep standard technical logs — things like the general request information every web server records. We don't use this to identify you, and we don't combine it with anything else. If we ever add visitor analytics in the future, we'll update this page to say so.

### Links to other sites
> Our site includes links to trusted outside services — for example, the official Knights of Columbus join page, Venmo for donations, our volunteer signup page, Google Maps for event locations, and the websites of the charities we support. Once you follow one of those links, you're on someone else's site, and their privacy practices apply, not ours. We'd encourage you to review their policies if you have questions.

### Information about our officers
> Our Officers page lists the names, roles, and contact email of council officers. This information is published with their knowledge, so that members and parishioners can reach the council. If you're an officer and would like your information updated, just let us know.

### Council administrators
> A small number of council officers can sign in to manage the site's content. We store only what's needed for them to log in securely. This doesn't involve any information from general visitors.

### Questions?
> If you have any questions about this site or how we handle information, email us at kofc6033@churchofpresentation.org — we're happy to help.

### Footer line
> *Last updated: June 2026*

---

## Notes

- The "Council administrators" section is included now even though the admin UI (Phase 1B)
  isn't live yet. It's accurate forward-looking language and avoids a later edit. If preferred,
  it could be trimmed until Phase 1B ships — but Corrado chose to keep it.
- The email `kofc6033@churchofpresentation.org` should be a working `mailto:` link.
- "Last updated: June 2026" reflects the launch month.
