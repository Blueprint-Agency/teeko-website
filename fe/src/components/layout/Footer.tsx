import Link from "next/link";


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

