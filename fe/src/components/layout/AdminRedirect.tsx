"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Automatically redirects admins to the dashboard if they land on frontend pages.
 */
export function AdminRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Don't redirect if already on an admin or auth page
        if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userStr && token) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
                    router.push("/admin/dashboard");
                }
            } catch (error) {
                // Silently fail if JSON is invalid
            }
        }
    }, [pathname, router]);

    return null;
}
