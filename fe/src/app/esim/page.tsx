"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface Provider {
    id: string;
    name: string;
    slug: string;
}

interface Package {
    id: string;
    packageName: string;
    slug: string;
    featureImage: string | null;
    price: string | null;
    about: string | null;
    provider: Provider | null;
}

export default function EsimPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<string>("all");
    const [providers, setProviders] = useState<Provider[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packagesRes, providersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/esim/packages`),
                    fetch(`${API_BASE_URL}/esim/providers`)
                ]);

                const packagesData = await packagesRes.json();
                const providersData = await providersRes.json();

                setPackages(Array.isArray(packagesData) ? packagesData : []);
                setProviders(Array.isArray(providersData) ? providersData : []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPackages = packages.filter(pkg => {
        const matchesProvider = selectedProvider === "all" || pkg.provider?.id === selectedProvider;

        // Parse price (remove "RM" and other non-digits)
        let priceVal = 0;
        if (pkg.price) {
            const numericString = pkg.price.replace(/[^\d]/g, "");
            priceVal = numericString ? parseInt(numericString, 10) : 0;
        }

        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;

        // If simple input logic, treat empty as no limit
        const matchesMin = !minPrice || priceVal >= min;
        const matchesMax = !maxPrice || priceVal <= max;

        return matchesProvider && matchesMin && matchesMax;
    });

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-24">
                <Breadcrumbs items={[{ label: "eSIM" }]} />

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        eSIM Packages
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Stay connected wherever you go with our curated eSIM offerings
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-8">
                        {/* Price Filter */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border)]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">RM</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-transparent border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all dark:text-white"
                                    />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">RM</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-transparent border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Provider Filter */}
                        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border)]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Providers</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedProvider("all")}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedProvider === "all"
                                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-[var(--background-alt)]"
                                        }`}
                                >
                                    <span>All Providers</span>
                                    {selectedProvider === "all" && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                </button>
                                {providers.map(provider => (
                                    <button
                                        key={provider.id}
                                        onClick={() => setSelectedProvider(provider.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedProvider === provider.id
                                                ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-[var(--background-alt)]"
                                            }`}
                                    >
                                        <span>{provider.name}</span>
                                        {selectedProvider === provider.id && <div className="w-2 h-2 rounded-full bg-red-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPackages.map(pkg => (
                                        <Link
                                            key={pkg.id}
                                            href={`/esim/${pkg.slug}`}
                                            className="group"
                                        >
                                            <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                                {pkg.featureImage && (
                                                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 relative">
                                                        <img
                                                            src={pkg.featureImage}
                                                            alt={pkg.packageName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                                                            {pkg.packageName}
                                                        </h3>
                                                    </div>

                                                    {pkg.price && (
                                                        <div className="mb-3">
                                                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                                {pkg.price}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {pkg.provider && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                            {pkg.provider.name}
                                                        </p>
                                                    )}

                                                    {pkg.about && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                                            {pkg.about}
                                                        </p>
                                                    )}

                                                    <div className="mt-auto pt-4 border-t border-[var(--border)]">
                                                        <div className="flex items-center justify-between text-red-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                            View Details <ExternalLink className="h-4 w-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {!loading && filteredPackages.length === 0 && (
                                    <div className="text-center py-16 bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] border-dashed">
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                                            No eSIM packages match your filters.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedProvider("all");
                                                setMinPrice("");
                                                setMaxPrice("");
                                            }}
                                            className="mt-4 text-red-600 font-medium hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

