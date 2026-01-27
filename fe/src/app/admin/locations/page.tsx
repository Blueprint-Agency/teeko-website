"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Loader2, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

interface Location {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", seoTitle: "", seoDescription: "" });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchLocations = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/locations`);
            const data = await res.json();
            setLocations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleOpenCreate = () => {
        setEditingLocation(null);
        setFormData({ name: "", slug: "", seoTitle: "", seoDescription: "" });
        setShowModal(true);
    };

    const handleOpenEdit = (loc: Location) => {
        setEditingLocation(loc);
        setFormData({
            name: loc.name,
            slug: loc.slug,
            seoTitle: loc.seoTitle || "",
            seoDescription: loc.seoDescription || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const url = editingLocation
                ? `${API_BASE_URL}/locations/${editingLocation.id}`
                : `${API_BASE_URL}/locations`;

            const method = editingLocation ? "PATCH" : "POST";

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
                fetchLocations();
                setToast({ message: `Location ${editingLocation ? "updated" : "created"} successfully!`, type: "success" });
            } else {
                setToast({ message: `Failed to ${editingLocation ? "update" : "create"} location`, type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Locations</h1>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SEO Title</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {locations.map((loc) => (
                                    <tr key={loc.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{loc.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{loc.slug}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{loc.seoTitle || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenEdit(loc)}
                                                className="text-primary hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                            >
                                                <Edit2 className="h-4 w-4 mr-1" /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {locations.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No locations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {locations.map((loc) => (
                            <div key={loc.id} className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{loc.name}</h3>
                                    <button
                                        onClick={() => handleOpenEdit(loc)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Slug:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{loc.slug}</span>
                                    </div>
                                    {loc.seoTitle && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400 block mb-1">SEO Title:</span>
                                            <span className="text-gray-900 dark:text-white text-xs">{loc.seoTitle}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {locations.length === 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-8 text-center">
                                <p className="text-sm text-gray-500">No locations found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold dark:text-white">
                                {editingLocation ? "Edit Location" : "Add New Location"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
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
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">SEO Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.seoTitle}
                                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">SEO Description</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    rows={2}
                                    value={formData.seoDescription}
                                    onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingLocation ? "Update" : "Create")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

