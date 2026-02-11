"use client";

import { Star, MapPin, BadgePercent, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RestaurantImage {
    caption?: string;
    isPrimary?: boolean;
    url: string;
}

export interface RestaurantCardProps {
    id: string | number;
    name: string;
    slug: string;
    description?: string;
    restaurantImages?: RestaurantImage[];
    rating?: number;
    reviewCount?: number;
    stats?: {
        id: string | number;
        googleStats: { link: string; rating: number; totalReviews: number };
        tripAdvisorStats: { link: string; rating: number; totalReviews: number };
    };
    cuisine?: string;
    priceRange?: string;
    address?: string;
    discount?: string;
    location?: { name: string; slug: string };
    isOpen?: boolean;
    showActions?: boolean;
}

export function RestaurantCard({
    id,
    name,
    slug,
    description,
    restaurantImages = [],
    rating = 4.5,
    reviewCount = 0,
    stats = {
        id,
        googleStats: { link: "", rating: 0, totalReviews: 0 },
        tripAdvisorStats: { link: "", rating: 0, totalReviews: 0 }
    },
    cuisine,
    priceRange = "$$",
    address,
    discount,
    location,
    isOpen,
    showActions = true,
}: RestaurantCardProps) {
    const router = useRouter();
    const imageUrl = restaurantImages[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

    return (
        <div
            onClick={() => router.push(`/restaurant/${slug}`)}
            className="group bg-[var(--card-bg)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--border)] flex flex-col h-full cursor-pointer relative"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-[var(--card-bg)]/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-900 dark:text-white shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    {rating}
                </div>

                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <BadgePercent className="w-4 h-4" />
                        {discount}
                    </div>
                )}

                {/* Open Status */}
                {isOpen !== undefined && (
                    <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${isOpen ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        }`}>
                        {isOpen ? "Open Now" : "Closed"}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Location / Tag */}
                <div className="flex items-center gap-2 mb-2">
                    {location?.name && (
                        <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[9px] font-bold uppercase tracking-wider rounded-lg">
                            {location.name}
                        </span>
                    )}
                    {cuisine && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            <Utensils className="w-2.5 h-2.5" />
                            {cuisine}
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-1 mb-1">
                    {name}
                </h3>

                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                        {description}
                    </p>
                )}

                {!description && address && (
                    <div className="flex items-start gap-1.5 text-gray-500 dark:text-gray-400 text-[11px] mb-3">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{address}</span>
                    </div>
                )}

                <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Price</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{priceRange}</span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Reviews</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{stats?.googleStats?.totalReviews || 0 + stats?.tripAdvisorStats?.totalReviews || 0} reviews</span>
                    </div>
                </div>

                {showActions && (
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/restaurant/${slug}#reserve`);
                            }}
                            className="flex-1 bg-red-600 text-[10px] text-white font-bold py-2 rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95"
                        >
                            Reserve
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/restaurant/${slug}#menu`);
                            }}
                            className="flex-1 border border-[var(--border)] text-gray-700 dark:text-gray-300 text-[10px] font-bold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all active:scale-95"
                        >
                            Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

