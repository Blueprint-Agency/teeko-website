import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teeko.ai';

    // Static pages
    const staticPages = [
        '',
        '/blog',
        '/restaurants',
        '/sim',
        '/profile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
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
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });

        const restaurantPages = (Array.isArray(restaurants) ? restaurants : []).map((res: any) => {
            const date = new Date(res.updatedAt || res.createdAt);
            return {
                url: `${baseUrl}/restaurant/${res.slug}`,
                lastModified: isNaN(date.getTime()) ? new Date() : date,
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            };
        });

        const simPages = (Array.isArray(simPackages) ? simPackages : []).map((pkg: any) => {
            const date = new Date(pkg.updatedAt || pkg.createdAt);
            return {
                url: `${baseUrl}/sim/${pkg.slug}`,
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
