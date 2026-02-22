"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, Trash2, Key, Shield, Search, Loader2, X, Check, Copy, Edit3 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { formatDateGMT8 } from "@/lib/dateUtils";

interface Permissions {
    userManagement: boolean;
    blogManagement: boolean;
    simManagement: boolean;
    restaurantManagement: boolean;
    generalSettings: boolean;
}

interface AdminUser {
    id: string;
    email: string;
    role: "ADMIN" | "SUPERADMIN" | "USER";
    permissions: Permissions;
    createdAt: string;
}

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form state
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [newAdminPermissions, setNewAdminPermissions] = useState<Permissions>({
        userManagement: false,
        blogManagement: false,
        simManagement: false,
        restaurantManagement: false,
        generalSettings: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [editPermissions, setEditPermissions] = useState<Permissions | null>(null);
    const [editRole, setEditRole] = useState<"ADMIN" | "SUPERADMIN" | "USER">("ADMIN");

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/admins`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAdmins(data);
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewAdminPassword(password);
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/admins`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: newAdminEmail,
                    password: newAdminPassword,
                    permissions: newAdminPermissions
                })
            });

            if (res.ok) {
                await fetchAdmins();
                setIsModalOpen(false);
                setNewAdminEmail("");
                setNewAdminPassword("");
                setNewAdminPermissions({
                    userManagement: false,
                    blogManagement: false,
                    simManagement: false,
                    restaurantManagement: false,
                    generalSettings: false
                });
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create admin");
            }
        } catch (error) {
            console.error("Error creating admin:", error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditAdmin = (admin: AdminUser) => {
        setEditingAdmin(admin);
        setEditPermissions({ ...admin.permissions });
        setEditRole(admin.role);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAdmin || !editPermissions) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/admins/${editingAdmin.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    permissions: editPermissions,
                    role: editRole
                })
            });

            if (res.ok) {
                setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? { ...a, permissions: editPermissions, role: editRole } : a));
                setEditingAdmin(null);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update admin");
            }
        } catch (error) {
            console.error("Error updating admin:", error);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAdmin = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/admins/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setAdmins(prev => prev.filter(a => a.id !== userId));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete admin");
            }
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    const togglePermission = (userId: string, permission: keyof Permissions) => {
        const admin = admins.find(a => a.id === userId);
        if (!admin) return;

        const updatedPermissions = {
            ...admin.permissions,
            [permission]: !admin.permissions[permission]
        };

        handleUpdateAdmin(userId, updatedPermissions);
    };

    const handleUpdateAdmin = async (userId: string, permissions: Permissions, role?: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/admins/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ permissions, role })
            });

            if (res.ok) {
                setAdmins(prev => prev.map(a => a.id === userId ? { ...a, permissions, ...(role && { role: role as "ADMIN" | "SUPERADMIN" | "USER" }) } : a));
            }
        } catch (error) {
            console.error("Error updating admin:", error);
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage platform administrators and their access levels.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Create New Admin
                </button>
            </div>

            <div className="grid gap-6">
                <div className="rounded-2xl bg-white shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-zinc-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Shield className="h-4 w-4" />
                            <span>Only Superadmins can manage these settings</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Administrator</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Permissions</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={4} className="px-6 py-4"><div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded"></div></td>
                                        </tr>
                                    ))
                                ) : filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                                    {admin.email[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{admin.email}</span>
                                                    <span className="text-[10px] text-gray-400">Added on {formatDateGMT8(admin.createdAt)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {admin.role === 'SUPERADMIN' ? (
                                                <span className="text-xs text-primary-600 font-semibold italic">Full System Access</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(admin.permissions || {}).map(([key, value]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => togglePermission(admin.id, key as keyof Permissions)}
                                                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${value
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600'
                                                                }`}
                                                        >
                                                            {key.replace(/Management|Settings/g, '')}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${admin.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditAdmin(admin)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                    title="Edit Admin"
                                                >
                                                    <Edit3 className="h-5 w-5" />
                                                </button>
                                                {admin.role !== 'SUPERADMIN' && (
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Remove Admin"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Admin Account</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        placeholder="admin@teeko.ai"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Password</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            value={newAdminPassword}
                                            onChange={(e) => setNewAdminPassword(e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="Enter or generate password"
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="p-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-all"
                                            title="Generate Random Password"
                                        >
                                            <Key className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {newAdminPassword && (
                                        <button
                                            type="button"
                                            onClick={() => { navigator.clipboard.writeText(newAdminPassword); alert("Copied to clipboard!"); }}
                                            className="mt-2 text-[10px] text-primary-600 flex items-center gap-1 hover:underline"
                                        >
                                            <Copy className="h-3 w-3" /> Copy password to clipboard
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.keys(newAdminPermissions).map((perm) => (
                                        <label key={perm} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-primary-500/30">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {perm.replace(/Management|Settings/g, ' Management').replace('general', 'General')}
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={newAdminPermissions[perm as keyof Permissions]}
                                                onChange={() => setNewAdminPermissions(prev => ({ ...prev, [perm as keyof Permissions]: !prev[perm as keyof Permissions] }))}
                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-2.5 font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Admin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {editingAdmin && editPermissions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Admin Access</h2>
                            <button onClick={() => setEditingAdmin(null)} className="p-2 text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={editingAdmin.email}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setEditRole("ADMIN")}
                                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${editRole === "ADMIN"
                                                ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 shadow-sm"
                                                : "bg-gray-50 border-gray-100 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500"
                                                }`}
                                        >
                                            Admin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditRole("SUPERADMIN")}
                                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${editRole === "SUPERADMIN"
                                                ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400 shadow-sm"
                                                : "bg-gray-50 border-gray-100 text-gray-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500"
                                                }`}
                                        >
                                            Superadmin
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.keys(editPermissions).map((perm) => (
                                        <label key={perm} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-primary-500/30">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {perm.replace(/Management|Settings/g, ' Management').replace('general', 'General')}
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={editPermissions[perm as keyof Permissions]}
                                                onChange={() => setEditPermissions(prev => prev ? ({ ...prev, [perm as keyof Permissions]: !prev[perm as keyof Permissions] }) : null)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingAdmin(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-2.5 font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
