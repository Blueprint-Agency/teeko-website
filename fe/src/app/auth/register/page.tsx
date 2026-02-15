"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Password strength state
    const [strength, setStrength] = useState({
        length: false,
        number: false,
        symbol: false,
    });

    useEffect(() => {
        const pass = formData.password;
        setStrength({
            length: pass.length >= 8,
            number: /[0-9]/.test(pass),
            symbol: /[^A-Za-z0-9]/.test(pass),
        });
    }, [formData.password]);

    const isPasswordStrong = strength.length && strength.number && strength.symbol;
    const strengthScore = [strength.length, strength.number, strength.symbol].filter(Boolean).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!isPasswordStrong) {
            setError("Please fulfill all password requirements.");
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Successfully triggered registration, now need to verify code
            localStorage.setItem("verify_email", formData.email);
            router.push("/auth/verify-code");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Google registration failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/");
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

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1 uppercase tracking-wider">
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

                                {/* Strength Bar */}
                                <div className="px-1 pt-1.5 flex gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${formData.password.length > 0 && Math.max(1, strengthScore) >= level
                                                ? Math.max(1, strengthScore) === 1 ? "bg-red-500"
                                                    : Math.max(1, strengthScore) === 2 ? "bg-orange-500"
                                                        : "bg-green-500"
                                                : "bg-gray-200 dark:bg-zinc-800"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1 uppercase tracking-wider">
                                    Confirm Password
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

                                {/* Strength Bar (Mirror) */}
                                <div className="px-1 pt-1.5 flex gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${formData.confirmPassword.length > 0 && Math.max(1, strengthScore) >= level
                                                ? Math.max(1, strengthScore) === 1 ? "bg-red-500"
                                                    : Math.max(1, strengthScore) === 2 ? "bg-orange-500"
                                                        : "bg-green-500"
                                                : "bg-gray-200 dark:bg-zinc-800"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Password Requirements Checklist */}
                            <div className="p-3.5 bg-gray-50/50 dark:bg-zinc-950/50 rounded-2xl space-y-2 border border-gray-200 dark:border-zinc-800">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-2">
                                        {strength.length ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-700" />}
                                        <span className={`text-[11px] font-bold tracking-wider ${strength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-600'}`}>at least 8 characters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.number ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-700" />}
                                        <span className={`text-[11px] font-bold tracking-wider ${strength.number ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-600'}`}>at least one number</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {strength.symbol ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-700" />}
                                        <span className={`text-[11px] font-bold tracking-wider ${strength.symbol ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-600'}`}>at least one symbol</span>
                                    </div>
                                </div>
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

                        <div className="mt-6 w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google Signup Failed")}
                                theme="filled_blue"
                                shape="pill"
                                width="100%"
                                size="large"
                                text="signup_with"
                            />
                        </div>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] items-center">
                                <span className="bg-white dark:bg-zinc-900 px-3 text-gray-400 dark:text-zinc-500 font-bold tracking-[0.2em] leading-none uppercase">Already have one?</span>
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

