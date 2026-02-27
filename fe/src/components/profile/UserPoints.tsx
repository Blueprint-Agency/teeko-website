"use client";

import { useState, useEffect } from "react";
import { Loader2, Flame, Award, Calendar, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

interface PointHistoryItem {
    id: string;
    event: string;
    pointsEarned: number;
    createdAt: string;
}

interface PointStats {
    points: number;
    currentStreak: number;
    longestStreak: number;
    lastLoginAt: string;
}

export function UserPoints() {
    const [stats, setStats] = useState<PointStats | null>(null);
    const [history, setHistory] = useState<PointHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await authFetch(`${API_BASE_URL}/users/points`);
            if (error) throw new Error(error);

            if (data) {
                setStats(data.stats);
                setHistory(data.history || []);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load points");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm border border-red-100 dark:border-red-900/30">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[var(--background-alt)] rounded-2xl p-6 border border-[var(--border)] group hover:border-gray-400 dark:hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-[var(--border)] shadow-sm">
                            <Award className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 dark:text-zinc-500">Total Points</p>
                    </div>
                    <p className="text-4xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
                        {stats?.points || 0}
                    </p>
                </div>

                <div className="bg-[var(--background-alt)] rounded-2xl p-6 border border-[var(--border)] group hover:border-gray-400 dark:hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-[var(--border)] shadow-sm">
                            <Flame className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 dark:text-zinc-500">Current Streak</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">{stats?.currentStreak || 0}</p>
                        <span className="text-sm font-bold text-gray-400 dark:text-zinc-500">Days</span>
                    </div>
                </div>

                <div className="bg-[var(--background-alt)] rounded-2xl p-6 border border-[var(--border)] group hover:border-gray-400 dark:hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-[var(--border)] shadow-sm">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 dark:text-zinc-500">Longest Streak</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">{stats?.longestStreak || 0}</p>
                        <span className="text-sm font-bold text-gray-400 dark:text-zinc-500">Days</span>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="pt-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Recent Activity
                </h4>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800 border-dashed">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No point history yet.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Book a SIM card or interact with the app to earn points!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {history.map((record) => (
                            <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background-alt)] border border-[var(--border)] hover:bg-[var(--background)] hover:border-gray-300 dark:hover:border-zinc-800 transition-all group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 mb-0.5">{record.event}</span>
                                    <span className="text-[11px] text-gray-500 dark:text-zinc-500 font-medium tabular-nums">
                                        {new Date(record.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-500 tabular-nums">
                                    +{record.pointsEarned}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
