"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Mail, CheckCircle, Smartphone, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthFetch } from "@/lib/authFetch";

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

import { sendGTMEvent } from "@next/third-parties/google";

export function BookingModal({ isOpen, onClose, pkg, user, onBookingSuccess }: BookingModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [collectionDate, setCollectionDate] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(getGMT8Now());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const { fetchWithAuth } = useAuthFetch();

    // Date Logic in GMT+8
    function getGMT8Now() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 8));
    }

    const gmt8Now = getGMT8Now();
    const minDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }).format(gmt8Now);

    const threeMonthsLater = new Date(gmt8Now);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    const maxDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }).format(threeMonthsLater);

    const minDate = new Date(minDateStr);
    const maxDate = new Date(maxDateStr);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const handleDateSelect = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateStr = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(selected);
        setCollectionDate(dateStr);
        setIsCalendarOpen(false);
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Compare dates at midnight to ignore time
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const compareMin = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const compareMax = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        return checkDate < compareMin || checkDate > compareMax;
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "Select Date";
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    if (!isOpen) return null;

    const priceValue = parseFloat(pkg.price?.replace(/[^0-9.]/g, '') || "0") || 0;
    const currency = pkg.price?.replace(/[0-9.]/g, '').trim() || "RM";
    const totalPrice = priceValue * quantity;

    const handleConfirm = async () => {
        if (!collectionDate) {
            setError("Please select a collection date");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const result = await fetchWithAuth(`${API_BASE_URL}/bookings`, {
                method: "POST",
                body: JSON.stringify({
                    simId: pkg.id,
                    quantity,
                    collectionDate
                })
            });

            if (result.isSessionExpired) return;

            if (result.error) throw new Error(result.error);

            // Send GTM Purchase Event (Official GA4 / GTM Standard)
            sendGTMEvent({
                event: 'purchase',
                ecommerce: {
                    transaction_id: result.data?.id || `booking_${Date.now()}`,
                    value: totalPrice,
                    currency: currency === 'RM' ? 'MYR' : currency,
                    items: [{
                        item_id: pkg.id,
                        item_name: pkg.packageName,
                        price: priceValue,
                        quantity: quantity
                    }]
                }
            });

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




    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-[var(--background-alt)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)]">
                {!isSuccess ? (
                    <>
                        <div className="relative p-6 border-b border-[var(--border)]">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-red-600" />
                                Review Booking
                            </h2>
                            <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-[var(--card-bg)] rounded-2xl p-4 border border-[var(--border)]">
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
                                    <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                                        <span className="text-sm text-gray-500 dark:text-zinc-400 font-bold uppercase">Total Price</span>
                                        <span className="text-lg text-red-600 dark:text-red-400 font-black">{currency} {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--card-bg)] px-2 py-1">
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

                            <div className="space-y-4 pt-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                    Collection Date
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsCalendarOpen(true)}
                                        className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl text-left flex items-center justify-between hover:border-red-600/50 transition-all outline-none"
                                    >
                                        <span className={`font-medium ${collectionDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                            {formatDisplayDate(collectionDate)}
                                        </span>
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    </button>

                                    <p className="mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Must be between {formatDisplayDate(minDateStr)} and {formatDisplayDate(maxDateStr)} (GMT+8)
                                    </p>
                                </div>
                            </div>

                            {/* Calendar Overlay */}
                            {isCalendarOpen && (
                                <div className="absolute inset-0 z-[110] bg-[var(--background-alt)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Collection Date</h2>
                                        <button onClick={() => setIsCalendarOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 p-8 overflow-y-auto">
                                        <div className="max-w-xs mx-auto space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                </h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                                        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors border border-[var(--border)]"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                                        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors border border-[var(--border)]"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 gap-1">
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                                    <div key={`${day}-${index}`} className="text-center text-xs font-bold text-gray-400 uppercase py-2">
                                                        {day}
                                                    </div>
                                                ))}
                                                {Array.from({ length: firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: daysInMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const disabled = isDateDisabled(day);
                                                    const currentCheckDate = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                                                    const isSelected = collectionDate === currentCheckDate;

                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => handleDateSelect(day)}
                                                            className={`
                                                                aspect-square flex items-center justify-center text-sm font-bold rounded-xl transition-all
                                                                ${disabled ? 'text-gray-300 dark:text-zinc-800 cursor-not-allowed' :
                                                                    isSelected ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 ring-2 ring-red-600 ring-offset-2 dark:ring-offset-zinc-900' :
                                                                        'text-gray-700 dark:text-zinc-300 hover:bg-red-600 hover:text-white'}
                                                            `}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-4 border-t border-[var(--border)]">
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                                    Pick a date between {formatDisplayDate(minDateStr)} - {formatDisplayDate(maxDateStr)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
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
                    <div className="p-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Complete!</h2>
                        <p className="text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">
                            We've sent booking confirmation to <span className="text-gray-900 dark:text-white font-bold">{user?.email}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
