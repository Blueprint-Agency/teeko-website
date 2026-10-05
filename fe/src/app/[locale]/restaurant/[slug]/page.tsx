import { API_BASE_URL } from "@/lib/constants";
import RestaurantDetailsPage from "./RestaurantDetailsPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { availableLocales, isLocale, localized, type Translations } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { pageMetadata, samePath } from "@/lib/seo";

type RestaurantMeta = {
    name: string;
    description?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    restaurantImages?: { url: string }[];
    translations?: Translations<{ description: string; seoTitle: string; seoDescription: string }>;
};

async function getRestaurant(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/restaurants/${slug}?status=ACTIVE`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: PageProps<"/[locale]/restaurant/[slug]">): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};
    const [restaurant, dict] = await Promise.all([
        getRestaurant(slug) as Promise<RestaurantMeta | null>,
        getDictionary(locale),
    ]);

    if (!restaurant) {
        return { title: dict.restaurants.meta.notFoundTitle };
    }

    const title = localized(restaurant, locale, "seoTitle") || `${restaurant.name} | Teeko`;
    const description =
        localized(restaurant, locale, "seoDescription") || localized(restaurant, locale, "description") || undefined;
    const image = restaurant.restaurantImages?.[0]?.url;

    return pageMetadata({
        locale,
        paths: samePath(`/restaurant/${slug}`),
        indexedIn: availableLocales(restaurant, "description"),
        title,
        description,
        images: image ? [image] : undefined,
    });
}

export default async function Page({ params }: PageProps<"/[locale]/restaurant/[slug]">) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const restaurant = await getRestaurant(slug);
    if (!restaurant) {
        notFound();
    }

    return <RestaurantDetailsPage initialRestaurant={restaurant} slug={slug} />;
}
