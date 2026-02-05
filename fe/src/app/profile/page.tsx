"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { UserBookings } from "@/components/booking/UserBookings";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation forceSolid />

            <main className="max-w-container mx-auto px-4 py-12 pt-24">
                <Breadcrumbs items={[{ label: "Profile" }]} />

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        My Profile
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Manage your account and view your eSIM bookings
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - User Card */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] text-center sticky top-24">
                            <div className="w-20 h-20 bg-[var(--background-alt)] rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-[var(--background-alt)]">
                                <User className="w-9 h-9 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate px-2">
                                {user?.email.split('@')[0]}
                            </h2>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 inline-block px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
                                {user?.role || 'User'}
                            </p>

                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Account Info Card */}
                        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Account Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-[var(--background-alt)] rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                    </div>
                                    <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-bold rounded-lg uppercase tracking-wider flex-shrink-0">Verified</span>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-[var(--background-alt)] rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Account Role</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bookings Section - Match Account Info container */}
                        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">My eSIM Bookings</h3>
                            <UserBookings />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowLogoutModal(false);
                    }}
                >
                    <div className="w-full max-w-xs sm:max-w-sm bg-[var(--background-alt)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)] p-6 sm:p-8 text-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[var(--border)]">
                            <LogOut className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Out?</h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
                            Are you sure you want to sign out of your account?
                        </p>

                        <div className="space-y-2.5">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 sm:py-4 bg-red-600 text-white text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                            >
                                Yes, Sign Out
                            </button>

                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full py-3 sm:py-4 bg-[var(--card-bg)] text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all border border-[var(--border)]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
