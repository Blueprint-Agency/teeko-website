"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Loader2, RefreshCcw, ArrowLeft, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";

export default function VerifyCodePage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(180); // 3 minutes
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const storedEmail = localStorage.getItem("verify_email");
        if (!storedEmail) {
            router.push("/auth/register");
            return;
        }
        setEmail(storedEmail);

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Verification failed");
            }

            // Verification successful
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.removeItem("verify_email");
            router.push("/profile");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to resend code");
            }

            setTimer(180);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            setError("New code sent!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-[var(--background)] flex flex-col overflow-hidden text-[var(--foreground)]">
            <Navigation forceSolid />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10">
                <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <button
                        onClick={() => router.back()}
                        className="mb-8 flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        BACK TO REGISTER
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--card-bg)] shadow-xl mb-6 border border-[var(--border)]">
                            <ShieldCheck className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
                            Verify Email
                        </h1>
                        <p className="text-[var(--muted)] text-sm max-w-xs mx-auto">
                            We've sent a 6-digit verification code to <span className="text-[var(--foreground)] font-semibold">{email}</span>
                        </p>
                    </div>

                    <div className="bg-[var(--card-bg)]/70 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 border border-[var(--border)]">
                        {error && (
                            <div className={`mb-6 p-4 rounded-2xl text-xs flex items-start gap-3 ${error.includes('sent') ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-primary-500/10 border-primary-500/20 text-primary-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${error.includes('sent') ? 'bg-green-600' : 'bg-primary-600'}`} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="flex justify-between gap-2 sm:gap-4">
                                {code.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => { inputRefs.current[idx] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-10 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold bg-[var(--background-alt)] border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-[var(--foreground)]"
                                    />
                                ))}
                            </div>

                            <div className="text-center space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || code.some(d => !d)}
                                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-2xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                                </button>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                                        {timer > 0 ? (
                                            <>Code expires in <span className="text-primary-600">{formatTime(timer)}</span></>
                                        ) : (
                                            <span className="text-primary-600">Code expired</span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 disabled:opacity-50"
                                    >
                                        <RefreshCcw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                                        RESEND NEW CODE
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/auth/register" className="text-xs font-bold text-[var(--muted)] hover:text-primary-600 transition-colors">
                            Did not receive the email? Check your spam folder or try another email.
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
