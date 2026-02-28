import { Metadata } from "next";
import { API_BASE_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, MapPin, Utensils, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { LocationCarousel } from "@/components/blog/LocationCarousel";
import { calculateCombinedRating } from "@/utils/rating";
import { formatBlogDateGMT8 } from "@/lib/dateUtils";

interface ContentBlock {
    id: string;
    blockType: "h2" | "h3" | "h4" | "paragraph" | "location" | "restaurant";
    content: string;
    orderIndex: string;
    locationId?: string;
    restaurantId?: string;
    linkedEntity?: any;
    suggestions?: any[];
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

        const blockContent = (() => {
            switch (block.blockType) {
                case "h2":
                    return (
                        <h2 key={block.id} className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6">
                            {block.content}
                        </h2>
                    );
                case "h3":
                    return (
                        <h3 key={block.id} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                            {block.content}
                        </h3>
                    );
                case "h4":
                    return (
                        <h4 key={block.id} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                            {block.content}
                        </h4>
                    );
                case "paragraph":
                    return (
                        <div
                            key={block.id}
                            className={`${baseClasses} text-lg leading-relaxed mb-6 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-5`}
                            dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                    );
                default:
                    return null;
            }
        })();

        return (
            <div key={block.id}>
                {blockContent}

                {/* Linked Restaurant Recommendation */}
                {block.restaurantId && block.linkedEntity && (
                    <div className="mt-4 mb-10 bg-gradient-to-br from-red-50 to-orange-50 dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-3xl p-1 shadow-lg border border-red-100 dark:border-zinc-700">
                        <div className="bg-white dark:bg-zinc-900 rounded-[22px] overflow-hidden">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                                    <img
                                        src={block.linkedEntity.images?.[0]?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"}
                                        alt={block.linkedEntity.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Editor's Pick</span>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white">
                                                {calculateCombinedRating(block.linkedEntity.stats?.googleStats, block.linkedEntity.stats?.tripAdvisorStats).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{block.linkedEntity.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{block.linkedEntity.description}</p>
                                    <div className="flex flex-col gap-2 mb-6 text-sm text-gray-500">
                                        <div className="flex items-start">
                                            <Utensils className="h-4 w-4 mr-2 text-red-500 mt-0.5 shrink-0" />
                                            {block.linkedEntity.cuisine}
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 shrink-0" />
                                            {block.linkedEntity.address}
                                        </div>
                                    </div>
                                    <Link href={`/restaurant/${block.linkedEntity.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95">
                                        View Details & Reserve <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Location Suggestions (Top Places) */}
                {block.locationId && block.suggestions && block.suggestions.length > 0 && (
                    <LocationCarousel
                        restaurants={block.suggestions}
                        locationName={block.linkedEntity?.name || "this area"}
                        locationId={block.locationId}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />
            <main className="max-w-container mx-auto px-4 py-12 pt-20">
                <Breadcrumbs
                    items={[
                        { label: "Blog", href: "/blog" },
                        { label: post.title }
                    ]}
                />

                <article className="max-w-5xl mx-auto">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                Travel Guide
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <Calendar className="h-4 w-4" />
                            {formatBlogDateGMT8(post.publishedAt)}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                    </div>

                    {post.featureImage && (
                        <div className="aspect-[21/10] rounded-3xl overflow-hidden bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 mb-12 shadow-2xl relative">
                            <img
                                src={post.featureImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="md:px-4">
                            {post.contentBlocks && post.contentBlocks.length > 0 ? (
                                post.contentBlocks.map(block => renderBlock(block))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No content available.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-20 p-10 bg-gray-50 dark:bg-zinc-800/30 rounded-3xl flex flex-col items-center text-center border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-2xl font-bold mb-4">Enjoyed this guide?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">Discover more amazing spots and secret local favorites in our curated travel collections.</p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl transition-all hover:scale-105"
                        >
                            <ArrowLeft className="h-4 w-4" /> Explore More Guides
                        </Link>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
