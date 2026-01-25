"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${type === "success"
                    ? "border-green-100 bg-green-50 text-green-800 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400"
                    : "border-red-100 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                }`}
        >
            {type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
                <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
