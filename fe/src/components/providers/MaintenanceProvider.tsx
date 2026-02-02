"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Wrench, Clock, RefreshCcw } from "lucide-react";

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const checkMaintenance = async () => {
            // Never block admin or auth routes
            if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
                setIsMaintenance(false);
                setLoading(false);
                return;
            }

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
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black uppercase italic">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="w-8 h-8 text-red-600 animate-spin" />
                    <span className="text-xs font-black tracking-widest text-gray-400">Loading Experience...</span>
                </div>
            </div>
        );
    }

    if (isMaintenance) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-6 text-center uppercase">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full" />
                    <div className="relative bg-zinc-900 rounded-[40px] p-8 shadow-2xl border border-zinc-800">
                        <Wrench className="w-16 h-16 text-red-600" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-none italic">
                    SYSTEM UNDERWIDE <br />
                    <span className="text-red-600">MAINTENANCE</span>
                </h1>

                <div className="max-w-md space-y-6">
                    <p className="text-lg font-bold text-gray-500 dark:text-zinc-400 tracking-tight">
                        We are currently fine-tuning our platform to serve you better. We'll be back momentarily.
                    </p>

                    <div className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-6 py-3 rounded-full">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-black tracking-widest text-gray-600 dark:text-zinc-300">
                            EXPECTED UPTIME: SOON
                        </span>
                    </div>
                </div>

                <div className="mt-16 text-[10px] font-black text-gray-400 dark:text-zinc-600 tracking-[0.3em]">
                    TEEKO &bull; TRIP ADVISOR &bull; 2026
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
