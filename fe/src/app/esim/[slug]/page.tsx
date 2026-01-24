import { Metadata } from "next";
import { API_BASE_URL } from "@/utils/constants";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

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
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
            <Navigation forceSolid />
            <div className="container mx-auto px-4 py-16 pt-24">
                <Link href="/esim" className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to all packages
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl">
                        {pkg.featureImage && (
                            <div className="aspect-[21/9] overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950">
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

                            {pkg.ctaLink && (
                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
                                    <a
                                        href={pkg.ctaLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5"
                                    >
                                        Get This Package <ExternalLink className="ml-2 h-5 w-5" />
                                    </a>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        You'll be redirected to the provider's website to complete your purchase.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
