"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Loader2, Trash2, Archive } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Toast, ToastType } from "@/components/ui/Toast";
import Link from "next/link";
import { formatDateGMT8 } from "@/lib/dateUtils";
import { LOCALES, LOCALE_LABEL, isLocale, type Locale } from "@/lib/i18n";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "BIN";
    locale?: string | null;
    translationGroupId?: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

const postLocale = (post: BlogPost): Locale => (isLocale(post.locale) ? post.locale : "en");
const groupKey = (post: BlogPost) => post.translationGroupId || post.id;

const STATUS_BADGE: Record<BlogPost["status"], string> = {
    PUBLISHED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    DRAFT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    BIN: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "BIN">("ALL");
    const [languageFilter, setLanguageFilter] = useState<"ALL" | Locale>("ALL");
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/blog/posts/all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleMoveToBin = async (id: string) => {
        if (!confirm("Move this post to bin?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/blog/posts/${id}/bin`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchPosts();
                setToast({ message: "Post moved to bin!", type: "success" });
            } else {
                setToast({ message: "Failed to move post", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Permanently delete this post? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchPosts();
                setToast({ message: "Post deleted permanently!", type: "success" });
            } else {
                setToast({ message: "Failed to delete post", type: "error" });
            }
        } catch (error) {
            console.error(error);
            setToast({ message: "An error occurred", type: "error" });
        }
    };

    // Versions of one piece share a translationGroupId. Group them so each piece
    // reads as one block (EN, then BM, then 中文), ordered by the newest post in
    // the group, which is the order the API returns.
    const groups = new Map<string, BlogPost[]>();
    for (const post of posts) {
        const key = groupKey(post);
        groups.set(key, [...(groups.get(key) ?? []), post]);
    }
    for (const versions of groups.values()) {
        versions.sort((a, b) => LOCALES.indexOf(postLocale(a)) - LOCALES.indexOf(postLocale(b)));
    }

    const filteredPosts = [...groups.values()].flatMap(versions => versions.filter(post =>
        (filter === "ALL" || post.status === filter) &&
        (languageFilter === "ALL" || postLocale(post) === languageFilter)
    ));

    return (
        <div className="space-y-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your blog content</p>
                </div>
                <Link href="/admin/blog/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Post
                    </Button>
                </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(["ALL", "DRAFT", "PUBLISHED", "BIN"] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filter === status
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mt-4">
                {(["ALL", ...LOCALES] as const).map(locale => (
                    <button
                        key={locale}
                        onClick={() => setLanguageFilter(locale)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${languageFilter === locale
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {locale === "ALL" ? "All languages" : LOCALE_LABEL[locale]}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Language</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Other versions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Published</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                                {filteredPosts.map((post, index) => {
                                    const versions = groups.get(groupKey(post)) ?? [post];
                                    const locale = postLocale(post);
                                    const startsGroup = index === 0 || groupKey(filteredPosts[index - 1]) !== groupKey(post);
                                    // New translations copy the English version when there is one.
                                    const source = versions.find(v => postLocale(v) === "en") ?? post;
                                    return (
                                    <tr key={post.id} className={startsGroup ? "" : "bg-gray-50/60 dark:bg-zinc-900/60"}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {startsGroup ? post.title : (
                                                <span className="block pl-4 text-gray-700 dark:text-gray-300">
                                                    <span className="text-gray-400 mr-1" aria-hidden>↳</span>{post.title}
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className="inline-flex rounded-md border border-gray-200 dark:border-zinc-700 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                {LOCALE_LABEL[locale]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <div className="flex flex-wrap gap-1">
                                                {LOCALES.filter(l => l !== locale).map(l => {
                                                    const version = versions.find(v => postLocale(v) === l);
                                                    if (version) {
                                                        return (
                                                            <Link
                                                                key={l}
                                                                href={`/admin/blog/${version.id}/edit`}
                                                                className={`inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap hover:underline ${STATUS_BADGE[version.status]}`}
                                                            >
                                                                {LOCALE_LABEL[l]}: {version.status.toLowerCase()}
                                                            </Link>
                                                        );
                                                    }
                                                    return (
                                                        <Link
                                                            key={l}
                                                            href={`/admin/blog/create?translationOf=${source.id}&locale=${l}`}
                                                            title={`Add ${LOCALE_LABEL[l]} version`}
                                                            className="inline-flex rounded-full border border-dashed border-gray-300 dark:border-zinc-600 px-2 py-0.5 font-semibold whitespace-nowrap text-gray-500 hover:text-red-600 hover:border-red-400"
                                                        >
                                                            {LOCALE_LABEL[l]}: missing +
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_BADGE[post.status]}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {post.publishedAt ? formatDateGMT8(post.publishedAt) : "—"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                                            <Link
                                                href={`/admin/blog/${post.id}/edit`}
                                                className="text-primary hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                            >
                                                <Edit2 className="h-4 w-4 mr-1" /> Edit
                                            </Link>
                                            {post.status !== "BIN" && (
                                                <button
                                                    onClick={() => handleMoveToBin(post.id)}
                                                    className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 inline-flex items-center"
                                                >
                                                    <Archive className="h-4 w-4 mr-1" /> Bin
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400 inline-flex items-center"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                                {filteredPosts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No posts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                </>
            )}
        </div>
    );
}

