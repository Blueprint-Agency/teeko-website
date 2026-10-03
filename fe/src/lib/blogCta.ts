import { pathFor, type Locale } from "@/lib/i18n";

// A "cta" content block stores its fields as JSON in `content`, the same way
// image blocks store a URL there. Shared by the blog renderer and the editor.
export interface CtaContent {
    heading: string;
    subheading: string;
    buttonText: string;
    url: string;
}

export const EMPTY_CTA: CtaContent = { heading: "", subheading: "", buttonText: "", url: "" };

export function parseCtaContent(content: string | null | undefined): CtaContent {
    if (!content) return { ...EMPTY_CTA };
    try {
        const parsed = JSON.parse(content) as Partial<CtaContent>;
        return {
            heading: parsed.heading ?? "",
            subheading: parsed.subheading ?? "",
            buttonText: parsed.buttonText ?? "",
            url: parsed.url ?? "",
        };
    } catch {
        return { ...EMPTY_CTA };
    }
}

export function serializeCtaContent(cta: CtaContent): string {
    return JSON.stringify(cta);
}

/**
 * An internal CTA path ("/travel-sim-malaysia") in the post's language
 * ("/ms/travel-sim-malaysia"). A path that already carries a locale prefix,
 * an anchor or a relative link is left exactly as the author wrote it.
 */
export function localizeInternalUrl(url: string, locale: Locale): string {
    if (!url.startsWith("/") || url.startsWith("//")) return url;
    if (/^\/(en|ms|zh)(?=\/|\?|#|$)/.test(url)) return url;
    return pathFor(locale, url);
}
