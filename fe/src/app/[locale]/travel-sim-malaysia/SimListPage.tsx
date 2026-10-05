"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink, Infinity, Mail, MapPin } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { asList } from "@/lib/api";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Dropdown } from "@/components/shared/Dropdown";
import { useDict, useLocale, useLocalePath } from "@/components/providers/LocaleProvider";
import { localized, type Translations } from "@/lib/i18n";
import { formatDuration } from "./simText";

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
    translations?: Translations<{ packageName: string; about: string }>;
}

/** Client half of /travel-sim-malaysia: packages are fetched in the browser, as before. */
export function SimListPage() {
    const dict = useDict();
    const t = dict.sim.list;
    const locale = useLocale();
    const localePath = useLocalePath();
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

                setPackages(asList(packagesData));
                setProviders(asList(providersData));
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
    const durationOptions = uniqueDurations.map(d => {
        const [n, unit] = d.split(" ");
        return { id: d, label: formatDuration(dict, Number(n), unit) };
    });

    const filteredPackages = packages.filter(pkg => {
        const matchesProvider = selectedProvider === "all" || pkg.provider?.id === selectedProvider;
        const matchesDuration = selectedDuration === "all" || `${pkg.duration} ${pkg.durationUnit || 'days'}` === selectedDuration;
        return matchesProvider && matchesDuration;
    }).sort((a, b) => {
        // Sort by Price (Lowest to Highest)
        const priceA = a.price ? (parseInt(a.price.replace(/[^\d]/g, ""), 10) || 0) : Number.MAX_SAFE_INTEGER;
        const priceB = b.price ? (parseInt(b.price.replace(/[^\d]/g, ""), 10) || 0) : Number.MAX_SAFE_INTEGER;
        return (priceA as number) - (priceB as number);
    });

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-8 pt-20 md:py-12 md:pt-24">
                <Breadcrumbs items={[{ label: dict.sim.breadcrumb }]} />

                <div className="mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                        {t.title}
                    </h1>
                </div>

                {/* Feature Icons Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 md:py-16 border-y border-[var(--border)] mb-10 md:mb-16">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full border-[3px] border-red-600 flex items-center justify-center text-red-600 bg-red-50 dark:bg-red-950/20">
                            <Mail size={28} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{t.features.noId.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug font-medium">
                                {t.features.noId.body}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full border-[3px] border-red-600 flex items-center justify-center text-red-600 bg-red-50 dark:bg-red-950/20">
                            <MapPin size={28} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{t.features.collection.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug font-medium">
                                {t.features.collection.body}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full border-[3px] border-red-600 flex items-center justify-center text-red-600 bg-red-50 dark:bg-red-950/20">
                            <Infinity size={28} strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{t.features.data.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug font-medium">
                                {t.features.data.body}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-left mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                        {t.pickTitle}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl font-medium">
                        {t.pickBody}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <div className="w-64 shrink-0 hidden lg:block sticky top-24 self-start">
                        <div className="space-y-8">
                            <Dropdown
                                label={t.provider}
                                options={[
                                    { id: "all", label: t.allProviders },
                                    ...providers.map(p => ({ id: p.id, label: p.name }))
                                ]}
                                selectedId={selectedProvider}
                                onSelect={setSelectedProvider}
                            />

                            <Dropdown
                                label={t.duration}
                                options={[
                                    { id: "all", label: t.allDurations },
                                    ...durationOptions
                                ]}
                                selectedId={selectedDuration}
                                onSelect={setSelectedDuration}
                            />
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    <div className="lg:hidden flex flex-col gap-4 mb-8">
                        <div className="flex gap-3">
                            <Dropdown
                                className="flex-1"
                                options={[
                                    { id: "all", label: t.allProviders },
                                    ...providers.map(p => ({ id: p.id, label: p.name }))
                                ]}
                                selectedId={selectedProvider}
                                onSelect={setSelectedProvider}
                                placeholder={t.provider}
                            />
                            <Dropdown
                                className="flex-1"
                                options={[
                                    { id: "all", label: t.allDurations },
                                    ...durationOptions
                                ]}
                                selectedId={selectedDuration}
                                onSelect={setSelectedDuration}
                                placeholder={t.duration}
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
                                                href={localePath(`/travel-sim-malaysia/${pkg.slug}`)}
                                                className="group h-full flex flex-col"
                                            >
                                                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                                    {pkg.featureImage && (
                                                        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                                                            <img
                                                                src={pkg.featureImage}
                                                                alt={localized(pkg, locale, "packageName")}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-5 flex flex-col flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                                                                {localized(pkg, locale, "packageName")}
                                                            </h3>
                                                        </div>

                                                        {pkg.price && (
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                                                    {pkg.price}
                                                                </span>
                                                                {pkg.price === "RM0" && (
                                                                    <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest bg-green-100 dark:bg-green-500/20 px-2 py-0.5 rounded-md">
                                                                        {dict.sim.freeBadge}
                                                                    </span>
                                                                )}
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
                                                                    {formatDuration(dict, pkg.duration, pkg.durationUnit)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {pkg.about && (
                                                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                                                {localized(pkg, locale, "about")}
                                                            </p>
                                                        )}

                                                        <div className="mt-auto pt-4 border-t border-[var(--border)]">
                                                            <div className="flex items-center justify-between text-red-600 dark:text-red-400 font-semibold text-xs md:text-sm group-hover:translate-x-1 transition-transform">
                                                                {t.viewDetails} <ExternalLink className="h-4 w-4" />
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
                                            {t.noMatch}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedProvider("all");
                                                setSelectedDuration("all");
                                            }}
                                            className="mt-4 text-red-600 font-medium hover:underline"
                                        >
                                            {t.clearFilters}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {/* FAQ / Q&A Section */}
                <div className="mt-12 md:mt-32 pt-10 md:pt-16 border-t border-[var(--border)]">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 md:mb-10 text-center tracking-tight">
                            {t.faq.title}
                        </h2>

                        <div className="grid gap-4 md:gap-6">
                            {[t.faq.where, t.faq.signUp, t.faq.packages, t.faq.eligible, t.faq.redeem, t.faq.cancel].map(item => (
                                <div key={item.q} className="p-6 md:p-8 rounded-2xl bg-gray-50 dark:bg-zinc-800/30 border border-transparent hover:border-red-600/20 transition-all duration-300">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">{item.q}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
