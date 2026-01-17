import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Teeko Advisor</h3>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Discover the best food and places in Malaysia.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Company</h4>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Support</h4>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Legal</h4>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 dark:border-zinc-800">
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Teeko Advisor. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
