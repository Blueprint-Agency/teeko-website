"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GTMRouteChange() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

            // Traditional GTM spa pageview
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: "page_view",
                page_path: url,
                page_title: document.title,
                page_location: window.location.href,
            });

            // Also push a custom event for generic SPA tracking triggers
            (window as any).dataLayer.push({
                event: "spa_route_change",
                url: url
            });
        }
    }, [pathname, searchParams]);

    return null;
}
