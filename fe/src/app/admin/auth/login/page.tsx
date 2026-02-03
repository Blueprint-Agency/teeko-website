"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function AdminLoginPage() {
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
            const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login as admin");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-white dark:bg-black flex flex-col overflow-hidden text-gray-900 dark:text-gray-100 uppercase">
            {/* Background Aesthetic Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
                <div className="w-full max-w-[400px] mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 shadow-2xl mb-6 border border-zinc-800">
                            <ShieldCheck className="w-10 h-10 text-red-600" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter italic">
                            ADMIN <span className="text-red-600">PORTAL</span>
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-500 text-[10px] font-black tracking-[0.3em]">
                            RESTRICTED ACCESS ONLY
                        </p>
                    </div>

                    <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] shadow-2xl p-8 border border-white dark:border-zinc-800/50">
                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black flex items-start gap-3 animate-shake">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 ml-1 tracking-widest leading-none">
                                    ADMIN IDENTIFICATION
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all shadow-inner"
                                        placeholder="EMAIL ADDRESS"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 ml-1 tracking-widest leading-none">
                                    SECURITY KEY
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all shadow-inner"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-2xl transition-all shadow-2xl shadow-red-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 tracking-[0.2em]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>AUTHORIZING...</span>
                                    </>
                                ) : (
                                    <span>INITIALIZE ACCESS</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 tracking-[0.3em]">
                            ENCRYPTED CONNECTION &bull; SECURE GATEWAY
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
