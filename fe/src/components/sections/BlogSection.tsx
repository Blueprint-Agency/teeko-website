import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatBlogDateGMT8 } from "@/lib/dateUtils";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    metaDescription: string | null;
    featureImage: string | null;
    publishedAt: string;
}

interface BlogSectionProps {
    posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
    if (posts.length === 0) return null;

    return (
        <section className="bg-[var(--background-accent)] py-12 sm:py-16 lg:py-20 overflow-hidden">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="section-header">
                    <h2 className="section-title">
                        Explore Blogs
                    </h2>
                    <p className="section-description">
                        Insights, guides, and stories from the world of travel
                    </p>
                </div>

                <div className="flex -mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:pb-0 sm:px-0 sm:mx-0">
                    {posts.slice(0, 4).map((post) => (
                        <div key={post.id} className="min-w-[280px] sm:min-w-0 snap-center">
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group block h-full"
                            >
                                <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                    {post.featureImage && (
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={post.featureImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <Calendar className="h-4 w-4" />
                                            {formatBlogDateGMT8(post.publishedAt)}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        {post.metaDescription && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                {post.metaDescription}
                                            </p>
                                        )}
                                        <div className="mt-auto flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
                                            Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-sm shadow-red-600/20"
                    >
                        Visit Our Blog
                    </Link>
                </div>
            </div>
        </section>
    );
}

