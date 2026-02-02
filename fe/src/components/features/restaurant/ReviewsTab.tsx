import React from 'react';
import {
    ReviewStats,
    GoogleReview,
    SocialPost,
    ReviewStatsCard,
    GoogleReviewsList,
    SocialMediaGrid
} from './ReviewComponents';

interface ReviewsTabProps {
    googleStats: ReviewStats;
    tripAdvisorStats: ReviewStats;
    googleReviews: GoogleReview[];
    shortVideos: SocialPost[];
}

export const ReviewsTab = ({
    googleStats,
    tripAdvisorStats,
    googleReviews,
    shortVideos
}: ReviewsTabProps) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Review Stats & Google Reviews */}
            <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ReviewStatsCard stats={googleStats} />
                    <ReviewStatsCard stats={tripAdvisorStats} />
                </div>

                <div className="pt-4">
                    <GoogleReviewsList reviews={googleReviews} />
                </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Section 2: Trending Short Videos Grouped by Source */}
            <section className="space-y-12">
                {Object.entries(
                    (shortVideos || []).reduce((acc: Record<string, SocialPost[]>, post) => {
                        let sourceKey = post.source || post.type || 'YouTube';
                        // Normalize source names for grouping
                        if (sourceKey === 'ig_reel') sourceKey = 'Instagram';
                        if (sourceKey === 'xhs') sourceKey = 'XiaoHongShu';
                        if (sourceKey.toLowerCase() === 'xhs') sourceKey = 'XiaoHongShu';

                        // Capitalize for display
                        const displaySource = sourceKey.charAt(0).toUpperCase() + sourceKey.slice(1);

                        if (!acc[displaySource]) acc[displaySource] = [];
                        acc[displaySource].push(post);
                        return acc;
                    }, {})
                ).map(([source, posts]) => (
                    <SocialMediaGrid
                        key={source}
                        posts={posts}
                        title={`Trending on ${source}`}
                    />
                ))}
            </section>
        </div>
    );
};

