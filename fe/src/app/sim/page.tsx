"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Dropdown } from "@/components/shared/Dropdown";

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
    const [selectedDuration, setSelectedDuration] = useState<string>("all");

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


    // Extract unique durations for filter
    const uniqueDurations = Array.from(new Set(packages.map(p => {
        if (!p.duration) return null;
        return `${p.duration} ${p.durationUnit || 'days'}`;
    }).filter(item => item !== null))) as string[];

    const filteredPackages = packages.filter(pkg => {
        const matchesProvider = selectedProvider === "all" || pkg.provider?.id === selectedProvider;
        const matchesDuration = selectedDuration === "all" || `${pkg.duration} ${pkg.durationUnit || 'days'}` === selectedDuration;
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
                            <Dropdown
                                label="Provider"
                                options={[
                                    { id: "all", label: "All Providers" },
                                    ...providers.map(p => ({ id: p.id, label: p.name }))
                                ]}
                                selectedId={selectedProvider}
                                onSelect={setSelectedProvider}
                            />

                            <Dropdown
                                label="Duration"
                                options={[
                                    { id: "all", label: "All Durations" },
                                    ...uniqueDurations.map(d => ({ id: d, label: d }))
                                ]}
                                selectedId={selectedDuration}
                                onSelect={setSelectedDuration}
                            />

                            {/* Feature Card */}
                            <div className="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg transition-transform hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent"></div>
                                <Sparkles className="w-8 h-8 mb-2 text-red-500" />
                                <h4 className="font-bold text-lg">New Releases</h4>
                                <p className="text-gray-400 text-sm">Check out our latest Travel SIM packages</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden flex flex-col gap-4 mb-8">
                        <div className="flex gap-3">
                            <Dropdown
                                className="flex-1"
                                options={[
                                    { id: "all", label: "All Providers" },
                                    ...providers.map(p => ({ id: p.id, label: p.name }))
                                ]}
                                selectedId={selectedProvider}
                                onSelect={setSelectedProvider}
                                placeholder="Provider"
                            />
                            <Dropdown
                                className="flex-1"
                                options={[
                                    { id: "all", label: "All Durations" },
                                    ...uniqueDurations.map(d => ({ id: d, label: d }))
                                ]}
                                selectedId={selectedDuration}
                                onSelect={setSelectedDuration}
                                placeholder="Duration"
                            />
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                            </div>
                        ) : (
                            <>
                                <div className="flex -mx-4 px-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:pb-0 md:px-0 md:mx-0">
                                    {filteredPackages.map(pkg => (
                                        <div key={pkg.id} className="min-w-[280px] md:min-w-0 snap-center h-auto">
                                            <Link
                                                href={`/sim/${pkg.slug}`}
                                                className="group h-full flex flex-col"
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
                                                            <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                                                                {pkg.packageName}
                                                            </h3>
                                                        </div>

                                                        {pkg.price && (
                                                            <div className="mb-3">
                                                                <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                                                    {pkg.price}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {pkg.provider && (
                                                                <span className="text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                                    {pkg.provider.name}
                                                                </span>
                                                            )}
                                                            {pkg.duration && (
                                                                <span className="text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                    {pkg.duration} {pkg.durationUnit || 'days'}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {pkg.about && (
                                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                                                {pkg.about}
                                                            </p>
                                                        )}

                                                        <div className="mt-auto pt-4 border-t border-[var(--border)]">
                                                            <div className="flex items-center justify-between text-red-600 dark:text-red-400 font-semibold text-xs md:text-sm group-hover:translate-x-1 transition-transform">
                                                                View Details <ExternalLink className="h-4 w-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
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
                                                setSelectedDuration("all");
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
