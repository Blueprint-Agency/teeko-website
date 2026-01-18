import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src="/teeko-icon.png"
                                    alt="Teeko"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">
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
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Navigation</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/restaurants" className="text-sm hover:text-white transition-colors">
                                    Restaurants
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help" className="text-sm hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">We Accept</h3>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-2 bg-gray-800 rounded text-xs font-medium">Visa</div>
                            <div className="px-3 py-2 bg-gray-800 rounded text-xs font-medium">Mastercard</div>
                            <div className="px-3 py-2 bg-gray-800 rounded text-xs font-medium">PayPal</div>
                            <div className="px-3 py-2 bg-gray-800 rounded text-xs font-medium">GrabPay</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © {currentYear} Teeko. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
