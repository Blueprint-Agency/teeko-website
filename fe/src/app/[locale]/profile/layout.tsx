import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";

// The profile page is a client component, so its localized title is set here.
// Account pages are never indexed.
export async function generateMetadata({ params }: LayoutProps<"/[locale]/profile">): Promise<Metadata> {
    const { locale } = await params;
    const robots = { index: false, follow: false };
    if (!isLocale(locale)) return { robots };
    const dict = await getDictionary(locale);
    return {
        ...pageMetadata({ locale, paths: samePath("/profile"), title: dict.profile.meta.title }),
        robots,
    };
}

export default function ProfileLayout({ children }: LayoutProps<"/[locale]/profile">) {
    return children;
}
