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
    xhsPosts: SocialPost[];
    igReels: SocialPost[];
}

export const ReviewsTab = ({
    googleStats,
    tripAdvisorStats,
    googleReviews,
    xhsPosts,
    igReels
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

            {/* Section 2: XiaoHongShu */}
            <section>
                <SocialMediaGrid posts={xhsPosts} type="xhs" />
            </section>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Section 3: IG Reels */}
            <section>
                <SocialMediaGrid posts={igReels} type="ig" />
            </section>
        </div>
    );
};
