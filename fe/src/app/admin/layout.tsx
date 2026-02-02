"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
            router.push("/auth/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
                router.push("/");
                return;
            }
            setIsAuthorized(true);
        } catch (e) {
            router.push("/auth/login");
        }
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden uppercase">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12 scroll-smooth">
                <Breadcrumbs />
                {children}
            </main>
        </div>
    );
}

