import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/**
 * Locale routing (Next 16 `proxy`, formerly middleware).
 *
 * Every public page lives under `app/[locale]/`. English is served without a
 * prefix: an unprefixed request is rewritten internally to `/en/...`, and a
 * direct hit on `/en/...` is redirected (308) to the unprefixed URL so there
 * is only ever one public English URL. `/ms/...` and `/zh/...` pass through.
 *
 * The rewrite adds no headers and reads nothing from the request beyond the
 * path, so pages keep static rendering where they had it.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
        return NextResponse.redirect(url, 308);
    }

    const prefixed = LOCALES.some(
        (locale) => locale !== DEFAULT_LOCALE && (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)),
    );
    if (prefixed) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    // Skip Next internals, the backend proxy (/api), the admin panel (its own
    // English-only root layout), metadata routes and any file with an extension.
    matcher: ["/((?!_next/static|_next/image|api|admin|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
};
