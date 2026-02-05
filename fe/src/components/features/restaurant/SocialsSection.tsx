import React from 'react';
import { SocialPost, SocialMediaGrid } from './ReviewComponents';

interface SocialsSectionProps {
    shortVideos: SocialPost[];
}

export const SocialsSection = ({ shortVideos }: SocialsSectionProps) => {
    return (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    );
};
