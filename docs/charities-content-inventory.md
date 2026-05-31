# Charities Page — Content Inventory

Finalized content for the kofcwebsite `/charities` page. This is the source of truth
for all copy, images, links, and structure. Developed collaboratively, May 2026.

**Page structure (four tiers):**
1. Parish anchor block (hardcoded page furniture)
2. Major parish ministries — full cards from `charities` table (`category = 'parish_major'`)
3. Minor parish ministries — compact list (hardcoded in page)
4. External charities — full cards from `charities` table (`category = 'external'`)
5. Closing block (hardcoded page furniture)

**Storage decisions:**
- Only the 5 full-card charities (3 parish_major + 2 external) live in the `charities` table.
- Minor ministries, anchor block, and closing block are hardcoded in the page component.
- The `category` column allows only `parish_major` and `external` (the two values actually used). `parish_minor` was considered but dropped, since minor ministries are hardcoded rather than stored. A value can be added back later with a one-line alter if that decision changes.

---

## 1. Parish anchor block — HARDCODED

**Eyebrow:** Our parish home
**Heading:** Everything begins at Presentation.
**Image:** `CoP_2-1.jpg` (Supabase public-photos bucket)
**Link:** https://www.churchofpresentation.org/

**Body:**
> We are Catholic men gathering to serve our parish, support our neighbors in need, and grow as husbands, fathers, and disciples. Most of what we do flows through the ministries of Church of the Presentation — the parish that has been our home since 1968. When the parish has a need, the Knights are there: in the kitchen, on the mission field, and alongside our young people.

---

## 2. Major parish ministries — DATABASE (`category = 'parish_major'`)

### 2.1 Soup Kitchen Ministry
- **short_description:** Feeding the hungry in Newark and Harlem — and seeing the face of Jesus in those we serve.
- **body:** The Soup Kitchen Ministry lives out the call of the Gospel by feeding the poor — seeing in every guest someone hungry not only for food, but for love and compassion. Each week, teams prepare meals in the parish kitchen and deliver them to soup kitchens in Newark and Harlem, serving guests through the year and at every holiday. The Knights proudly cover their own shifts several times a year, cooking and serving alongside our parish family.
- **external_url:** https://www.churchofpresentation.org/soup-kitchen/
- **photo:** `hero.png`
- **sort_order:** 1

### 2.2 Haiti Medical Mission
- **short_description:** A parish mission that grew into a year-round medical clinic in Cavaillon, Haiti.
- **body:** What began in 2002 as a parish twinning relationship became one of Presentation's proudest works. Volunteer medical teams once traveled to Haiti to care for over a thousand people a week; today that mission has grown into NOVA Hope for Haiti, an independent charity that has run a permanent clinic in Cavaillon since 2014 — staffed by doctors, nurses, and pharmacists 52 weeks a year. The parish still sends volunteer teams, and the Knights support the events that fund the mission, contributing $2,000 this past year.
- **external_url:** http://www.novahope.org/
- **photo:** `CoP_nova.jpg`
- **sort_order:** 2

### 2.3 Youth Ministry
- **short_description:** Walking with our parish's young people as they grow in faith, friendship, and service.
- **body:** Presentation's Youth Ministry gives young people a community where they can grow in faith and build friendships that last a lifetime. The Knights are proud to support it in hands-on ways: serving breakfast at the Antioch Retreat, cooking alongside the youth groups at the Parish Pancake Breakfast, and this year sponsoring three winners of a Youth Essay Contest — an initiative inviting our young parishioners to reflect on their faith, values, and community through writing.
- **external_url:** https://www.churchofpresentation.org/youthministry/
- **photo:** `CoP_youth.jpg`
- **sort_order:** 3

---

## 3. Minor parish ministries — HARDCODED (compact list)

**Section heading:** Other Parish Ministries We Support
**Shared section image:** `CoP_volunteer.jpg`

- **Parish Food Pantry** — A pantry of food and household essentials for local families facing financial hardship; the Knights help fund it through events like the Parish Pasta Dinner.
- **Thanksgiving Turkey Drive** — Each November, the council collects frozen turkeys for local families in need and for the Soup Kitchen's Thanksgiving dinner, with members donating turkeys at the November meeting.
- **Packathon** — A yearly food-packing event at Presentation, organized with Haiti Health Promise of Holy Name (Teaneck), benefiting the people of Milot, Haiti; the Knights handle setup and cleanup and sponsor a packing team.

---

## 4. External charities — DATABASE (`category = 'external'`)

### 4.1 Covenant House New Jersey
- **short_description:** Walking with young people facing homelessness and survivors of human trafficking.
- **body:** Covenant House New Jersey helps young people facing homelessness and survivors of human trafficking begin a new chapter in their lives. The Knights support their work in several ways: a yearly $2,000 donation to sponsor their scholarship program, participation in the "Sleep Out" fundraiser, and serving Thanksgiving dinner each year to more than 100 guests — donating the food and serving it ourselves.
- **external_url:** https://covenanthousenj.org/
- **photo:** `CHNJ.jpg`
- **sort_order:** 10

### 4.2 Upper Saddle River Volunteer Ambulance Corps
- **short_description:** Neighbors answering the call when our community needs help most.
- **body:** Formed in 1958 by borough residents who wanted to help others in their time of greatest need, the Upper Saddle River Volunteer Ambulance Corps has served our community for more than sixty years. The Knights are proud to support their work with financial contributions, helping equip the volunteers who answer that call for our neighbors.
- **external_url:** https://www.usrems.org/home
- **photo:** `USR Ambulance.jpg`
- **sort_order:** 11

---

## 5. Closing block — HARDCODED

**Eyebrow:** And many more
**Heading:** The work doesn't stop here.

**Body:**
> Beyond the ministries and organizations above, Council #6033 supports a wide range of causes throughout the year — among them groups serving abused women and single mothers, Lighthouse pregnancy services, and Special Olympics New Jersey. Wherever there is a need in our parish or our community, the Knights look for a way to help.

---

## Related homepage fix

The homepage 2025 Impact section currently labels a stat "Covenant House Newark." Change to
"Covenant House New Jersey" for sitewide naming consistency. The $2,000 figure is correct and
unchanged — it's the scholarship donation referenced in the Covenant House card body above.

---

## Image filename reference (all in Supabase `public-photos` bucket)

| Image | Used for |
|---|---|
| `CoP_2-1.jpg` | Parish anchor block |
| `hero.png` | Soup Kitchen (also the homepage hero image) |
| `CoP_nova.jpg` | Haiti Medical Mission |
| `CoP_youth.jpg` | Youth Ministry |
| `CoP_volunteer.jpg` | Minor ministries shared section image |
| `CHNJ.jpg` | Covenant House New Jersey |
| `USR Ambulance.jpg` | USR Volunteer Ambulance Corps |

Note: `USR Ambulance.jpg` contains a space in the filename. When referencing it in code or
URLs, the space must be URL-encoded as `%20`. Consider renaming the file to `USR_Ambulance.jpg`
in Supabase to avoid encoding issues.

Note: `hero.png` is shared with the homepage hero. Reusing it on the Soup Kitchen card is fine
for launch; consider a distinct soup-kitchen photo later so the same image doesn't appear twice
to a visitor moving from Home to Charities.
