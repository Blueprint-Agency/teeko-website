"use client";

import { useState, useEffect } from "react";
import { Store, MapPin, Users, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        restaurants: 0,
        locations: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/admin/stats`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Restaurants", value: loading ? "..." : stats.restaurants.toString(), icon: Store, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Total Locations", value: loading ? "..." : stats.locations.toString(), icon: MapPin, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Total Users", value: loading ? "..." : stats.users.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                                    {loading ? (
                                        <Loader2 className={`h-6 w-6 animate-spin ${stat.color}`} />
                                    ) : (
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <p className="mt-2 text-sm text-gray-500">No recent activity to show.</p>
            </div>
        </div>
    );
}
