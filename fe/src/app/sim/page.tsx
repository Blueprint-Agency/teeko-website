"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, ChevronDown, Sparkles } from "lucide-react";
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
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packagesRes, providersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/sim/packages`),
                    fetch(`${API_BASE_URL}/sim/providers`)
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

        let matchesPrice = true;
        if (selectedPriceRange) {
            switch (selectedPriceRange) {
                case "under50":
                    matchesPrice = priceVal < 50;
                    break;
                case "50-100":
                    matchesPrice = priceVal >= 50 && priceVal <= 100;
                    break;
                case "100-200":
                    matchesPrice = priceVal > 100 && priceVal <= 200;
                    break;
                case "over200":
                    matchesPrice = priceVal > 200;
                    break;
            }
        }

        return matchesProvider && matchesPrice;
    });

    const priceRanges = [
        { id: "under50", label: "Under RM50" },
        { id: "50-100", label: "RM50 - RM100" },
        { id: "100-200", label: "RM100 - RM200" },
        { id: "over200", label: "Over RM200" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-24">
                <Breadcrumbs items={[{ label: "Travel SIM" }]} />

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Travel SIM Packages
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Stay connected wherever you go with our curated Travel SIM offerings
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) - Match Restaurant Page Style */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-8 self-start">
                        <div className="space-y-8">
                            {/* Filter Group: Provider */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Provider</h3>
                                <div className="relative">
                                    <select
                                        value={selectedProvider}
                                        onChange={(e) => setSelectedProvider(e.target.value)}
                                        className="w-full appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none cursor-pointer pr-10"
                                    >
                                        <option value="all">All Providers</option>
                                        {providers.map(provider => (
                                            <option key={provider.id} value={provider.id}>
                                                {provider.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Filter Group: Price (Button Style like Restaurant) */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Range</h3>
                                <div className="flex flex-wrap gap-2">
                                    {priceRanges.map(range => (
                                        <button
                                            key={range.id}
                                            onClick={() => setSelectedPriceRange(selectedPriceRange === range.id ? null : range.id)}
                                            className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${selectedPriceRange === range.id
                                                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                                                : "bg-[var(--card-bg)] border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Card */}
                            <div className="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
                                <Sparkles className="w-8 h-8 mb-2 text-red-500" />
                                <h4 className="font-bold text-lg">New Releases</h4>
                                <p className="text-gray-400 text-sm">Check out our latest Travel SIM packages</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden flex gap-3 overflow-x-auto pb-2">
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white"
                        >
                            <option value="all">All Providers</option>
                            {providers.map(provider => (
                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedPriceRange || ""}
                            onChange={(e) => setSelectedPriceRange(e.target.value || null)}
                            className="appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white"
                        >
                            <option value="">All Prices</option>
                            {priceRanges.map(range => (
                                <option key={range.id} value={range.id}>{range.label}</option>
                            ))}
                        </select>
                    </div>

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
                                            href={`/sim/${pkg.slug}`}
                                            className="group"
                                        >
                                            <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                                {pkg.featureImage && (
                                                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
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
                                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {pkg.price}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {pkg.provider && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                            {pkg.provider.name}
                                                        </p>
                                                    )}

                                                    {pkg.about && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                                            {pkg.about}
                                                        </p>
                                                    )}

                                                    <div className="mt-auto pt-4 border-t border-[var(--border)]">
                                                        <div className="flex items-center justify-between text-red-600 dark:text-red-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
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
                                            No Travel SIM packages match your filters.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedProvider("all");
                                                setSelectedPriceRange(null);
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
