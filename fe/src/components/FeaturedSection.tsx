"use client";

import { RestaurantCard } from "./RestaurantCard";

interface FeaturedSectionProps {
    restaurants: any[];
}

export function FeaturedSection({ restaurants }: FeaturedSectionProps) {
    if (restaurants.length === 0) return null;

    return (
        <section className="bg-gray-50 dark:bg-gray-950 py-12 sm:py-16 lg:py-20">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Places
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Hand-picked destinations that our community loves
                    </p>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} {...restaurant} />
                    ))}
                </div>
            </div>
        </section>
    );
}
