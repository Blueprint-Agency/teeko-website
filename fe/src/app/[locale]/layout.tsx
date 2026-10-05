import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, LANG_TAG, LOCALES, type Locale, type Translations } from "@/lib/i18n";
import { SITE_URL } from "@/lib/business";

/**
 * Root layout of the public site, one per language. The locale comes from
 * the route segment. Never call headers(), cookies() or another dynamic API
 * here or in anything every page renders (Navigation, Footer): it would opt
 * the whole site out of static rendering.
 */

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

type Settings = {
    siteTitle?: string | null;
    siteDescription?: string | null;
    faviconUrl?: string | null;
    googleIndexing?: boolean;
    updatedAt?: string;
    translations?: Translations<{ siteTitle: string; siteDescription: string }>;
};

async function getSettings(): Promise<Settings | null> {
    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${apiUrl}/admin/settings`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000), // don't hang the build when the API is down
        });
        return res.ok ? await res.json() : null;
    } catch {
        console.warn("Skipping dynamic metadata (API unreachable). Using fallbacks.");
        return null;
    }
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
    const { locale } = await params;
    const lang: Locale = isLocale(locale) ? locale : "en";
    const [settings, dict] = await Promise.all([getSettings(), getDictionary(lang)]);
    const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || SITE_URL);

    if (!settings) {
        return { metadataBase, title: dict.common.meta.siteTitle, description: dict.common.meta.siteDescription };
    }

    const translated = lang === "en" ? undefined : settings.translations?.[lang];
    const faviconUrl = settings.faviconUrl || "/favicon.ico";
    const cacheBust = settings.updatedAt ? `?v=${new Date(settings.updatedAt).getTime()}` : "";

    return {
        metadataBase,
        title: translated?.siteTitle || (lang === "en" ? settings.siteTitle : null) || dict.common.meta.siteTitle,
        description:
            translated?.siteDescription || (lang === "en" ? settings.siteDescription : null) || dict.common.meta.siteDescription,
        icons: {
            icon: `${faviconUrl}${cacheBust}`,
            shortcut: `${faviconUrl}${cacheBust}`,
            apple: `${faviconUrl}${cacheBust}`,
        },
        robots: { index: settings.googleIndexing, follow: settings.googleIndexing },
    };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const dict = await getDictionary(locale);

    return (
        <RootDocument lang={LANG_TAG[locale]}>
            <LocaleProvider locale={locale} dict={dict}>
                {children}
            </LocaleProvider>
        </RootDocument>
    );
}
