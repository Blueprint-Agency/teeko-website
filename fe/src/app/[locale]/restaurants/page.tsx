import { API_BASE_URL } from "@/lib/constants";
import RestaurantsPage from "./RestaurantsPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { pageMetadata, samePath } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/restaurants">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return pageMetadata({
        locale,
        paths: samePath("/restaurants"),
        title: dict.restaurants.meta.listTitle,
        description: dict.restaurants.meta.listDescription,
    });
}

async function getLocations() {
    try {
        const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

async function getRestaurants() {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants?status=ACTIVE`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function Page({ params }: PageProps<"/[locale]/restaurants">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [restaurants, locations] = await Promise.all([
        getRestaurants(),
        getLocations()
    ]);
    return <RestaurantsPage initialRestaurants={restaurants} locations={locations} />;
}
