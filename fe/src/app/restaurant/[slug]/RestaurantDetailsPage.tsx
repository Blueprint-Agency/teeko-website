"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Phone, Globe, Clock, Share2, Heart, ChevronRight, Utensils, Award, BookOpen, ExternalLink } from 'lucide-react';
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ReviewsTab } from "@/components/features/restaurant/ReviewsTab";
import { SocialsSection } from "@/components/features/restaurant/SocialsSection";
import { GoogleReview, SocialPost } from "@/components/features/restaurant/ReviewComponents";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ImageModal } from "@/components/shared/ImageModal";

const CONSTANT_XHS_POSTS: SocialPost[] = [
    {
        id: "x1",
        type: "xhs",
        thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
        title: " Hidden Gem in KL! Must try their unagi 🍱✨",
        author: "FoodieJane",
        likes: 1205,
        link: "#"
    },
    {
        id: "x2",
        type: "xhs",
        thumbnail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
        title: "Date night perfection ❤️ The ambience is 10/10",
        author: "KL_Diaries",
        likes: 892,
        link: "#"
    },
    {
        id: "x3",
        type: "xhs",
        thumbnail: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
        title: "Best Sashimi in town?? 🍣 Let's find out!",
        author: "SashimiLover",
        likes: 2340,
        link: "#"
    }
];

const CONSTANT_IG_REELS: SocialPost[] = [
    {
        id: "i1",
        type: "ig_reel",
        thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
        title: "POV: Fine dining at its best",
        author: "iketeru_kl",
        likes: 560,
        link: "https://www.instagram.com/reel/DS5VSfbErvV/?utm_source=ig_embed&amp;utm_campaign=loading"
    },
    {
        id: "i2",
        type: "ig_reel",
        thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
        title: "Chef's Special 🥢",
        author: "iketeru_kl",
        likes: 890,
        link: "https://www.instagram.com/reel/DTjuS7LknBd/?utm_source=ig_embed&amp;utm_campaign=loading"
    },
    {
        id: "i3",
        type: "ig_reel",
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
        title: "Weekend vibes 🥂",
        author: "visit_kl",
        likes: 120,
        link: "#"
    }
];

const CONSTANT_GOOGLE_REVIEWS: GoogleReview[] = [
    {
        id: "g1",
        authorName: "Sarah Chen",
        rating: 5,
        timeAgo: "2 weeks ago",
        text: "Absolutely the best Japanese fine dining in KL. The sashimi was incredibly fresh and the service was impeccable. Highly recommend the omakase set.",
        images: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80"]
    },
    {
        id: "g2",
        authorName: "David Miller",
        rating: 4,
        timeAgo: "1 month ago",
        text: "Great atmosphere and lovely garden view. Food was delicious but slightly on the pricey side. Good for special occasions.",
    },
    {
        id: "g3",
        authorName: "Ahmad Razak",
        rating: 5,
        timeAgo: "2 months ago",
        text: "Authentic experience. The teppanyaki was a show in itself! Will definitely come back.",
        images: []
    }
];

interface RestaurantDetailsPageProps {
    initialRestaurant: any;
    slug: string;
}

