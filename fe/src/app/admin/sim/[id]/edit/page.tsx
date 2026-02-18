"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Upload, Trash2, Layout, Plus } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Provider {
    id: string;
    name: string;
    slug: string;
}

export default function EditEsimPackagePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [formData, setFormData] = useState({
        packageName: "",
        slug: "",
        providerId: "",
        featureImage: "",
        price: "",
        duration: "3",
        durationUnit: "days",
        about: "",
        ctaLink: "",
        seoTitle: "",
        seoDescription: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED" | "BIN",
        features: [] as { title: string; description: string }[],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch providers
                const providersRes = await fetch(`${API_BASE_URL}/sim/providers`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const providersData = await providersRes.json();
                setProviders(Array.isArray(providersData) ? providersData : []);

                // Fetch package
                const packageRes = await fetch(`${API_BASE_URL}/sim/packages/id/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const packageData = await packageRes.json();

                setFormData({
                    packageName: packageData.packageName || "",
                    slug: packageData.slug || "",
                    providerId: packageData.providerId || "",
                    featureImage: packageData.featureImage || "",
                    price: packageData.price ? packageData.price.replace(/^RM/, "") : "",
                    duration: packageData.duration ? packageData.duration.toString() : "3",
                    durationUnit: packageData.durationUnit || "days",
                    about: packageData.about || "",
                    ctaLink: packageData.ctaLink || "",
                    seoTitle: packageData.seoTitle || "",
                    seoDescription: packageData.seoDescription || "",
                    status: packageData.status || "DRAFT",
                    features: packageData.features || [],
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
                setToast({ message: "Failed to load package", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/packages/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setToast({ message: "Package updated successfully!", type: "success" });
                setTimeout(() => router.push("/admin/sim"), 1500);
            } else {
                const errorData = await res.json();
                setToast({ message: errorData.message || "Failed to update package", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const token = localStorage.getItem("token");
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        formDataUpload.append("simPackageId", id);

        try {
            const res = await fetch(`${API_BASE_URL}/sim/packages/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData({ ...formData, featureImage: data.url });
                setToast({ message: "Image uploaded successfully!", type: "success" });
            } else {
                setToast({ message: "Failed to upload image", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "Error uploading image", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit eSIM Package</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update package information</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Package Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.packageName}
                                    onChange={e => setFormData({
                                        ...formData,
                                        packageName: e.target.value,
                                        slug: generateSlug(e.target.value)
                                    })}
                                    placeholder="e.g., Global eSIM 10GB"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Slug *</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., global-esim-10gb"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Provider *</label>
                                <select
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.providerId}
                                    onChange={e => setFormData({ ...formData, providerId: e.target.value })}
                                >
                                    <option value="">Select a provider</option>
                                    {providers.map(provider => (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Price (Integer only)</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">RM</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="1"
                                        className="block w-full rounded-md border border-gray-200 p-2 pl-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="29"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Duration</label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="number"
                                        required
                                        className="block w-2/3 rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="e.g. 3"
                                        min="1"
                                    />
                                    <select
                                        className="block w-1/3 rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={formData.durationUnit}
                                        onChange={e => setFormData({ ...formData, durationUnit: e.target.value })}
                                    >
                                        <option value="days">Days</option>
                                        <option value="hours">Hours</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Feature Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                                <div className="flex flex-col gap-4 mt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={uploading}
                                        className="w-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 py-6"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {uploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <Upload className="h-4 w-4 mr-2" />
                                        )}
                                        {formData.featureImage ? "Change Image" : "Upload Feature Image"}
                                    </Button>

                                    {formData.featureImage ? (
                                        <div className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img src={formData.featureImage} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setFormData({ ...formData, featureImage: "" })}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/10] rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-300">
                                            <Layout className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">About</label>
                                <textarea
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.about}
                                    onChange={e => setFormData({ ...formData, about: e.target.value })}
                                    placeholder="Describe the package features and benefits..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">CTA Link</label>
                                <input
                                    type="url"
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.ctaLink}
                                    onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                                    placeholder="https://provider.com/buy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Core Features */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold dark:text-white">Core Product Features</h2>
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-0.5">Note: Global content templates take precedence</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({
                                    ...formData,
                                    features: [...formData.features, { title: "", description: "" }]
                                })}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Feature
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl relative group">
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            className="block w-full rounded-md border border-gray-200 p-2 text-sm font-semibold dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            placeholder="Feature Title"
                                            value={feature.title}
                                            onChange={e => {
                                                const newFeatures = [...formData.features];
                                                newFeatures[index].title = e.target.value;
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                        />
                                        <textarea
                                            rows={2}
                                            className="block w-full rounded-md border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            placeholder="Feature Description..."
                                            value={feature.description}
                                            onChange={e => {
                                                const newFeatures = [...formData.features];
                                                newFeatures[index].description = e.target.value;
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 p-1 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            const newFeatures = formData.features.filter((_, i) => i !== index);
                                            setFormData({ ...formData, features: newFeatures });
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.features.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl text-gray-400 text-sm">
                                    No core features added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Actions */}
                <div className="space-y-6">
                    {/* SEO Settings */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">SEO Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">SEO Title</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.seoTitle}
                                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                    placeholder="SEO-optimized title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">SEO Description</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                    value={formData.seoDescription}
                                    onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                    placeholder="SEO meta description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Publish Status */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Publish</h2>
                        <div className="mb-6 space-y-2">
                            <label className="block text-sm font-medium dark:text-gray-300 mb-3">Status</label>

                            {/* Draft Option */}
                            <label
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.status === "DRAFT"
                                    ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
                                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value="DRAFT"
                                    checked={formData.status === "DRAFT"}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" | "BIN" })}
                                    className="sr-only"
                                />
                                <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></span>
                                <div>
                                    <span className="font-medium dark:text-white">Draft</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Not visible to users</p>
                                </div>
                            </label>

                            {/* Published Option */}
                            <label
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.status === "PUBLISHED"
                                    ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value="PUBLISHED"
                                    checked={formData.status === "PUBLISHED"}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" | "BIN" })}
                                    className="sr-only"
                                />
                                <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                                <div>
                                    <span className="font-medium dark:text-white">Published</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Live and visible to all</p>
                                </div>
                            </label>

                            {/* Bin Option */}
                            <label
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.status === "BIN"
                                    ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value="BIN"
                                    checked={formData.status === "BIN"}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" | "BIN" })}
                                    className="sr-only"
                                />
                                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                                <div>
                                    <span className="font-medium dark:text-white">Bin</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Archived / Deleted</p>
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button type="submit" disabled={submitting} className="w-full justify-center">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Update Package
                            </Button>
                            <Link href="/admin/sim" className="w-full">
                                <Button type="button" variant="ghost" className="w-full justify-center">Cancel</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
