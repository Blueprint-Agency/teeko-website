import type { Dictionary } from "@/dictionaries/types";
import type { Locale } from "@/lib/i18n";

/**
 * Loads one language's dictionary. Server components call this directly;
 * client components read the same object from LocaleProvider (`useDict`).
 */
const loaders: Record<Locale, () => Promise<Dictionary>> = {
    en: () => import("@/dictionaries/en").then((m) => m.default),
    ms: () => import("@/dictionaries/ms").then((m) => m.default),
    zh: () => import("@/dictionaries/zh").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => loaders[locale]();
