import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';
import { asList, ALL_ITEMS_LIMIT } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

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
    // to discount a sitemap whose dates never settle. These four are listing
    // pages whose content is whatever the database holds, so there is no
    // meaningful edit date for them. Omitting lastmod says "I do not know",
    // which is true, rather than "changed today", which is not.
    const staticPages = [
        '',
        '/blog',
        '/restaurants',
        '/travel-sim-malaysia',
    ].map((route) => ({
        url: escapeXml(`${baseUrl}${route}`),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic pages from API
    try {
        const [blogsRes, restaurantsRes, simPackagesRes] = await Promise.all([
            fetch(`${API_BASE_URL}/blog/posts`),
            // Live restaurants only, and all of them: the endpoint pages at 10 by default.
            fetch(`${API_BASE_URL}/restaurants?status=ACTIVE&limit=${ALL_ITEMS_LIMIT}`),
            fetch(`${API_BASE_URL}/sim/packages`),
        ]);

        const blogs = asList<any>(await blogsRes.json());
        const restaurants = asList<any>(await restaurantsRes.json())
            // restaurants.isIndexed is the per-page switch; absent means indexable.
            .filter((r: any) => r.isIndexed !== false);
        const simPackages = asList<any>(await simPackagesRes.json());

        const blogPages = blogs.map((post: any) => ({
            url: escapeXml(`${baseUrl}/blog/${post.slug}`),
            lastModified: editedAt(post.updatedAt, post.createdAt, post.publishedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const restaurantPages = restaurants.map((res: any) => ({
            url: escapeXml(`${baseUrl}/restaurant/${res.slug}`),
            lastModified: editedAt(res.updatedAt, res.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        const simPages = simPackages.map((pkg: any) => ({
            url: escapeXml(`${baseUrl}/travel-sim-malaysia/${pkg.slug}`),
            lastModified: editedAt(pkg.updatedAt, pkg.createdAt, pkg.publishedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        return [...staticPages, ...blogPages, ...restaurantPages, ...simPages];

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticPages;
    }
}
