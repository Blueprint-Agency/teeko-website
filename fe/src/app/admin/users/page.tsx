"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Chrome, ShieldCheck, ShieldAlert, Loader2, Search, Calendar, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { formatDateGMT8, formatTimeGMT8 } from "@/lib/dateUtils";

interface User {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    method: "Email/Password" | "Google" | "Both" | "Unknown";
}

export default function UserMonitoringPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const isSuperAdmin = currentUser?.role === 'SUPERADMIN';
    const canManageUsers = isSuperAdmin || currentUser?.permissions?.userManagement;

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerify = async (userId: string) => {
        if (!confirm("Are you sure you want to manually verify this user?")) return;

        setVerifyingId(userId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                await fetchUsers();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to verify user");
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("An error occurred while verifying the user");
        } finally {
            setVerifyingId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;

        setDeletingId(userId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: users.length,
        google: users.filter(u => u.method === "Google" || u.method === "Both").length,
        email: users.filter(u => u.method === "Email/Password" || u.method === "Both").length,
        both: users.filter(u => u.method === "Both").length,
    };

    const statCards = [
        { label: "Total Users", value: loading ? "..." : stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Google Login", value: loading ? "..." : stats.google, icon: Chrome, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
        { label: "Email Login", value: loading ? "..." : stats.email, icon: Mail, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Monitoring</h1>
                <p className="text-gray-500 dark:text-gray-400">Track and manage your platform users and their authentication methods.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.bg} ring-4 ring-transparent transition-all group-hover:ring-current/10`}>
                                    {loading ? (
                                        <Loader2 className={`h-7 w-7 animate-spin ${stat.color}`} />
                                    ) : (
                                        <Icon className={`h-7 w-7 ${stat.color}`} />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1 w-full bg-current opacity-10 ${stat.color}`} />
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl bg-white shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="border-b border-gray-100 dark:border-zinc-800 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Users</h2>
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-zinc-800/50">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Auth Method</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Signup Date</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                                    {user.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{user.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {(user.method === "Google" || user.method === "Both") && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 dark:bg-red-900/20 text-[10px] font-bold uppercase">
                                                        <Chrome className="h-3 w-3" /> Google
                                                    </div>
                                                )}
                                                {(user.method === "Email/Password" || user.method === "Both") && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 text-[10px] font-bold uppercase">
                                                        <Mail className="h-3 w-3" /> Email
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                    {formatDateGMT8(user.createdAt)}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {formatTimeGMT8(user.createdAt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                                                    <ShieldCheck className="h-4 w-4" /> Verified
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold">
                                                        <ShieldAlert className="h-4 w-4" /> Unverified
                                                    </span>
                                                    <button
                                                        onClick={() => handleVerify(user.id)}
                                                        disabled={verifyingId === user.id}
                                                        className="text-[10px] w-fit font-bold text-primary-600 hover:text-primary-700 disabled:opacity-50 underline underline-offset-2 decoration-primary-600/30"
                                                    >
                                                        {verifyingId === user.id ? "Verifying..." : "Verify Now"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                user.role === 'ADMIN' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canManageUsers && user.role === 'USER' && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                    title="Delete User"
                                                >
                                                    {deletingId === user.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your search.
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
