"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

interface Restaurant {
    id: string;
    name: string;
    priceRange: string;
    address: string;
}

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchRestaurants();
    }, []);

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
                    <div className="hidden md:block rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Address</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {restaurants.map((res) => (
                                    <tr key={res.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{res.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.priceRange || "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{res.address || "-"}</td>
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {restaurants.map((res) => (
                            <div key={res.id} className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{res.name}</h3>
                                    <Link href={`/admin/restaurants/${res.id}/edit`}>
                                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                    </Link>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                                        <span className="text-gray-900 dark:text-white font-medium">{res.priceRange || "-"}</span>
                                    </div>
                                    {res.address && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400 block mb-1">Address:</span>
                                            <span className="text-gray-900 dark:text-white text-xs">{res.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {restaurants.length === 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-8 text-center">
                                <p className="text-sm text-gray-500">No restaurants found.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
