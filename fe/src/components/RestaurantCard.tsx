import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

interface RestaurantCardProps {
    id: string;
    name: string;
    slug: string;
    description?: string;
    priceRange?: string;
    restaurantImages?: { url: string; caption?: string }[];
    location?: { name: string; slug: string };
}

export function RestaurantCard({
    name,
    slug,
    description,
    priceRange,
    restaurantImages,
    location,
}: RestaurantCardProps) {
    const imageUrl = restaurantImages?.[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

    return (
        <Link
            href={`/restaurant/${slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Location Tag */}
                {location?.name && (
                    <div className="flex gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                            {location.name}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-secondary-400 text-secondary-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                4.5
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            (Reviews)
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {priceRange || "$$"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
