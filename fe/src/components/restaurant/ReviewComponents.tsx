import React from 'react';
import { Star, MapPin, ExternalLink, ThumbsUp, MessageCircle, Play } from 'lucide-react';

// --- Types ---
export interface ReviewStats {
    source: 'Google' | 'TripAdvisor';
    rating: number;
    totalReviews: number;
    link: string;
}

export interface GoogleReview {
    id: string;
    authorName: string;
    authorImage?: string;
    rating: number;
    timeAgo: string;
    text: string;
    images?: string[];
}

export interface SocialPost {
    id: string;
    thumbnail: string;
    title?: string;
    author?: string;
    likes?: number;
    link: string;
    type: 'xhs' | 'ig_reel';
}

// --- Components ---

export const ReviewStatsCard = ({ stats }: { stats: ReviewStats }) => {
    if (!stats) return null;
    const isGoogle = stats.source?.toLowerCase() === 'google';

    return (
        <a
            href={stats.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900 transition-all cursor-pointer h-full"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    {/* Simplified logo placeholders */}
                    {isGoogle ? (
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                            <span className="font-bold text-blue-500 text-lg">G</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[#00AF87] flex items-center justify-center">
                            <span className="font-bold text-white text-lg">TA</span>
                        </div>
                    )}
                    <span className="font-bold text-gray-900 dark:text-white text-lg">{stats.source}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>

            <div className="mt-auto">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.rating?.toFixed(1) || '0.0'}</span>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${star <= Math.round(stats.rating || 0) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{(stats.totalReviews || 0).toLocaleString()} reviews</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export const GoogleReviewsList = ({ reviews }: { reviews: GoogleReview[] }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                Latest from Google
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
            </h3>
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                {review.authorImage ? (
                                    <img src={review.authorImage} alt={review.authorName} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                                        {review.authorName.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">{review.authorName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{review.timeAgo}</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                            {review.text}
                        </p>
                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {review.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="Review" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button className="w-full py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                View more on Google
            </button>
        </div>
    );
};

// Simple heart icon for the overlay
const HeartIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const SocialCard = ({ post }: { post: SocialPost }) => {
    const isXHS = post.type === 'xhs';
    return (
        <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer block"
        >
            <img
                src={post.thumbnail}
                alt={post.title || "Social Media Post"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                    {isXHS ? (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                            XHS
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-2 py-0.5 rounded shadow-sm">
                            REELS
                        </span>
                    )}
                </div>
                {post.title && (
                    <p className="font-bold text-sm line-clamp-2 mb-2 text-white/95 leading-snug">
                        {post.title}
                    </p>
                )}
                <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-medium">@{post.author}</span>
                    {post.likes !== undefined && (
                        <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                            <HeartIcon className="w-3 h-3 text-red-500" />
                            <span>{post.likes}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Play Button Overlay for Reels */}
            {!isXHS && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                        <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                </div>
            )}
        </a>
    );
};

export const SocialMediaGrid = ({ posts, type }: { posts: SocialPost[], type: 'xhs' | 'ig' }) => {
    const isXHS = type === 'xhs';
    const title = isXHS ? "Trending on XiaoHongShu" : "Instagram Reels";

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                {title}
                {!isXHS && <Play className="w-4 h-4 text-gray-400" />}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <SocialCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};


