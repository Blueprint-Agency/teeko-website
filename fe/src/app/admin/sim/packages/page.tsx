"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Loader2, Trash2, Globe } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import Link from "next/link";
import { formatDateTimeGMT8 } from "@/lib/dateUtils";

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
    status: "DRAFT" | "PUBLISHED" | "BIN";
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    provider: Provider | null;
}

type StatusTab = "ALL" | "PUBLISHED" | "DRAFT" | "BIN";

export default function AdminEsimPackagesPage() {
    const [activeStatus, setActiveStatus] = useState<StatusTab>("ALL");
    const [selectedProviderId, setSelectedProviderId] = useState<string>("all");
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const [pkgRes, provRes] = await Promise.all([
                fetch(`${API_BASE_URL}/sim/packages/all`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/sim/providers`, { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            if (pkgRes.status === 401 || pkgRes.status === 403) {
                setToast({ message: "Session expired or access denied. Please login again.", type: "error" });
                return;
            }

            if (!pkgRes.ok || !provRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const pkgData = await pkgRes.json();
            const provData = await provRes.json();

            setPackages(Array.isArray(pkgData) ? pkgData : []);
            setProviders(Array.isArray(provData) ? provData : []);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setToast({ message: "Error loading data. Check your connection or login again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeletePackage = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this package?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/packages/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
                setToast({ message: "Package deleted permanently!", type: "success" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMoveToBin = async (pkg: Package) => {
        if (!confirm("Move this package to bin?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/packages/${pkg.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ status: "BIN" })
            });
            if (res.ok) {
                fetchData();
                setToast({ message: "Package moved to bin", type: "success" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesStatus = activeStatus === "ALL" || pkg.status === activeStatus;
        const matchesProvider = selectedProviderId === "all" || pkg.providerId === selectedProviderId;
        return matchesStatus && matchesProvider;
    });

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return formatDateTimeGMT8(dateString);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PUBLISHED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "DRAFT": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            case "BIN": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel SIM Packages</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage connectivity packages and offerings</p>
                </div>
                <Link href="/admin/sim/create">
                    <Button><Plus className="mr-2 h-4 w-4" /> Add Package</Button>
                </Link>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-zinc-800/50 rounded-lg w-fit">
                        {(["ALL", "PUBLISHED", "DRAFT", "BIN"] as StatusTab[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatus(status)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeStatus === status
                                    ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                <span className="ml-2 px-1.5 py-0.5 bg-gray-200 dark:bg-zinc-700 rounded-full text-[10px]">
                                    {status === "ALL" ? packages.length : packages.filter(p => p.status === status).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Filter by Provider:</label>
                        <select
                            value={selectedProviderId}
                            onChange={(e) => setSelectedProviderId(e.target.value)}
                            className="text-xs font-medium bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500/20"
                        >
                            <option value="all">All Providers</option>
                            {providers.map(provider => (
                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Package</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Provider</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Published At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {filteredPackages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/admin/sim/${pkg.id}/edit`} className="group">
                                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 transition-colors cursor-pointer">{pkg.packageName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{pkg.slug}</div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pkg.provider?.name || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pkg.price || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(pkg.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(pkg.publishedAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(pkg.status)}`}>{pkg.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/admin/sim/${pkg.id}/edit`} className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 inline-flex items-center gap-1">
                                                    <Edit2 className="h-4 w-4" /> Edit
                                                </Link>
                                                {pkg.status === "BIN" ? (
                                                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 inline-flex items-center gap-1">
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleMoveToBin(pkg)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 inline-flex items-center gap-1">
                                                        <Trash2 className="h-4 w-4" /> Bin
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPackages.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 italic">No packages found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
