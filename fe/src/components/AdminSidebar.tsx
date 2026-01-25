"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, MapPin, Settings, LogOut, Smartphone, FileText } from "lucide-react";

export const AdminSidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/restaurants", label: "Restaurants", icon: Store },
        { href: "/admin/locations", label: "Locations", icon: MapPin },
        { href: "/admin/esim", label: "eSIM", icon: Smartphone },
        { href: "/admin/blog", label: "Blog", icon: FileText },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-zinc-800">
                <span className="text-xl font-bold text-red-600">Teeko Admin</span>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 p-4 dark:border-zinc-800">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/auth/login";
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};
