"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Trash2, Plus, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        locationId: "",
        description: "",
        address: "",
        priceRange: "$",
        images: [] as any[]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [locRes, restRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/locations`),
                    fetch(`${API_BASE_URL}/restaurants/id/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const locData = await locRes.json();
                const restData = await restRes.json();

                setLocations(Array.isArray(locData) ? locData : []);

                if (restRes.ok) {
                    setFormData({
                        name: restData.name || "",
                        slug: restData.slug || "",
                        locationId: restData.locationId || "",
                        description: restData.description || "",
                        address: restData.address || "",
                        priceRange: restData.priceRange || "$",
                        images: restData.restaurantImages || []
                    });
                } else {
                    setToast({ message: "Restaurant not found", type: "error" });
                    setTimeout(() => router.push("/admin/restaurants"), 2000);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setToast({ message: "Restaurant updated successfully!", type: "success" });
                setTimeout(() => router.push("/admin/restaurants"), 1500);
            } else {
                setToast({ message: "Failed to update restaurant", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleAddImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { url: "", caption: "", isPrimary: false }]
        });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleImageChange = (index: number, field: string, value: any) => {
        const newImages = [...formData.images];
        newImages[index] = { ...newImages[index], [field]: value };

        // If setting as primary, unset others
        if (field === 'isPrimary' && value === true) {
            newImages.forEach((img, i) => {
                if (i !== index) img.isPrimary = false;
            });
        }

        setFormData({ ...formData, images: newImages });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/restaurants" className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-zinc-800">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Restaurant</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2 dark:text-white">General Information</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Slug</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
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
                                className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
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
                                className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                value={formData.priceRange}
                                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                            >
                                <option value="$">$ (Cheap)</option>
                                <option value="$$">$$ (Moderate)</option>
                                <option value="$$$">$$$ (Expensive)</option>
                                <option value="$$$$">$$$$ (Fine Dining)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Address</label>
                        <textarea
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300">Description</label>
                        <textarea
                            className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-lg font-semibold dark:text-white">Images</h2>
                        <Button type="button" variant="ghost" size="sm" onClick={handleAddImage}>
                            <Plus className="h-4 w-4 mr-1" /> Add Image
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg dark:border-zinc-800">
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        className="w-full rounded-md border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                        value={img.url}
                                        onChange={e => handleImageChange(index, 'url', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Caption"
                                        className="w-full rounded-md border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                        value={img.caption}
                                        onChange={e => handleImageChange(index, 'caption', e.target.value)}
                                    />
                                    <label className="flex items-center gap-2 text-sm dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={img.isPrimary}
                                            onChange={e => handleImageChange(index, 'isPrimary', e.target.checked)}
                                        />
                                        Primary Image
                                    </label>
                                </div>
                                {img.url && (
                                    <div className="w-24 h-24 border rounded overflow-hidden">
                                        <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/restaurants">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
