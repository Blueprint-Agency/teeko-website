import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { EsimSection } from "@/components/sections/EsimSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { Footer } from "@/components/layout/Footer";
import { API_BASE_URL } from "@/lib/constants";
import { asList } from "@/lib/api";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";

async function getRestaurants() {
  try {
    // Only live restaurants, and only as many as the featured strip shows.
    const res = await fetch(`${API_BASE_URL}/restaurants?status=ACTIVE&limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    return asList(await res.json());
  } catch {
    return [];
  }
}

async function getEsimPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/sim/packages`, { cache: "no-store" });
    if (!res.ok) return [];
    return asList(await res.json());
  } catch {
    return [];
  }
}

async function getBlogPosts(locale: Locale) {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts?locale=${locale}`, { cache: "no-store" });
    if (!res.ok) return [];
    return asList(await res.json());
  } catch {
    return [];
  }
}

// Title and description come from the settings row via the locale layout;
// this only adds canonical and hreflang.
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, paths: samePath("/") });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [restaurants, esimPackages, blogPosts, dict] = await Promise.all([
    getRestaurants(),
    getEsimPackages(),
    getBlogPosts(locale),
    getDictionary(locale),
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      <main>
        <HeroSection />

        {/* 1. Featured Places */}
        {restaurants.length > 0 && (
          <FeaturedSection restaurants={restaurants.slice(0, 4)} />
        )}

        {/* 2. Our Esim Providers */}
        <EsimSection packages={esimPackages} locale={locale} dict={dict.home.esim} />

        {/* 3. Explore Blogs */}
        <BlogSection posts={blogPosts} locale={locale} dict={dict.home.blog} />
      </main>
      <Footer />
    </div>
  );
}
