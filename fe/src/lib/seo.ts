import type { Metadata } from "next";
import { DEFAULT_LOCALE, LANG_TAG, LOCALES, OG_LOCALE, pathFor, type Locale } from "@/lib/i18n";

/**
 * The unprefixed path of one page in each language it exists in. Static
 * pages share one path (`/restaurants`); a blog post has its own slug per
 * language (`/blog/klia2-to-kl-sentral`, `/blog/klia2-ke-kl-sentral`).
 */
export type LocalePaths = Partial<Record<Locale, string>>;

/** The same unprefixed path in every listed locale (default: all three). */
export function samePath(path: string, locales: readonly Locale[] = LOCALES): LocalePaths {
    return Object.fromEntries(locales.map((l) => [l, path]));
}

/**
 * Canonical, hreflang and Open Graph for a page.
 *
 * - `paths`: where the page exists. The language switcher uses the same map.
 * - `indexedIn`: languages whose version has its own reviewed text. Only
 *   these get hreflang entries and a self-referencing canonical. A version
 *   that exists but is not in `indexedIn` (a restaurant whose description is
 *   still English) canonicalises to the English URL, so search engines treat
 *   it as a duplicate of English rather than a thin page of its own.
 *   Defaults to every locale in `paths`.
 */
export function pageMetadata({
    locale,
    paths,
    indexedIn,
    title,
    description,
    images,
}: {
    locale: Locale;
    paths: LocalePaths;
    indexedIn?: readonly Locale[];
    title?: string;
    description?: string | null;
    images?: string[];
}): Metadata {
    const indexed = LOCALES.filter((l) => paths[l] && (indexedIn ?? LOCALES).includes(l));

    const languages: Record<string, string> = {};
    for (const l of indexed) languages[LANG_TAG[l]] = pathFor(l, paths[l]!);
    if (paths[DEFAULT_LOCALE] && indexed.includes(DEFAULT_LOCALE)) {
        languages["x-default"] = pathFor(DEFAULT_LOCALE, paths[DEFAULT_LOCALE]!);
    }

    const self = paths[locale];
    const canonicalLocale = self && indexed.includes(locale) ? locale : DEFAULT_LOCALE;
    const canonicalPath = paths[canonicalLocale];
    const canonical = canonicalPath ? pathFor(canonicalLocale, canonicalPath) : undefined;

    return {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        alternates: { canonical, languages },
        openGraph: {
            locale: OG_LOCALE[locale],
            ...(self ? { url: pathFor(locale, self) } : {}),
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            ...(images?.length ? { images } : {}),
        },
    };
}

/**
 * Public URL of this page in every language, for the language switcher. A
 * language the page does not exist in links to that language's home page.
 */
export function languageLinks(paths: LocalePaths): Record<Locale, string> {
    return Object.fromEntries(
        LOCALES.map((l) => [l, pathFor(l, paths[l] ?? "/")]),
    ) as Record<Locale, string>;
}
