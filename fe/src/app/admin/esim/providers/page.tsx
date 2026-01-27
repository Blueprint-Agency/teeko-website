"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Loader2, X, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import Link from "next/link";

interface Provider {
    id: string;
    name: string;
    slug: string;
}

export default function AdminEsimProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "" });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchProviders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/esim/providers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setProviders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch providers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleOpenCreate = () => {
        setEditingProvider(null);
        setFormData({ name: "", slug: "" });
        setShowModal(true);
    };

    const handleOpenEdit = (provider: Provider) => {
        setEditingProvider(provider);
        setFormData({ name: provider.name, slug: provider.slug });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const url = editingProvider
                ? `${API_BASE_URL}/esim/providers/${editingProvider.id}`
                : `${API_BASE_URL}/esim/providers`;

            const method = editingProvider ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                fetchProviders();
                setToast({ message: `Provider ${editingProvider ? "updated" : "created"} successfully!`, type: "success" });
            } else {
                setToast({ message: `Failed to ${editingProvider ? "update" : "create"} provider`, type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this provider?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/esim/providers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchProviders();
                setToast({ message: "Provider deleted successfully!", type: "success" });
            } else {
                setToast({ message: "Failed to delete provider", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        }
    };

    return (
        <div className="space-y-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eSIM Providers</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage eSIM providers for packages</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/esim">
                        <Button variant="ghost">View Packages</Button>
                    </Link>
                    <Button onClick={handleOpenCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add Provider
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                            {providers.map((provider) => (
                                <tr key={provider.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{provider.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{provider.slug}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                                        <button
                                            onClick={() => handleOpenEdit(provider)}
                                            className="text-primary hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(provider.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {providers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No providers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold dark:text-white">
                                {editingProvider ? "Edit Provider" : "Add New Provider"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Provider Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    placeholder="e.g., Airalo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Slug</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., airalo"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingProvider ? "Update" : "Create")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

