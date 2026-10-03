import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { asList } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";
import BlogListPage from "./BlogListPage";

// Always rendered per request: the post list comes straight from the database.
export const dynamic = "force-dynamic";

async function getPosts(locale: Locale | "all") {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts?locale=${locale}`, { cache: "no-store" });
        if (!res.ok) return [];
        return asList(await res.json());
    } catch (error) {
        console.error("Failed to fetch posts", error);
        return [];
    }
}

/**
 * The index exists in every language, but only counts as its own page (hreflang,
 * self canonical) in languages that have at least one post. An empty BM or 中文
 * index canonicalises to English. English is always indexed.
 */
async function localesWithPosts(): Promise<Locale[]> {
    const all = await getPosts("all");
    const present = new Set(all.map((p: { locale?: string }) => p.locale));
    return LOCALES.filter((l) => l === DEFAULT_LOCALE || present.has(l));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const [dict, indexedIn] = await Promise.all([getDictionary(locale), localesWithPosts()]);
    return pageMetadata({
        locale,
        paths: samePath("/blog"),
        indexedIn,
        title: dict.blog.meta.title,
        description: dict.blog.meta.description,
    });
}

export default async function Page({ params }: PageProps<"/[locale]/blog">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const posts = await getPosts(locale);
    return <BlogListPage initialPosts={Array.isArray(posts) ? posts : []} />;
}
