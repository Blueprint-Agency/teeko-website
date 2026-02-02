"use client";

import { useState } from "react";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { Search, SlidersHorizontal, Map, MapPin, X, ChevronDown } from "lucide-react";

import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface RestaurantsPageProps {
    initialRestaurants: any[];
    locations: any[];
}

const RestaurantsPage = ({ initialRestaurants, locations }: RestaurantsPageProps) => {
    const [restaurants] = useState(initialRestaurants);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const filteredRestaurants = (restaurants || []).filter(restaurant => {
        // Filter by Cuisine
        if (selectedCuisines.length > 0 && !selectedCuisines.includes(restaurant.cuisine)) {
            return false;
        }
        // Filter by Price
        if (selectedPrice) {
            const priceParts = restaurant.priceRange?.split("-").map((p: string) => p.trim());
            if (!priceParts?.includes(selectedPrice)) {
                return false;
            }
        }
        // Filter by Location
        if (selectedLocation && restaurant.locationId !== selectedLocation) {
            return false;
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
        <div className="min-h-screen bg-[var(--background)] font-sans text-gray-900 dark:text-gray-100">
            <Navigation forceSolid />

            {/* Main Content */}
            <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <Breadcrumbs items={[{ label: "Restaurants" }]} />

                <div className="page-header flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <h1 className="page-title">
                            Discover Restaurants
                        </h1>
                        <p className="text-xl text-muted">
                            Explore the finest dining spots across Malaysia.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-[var(--background-alt)] transition-colors"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters (Desktop Focused) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-8 self-start">
                        <div className="space-y-8">
                            {/* Filter Group: Locations */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Location</h3>
                                <div className="relative">
                                    <select
                                        value={selectedLocation || ""}
                                        onChange={(e) => setSelectedLocation(e.target.value || null)}
                                        className="w-full appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-red-500 outline-none cursor-pointer pr-10"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
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
                                                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                                                : "bg-[var(--card-bg)] border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
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
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 overflow-x-auto sm:overflow-visible scrollbar-hide">
                            <div className="flex gap-6 border-b border-[var(--border)] w-full sm:w-auto">
                                {['All Restaurants', 'Top Rated', 'Most Reviewed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-3 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tab.toLowerCase()
                                            ? 'border-red-600 text-red-600'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium whitespace-nowrap">Showing {filteredRestaurants.length} of {restaurants?.length || 0} results</span>
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
            </main>
            <Footer />

            {/* Mobile Filters Drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-[var(--background)] shadow-2xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 rounded-full hover:bg-[var(--background-alt)]"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                            {/* Location Filter */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Location</h3>
                                <div className="relative">
                                    <select
                                        value={selectedLocation || ""}
                                        onChange={(e) => setSelectedLocation(e.target.value || null)}
                                        className="w-full appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-red-500 outline-none cursor-pointer pr-10"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Map View Link */}
                            <div className="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg mt-auto">
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
                                <Map className="w-8 h-8 mb-2 text-red-500" />
                                <h4 className="font-bold text-lg">View on Map</h4>
                                <p className="text-gray-400 text-sm">Explore restaurants near you</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border)] mt-6">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full py-4 bg-red-600 text-white font-bold rounded-xl"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantsPage;

