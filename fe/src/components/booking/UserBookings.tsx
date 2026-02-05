"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ChevronRight, XCircle, Clock, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { CancelBookingModal } from "./CancelBookingModal";

export function UserBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "booked": return "bg-blue-500/10 text-blue-600 border-blue-500/10";
            case "cancelled": return "bg-gray-500/10 text-gray-500 border-gray-500/10";
            case "completed": return "bg-green-500/10 text-green-600 border-green-500/10";
            case "expired": return "bg-orange-500/10 text-orange-600 border-orange-500/10";
            case "rejected": return "bg-red-500/10 text-red-600 border-red-500/10";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "booked": return <Clock className="w-3.5 h-3.5" />;
            case "cancelled": return <XCircle className="w-3.5 h-3.5" />;
            case "completed": return <CheckCircle className="w-3.5 h-3.5" />;
            case "expired": return <Clock className="w-3.5 h-3.5" />;
            case "rejected": return <XCircle className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50/50 dark:bg-zinc-950/50 rounded-3xl border border-dashed border-[var(--border)]">
                <ShoppingBag className="w-12 h-12 text-[var(--muted)] mx-auto mb-4 opacity-50" />
                <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">No active bookings</p>
                <p className="text-xs text-[var(--muted)] mt-1">Book an eSIM to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                <div key={booking.id} className="bg-[var(--card-bg)] rounded-3xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 flex-shrink-0 overflow-hidden border border-white/10">
                                {booking.featureImage ? (
                                    <img src={booking.featureImage} alt={booking.packageName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-primary-600" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{booking.packageName}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest leading-none">QTY: {booking.quantity}</span>
                                    <span className="text-[10px] text-[var(--muted)]">•</span>
                                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest outline-none leading-none">{booking.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                            </div>

                            {booking.status === "booked" && (
                                <button
                                    onClick={() => handleCancelClick(booking)}
                                    disabled={cancellingId === booking.id}
                                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold bg-white dark:bg-zinc-800 text-red-600 border border-red-500/20 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    {cancellingId === booking.id ? <RefreshCcw className="w-3 h-3 animate-spin" /> : "Cancel"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <CancelBookingModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={confirmCancel}
                isLoading={cancellingId !== null}
                packageName={selectedBooking?.packageName || ""}
            />
        </div>
    );
}
