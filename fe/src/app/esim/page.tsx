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

    const filteredPackages = selectedProvider === "all"
        ? packages
        : packages.filter(pkg => pkg.provider?.id === selectedProvider);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-20">
                <Breadcrumbs items={[{ label: "eSIM" }]} />
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        eSIM Packages
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay connected wherever you go with our curated eSIM offerings
                    </p>
                </div>

                {/* Provider Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    <button
                        onClick={() => setSelectedProvider("all")}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${selectedProvider === "all"
                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                            : "bg-[var(--card-bg)] text-gray-700 dark:text-gray-300 border border-[var(--border)] hover:bg-[var(--background-alt)]"
                            }`}
                    >
                        All Providers
                    </button>
                    {providers.map(provider => (
                        <button
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider.id)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedProvider === provider.id
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                : "bg-[var(--card-bg)] text-gray-700 dark:text-gray-300 border border-[var(--border)] hover:bg-[var(--background-alt)]"
                                }`}
                        >
                            {provider.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map(pkg => (
                            <Link
                                key={pkg.id}
                                href={`/esim/${pkg.slug}`}
                                className="group"
                            >
                                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1">
                                    {pkg.featureImage && (
                                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950">
                                            <img
                                                src={pkg.featureImage}
                                                alt={pkg.packageName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {pkg.packageName}
                                            </h3>
                                            {pkg.price && (
                                                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                                    {pkg.price}
                                                </span>
                                            )}
                                        </div>
                                        {pkg.provider && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                by {pkg.provider.name}
                                            </p>
                                        )}
                                        {pkg.about && (
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                                {pkg.about}
                                            </p>
                                        )}
                                        <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
                                            View Details <ExternalLink className="ml-2 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredPackages.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No eSIM packages found for this provider.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

