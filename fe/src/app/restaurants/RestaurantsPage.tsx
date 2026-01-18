"use client";

import { useState } from "react";
import RestaurantCard from "../../restaurant/RestaurantCard";
import { Search, SlidersHorizontal, Map, MapPin } from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// Mock Data
const MOCK_RESTAURANTS = [
    {
        id: 1,
        name: "Iketeru Restaurant",
        image: "https://media-cdn.tripadvisor.com/media/photo-o/17/f8/75/34/iketeru-restaurant.jpg",
        rating: 4.8,
        reviewCount: 2704,
        cuisine: "Japanese",
        priceRange: "$$$$",
        address: "3 Jalan Stesen Sentral Level 8, Hilton Hotel, Kuala Lumpur 50470 Malaysia",
        address_obj: {
            street1: "3 Jalan Stesen Sentral",
            street2: "Level 8, Hilton Hotel",
            city: "Kuala Lumpur",
            country: "Malaysia",
            postalcode: "50470",
            address_string: "3 Jalan Stesen Sentral Level 8, Hilton Hotel, Kuala Lumpur 50470 Malaysia"
        },
        // discount: "20% off",
    },
    {
        id: 2,
        name: "Sky51",
        image: "https://media-cdn.tripadvisor.com/media/photo-o/26/96/bc/92/sky51-facade.jpg",
        rating: 4.8,
        reviewCount: 461,
        cuisine: "International",
        priceRange: "$$$$",
        address: "Jalan Sultan Ismail Equatorial Plaza, Kuala Lumpur 50250 Malaysia",
        address_obj: {
            street1: "Jalan Sultan Ismail",
            street2: "Equatorial Plaza",
            city: "Kuala Lumpur",
            country: "Malaysia",
            postalcode: "50250",
            address_string: "Jalan Sultan Ismail Equatorial Plaza, Kuala Lumpur 50250 Malaysia"
        },
    },
    {
        id: 3,
        name: "Vasco's",
        image: "https://media-cdn.tripadvisor.com/media/photo-o/06/11/bf/f5/vasco-s-kl-hilton.jpg",
        rating: 4.8,
        reviewCount: 3242,
        cuisine: "International",
        priceRange: "$$ - $$$",
        address: "3 Jalan Stesen Sentral Lobby Level, Hilton Kuala Lumpur, Kuala Lumpur 50470 Malaysia",
        address_obj: {
            street1: "3 Jalan Stesen Sentral",
            street2: "Lobby Level, Hilton Kuala Lumpur",
            city: "Kuala Lumpur",
            country: "Malaysia",
            postalcode: "50470",
            address_string: "3 Jalan Stesen Sentral Lobby Level, Hilton Kuala Lumpur, Kuala Lumpur 50470 Malaysia"
        },
        // discount: "Free Dessert",
    },
    {
        id: 4,
        name: "Kampachi EQ",
        image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/19/magnificent-sushi-counter.jpg",
        rating: 4.9,
        reviewCount: 716,
        cuisine: "Japanese",
        priceRange: "$$$$",
        address: "Equatorial Hotel 27 Jalan Sultan Ismail, Kuala Lumpur 50250 Malaysia",
        address_obj: {
            street1: "Equatorial Hotel",
            street2: "27 Jalan Sultan Ismail",
            city: "Kuala Lumpur",
            country: "Malaysia",
            postalcode: "50250",
            address_string: "Equatorial Hotel 27 Jalan Sultan Ismail, Kuala Lumpur 50250 Malaysia"
        },
    },
    {
        id: 5,
        name: "The Mesh",
        image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2a/c6/ec/a4/merasa-kembali-kenangan.jpg",
        rating: 4.9,
        reviewCount: 345,
        cuisine: "International",
        priceRange: "$$$$",
        address: "Jalan Ampang Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail, Kuala Lumpur 50450 Malaysia",
        "address_obj": {
            "street1": "Jalan Ampang",
            "street2": "Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail",
            "city": "Kuala Lumpur",
            "country": "Malaysia",
            "postalcode": "50450",
            "address_string": "Jalan Ampang Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail, Kuala Lumpur 50450 Malaysia"
        },
    },
];

const RestaurantsPage = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const filteredRestaurants = MOCK_RESTAURANTS.filter(restaurant => {
        // Filter by Cuisine
        if (selectedCuisines.length > 0 && !selectedCuisines.includes(restaurant.cuisine)) {
            return false;
        }
        // Filter by Price
        if (selectedPrice) {
            const priceParts = restaurant.priceRange.split("-").map(p => p.trim());
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
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-20">
            <Navigation forceSolid />
            {/* Hero Header */}
            {/* <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Find the Best Restaurants
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 max-w-2xl">
                        Discover top-rated dining experiences curated just for you. From local favorites to world-class gastronomy.
                    </p>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-lg border border-gray-100 max-w-3xl">
                        <div className="flex-1 flex items-center px-4 gap-3 border-r border-gray-200">
                            <Search className="text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cuisine, restaurant, or dish..."
                                className="w-full py-3 outline-none text-gray-700 bg-transparent placeholder:text-gray-400 border-none focus:ring-0"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 gap-3">
                            <MapPin className="text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full py-3 outline-none text-gray-700 bg-transparent placeholder:text-gray-400 border-none focus:ring-0"
                            />
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 mb-20">
                <div className="flex gap-8">

                    {/* Sidebar Filters (Desktop Focused) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-8 self-start">
                        <div className="space-y-8">
                            {/* Filter Group: Categories */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" /> Filters
                                </h3>
                                <div className="space-y-3">
                                    {Array.from(new Set(MOCK_RESTAURANTS.map(r => r.cuisine))).map(cuisine => (
                                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCuisines.includes(cuisine)
                                                    ? "bg-red-600 border-red-600"
                                                    : "border-gray-300 group-hover:border-red-500"
                                                    }`}
                                                onClick={() => toggleCuisine(cuisine)}
                                            >
                                                {selectedCuisines.includes(cuisine) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-gray-600 group-hover:text-red-600 transition-colors">{cuisine}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Group: Price */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Price</h3>
                                <div className="flex gap-2">
                                    {['$', '$$', '$$$', '$$$$'].map(price => (
                                        <button
                                            key={price}
                                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                                            className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${selectedPrice === price
                                                ? "bg-red-600 border-red-600 text-white"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600"
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
                            <div className="flex gap-6 border-b border-gray-200">
                                {['All Restaurants', 'Top Rated', 'Most Reviewed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === tab.toLowerCase()
                                            ? 'border-red-600 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm font-medium">Showing {filteredRestaurants.length} of {MOCK_RESTAURANTS.length} results</span>
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
