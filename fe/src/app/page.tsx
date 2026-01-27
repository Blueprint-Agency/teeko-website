import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { EsimSection } from "@/components/EsimSection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { API_BASE_URL } from "@/utils/constants";

async function getRestaurants() {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getEsimPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/esim/packages`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getBlogPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const [restaurants, esimPackages, blogPosts] = await Promise.all([
    getRestaurants(),
    getEsimPackages(),
    getBlogPosts()
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main>
        <HeroSection />

        {/* 1. Featured Places */}
        {restaurants.length > 0 && (
          <FeaturedSection restaurants={restaurants.slice(0, 4)} />
        )}

        {/* 2. Our Esim Providers */}
        <EsimSection packages={esimPackages} />

        {/* 3. Explore Blogs */}
        <BlogSection posts={blogPosts} />

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
