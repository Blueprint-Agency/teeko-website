import { Metadata } from "next";
import { API_BASE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BookingButton } from "@/components/booking/BookingButton";

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
    ctaLink: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    provider: Provider | null;
}

async function getPackage(slug: string): Promise<Package | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/esim/packages/slug/${slug}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pkg = await getPackage(slug);

    if (!pkg) {
        return {
            title: "Package Not Found",
        };
    }

    return {
        title: pkg.seoTitle || pkg.packageName,
        description: pkg.seoDescription || pkg.about || `Learn more about ${pkg.packageName}`,
    };
}

export default async function EsimPackagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pkg = await getPackage(slug);

    if (!pkg) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-20">
                <Breadcrumbs
                    items={[
                        { label: "eSIM", href: "/esim" },
                        { label: pkg.packageName }
                    ]}
                />

                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl">
                        {pkg.featureImage && (
                            <div className="aspect-square overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950">
                                <img
                                    src={pkg.featureImage}
                                    alt={pkg.packageName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                                        {pkg.packageName}
                                    </h1>
                                    {pkg.provider && (
                                        <p className="text-lg text-gray-600 dark:text-gray-400">
                                            Provided by <span className="font-semibold text-red-600 dark:text-red-400">{pkg.provider.name}</span>
                                        </p>
                                    )}
                                </div>
                                {pkg.price && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                                        <p className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400">
                                            {pkg.price}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {pkg.about && (
                                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Package</h2>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                        {pkg.about}
                                    </p>
                                </div>
                            )}

                            <BookingButton
                                pkg={{
                                    id: pkg.id,
                                    packageName: pkg.packageName,
                                    price: pkg.price
                                }}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
