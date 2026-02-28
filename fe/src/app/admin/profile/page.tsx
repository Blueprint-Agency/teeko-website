"use client";

import { useState } from "react";
import { User, Mail, Shield, Key, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Fingerprint } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function ProfilePage() {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
    const adminUser = userStr ? JSON.parse(userStr) : null;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Request code, 2: Enter code & new password
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleRequestCode = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/profile/password-code`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStep(2);
                setMessage({ type: 'success', text: "Verification code sent to your email." });
            } else {
                setMessage({ type: 'error', text: data.message || "Failed to send code." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred." });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/admin/profile/change-password`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code, newPassword })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "Password updated successfully!" });
                setStep(1);
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.message || "Failed to update password." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An error occurred." });
        } finally {
            setLoading(false);
        }
    };

    const permissions = adminUser?.permissions || {};

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Account Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">View your account details and manage security settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-4xl font-bold mb-6 ring-8 ring-primary-50 dark:ring-primary-900/10">
                            {adminUser?.email?.[0]?.toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 break-all px-4">{adminUser?.email}</h2>
                        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
                            {adminUser?.role}
                        </span>

                        <div className="w-full space-y-4 pt-6 border-t border-gray-50 dark:border-zinc-800">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4 text-primary-500" />
                                <span>{adminUser?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <ShieldCheck className="h-4 w-4 text-primary-500" />
                                <span>Administrator Level</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Fingerprint className="h-4 w-4 text-primary-500" />
                                <span className="truncate">{adminUser?.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Your Permissions</h3>
                        <div className="space-y-3">
                            {adminUser?.role === 'SUPERADMIN' ? (
                                <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-semibold flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Full System Control
                                </div>
                            ) : Object.entries(permissions).map(([key, value]) => (
                                <div key={key} className={`flex items-center justify-between p-3 rounded-2xl border text-sm transition-all ${value
                                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 text-green-700 dark:text-green-400'
                                    : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 text-gray-400'
                                    }`}>
                                    <span className="capitalize">{key.replace(/Management|Settings/g, ' Management').replace('general', 'General')}</span>
                                    {value ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4 opacity-30" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Card / Change Password */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800 h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                <Key className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                                <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                                {message.text}
                            </div>
                        )}

                        <div className="max-w-md">
                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-amber-800 dark:text-amber-400 text-sm">
                                        <p className="font-semibold mb-2">Password Change Policy</p>
                                        <p className="opacity-80">For security reasons, we will send a 6-digit verification code to your email address (<strong>{adminUser?.email}</strong>) to confirm this request.</p>
                                    </div>
                                    <button
                                        onClick={handleRequestCode}
                                        disabled={loading}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-6 py-3.5 font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Request Verification Code"}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Verification Code</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-mono tracking-widest text-center text-xl"
                                                placeholder="000000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-6 py-3.5 font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Update Password"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-2xl px-6 py-3.5 font-bold transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    )
}
