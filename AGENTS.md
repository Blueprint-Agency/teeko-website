<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

`fe/` runs Next.js 16. APIs, conventions and file structure differ from training data. Read
the relevant guide in `fe/node_modules/next/dist/docs/` before writing any Next code, and heed
deprecation notices.
<!-- END:nextjs-agent-rules -->

# Teeko - teeko.ai website monorepo

teeko.ai is the public web presence of the Teeko travel brand: restaurant discovery, a free
travel SIM collected at KLIA2, and a blog, all feeding one job: send the visitor to book bus
and taxi transport at ttklia.com. A change belongs here if it makes that path shorter, keeps
the published facts true, or keeps the site deployable. Anything else is a nice-to-have.

## The client

| Fact | Value | Source |
|---|---|---|
| Legal operator | GM Ai Tours Sdn Bhd. (201601011927) (1182858-H) | /privacy, /terms, 2026-09-19 |
| Registered office | No.9G, Street Wing Sunsuria Avenue, Persiaran Mahogany, Kota Damansara PJU5, 47810 Selangor Darul Ehsan | /privacy, /terms, 2026-09-19 |
| Brand | Teeko (also "Teeko AI" and "Teeko Advisor" in places; unresolved, OPEN-ITEMS #4) | repo |
| Support email | support@teeko.ai | /privacy contact block |
| Transactional sender | no-reply@teeko.ai | be/src/utils/email.ts |
| Phone / hours | +011 5587 2981, 08:00-18:00 MYT daily. **Unconfirmed**: copied legal text, OPEN-ITEMS #3 | /terms |
| Sister sites | ttklia.com (KLIA2 transport hub: bus, taxi, car charter; EN/ZH/MS), app.teeko.ai (AI chatbot, `NEXT_PUBLIC_AI_APP_URL`) | client 2026-09-19, fe/env.example |
| Socials, people | Not supplied. OPEN-ITEMS #11 | |
| Languages | English, Bahasa Malaysia, Chinese requested. Site is English only today. OPEN-ITEMS #2 | client 2026-09-19 |

**Single source module: [`fe/src/lib/business.ts`](fe/src/lib/business.ts).** Import from it. Never
retype the legal name, address, emails, ttklia URL or hero figures anywhere else. The guard test
fails the build when a retyped copy drifts, including inside `/privacy` and `/terms` prose.

## Conversion

**Primary (client instruction, 2026-09-19): the visitor books bus or taxi transport at
ttklia.com.** Every page should offer a route there. This is a **new strategy as of
2026-09-19**, which is why the site has zero links to it today; that is not an oversight to
"fix" quietly but the first piece of work to plan. See OPEN-ITEMS #1 for what is needed.

Secondary paths, in the order the client ranked them below transport:

1. **Travel SIM booking**, internal. Sign in, pick a package, choose a KLIA2 collection date,
   receive a QR verification code. Lives in `simBookings`; UI in `fe/src/components/booking/`.
2. **Restaurant reservation**, external. Opens `restaurant.reservationUrl` (or the Google Maps
   link when absent) in a new tab and awards points. Do not build reservation logic here.
3. **Account creation**, which unlocks points, streaks and a 4-character referral code.

Do not build: payment collection (SIM packages are RM0 or link out via `ctaLink`), an in-house
restaurant booking engine, or transport booking. ttklia.com owns transport; link to it.

## Content programme

**Client goal, 2026-09-20: 10 pieces of content per month, each in English, Chinese and
Bahasa Malaysia, so 30 published pieces per month.** Content means blog posts unless the
client says otherwise; every piece must carry a route to ttklia.com. Two things block it
today: the blog has no locale field and the site has no locale routing (OPEN-ITEMS #2), and
the keyword strategy per locale is undecided. Do not start writing at volume until both are
settled, or 30 pieces a month become 30 thin pages a month.

## Reference docs

| File | Holds |
|---|---|
| [`OPEN-ITEMS.md`](OPEN-ITEMS.md) | Everything blocked on the client, an asset or a decision, with the reason. Read it before proposing anything; if it was declined, the reason is there. |
| [`PRODUCT.md`](PRODUCT.md) | What exists, what does not exist, and what must never be invented. |
| [`fe/src/lib/business.ts`](fe/src/lib/business.ts) | Canonical facts and client-supplied figures with their sources. |
| [`fe/tests/guards.test.ts`](fe/tests/guards.test.ts) | The rules below, enforced. Runs in `npm test`, which the Dockerfile runs before `next build`. |
| [`README.md`](README.md) | Local setup, commands, deploy branches. |

## Non-negotiables

1. **Facts come from `business.ts`, byte-identical.** Reason: `/terms` shipped with the legal
   name phrased two different ways and nobody noticed until the guard ran (2026-09-19). Check:
   `npm test` in `fe/`.
2. **No invented content.** Restaurant details, SIM package prices, provider names, review
   counts, ratings, hours and photos all come from the database via the admin panel, never from
   source. `src/data/sampleRestaurants.ts` is a dev fixture and the guard fails if any route can
   reach it. Reason: the schema has real TripAdvisor-keyed rows; a plausible fake beside them is
   indistinguishable to a visitor. See PRODUCT.md for the full absent list.
3. **No promissory or unverifiable claims** in published copy: guarantees, "#1", "cheapest",
   "best in Malaysia", "official partner", "risk-free", "100% ...". The full regex list with a
   reason per pattern is in the guard. Carve-out: `/terms` and `/privacy` are excluded because
   they are legal text using "guarantee" in the negative, and they are pending replacement
   (OPEN-ITEMS #3). Reason: client answered "none known" to forbidden vocabulary (2026-09-19),
   so there is no regulator to satisfy, but the site compares third-party providers it does not
   control and cannot substantiate superlatives about them.
4. **Every internal link, redirect and sitemap entry resolves to a real route.** Reason:
   `/qr/sim` redirected to `/sim`, which had been renamed, so printed QR codes 404'd until
   2026-09-19; `/auth/forgot-password` was linked from the login page with no page behind it.
   Check: the guard walks `src/app` and compares.
5. **Client-supplied figures carry a dated source.** The hero stats (20+ places, 50K+ reviews,
   4.8 rating, 3 cities) are client-supplied 2026-09-19 and static. They live in `HERO_STATS`
   with a `source` field the guard requires. Do not add another number to the site without one.
6. **ttklia.com links use `TTKLIA_URL` exactly**, with UTM parameters appended if wanted. Reason:
   it is the primary conversion and analytics must attribute it consistently. Check: guard.
7. **Do not surface the phone number or hours anywhere new** until the client confirms them
   (OPEN-ITEMS #3). They are exported as `*_UNCONFIRMED` for a reason.

## Copy voice

Sound like a person who runs a KLIA2 counter, not like a model. Run every piece of published
copy (headings, body, FAQ, meta descriptions, blog, emails) through this before shipping:

- **R - Repetition.** Do not restate one point three ways or reflexively list in threes.
- **E - Em dash.** Not as connective tissue. Use a full stop, a comma, or nothing.
- **A - Amplified language.** No "seamless", "unlock", "elevate", "game-changing", "premium",
  "curated just for you". The current hero and SIM section contain several; replace as touched.
- **C - Contrast.** No "not just X, it's Y" / "not only... but also".
- **T - Trust your gut.** Re-read once more. If it still reads as generated, fix it anyway.

Then the house rules:

- Second person, present tense, short sentences. "Collect your SIM at KLIA2 when you land."
- Say what the visitor gets and what they do next. Every section ends in an action.
- Malaysia-specific: name the airport, the city, the road. "Across Malaysia" is filler.
- Prices as the package string from the database (`RM0`, `RM35`), never reformatted or rounded.
- "Free" only when the package price is literally `RM0`; the UI already gates this.
- No superlatives about third-party providers. Describe the plan; let the visitor compare.
- British/Malaysian English spelling (colour, centre, licence).
- Written for an inbound tourist who has not landed yet, on a phone, possibly not in English.

## Conventions

- **Stack**: `fe/` Next.js 16 app router, React 19, Tailwind 4, TypeScript strict, port 5000.
  `be/` Express 5, Drizzle ORM, Postgres 16, port 3000. Docker images per side, deployed to a
  VPS over Tailscale by `.github/workflows/{fe,be}-deploy.yml`; `staging` branch to
  staging.teeko.ai, `main` to teeko.ai.
- **Content model** (`be/src/db/schema.ts`): `restaurants` (keyed by `tripAdvisorLocationId`,
  with `restaurantStats`, `restaurantReviews`, `restaurantImages`, `restaurantShortVideos`),
  `locations`, `simProviders` / `simPackages` / `simContentTemplates` / `simBookings`,
  `blogPosts` + `blogContentBlocks` (typed blocks, can link a location or restaurant), `users`
  with `pointHistory`, `userReferralCodes`, `referrals`, and a singleton `settings` row.
- **Content is edited in the admin panel** (`/admin`), not in source. Page copy that is
  framework chrome (hero, section headers, footer, legal) lives in components. If a client
  asks for a new blog post or package, that is admin-panel work, or a seed, never a `.tsx`.
- **SEO switches live in the database**: `settings.googleIndexing` (site-wide, default
  `false`), `restaurants.isIndexed`, `locations.isIndexed`. The sitemap returns empty when
  indexing is off. Check the settings row before assuming a page should rank.
- **Per-page metadata**: blog and SIM detail pages read `seoTitle`/`seoDescription` from the
  row; restaurant detail metadata is still a generic placeholder
  (`fe/src/app/restaurant/[slug]/page.tsx`).
- **Structure**: `src/app` routes, `src/components/{layout,sections,shared,ui,booking,
  features,profile,providers,admin}`, `src/lib` (constants, auth fetch, navigation,
  business facts), `src/types`, `src/data` (fixtures only).
- **Auth**: email + 6-digit code, or Google. JWT in `localStorage`; `useAuthFetch` handles
  expiry. Admin and user are separate roles with separate login pages.
- **Analytics**: GTM via `NEXT_PUBLIC_GTM_ID`; `GTMTracking` fires page views; the SIM booking
  modal fires a GA4 `purchase` event.
- **Environment**: `fe/env.example`, `be/env.example`. `BACKEND_URL` is the server-side
  (Docker network) API origin; `NEXT_PUBLIC_API_URL` is the browser one; `/api/*` is rewritten
  to the backend in `next.config.ts`.

## Skills that apply

Personal skills load from `~/.claude/skills/`; none are forked into this repo.

- `landing-page-builder` for any new page or blog content. Output for this site is admin-panel
  content (blog blocks, package `about`/`features`), not a `.tsx`, unless it is chrome.
- `competitor-gap-analysis` before committing to a SIM or transport angle; the market is other
  KLIA2 SIM counters and airport transfer sites.
- `design-taste-frontend` for visual work on `fe/`.

## Commands

From the repo root: `make install`, `make init` (Postgres + migrate + seed), `make dev`,
`make build`, `make test`, `make lint`. Or in `fe/`: `npm run dev|build|lint|test`.

**`npm test` and `npm run build` in `fe/` must both pass before commit.** The Dockerfile runs
them in that order, so a failure blocks the deploy. `npm run lint` currently reports 96
pre-existing errors (OPEN-ITEMS #9); do not add to them, and lint the files you touch with
`npx eslint <paths>`. `be/` has no tests yet (OPEN-ITEMS #10).
