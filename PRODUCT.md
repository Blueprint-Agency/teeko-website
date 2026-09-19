# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (Next.js 16 frontend, Express backend, Postgres; mobile-first)

## Users

**Primary: an inbound tourist landing at KLIA2, on a phone, before or just after landing.**
They need three things in this order: a way from the airport to where they are staying, a
working SIM, and somewhere to eat. They may not read English as a first language (client
target: English, Bahasa Malaysia, Chinese). They are mid-trip, not researching; every extra
tap between them and a booked bus or taxi is a lost lead.

Secondary: returning visitors checking their SIM booking, points or streak; blog readers
arriving from search for a restaurant or destination query; admins editing content.

## Product Purpose

teeko.ai is the public web presence of the Teeko travel brand, operated by GM Ai Tours Sdn Bhd.
Its job, as of the client's 2026-09-19 instruction, is to **lead the visitor to book bus and
taxi transport at ttklia.com**, the group's KLIA2 transport hub. Restaurant discovery, the free
travel SIM and the blog are how the visitor arrives and what earns their trust; transport is
where the value is.

This is a **new strategy**. The site today has no link to ttklia.com; building that path is
OPEN-ITEMS #1. Until it lands, success is measured by SIM bookings, account creation and
external restaurant reservation clicks, in that order.

## Positioning

What the site can truthfully say, in priority order. Nothing beyond this has been supplied.

1. **One group, the whole arrival.** Transport from KLIA2 (ttklia.com), a SIM collected at
   KLIA2, and places to eat, from the same people. The connection between the three is the
   only claim a generic SIM counter or transfer site cannot copy.
2. **Collect at the airport.** SIM booking is confirmed online and collected on landing at
   KLIA2 with a QR code. Concrete, verifiable, and the reason the hero CTA exists.
3. **Restaurants with real third-party ratings.** Listings carry Google and TripAdvisor
   figures, not Teeko's own star ratings.

Deliberately not positioning: app.teeko.ai (the AI chatbot). It is linked, not led with.

## Operating Context

- Legal operator, address, emails: `fe/src/lib/business.ts`. The registered office is a
  company address in Kota Damansara, not a walk-in location; the only physical touchpoint the
  site implies is SIM collection at KLIA2.
