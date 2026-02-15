"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { calculateCombinedRating } from "@/utils/rating";
import Link from "next/link";

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    cuisine?: string;
    priceRange?: string;
    images?: { url: string }[];
    stats?: {
        googleStats?: { rating: number; totalReviews: number };
        tripAdvisorStats?: { rating: number; totalReviews: number };
    };
}

interface LocationCarouselProps {
    restaurants: Restaurant[];
    locationName: string;
    locationId: string;
}

export function LocationCarousel({ restaurants, locationName, locationId }: LocationCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const current = scrollRef.current;
        if (current) {
            current.addEventListener("scroll", checkScroll);
            // Initial check
            checkScroll();
            // Check again after images might have loaded
            window.addEventListener("resize", checkScroll);
        }
        return () => {
            if (current) current.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
    };

    return (
        <div className="not-prose mt-8 mb-16 group/carousel relative">
            <div className="flex items-center justify-between mb-8 px-1">
                <Link
                    href="/restaurants"
                    className="group/heading inline-flex items-center gap-3"
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none hover:text-red-600 transition-colors">
                        Explore {locationName}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover/heading:text-red-600 group-hover/heading:translate-x-1 transition-all" />
                </Link>
            </div>

            <div className="relative">
                {/* Navigation Arrows - Permanently Visible */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-[-24px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-900 dark:text-white hover:scale-110 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {showRightArrow && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-900 dark:text-white hover:scale-110 active:scale-95 transition-all"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 snap-x flex-nowrap scrollbar-hide"
                >
                    {restaurants.map((restaurant) => (
                        <Link
                            key={restaurant.id}
                            href={`/restaurant/${restaurant.slug}`}
                            className="w-[240px] md:w-[280px] flex-shrink-0 group snap-start block"
                        >
                            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                <img
                                    src={restaurant.images?.[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-lg shadow-lg">
                                                <Star className="h-2.5 w-2.5 fill-white text-white" />
                                                <span className="text-[10px] font-black text-white">
                                                    {calculateCombinedRating(restaurant.stats?.googleStats, restaurant.stats?.tripAdvisorStats).toFixed(1)}
                                                </span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                                                {restaurant.cuisine || "International"}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="text-white text-xl font-black leading-none uppercase tracking-tighter mb-1.5 group-hover:text-red-400 transition-colors line-clamp-1">{restaurant.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-none">
                                                    {restaurant.priceRange || "$$"} Range
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
