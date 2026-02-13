"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GTMTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: "pageview",
                page: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
            });
        }
    }, [pathname, searchParams]);

    return null;
}
