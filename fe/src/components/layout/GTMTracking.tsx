"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Component that listens for route changes and sends a virtual page_view event to GTM.
 * This is the standard way to handle SPA (Single Page Application) tracking in Next.js
 * to ensure that every internal navigation is recorded in GTM/GA4.
 */
export default function GTMTracking() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

            // Standard page_view event as per GA4/GTM recommendations for SPAs
            sendGTMEvent({
                event: "page_view",
                page_path: url,
                page_title: document.title,
                page_location: window.location.href,
            });

            // Custom event for more flexible triggers in GTM
            sendGTMEvent({
                event: "spa_route_changed",
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}
