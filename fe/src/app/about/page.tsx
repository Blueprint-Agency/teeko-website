import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        About Teeko
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Teeko is Malaysia's premier restaurant discovery platform, dedicated to helping
                            food lovers find their next favorite dining experience.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We believe that every meal should be memorable. Our mission is to connect diners with
                            the best restaurants across Malaysia, from hidden street food gems to fine dining establishments.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            What We Offer
                        </h2>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                            <li>Curated restaurant recommendations across Malaysia</li>
                            <li>Detailed reviews and ratings from our community</li>
                            <li>Easy-to-use search and filtering by location and cuisine</li>
                            <li>Up-to-date information on operating hours and contact details</li>
                            <li>Beautiful imagery to inspire your next dining adventure</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            Join Our Community
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Whether you're a local foodie or a traveler exploring Malaysia's culinary scene,
                            Teeko is your trusted companion for discovering exceptional dining experiences.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
