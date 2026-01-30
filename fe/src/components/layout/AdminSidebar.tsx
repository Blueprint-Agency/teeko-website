"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, MapPin, Settings, LogOut, Smartphone, FileText, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export const AdminSidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/restaurants", label: "Restaurants", icon: Store },
        { href: "/admin/locations", label: "Locations", icon: MapPin },
        {
            href: "/admin/esim",
            label: "eSIM",
            icon: Smartphone,
            children: [
                { href: "/admin/esim/providers", label: "Providers" },
                { href: "/admin/esim/packages", label: "Packages" },
            ]
        },
        { href: "/admin/blog", label: "Blog", icon: FileText },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 lg:hidden shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-gray-900 dark:text-white" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-zinc-800">
                    <span className="text-xl font-bold text-red-600">Teeko Admin</span>
                </div>

                <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        const hasChildren = link.children && link.children.length > 0;
                        const Icon = link.icon;

                        return (
                            <div key={link.href} className="space-y-1">
                                <Link
                                    href={hasChildren ? link.children![0].href : link.href}
                                    onClick={handleLinkClick}
                                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5" />
                                        {link.label}
                                    </div>
                                    {hasChildren && (
                                        <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? '' : '-rotate-90'}`} />
                                    )}
                                </Link>

                                {hasChildren && isActive && (
                                    <div className="ml-9 space-y-1 border-l-2 border-gray-100 dark:border-zinc-800 pl-2">
                                        {link.children!.map((child) => {
                                            const isChildActive = pathname === child.href;
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={handleLinkClick}
                                                    className={`block rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${isChildActive
                                                        ? "text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400"
                                                        : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800/50"
                                                        }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
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
        </>
    );
};

