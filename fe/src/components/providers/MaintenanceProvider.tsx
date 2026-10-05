"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Wrench } from "lucide-react";
import { localeFromPathname, type Locale } from "@/lib/i18n";
import enCommon from "@/dictionaries/en/common";
import msCommon from "@/dictionaries/ms/common";
import zhCommon from "@/dictionaries/zh/common";

// This provider sits above LocaleProvider (it also wraps the admin panel), so
// it reads the language from the URL instead of from context.
const MAINTENANCE_COPY: Record<Locale, typeof enCommon.maintenance> = {
    en: enCommon.maintenance,
    ms: msCommon.maintenance,
    zh: zhCommon.maintenance,
};

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const pathname = usePathname();
    const copy = MAINTENANCE_COPY[localeFromPathname(pathname ?? "/")];

    // IMMEDIATE EXEMPTION: Admin routes are never blocked or delayed
    const isAdminRoute = pathname?.startsWith("/admin");

    useEffect(() => {
        if (isAdminRoute) return;

        const checkMaintenance = async () => {

            try {
                const res = await fetch(`${API_BASE_URL}/admin/settings`, { cache: 'no-store' });
                if (res.ok) {
                    const settings = await res.json();
                    setIsMaintenance(!!settings.maintenanceMode);
                }
            } catch (error) {
                console.error("Failed to check maintenance mode:", error);
            }
        };

        checkMaintenance();
    }, [pathname, isAdminRoute]);

    if (isAdminRoute) return <>{children}</>;

    // The page renders immediately and is swapped for the maintenance screen
    // only when the check says so. Blocking on the check (a "Loading..."
    // screen until the browser fetch returned) meant the server-rendered HTML
    // of every public page was that loading screen: no content, no links, no
    // language switcher for any crawler that does not run JavaScript.
    if (isMaintenance) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6 text-center">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full" />
                    <div className="relative bg-[var(--card-bg)] rounded-[40px] p-8 shadow-2xl border border-[var(--border)]">
                        <Wrench className="w-16 h-16 text-primary-600" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6 tracking-tight leading-tight">
                    {copy.titleLine1} <br />
                    <span className="text-primary-600">{copy.titleLine2}</span>
                </h1>

                <div className="max-w-md space-y-6">
                    <p className="text-lg font-medium text-[var(--muted)] tracking-tight">
                        {copy.body}
                    </p>

                </div>

                <div className="mt-16 text-[10px] font-bold text-[var(--muted)] tracking-widest">
                    Teeko AI &bull; 2026
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