const RestaurantDetailsPage = ({ initialRestaurant, slug }: RestaurantDetailsPageProps) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [restaurant] = useState(initialRestaurant);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const imageUrls = restaurant?.restaurantImages?.map((img: any) => img.url) || [];

    const tabs = useMemo(() => {
        const availableTabs = [
            { id: 'overview', label: 'Overview', visible: true },
            { id: 'reviews', label: 'Reviews', visible: !!(restaurant?.googleReviews?.length || restaurant?.stats?.googleStats?.totalReviews || restaurant?.stats?.tripAdvisorStats?.totalReviews) },
            { id: 'socials', label: 'Socials', visible: !!(restaurant?.shortVideos?.length > 0) },
            { id: 'photos', label: 'Photos', visible: !!(restaurant?.restaurantImages?.length > 0) },
        ];
        return availableTabs.filter(tab => tab.visible);
    }, [restaurant]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-15% 0px -75% 0px',
            threshold: 0
        };

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        tabs.forEach((tab) => {
            const element = document.getElementById(tab.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            tabs.forEach((tab) => {
                const element = document.getElementById(tab.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [tabs]);

    const openImage = (index: number) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-12">
            <Navigation forceSolid />

            <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <Breadcrumbs
                    items={[
                        { label: "Restaurants", href: "/restaurants" },
                        { label: restaurant?.name || "Restaurant" }
                    ]}
                />

                {/* Hero Images Grid (TripAdvisor style) - Horizontal scroll on mobile */}
                <div className="mb-8 -mx-4 sm:mx-0">
                    <div className="flex sm:grid sm:grid-cols-4 gap-2 h-[300px] sm:h-96 overflow-x-auto sm:overflow-hidden snap-x snap-mandatory scrollbar-hide">
                        {restaurant?.restaurantImages?.slice(0, 4).map((img: any, idx: number) => (
                            <div
                                key={img.id || idx}
                                className={`relative min-w-[85vw] sm:min-w-0 h-full snap-center cursor-pointer overflow-hidden ${idx === 0 ? 'sm:col-span-2 sm:row-span-2' : 'sm:col-span-1'
                                    }`}
                                onClick={() => openImage(idx)}
                            >
                                <img
                                    src={img.url}
                                    alt={`${restaurant.name} ${idx + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mb-20">
                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header Info */}
                            <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{restaurant?.name}</h1>
                                    {/* <div className="flex gap-2">
                                        <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all">
                                            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-600" />
                                        </button>
                                        <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all">
                                            <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-600" />
                                        </button>
                                    </div> */}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm mb-6">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex text-red-500">
                                            {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-5 h-5 ${star <= Math.floor(((restaurant?.stats?.googleStats?.rating || 0) + (restaurant?.stats?.tripAdvisorStats?.rating || 0)) / 2 || 0) ? 'fill-current' : 'text-gray-300'}`} />)}
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{((restaurant?.stats?.googleStats?.rating || 0) + (restaurant?.stats?.tripAdvisorStats?.rating || 0)) / 2}</span>
                                        <span className="text-gray-500 dark:text-gray-400 underline cursor-pointer">{(restaurant?.stats?.googleStats?.totalReviews || 0) + (restaurant?.stats?.tripAdvisorStats?.totalReviews || 0)} reviews</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                        <Utensils className="w-4 h-4" />
                                        <span>{restaurant?.cuisine}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{restaurant?.priceRange}</span>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant?.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {restaurant?.isOpen ? 'Open Now' : 'Closed'}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span className="text-base">{restaurant?.address}</span>
                                    </div>
                                    <button
                                        onClick={() => window.open(restaurant?.reservationUrl, "_blank")}
                                        className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Reserve a Table
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-6 border-b border-[var(--border)] mb-8 overflow-x-auto sticky top-14 bg-[var(--background)]/95 backdrop-blur-md z-30 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 shadow-sm scrollbar-hide">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            const element = document.getElementById(tab.id);
                                            if (element) {
                                                const offset = 120; // Adjusted offset for better visibility
                                                const bodyRect = document.body.getBoundingClientRect().top;
                                                const elementRect = element.getBoundingClientRect().top;
                                                const elementPosition = elementRect - bodyRect;
                                                const offsetPosition = elementPosition - offset;

                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className={`pb-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Sections */}
                            <div className="space-y-16">

                                {/* Overview Section */}
                                <div id="overview" className="scroll-mt-48 space-y-10">
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{restaurant?.description}</p>
                                    </section>

                                    {restaurant?.feature?.length > 0 && <section>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features & Amenities</h2>
                                        <div className="grid grid-cols-2 gap-y-3">
                                            {restaurant?.feature?.map((feature: any) => (
                                                <div key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                                    <Award className="w-5 h-5 text-red-500" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </section>}
                                </div>



                                {/* Reviews Section */}
                                {(restaurant?.googleReviews?.length > 0 || restaurant?.stats?.googleStats?.totalReviews > 0 || restaurant?.stats?.tripAdvisorStats?.totalReviews > 0) && (
                                    <div id="reviews" className="scroll-mt-48">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews</h2>
                                        <ReviewsTab
                                            googleStats={restaurant?.stats?.googleStats}
                                            tripAdvisorStats={restaurant?.stats?.tripAdvisorStats}
                                            googleReviews={restaurant?.googleReviews}
                                        />
                                    </div>
                                )}

                                {/* Socials Section */}
                                {restaurant?.shortVideos?.length > 0 && <div id="socials" className="scroll-mt-48">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Socials Feed</h2>
                                    <SocialsSection
                                        shortVideos={restaurant?.shortVideos}
                                    />
                                </div>}

                                {/* Photos Section */}
                                {restaurant?.restaurantImages?.length > 0 && (
                                    <div id="photos" className="scroll-mt-48">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Photos</h2>
                                        <div className="flex sm:grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
                                            {restaurant?.restaurantImages?.map((img: any, idx: number) => (
                                                <div
                                                    key={img.id || idx}
                                                    className="min-w-[60vw] sm:min-w-0 aspect-square bg-[var(--background-alt)] rounded-xl overflow-hidden cursor-pointer group snap-center"
                                                    onClick={() => openImage(idx)}
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Sticky Sidebar */}
                        <div className="w-full lg:w-80 shrink-0 space-y-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location & Contact</h3>

                                {/* Map Placeholder */}
                                {/* <div className="h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,14,0/600x400?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale opacity-60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                    </div>
                                </div> */}

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{restaurant?.address}</p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant?.address || '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-red-600 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                View on Google Map
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-200">
                                        <BookOpen className="w-4 h-4" />
                                        View Menu
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{restaurant?.contactInfo?.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <a href={restaurant?.contactInfo?.website} target="_blank" className="text-red-600 text-sm font-medium hover:underline">Visit Website</a>
                                    </div>
                                </div>

                                <hr className="border-gray-100 dark:border-gray-700 my-4" />

                                {restaurant?.operatingHours?.length > 0 && <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-red-500" /> Opening Hours
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        {restaurant?.operatingHours?.map((h: any, i: any) => (
                                            <div key={i} className="flex justify-between">
                                                <span className="text-gray-500 dark:text-gray-400 w-20">{h.day}</span>
                                                <span className="text-gray-900 dark:text-gray-200 font-medium">{h.time || h.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <ImageModal
                images={imageUrls}
                initialIndex={selectedImageIndex}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default RestaurantDetailsPage;
