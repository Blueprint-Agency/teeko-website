"use client";

import Link from "next/link";
import { useLocale, useDict } from "@/components/providers/LocaleProvider";
import { LANG_TAG, LOCALES, LOCALE_LABEL, LOCALE_NAME, type Locale } from "@/lib/i18n";

/**
 * EN · BM · 中文. `links` comes from the page (`languageLinks(paths)`), so
 * the switcher only offers a same-page link where that page exists and
 * otherwise falls back to the language's home page. It never reads request
 * headers, which would de-staticise every page that renders it.
 */
export function LanguageSwitcher({
    links,
    tone = "solid",
}: {
    links: Record<Locale, string>;
    tone?: "solid" | "overlay";
}) {
    const locale = useLocale();
    const dict = useDict();
    const idle = tone === "overlay"
        ? "text-white/80 hover:text-white"
        : "text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400";
    const active = tone === "overlay" ? "text-white" : "text-gray-900 dark:text-white";

    return (
        <nav aria-label={dict.common.switcher.label} className="flex items-center gap-1 text-xs font-semibold">
            {LOCALES.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                    {i > 0 && <span aria-hidden="true" className={tone === "overlay" ? "text-white/40" : "text-gray-400"}>·</span>}
                    {l === locale ? (
                        <span aria-current="true" lang={LANG_TAG[l]} title={LOCALE_NAME[l]} className={`px-1 ${active}`}>
                            {LOCALE_LABEL[l]}
                        </span>
                    ) : (
                        <Link
                            href={links[l]}
                            hrefLang={LANG_TAG[l]}
                            lang={LANG_TAG[l]}
                            title={LOCALE_NAME[l]}
                            className={`px-1 transition-colors ${idle}`}
                        >
                            {LOCALE_LABEL[l]}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
