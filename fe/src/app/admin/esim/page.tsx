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

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eSIM Packages</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage eSIM packages and offerings</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
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
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{pkg.packageName}</h3>
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${pkg.isPublished
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                            {pkg.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Provider:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{pkg.provider?.name || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{pkg.price || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-zinc-800">
                                    <Link href={`/admin/esim/${pkg.id}/edit`} className="flex-1">
                                        <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium inline-flex items-center justify-center">
                                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-red-600 dark:text-red-400 rounded-md text-sm font-medium inline-flex items-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {packages.length === 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-8 text-center">
                                <p className="text-sm text-gray-500">No packages found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
