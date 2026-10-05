/**
 * Canonical business facts for teeko.ai.
 *
 * Single source. Never retype any of these values in a component, page,
 * email template or metadata string; import them. `tests/guards.test.ts`
 * fails the build when a retyped copy drifts from what is defined here.
 *
 * Source for each value is recorded beside it. A value without a source is
 * a guess and must not be published.
 */

/** Legal operator. Source: /privacy and /terms as shipped, 2026-09-19. */
export const LEGAL_NAME = "GM Ai Tours Sdn Bhd. (201601011927) (1182858-H)";

/** Registered office. Source: /privacy and /terms as shipped, 2026-09-19. */
export const ADDRESS =
    "No.9G, Street Wing Sunsuria Avenue, Persiaran Mahogany, Kota Damansara PJU5, 47810 Selangor Darul Ehsan";

/** Public brand name used in UI chrome, titles and email `from`. */
export const BRAND = "Teeko";

/** Public support inbox. Source: /privacy contact block, 2026-09-19. */
export const SUPPORT_EMAIL = "support@teeko.ai";

/** Outbound transactional sender. Source: be/src/utils/email.ts, 2026-09-19. */
export const NOREPLY_EMAIL = "no-reply@teeko.ai";

/** Every @teeko.ai address that may appear in published output. */
export const ALLOWED_EMAILS: readonly string[] = [SUPPORT_EMAIL, NOREPLY_EMAIL];

/**
 * Customer care line and hours as printed in /terms. UNCONFIRMED: /terms was
 * adapted from a transport-booking document and the client has not verified
 * these two values (OPEN-ITEMS #3). Do not surface them anywhere new until
 * confirmed.
 */
export const PHONE_UNCONFIRMED = "+011 5587 2981";
export const HOURS_UNCONFIRMED = "08:00-18:00 Malaysia time, every day";

/** Production origin. Overridable by NEXT_PUBLIC_SITE_URL at build time. */
export const SITE_URL = "https://teeko.ai";

/**
 * Primary conversion. Client instruction 2026-09-19: the website's job is to
 * lead the visitor to book bus and taxi transport at the KLIA2 transport hub
 * below (same group). Every link to it must start with this exact string;
 * UTM query params may be appended.
 */
export const TTKLIA_URL = "https://ttklia.com";

/**
 * Homepage hero figures. Client-supplied and approved for display
 * (interview 2026-09-19). They are not derived from the database, so they
 * will not update on their own; revisit when the client sends new numbers.
 * Each entry must carry a dated `source` or the guard test fails.
 */
export interface HeroStat {
    value: string;
    label: string;
    source: string;
}

export const HERO_STATS: readonly HeroStat[] = [
    { value: "20+", label: "Places", source: "Client-supplied, 2026-09-19" },
    { value: "50K+", label: "Reviews", source: "Client-supplied, 2026-09-19" },
    { value: "4.8", label: "Avg Rating", source: "Client-supplied, 2026-09-19" },
    { value: "3", label: "Cities", source: "Client-supplied, 2026-09-19" },
];
