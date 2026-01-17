import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, Globe, Phone, DollarSign, Calendar, ChevronLeft, ExternalLink, Mail } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

async function getRestaurant(slug: string) {
    try {
        const url = `${API_BASE_URL}/restaurants/${slug}`;
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch restaurant");
        }

        return await res.json();
    } catch (error: any) {
        console.error(`[RestaurantPage] Error:`, error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);
    if (!restaurant) return { title: "Restaurant Not Found" };

    return {
        title: restaurant.seoTitle || `${restaurant.name} - Teeko Advisor`,
        description: restaurant.seoDescription || restaurant.description?.substring(0, 160) || `Discover ${restaurant.name}`,
    };
}

// Helper to format operating hours
function formatOperatingHours(hours: Record<string, string> | string | null) {
    if (!hours) return null;
    if (typeof hours === "string") return hours;

    return Object.entries(hours).map(([day, time]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1).replace(/_/g, " "),
        time: time,
    }));
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) {
        notFound();
    }

    const images = restaurant.restaurantImages?.map((img: any) => img.url) || [];
    const mainImage = images[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80";
    const operatingHours = formatOperatingHours(restaurant.operatingHours);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navigation />

            <main>
                {/* Hero Section with Image */}
                <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
                    <Image
                        src={mainImage}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Back Button */}
                    <div className="absolute top-6 left-6 z-10">
                        <Link
                            href="/restaurants"
                            className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-lg"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back</span>
                        </Link>
                    </div>

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                        <div className="max-w-container mx-auto">
                            {/* Location Badge */}
                            {restaurant.location?.name && (
                                <Link
                                    href={`/location/${restaurant.location.slug}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/90 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 hover:bg-primary-600 transition-colors"
                                >
                                    <MapPin className="w-4 h-4" />
                                    {restaurant.location.name}
                                </Link>
                            )}

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                {restaurant.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                {/* Rating */}
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">4.5</span>
                                    <span className="text-white/70">(2,299 reviews)</span>
                                </div>

                                {/* Price Range */}
                                {restaurant.priceRange && (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                        <DollarSign className="w-5 h-5" />
                                        <span className="font-medium">{restaurant.priceRange}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Section */}
                            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    {restaurant.description || "No description available."}
                                </p>
                            </section>

                            {/* Operating Hours */}
                            {operatingHours && (
                                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Operating Hours</h2>
                                    </div>

                                    {typeof operatingHours === "string" ? (
                                        <p className="text-gray-700 dark:text-gray-300">{operatingHours}</p>
                                    ) : (
                                        <div className="grid gap-3">
                                            {operatingHours.map(({ day, time }) => (
                                                <div key={day} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    <span className="font-medium text-gray-900 dark:text-white">{day}</span>
                                                    <span className="text-gray-600 dark:text-gray-400">{time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Gallery */}
                            {images.length > 0 && (
                                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {images.slice(0, 6).map((image: string, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 group cursor-pointer">
                                                <Image
                                                    src={image}
                                                    alt={`${restaurant.name} - Image ${idx + 1}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Make a Reservation</h3>

                                {restaurant.reservationUrl ? (
                                    <a
                                        href={restaurant.reservationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/25"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book a Table
                                    </a>
                                ) : (
                                    <button
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/25"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book a Table
                                    </button>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                    {/* Address */}
                                    {restaurant.address && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{restaurant.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {restaurant.contactInfo?.phone && restaurant.contactInfo.phone !== "N/A" && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                <a href={`tel:${restaurant.contactInfo.phone}`} className="text-primary-500 hover:text-primary-600 font-medium">
                                                    {restaurant.contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    {restaurant.contactInfo?.email && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <a href={`mailto:${restaurant.contactInfo.email}`} className="text-primary-500 hover:text-primary-600 font-medium">
                                                    {restaurant.contactInfo.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {restaurant.contactInfo?.website && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                                <a
                                                    href={restaurant.contactInfo.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                                                >
                                                    Visit Website
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Info */}
                            {restaurant.priceRange && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Price Range</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold text-primary-500">{restaurant.priceRange}</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {restaurant.priceRange === "$" && "Budget Friendly"}
                                            {restaurant.priceRange === "$$" && "Moderate"}
                                            {restaurant.priceRange === "$$$" && "Upscale"}
                                            {restaurant.priceRange === "$$$$" && "Fine Dining"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
