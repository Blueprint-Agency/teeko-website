"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/Button";

export function HomeSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/restaurants?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/restaurants");
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative group w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-full border border-gray-300 bg-white py-5 pl-14 pr-32 text-gray-900 shadow-lg shadow-gray-200/50 placeholder:text-gray-500 focus:border-primary focus:ring-4 focus:ring-red-500/10 focus:outline-none sm:text-lg transition-all"
                placeholder="Places to go, things to do, restaurants..."
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
                <Button type="submit" className="rounded-full px-8 h-full" size="md">
                    Search
                </Button>
            </div>
        </form>
    );
}
