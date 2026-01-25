"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Plus, Edit2, Loader2, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";
import { Toast, ToastType } from "@/components/Toast";
import Link from "next/link";

interface Provider {
    id: string;
    name: string;
    slug: string;
}

interface Package {
    id: string;
    packageName: string;
    slug: string;
    providerId: string;
    featureImage: string | null;
    price: string | null;
    about: string | null;
    ctaLink: string | null;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    provider: Provider | null;
}

export default function AdminEsimPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/esim/packages/all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setPackages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch packages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this package?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/esim/packages/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchPackages();
                setToast({ message: "Package deleted successfully!", type: "success" });
            } else {
                setToast({ message: "Failed to delete package", type: "error" });
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eSIM Packages</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage eSIM packages and offerings</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/esim/providers">
                        <Button variant="ghost">Manage Providers</Button>
                    </Link>
                    <Link href="/admin/esim/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Package
                        </Button>
                    </Link>
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
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Package Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                            {packages.map((pkg) => (
                                <tr key={pkg.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {pkg.packageName}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {pkg.provider?.name || "N/A"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {pkg.price || "N/A"}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${pkg.isPublished
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                            {pkg.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                                        <Link
                                            href={`/admin/esim/${pkg.id}/edit`}
                                            className="text-primary hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {packages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No packages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
