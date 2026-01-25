import { API_BASE_URL } from "@/utils/constants";
import RestaurantDetailsPage from "./RestaurantDetailsPage";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Restaurant Details | Teeko`,
        description: `Details for restaurant ${slug}`,
    };
}

async function getRestaurants() {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const restaurants = await getRestaurants();
    const restaurant = restaurants.find((r: any) => r.slug === slug) || null;

    return <RestaurantDetailsPage initialRestaurant={restaurant} slug={slug} />;
}
