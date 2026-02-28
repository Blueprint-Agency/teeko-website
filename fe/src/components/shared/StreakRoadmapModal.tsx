"use client";

import { useState, useEffect } from "react";
import { Check, Flame, X, Gift } from "lucide-react";

export function StreakRoadmapModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [streakData, setStreakData] = useState<any>(null);

    useEffect(() => {
        // Check for streak data in localStorage
        const checkStreak = () => {
            const dataStr = localStorage.getItem("streak_popup");
            if (dataStr) {
                try {
                    const data = JSON.parse(dataStr);
                    if (data && data.streakUpdated) {
                        setStreakData(data);
                        setIsOpen(true);
                        // Clean up so it doesn't show again on refresh
                        localStorage.removeItem("streak_popup");
                    }
                } catch (e) {
                    console.error("Failed to parse streak popup data");
                }
            }
        };

        checkStreak();
        // Listen for custom event in case login happens without redirect
        window.addEventListener("streak-updated", checkStreak);
        return () => window.removeEventListener("streak-updated", checkStreak);
    }, []);

    if (!isOpen || !streakData) return null;

    const streakCount = streakData.newStreak || 1;
    const pointsAdded = streakData.pointsAdded || 0;

    // Calculate which cycle of 7 days we are in (0-indexed)
    const cycle = Math.floor((streakCount - 1) / 7);

    // Calculate the start day of this cycle (e.g., cycle 0 starts at day 1, cycle 1 starts at day 8)
    const startDay = cycle * 7 + 1;

    // Calculate the current position within the 7-day cycle (1 to 7)
    const currentPositionInCycle = ((streakCount - 1) % 7) + 1;

    // Is today the 7th day of the cycle?
    const isMilestone = currentPositionInCycle === 7;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="relative pt-10 pb-8 px-8 text-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <Flame className="w-7 h-7 text-red-600 dark:text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {streakCount} Day Streak!
                    </h2>
                    <p className="text-gray-500 dark:text-zinc-500 text-[13px] leading-relaxed max-w-[240px] mx-auto">
                        You're on fire! Keep logging in every day to earn more points.
                    </p>

                    <div className="mt-5 inline-flex items-center px-4 py-1.5 bg-green-500/5 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-[11px] font-bold uppercase tracking-widest rounded-full border border-green-500/10">
                        +{pointsAdded} Points Today
                    </div>
                </div>

                {/* Body roadmap */}
                <div className="px-8 pb-10">
                    <div className="relative flex justify-between items-center mb-10 h-1">
                        {/* Progress line background */}
                        <div className="absolute left-0 w-full h-[2px] bg-gray-100 dark:bg-zinc-900 rounded-full"></div>

                        {/* Active progress line */}
                        <div
                            className="absolute left-0 h-[2px] bg-red-600 transition-all duration-1000 ease-out"
                            style={{ width: `${((currentPositionInCycle - 1) / 6) * 100}%` }}
                        ></div>

                        {/* Nodes */}
                        {Array.from({ length: 7 }).map((_, i) => {
                            const nodePosition = i + 1;
                            const isPast = nodePosition < currentPositionInCycle;
                            const isCurrent = nodePosition === currentPositionInCycle;
                            const isLastNode = nodePosition === 7;

                            return (
                                <div key={i} className="relative z-10 flex flex-col items-center group">
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black tabular-nums transition-all duration-500 border-2 ${isPast
                                                ? 'bg-red-600 border-red-600 text-white'
                                                : isCurrent
                                                    ? 'bg-white dark:bg-zinc-950 border-red-600 text-red-600 scale-125 shadow-xl shadow-red-600/10'
                                                    : isLastNode
                                                        ? 'bg-zinc-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                                                        : 'bg-zinc-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                                            }`}
                                    >
                                        {isPast ? <Check className="w-3.5 h-3.5" /> : isLastNode ? <Gift className="w-3.5 h-3.5" /> : nodePosition}
                                    </div>
                                    <span className={`text-[9px] font-bold absolute -bottom-6 w-max uppercase tracking-widest ${isCurrent ? 'text-red-600' : 'text-gray-400 dark:text-zinc-600'}`}>
                                        D{startDay + i}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {isMilestone && (
                        <div className="mt-12 mb-6 p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-center animate-in slide-in-from-bottom-2 duration-700 border border-white/10 dark:border-black/5">
                            <h3 className="font-bold flex items-center justify-center gap-2 text-sm">
                                <Gift className="w-4 h-4" /> 7-Day Milestone Reached!
                            </h3>
                            <p className="opacity-70 text-[11px] mt-1">100 bonus points have been added to your account.</p>
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpen(false)}
                        className="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-gray-100 text-white font-bold text-sm rounded-[16px] transition-all active:scale-[0.98] shadow-lg shadow-black/5"
                    >
                        Awesome, let's go!
                    </button>
                </div>
            </div>
        </div>
    );
}
