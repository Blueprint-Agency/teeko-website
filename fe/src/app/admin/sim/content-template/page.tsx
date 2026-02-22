"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Loader2, Trash2, Layout } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import Link from "next/link";
import { formatDateGMT8 } from "@/lib/dateUtils";

interface Provider {
    id: string;
    name: string;
    slug: string;
}

interface ContentTemplate {
    id: string;
    providerId: string;
    features: any;
    paymentMethods: any;
    createdAt: string;
    updatedAt: string;
    provider: Provider | null;
}

export default function ContentTemplatesPage() {
    const [templates, setTemplates] = useState<ContentTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/content-templates`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch templates");
            }

            const data = await res.json();
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch templates", error);
            setToast({ message: "Error loading templates.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/content-templates/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
                setToast({ message: "Template deleted successfully!", type: "success" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "Failed to delete template.", type: "error" });
        }
    };

    const formatDate = (dateString: string) => {
        return formatDateGMT8(dateString);
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Templates</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Global content templates for SIM providers</p>
                </div>
                <Link href="/admin/sim/content-template/create">
                    <Button><Plus className="mr-2 h-4 w-4" /> New Template</Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Features</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment Methods</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Updated At</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                            {templates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {template.provider?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {Array.isArray(template.features) ? template.features.length : 0} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {Array.isArray(template.paymentMethods) ? template.paymentMethods.length : 0} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(template.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/sim/content-template/${template.id}/edit`} className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 inline-flex items-center gap-1">
                                                <Edit2 className="h-4 w-4" /> Edit
                                            </Link>
                                            <button onClick={() => handleDelete(template.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 inline-flex items-center gap-1">
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {templates.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 italic font-medium">
                                        <div className="flex flex-col items-center gap-2">
                                            <Layout className="h-8 w-8 text-gray-300" />
                                            No content templates found.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
