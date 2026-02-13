"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Save, Loader2, Globe, Image as ImageIcon, Type, Code, Plus, Trash2, Layout } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

interface Snippet {
    id: string;
    name: string;
    content: string;
    position: "HEAD" | "BODY";
    target: "EVERY_PAGE" | "SPECIFIC_PAGE";
    pagePath: string | null;
    isActive: boolean;
}

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [formData, setFormData] = useState({
        siteTitle: "",
        siteDescription: "",
        faviconUrl: "",
        maintenanceMode: false,
    });

    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
        name: "",
        content: "",
        position: "HEAD",
        target: "EVERY_PAGE",
        pagePath: "",
        isActive: true
    });
    const [addingSnippet, setAddingSnippet] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [settingsRes, snippetsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/settings`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/admin/snippets`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const settingsData = await settingsRes.json();
                if (settingsRes.ok) {
                    setFormData({
                        siteTitle: settingsData.siteTitle || "",
                        siteDescription: settingsData.siteDescription || "",
                        faviconUrl: settingsData.faviconUrl || "",
                        maintenanceMode: settingsData.maintenanceMode || false,
                    });
                }

                const snippetsData = await snippetsRes.json();
                if (snippetsRes.ok) {
                    setSnippets(snippetsData);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setToast({ message: "Settings updated successfully!", type: "success" });
            } else {
                setToast({ message: "Failed to update settings", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred while saving", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleAddSnippet = async () => {
        if (!newSnippet.name || !newSnippet.content) return;
        setAddingSnippet(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/snippets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newSnippet),
            });

            if (res.ok) {
                const data = await res.json();
                setSnippets([...snippets, data]);
                setNewSnippet({
                    name: "",
                    content: "",
                    position: "HEAD",
                    target: "EVERY_PAGE",
                    pagePath: "",
                    isActive: true
                });
                setToast({ message: "Snippet added!", type: "success" });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAddingSnippet(false);
        }
    };

    const handleDeleteSnippet = async (id: string) => {
        if (!confirm("Are you sure you want to delete this snippet?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/snippets/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setSnippets(snippets.filter(s => s.id !== id));
                setToast({ message: "Snippet deleted", type: "success" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleSnippet = async (snippet: Snippet) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/snippets/${snippet.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...snippet, isActive: !snippet.isActive }),
            });

            if (res.ok) {
                setSnippets(snippets.map(s => s.id === snippet.id ? { ...s, isActive: !s.isActive } : s));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* General Settings */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5" /> General Configuration
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Type className="h-4 w-4" /> Site Title
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.siteTitle}
                                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                                placeholder="Teeko Advisor"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <Globe className="h-4 w-4" /> Meta Description
                            </label>
                            <textarea
                                className="w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                rows={3}
                                value={formData.siteDescription}
                                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                                placeholder="Site-wide SEO description..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <ImageIcon className="h-4 w-4" /> Favicon URL
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.faviconUrl}
                                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                                    placeholder="https://example.com/favicon.ico"
                                />
                                {formData.faviconUrl && (
                                    <div className="h-10 w-10 border rounded bg-gray-50 dark:bg-zinc-800 p-1">
                                        <img src={formData.faviconUrl} alt="Favicon preview" className="h-full w-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-orange-900 dark:text-orange-400">Maintenance Mode</h3>
                                    <p className="text-xs text-orange-700 dark:text-orange-500 mt-1">When enabled, the public website will show a maintenance message.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.maintenanceMode ? 'bg-orange-600' : 'bg-gray-200 dark:bg-zinc-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Settings</>
                            )}
                        </Button>
                    </div>
                </form>
            </section>

            {/* App Snippets section */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Code className="h-5 w-5" /> Analytics & Custom Snippets
                </h2>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    {/* Add New Snippet Form */}
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-white/5">
                        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white">Add New Snippet</h3>
                        <div className="grid gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Snippet Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        placeholder="e.g. Google Analytics"
                                        value={newSnippet.name}
                                        onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
                                        <select
                                            className="w-full rounded-md border border-gray-200 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            value={newSnippet.position}
                                            onChange={(e) => setNewSnippet({ ...newSnippet, position: e.target.value as any })}
                                        >
                                            <option value="HEAD">Head tag</option>
                                            <option value="BODY">Body tag</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Target</label>
                                        <select
                                            className="w-full rounded-md border border-gray-200 p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            value={newSnippet.target}
                                            onChange={(e) => setNewSnippet({ ...newSnippet, target: e.target.value as any })}
                                        >
                                            <option value="EVERY_PAGE">Every page</option>
                                            <option value="SPECIFIC_PAGE">Specific page</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {newSnippet.target === "SPECIFIC_PAGE" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Page Path (e.g. /sim)</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        placeholder="/restaurants"
                                        value={newSnippet.pagePath || ""}
                                        onChange={(e) => setNewSnippet({ ...newSnippet, pagePath: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Code Snippet</label>
                                <textarea
                                    className="w-full rounded-md border border-gray-200 p-2 text-sm font-mono dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    rows={4}
                                    placeholder="<script>...</script>"
                                    value={newSnippet.content}
                                    onChange={(e) => setNewSnippet({ ...newSnippet, content: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleAddSnippet} disabled={addingSnippet || !newSnippet.name || !newSnippet.content} size="sm">
                                    {addingSnippet ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Add Snippet</>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Snippet List */}
                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {snippets.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm italic">
                                No snippets configured yet.
                            </div>
                        ) : (
                            snippets.map((snippet) => (
                                <div key={snippet.id} className="p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{snippet.name}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${snippet.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800'
                                                }`}>
                                                {snippet.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                                            <span className="flex items-center gap-1"><Layout className="h-3 w-3" /> {snippet.position === "HEAD" ? "HEAD" : "BODY"}</span>
                                            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {snippet.target === "EVERY_PAGE" ? "Across Entire Site" : `Only on: ${snippet.pagePath}`}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleSnippet(snippet)}
                                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 transition-colors"
                                            title={snippet.isActive ? "Disable" : "Enable"}
                                        >
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${snippet.isActive ? 'bg-primary-500' : 'bg-gray-300 dark:bg-zinc-600'}`}>
                                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${snippet.isActive ? 'left-4.5' : 'left-0.5'}`} />
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSnippet(snippet.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}


