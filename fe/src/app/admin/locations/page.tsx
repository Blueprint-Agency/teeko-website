"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Plus, Search } from "lucide-react";

interface Location {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", slug: "", seoTitle: "", seoDescription: "" });

    const fetchLocations = async () => {
        try {
            const res = await fetch("http://localhost:5000/locations");
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/locations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({ name: "", slug: "", seoTitle: "", seoDescription: "" });
                fetchLocations();
            } else {
                alert("Failed to create location");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Locations</h1>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Location
                </Button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
                                        <button className="text-primary hover:text-red-900 dark:hover:text-red-400">Edit</button>
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
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
                        <h2 className="mb-4 text-xl font-bold dark:text-white">Add New Location</h2>
                        <form onSubmit={handleCreateLocation} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Slug</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">SEO Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.seoTitle}
                                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
