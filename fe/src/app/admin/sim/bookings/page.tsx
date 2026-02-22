"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Loader2, RefreshCcw, CheckCircle, XCircle, Clock, ShoppingBag, ShieldCheck, Camera, X, PartyPopper, ChevronUp, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Html5Qrcode } from "html5-qrcode";
import { formatDateGMT8, formatTimeGMT8 } from "@/lib/dateUtils";

interface CompletedBooking {
    id: string;
    packageName: string;
    quantity: string;
    price: string;
    userEmail: string;
    verificationCode: string;
    createdAt: string;
    collectionDate?: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannerLoading, setScannerLoading] = useState(false);
    const [completedBooking, setCompletedBooking] = useState<CompletedBooking | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Pagination, Sorting, Filtering state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [metaData, setMetaData] = useState({ total: 0, totalPages: 1 });
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [statusFilter, setStatusFilter] = useState("booked");
    const [packageFilter, setPackageFilter] = useState("all");
    const [emailSearch, setEmailSearch] = useState("");
    const [availablePackages, setAvailablePackages] = useState<string[]>([]);

    const scannerRef = useRef<Html5Qrcode | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                status: statusFilter,
                packageName: packageFilter,
                email: emailSearch,
                sortBy,
                order
            });
            const res = await fetch(`${API_BASE_URL}/bookings/admin/all?${params}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setBookings(data.data);
                setAvailablePackages(data.packages);
                setMetaData(data.meta);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookings();
        }, emailSearch ? 500 : 0);
        return () => clearTimeout(timer);
    }, [page, limit, statusFilter, packageFilter, sortBy, order, emailSearch]);

    const toggleSort = (column: string) => {
        if (sortBy === column) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setOrder("desc");
        }
        setPage(1);
    };

    const renderSortIcon = (column: string) => {
        if (sortBy !== column) return <ChevronUp className="w-3 h-3 opacity-20" />;
        return order === "asc" ? <ChevronUp className="w-3 h-3 text-primary-600" /> : <ChevronDown className="w-3 h-3 text-primary-600" />;
    };

    // Cleanup scanner on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    const handleUpdateStatus = async (bookingId: string, status: string) => {
        setUpdatingId(bookingId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchBookings();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred");
        } finally {
            setUpdatingId(null);
        }
    };

    const completeByCode = async (code: string): Promise<boolean> => {
        setIsVerifying(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/complete-by-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            const data = await res.json();
            if (res.ok) {
                setVerificationCode("");
                setCompletedBooking(data.booking);
                setShowSuccessModal(true);
                fetchBookings();
                return true;
            } else {
                alert(data.message || "Failed to verify code");
                return false;
            }
        } catch (err) {
            console.error("Verification error:", err);
            alert("An error occurred");
            return false;
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verificationCode) return;
        await completeByCode(verificationCode);
    };

    const startScanner = async () => {
        setIsScannerOpen(true);
        setScannerLoading(true);

        // Wait for the DOM element to be available
        setTimeout(async () => {
            try {
                const html5QrCode = new Html5Qrcode("qr-reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        // QR code scanned successfully
                        console.log("Scanned code:", decodedText);

                        // Stop scanner
                        await html5QrCode.stop();
                        setIsScannerOpen(false);

                        // Auto-complete the booking
                        await completeByCode(decodedText);
                    },
                    (errorMessage) => {
                        // Ignore scanning errors (they happen continuously while scanning)
                    }
                );
                setScannerLoading(false);
            } catch (err) {
                console.error("Error starting scanner:", err);
                setScannerLoading(false);
                setIsScannerOpen(false);
                alert("Could not access camera. Please check permissions.");
            }
        }, 100);
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
        setIsScannerOpen(false);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setCompletedBooking(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "booked": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30";
            case "cancelled": return "bg-gray-100 text-gray-500 dark:bg-gray-800/30";
            case "completed": return "bg-green-100 text-green-600 dark:bg-green-900/30";
            case "expired": return "bg-orange-100 text-orange-600 dark:bg-orange-900/30";
            case "rejected": return "bg-red-100 text-red-600 dark:bg-red-900/30";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel SIM Bookings</h1>
                    <p className="text-sm text-gray-500">Manage and review all user Travel SIM bookings</p>
                </div>

                {/* Verification Form */}
                <form onSubmit={handleVerification} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={startScanner}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all"
                        title="Scan QR Code"
                    >
                        <Camera className="w-4 h-4" />
                        Scan
                    </button>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="ENTER CODE"
                        className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-mono uppercase tracking-widest focus:ring-2 focus:ring-primary-500 outline-none w-48"
                    />
                    <button
                        type="submit"
                        disabled={isVerifying || !verificationCode}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all uppercase tracking-widest"
                    >
                        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Verify
                    </button>
                    <button
                        type="button"
                        onClick={fetchBookings}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters:</span>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                    <option value="all">All Statuses</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    value={packageFilter}
                    onChange={(e) => { setPackageFilter(e.target.value); setPage(1); }}
                    className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                >
                    <option value="all">All Packages</option>
                    {availablePackages.map(pkg => (
                        <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                </select>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={emailSearch}
                        onChange={(e) => { setEmailSearch(e.target.value); setPage(1); }}
                        className="pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 outline-none transition-all w-64"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">Show:</span>
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* QR Scanner Modal */}
            {isScannerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan QR Code</h3>
                                <p className="text-xs text-gray-500">Point camera at user's verification QR</p>
                            </div>
                            <button
                                onClick={stopScanner}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Scanner Area */}
                        <div className="p-4">
                            <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                                {scannerLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                                <div id="qr-reader" className="w-full h-full"></div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                            <button
                                onClick={stopScanner}
                                className="w-full py-3 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all uppercase tracking-wider text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && completedBooking && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeSuccessModal();
                    }}
                >
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Success Header */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">Booking Completed!</h3>
                            <p className="text-green-100 text-sm">The eSIM booking has been successfully verified</p>
                        </div>

                        {/* Booking Details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Package</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{completedBooking.packageName}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-zinc-700"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{completedBooking.userEmail}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-zinc-700"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{completedBooking.quantity}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-zinc-700"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</span>
                                    <span className="text-sm font-bold text-green-600">{completedBooking.price}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-zinc-700"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</span>
                                    <span className="text-sm font-mono font-bold text-primary-600">{completedBooking.verificationCode}</span>
                                </div>
                                {completedBooking.collectionDate && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-zinc-700"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collection</span>
                                            <span className="text-sm font-bold text-red-600">{formatDateGMT8(completedBooking.collectionDate)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                            <button
                                onClick={closeSuccessModal}
                                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all uppercase tracking-wider text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("userEmail")}>
                                    <div className="flex items-center gap-1">User {renderSortIcon("userEmail")}</div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("packageName")}>
                                    <div className="flex items-center gap-1">Package {renderSortIcon("packageName")}</div>
                                </th>
                                <th className="px-6 py-4">Verification Code</th>
                                <th className="px-6 py-4 text-center cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("quantity")}>
                                    <div className="flex items-center justify-center gap-1">Qty {renderSortIcon("quantity")}</div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("createdAt")}>
                                    <div className="flex items-center gap-1">Booking Date {renderSortIcon("createdAt")}</div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("collectionDate")}>
                                    <div className="flex items-center gap-1">Collection Date{renderSortIcon("collectionDate")}</div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => toggleSort("status")}>
                                    <div className="flex items-center gap-1">Status {renderSortIcon("status")}</div>
                                </th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {booking.userEmail}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-zinc-400">
                                        {booking.packageName}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary-600">
                                        {booking.verificationCode || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">
                                        {booking.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-[10px] leading-relaxed">
                                        <div className="font-bold text-gray-700 dark:text-gray-300">
                                            {formatDateGMT8(booking.createdAt)}
                                        </div>
                                        <div>
                                            {formatTimeGMT8(booking.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.collectionDate ? (
                                            <div className="font-bold text-gray-700 dark:text-gray-300 text-[10px]">
                                                {formatDateGMT8(booking.collectionDate)}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-[10px] italic">Not set</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-transparent ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-nowrap text-right">
                                        {booking.status === "booked" ? (
                                            <div className="flex items-center justify-end gap-2 text-nowrap">
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                                                    disabled={updatingId === booking.id}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, "rejected")}
                                                    disabled={updatingId === booking.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, "expired")}
                                                    disabled={updatingId === booking.id}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Mark as Expired"
                                                >
                                                    <Clock className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {metaData.totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <div className="text-xs text-gray-500">
                        Showing page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of <span className="font-bold text-gray-900 dark:text-white">{metaData.totalPages}</span>
                        <span className="mx-2">•</span>
                        Total <span className="font-bold text-gray-900 dark:text-white">{metaData.total}</span> bookings
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(metaData.totalPages, p + 1))}
                            disabled={page === metaData.totalPages}
                            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
