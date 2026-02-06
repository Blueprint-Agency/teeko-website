"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Loader2, Trash2, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

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
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/providers`, {
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
                ? `${API_BASE_URL}/sim/providers/${editingProvider.id}`
                : `${API_BASE_URL}/sim/providers`;

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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect packages using this provider.")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/providers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchProviders();
                setToast({ message: "Provider deleted successfully!", type: "success" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel SIM Providers</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage connectivity providers for Travel SIM packages</p>
                </div>
                <Button onClick={handleOpenCreate}><Plus className="mr-2 h-4 w-4" /> Add Provider</Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Provider Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                            {providers.map((provider) => (
                                <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{provider.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{provider.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button onClick={() => handleOpenEdit(provider)} className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 inline-flex items-center gap-1">
                                            <Edit2 className="h-4 w-4" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(provider.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 inline-flex items-center gap-1">
                                            <Trash2 className="h-4 w-4" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {providers.length === 0 && (
                                <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500 italic">No providers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold dark:text-white">{editingProvider ? "Edit Provider" : "Add New Provider"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Provider Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all focus:ring-2 focus:ring-red-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Slug</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all focus:ring-2 focus:ring-red-500 outline-none"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingProvider ? "Update Provider" : "Create Provider")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
