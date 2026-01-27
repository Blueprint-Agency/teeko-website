import { API_BASE_URL } from "@/lib/constants";
import BlogListPage from "./BlogListPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | Teeko',
    description: 'Discover travel tips, destination guides, and insider insights',
};

async function getPosts() {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch posts", error);
        return [];
    }
}

export default async function Page() {
    const posts = await getPosts();
    return <BlogListPage initialPosts={Array.isArray(posts) ? posts : []} />;
}

