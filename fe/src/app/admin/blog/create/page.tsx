"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Trash2, Layout, Upload, Languages } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BlogContentEditor } from "@/components/admin/BlogContentEditor";
import { ContentBlock } from "@/types/blog";
import { LOCALES, LOCALE_LABEL, LOCALE_NAME, isLocale, type Locale } from "@/lib/i18n";

interface Location {
    id: string;
    name: string;
}

interface SourcePost {
    id: string;
    title: string;
    locale?: string | null;
    translationGroupId?: string | null;
    featureImage?: string | null;
    contentBlocks?: Array<Record<string, unknown>>;
    translations?: Array<{ id: string; locale: string; slug: string; status: string }>;
}

/** Same mapping as the edit page, so every block type (restaurant, location, image, cta) carries over. */
function toEditorBlocks(blocks: SourcePost["contentBlocks"]): ContentBlock[] {
    return (blocks ?? []).map((block) => {
        let type = block.blockType as ContentBlock["blockType"];
        if (block.restaurantId && !block.content && block.blockType === "paragraph") type = "restaurant";
        if (block.locationId && !block.content && block.blockType === "paragraph") type = "location";
        return {
            blockType: type,
            content: (block.content as string) || "",
            locationId: (block.locationId as string) || undefined,
            restaurantId: (block.restaurantId as string) || undefined,
            imageSize: (block.imageSize as ContentBlock["imageSize"]) || undefined,
        };
    });
}

const NON_LATIN = /[^\x00-\x7F]/;

export default function CreateBlogPostPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            }
        >
            <CreateBlogPostForm />
        </Suspense>
    );
}

function CreateBlogPostForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const translationOf = searchParams.get("translationOf");
    const localeParam = searchParams.get("locale");
    const requestedLocale: Locale | null = isLocale(localeParam) ? localeParam : null;
    const isTranslation = Boolean(translationOf && requestedLocale);

    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);

    const [locale, setLocale] = useState<Locale>(requestedLocale ?? "en");
    const [source, setSource] = useState<SourcePost | null>(null);
    const [sourceLoading, setSourceLoading] = useState(isTranslation);
    const [sourceError, setSourceError] = useState<string | null>(null);
    const [existingVersionId, setExistingVersionId] = useState<string | null>(null);
    const [slugTouched, setSlugTouched] = useState(false);

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const locRes = await fetch(`${API_BASE_URL}/locations`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const locData = await locRes.json();
                setLocations(Array.isArray(locData) ? locData : []);
            } catch (error) {
                console.error("Failed to fetch locations/restaurants", error);
            }
        };
        fetchData();
    }, []);

    // Translation mode: copy the cover image and every content block from the
    // source post. Title, slug and meta description stay empty for the translator.
    useEffect(() => {
        if (!isTranslation || !translationOf) return;
        const fetchSource = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/blog/posts/id/${translationOf}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) {
                    setSourceError(data.message || "Could not load the post to translate.");
                    return;
                }
                const post = data as SourcePost;
                setSource(post);
                const existing = post.translations?.find(t => t.locale === requestedLocale);
                if (existing) setExistingVersionId(existing.id);
                setFormData(prev => ({ ...prev, featureImage: post.featureImage || "" }));
                const blocks = toEditorBlocks(post.contentBlocks);
                if (blocks.length) setContentBlocks(blocks);
            } catch (error) {
                console.error("Failed to fetch source post", error);
                setSourceError("Could not load the post to translate.");
            } finally {
                setSourceLoading(false);
            }
        };
        fetchSource();
    }, [isTranslation, translationOf, requestedLocale]);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isTranslation && !source) {
            setToast({ message: sourceError || "The post to translate has not loaded yet.", type: "error" });
            return;
        }
        if (!formData.slug.trim() || NON_LATIN.test(formData.slug)) {
            setToast({ message: "Type a URL slug in Latin letters (pinyin for Chinese), e.g. klia2-bus-guide.", type: "error" });
            return;
        }

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
                    locale,
                    ...(isTranslation && source ? { translationGroupId: source.translationGroupId || source.id } : {}),
                    contentBlocks: contentBlocks.filter(block =>
                        block.content.trim() !== "" || block.locationId || block.restaurantId
                    )
                }),
            });

            if (res.ok) {
                setToast({ message: "Post created successfully!", type: "success" });
                setTimeout(() => router.push("/admin/blog"), 1500);
            } else {
                const data = await res.json().catch(() => ({}));
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
                setFormData(prev => ({ ...prev, featureImage: data.url }));
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

    if (sourceLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
        );
    }

    const slugNeedsLatin = formData.title.trim() !== "" && (formData.slug === "" || NON_LATIN.test(formData.slug));
    const sourceLocale: Locale = source && isLocale(source.locale) ? source.locale : "en";

    return (
        <div className="relative min-h-screen pb-24">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}


            <div className="flex flex-col items-center mb-12">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {isTranslation && requestedLocale ? `New ${LOCALE_LABEL[requestedLocale]} version` : "New Blog Post"}
                </h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {isTranslation && (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-300">
                        <div className="flex items-start gap-3">
                            <Languages className="h-5 w-5 mt-0.5 shrink-0" />
                            {sourceError ? (
                                <p>{sourceError} <Link href="/admin/blog" className="underline">Back to blog posts</Link></p>
                            ) : existingVersionId && requestedLocale ? (
                                <p>
                                    This post already has a {LOCALE_NAME[requestedLocale]} version.{" "}
                                    <Link href={`/admin/blog/${existingVersionId}/edit`} className="underline font-semibold">Edit it instead</Link>.
                                </p>
                            ) : source && requestedLocale ? (
                                <p>
                                    Translating <strong>{source.title}</strong> ({LOCALE_LABEL[sourceLocale]}) into {LOCALE_NAME[requestedLocale]}.
                                    The cover image and all content blocks are copied from the original. Overwrite the text in each heading,
                                    paragraph and CTA block; restaurant, location and image blocks carry over as they are. Write a new title,
                                    slug and meta description below.
                                </p>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Fundamental Settings */}
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-12">
                    <div className="rounded-3xl border border-gray-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Fundamental Settings</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Language</label>
                                    <select
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all disabled:opacity-70"
                                        value={locale}
                                        disabled={isTranslation}
                                        onChange={e => setLocale(e.target.value as Locale)}
                                    >
                                        {LOCALES.map(l => (
                                            <option key={l} value={l}>{LOCALE_NAME[l]}</option>
                                        ))}
                                    </select>
                                    {isTranslation ? (
                                        <p className="mt-1 text-[10px] text-gray-400">Fixed for this translation. It cannot be changed after the post is created.</p>
                                    ) : (
                                        <p className="mt-1 text-[10px] text-gray-400">A post&apos;s language cannot be changed after it is created. To translate an existing post, use &quot;Add BM / 中文 version&quot; on its edit page.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Navigation Title</label>
                                    <input
                                        type="text"
                                        required
                                        lang={locale}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        value={formData.title}
                                        onChange={e => setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: slugTouched ? formData.slug : generateSlug(e.target.value)
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
                                        onChange={e => {
                                            setSlugTouched(true);
                                            setFormData({ ...formData, slug: e.target.value });
                                        }}
                                        placeholder={locale === "zh" ? "pinyin-or-english-slug" : "url-friendly-name"}
                                    />
                                    {(locale === "zh" || slugNeedsLatin) && (
                                        <p className={`mt-1 text-[10px] ${slugNeedsLatin ? "text-amber-600 dark:text-amber-400 font-bold" : "text-gray-400"}`}>
                                            Chinese titles do not produce a URL slug. Type one in Latin letters or pinyin, e.g. klia2-jichang-bashi.
                                            The same slug may be reused across languages.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-widest">Search Meta Description</label>
                                        <textarea
                                            rows={3}
                                            lang={locale}
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
                                                        onChange={e => setFormData({ ...formData, status: e.target.value as "DRAFT" | "PUBLISHED" | "BIN" })}
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
                                            disabled={submitting || Boolean(existingVersionId) || Boolean(sourceError)}
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
                    <BlogContentEditor
                        contentBlocks={contentBlocks}
                        setContentBlocks={setContentBlocks}
                        locations={locations}
                    />

                </form>
            </div>
        </div>
    );
}
