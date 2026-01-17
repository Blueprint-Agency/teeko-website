import { Search, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { HomeSearch } from "@/components/HomeSearch";
import { API_BASE_URL } from "@/utils/constants";

async function getData() {
  try {
    const [restaurantsRes, locationsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/locations`, { cache: "no-store" })
    ]);

    const restaurants = restaurantsRes.ok ? await restaurantsRes.json() : [];
    const locations = locationsRes.ok ? await locationsRes.json() : [];

    return {
      restaurants: restaurants.slice(0, 4), // Top 4
      locations: locations.slice(0, 5) // Top 5
    };
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
    return { restaurants: [], locations: [] };
  }
}

export default async function Home() {
  const { restaurants, locations } = await getData();

  const featuredLocation = locations[0];
  const sideLocations = locations.slice(1, 4);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section - Clean White */}
      <section className="relative flex flex-col items-center justify-start pt-20 px-4 text-center">
        <div className="relative z-10 w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Where to?
          </h1>

          {/* Search Container */}
          <div className="mx-auto w-full max-w-3xl">
            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-6 text-gray-600 font-medium">
              <button className="flex items-center gap-2 border-b-2 border-primary text-gray-900 pb-2">
                <Search className="w-5 h-5" /> Search All
              </button>
              <Link href="/restaurants" className="flex items-center gap-2 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-2 transition-all">
                Restaurants
              </Link>
              <Link href="/locations" className="flex items-center gap-2 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 pb-2 transition-all">
                Destinations
              </Link>
            </div>

            {/* Search Bar */}
            <HomeSearch />
          </div>
        </div>
      </section>

      {/* Featured Section - Sparker Style Cards */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Trending Restaurants</h2>
          <p className="mt-2 text-lg text-gray-500">Discover the best food people are talking about</p>
        </div>

        {restaurants.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.map((res: any) => (
              <Link key={res.id} href={`/restaurant/${res.slug}`} className="group cursor-pointer rounded-2xl bg-white transition-all hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                  <div className="absolute top-3 left-3 z-10 rounded-md bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 backdrop-blur-sm">
                    Restaurant
                  </div>
                  <div className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-gray-900 backdrop-blur-sm hover:text-primary transition-colors">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-700 relative">
                    {res.restaurantImages?.[0]?.url ? (
                      <Image
                        src={res.restaurantImages[0].url}
                        alt={res.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{res.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
                    </span>
                    <span className="text-sm text-gray-500">350 reviews</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-900">{res.priceRange}</span> • {res.location?.name || "Malaysia"}
                    </div>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      Open Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No restaurants trending right now.</p>
          </div>
        )}
      </section>

      {/* Destinations Section - Tile Grid */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <p className="mt-2 text-lg text-gray-500">Explore top cities in Malaysia</p>
          </div>

          {locations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-2 h-[600px]">
              {/* Main Large Tile */}
              {featuredLocation && (
                <Link href={`/location/${featuredLocation.slug}`} className="group relative md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl bg-gray-200">
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    {/* Dynamic Image Placeholder - Replace with real location images if available in schema later */}
                    <Image
                      src={`https://placehold.co/800x800?text=${featuredLocation.name}`}
                      alt={featuredLocation.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-bold">{featuredLocation.name}</h3>
                    <p className="mt-1 font-medium bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full text-sm">Explore</p>
                  </div>
                </Link>
              )}

              {/* Smaller Tiles */}
              {sideLocations.map((loc: any, index: number) => {
                // Adjust spans for a masonry-ish feel if we have enough items
                const isWide = index === 2; // Make the 3rd item wide if it exists
                const classes = isWide
                  ? "group relative md:col-span-2 md:row-span-1 overflow-hidden rounded-3xl bg-gray-200"
                  : "group relative md:col-span-1 md:row-span-1 overflow-hidden rounded-3xl bg-gray-200";

                return (
                  <Link key={loc.id} href={`/location/${loc.slug}`} className={classes}>
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                      <Image
                        src={`https://placehold.co/600x400?text=${loc.name}`}
                        alt={loc.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className={isWide ? "text-2xl font-bold" : "text-xl font-bold"}>{loc.name}</h3>
                      {isWide && <p className="mt-1 font-medium bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full text-xs">Discover</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No destinations found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
