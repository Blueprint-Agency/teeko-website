"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Loader2, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";
import { Toast, ToastType } from "@/components/Toast";
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
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [formData, setFormData] = useState({
        packageName: "",
        slug: "",
        providerId: "",
        featureImage: "",
        price: "",
        about: "",
        ctaLink: "",
        seoTitle: "",
        seoDescription: "",
        isPublished: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch providers
                const providersRes = await fetch(`${API_BASE_URL}/esim/providers`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const providersData = await providersRes.json();
                setProviders(Array.isArray(providersData) ? providersData : []);

                // Fetch package
                const packageRes = await fetch(`${API_BASE_URL}/esim/packages/id/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const packageData = await packageRes.json();

                setFormData({
                    packageName: packageData.packageName || "",
                    slug: packageData.slug || "",
                    providerId: packageData.providerId || "",
                    featureImage: packageData.featureImage || "",
                    price: packageData.price || "",
                    about: packageData.about || "",
                    ctaLink: packageData.ctaLink || "",
                    seoTitle: packageData.seoTitle || "",
                    seoDescription: packageData.seoDescription || "",
                    isPublished: packageData.isPublished || false,
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
            const res = await fetch(`${API_BASE_URL}/esim/packages/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setToast({ message: "Package updated successfully!", type: "success" });
                setTimeout(() => router.push("/admin/esim"), 1500);
            } else {
                setToast({ message: "Failed to update package", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
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

            <div className="flex items-center gap-4">
                <Link href="/admin/esim">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit eSIM Package</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update package information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
                            <label className="block text-sm font-medium dark:text-gray-300">Price</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g., $29.99"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Feature Image URL</label>
                            <input
                                type="url"
                                className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.featureImage}
                                onChange={e => setFormData({ ...formData, featureImage: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.featureImage && (
                                <img
                                    src={formData.featureImage}
                                    alt="Preview"
                                    className="mt-2 h-32 w-auto rounded-md object-cover"
                                />
                            )}
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

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublished"
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            checked={formData.isPublished}
                            onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                        />
                        <label htmlFor="isPublished" className="ml-2 block text-sm font-medium dark:text-gray-300">
                            Published
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/esim">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Update Package
                    </Button>
                </div>
            </form>
        </div>
    );
}
