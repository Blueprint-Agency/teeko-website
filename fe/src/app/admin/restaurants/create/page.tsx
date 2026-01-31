"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function CreateRestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        locationId: "",
        description: "",
        address: "",
        priceRange: "$",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/admin/locations`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setLocations(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/restaurants");
            } else {
                alert("Failed to create restaurant");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/restaurants" className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-zinc-800">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Restaurant</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="grid gap-6 md:grid-cols-2">
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
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300">Location</label>
                    <select
                        required
                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                        value={formData.locationId}
                        onChange={e => setFormData({ ...formData, locationId: e.target.value })}
                    >
                        <option value="">Select a location</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300">Price Range</label>
                    <select
                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                        value={formData.priceRange}
                        onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                    >
                        <option value="$">$ (Cheap)</option>
                        <option value="$$">$$ (Moderate)</option>
                        <option value="$$$">$$$ (Expensive)</option>
                        <option value="$$$$">$$$$ (Fine Dining)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300">Address</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                        rows={3}
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300">Description</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/restaurants">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Restaurant"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

