import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Heart } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

async function getLocation(slug: string) {
    console.log(`[LocationPage] Fetching slug: ${slug}`);
    try {
        const res = await fetch(`${API_BASE_URL}/locations/${slug}`, { cache: "no-store" });
        console.log(`[LocationPage] Fetch status: ${res.status}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(`[LocationPage] Error:`, error);
        return null;
    }
}

// TODO: Filter restaurants by location once the API supports filtering/query params
async function getRestaurantsByLocation(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants?location=${slug}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const location = await getLocation(slug);
    if (!location) return { title: "Location Not Found" };

    return {
        title: `Best Food & Places in ${location.name} - Teeko`,
        description: location.seoDescription || `Discover top rated restaurants and attractions in ${location.name}, Malaysia.`,
    };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const location = await getLocation(slug);

    if (!location) {
        notFound();
    }

    const restaurants = await getRestaurantsByLocation(slug);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation forceSolid />
            {/* Minimalist Header with a bit more punch */}
            <div className="relative py-16 md:py-24 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-900">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                        Explore <span className="text-red-600">{location.name}</span>
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl text-gray-500 max-w-2xl font-light">
                        Discover the top-rated restaurants, hidden gems, and essential experiences in {location.name}.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">

                {/* Categories / Pills */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {['All Recommendations', 'Restaurants', 'Hotels', 'Things to Do', 'Hidden Gems', 'Family Friendly'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all 
                            ${i === 0 ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-700'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Section: Trending */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending in {location.name}</h2>
                        <a href="#" className="text-sm font-semibold text-gray-900 underline decoration-2 underline-offset-4 dark:text-white">See all</a>
                    </div>

                    {restaurants.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {restaurants.map((res: any) => (
                                <Link
                                    key={res.id}
                                    href={`/restaurant/${res.slug}`}
                                    className="group flex flex-col gap-3 cursor-pointer"
                                >
                                    <div className="aspect-[4/3] w-full relative rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                        {res.restaurantImages?.[0]?.url ? (
                                            <Image
                                                src={res.restaurantImages[0].url}
                                                alt={res.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-zinc-800">
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 text-black hover:scale-110 transition-transform shadow-sm">
                                            <Heart className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:underline decoration-1 underline-offset-2">{res.name}</h3>
                                        <div className="flex items-center gap-2 text-sm mt-1">
                                            <div className="flex items-center">
                                                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                                                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                                                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                                                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                                                <div className="h-3 w-3 rounded-full bg-red-500/30"></div>
                                            </div>
                                            <span className="text-gray-500 text-xs">120 reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                            {res.priceRange} • Malaysian • {res.location?.name || location.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {/* Mock additional items if not enough */}
                            {restaurants.length < 4 && [1, 2].map((i) => (
                                <div key={i} className="group flex flex-col gap-3 opacity-50 pointer-events-none grayscale">
                                    <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl"></div>
                                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No restaurants curated just yet.</p>
                        </div>
                    )}
                </div>

                {/* Section: Essential Experiences (Mocked) */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Essential {location.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer">
                            <Image
                                src="https://placehold.co/600x800?text=Night+Market"
                                alt="Activity"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 block">Must Do</span>
                                <h3 className="text-2xl font-bold">Jalan Alor Night Market</h3>
                            </div>
                        </div>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer">
                            <Image
                                src="https://placehold.co/600x800?text=Towers"
                                alt="Activity"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2 block">Landmark</span>
                                <h3 className="text-2xl font-bold">Petronas Twin Towers</h3>
                            </div>
                        </div>
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer">
                            <Image
                                src="https://placehold.co/600x800?text=Caves"
                                alt="Activity"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 block">Nature</span>
                                <h3 className="text-2xl font-bold">Batu Caves</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
