import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { API_BASE_URL } from "@/utils/constants";

async function getRestaurants() {
  try {
    const res = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main>
        <HeroSection />

        {restaurants.length > 0 ? (
          <>
            <FeaturedSection restaurants={restaurants.slice(0, 4)} />

            {/* All Restaurants Section */}
            <section className="bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
              <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Explore Places
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Browse our curated collection of amazing destinations
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {restaurants.slice(0, 8).map((restaurant: any) => (
                    <a
                      key={restaurant.id}
                      href={`/restaurant/${restaurant.slug}`}
                      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {restaurant.restaurantImages?.[0]?.url ? (
                          <img
                            src={restaurant.restaurantImages[0].url}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                            <span className="text-4xl font-bold text-white opacity-90">
                              {restaurant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex gap-2 mb-3">
                          {restaurant.location?.name && (
                            <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                              {restaurant.location.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                          {restaurant.name}
                        </h3>

                        {restaurant.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {restaurant.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {restaurant.priceRange || "$$"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {restaurants.length > 8 && (
                  <div className="text-center mt-12">
                    <a
                      href="/restaurants"
                      className="inline-flex items-center px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full transition-colors shadow-sm"
                    >
                      View All Restaurants
                    </a>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="bg-gray-50 dark:bg-gray-950 py-20">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No Restaurants Yet
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  The database is currently empty. Add some restaurants through the admin panel to get started!
                </p>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 text-left max-w-2xl mx-auto">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>To add restaurants:</strong>
                  </p>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                    <li>Use the backend API: POST /restaurants</li>
                    <li>Or add them directly to the database</li>
                    <li>Make sure to add locations first</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        )}

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
