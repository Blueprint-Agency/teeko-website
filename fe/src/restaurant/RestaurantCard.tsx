import { Star, MapPin, BadgePercent } from "lucide-react";
import { useRouter } from "next/navigation";

interface RestaurantCardProps {
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    cuisine: string;
    priceRange: string;
    address: string;
    discount?: string;
    id: number;
}

const RestaurantCard = ({
    name,
    image,
    rating,
    reviewCount,
    cuisine,
    priceRange,
    address,
    discount,
    id,
}: RestaurantCardProps) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/restaurant/${id}`)}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full cursor-pointer relative"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-red-600 shadow-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-red-600" />
                    {rating}
                </div>
                {discount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-md flex items-center gap-1">
                        <BadgePercent className="w-4 h-4" />
                        {discount}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span>{cuisine}</span>
                            <span>•</span>
                            <span>{priceRange}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-3 mb-4">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="line-clamp-1">{address}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                    <span className="text-gray-400 text-xs font-medium">{reviewCount} reviews</span>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/restaurant/${id}`);
                            }}
                            className="flex-1 bg-red-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Reserve
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/restaurant/${id}`);
                            }}
                            className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            Menu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
