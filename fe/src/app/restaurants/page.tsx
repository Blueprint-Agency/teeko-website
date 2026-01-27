import { API_BASE_URL } from "@/lib/constants";
import RestaurantsPage from "./RestaurantsPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Restaurants | Teeko',
    description: 'Find the best restaurants in Kuala Lumpur',
};


async function getRestaurants() {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

export default async function Page() {
    const restaurants = await getRestaurants();
    return <RestaurantsPage initialRestaurants={restaurants} />;
}

