import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n";
import { pageMetadata, samePath } from "@/lib/seo";

// The page is a client component, so its localized title is set here.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const dict = await getDictionary(locale);
    return pageMetadata({ locale, paths: samePath("/auth/login"), title: dict.auth.meta.loginTitle });
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
