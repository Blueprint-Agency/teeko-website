"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login");
            }

            // Save token and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
                <div className="w-full max-w-[400px] mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 mb-4 overflow-hidden border border-gray-100 dark:border-zinc-800">
                            <img
                                src="/teeko-icon.png"
                                alt="Teeko"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium">
                            Continue your journey with Teeko
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
                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors uppercase"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 dark:focus:border-red-600 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 ml-1">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 accent-red-600 rounded border-gray-300 dark:border-zinc-800 transition-all cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs font-semibold text-gray-600 dark:text-zinc-400 cursor-pointer select-none">
                                    Remember me
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
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-white dark:bg-zinc-900 px-3 text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] leading-none">Or</span>
                            </div>
                        </div>

                        <Link
                            href="/auth/register"
                            className="mt-5 w-full py-3 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all active:scale-[0.98]"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
