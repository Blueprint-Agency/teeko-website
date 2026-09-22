# Open items

Work blocked on the client, an asset, an access grant, or a decision. One numbered section per
item. Resolved items stay, marked resolved; the history is the value. When something was
declined, the reason is recorded so it is not re-pitched every month.

Numbers are referenced from code comments and `AGENTS.md`; do not renumber.

Last updated **2026-09-22**, when the F1 Sepang cluster started and the ttklia operating entity was noted (item 1).

## 1. ttklia.com conversion path does not exist on the site

**Status: open. Owner: client (inputs), Blueprint (build).**

Client instruction 2026-09-19: the primary conversion is booking bus and taxi transport at
ttklia.com. **This is a new strategy** (client, 2026-09-19), so the absence of any ttklia.com
link on the site is expected, not a regression. The hero CTA currently sends visitors to the
SIM page.

Needed to unblock:
- Which ttklia.com URLs to deep-link (bus search, taxi, car charter, Genting), or homepage only.
- UTM convention the client wants in ttklia.com analytics (`TTKLIA_URL` + params).
- Whether ttklia.com should be named as "Teeko" or as "ttklia" in copy (brand relation, see #4).
- Where it sits in the navigation and on the SIM confirmation screen (a visitor who just booked
  a KLIA2 SIM is the best transport lead the site will ever have).
- The corporate relationship. ttklia.com's footer names **Asia Success Resources Sdn Bhd
  (803432-K)** as operator, not GM Ai Tours. Until the client confirms how the two relate,
  copy says "the ttklia F1 shuttle", never "our shuttle" (first applied 2026-09-22 in the F1
  transport post).

First use, 2026-09-22: the F1 Sepang content cluster (transport guide, hub, tickets) links to
`https://ttklia.com/tours/f1-sepang-shuttle-bus-trip` with provisional UTMs
`utm_source=teeko&utm_medium=blog&utm_campaign=f1_sepang_2026`. Drafts live outside the repo in
`Blueprint Clients/Teeko/content-drafts/` until the admin editor takes them.

## 2. Bahasa Malaysia and Chinese versions

**Status: open, now REQUIRED. Owner: client (decisions), Blueprint (build).**

Escalated 2026-09-20: the client's goal is 10 pieces of content a month in all three
languages (30/month). That cannot start until this item is built, so it now sits ahead of
everything except #1, and the two should be planned together (every piece links to
ttklia.com).

Client answered "English, Bahasa Malaysia and Chinese" (2026-09-19). The site has no i18n:
`lang="en"` is hardcoded, there is no locale routing, and the content model has no translation
fields. ttklia.com already runs EN/ZH/MS, so the audience is real.

Needed to unblock:
- Do BM and ZH target their own keywords, or mirror English? This decides whether they are
  separate content or a translation layer. Recommendation: own keywords per locale, as
  Persistence found (literal translations often measure ~0 volume in Malaysia).
- Who translates or writes: client, agency, or machine with client review. At 20
  non-English pieces a month, "client reviews everything" needs a named reviewer per language.
- Data model: `blogPosts` and `blogContentBlocks` need a locale (and a link between the three
  versions of one piece) so hreflang and the language switcher can be computed, not hand-listed.
- Routing: `app/[locale]/` with English unprefixed, or three separate slugs. Decide once.
- Admin editor: one post with three tabs, or three posts. The editor is paste-based today.
- Whether SIM packages and restaurants also localise, or only the blog in phase 1.
- Sequence with #1: build the ttklia.com path first (no translation needed), then the locale
  layer, then start the content calendar.

Prior worth reusing when this starts: the Persistence Chiro repo runs the same three locales
under `app/[locale]/`, with English unprefixed via a rewrite, locale-keyed sibling data files
sharing one slug, `availableIn` computed (never hand-listed) for hreflang, and place names kept
in Latin script in every locale for NAP consistency. Its `AGENTS.md` § Multilingual records the
mistakes already made (a `headers()` call in the root layout that de-staticised the whole site).
Teeko is DB-driven so the data layer differs, but the routing and the "no thin locale pages to
prove the plumbing" rule carry over.

## 3. Privacy Policy and Terms of Service describe a different product

**Status: open. Owner: client (legal).**

`/privacy` talks about drivers, passengers, driver's licences and in-vehicle data. `/terms`
covers coach and bus ticket sales, a 15% service fee, Help Center cancellations and
"official agent on behalf of train, coach and bus operators". None of that is this site. They
also print a customer care phone number (+011 5587 2981) and hours (08:00-18:00 MYT daily) that
no other page confirms.

