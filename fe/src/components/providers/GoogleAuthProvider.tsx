"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { usePathname } from "next/navigation";
import { localeFromPathname, type Locale } from "@/lib/i18n";

// Google Identity Services locale codes for the "Sign in with Google" button.
const GOOGLE_LOCALE: Record<Locale, string> = { en: "en", ms: "ms", zh: "zh-CN" };

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    // Sits above LocaleProvider (it also wraps admin), so the language comes from the URL.
    // Google's script loads once per page load, so the button keeps the language
    // the visitor arrived in until the next full load.
    const locale = localeFromPathname(usePathname() ?? "/");

    // Always provide the context: the sign-in pages render <GoogleLogin>, which
    // throws outside a provider. Without a client ID the button simply fails to
    // sign in instead of taking the whole page (and the build) down.
    if (!clientId) {
        console.warn("Google Client ID is missing. Google Login will not work.");
    }

    return (
        <GoogleOAuthProvider clientId={clientId} locale={GOOGLE_LOCALE[locale]}>
            {children}
        </GoogleOAuthProvider>
    );
}
