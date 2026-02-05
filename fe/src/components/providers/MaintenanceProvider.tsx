"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Wrench, Clock, RefreshCcw } from "lucide-react";

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

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
            } finally {
                setLoading(false);
            }
        };

        checkMaintenance();
    }, [pathname, isAdminRoute]);

    if (isAdminRoute) return <>{children}</>;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="w-8 h-8 text-primary-500 animate-spin" />
                    <span className="text-xs font-semibold tracking-widest text-[var(--muted)]">Loading Experience...</span>
                </div>
            </div>
        );
    }

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
                    Undergoing <br />
                    <span className="text-primary-600">Maintenance</span>
                </h1>

                <div className="max-w-md space-y-6">
                    <p className="text-lg font-medium text-[var(--muted)] tracking-tight">
                        We are currently fine-tuning our platform to serve you better. We'll be back momentarily.
                    </p>

                    <div className="flex items-center justify-center gap-3 bg-[var(--background-alt)] border border-[var(--border)] px-6 py-3 rounded-full">
                        <Clock className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-bold tracking-widest text-[var(--muted)]">
                            Expected Uptime: Soon
                        </span>
                    </div>
                </div>

                <div className="mt-16 text-[10px] font-bold text-[var(--muted)] tracking-widest">
                    TEEKO &bull; TRIP ADVISOR &bull; 2026
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
