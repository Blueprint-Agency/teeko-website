"use client";

import Link from "next/link";
import { FOOTER_SECTIONS, LEGAL_LINKS, type FooterLabelKey } from "@/lib/navigation";
import { useDict, useLocalePath } from "@/components/providers/LocaleProvider";
import { fmt } from "@/lib/i18n";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const dict = useDict();
    const localePath = useLocalePath();
    const label = (key: FooterLabelKey) =>
        key in dict.common.nav
            ? dict.common.nav[key as keyof typeof dict.common.nav]
            : dict.common.footer[key as keyof typeof dict.common.footer];

    return (
        <footer className="bg-[var(--background-alt)] text-[var(--muted)] border-t border-[var(--border)]">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src="/teeko-icon.png"
                                    alt="Teeko"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-[var(--foreground)]">
                                Teeko
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">
                            {dict.common.footer.tagline}
                        </p>
                    </div>


                    {/* Dynamic Sections */}
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.titleKey}>
                            <h3 className="text-[var(--foreground)] font-semibold mb-4">{dict.common.footer[section.titleKey]}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.englishOnly ? link.href : localePath(link.href)} className="text-sm hover:text-red-500 transition-colors">
                                            {label(link.labelKey)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border)]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            {fmt(dict.common.footer.rights, { year: currentYear })}
                        </p>
                        <div className="flex gap-6">
                            {LEGAL_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.englishOnly ? link.href : localePath(link.href)}
                                    className="text-sm text-[var(--muted)] hover:text-red-500 transition-colors"
                                >
                                    {label(link.labelKey)}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}

