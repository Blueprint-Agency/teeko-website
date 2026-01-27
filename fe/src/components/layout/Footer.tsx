import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

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
                            Your trusted guide to discovering the best places in Malaysia.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] rounded-full flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] rounded-full flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-5 h-5 text-gray-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] rounded-full flex items-center justify-center transition-colors"
                            >
                                <Twitter className="w-5 h-5 text-gray-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-[var(--card-bg)] hover:bg-[var(--background)] border border-[var(--border)] rounded-full flex items-center justify-center transition-colors"
                            >
                                <Youtube className="w-5 h-5 text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-[var(--foreground)] font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm hover:text-red-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm hover:text-red-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/restaurants" className="text-sm hover:text-red-500 transition-colors">
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm hover:text-red-500 transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-[var(--foreground)] font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help" className="text-sm hover:text-red-500 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm hover:text-red-500 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm hover:text-red-500 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm hover:text-red-500 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-[var(--foreground)] font-semibold mb-4">We Accept</h3>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded text-xs font-medium text-[var(--foreground)]">Visa</div>
                            <div className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded text-xs font-medium text-[var(--foreground)]">Mastercard</div>
                            <div className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded text-xs font-medium text-[var(--foreground)]">PayPal</div>
                            <div className="px-3 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded text-xs font-medium text-[var(--foreground)]">GrabPay</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border)]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © {currentYear} Teeko. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-sm text-[var(--muted)] hover:text-red-500 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm text-[var(--muted)] hover:text-red-500 transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookies" className="text-sm text-[var(--muted)] hover:text-red-500 transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

