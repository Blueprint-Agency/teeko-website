"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Save, Loader2, Globe, Image as ImageIcon, Type } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [formData, setFormData] = useState({
        siteTitle: "",
        siteDescription: "",
        faviconUrl: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        siteTitle: data.siteTitle || "",
                        siteDescription: data.siteDescription || "",
                        faviconUrl: data.faviconUrl || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

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
        </div>
    );
}

