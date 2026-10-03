"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useDict, useLocalePath } from "@/components/providers/LocaleProvider";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

/** `href` values are unprefixed paths; the current language prefix is added here. */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const dict = useDict();
    const localePath = useLocalePath();
    return (
        <nav aria-label={dict.common.shared.breadcrumb} className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted">
                <li>
                    <Link
                        href={localePath("/")}
                        className="flex items-center hover:text-red-500 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">{dict.common.shared.home}</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        {item.href ? (
                            <Link
                                href={localePath(item.href)}
                                className="hover:text-red-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
