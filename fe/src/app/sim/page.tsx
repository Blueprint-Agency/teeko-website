"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, ExternalLink, ChevronDown, Sparkles, Check } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
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
    duration: number | null;
    durationUnit: string | null;
    about: string | null;
    provider: Provider | null;
}

export default function EsimPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<string>("all");
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

    // Custom dropdown support
    const [providerMenuOpen, setProviderMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProviderMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Extract unique durations for filter
    const uniqueDurations = Array.from(new Set(packages.map(p => {
        if (!p.duration) return null;
        return `${p.duration} ${p.durationUnit || 'days'}`;
    }).filter(item => item !== null))) as string[];

    const filteredPackages = packages.filter(pkg => {
        const matchesProvider = selectedProvider === "all" || pkg.provider?.id === selectedProvider;
        const matchesDuration = !selectedDuration || `${pkg.duration} ${pkg.durationUnit || 'days'}` === selectedDuration;
        return matchesProvider && matchesDuration;
    }).sort((a, b) => {
        // Sort by Price (Lowest to Highest)
        const priceA = a.price ? parseInt(a.price.replace(/[^\d]/g, ""), 10) : Infinity;
        const priceB = b.price ? parseInt(b.price.replace(/[^\d]/g, ""), 10) : Infinity;
        return priceA - priceB;
    });

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
                    {/* Sidebar Filters (Desktop) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-24 self-start">
                        <div className="space-y-8">
                            {/* Filter Group: Provider (Custom Dropdown) */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Provider</h3>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setProviderMenuOpen(!providerMenuOpen)}
                                        className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none flex items-center justify-between transition-all"
                                    >
                                        <span className="truncate">
                                            {selectedProvider === "all" ? "All Providers" : providers.find(p => p.id === selectedProvider)?.name || "Select Provider"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${providerMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {providerMenuOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                                            <button
                                                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${selectedProvider === "all" ? "bg-red-50 dark:bg-red-900/10 text-red-600" : "hover:bg-[var(--background-alt)] text-[var(--foreground)]"}`}
                                                onClick={() => { setSelectedProvider("all"); setProviderMenuOpen(false); }}
                                            >
                                                All Providers
                                                {selectedProvider === "all" && <Check className="w-4 h-4 text-red-600" />}
                                            </button>
                                            {providers.map(provider => (
                                                <button
                                                    key={provider.id}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${selectedProvider === provider.id ? "bg-red-50 dark:bg-red-900/10 text-red-600" : "hover:bg-[var(--background-alt)] text-[var(--foreground)]"}`}
                                                    onClick={() => { setSelectedProvider(provider.id); setProviderMenuOpen(false); }}
                                                >
                                                    {provider.name}
                                                    {selectedProvider === provider.id && <Check className="w-4 h-4 text-red-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Filter Group: Duration (Replaces Price Range) */}
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Duration</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedDuration(null)}
                                        className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${!selectedDuration
                                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                                            : "bg-[var(--card-bg)] border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {uniqueDurations.sort().map(duration => (
                                        <button
                                            key={duration}
                                            onClick={() => setSelectedDuration(selectedDuration === duration ? null : duration)}
                                            className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${selectedDuration === duration
                                                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                                                : "bg-[var(--card-bg)] border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                                                }`}
                                        >
                                            {duration}
                                        </button>
                                    ))}
                                    {uniqueDurations.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No duration filters available</p>
                                    )}
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
                    <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {/* Mobile Provider Dropdown (Simple Select for Mobile UX usually better, but requirements said "own UI dropdown". Assuming Desktop requirement primarily, but keeping native select for mobile is often better for accessibility/usability unless explicitly asked to change mobile too. I'll stick to native for mobile to avoid complexity unless user complaints, as 'dropdown' usually refers to desktop) */}
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="all">All Providers</option>
                            {providers.map(provider => (
                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                            ))}
                        </select>

                        {/* Mobile Duration Filter */}
                        <select
                            value={selectedDuration || ""}
                            onChange={(e) => setSelectedDuration(e.target.value || null)}
                            className="appearance-none bg-[var(--card-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            <option value="">All Durations</option>
                            {uniqueDurations.sort().map(duration => (
                                <option key={duration} value={duration}>{duration}</option>
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

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {pkg.provider && (
                                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                                {pkg.provider.name}
                                                            </span>
                                                        )}
                                                        {pkg.duration && (
                                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                {pkg.duration} {pkg.durationUnit || 'days'}
                                                            </span>
                                                        )}
                                                    </div>

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
                                                setSelectedDuration(null);
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
