"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useLocale, useDict } from "@/components/providers/LocaleProvider";
import { LANG_TAG, LOCALES, LOCALE_LABEL, LOCALE_NAME, type Locale } from "@/lib/i18n";

/** How long the pill takes to slide before the page changes. */
const SLIDE_MS = 220;

const TONES = {
    // On a white or dark navbar.
    solid: {
        track: "bg-gray-100 dark:bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10",
        pill: "bg-white dark:bg-zinc-600 shadow-sm",
        active: "text-gray-900 dark:text-white",
        idle: "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
    },
    // Over the hero image, before the navbar turns solid.
    overlay: {
        track: "bg-white/10 ring-1 ring-white/25 backdrop-blur-sm",
        pill: "bg-white shadow-sm",
        active: "text-gray-900",
        idle: "text-white/80 hover:text-white",
    },
} as const;

/**
 * EN · BM · 中文 as a segmented control with a sliding pill.
 *
 * Each option is a real `<a hrefLang>` link, so crawlers and no-JS visitors
 * get plain links. A normal click slides the pill to the chosen language and
 * then navigates; modified clicks (new tab) and reduced-motion visitors skip
 * the animation. `links` comes from the page (`languageLinks(paths)`): the
 * same page in each language where it exists, otherwise that language's home.
 * Never reads request headers, which would de-staticise every page.
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
    const router = useRouter();
    const current = LOCALES.indexOf(locale);
    // The language being slid to. It only counts while we are still on the
    // language it was chosen from, so once navigation (or the back button)
    // lands on another language the pill follows the page with no effect.
    const [pending, setPending] = useState<{ from: Locale; to: number } | null>(null);
    const selected = pending && pending.from === locale ? pending.to : current;
    const styles = TONES[tone];

    const choose = (event: MouseEvent<HTMLAnchorElement>, target: Locale, index: number) => {
        if (target === locale) {
            event.preventDefault();
            return;
        }
        // Let the browser handle new-tab and new-window clicks as normal links.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

        event.preventDefault();
        setPending({ from: locale, to: index });
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.setTimeout(() => router.push(links[target]), reduceMotion ? 0 : SLIDE_MS);
    };

    return (
        <nav aria-label={dict.common.switcher.label}>
            <div className={`relative grid grid-cols-3 rounded-full p-0.5 ${styles.track}`}>
                <span
                    aria-hidden="true"
                    className={`absolute inset-y-0.5 left-0.5 w-[calc((100%-0.25rem)/3)] rounded-full transition-transform ease-out motion-reduce:transition-none ${styles.pill}`}
                    style={{ transform: `translateX(${selected * 100}%)`, transitionDuration: `${SLIDE_MS}ms` }}
                />
                {LOCALES.map((l, i) => (
                    <Link
                        key={l}
                        href={links[l]}
                        hrefLang={LANG_TAG[l]}
                        lang={LANG_TAG[l]}
                        title={LOCALE_NAME[l]}
                        aria-current={l === locale ? "true" : undefined}
                        onClick={(event) => choose(event, l, i)}
                        className={`relative z-10 flex h-7 min-w-10 items-center justify-center rounded-full px-2.5 text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                            i === selected ? styles.active : styles.idle
                        }`}
                        style={{ transitionDuration: `${SLIDE_MS}ms` }}
                    >
                        {LOCALE_LABEL[l]}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
