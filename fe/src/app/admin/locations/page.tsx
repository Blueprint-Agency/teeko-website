"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Loader2, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { TranslationsEditor, emptyTranslations, isFieldTranslated, translationsFromApi, type TranslationField } from "@/components/admin/TranslationsEditor";
import { LOCALE_LABEL, TRANSLATED_LOCALES } from "@/lib/i18n";

const TRANSLATED_FIELDS: TranslationField[] = [
    { key: "seoTitle", label: "SEO Title", kind: "text" },
    { key: "seoDescription", label: "SEO Description", kind: "textarea", rows: 2 },
];

interface Location {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
    translations?: unknown;
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", seoTitle: "", seoDescription: "" });
    const [translations, setTranslations] = useState(emptyTranslations());
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchLocations = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/locations`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
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
        setTranslations(emptyTranslations());
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
        setTranslations(translationsFromApi(loc.translations, TRANSLATED_FIELDS));
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const url = editingLocation
                ? `${API_BASE_URL}/admin/locations/${editingLocation.id}`
                : `${API_BASE_URL}/admin/locations`;

            const method = editingLocation ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, translations }),
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
                    <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">SEO Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Translations</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {locations.map((loc) => (
                                    <tr key={loc.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{loc.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{loc.slug}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{loc.seoTitle || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs space-x-1">
                                            {TRANSLATED_LOCALES.map((locale) => {
                                                const done = isFieldTranslated(translationsFromApi(loc.translations, TRANSLATED_FIELDS), locale, "seoDescription");
                                                return (
                                                    <span
                                                        key={locale}
                                                        className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${done
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                                                            }`}
                                                    >
                                                        {LOCALE_LABEL[locale]}: {done ? "translated" : "not translated"}
                                                    </span>
                                                );
                                            })}
                                        </td>
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
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No locations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
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
                            <TranslationsEditor
                                fields={TRANSLATED_FIELDS}
                                mainField="seoDescription"
                                value={translations}
                                onChange={setTranslations}
                                english={formData}
                                pageNoun="location page"
                            />
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

