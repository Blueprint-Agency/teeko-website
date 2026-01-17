import { Navigation } from "@/components/Navigation";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Footer } from "@/components/Footer";
import { API_BASE_URL } from "@/utils/constants";

async function getLocations() {
    try {
        const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

export default async function LocationsIndexPage() {
    const locations = await getLocations();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore Destinations
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Discover the best dining experiences across Malaysia
                    </p>
                </div>

                {locations.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {locations.map((loc: any) => (
                            <a
                                key={loc.id}
                                href={`/location/${loc.slug}`}
                                className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-500 to-primary-700">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white opacity-90">
                                            {loc.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                                        {loc.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Explore restaurants
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">No locations found.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
