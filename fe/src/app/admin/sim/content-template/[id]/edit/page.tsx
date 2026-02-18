"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Plus, Trash2, Layout, Image as ImageIcon, Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Provider {
    id: string;
    name: string;
}

export default function EditContentTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [formData, setFormData] = useState({
        providerId: "",
        features: [] as { title: string; description: string }[],
        paymentMethods: [] as { title: string; description: string; imageUrl: string; imageAlt: string }[],
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

                // Fetch template
                const templateRes = await fetch(`${API_BASE_URL}/sim/content-templates/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!templateRes.ok) throw new Error("Template not found");
                const templateData = await templateRes.json();

                setFormData({
                    providerId: templateData.providerId || "",
                    features: templateData.features || [],
                    paymentMethods: templateData.paymentMethods || [],
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
                setToast({ message: "Failed to load template data", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.providerId) {
            setToast({ message: "Please select a provider", type: "error" });
            return;
        }
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/sim/content-templates/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setToast({ message: "Template updated successfully!", type: "success" });
                setTimeout(() => router.push("/admin/sim/content-template"), 1100);
            } else {
                const errorData = await res.json();
                setToast({ message: errorData.message || "Failed to update template", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIndex(index);
        const token = localStorage.getItem("token");
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

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
                const newMethods = [...formData.paymentMethods];
                newMethods[index].imageUrl = data.url;
                setFormData({ ...formData, paymentMethods: newMethods });
                setToast({ message: "Image uploaded successfully!", type: "success" });
            } else {
                setToast({ message: "Failed to upload image", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "Error uploading image", type: "error" });
        } finally {
            setUploadingIndex(null);
        }
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, { title: "", description: "" }]
        });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const addPaymentMethod = () => {
        setFormData({
            ...formData,
            paymentMethods: [...formData.paymentMethods, { title: "", description: "", imageUrl: "", imageAlt: "" }]
        });
    };

    const removePaymentMethod = (index: number) => {
        const newMethods = formData.paymentMethods.filter((_, i) => i !== index);
        setFormData({ ...formData, paymentMethods: newMethods });
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center gap-4">
                <Link href="/admin/sim/content-template">
                    <Button variant="ghost" size="sm"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Content Template</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Update global sections for provider</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Provider *</label>
                    <select
                        required
                        className="w-full rounded-lg border border-gray-200 p-2.5 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-red-500/20"
                        value={formData.providerId}
                        onChange={e => setFormData({ ...formData, providerId: e.target.value })}
                    >
                        <option value="">Choose a provider</option>
                        {providers.map(provider => (
                            <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                    </select>
                </div>

                {/* Core Product Features Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold dark:text-white">Core Product Features</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                            <Plus className="h-4 w-4 mr-1" /> Add Feature
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl space-y-3 relative group">
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    onClick={() => removeFeature(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <div className="grid grid-cols-1 gap-3 pr-8">
                                    <input
                                        type="text"
                                        placeholder="Feature Title"
                                        className="w-full rounded-lg border border-gray-200 p-2 text-sm font-semibold dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={feature.title}
                                        onChange={e => {
                                            const newFeatures = [...formData.features];
                                            newFeatures[index].title = e.target.value;
                                            setFormData({ ...formData, features: newFeatures });
                                        }}
                                    />
                                    <textarea
                                        placeholder="Feature Description"
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={feature.description}
                                        onChange={e => {
                                            const newFeatures = [...formData.features];
                                            newFeatures[index].description = e.target.value;
                                            setFormData({ ...formData, features: newFeatures });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {formData.features.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl text-gray-400 text-sm italic">
                                No features added.
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Methods Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold dark:text-white">Supports Multiple Payment Methods</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addPaymentMethod}>
                            <Plus className="h-4 w-4 mr-1" /> Add Method
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.paymentMethods.map((method, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl space-y-4 relative group border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    onClick={() => removePaymentMethod(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Image</label>
                                        <div className="aspect-[16/9] rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden relative group/img">
                                            {method.imageUrl ? (
                                                <>
                                                    <img src={method.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newMethods = [...formData.paymentMethods];
                                                                newMethods[index].imageUrl = "";
                                                                setFormData({ ...formData, paymentMethods: newMethods });
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                                    <ImageIcon className="h-8 w-8 mb-1" />
                                                    <span className="text-[10px]">No image uploaded</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={el => { fileInputRefs.current[index] = el; }}
                                            onChange={e => handleImageUpload(e, index)}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            disabled={uploadingIndex === index}
                                            onClick={() => fileInputRefs.current[index]?.click()}
                                        >
                                            {uploadingIndex === index ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Upload className="h-4 w-4 mr-2" />
                                            )}
                                            {method.imageUrl ? "Change Image" : "Upload Image"}
                                        </Button>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Local digital payment methods"
                                                className="w-full rounded-lg border border-gray-200 p-2 text-sm font-semibold dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                                value={method.title}
                                                onChange={e => {
                                                    const newMethods = [...formData.paymentMethods];
                                                    newMethods[index].title = e.target.value;
                                                    setFormData({ ...formData, paymentMethods: newMethods });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                                            <textarea
                                                placeholder="Description..."
                                                rows={3}
                                                className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                                value={method.description}
                                                onChange={e => {
                                                    const newMethods = [...formData.paymentMethods];
                                                    newMethods[index].description = e.target.value;
                                                    setFormData({ ...formData, paymentMethods: newMethods });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.paymentMethods.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl text-gray-400 text-sm italic">
                                No payment methods added.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/sim/content-template">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={submitting} className="px-8">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Update Template
                    </Button>
                </div>
            </form>
        </div>
    );
}
