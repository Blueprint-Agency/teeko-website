import Link from "next/link";
import { ExternalLink } from "lucide-react";

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

interface EsimSectionProps {
    packages: Package[];
}

export function EsimSection({ packages }: EsimSectionProps) {
    if (packages.length === 0) return null;

    return (
        <section className="bg-gray-50 dark:bg-zinc-950 py-12 sm:py-16 lg:py-20">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Our eSIM Providers
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Stay connected globally with our premium eSIM partners
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.slice(0, 3).map((pkg) => (
                        <Link
                            key={pkg.id}
                            href={`/esim/${pkg.slug}`}
                            className="group"
                        >
                            <div className="h-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1">
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
                                    <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
                                        Learn More <ExternalLink className="ml-2 h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/esim"
                        className="inline-flex items-center px-8 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                    >
                        View All eSIM Packages
                    </Link>
                </div>
            </div>
        </section>
    );
}
