import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

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
        <section className="bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore Blogs
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Insights, guides, and stories from the world of travel
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.slice(0, 4).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group h-full"
                        >
                            <article className="h-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-300 hover:-translate-y-1 flex flex-col">
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
                                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
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
