import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Page not found · Teeko",
    robots: { index: false, follow: false },
};

/**
 * 404 for URLs that match no route at all. It renders outside every layout,
 * so it cannot know the visitor's language; it offers all three home pages,
 * each labelled in its own language.
 */
export default function GlobalNotFound() {
    const homes = [
        { href: "/", lang: "en", title: "Page not found", cta: "Back to home" },
        { href: "/ms", lang: "ms", title: "Halaman tidak ditemui", cta: "Kembali ke laman utama" },
        { href: "/zh", lang: "zh-Hans", title: "页面不存在", cta: "返回首页" },
    ];

    return (
        <html lang="en">
            <body className="antialiased min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
                <main className="max-w-md w-full text-center space-y-8">
                    <img src="/teeko-icon.png" alt="Teeko" className="w-12 h-12 rounded-full mx-auto" />
                    <ul className="space-y-6">
                        {homes.map((h) => (
                            <li key={h.lang} lang={h.lang}>
                                <p className="text-lg font-semibold text-[var(--foreground)] mb-2">{h.title}</p>
                                <a href={h.href} hrefLang={h.lang} className="text-primary-600 hover:underline">
                                    {h.cta}
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
            </body>
        </html>
    );
}