- Sister properties: ttklia.com (bus, taxi, car charter, tours; EN/ZH/MS) and app.teeko.ai.
- Phone and hours appear only in the copied `/terms` and are **unconfirmed** (OPEN-ITEMS #3).
- Content is edited in the admin panel and stored in Postgres. Source code holds chrome and
  legal pages only.
- Deploys: `staging` branch to staging.teeko.ai, `main` to teeko.ai, Docker on a VPS. Site-wide
  indexing is a database switch (`settings.googleIndexing`, default off).

## Capabilities and Constraints

**Confirmed functionality**

- **Restaurant directory**: `/restaurants` (paginated, filterable) and `/restaurant/[slug]`.
  Rows are keyed to a TripAdvisor location and carry description, cuisine, address, price
  range (`$`..`$$$`), contact info, hours, images, Google and TripAdvisor stats, imported
  reviews and short videos. Reservation is an external link (`reservationUrl`, else Google
  Maps) and awards points.
- **Travel SIM**: `/travel-sim-malaysia` and `/travel-sim-malaysia/[slug]`, fed from
  `simProviders`, `simPackages`, `simContentTemplates`. Price is a string (`RM0` renders as
  FREE), plus duration, `about`, `features`, optional external `ctaLink`. Booking is internal:
  sign in, choose a KLIA2 collection date, receive a 12-character code and QR; admin marks
  collection at `/admin/sim/bookings`. Fires a GA4 `purchase` event.
- **Blog**: `/blog` and `/blog/[slug]`, block-based content that can embed a location carousel
  or a restaurant card; paste-aware admin editor.
- **Accounts**: email + 6-digit code or Google sign-in; profile with bookings, points, daily
  login streak and roadmap modal, 4-character referral code and referral count.
- **Admin panel** at `/admin`: dashboard, restaurants, locations, blog, SIM providers /
  packages / templates / bookings, users, invitation-based admins, settings (title,
  description, favicon, maintenance mode, indexing switch).
- **SEO plumbing**: `robots.txt`, dynamic `sitemap.xml` honouring the indexing switch, per-row
  `seoTitle`/`seoDescription` on blog and SIM pages, `/qr/sim` redirect for printed QR codes.
- Dark mode, maintenance mode, GTM page-view tracking.

**Hard constraints**

- **Facts are byte-identical everywhere** and come from `business.ts`. Enforced by
  `fe/tests/guards.test.ts`, which runs before every image build.
- **No promissory or unverifiable claims** (guarantees, "#1", "cheapest", "best in Malaysia",
  "official partner", "risk-free"). Enforced by the same guard. `/terms` and `/privacy` are the
  documented exception, pending replacement.
- **No invented content.** Everything a visitor reads about a restaurant or SIM package is a
  database row. `src/data/sampleRestaurants.ts` is a fixture; the guard fails if a route can
  reach it.
- **Every internal link, redirect and sitemap entry resolves.** Enforced.
- **Client figures carry a dated source** (`HERO_STATS`). Enforced.
- **Do not build**: payments, a restaurant booking engine, transport booking, password reset
  (OPEN-ITEMS #6). Link out instead.

**Terminology**

Travel SIM (not eSIM; the tables were renamed `esim` to `sim`) · KLIA2 · collection (not
pickup or delivery) · package · provider · points · streak · referral code. "Book" is used for
SIM reservation even though no money changes hands; keep it, the UI and GA4 event depend on it.

**Open decisions**

- Where and how ttklia.com is surfaced (OPEN-ITEMS #1).
- The content programme: 10 pieces a month in EN, ZH and BM (30/month, client goal
  2026-09-20). Needs the locale layer, a keyword strategy per language and a named reviewer
  per language before the first piece (OPEN-ITEMS #2).
- Which of "Teeko", "Teeko AI", "Teeko Advisor" is the brand (OPEN-ITEMS #4).
- Whether hero figures ever become database-derived (declined 2026-09-19, OPEN-ITEMS #5).

## Brand Commitments

- Brand name `Teeko` in UI chrome and email `from`; legal name only in legal contexts. Final
  brand spelling pending OPEN-ITEMS #4.
- Palette as shipped: red primary (`primary-500` / Tailwind red-600), white/zinc surfaces,
  dark mode supported. Fonts: Geist Sans and Geist Mono via `next/font`. No brand guide has
  been supplied; treat the current palette as inherited, not chosen.
- Voice: plain, second person, Malaysia-specific, no hype. The REACT checklist in `AGENTS.md`
  applies to every published string.
- No social profiles supplied (OPEN-ITEMS #11).

## Evidence on Hand

**Real, usable**

- Legal name, registration numbers, registered office, support email (from the shipped legal
  pages; recorded in `business.ts`).
- Four client-supplied hero figures, dated 2026-09-19.
- Database content: restaurants with TripAdvisor/Google stats and reviews, SIM providers and
  packages, blog posts. Quality and completeness vary by row; check before featuring.
- ttklia.com as a live, three-language transport booking site.

**Missing, must not be fabricated**

- **No link to ttklia.com yet** and no agreed deep links or UTM scheme.
- **No testimonials or customer quotes about Teeko.** Review text on restaurant pages is
  third-party, about the restaurant.
- **No outcome or performance data**: no "travellers served", "SIMs collected", satisfaction
  or conversion figures. The only approved figures are the four `HERO_STATS`.
- **No pricing beyond the package `price` string.** No price lists, comparisons, "from RM"
  ranges. SIM packages are RM0 or link out.
- **No client photography.** Hero images are Unsplash stock; restaurant images come from the
  TripAdvisor CDN. Nothing depicts Teeko, its staff, its counter or KLIA2 collection.
- **No credentials, awards, certifications or partnership agreements** on file. SIM providers
  are named, not endorsed. "Official" anything is banned by the guard.
- **No BM or Chinese content** and no i18n layer.
- **No password reset**, no payments, no in-house booking engines.
- **No social profiles, named authors or team page.**
- **Phone number and hours are unconfirmed.**

Never invent: restaurant facts (names, addresses, hours, cuisines, ratings, counts, phones);
SIM package names, prices, durations, data allowances or provider names; any number without a
dated source; legal facts; quotes, testimonials, press mentions; partnership or endorsement
language about ttklia.com, SIM providers, TripAdvisor or Google. Do not state "unlimited",
"5G" or a data cap for a package unless its `features` row says so.

## Product Principles

1. **Shortest path to transport.** Once ttklia.com is wired in, every page answers "how do I
   get from KLIA2 to my hotel" within one tap. Everything else is on the way there.
2. **A visitor reads only database rows and sourced facts.** If it is not in Postgres or
   `business.ts` with a source, it is not on the site. Fixtures never render.
3. **Describe the offer, never rank it.** The site lists third-party providers and
   restaurants it does not control; it can say what each is, not that one is best.
4. **Enforce, do not remember.** Every rule above that can be checked mechanically is checked
   in `fe/tests/guards.test.ts` before an image builds. A new hard rule gets a test the same
   day, not a paragraph.
5. **Content work happens in the admin panel.** A new package, post or restaurant is data
   entry or a seed, not a component. Source changes are for chrome, plumbing and legal pages.

## Accessibility & Inclusion

- Mobile-first is the primary case, not a breakpoint: the visitor is on a phone at an airport.
- One `h1` per page, labelled controls, visible focus. Carousel dots already carry
  `aria-label`; keep that standard for anything new.
- Alt text describes what is in the frame; package and restaurant images currently reuse the
  item name, which is acceptable until real imagery exists.
- Dark mode is supported and must stay readable; use the CSS variables, not hardcoded greys.
- Language: English only today. When BM and Chinese arrive (OPEN-ITEMS #2), airport, road and
  place names stay in Latin script in every locale, the same rule the Persistence Chiro repo
  settled on for NAP consistency.
