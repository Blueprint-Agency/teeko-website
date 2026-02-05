"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Mail, CheckCircle, Smartphone } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    pkg: {
        id: string;
        packageName: string;
        price: string | null;
    };
    user: any;
    onBookingSuccess?: () => void;
}

export function BookingModal({ isOpen, onClose, pkg, user, onBookingSuccess }: BookingModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    esimId: pkg.id,
                    quantity
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to book eSIM");

            setIsSuccess(true);
            if (onBookingSuccess) onBookingSuccess();
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const priceValue = parseFloat(pkg.price?.replace(/[^0-9.]/g, '') || "0") || 0;
    const currency = pkg.price?.replace(/[0-9.]/g, '').trim() || "RM";
    const totalPrice = (priceValue * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                {!isSuccess ? (
                    <>
                        <div className="relative p-6 border-b border-gray-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-red-600" />
                                Review Booking
                            </h2>
                            <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-gray-50/50 dark:bg-zinc-950/50 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Email Address</span>
                                        <span className="text-sm text-gray-900 dark:text-white font-bold">{user?.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Package</span>
                                        <span className="text-sm text-gray-900 dark:text-white font-bold">{pkg.packageName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Unit Price</span>
                                        <span className="text-sm text-gray-900 dark:text-white font-bold">{pkg.price || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-zinc-800">
                                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-bold uppercase">Total Price</span>
                                        <span className="text-lg text-red-600 dark:text-red-400 font-black">{currency} {totalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-950 px-2 py-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-500 hover:text-red-600"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-lg font-bold text-gray-900 dark:text-white">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-500 hover:text-red-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Max 10 per booking</p>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Confirm Booking</span>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center space-y-4 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Complete!</h2>
                        <p className="text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">
                            We've sent a confirmation email to <span className="text-gray-900 dark:text-white font-bold">{user?.email}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
