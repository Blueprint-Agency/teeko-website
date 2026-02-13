import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { EsimSection } from "@/components/sections/EsimSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { Footer } from "@/components/layout/Footer";
import { API_BASE_URL } from "@/lib/constants";

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
    const res = await fetch(`${API_BASE_URL}/sim/packages`, { cache: "no-store" });
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
      </main>
      <Footer />
    </div>
  );
}

