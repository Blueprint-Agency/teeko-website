"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeSwitchProps {
    isScrolled?: boolean;
}

export function ThemeSwitch({ isScrolled = true }: ThemeSwitchProps) {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const applyTheme = (newTheme: "light" | "dark") => {
        const root = document.documentElement;
        if (newTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    };

    if (!mounted) {
        return <button className="p-2 rounded-full w-10 h-10" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isScrolled
                ? "bg-[var(--background-alt)] hover:bg-[var(--card-bg)] border border-[var(--border)]"
                : "bg-white/10 hover:bg-white/20"
                }`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Moon className={`w-5 h-5 ${isScrolled ? "text-gray-700" : "text-white"}`} />
            ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
            )}
        </button>
    );
}

