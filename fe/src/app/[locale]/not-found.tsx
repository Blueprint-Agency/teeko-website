"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useDict, useLocalePath } from "@/components/providers/LocaleProvider";

/** Shown when a page in a language calls notFound() (unknown slug, untranslated legal page). */
export default function NotFound() {
    const dict = useDict();
    const localePath = useLocalePath();

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <Navigation forceSolid />
            <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
                <div className="max-w-md text-center">
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">{dict.common.notFound.title}</h1>
                    <p className="text-[var(--muted)] mb-8">{dict.common.notFound.body}</p>
                    <Link
                        href={localePath("/")}
                        className="inline-flex items-center px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-colors"
                    >
                        {dict.common.notFound.backHome}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
