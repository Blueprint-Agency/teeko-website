import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { asList, ALL_ITEMS_LIMIT } from '@/lib/api';
import { LANG_TAG, LOCALES, isLocale, isTranslated, pathFor, type Locale } from '@/lib/i18n';
import type { LocalePaths } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * One entry per language version of every indexable page, each carrying the
 * hreflang alternates of its siblings. The rule for what is listed matches
 * pageMetadata() in lib/seo.ts: a BM or 中文 restaurant/SIM page is listed
 * only once its main text is translated, and a blog post only in the
 * languages it has been published in. Anything else would advertise a thin
 * duplicate of the English page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teeko.ai';

    const escapeXml = (unsafe: string) => {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
            return c;
        });
    };

    // Home is the bare origin in English (no trailing slash), /ms and /zh otherwise.
    const absolute = (locale: Locale, path: string) => {
        const localized = pathFor(locale, path);
        return escapeXml(`${baseUrl}${localized === '/' ? '' : localized}`);
    };

    // Only a date the database actually holds counts as a lastmod. An entry
    // with no usable date is published without one.
    const editedAt = (...candidates: (string | undefined | null)[]) => {
        for (const c of candidates) {
            if (!c) continue;
            const d = new Date(c);
            if (!isNaN(d.getTime())) return d;
        }
        return undefined;
    };

    /** Entries for every language a page is indexed in, each listing all of them as alternates. */
    const entries = (
        paths: LocalePaths,
        extra: { lastModified?: Date; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number },
    ): MetadataRoute.Sitemap => {
        const locales = LOCALES.filter((l) => paths[l]);
        const languages: Record<string, string> = {};
        for (const l of locales) languages[LANG_TAG[l]] = absolute(l, paths[l]!);
        if (paths.en) languages['x-default'] = absolute('en', paths.en);
        return locales.map((l) => ({
            url: absolute(l, paths[l]!),
            ...extra,
            alternates: { languages },
        }));
    };

    // Check if indexing is enabled globally
    try {
        const settingsRes = await fetch(`${API_BASE_URL}/admin/settings`, { next: { revalidate: 3600 } });
        if (settingsRes.ok) {
            const settings = await settingsRes.json();
            if (settings.googleIndexing === false) {
                return []; // Return empty sitemap if indexing is disabled
            }
        }
    } catch (error) {
        console.warn('Could not fetch settings for sitemap, continuing with existing rules.');
    }

    // A lastmod that is always "now" is a false freshness signal: Google learns
    // to discount a sitemap whose dates never settle. These are listing pages
    // whose content is whatever the database holds, so there is no meaningful
    // edit date for them. Omitting lastmod says "I do not know", which is true,
    // rather than "changed today", which is not. The legal pages are English
    // only and pending replacement (OPEN-ITEMS #3), so they are not listed.
    const staticPages = [
        '/',
        '/restaurants',
        '/travel-sim-malaysia',
    ].flatMap((route) => entries(
        Object.fromEntries(LOCALES.map((l) => [l, route])),
        { changeFrequency: 'daily', priority: route === '/' ? 1 : 0.8 },
    ));

    // Dynamic pages from API
    try {
        const [blogsRes, restaurantsRes, simPackagesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/blog/posts?locale=all`),
            // Live restaurants only, and all of them: the endpoint pages at 10 by default.
            fetch(`${API_BASE_URL}/restaurants?status=ACTIVE&limit=${ALL_ITEMS_LIMIT}`),
            fetch(`${API_BASE_URL}/sim/packages`),
        ]);

        const blogs = asList<any>(await blogsRes.json());
        const restaurants = asList<any>(await restaurantsRes.json())
            // restaurants.isIndexed is the per-page switch; absent means indexable.
            .filter((r: any) => r.isIndexed !== false);
        const simPackages = asList<any>(await simPackagesRes.json());

        // The blog index exists in a language once it has at least one post.
        const blogLocales = LOCALES.filter((l) => l === 'en' || blogs.some((p: any) => p.locale === l));
        const blogIndex = entries(
            Object.fromEntries(blogLocales.map((l) => [l, '/blog'])),
            { changeFrequency: 'daily', priority: 0.8 },
        );

        // Group language versions of one piece; a post without a group is its own group.
        const groups = new Map<string, any[]>();
        for (const post of blogs) {
            const key = post.translationGroupId ?? post.id;
            groups.set(key, [...(groups.get(key) ?? []), post]);
        }
        const blogPages = [...groups.values()].flatMap((versions) => {
            const paths: LocalePaths = {};
            for (const v of versions) {
                const locale: Locale = isLocale(v.locale) ? v.locale : 'en';
                paths[locale] = `/blog/${v.slug}`;
            }
            return entries(paths, {
                lastModified: editedAt(...versions.flatMap((v) => [v.updatedAt, v.createdAt, v.publishedAt])),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });

        const restaurantPages = restaurants.flatMap((res: any) => entries(
            Object.fromEntries(
                LOCALES.filter((l) => isTranslated(res, l, 'description')).map((l) => [l, `/restaurant/${res.slug}`]),
            ),
            { lastModified: editedAt(res.updatedAt, res.createdAt), changeFrequency: 'weekly', priority: 0.6 },
        ));

        const simPages = simPackages.flatMap((pkg: any) => entries(
            Object.fromEntries(
                LOCALES.filter((l) => isTranslated(pkg, l, 'about')).map((l) => [l, `/travel-sim-malaysia/${pkg.slug}`]),
            ),
            { lastModified: editedAt(pkg.updatedAt, pkg.createdAt, pkg.publishedAt), changeFrequency: 'monthly', priority: 0.6 },
        ));

        return [...staticPages, ...blogIndex, ...blogPages, ...restaurantPages, ...simPages];

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticPages;
    }
}
