/**
 * Locale configuration: the single source of truth for which languages the
 * site serves and how their URLs are built. Safe to import from client and
 * server code.
 *
 * English is the default and is served unprefixed (`/blog/x`). Bahasa
 * Malaysia and Chinese (Simplified, client decision 2026-10-03) are prefixed
 * (`/ms/blog/y`, `/zh/blog/z`). `src/proxy.ts` rewrites unprefixed requests
 * to the internal `/en/...` route and 308s any direct `/en/...` hit back.
 */

export const LOCALES = ["en", "ms", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const TRANSLATED_LOCALES = ["ms", "zh"] as const satisfies readonly Locale[];
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** `<html lang>` and hreflang values. Chinese is Simplified script. */
export const LANG_TAG: Record<Locale, string> = { en: "en", ms: "ms", zh: "zh-Hans" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_MY", ms: "ms_MY", zh: "zh_CN" };
/** For Intl date and number formatting. */
export const INTL_LOCALE: Record<Locale, string> = { en: "en-MY", ms: "ms-MY", zh: "zh-CN" };
/** Labels in the language switcher, written in each language's own script. */
export const LOCALE_LABEL: Record<Locale, string> = { en: "EN", ms: "BM", zh: "中文" };
export const LOCALE_NAME: Record<Locale, string> = { en: "English", ms: "Bahasa Malaysia", zh: "中文" };

/**
 * Public URL for an unprefixed path in a locale. `path` must start with "/"
 * and may carry a query string. `pathFor("ms", "/")` is `/ms`, never `/ms/`,
 * which would cost a redirect hop on every logo click.
 */
export function pathFor(locale: Locale, path: string): string {
    if (!path.startsWith("/")) throw new Error(`pathFor expects an absolute path, got "${path}"`);
    if (locale === DEFAULT_LOCALE) return path;
    if (path === "/") return `/${locale}`;
    if (path.startsWith("/?")) return `/${locale}${path.slice(1)}`;
    return `/${locale}${path}`;
}

const PREFIX = /^\/(en|ms|zh)(?=\/|\?|$)/;

/** Removes a leading locale segment: `/ms/blog/x` → `/blog/x`, `/zh` → `/`. */
export function stripLocale(pathname: string): string {
    const stripped = pathname.replace(PREFIX, "");
    return stripped === "" ? "/" : stripped.startsWith("?") ? `/${stripped}` : stripped;
}

export function localeFromPathname(pathname: string): Locale {
    const match = pathname.match(PREFIX);
    return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (whole, key) => (key in vars ? String(vars[key]) : whole));
}

// ---------------------------------------------------------------------------
// Database text
// ---------------------------------------------------------------------------

/** Shape of the backend `translations` jsonb column: `{ ms?: {...}, zh?: {...} }`. */
export type Translations<T> = Partial<Record<TranslatedLocale, Partial<T>>> | null | undefined;

type Translatable = { translations?: Translations<Record<string, unknown>> };

/**
 * A row's text in `locale`, falling back to English when that field has not
 * been translated yet. Names, addresses and prices are never passed through
 * here; they are the same in every language.
 */
export function localized<T extends Translatable, K extends keyof T & string>(
    row: T,
    locale: Locale,
    field: K,
): T[K] {
    if (locale === "en") return row[field];
    const value = row.translations?.[locale]?.[field];
    const empty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
    return empty ? row[field] : (value as T[K]);
}

/**
 * True when the row has its own text for `locale` in `field`. A row counts as
 * available in a language only when this is true for its main text field;
 * otherwise its BM/中文 page still renders, but canonicalises to English and
 * stays out of the sitemap and hreflang, so Google never sees a thin
 * duplicate.
 */
export function isTranslated(row: Translatable | null | undefined, locale: Locale, field: string): boolean {
    if (locale === "en") return true;
    const value = row?.translations?.[locale]?.[field];
    return typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) ? value.length > 0 : false;
}

/** Locales in which a row is available, judged by its main text field. */
export function availableLocales(row: Translatable | null | undefined, field: string): Locale[] {
    return LOCALES.filter((locale) => isTranslated(row, locale, field));
}
