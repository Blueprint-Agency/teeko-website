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
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) onClose();
            }}
        >
            <div className="w-full max-w-xs sm:max-w-sm bg-[var(--background-alt)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)] p-6 sm:p-8 text-center modal-content">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[var(--border)]">
                    <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Cancel Booking?</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-6 sm:mb-8">
                    Are you sure you want to cancel your booking for <span className="text-gray-900 dark:text-white font-bold">{packageName}</span>? This action cannot be undone.
                </p>

                <div className="space-y-2.5">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 sm:py-4 bg-red-600 text-white text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            "Yes, Cancel Booking"
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-3 sm:py-4 bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all border border-[var(--border)]"
                    >
                        Keep Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
