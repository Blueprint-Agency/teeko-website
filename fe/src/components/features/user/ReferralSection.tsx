"use client";

import { useState } from "react";
import { useReferral } from "@/lib/useReferral";
import { Copy, Check, Users, Gift, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export function ReferralSection() {
    const { referralData, isLoading, error, applyReferralCode } = useReferral();
    const [referralInput, setReferralInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);

    const handleCopy = () => {
        if (referralData?.referralCode) {
            navigator.clipboard.writeText(referralData.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleApplyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!referralInput || referralInput.length !== 4) {
            setLocalError("Referral code must be 4 characters");
            return;
        }

        setIsApplying(true);
        setLocalError(null);

        const result = await applyReferralCode(referralInput.toUpperCase());
        if (!result.success) {
            setLocalError(result.error || "Failed to apply code");
        } else {
            setReferralInput("");
        }
        setIsApplying(false);
    };

    if (isLoading && !referralData) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    Referral Program
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 text-sm">
                    Invite your friends to Teeko and earn exclusive rewards together.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Referral Code */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Your Referral Code</h3>
                    </div>

                    <div className="relative group mt-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl">
                            <span className="text-2xl font-black tracking-[0.2em] text-gray-900 dark:text-white uppercase font-mono">
                                {referralData?.referralCode || "----"}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-red-600 text-gray-500 hover:text-red-600 transition-all shadow-sm active:scale-95"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-xs font-medium text-gray-500 dark:text-zinc-500 flex items-center gap-1.5">
                        Share this code with your friends to get rewards.
                    </p>
                </div>

                {/* Apply Referral Code */}
                {!referralData?.referredById ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors duration-500" />

                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Been referred?</h3>
                        </div>

                        <form onSubmit={handleApplyCode} className="mt-4 space-y-3 relative z-10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={referralInput}
                                    onChange={(e) => setReferralInput(e.target.value.toUpperCase().slice(0, 4))}
                                    placeholder="Enter 4-character code"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:tracking-normal placeholder:font-normal"
                                />
                                {isApplying && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                    </div>
                                )}
                            </div>
                            {(localError || error) && (
                                <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 px-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{localError || error}</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isApplying || !referralInput || referralInput.length !== 4}
                                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/5"
                            >
                                Apply Code
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-50/50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                            <Check className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Successfully Referred!</h3>
                        <p className="text-gray-500 dark:text-zinc-500 text-xs mt-1">
                            You've already applied a referral code.
                        </p>
                    </div>
                )}
            </div>

            {/* Referrals List */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Users className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Your Referrals</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-red-600/10 text-red-600 rounded-full">
                        {referralData?.referees.length || 0} Total
                    </span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {referralData?.referees && referralData.referees.length > 0 ? (
                        referralData.referees.map((referee) => (
                            <div key={referee.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                        {referee?.email?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{referee.name}</p>
                                        <p className="text-[10px] font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-tighter">{referee.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest">Joined</p>
                                    <p className="text-[11px] font-bold text-gray-900 dark:text-white">
                                        {new Date(referee.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-950 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-gray-300 dark:text-zinc-700" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">No referrals yet</h4>
                            <p className="text-gray-500 dark:text-zinc-500 text-xs mt-1 max-w-[200px]">
                                Your friends will appear here once they use your code.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
