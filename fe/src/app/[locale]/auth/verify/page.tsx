import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, pathFor } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/auth/verify">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return pageMetadata({ locale, paths: samePath("/auth/verify"), title: dict.auth.meta.verifyTitle });
}

export default async function VerifyPage({ params }: PageProps<"/[locale]/auth/verify">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = (await getDictionary(locale)).auth.verify;
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            <Navigation forceSolid />
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t.title}
                        </h1>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {t.body}
                        </p>

                        {/* Action Button */}
                        <Link
                            href={pathFor(locale, "/auth/login")}
                            className="inline-block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            {t.signInCta}
                        </Link>

                        {/* Home Link */}
                        <Link
                            href={pathFor(locale, "/")}
                            className="inline-block mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t.backHome}
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

