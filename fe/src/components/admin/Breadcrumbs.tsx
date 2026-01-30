"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = () => {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);

    // Map common path segments to readable labels
    const labels: Record<string, string> = {
        admin: "Admin",
        esim: "eSIM",
        packages: "Packages",
        providers: "Providers",
        create: "Create",
        edit: "Edit",
        restaurants: "Restaurants",
        locations: "Locations",
        blog: "Blog",
        settings: "Settings",
        dashboard: "Dashboard",
    };

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            <Link
                href="/admin/dashboard"
                className="flex items-center hover:text-red-600 transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>

            {paths.map((path, index) => {
                // Skip the first 'admin' segment if we want to start from Home
                if (path === "admin" && index === 0) return null;

                const href = `/${paths.slice(0, index + 1).join("/")}`;
                const isLast = index === paths.length - 1;

                // UUID regex to detect and skip IDs in breadcrumbs
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path);
                if (isUuid) return null;

                const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1);

                return (
                    <div key={path} className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        {isLast ? (
                            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-red-600 transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};
