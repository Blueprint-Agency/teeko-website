"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSwitch } from "./ThemeSwitch";

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
        { label: "About", href: "/about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white dark:bg-gray-900 shadow-md"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Left */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className={`text-xl font-bold transition-colors ${isScrolled
                            ? "text-gray-900 dark:text-white"
                            : "text-white"
                            }`}>
                            Teeko<span className={`font-normal ${isScrolled
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-white/70"
                                }`}>Advisor</span>
                        </span>
                    </Link>

                    {/* Center Menu - Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isScrolled
                                    ? "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                    : "text-white/90 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeSwitch isScrolled={isScrolled} />
                        <Link
                            href="/auth/login"
                            className="hidden sm:inline-flex items-center px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-colors shadow-sm"
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
                                <X className={`w-6 h-6 ${isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white"}`} />
                            ) : (
                                <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white"}`} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Fixed overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="relative bg-white dark:bg-gray-900 shadow-xl mx-4 mt-2 rounded-2xl overflow-hidden">
                        <div className="p-4 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
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
