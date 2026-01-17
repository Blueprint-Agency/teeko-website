import Link from "next/link";
import Image from "next/image";
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
        <div className="container mx-auto min-h-screen px-4 py-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Explore Destinations</h1>

            {locations.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {locations.map((loc: any) => (
                        <Link
                            key={loc.id}
                            href={`/location/${loc.slug}`}
                            className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-gray-200"
                        >
                            <div className="absolute inset-0 bg-gray-500 transition-transform duration-500 group-hover:scale-105" />
                            {/* Placeholder for Location Image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                                <span className="text-xl font-bold text-white shadow-sm">{loc.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No locations found.</p>
            )}
        </div>
    );
}
