"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, XCircle, Clock, CheckCircle, RefreshCcw, Loader2, QrCode, X, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { CancelBookingModal } from "./CancelBookingModal";
import { QRCodeCanvas } from "qrcode.react";
import { useAuthFetch } from "@/lib/authFetch";

export function UserBookings() {
    const { fetchWithAuth } = useAuthFetch();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrBooking, setQrBooking] = useState<any>(null);

    // Pagination and Tabs
    const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchBookings = async (targetPage = page, targetTab = activeTab) => {
        setLoading(true);
        try {
            const result = await fetchWithAuth(`${API_BASE_URL}/bookings/my-bookings?status=${targetTab}&page=${targetPage}&limit=5`);
            if (result.isSessionExpired) return;
            if (!result.error && result.data) {
                setBookings(result.data.data);
                setTotalPages(result.data.meta.totalPages);
                setTotal(result.data.meta.total);
            } else {
                setError(result.error || "Failed to load bookings");
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1, activeTab);
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (page !== 1) {
            fetchBookings(page, activeTab);
        }
    }, [page]);

    const handleTabChange = (tab: 'current' | 'past') => {
        setActiveTab(tab);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

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
            const result = await fetchWithAuth(`${API_BASE_URL}/bookings/${selectedBooking.id}/cancel`, {
                method: "POST"
            });

            if (result.isSessionExpired) return;

            if (!result.error) {
                setIsCancelModalOpen(false);
                fetchBookings(page, activeTab);
            } else {
                alert(result.error || "Failed to cancel booking");
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

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-[var(--background-alt)] rounded-2xl w-full sm:w-fit">
                <button
                    onClick={() => handleTabChange('current')}
                    className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${activeTab === 'current'
                        ? 'bg-[var(--card-bg)] text-gray-900 dark:text-white shadow-sm border border-[var(--border)]'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Current
                </button>
                <button
                    onClick={() => handleTabChange('past')}
                    className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${activeTab === 'past'
                        ? 'bg-[var(--card-bg)] text-gray-900 dark:text-white shadow-sm border border-[var(--border)]'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Past
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/20">
                    {error}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-[var(--background-alt)] rounded-3xl border border-dashed border-[var(--border)]">
                    <div className="w-16 h-16 bg-[var(--card-bg)] rounded-3xl flex items-center justify-center mx-auto mb-5 border border-[var(--border)] shadow-sm">
                        <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No {activeTab} bookings</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {activeTab === 'current' ? "You don't have any active SIM bookings." : "Your booking history will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-[var(--background-alt)] rounded-2xl p-5 transition-all duration-300 border border-[var(--border)] hover:border-red-600/30 group shadow-sm hover:shadow-md">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                        {booking.featureImage ? (
                                            <img src={booking.featureImage} alt={booking.packageName} className="w-full h-full object-cover" />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate mb-1">{booking.packageName}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-[var(--card-bg)] px-2 py-0.5 rounded-md border border-[var(--border)]">QTY: {booking.quantity}</span>
                                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{booking.price}</span>
                                                </div>
                                            </div>

                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </div>
                                        </div>
                                    </div>

                                    {booking.status === "booked" && (
                                        <button
                                            onClick={() => handleCancelClick(booking)}
                                            disabled={cancellingId === booking.id}
                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50 flex-shrink-0"
                                            title="Cancel Booking"
                                        >
                                            {cancellingId === booking.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <XCircle className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {booking.status === "booked" && booking.verificationCode && (
                                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                                        <button
                                            onClick={() => handleViewCode(booking)}
                                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-xs font-bold bg-[var(--card-bg)] text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest border border-[var(--border)] shadow-sm active:scale-[0.98]"
                                        >
                                            <QrCode className="w-4 h-4" />
                                            Show Verification Code
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Page <span className="text-gray-900 dark:text-white">{page}</span> of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl bg-[var(--background-alt)] border border-[var(--border)] text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl bg-[var(--background-alt)] border border-[var(--border)] text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                    className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsQRModalOpen(false);
                    }}
                >
                    <div className="bg-[var(--background-alt)] rounded-[2.5rem] w-full max-w-sm border border-[var(--border)] overflow-hidden shadow-2xl p-8 sm:p-10 text-center relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setIsQRModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-[var(--card-bg)] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors border border-[var(--border)]"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="mb-8">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
                                <QrCode className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Booking</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Present this to staff</p>
                        </div>

                        <div className="bg-white p-5 rounded-[2rem] inline-block shadow-xl border border-gray-100 mb-8 transform transition-transform hover:scale-105">
                            <QRCodeCanvas
                                value={qrBooking.verificationCode}
                                size={200}
                                level="H"
                                includeMargin={false}
                            />
                        </div>

                        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">Manual Verification Code</span>
                            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-[0.2em] font-mono">{qrBooking.verificationCode}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
