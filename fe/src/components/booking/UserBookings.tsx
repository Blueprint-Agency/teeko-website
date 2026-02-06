"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, XCircle, Clock, CheckCircle, RefreshCcw, Loader2, QrCode, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { CancelBookingModal } from "./CancelBookingModal";
import { QRCodeCanvas } from "qrcode.react";

export function UserBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrBooking, setQrBooking] = useState<any>(null);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setBookings(data);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsCancelModalOpen(true);
    };

    const handleViewCode = (booking: any) => {
        setQrBooking(booking);
        setIsQRModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!selectedBooking) return;

        setCancellingId(selectedBooking.id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/${selectedBooking.id}/cancel`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setIsCancelModalOpen(false);
                fetchBookings();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to cancel booking");
            }
        } catch (err) {
            console.error("Cancel error:", err);
            alert("An error occurred while cancelling");
        } finally {
            setCancellingId(null);
            if (!cancellingId) setSelectedBooking(null);
        }
    };

    // Color system: Blue=pending, Green=success, Gray=neutral, Red=destructive only
    const getStatusColor = (status: string) => {
        switch (status) {
            case "booked": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "cancelled": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
            case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "expired": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "booked": return <Clock className="w-3 h-3" />;
            case "cancelled": return <XCircle className="w-3 h-3" />;
            case "completed": return <CheckCircle className="w-3 h-3" />;
            case "expired": return <Clock className="w-3 h-3" />;
            case "rejected": return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-[var(--card-bg)] rounded-2xl border border-dashed border-[var(--border)]">
                <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-40" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">No active bookings</p>
                <p className="text-xs text-gray-500 mt-1">Book a Travel SIM to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                <div key={booking.id} className="bg-[var(--background-alt)] rounded-xl p-4 transition-all duration-300">
                    {/* Card Layout */}
                    <div className="flex items-start gap-4">
                        {/* Image - Match Account Info icon container */}
                        <div className="w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {booking.featureImage ? (
                                <img src={booking.featureImage} alt={booking.packageName} className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{booking.packageName}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">QTY: {booking.quantity}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">•</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{booking.price}</span>
                            </div>
                            {/* Status Badge - Semantic colors only */}
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                            </div>
                        </div>

                        {/* Cancel Button - Red only for destructive action */}
                        {booking.status === "booked" && (
                            <button
                                onClick={() => handleCancelClick(booking)}
                                disabled={cancellingId === booking.id}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
                                title="Cancel Booking"
                            >
                                {cancellingId === booking.id ? (
                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <XCircle className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Verify Button */}
                    {booking.status === "booked" && booking.verificationCode && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                            <button
                                onClick={() => handleViewCode(booking)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-[var(--card-bg)] text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all uppercase tracking-wider border border-[var(--border)]"
                            >
                                <QrCode className="w-4 h-4" />
                                Verify
                            </button>
                        </div>
                    )}
                </div>
            ))}

            <CancelBookingModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={confirmCancel}
                isLoading={cancellingId !== null}
                packageName={selectedBooking?.packageName || ""}
            />

            {/* QR Modal */}
            {isQRModalOpen && qrBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsQRModalOpen(false);
                    }}
                >
                    <div className="bg-[var(--background-alt)] rounded-3xl w-full max-w-xs sm:max-w-sm border border-[var(--border)] overflow-hidden shadow-2xl modal-content">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">Verification Code</h3>
                                <p className="text-xs text-gray-500">Show this to the administrator</p>
                            </div>
                            <button
                                onClick={() => setIsQRModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border border-gray-100 mb-5">
                                <QRCodeCanvas
                                    value={qrBooking.verificationCode}
                                    size={180}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            {/* Manual code - White text on dark background for readability */}
                            <div className="bg-[var(--card-bg)] rounded-xl p-4 transition-all duration-300">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Manual Code</span>
                                <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-[0.15em] font-mono">{qrBooking.verificationCode}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[var(--border)]">
                            <button
                                onClick={() => setIsQRModalOpen(false)}
                                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all uppercase tracking-wider text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
