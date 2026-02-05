"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw, CheckCircle, XCircle, Clock, ShoppingBag } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/admin/all`, {
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUpdateStatus = async (bookingId: string, status: string) => {
        setUpdatingId(bookingId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/bookings/admin/${bookingId}/status`, {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eSIM Bookings</h1>
                    <p className="text-sm text-gray-500">Manage and review all user eSIM bookings</p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4 text-center">Qty</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {booking.userEmail}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-zinc-400">
                                        {booking.packageName}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">
                                        {booking.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-transparent ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {booking.status === "booked" ? (
                                            <div className="flex items-center justify-end gap-2">
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
