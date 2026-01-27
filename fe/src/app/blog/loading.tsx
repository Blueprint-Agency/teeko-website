import { Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
            <Navigation forceSolid />
            <div className="container mx-auto px-4 py-16 pt-24 text-center">
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                        Loading latest stories...
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
