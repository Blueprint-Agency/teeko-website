"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Search, Loader2, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("general");
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
        images: [] as any[],
        reservationUrl: "",
        websiteUrl: "",
        googleStats: { rating: 0, totalReviews: 0, link: "" },
        tripAdvisorStats: { rating: 0, totalReviews: 0, link: "" },
        googleReviews: [] as any[],
        shortVideos: [] as any[],
    });

    const [syncing, setSyncing] = useState(false);
    const [syncingGoogle, setSyncingGoogle] = useState(false);
    const [syncingSocial, setSyncingSocial] = useState(false);
    const [googleSearchQuery, setGoogleSearchQuery] = useState("");
    const [socialSearchQuery, setSocialSearchQuery] = useState("");
    const [taId, setTaId] = useState("");

    const priceOptions = ["$", "$$", "$$$", "$$$$"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [locRes, restRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/locations`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/restaurants/id/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                const locData = await locRes.json();
                const restData = await restRes.json();

                setLocations(Array.isArray(locData) ? locData : []);

                if (restRes.ok) {
                    let minPrice = "$";
                    let maxPrice = "$";

                    if (restData.priceRange) {
                        const parts = restData.priceRange.split("-").map((p: string) => p.trim());
                        minPrice = parts[0] || "$";
                        maxPrice = parts[1] || minPrice;
                    }

                    setFormData({
                        name: restData.name || "",
                        slug: restData.slug || "",
                        locationId: restData.locationId || "",
                        description: restData.description || "",
                        address: restData.address || "",
                        minPrice,
                        maxPrice,
                        cuisine: restData.cuisine || "",
                        features: Array.isArray(restData.feature) ? restData.feature : [],
                        tripAdvisorId: restData.tripAdvisorId || "",
                        images: restData.restaurantImages || [],
                        reservationUrl: restData.reservationUrl || "",
                        websiteUrl: restData.websiteUrl || restData.contactInfo?.website || "",
                        googleStats: restData.restaurantStats[0]?.googleStats || { rating: 0, totalReviews: 0, link: "" },
                        tripAdvisorStats: restData.restaurantStats[0]?.tripAdvisorStats || { rating: 0, totalReviews: 0, link: "" },
                        googleReviews: restData.restaurantReviews.map((rev: any) => ({
                            ...rev,
                            user_name: rev.user_name || rev.userName,
                        })) || [],
                        shortVideos: [
                            ...(restData.shortVideos || []),
                        ],
                    });
                    setTaId(restData.tripAdvisorId || "");
                    setGoogleSearchQuery(restData.name || "");
                    setSocialSearchQuery(restData.name || "");
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
                    name: data.name || formData.name,
                    description: data.description || formData.description,
                    address: data.address || formData.address,
                    cuisine: data.cuisine || formData.cuisine,
                    features: Array.isArray(data.feature) ? data.feature : formData.features,
                    minPrice,
                    maxPrice,
                    tripAdvisorId: taId,
                    reservationUrl: data.reservationUrl || formData.reservationUrl,
                    websiteUrl: data.websiteUrl || data.website || formData.websiteUrl
                });
                setToast({ message: "Data fetched from TripAdvisor!", type: "success" });
            } else {
                setToast({ message: "Failed to fetch TripAdvisor data", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSyncing(false);
        }
    };

    const handleFetchGoogleStats = async () => {
        if (!googleSearchQuery) {
            setToast({ message: "Please provide a search query first", type: "error" });
            return;
        }
        setSyncingGoogle(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants/google/stats/${encodeURIComponent(googleSearchQuery)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    ...formData,
                    googleStats: {
                        ...formData.googleStats,
                        rating: data.rating || formData.googleStats.rating,
                        totalReviews: data.reviews || formData.googleStats.totalReviews,
                        link: data.link || formData.googleStats.link
                    },
                    googleReviews: (data.googleReviews || []).map((rev: any) => ({
                        ...rev,
                        user_name: rev.user_name || rev.userName,
                        userName: undefined
                    })) || formData.googleReviews
                });
                setToast({ message: "Google stats synced!", type: "success" });
            } else {
                setToast({ message: "Failed to fetch Google stats. Please check the query or try again later.", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred while syncing Google stats", type: "error" });
        } finally {
            setSyncingGoogle(false);
        }
    };

    const handleFetchSocialPosts = async () => {
        if (!socialSearchQuery) {
            setToast({ message: "Please provide a social search query first", type: "error" });
            return;
        }
        setSyncingSocial(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/restaurants/shortVideos/${encodeURIComponent(socialSearchQuery)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    ...formData,
                    shortVideos: [
                        ...formData.shortVideos,
                        ...(data.shortVideos || [])
                    ]
                });
                setToast({ message: "Short videos synced!", type: "success" });
            } else {
                setToast({ message: "Failed to fetch short videos. Please check the query or try again later.", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred while syncing short videos", type: "error" });
        } finally {
            setSyncingSocial(false);
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
        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const priceRange = formData.minPrice === formData.maxPrice
                ? formData.minPrice
                : `${formData.minPrice} - ${formData.maxPrice}`;

            const submissionData = {
                ...formData,
                priceRange,
                feature: formData.features.filter(f => f.trim() !== ""),
                googleReviews: formData.googleReviews.map(r => ({
                    ...r,
                    id: undefined,
                    user_image: (r.user_image || []).filter((img: any) => img.thumbnail && img.thumbnail.trim() !== "")
                })),
                xhsPosts: formData.shortVideos.filter(v => v.source === 'xhs').map(p => ({ ...p, id: undefined })),
                igReels: formData.shortVideos.filter(v => v.source === 'ig_reel').map(p => ({ ...p, id: undefined }))
            };
            // Clean up internal state fields
            delete (submissionData as any).minPrice;
            delete (submissionData as any).maxPrice;
            delete (submissionData as any).features;

            const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submissionData),
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

            <div className="flex gap-4 border-b border-gray-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-hide">
                {[
                    { id: "general", label: "General" },
                    { id: "images", label: "Images" },
                    { id: "reviews", label: "Reviews" },
                    { id: "reels", label: "Reels" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-sm font-semibold transition-all border-b-2 px-2 whitespace-nowrap ${activeTab === tab.id
                            ? "border-red-600 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "general" && (
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
                    <p className="mt-1 text-xs text-gray-500">Input standard TripAdvisor ID to sync data.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {activeTab === "general" && (
                    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                        <h2 className="text-lg font-semibold mb-6 dark:text-white">General Information</h2>
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
                                <label className="block text-sm font-medium dark:text-gray-300">Cuisine</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Japanese, Italian"
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                    value={formData.cuisine}
                                    onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium dark:text-gray-300">Price Range (Min)</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
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
                                        className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                        value={formData.maxPrice}
                                        onChange={e => setFormData({ ...formData, maxPrice: e.target.value })}
                                    >
                                        {priceOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
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
                                            className="flex-1 rounded-md border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
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
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                    value={formData.reservationUrl}
                                    onChange={e => setFormData({ ...formData, reservationUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Website URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="mt-1 block w-full rounded-md border p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                    value={formData.websiteUrl}
                                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                                />
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
                )}

                {activeTab === "reviews" && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Review Statistics</h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4 p-4 border rounded-lg dark:border-zinc-800">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">G</span>
                                        Google Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-gray-500">Search & Sync (Name/Location)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                    placeholder="e.g. Nasi Kandar Pelita KL"
                                                    value={googleSearchQuery}
                                                    onChange={e => setGoogleSearchQuery(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleFetchGoogleStats}
                                                    disabled={syncingGoogle || !googleSearchQuery}
                                                >
                                                    {syncingGoogle ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Search className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500">Rating</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                    value={formData.googleStats.rating}
                                                    onChange={e => setFormData({ ...formData, googleStats: { ...formData.googleStats, rating: parseFloat(e.target.value) } })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500">Total Reviews</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                    value={formData.googleStats.totalReviews}
                                                    onChange={e => setFormData({ ...formData, googleStats: { ...formData.googleStats, totalReviews: parseInt(e.target.value) } })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Google Maps Link</label>
                                            <input
                                                type="url"
                                                className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                placeholder="https://maps.app.goo.gl/..."
                                                value={formData.googleStats.link}
                                                onChange={e => setFormData({ ...formData, googleStats: { ...formData.googleStats, link: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 border rounded-lg dark:border-zinc-800">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-[#00AF87] text-white flex items-center justify-center text-xs font-bold">TA</span>
                                        TripAdvisor Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500">Rating</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={formData.tripAdvisorStats.rating}
                                                onChange={e => setFormData({ ...formData, tripAdvisorStats: { ...formData.tripAdvisorStats, rating: parseFloat(e.target.value) } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Total Reviews</label>
                                            <input
                                                type="number"
                                                className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={formData.tripAdvisorStats.totalReviews}
                                                onChange={e => setFormData({ ...formData, tripAdvisorStats: { ...formData.tripAdvisorStats, totalReviews: parseInt(e.target.value) } })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Link</label>
                                        <input
                                            type="url"
                                            className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                            value={formData.tripAdvisorStats.link}
                                            onChange={e => setFormData({ ...formData, tripAdvisorStats: { ...formData.tripAdvisorStats, link: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold dark:text-white">Google Reviews</h2>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({
                                        ...formData,
                                        googleReviews: [...formData.googleReviews, { id: Date.now().toString(), user_name: "", rating: 5, time_ago: "Today", description: "", user_image: [] }]
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Review
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {formData.googleReviews.map((rev, idx) => (
                                    <div key={rev.id || idx} className="p-4 border rounded-lg dark:border-zinc-800 space-y-3 relative">
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                            onClick={() => {
                                                const newReviews = [...formData.googleReviews];
                                                newReviews.splice(idx, 1);
                                                setFormData({ ...formData, googleReviews: newReviews });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Author Name"
                                                className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={rev.user_name}
                                                onChange={e => {
                                                    const newReviews = [...formData.googleReviews];
                                                    newReviews[idx] = { ...newReviews[idx], user_name: e.target.value };
                                                    setFormData({ ...formData, googleReviews: newReviews });
                                                }}
                                            />
                                            <select
                                                className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={rev.rating}
                                                onChange={e => {
                                                    const newReviews = [...formData.googleReviews];
                                                    newReviews[idx] = { ...newReviews[idx], rating: parseInt(e.target.value) };
                                                    setFormData({ ...formData, googleReviews: newReviews });
                                                }}
                                            >
                                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Review Content"
                                            className="w-full rounded border p-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                            rows={3}
                                            value={rev.description}
                                            onChange={e => {
                                                const newReviews = [...formData.googleReviews];
                                                newReviews[idx] = { ...newReviews[idx], description: e.target.value };
                                                setFormData({ ...formData, googleReviews: newReviews });
                                            }}
                                        />

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-gray-500">Review Images</label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-[10px]"
                                                    onClick={() => {
                                                        const newReviews = [...formData.googleReviews];
                                                        const currentImages = newReviews[idx].user_image || [];
                                                        newReviews[idx] = { ...newReviews[idx], user_image: [...currentImages, { thumbnail: "" }] };
                                                        setFormData({ ...formData, googleReviews: newReviews });
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> Add Image
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {(rev.user_image || rev.images || []).map((imgUrl: { thumbnail: string }, imgIdx: number) => (
                                                    <div key={imgIdx} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Image URL"
                                                            className="flex-1 rounded border p-1 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                            value={imgUrl.thumbnail}
                                                            onChange={e => {
                                                                const newReviews = [...formData.googleReviews];
                                                                const currentImages = [...(newReviews[idx].user_image || [])];
                                                                currentImages[imgIdx] = { thumbnail: e.target.value };
                                                                newReviews[idx] = { ...newReviews[idx], user_image: currentImages };
                                                                setFormData({ ...formData, googleReviews: newReviews });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                            onClick={() => {
                                                                const newReviews = [...formData.googleReviews];
                                                                const currentImages = (newReviews[idx].user_image || []).filter((_: any, i: number) => i !== imgIdx);
                                                                newReviews[idx] = { ...newReviews[idx], user_image: currentImages };
                                                                setFormData({ ...formData, googleReviews: newReviews });
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reels" && (
                    <div className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-4">
                            <h2 className="text-lg font-semibold dark:text-white">Social Search & Sync</h2>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for short videos (e.g. Restaurant Name)"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:ring-2 focus:ring-red-500 transition-all"
                                        value={socialSearchQuery}
                                        onChange={(e) => setSocialSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleFetchSocialPosts}
                                    disabled={syncingSocial}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {syncingSocial ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...</>
                                    ) : (
                                        <><Search className="mr-2 h-4 w-4" /> Search & Sync Video</>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                This will search for trending Instagram Reels and XiaoHongShu posts for this restaurant.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold dark:text-white">Short Videos</h2>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFormData({
                                        ...formData,
                                        shortVideos: [...formData.shortVideos, { id: Date.now().toString(), source: 'ig_reel', link: "", thumbnail: "", channel: "", title: "" }]
                                    })}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Video
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.shortVideos.map((post, idx) => (
                                    <div key={post.id || idx} className="p-4 border rounded-lg dark:border-zinc-800 space-y-2 relative">
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                            onClick={() => {
                                                const newPosts = [...formData.shortVideos];
                                                newPosts.splice(idx, 1);
                                                setFormData({ ...formData, shortVideos: newPosts });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                        <div className="grid grid-cols-1 gap-2">
                                            <div>
                                                <label className="text-[10px] text-gray-500">Source Type</label>
                                                <input
                                                    type="text"
                                                    placeholder="Source (e.g. ig_reel, xhs)"
                                                    className="w-full rounded border p-1 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                    value={post.source}
                                                    onChange={e => {
                                                        const newPosts = [...formData.shortVideos];
                                                        newPosts[idx] = { ...newPosts[idx], source: e.target.value };
                                                        setFormData({ ...formData, shortVideos: newPosts });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500">Video Link</label>
                                            <input
                                                type="text"
                                                placeholder="Link"
                                                className="w-full rounded border p-1 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={post.link}
                                                onChange={e => {
                                                    const newPosts = [...formData.shortVideos];
                                                    newPosts[idx] = { ...newPosts[idx], link: e.target.value };
                                                    setFormData({ ...formData, shortVideos: newPosts });
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500">Thumbnail URL</label>
                                            <input
                                                type="text"
                                                placeholder="Thumbnail URL"
                                                className="w-full rounded border p-1 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={post.thumbnail}
                                                onChange={e => {
                                                    const newPosts = [...formData.shortVideos];
                                                    newPosts[idx] = { ...newPosts[idx], thumbnail: e.target.value };
                                                    setFormData({ ...formData, shortVideos: newPosts });
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-gray-500">Channel</label>
                                            <input
                                                type="text"
                                                placeholder="Channel"
                                                className="w-full rounded border p-1 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white border-gray-200"
                                                value={post.channel}
                                                onChange={e => {
                                                    const newPosts = [...formData.shortVideos];
                                                    newPosts[idx] = { ...newPosts[idx], channel: e.target.value };
                                                    setFormData({ ...formData, shortVideos: newPosts });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "images" && (
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
                )}

                <div className="flex justify-end gap-3 pt-6 border-t dark:border-zinc-800">
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
