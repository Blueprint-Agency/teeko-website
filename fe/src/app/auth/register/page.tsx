"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // TODO: Implement registration logic
        console.log("Register:", formData);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen relative bg-white dark:bg-zinc-950 flex flex-col overflow-hidden text-gray-900 dark:text-gray-100">
            <Navigation forceSolid />

            {/* Background Aesthetic Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 dark:bg-orange-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-12 relative z-10">
                <div className="w-full max-w-[420px] mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 mb-4 overflow-hidden border border-gray-100 dark:border-zinc-800">
                            <img
                                src="/teeko-icon.png"
                                alt="Teeko"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium">
                            Join Teeko to discover amazing places
                        </p>
                    </div>

                    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white dark:border-zinc-800 shadow-black/5">
                        {error && (
                            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-shake">
                                <span className="w-1 h-1 rounded-full bg-red-600 mt-1.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password Fields Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="w-full pl-11 pr-11 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                        Confirm
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="w-full pl-11 pr-11 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 ml-1">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 mt-0.5 accent-red-600 rounded border-gray-300 dark:border-zinc-800 transition-all cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-xs font-medium text-gray-600 dark:text-zinc-400 cursor-pointer select-none">
                                    I agree to the <Link href="/terms" className="text-red-600 font-bold hover:underline">Terms</Link> and <Link href="/privacy" className="text-red-600 font-bold hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-white dark:bg-zinc-900 px-3 text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] leading-none">Already have one?</span>
                            </div>
                        </div>

                        <Link
                            href="/auth/login"
                            className="mt-5 w-full py-3 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

