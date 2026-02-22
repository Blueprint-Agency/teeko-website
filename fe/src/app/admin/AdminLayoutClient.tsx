"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/admin/auth/login") {
            setIsAuthorized(true);
            return;
        }

        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
            router.push("/admin/auth/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
                router.push("/");
                return;
            }

            // Permission Based Routing check
            const permissions = user.permissions || {};
            const isSuperAdmin = user.role === 'SUPERADMIN';

            const routePermissions: Record<string, keyof typeof permissions | 'superadmin'> = {
                '/admin/admins': 'superadmin',
                '/admin/users': 'userManagement',
                '/admin/restaurants': 'restaurantManagement',
                '/admin/locations': 'restaurantManagement',
                '/admin/sim': 'simManagement',
                '/admin/blog': 'blogManagement',
                '/admin/settings': 'generalSettings',
            };

            const matchingRoute = Object.keys(routePermissions).find(route => pathname.startsWith(route));

            if (matchingRoute) {
                const required = routePermissions[matchingRoute];
                if (required === 'superadmin') {
                    if (!isSuperAdmin) {
                        router.push('/admin/dashboard');
                        return;
                    }
                } else if (!isSuperAdmin && !permissions[required as keyof typeof permissions]) {
                    router.push('/admin/dashboard');
                    return;
                }
            }

            setIsAuthorized(true);
        } catch (e) {
            router.push("/admin/auth/login");
        }
    }, [router, pathname]);

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    if (pathname === "/admin/auth/login") {
        return <div className="min-h-screen bg-[var(--background)]">{children}</div>;
    }

    return (
        <div className="flex h-[100dvh] bg-[var(--background)] overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12 scroll-smooth">
                <Breadcrumbs />
                {children}
            </main>
        </div>
    );
}
