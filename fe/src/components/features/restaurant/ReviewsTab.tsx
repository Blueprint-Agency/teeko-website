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
}

export const ReviewsTab = ({
    googleStats,
    tripAdvisorStats,
    googleReviews,
}: ReviewsTabProps) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Review Stats & Google Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewStatsCard stats={googleStats} source={'google'} />
                <ReviewStatsCard stats={tripAdvisorStats} source={'tripadvisor'} />
            </div>

            {googleReviews.length > 0 && <div className="pt-4">
                <GoogleReviewsList reviews={googleReviews} stats={googleStats} />
            </div>}
        </div>
    );
};

