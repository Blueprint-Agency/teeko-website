import { API_BASE_URL } from "@/lib/constants";
import RestaurantDetailsPage from "./RestaurantDetailsPage";
import { Metadata } from 'next';
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slug: string }>
}

async function getRestaurant(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants/${slug}?status=ACTIVE`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);

    if (!restaurant) {
        return {
            title: "Restaurant Not Found",
        };
    }

    return {
        title: `Restaurant Details | Teeko`,
        description: `Details for restaurant ${slug}`,
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const restaurant = await getRestaurant(slug);
    if (!restaurant) {
        notFound();
    }
    console.log(restaurant)

    return <RestaurantDetailsPage initialRestaurant={restaurant} slug={slug} />;
}
