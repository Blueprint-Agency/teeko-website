import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";
import { SimListPage } from "./SimListPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/travel-sim-malaysia">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return pageMetadata({
        locale,
        paths: samePath("/travel-sim-malaysia"),
        title: dict.sim.meta.title,
        description: dict.sim.meta.description,
    });
}

export default async function TravelSimPage({ params }: PageProps<"/[locale]/travel-sim-malaysia">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return <SimListPage />;
}
