"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            router.push("/auth/login");
            return;
        }

        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-[var(--background)] flex flex-col overflow-hidden text-[var(--foreground)]">
            <Navigation forceSolid />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-24 pb-12 relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">My Profile</h1>
                    <p className="text-[var(--muted)]">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Card */}
                    <div className="md:col-span-1">
                        <div className="bg-[var(--card-bg)] rounded-[32px] p-6 border border-[var(--border)] shadow-xl shadow-black/5 text-center">
                            <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[var(--background)] shadow-inner">
                                <User className="w-10 h-10 text-primary-600" />
                            </div>
                            <h2 className="text-xl font-bold mb-1 truncate px-4">{user?.email.split('@')[0]}</h2>
                            <p className="text-xs font-semibold text-primary-600 bg-primary-500/10 inline-block px-3 py-1 rounded-full uppercase tracking-wider mb-8">
                                {user?.role || 'User'}
                            </p>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-primary-600 hover:bg-primary-500/5 rounded-2xl transition-all border border-primary-500/20"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[var(--card-bg)] rounded-[32px] p-8 border border-[var(--border)] shadow-xl shadow-black/5">
                            <h3 className="text-lg font-bold mb-6">Account Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--background-alt)] flex items-center justify-center border border-[var(--border)]">
                                        <Mail className="w-5 h-5 text-[var(--muted)]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider leading-none mb-1.5">Email Address</p>
                                        <p className="text-sm font-semibold">{user?.email}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-md">VERIFIED</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--background-alt)] flex items-center justify-center border border-[var(--border)]">
                                        <Shield className="w-5 h-5 text-[var(--muted)]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider leading-none mb-1.5">Account Role</p>
                                        <p className="text-sm font-semibold">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--background-alt)] rounded-[32px] p-8 border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center opacity-70">
                            <p className="text-sm font-bold text-[var(--muted)] mb-2">More features coming soon</p>
                            <p className="text-xs text-[var(--muted)] max-w-xs">You'll soon be able to save your favorite restaurants, write reviews, and track your eSIM purchases here.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
