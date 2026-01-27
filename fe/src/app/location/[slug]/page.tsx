import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Heart } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

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
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />

            <main className="max-w-container mx-auto px-4 py-12 pt-20">
                <Breadcrumbs
                    items={[
                        { label: "Destinations", href: "/locations" },
                        { label: location.name }
                    ]}
                />

                <div className="page-header border-b-0 pb-0">
                    <h1 className="page-title leading-tight">
                        Explore <span className="text-red-600">{location.name}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted max-w-3xl font-light">
                        Discover the top-rated restaurants, hidden gems, and essential experiences in {location.name}.
                    </p>
                </div>

                <div className="mt-8">

                    {/* Categories / Pills - Mobile Scrollable */}
                    <div className="flex gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {['All Recommendations', 'Restaurants', 'Hotels', 'Things to Do', 'Hidden Gems', 'Family Friendly'].map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap
                            ${i === 0
                                        ? 'bg-red-600 text-white border-transparent shadow-lg shadow-red-600/20'
                                        : 'bg-[var(--card-bg)] text-gray-700 border-[var(--border)] hover:border-red-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400'
                                    }`}
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
            </main>
            <Footer />
        </div>
    );
}
