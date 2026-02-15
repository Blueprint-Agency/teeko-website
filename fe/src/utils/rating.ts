export interface RatingStats {
    rating: number;
    totalReviews: number;
}

/**
 * Calculates a combined rating from Google and TripAdvisor stats.
 * If both exist and are greater than 0, it returns the average.
 * If only one exists (> 0), it returns that one.
 * Otherwise, returns 0.
 */
export const calculateCombinedRating = (
    googleStats?: RatingStats,
    tripAdvisorStats?: RatingStats
) => {
    const googleRating = googleStats?.rating || 0;
    const tripAdvisorRating = tripAdvisorStats?.rating || 0;

    if (googleRating > 0 && tripAdvisorRating > 0) {
        return (googleRating + tripAdvisorRating) / 2;
    }
    if (googleRating > 0) return googleRating;
    if (tripAdvisorRating > 0) return tripAdvisorRating;
    return 0;
};

/**
 * Calculates the total number of reviews from Google and TripAdvisor stats.
 */
export const calculateCombinedReviewCount = (
    googleStats?: { totalReviews: number },
    tripAdvisorStats?: { totalReviews: number }
) => {
    return (googleStats?.totalReviews || 0) + (tripAdvisorStats?.totalReviews || 0);
};
