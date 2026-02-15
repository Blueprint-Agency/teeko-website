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

interface Feature {
    title: string;
    description: string;
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
    providerId: string;
    provider: Provider | null;
    features: Feature[] | null;
}

async function getPackage(slug: string): Promise<Package | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/sim/packages/slug/${slug}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

async function getRelatedPackages(providerId: string, currentId: string): Promise<Package[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/sim/packages`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        const allPackages = await res.json();
        return allPackages.filter((pkg: Package) =>
            pkg.providerId === providerId && pkg.id !== currentId
        ).slice(0, 4);
    } catch (error) {
        return [];
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

    const relatedPackages = await getRelatedPackages(pkg.providerId, pkg.id);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-20">
                <Breadcrumbs
                    items={[
                        { label: "Travel SIM", href: "/sim" },
                        { label: pkg.packageName }
                    ]}
                />

                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {pkg.featureImage && (
                                <div className="aspect-square lg:aspect-auto h-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                    <img
                                        src={pkg.featureImage}
                                        alt={pkg.packageName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center">
                                <div className="mb-6 md:mb-10">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                            Travel SIM
                                        </span>
                                        {pkg.provider && (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {pkg.provider.name}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1]">
                                        {pkg.packageName}
                                    </h1>

                                    <div className="flex items-baseline mb-4 md:mb-8">
                                        <span className="text-3xl md:text-6xl font-black text-red-600 dark:text-red-500">
                                            {pkg.price}
                                        </span>
                                    </div>

                                    {pkg.about && (
                                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-xl">
                                            {pkg.about}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 md:pt-10 border-t border-[var(--border)]">
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
                    </div>

                    {/* Core Product Features */}
                    {pkg.features && pkg.features.length > 0 && (
                        <div className="space-y-8">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white">Core Product Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {pkg.features.map((feature, index) => (
                                    <div key={index} className="flex gap-6">
                                        <div className="text-5xl md:text-8xl font-black text-red-600 tabular-nums shrink-0 leading-none">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="space-y-2 pt-2">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white">Supports Multiple Payment Methods</h2>
                        </div>

                        <div className="flex -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 md:pb-0 md:px-0 md:mx-0">
                            {/* Local Payments */}
                            <div className="min-w-[280px] md:min-w-0 snap-center bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 space-y-4 hover:shadow-xl transition-shadow">
                                <div className="aspect-[16/9] rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-base md:text-lg leading-tight">Local digital payment methods</h3>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800" alt="Local payments" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    It supports major e-wallets in Malaysia, such as DuitNow, ShopeePay, Touch 'n Go eWallet, Grabpay, and Boost.
                                </p>
                            </div>

                            {/* International Payments */}
                            <div className="min-w-[280px] md:min-w-0 snap-center bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 space-y-4 hover:shadow-xl transition-shadow">
                                <div className="aspect-[16/9] rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-base md:text-lg leading-tight">International payment methods</h3>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800" alt="International payments" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    It is compatible with credit/debit cards (Visa/MasterCard), FPX online banking, and commonly used international payment channels such as Alipay and WeChat Pay.
                                </p>
                            </div>

                            {/* Automated Flow */}
                            <div className="min-w-[280px] md:min-w-0 snap-center bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-6 space-y-4 hover:shadow-xl transition-shadow">
                                <div className="aspect-[16/9] rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-base md:text-lg leading-tight">Automated processing flow</h3>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800" alt="Automation" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Funds arrive in real time, and the system automatically completes SIM card activation and commission settlement, improving efficiency and transparency.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Package Details (Related Packages) */}
                    {relatedPackages.length > 0 && (
                        <div className="space-y-8 pt-8">
                            <div className="flex items-end justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white">Other Packages</h2>
                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Discover more options from {pkg.provider?.name}</p>
                                </div>
                                <Link href="/sim" className="text-red-600 dark:text-red-400 font-bold hover:underline hidden md:block">
                                    View All SIMs →
                                </Link>
                            </div>

                            <div className="flex -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:pb-0 sm:px-0 sm:mx-0">
                                {relatedPackages.map((rp) => (
                                    <div key={rp.id} className="min-w-[260px] sm:min-w-0 snap-center">
                                        <Link href={`/sim/${rp.slug}`} className="group">
                                            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                                {rp.featureImage && (
                                                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                                        <img src={rp.featureImage} alt={rp.packageName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                )}
                                                <div className="p-4 space-y-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-1">{rp.packageName}</h3>
                                                    <p className="text-red-600 dark:text-red-500 font-black text-lg">{rp.price}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
