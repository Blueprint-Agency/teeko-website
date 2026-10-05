"use client";

import { createContext, useCallback, useContext } from "react";
import type { Dictionary } from "@/dictionaries/types";
import { DEFAULT_LOCALE, pathFor, type Locale } from "@/lib/i18n";

type LocaleContextValue = { locale: Locale; dict: Dictionary };

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Set once in `app/[locale]/layout.tsx` from the route param. It never reads
 * headers or cookies, so it does not opt any page out of static rendering.
 */
export function LocaleProvider({ locale, dict, children }: LocaleContextValue & { children: React.ReactNode }) {
    return <LocaleContext.Provider value={{ locale, dict }}>{children}</LocaleContext.Provider>;
}

function useLocaleContext(): LocaleContextValue {
    const value = useContext(LocaleContext);
    if (!value) throw new Error("LocaleProvider is missing above this component");
    return value;
}

export function useLocale(): Locale {
    return useContext(LocaleContext)?.locale ?? DEFAULT_LOCALE;
}

export function useDict(): Dictionary {
    return useLocaleContext().dict;
}

/** `localePath("/restaurants")` → `/ms/restaurants` on the BM site. */
export function useLocalePath(): (path: string) => string {
    const locale = useLocale();
    return useCallback((path: string) => pathFor(locale, path), [locale]);
}
