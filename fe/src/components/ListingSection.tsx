"use client";

import { useState } from "react";
import { RestaurantCard } from "./RestaurantCard";
import { sampleRestaurants } from "@/data/sampleRestaurants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ListingSection() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(sampleRestaurants.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRestaurants = sampleRestaurants.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        All Restaurants
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sampleRestaurants.length)} of {sampleRestaurants.length} restaurants
                    </p>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {currentRestaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} {...restaurant} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-w-[40px] h-10 px-4 rounded-full font-medium transition-colors ${currentPage === page
                                    ? "bg-primary-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}
