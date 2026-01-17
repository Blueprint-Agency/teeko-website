import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/Button";
import { MapPin, DollarSign, Clock, Star, Heart, Share2, CheckCircle2, Globe, Phone, Utensils } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

async function getRestaurant(slug: string) {
    console.log(`[RestaurantPage] Fetching slug: ${slug}`);
    try {
        const url = `${API_BASE_URL}/restaurants/${slug}`;
        console.log(`[RestaurantPage] Fetch URL: ${url}`);
        const res = await fetch(url, {
            cache: "no-store",
        });

        console.log(`[RestaurantPage] Fetch status: ${res.status}`);

        if (!res.ok) {
            console.error(`[RestaurantPage] Failed to fetch. Status: ${res.status}`);
            if (res.status === 404) return null;
            throw new Error("Failed to fetch restaurant");
        }

        const data = await res.json();
        console.log(`[RestaurantPage] Fetch success. Data id: ${data.id}`);
        return data;
    } catch (error: any) {
        console.error(`[RestaurantPage] Error fetching restaurant:`, error);
        return { error: error.message || "Unknown error", details: JSON.stringify(error) };
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);
    if (!restaurant || restaurant.error) return { title: "Restaurant Not Found" };

    return {
        title: `${restaurant.name} - Teeko Advisor`,
        description: restaurant.seoDescription || restaurant.description?.substring(0, 160) || `Read reviews and find details about ${restaurant.name}.`,
    };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) {
        notFound();
    }

    const images = restaurant.restaurantImages?.map((img: any) => img.url) || [];
    const mainImage = images[0] || "https://placehold.co/800x600?text=No+Image";
    const secondaryImages = images.slice(1, 3); // Take next 2 images

    // Fill with placeholders if not enough images
    if (secondaryImages.length === 0) {
        secondaryImages.push("https://placehold.co/400x300?text=Food");
        secondaryImages.push("https://placehold.co/400x300?text=Interior");
    }

    return (
        <div className="min-h-screen bg-white pb-20 dark:bg-black">
            {/* Breadcrumbs (Mock) */}
            <div className="container mx-auto px-4 py-4 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <span className="cursor-pointer">Asia</span> &gt;
                <span className="cursor-pointer ml-1">Malaysia</span> &gt;
                <span className="cursor-pointer ml-1">{restaurant.location?.name || "Kuala Lumpur"}</span> &gt;
                <span className="cursor-pointer ml-1">Restaurants</span> &gt;
                <span className="ml-1 font-semibold text-gray-900 dark:text-white">{restaurant.name}</span>
            </div>

            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">{restaurant.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-red-500 text-red-500" />
                                ))}
                                <Star className="h-4 w-4 fill-transparent text-red-500" />
                            </div>
                            <span className="font-semibold ml-1 text-gray-700 dark:text-gray-300">2,299 reviews</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 dark:text-gray-300">{restaurant.priceRange}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 dark:text-gray-300 underline decoration-dotted">Asian, Malaysian, Halal</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-red-600 font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" /> Open now: 10:00 AM - 10:00 PM
                        </span>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-xl overflow-hidden relative">
                    <div className="md:col-span-2 relative h-full bg-gray-100 dark:bg-zinc-900">
                        <Image
                            src={mainImage}
                            alt={restaurant.name}
                            fill
                            className="object-cover hover:opacity-95 transition-opacity cursor-pointer"
                            priority
                            unoptimized
                        />
                        <Button className="absolute bottom-4 left-4 bg-white/90 text-black hover:bg-white border-0 gap-2 shadow-lg" size="sm">
                            <Share2 className="w-4 h-4" /> Share
                        </Button>
                    </div>
                    {/* Secondary Images Column */}
                    <div className="hidden md:flex flex-col gap-2 h-full">
                        {secondaryImages.map((img: string, idx: number) => (
                            <div key={idx} className="relative h-1/2 bg-gray-100 dark:bg-zinc-900">
                                <Image
                                    src={img}
                                    alt={`${restaurant.name} gallery ${idx}`}
                                    fill
                                    className="object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                    {/* Map / More Photos Placeholder */}
                    <div className="hidden md:block relative h-full bg-gray-100 dark:bg-zinc-900">
                        <Image
                            src="https://placehold.co/400x800?text=View+all+photos"
                            alt="More photos"
                            fill
                            className="object-cover hover:opacity-95 transition-opacity cursor-pointer"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center font-bold text-white text-lg pointer-events-none">
                            + 25 photos
                        </div>
                    </div>
                </div>

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Content (2/3) */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Tab-like Navigation */}
                        <div className="flex border-b border-gray-200 dark:border-zinc-800 sticky top-16 bg-white dark:bg-black z-20 pt-2 overflow-x-auto">
                            {[
                                { name: 'Overview', id: 'overview' },
                                { name: 'Menu', id: 'menu' },
                                { name: 'Reviews', id: 'reviews' },
                                { name: 'Location', id: 'location' }
                            ].map((tab, i) => (
                                <a
                                    key={tab.name}
                                    href={`#${tab.id}`}
                                    className={`px-6 py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${i === 0 ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                >
                                    {tab.name}
                                </a>
                            ))}
                        </div>

                        {/* About Section */}
                        <section id="overview">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About</h2>
                            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                {restaurant.description || "Experience authentic flavors in a modern setting. Perfect for families, dates, and casual dining."}
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full dark:bg-zinc-800">
                                        <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <span className="block font-semibold text-gray-900 dark:text-white">Price Range</span>
                                        <span className="text-gray-600 dark:text-gray-400">{restaurant.priceRange === '$$$' ? '$50 - $100' : '$10 - $30'}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full dark:bg-zinc-800">
                                        <Utensils className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <span className="block font-semibold text-gray-900 dark:text-white">Cuisines</span>
                                        <span className="text-gray-600 dark:text-gray-400">Malaysian, Asian, Fusion</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                        {/* Features */}
                        {/* Features */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Features</h2>
                            <div className="flex flex-wrap gap-4">
                                {['Reservations', 'Seating', 'Table Service', 'Takeout', 'Wheelchair Accessible'].map(feature => (
                                    <div key={feature} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-900 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-800">
                                        <CheckCircle2 className="w-4 h-4 text-red-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                        {/* Menu Section */}
                        <section id="menu" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Menu</h2>
                            <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-8 text-center border border-dashed border-gray-300 dark:border-zinc-700">
                                <Utensils className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Full Menu</h3>
                                <p className="text-gray-500 text-sm mb-4">Check out our delicious offerings.</p>
                                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">View Menu</Button>
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                        {/* Reviews Section */}
                        <section id="reviews" className="scroll-mt-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
                                <Button variant="primary" size="sm">Write a Review</Button>
                            </div>

                            {/* Mock Review */}
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b border-gray-100 dark:border-zinc-800 pb-6 last:border-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                            <div>
                                                <div className="font-semibold text-sm">John Doe</div>
                                                <div className="text-xs text-gray-500">Local Guide • 15 reviews</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className="w-3 h-3 fill-red-500 text-red-500" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">Reviewed yesterday</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                            Absolutely delicious food! The Nasi Lemak is a must-try. The service was excellent and the ambiance was perfect for a family dinner.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-px bg-gray-200 dark:bg-zinc-800" />

                        {/* Location / Map */}
                        <section id="location" className="scroll-mt-24">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Location & Contact</h2>
                            <div className="relative h-[300px] w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                                {/* Placeholder for real map */}
                                <Image
                                    src="https://placehold.co/800x400/png?text=Map+View"
                                    alt="Map"
                                    fill
                                    className="object-cover opacity-80"
                                    unoptimized
                                />
                                <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-red-500" />
                                        <span className="font-medium text-gray-900 dark:text-white">{restaurant.address}</span>
                                    </div>
                                    <Button variant="outline" size="sm">Get Directions</Button>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Sticky Sidebar (1/3) */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-4">
                            {/* Booking Card */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ring-1 ring-black/5">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reserve a table</h3>
                                <p className="text-sm text-gray-500 mb-6">Free reservation, instant confirmation.</p>

                                <div className="space-y-3 mb-6">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="border rounded-lg p-2.5 flex flex-col justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            <span className="text-xs text-gray-500">Date</span>
                                            <span className="font-semibold text-sm">Today</span>
                                        </div>
                                        <div className="border rounded-lg p-2.5 flex flex-col justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            <span className="text-xs text-gray-500">Guests</span>
                                            <span className="font-semibold text-sm">2 People</span>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-2.5 flex flex-col justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                        <span className="text-xs text-gray-500">Time</span>
                                        <span className="font-semibold text-sm">7:00 PM</span>
                                    </div>
                                </div>

                                {restaurant.reservationUrl ? (
                                    <a href={restaurant.reservationUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                                        <Button className="w-full h-12 text-base rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-red-200 shadow-lg">
                                            Reserve Now
                                        </Button>
                                    </a>
                                ) : (
                                    <Button className="w-full h-12 text-base rounded-full" disabled>
                                        Reservation Unavailable
                                    </Button>
                                )}
                                <div className="mt-3 text-center text-xs text-gray-400">
                                    Powered by Teeko Booking
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Contact Info</h4>
                                <ul className="space-y-4 text-sm">
                                    {restaurant.contactInfo?.website && (
                                        <li className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-gray-500" />
                                            <a href={restaurant.contactInfo.website} target="_blank" className="text-blue-600 hover:underline truncate w-full">Visitor Website</a>
                                        </li>
                                    )}
                                    {restaurant.contactInfo?.phone && (
                                        <li className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 dark:text-gray-300">{restaurant.contactInfo.phone}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

