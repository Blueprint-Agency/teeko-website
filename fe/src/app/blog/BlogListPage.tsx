"use client";

import { Loader2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    metaDescription: string | null;
    featureImage: string | null;
    publishedAt: string;
}

interface BlogListPageProps {
    initialPosts: BlogPost[];
}

export default function BlogListPage({ initialPosts }: BlogListPageProps) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
                <Breadcrumbs items={[{ label: "Blog" }]} />

                <div className="page-header">
                    <h1 className="page-title">
                        Our Blog
                    </h1>
                    <p className="text-xl text-muted">
                        Discover travel tips, destination guides, and insider insights
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-8">
                    {initialPosts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    {post.featureImage && (
                                        <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950">
                                            <img
                                                src={post.featureImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 md:p-8 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.metaDescription && (
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                {post.metaDescription}
                                            </p>
                                        )}
                                        <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
                                            Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {initialPosts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No blog posts published yet. Check back soon!
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

