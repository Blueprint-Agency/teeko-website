"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import Link from "next/link";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`http://localhost:5000/auth/verify?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("Your email has been successfully verified.");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An error occurred. Please try again later.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 dark:bg-black">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Verifying your email...</p>
                    </div>
                )}

                {status === "success" && (
                    <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
                        <div className="mt-6">
                            <Link href="/auth/login">
                                <Button variant="primary" className="w-full">Continue to Login</Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
                        <p className="mt-2 text-red-600 dark:text-red-400">{message}</p>
                        <div className="mt-6">
                            <Link href="/">
                                <Button variant="outline" className="w-full">Go to Homepage</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
