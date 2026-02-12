"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Plus, Trash2, GripVertical, MapPin, Utensils, Type, Layout, MousePointer2, X, Upload } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Location {
    id: string;
    name: string;
}

interface Restaurant {
    id: string;
    name: string;
    locationId: string;
}

interface ContentBlock {
    blockType: "h2" | "h3" | "h4" | "paragraph" | "location" | "restaurant";
    content: string;
    locationId?: string;
    restaurantId?: string;
}

export default function CreateBlogPostPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        metaDescription: "",
        featureImage: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED" | "BIN",
    });

    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
        { blockType: "paragraph", content: "" }
    ]);

    const [insertIndex, setInsertIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [locRes, restRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/locations`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/restaurants`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);
                const locData = await locRes.json();
                const restData = await restRes.json();
                setLocations(Array.isArray(locData) ? locData : []);
                setRestaurants(Array.isArray(restData) ? restData : []);
            } catch (error) {
                console.error("Failed to fetch locations/restaurants", error);
            }
        };
        fetchData();
    }, []);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const addBlock = (type: ContentBlock["blockType"], index?: number) => {
        const newBlock: ContentBlock = { blockType: type, content: "" };
        if (type === "location" || type === "restaurant") {
            newBlock.content = `[${type.toUpperCase()} WIDGET]`;
        }

        if (index !== undefined) {
            const updated = [...contentBlocks];
            updated.splice(index, 0, newBlock);
            setContentBlocks(updated);
        } else {
            setContentBlocks([...contentBlocks, newBlock]);
        }
        setInsertIndex(null);
    };

    const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
        const updated = [...contentBlocks];
        updated[index] = { ...updated[index], ...updates };
        setContentBlocks(updated);
    };

    const removeBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    // Simple Drag and Drop implementation using browser native API
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updated = [...contentBlocks];
        const itemToMove = updated.splice(draggedIndex, 1)[0];
        updated.splice(index, 0, itemToMove);
        setDraggedIndex(index);
        setContentBlocks(updated);
    };

    const onDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/blog/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    contentBlocks: contentBlocks.filter(block =>
                        block.content.trim() !== "" || block.locationId || block.restaurantId
                    )
                }),
            });

            if (res.ok) {
                setToast({ message: "Post created successfully!", type: "success" });
                setTimeout(() => router.push("/admin/blog"), 1500);
            } else {
                const data = await res.json();
                setToast({ message: data.message || "Failed to create post", type: "error" });
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

        try {
            const res = await fetch(`${API_BASE_URL}/blog/posts/upload`, {
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

    return (
        <div className="relative min-h-screen pb-24">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Toolbox Overlay */}
            {insertIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[32px] p-8 shadow-2xl relative">
                        <button
                            onClick={() => setInsertIndex(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>

                        <div className="flex items-center gap-2 mb-8">
                            <Plus className="h-5 w-5 text-red-600" />
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Choose Component</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Structure</h4>
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-500" />} label="Heading H2" onClick={() => addBlock("h2", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-400" />} label="Heading H3" onClick={() => addBlock("h3", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-blue-300" />} label="Heading H4" onClick={() => addBlock("h4", insertIndex)} />
                                <WidgetButton icon={<Type className="h-4 w-4 text-green-500" />} label="Paragraph" onClick={() => addBlock("paragraph", insertIndex)} />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Smart Widgets</h4>
                                <WidgetButton icon={<MapPin className="h-4 w-4 text-red-500" />} label="Location Guide" onClick={() => addBlock("location", insertIndex)} />
                                <WidgetButton icon={<Utensils className="h-4 w-4 text-orange-500" />} label="Restaurant Card" onClick={() => addBlock("restaurant", insertIndex)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center mb-12">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">New Blog Post</h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Fundamental Settings */}
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-12">
                    <div className="rounded-3xl border border-gray-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Fundamental Settings</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Navigation Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: generateSlug(e.target.value)
                                        })}
                                        placeholder="What is the name of this post?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Permanent URL Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="url-friendly-name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Search Meta Description</label>
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            value={formData.metaDescription}
                                            onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                            placeholder="Brief summary for Google search results..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Visibility Status</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: "DRAFT", label: "Draft", desc: "Private work", color: "bg-amber-500", border: "border-amber-500 bg-amber-50 dark:bg-amber-500/10" },
                                                { id: "PUBLISHED", label: "Published", desc: "Live to all", color: "bg-green-500", border: "border-green-500 bg-green-50 dark:bg-green-500/10" },
                                                { id: "BIN", label: "Bin", desc: "Archived", color: "bg-red-500", border: "border-red-500 bg-red-50 dark:bg-red-500/10" }
                                            ].map((s) => (
                                                <label
                                                    key={s.id}
                                                    className={`flex flex-col gap-1 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${formData.status === s.id
                                                        ? s.border
                                                        : "border-gray-50 dark:border-zinc-800 hover:border-gray-100 dark:hover:border-zinc-700"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={s.id}
                                                        checked={formData.status === s.id}
                                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                                                        <span className="text-[10px] font-black uppercase dark:text-white tracking-tighter">{s.label}</span>
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{s.desc}</p>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-12">
                                        <Button
                                            type="submit"
                                            form="blog-form"
                                            disabled={submitting}
                                            className="rounded-2xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 text-white font-black uppercase text-xs tracking-widest px-12 py-4"
                                        >
                                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                            Create Post
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Cover Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                    <div className="flex flex-col gap-4">
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
                                            {formData.featureImage ? "Change Image" : "Upload Cover Image"}
                                        </Button>

                                        {formData.featureImage ? (
                                            <div className="group relative aspect-[21/9] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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
                                            <div className="aspect-[21/9] rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-300">
                                                <Layout className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Post Content</h2>
                        </div>

                        <div className="relative">
                            {contentBlocks.map((block, index) => (
                                <div key={index}>
                                    {/* Insertion Point Above */}
                                    <div className="group relative h-4 flex items-center justify-center">
                                        <div className="absolute inset-x-0 h-[1px] bg-red-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <button
                                            type="button"
                                            onClick={() => setInsertIndex(index)}
                                            className="relative z-10 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className={`group relative flex gap-4 items-start bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 transition-all hover:border-red-200 shadow-sm hover:shadow-md ${draggedIndex === index ? 'opacity-50 border-red-500 scale-[0.98]' : ''}`}>
                                        <div
                                            draggable
                                            onDragStart={(e) => onDragStart(e, index)}
                                            onDragOver={(e) => onDragOver(e, index)}
                                            onDragEnd={onDragEnd}
                                            className="flex flex-col gap-2 pt-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 dark:hover:bg-zinc-800 p-1 rounded-lg"
                                        >
                                            <GripVertical className="h-5 w-5 text-gray-300 mx-auto group-hover:text-red-400 transition-colors" />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${block.blockType.startsWith('h') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                                        block.blockType === 'paragraph' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                                        }`}>
                                                        {block.blockType}
                                                    </span>
                                                </div>
                                                <button type="button" onClick={() => removeBlock(index)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>

                                            {(block.blockType === "paragraph" || block.blockType.startsWith("h")) ? (
                                                block.blockType === "paragraph" ? (
                                                    <textarea
                                                        rows={3}
                                                        className="w-full bg-transparent text-base text-gray-800 dark:text-gray-100 outline-none resize-none placeholder-gray-300 leading-relaxed font-medium"
                                                        value={block.content}
                                                        onChange={e => updateBlock(index, { content: e.target.value })}
                                                        placeholder="Write something compelling..."
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="w-full bg-transparent text-xl font-black text-gray-900 dark:text-white outline-none placeholder-gray-300 tracking-tight"
                                                        value={block.content}
                                                        onChange={e => updateBlock(index, { content: e.target.value })}
                                                        placeholder={`${block.blockType.toUpperCase()} Heading...`}
                                                    />
                                                )
                                            ) : null}

                                            {block.blockType === "location" && (
                                                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-zinc-700">
                                                    <div className="flex items-center gap-3 mb-4 text-red-600">
                                                        <MapPin className="h-5 w-5" />
                                                        <span className="text-sm font-bold uppercase tracking-widest">Location Widget</span>
                                                    </div>
                                                    <select
                                                        className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none"
                                                        value={block.locationId || ""}
                                                        onChange={e => updateBlock(index, { locationId: e.target.value || undefined, restaurantId: undefined })}
                                                    >
                                                        <option value="">Select a location to suggest top places</option>
                                                        {locations.map(loc => (
                                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {block.blockType === "restaurant" && (
                                                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-zinc-700">
                                                    <div className="flex items-center gap-3 mb-4 text-red-600">
                                                        <Utensils className="h-5 w-5" />
                                                        <span className="text-sm font-bold uppercase tracking-widest">Restaurant Widget</span>
                                                    </div>
                                                    <select
                                                        className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none"
                                                        value={block.restaurantId || ""}
                                                        onChange={e => updateBlock(index, { restaurantId: e.target.value || undefined, locationId: undefined })}
                                                    >
                                                        <option value="">Select a specific restaurant to showcase</option>
                                                        {restaurants.map(rest => (
                                                            <option key={rest.id} value={rest.id}>{rest.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Final Insertion Point */}
                            <div className="relative mt-8 group flex flex-col items-center">
                                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-100 dark:bg-zinc-800 -translate-y-1/2" />
                                <button
                                    type="button"
                                    onClick={() => setInsertIndex(contentBlocks.length)}
                                    className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-red-200 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95"
                                >
                                    <Plus className="h-4 w-4" /> Add Content Block
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function WidgetButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full group flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 border border-transparent hover:border-gray-200 dark:hover:border-zinc-600 transition-all hover:shadow-sm"
        >
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-gray-100 dark:ring-zinc-800 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{label}</span>
            <Plus className="h-3 w-3 ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
