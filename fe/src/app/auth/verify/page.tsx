import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            <Navigation forceSolid />
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Email Verified!
                        </h1>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Your email has been successfully verified. You can now sign in to your account
                            and start discovering amazing restaurants.
                        </p>

                        {/* Action Button */}
                        <Link
                            href="/auth/login"
                            className="inline-block w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            Sign In to Your Account
                        </Link>

                        {/* Home Link */}
                        <Link
                            href="/"
                            className="inline-block mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

