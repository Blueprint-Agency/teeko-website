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

    // Static pages - Exclude /profile and other sensitive routes
    const staticPages = [
        '',
        '/blog',
        '/restaurants',
        '/travel-sim-malaysia',
    ].map((route) => ({
        url: escapeXml(`${baseUrl}${route}`),
        lastModified: new Date(),
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

        const blogPages = blogs.map((post: any) => {
            const date = new Date(post.updatedAt || post.createdAt);
            return {
                url: escapeXml(`${baseUrl}/blog/${post.slug}`),
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

        const restaurantPages = restaurants.map((res: any) => {
            const date = new Date(res.updatedAt || res.createdAt);
            return {
                url: escapeXml(`${baseUrl}/restaurant/${res.slug}`),
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            };
        });

        const simPages = simPackages.map((pkg: any) => {
            const date = new Date(pkg.updatedAt || pkg.createdAt);
            return {
                url: escapeXml(`${baseUrl}/travel-sim-malaysia/${pkg.slug}`),
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            };
        });

        return [...staticPages, ...blogPages, ...restaurantPages, ...simPages];

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticPages;
    }
}
