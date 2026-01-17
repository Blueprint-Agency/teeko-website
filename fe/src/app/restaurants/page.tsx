import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { MapPin, Star } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

async function getRestaurants() {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function RestaurantsIndexPage({ searchParams }: { searchParams: { search?: string } }) {
    const allRestaurants = await getRestaurants();
    const query = searchParams?.search?.toLowerCase() || "";

    const restaurants = query
        ? allRestaurants.filter((r: any) =>
            r.name.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query) ||
            r.location?.name?.toLowerCase().includes(query)
        )
        : allRestaurants;

    return (
        <div className="container mx-auto min-h-screen px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                {query ? `Search Results for "${searchParams.search}"` : "All Restaurants"}
            </h1>

            {restaurants.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((res: any) => (
                        <Link
                            key={res.id}
                            href={`/restaurant/${res.slug}`}
                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative">
                                {res.restaurantImages?.[0]?.url ? (
                                    <Image
                                        src={res.restaurantImages[0].url}
                                        alt={res.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <Image
                                            src="https://placehold.co/600x400"
                                            alt="placeholder"
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover opacity-50"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{res.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" /> {res.location?.name || "Malaysia"}
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        4.5 <Star className="h-3 w-3 fill-current" />
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                    <span>{res.priceRange}</span>
                                    <span>•</span>
                                    <span>Restaurant</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No restaurants found matching "{query}".</p>
                    <Link href="/restaurants">
                        <Button variant="outline" className="mt-4">Clear Search</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
