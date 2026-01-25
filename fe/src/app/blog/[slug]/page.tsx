import { Metadata } from "next";
import { API_BASE_URL } from "@/utils/constants";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface ContentBlock {
    id: string;
    blockType: "h2" | "h3" | "h4" | "paragraph";
    content: string;
    orderIndex: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    metaDescription: string | null;
    featureImage: string | null;
    publishedAt: string;
    contentBlocks: ContentBlock[];
}

async function getPost(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/blog/posts/slug/${slug}`, {
            cache: "no-store"
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.metaDescription || `Read ${post.title} on our blog`,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const renderBlock = (block: ContentBlock) => {
        const baseClasses = "text-gray-800 dark:text-gray-200";

        switch (block.blockType) {
            case "h2":
                return (
                    <h2 key={block.id} className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                        {block.content}
                    </h2>
                );
            case "h3":
                return (
                    <h3 key={block.id} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                        {block.content}
                    </h3>
                );
            case "h4":
                return (
                    <h4 key={block.id} className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                        {block.content}
                    </h4>
                );
            case "paragraph":
                return (
                    <p key={block.id} className={`${baseClasses} leading-relaxed mb-4 whitespace-pre-line`}>
                        {block.content}
                    </p>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
            <Navigation forceSolid />
            <div className="container mx-auto px-4 py-16 pt-24">
                <Link href="/blog" className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to all posts
                </Link>

                <article className="max-w-4xl mx-auto">
                    {post.featureImage && (
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 mb-8 shadow-xl">
                            <img
                                src={post.featureImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            {post.title}
                        </h1>
                        {post.metaDescription && (
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                {post.metaDescription}
                            </p>
                        )}
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-lg">
                            {post.contentBlocks && post.contentBlocks.length > 0 ? (
                                post.contentBlocks.map(block => renderBlock(block))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No content available.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-red-600 dark:text-red-400 hover:underline font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> View all posts
                        </Link>
                    </div>
                </article>
            </div>
            <Footer />
        </div>
    );
}
