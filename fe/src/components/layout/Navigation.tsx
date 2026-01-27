"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSwitch } from "../shared/ThemeSwitch";

export function Navigation({ forceSolid = false }: { forceSolid?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolledState, setIsScrolledState] = useState(false);

    const isScrolled = isScrolledState || forceSolid;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolledState(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: "Restaurants", href: "/restaurants" },
        { label: "eSIM", href: "/esim" },
        { label: "Blog", href: "/blog" },
        { label: "Teeko App", href: process.env.NEXT_PUBLIC_AI_APP_URL || "#", external: true, special: true },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
                ? "bg-white/90 dark:bg-[#0b0f14]/90 backdrop-blur-md shadow-sm border-b border-[var(--border)]"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <img
                                src="/teeko-icon.png"
                                alt="Teeko"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className={`text-lg font-bold transition-colors ${isScrolled
                            ? "text-gray-900 dark:text-white"
                            : "text-white"
                            }`}>
                            Teeko
                        </span>
                    </Link>

                    {/* Center Menu - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item: any) => (
                            item.external ? (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${item.special
                                        ? "bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20 hover:bg-primary-500/20 dark:hover:bg-primary-500/30 backdrop-blur-sm shadow-sm hover:shadow-primary-500/20 ring-1 ring-primary-500/10 hover:ring-primary-500/30"
                                        : isScrolled
                                            ? "text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-[var(--background-alt)]"
                                            : "text-white/90 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled
                                        ? "text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-[var(--background-alt)]"
                                        : "text-white/90 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeSwitch isScrolled={isScrolled} />
                        <Link
                            href="/auth/login"
                            className="hidden sm:inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-semibold rounded-full transition-colors shadow-sm"
                        >
                            Sign In
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled
                                ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                                : "hover:bg-white/10"
                                }`}
                        >
                            {mobileMenuOpen ? (
                                <X className={`w-6 h-6 ${isScrolled ? "text-[var(--foreground)]" : "text-white"}`} />
                            ) : (
                                <Menu className={`w-6 h-6 ${isScrolled ? "text-[var(--foreground)]" : "text-white"}`} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Fixed overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-14 z-40">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="relative bg-[var(--card-bg)] border-b border-[var(--border)] shadow-2xl mx-4 mt-2 rounded-2xl overflow-hidden border border-[var(--border)]">
                        <div className="p-4 space-y-1">
                            {menuItems.map((item: any) => (
                                item.external ? (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${item.special
                                            ? "bg-primary-500/10 text-primary-600 border border-primary-500/20"
                                            : "text-[var(--foreground)] hover:bg-[var(--background-alt)]"
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-4 py-3 text-base font-medium text-[var(--foreground)] hover:bg-[var(--background-alt)] rounded-xl transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}
                        </div>
                        <div className="p-4 pt-0">
                            <Link
                                href="/auth/login"
                                className="block w-full px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

