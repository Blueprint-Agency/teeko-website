"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Plus, X, Search, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function CreateRestaurantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const [taId, setTaId] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        locationId: "",
        description: "",
        address: "",
        minPrice: "$",
        maxPrice: "$",
        cuisine: "",
        features: [] as string[],
        tripAdvisorId: "",
        reservationUrl: "",
        websiteUrl: "",
    });

    const priceOptions = ["$", "$$", "$$$", "$$$$"];

    useEffect(() => {
        fetch(`${API_BASE_URL}/locations`)
            .then(res => res.json())
            .then(data => setLocations(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, []);

    const handleFetchTripAdvisor = async () => {
        if (!taId) return;
        setSyncing(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants/tripadvisor/${taId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log('haha', data)

                // Parse price range
                let minPrice = "$";
                let maxPrice = "$";
                if (data.priceRange) {
                    const parts = data.priceRange.split("-").map((p: string) => p.trim());
                    minPrice = parts[0] || "$";
                    maxPrice = parts[1] || minPrice;
                }

                setFormData({
                    ...formData,
                    name: data.name || "",
                    slug: data.name?.toLowerCase().replace(/\s+/g, '-') || "",
                    description: data.description || "",
                    address: data.address || "",
                    cuisine: data.cuisine || "",
                    features: Array.isArray(data.feature) ? data.feature : [],
                    minPrice,
                    maxPrice,
                    tripAdvisorId: taId,
                    reservationUrl: data.reservationUrl || "",
                    websiteUrl: data.websiteUrl || data.website || ""
                });
            } else {
                alert("Failed to fetch TripAdvisor data");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching TripAdvisor data");
        } finally {
            setSyncing(false);
        }
    };

    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ""] });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const priceRange = formData.minPrice === formData.maxPrice
                ? formData.minPrice
                : `${formData.minPrice} - ${formData.maxPrice}`;

            const submissionData = {
                ...formData,
                priceRange,
                feature: formData.features.filter(f => f.trim() !== ""), // Map internal 'features' to API 'feature'
            };
            // Clean up internal state fields
            delete (submissionData as any).minPrice;
            delete (submissionData as any).maxPrice;
            delete (submissionData as any).features;

            const res = await fetch(`${API_BASE_URL}/restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submissionData),
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

            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">Sync with TripAdvisor</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter TripAdvisor ID (e.g. 1234567)"
                        className="flex-1 rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                        value={taId}
                        onChange={e => setTaId(e.target.value)}
                    />
                    <Button
                        type="button"
                        onClick={handleFetchTripAdvisor}
                        disabled={syncing || !taId}
                    >
                        {syncing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Search className="h-4 w-4 mr-2" />
                        )}
                        Fetch Data
                    </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Input standard TripAdvisor ID to auto-fill the form.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 border-gray-200"
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

                <div className="grid gap-6 md:grid-cols-2">
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
                        <label className="block text-sm font-medium dark:text-gray-300">Cuisine</label>
                        <input
                            type="text"
                            placeholder="e.g. Japanese, Italian"
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                            value={formData.cuisine}
                            onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Price Range (Min)</label>
                        <select
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                            value={formData.minPrice}
                            onChange={e => setFormData({ ...formData, minPrice: e.target.value })}
                        >
                            {priceOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Price Range (Max)</label>
                        <select
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700"
                            value={formData.maxPrice}
                            onChange={e => setFormData({ ...formData, maxPrice: e.target.value })}
                        >
                            {priceOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium dark:text-gray-300">Features & Amenities</label>
                        <Button type="button" variant="ghost" size="sm" onClick={handleAddFeature}>
                            <Plus className="h-4 w-4 mr-1" /> Add Feature
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-md border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
                                    value={feature}
                                    onChange={e => handleFeatureChange(index, e.target.value)}
                                    placeholder="e.g. Free Wi-Fi"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Reservation URL</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 border-gray-200"
                            value={formData.reservationUrl}
                            onChange={e => setFormData({ ...formData, reservationUrl: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Website URL</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 border-gray-200"
                            value={formData.websiteUrl}
                            onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                        />
                    </div>
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
            </form >
        </div >
    );
}

