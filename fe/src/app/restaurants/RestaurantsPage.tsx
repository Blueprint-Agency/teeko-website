"use client";

import { useState } from "react";
import RestaurantCard from "../../restaurant/RestaurantCard";
import { Search, SlidersHorizontal, Map, MapPin } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface RestaurantsPageProps {
    initialRestaurants: any[];
}

const RestaurantsPage = ({ initialRestaurants }: RestaurantsPageProps) => {
    const [restaurants] = useState(initialRestaurants);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const filteredRestaurants = (restaurants || []).filter(restaurant => {
        // Filter by Cuisine
        if (selectedCuisines.length > 0 && !selectedCuisines.includes(restaurant.cuisine)) {
            return false;
        }
        // Filter by Price
        if (selectedPrice) {
            const priceParts = restaurant.priceRange.split("-").map((p: string) => p.trim());
            if (!priceParts.includes(selectedPrice)) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        if (activeTab === "top rated") {
            return b.rating - a.rating;
        } else if (activeTab === "most reviewed") {
            return b.reviewCount - a.reviewCount;
        }
        // Default sort (e.g. by ID or original order) for "all restaurants" or fallback
        return 0;
    });

    const toggleCuisine = (cuisine: string) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine)
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 pt-20">
            <Navigation forceSolid />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 mb-20">
                <div className="flex gap-8">

                    {/* Sidebar Filters (Desktop Focused) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-8 self-start">
                        <div className="space-y-8">
                            {/* Filter Group: Categories */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </h3>
                                {/* <div className="space-y-3">
                                    {Array.from(new Set((restaurants || []).map(r => r.cuisine))).map(cuisine => (
                                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCuisines.includes(cuisine)
                                                    ? "bg-red-600 border-red-600"
                                                    : "border-gray-300 dark:border-gray-600 group-hover:border-red-500"
                                                    }`}
                                                onClick={() => toggleCuisine(cuisine)}
                                            >
                                                {selectedCuisines.includes(cuisine) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{cuisine}</span>
                                        </label>
                                    ))}
                                </div> */}
                            </div>

                            {/* Filter Group: Price */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price</h3>
                                <div className="flex gap-2">
                                    {['$', '$$', '$$$', '$$$$'].map(price => (
                                        <button
                                            key={price}
                                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                                            className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${selectedPrice === price
                                                ? "bg-red-600 border-red-600 text-white"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                                                }`}
                                        >
                                            {price}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feature: Map View Toggle */}
                            <div className="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
                                <Map className="w-8 h-8 mb-2 text-red-500" />
                                <h4 className="font-bold text-lg">View on Map</h4>
                                <p className="text-gray-400 text-sm">Explore restaurants near you</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {/* Tabs / Sort */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
                                {['All Restaurants', 'Top Rated', 'Most Reviewed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === tab.toLowerCase()
                                            ? 'border-red-600 text-red-600'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Showing {filteredRestaurants.length} of {restaurants?.length || 0} results</span>
                        </div>

                        {/* Restaurant Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRestaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant.id} {...restaurant} />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        {/* <div className="mt-12 text-center">
                            <button className="px-8 py-3 bg-white border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
                                Load More Restaurants
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RestaurantsPage;
