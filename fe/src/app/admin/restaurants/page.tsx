"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Edit2, Loader2, Check, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

interface Restaurant {
    id: string;
    name: string;
    priceRange: string;
    address: string;
    status: string;
}

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchRestaurants = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleToggleStatus = async (restaurant: Restaurant) => {
        try {
            const token = localStorage.getItem("token");
            const newStatus = restaurant.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

            // Optimistic update
            setRestaurants(prev => prev.map(r =>
                r.id === restaurant.id ? { ...r, status: newStatus } : r
            ));

            const data = {
                status: newStatus,
            }

            const res = await fetch(`${API_BASE_URL}/restaurants/${restaurant.id}/updateStatus`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            setToast({
                message: `Restaurant ${newStatus ? 'activated' : 'deactivated'} successfully`,
                type: "success"
            });
        } catch (error) {
            console.error(error);
            // Revert optimistic update
            setRestaurants(prev => prev.map(r =>
                r.id === restaurant.id ? { ...r, status: restaurant.status } : r
            ));
            setToast({
                message: "Failed to update restaurant status",
                type: "error"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
                <Link href="/admin/restaurants/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Restaurant
                    </Button>
                </Link>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Address</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {restaurants.map((res) => (
                                    <tr key={res.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{res.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.priceRange || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{res.address || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(res)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 ${res.status === 'ACTIVE' ? 'bg-red-600' : 'bg-gray-200 dark:bg-zinc-700'
                                                    }`}
                                                role="switch"
                                                aria-checked={res.status === 'ACTIVE'}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${res.status === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <Link href={`/admin/restaurants/${res.id}/edit`}>
                                                <button className="text-primary hover:text-red-900 dark:hover:text-red-400 inline-flex items-center">
                                                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {restaurants.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No restaurants found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