Needed to unblock:
- Correct legal documents for teeko.ai (restaurant listings, SIM bookings, accounts, referral
  points, GTM analytics) from the client's legal contact.
- Confirmation or correction of the phone number and hours. Until then they are exported as
  `PHONE_UNCONFIRMED` / `HOURS_UNCONFIRMED` in `business.ts` and must not be surfaced anywhere
  new.

Done 2026-09-19: the legal name in `/terms` section 1.1.1 was re-ordered to match `LEGAL_NAME`
byte-for-byte ("GM Ai Tours Sdn Bhd. (201601011927) (1182858-H), a company registered in
Malaysia..."); wording otherwise untouched. Both pages are excluded from the promissory-claims
guard because they are legal text, with the reason recorded in the test.

## 4. Brand name is three things

**Status: open. Owner: client.**

"Teeko" (nav, footer, emails), "Teeko AI" (legal pages, privacy metadata), "Teeko Advisor"
(`settings.siteTitle` default, root layout fallback). Needs one answer, then `BRAND` in
`business.ts` becomes the source and a guard can enforce it.

## 5. Homepage hero figures

**Status: resolved 2026-09-19 (recorded), revisit when figures change. Owner: client.**

20+ Places, 50K+ Reviews, 4.8 Avg Rating, 3 Cities were hardcoded in `HeroSection.tsx` with
no source. Client confirmed 2026-09-19 they are client-supplied and should stay. Moved to
`HERO_STATS` in `business.ts` with a dated source; the guard requires one.

Declined for now: deriving them from the database. Reason: the client wants these specific
figures, and DB-derived counts (restaurants table currently seeds far fewer than "50K reviews")
would contradict them. Revisit if the client asks for live numbers.

## 6. Password reset

**Status: open. Owner: client (priority), Blueprint (build).**

The login page linked to `/auth/forgot-password`; no such page exists and `be/` has no reset
endpoint. The link was removed 2026-09-19 because a 404 on the login page is worse than no
link. Email-code login already exists (`/auth/verify-code`), so a reset flow may be low value.
Decide whether to build it; restore the link only when the route exists (the guard will
otherwise fail).

## 7. Photography

**Status: open. Owner: client.**

Hero carousel is five Unsplash stock images hardcoded in `HeroSection.tsx`. Restaurant images
come from `media-cdn.tripadvisor.com` (allowed in `next.config.ts`). No client-owned
photography exists in the repo. Needed: any real imagery of KLIA2 collection, the SIM, or the
team, plus confirmation that TripAdvisor-hosted images may be displayed (see #8).

## 8. TripAdvisor and Google review data posture

**Status: open. Owner: client.**

Restaurants are keyed by `tripAdvisorLocationId`; ratings, review counts and review text are
stored from TripAdvisor and Google (via SerpAPI) and rendered on restaurant pages. The client
answered "none known" to forbidden vocabulary (2026-09-19), which is a different question.
Needed: confirmation the client is comfortable with attribution and terms for displaying
third-party review content, or a decision to show only links and aggregate figures.

## 9. ESLint reports 96 pre-existing errors

**Status: open. Owner: Blueprint.**

`npm run lint` in `fe/` fails (216 problems, 96 errors: mostly `no-explicit-any` and
`react/no-unescaped-entities`). Not gated in the Dockerfile, so it does not block deploys.
Needed: a cleanup pass, then add `npm run lint` to the Dockerfile so it stays clean. Until
then, lint only the files you touch.

## 10. No test runner in `be/`

**Status: open. Owner: Blueprint.**

`be/package.json` `test` is the npm placeholder. The guard tests live in `fe/` and read
`be/src/utils/email.ts` for published strings, but nothing exercises backend logic. Decide on a
runner when the first backend rule needs enforcing.

## 11. Unanswered interview items

**Status: open. Owner: client.**

Not supplied on 2026-09-19 and not derivable from the repo:
- Social profiles (none linked anywhere on the site).
- Named people (founder, support lead) for author bylines; `blogPosts.authorId` exists but
  posts render without a visible author.
- Whether "Unlimited 5G Data" on `/travel-sim-malaysia` is true for every package of every
  provider, or only some. The page states it for all.
- Which restaurant reservation partners are in play, if any, beyond the per-row
  `reservationUrl`.

## 12. Dead components that import fabricated sample data

**Status: open. Owner: Blueprint.**

`ListingSection.tsx` and `HomeSearch.tsx` are not imported by any route. `ListingSection`
renders `src/data/sampleRestaurants.ts`, which has invented ratings and review counts. The
guard proves no route can reach it today. Decide whether to delete both components and the
fixture; nothing depends on them.
