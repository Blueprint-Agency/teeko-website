"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ContentBlock {
    blockType: "h2" | "h3" | "h4" | "paragraph";
    content: string;
}

export default function CreateBlogPostPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        metaDescription: "",
        featureImage: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED",
    });

    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
        { blockType: "paragraph", content: "" }
    ]);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const addBlock = (type: ContentBlock["blockType"]) => {
        setContentBlocks([...contentBlocks, { blockType: type, content: "" }]);
    };

    const updateBlock = (index: number, content: string) => {
        const updated = [...contentBlocks];
        updated[index].content = content;
        setContentBlocks(updated);
    };

    const removeBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === contentBlocks.length - 1)
        ) return;

        const updated = [...contentBlocks];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setContentBlocks(updated);
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
                    contentBlocks: contentBlocks.filter(block => block.content.trim() !== "")
                }),
            });

            if (res.ok) {
                setToast({ message: "Post created successfully!", type: "success" });
                setTimeout(() => router.push("/admin/blog"), 1500);
            } else {
                setToast({ message: "Failed to create post", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

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
                <Link href="/admin/blog">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Blog Post</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Write a new blog post</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Title *</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({
                                    ...formData,
                                    title: e.target.value,
                                    slug: generateSlug(e.target.value)
                                })}
                                placeholder="Enter post title"
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
                                placeholder="post-url-slug"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium dark:text-gray-300">Meta Description</label>
                            <textarea
                                rows={2}
                                className="mt-1 block w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                value={formData.metaDescription}
                                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                placeholder="SEO meta description..."
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
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold dark:text-white">Content Blocks</h2>
                        <div className="flex gap-2">
                            <Button type="button" size="sm" variant="ghost" onClick={() => addBlock("h2")}>+ H2</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => addBlock("h3")}>+ H3</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => addBlock("h4")}>+ H4</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => addBlock("paragraph")}>+ Paragraph</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {contentBlocks.map((block, index) => (
                            <div key={index} className="flex gap-2 items-start border border-gray-200 dark:border-zinc-700 rounded-md p-3">
                                <div className="flex flex-col gap-1 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, "up")}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    >
                                        ▲
                                    </button>
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, "down")}
                                        disabled={index === contentBlocks.length - 1}
                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    >
                                        ▼
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                            {block.blockType}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeBlock(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {block.blockType === "paragraph" ? (
                                        <textarea
                                            rows={3}
                                            className="w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            value={block.content}
                                            onChange={e => updateBlock(index, e.target.value)}
                                            placeholder="Enter paragraph content..."
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-gray-200 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                            value={block.content}
                                            onChange={e => updateBlock(index, e.target.value)}
                                            placeholder={`Enter ${block.blockType.toUpperCase()} heading...`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="DRAFT"
                                checked={formData.status === "DRAFT"}
                                onChange={e => setFormData({ ...formData, status: "DRAFT" })}
                                className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm font-medium dark:text-gray-300">Save as Draft</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="PUBLISHED"
                                checked={formData.status === "PUBLISHED"}
                                onChange={e => setFormData({ ...formData, status: "PUBLISHED" })}
                                className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm font-medium dark:text-gray-300">Publish Now</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/blog">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create Post
                    </Button>
                </div>
            </form>
        </div>
    );
}

