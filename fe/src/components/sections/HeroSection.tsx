"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const heroImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80",
];

export function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden">
            {/* Background Images */}
            {heroImages.map((image, index) => (
                <div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url('${image}')`,
                        opacity: currentImageIndex === index ? 1 : 0,
                    }}
                />
            ))}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Travel Malaysia <span className="text-primary-400 italic">Easy</span> with Teeko
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
                    Discover amazing places across Malaysia, curated just for you
                </p>

                {/* CTA Button */}
                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => router.push('/sim')}
                        className="group relative px-8 py-5 bg-primary-500 hover:bg-primary-600 text-white text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-primary-500/40"
                    >
                        {/* Glowing effect base */}
                        <div className="absolute -inset-1 bg-primary-400 rounded-full opacity-20 blur-lg group-hover:opacity-50 transition-opacity animate-pulse" />

                        <span className="relative flex items-center gap-3">
                            Get limited free travel SIM now
                        </span>
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-12">
                    <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5">20+</div>
                        <div className="text-[10px] sm:text-xs text-white/70">Places</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5">50K+</div>
                        <div className="text-[10px] sm:text-xs text-white/70">Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5">4.8</div>
                        <div className="text-[10px] sm:text-xs text-white/70">Avg Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5">3</div>
                        <div className="text-[10px] sm:text-xs text-white/70">Cities</div>
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                                ? "w-6 bg-primary-500"
                                : "bg-white/50 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

