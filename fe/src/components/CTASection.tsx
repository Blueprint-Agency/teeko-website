"use client";

import { useState } from "react";
import Image from "next/image";

export function CTASection() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle email subscription
        console.log("Subscribing:", email);
        setEmail("");
    };

    return (
        <section className="bg-gray-900 dark:bg-black py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                Never Miss a<br />
                                <span className="text-primary-200">New Discovery</span>
                            </h2>
                            <p className="text-lg text-white/80 mb-8 max-w-md">
                                Subscribe to our newsletter and be the first to know about
                                amazing new places, exclusive tips, and insider guides.
                            </p>

                            {/* Email Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-primary-50 transition-colors shadow-lg"
                                >
                                    Subscribe
                                </button>
                            </form>

                            <p className="text-sm text-white/60 mt-4">
                                Join 10,000+ explorers. Unsubscribe anytime.
                            </p>
                        </div>

                        {/* Image Decoration */}
                        <div className="hidden lg:block relative">
                            <div className="relative w-full h-80">
                                <div className="absolute top-0 right-0 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl transform rotate-6">
                                    <Image
                                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80"
                                        alt="Discover places"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 w-56 h-56 rounded-2xl overflow-hidden shadow-2xl transform -rotate-3">
                                    <Image
                                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
                                        alt="Explore destinations"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80"
                                        alt="Find places"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
