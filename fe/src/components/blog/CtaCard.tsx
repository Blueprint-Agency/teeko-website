import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { CtaContent } from "@/lib/blogCta";

// Conversion card used inside blog posts (the "cta" content block). Solid red
// so it reads as the one action on the page; white text and a white button
// for contrast. External URLs open in a new tab; internal paths stay in the app.
export function CtaCard({ heading, subheading, buttonText, url }: CtaContent) {
    if (!heading || !buttonText || !url) return null;
    const external = /^https?:\/\//i.test(url);
    const buttonClass =
        "inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-red-600 hover:bg-red-50 text-base font-bold rounded-2xl transition-all shadow-lg shadow-red-900/30 hover:-translate-y-0.5 active:scale-95 w-full md:w-auto shrink-0";

    return (
        <aside className="my-10 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-6 md:p-8 shadow-xl shadow-red-600/25 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {heading}
                </h3>
                {subheading && (
                    <p className="text-base text-white/85 leading-relaxed">
                        {subheading}
                    </p>
                )}
            </div>
            {external ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                    {buttonText} <ExternalLink className="h-5 w-5" />
                </a>
            ) : (
                <Link href={url} className={buttonClass}>
                    {buttonText} <ArrowRight className="h-5 w-5" />
                </Link>
            )}
        </aside>
    );
}
