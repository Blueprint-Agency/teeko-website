import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';

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
        '/sim',
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
            fetch(`${API_BASE_URL}/restaurants`),
            fetch(`${API_BASE_URL}/sim/packages`),
        ]);

        const blogs = await blogsRes.json();
        const restaurants = await restaurantsRes.json();
        const simPackages = await simPackagesRes.json();

        const blogPages = (Array.isArray(blogs) ? blogs : []).map((post: any) => {
            const date = new Date(post.updatedAt || post.createdAt);
            return {
                url: escapeXml(`${baseUrl}/blog/${post.slug}`),
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

        const restaurantPages = (Array.isArray(restaurants) ? restaurants : []).map((res: any) => {
            const date = new Date(res.updatedAt || res.createdAt);
            return {
                url: escapeXml(`${baseUrl}/restaurant/${res.slug}`),
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            };
        });

        const simPages = (Array.isArray(simPackages) ? simPackages : []).map((pkg: any) => {
            const date = new Date(pkg.updatedAt || pkg.createdAt);
            return {
                url: escapeXml(`${baseUrl}/sim/${pkg.slug}`),
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
