"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface CancelBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    packageName: string;
}

export function CancelBookingModal({ isOpen, onClose, onConfirm, isLoading, packageName }: CancelBookingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20 p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cancel Booking?</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 px-4">
                    Are you sure you want to cancel your booking for <span className="text-gray-900 dark:text-white font-bold">{packageName}</span>? This action cannot be undone.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            "Yes, Cancel Booking"
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-4 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                    >
                        Keep Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
