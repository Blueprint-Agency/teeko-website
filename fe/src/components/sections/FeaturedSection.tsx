"use client";

import { RestaurantCard } from "../shared/RestaurantCard";

interface FeaturedSectionProps {
    restaurants: any[];
}

export function FeaturedSection({ restaurants }: FeaturedSectionProps) {
    if (restaurants.length === 0) return null;

    return (
        <section className="bg-[var(--background-alt)] pt-12 pb-4 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10 overflow-hidden">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="section-header">
                    <h2 className="section-title">
                        Featured Places
                    </h2>
                    <p className="section-description">
                        Hand-picked destinations that our community loves
                    </p>
                </div>

                {/* Grid / Horizontal Scroll */}
                <div className="flex -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:pb-0 sm:px-0 sm:mx-0">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="min-w-[280px] sm:min-w-0 snap-center">
                            <RestaurantCard {...restaurant} showActions={false} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

