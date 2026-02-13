"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ShoppingBag, LogIn, CheckCircle2, ArrowRight } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthFetch } from "@/lib/authFetch";

interface BookingButtonProps {
    pkg: {
        id: string;
        packageName: string;
        price: string | null;
    };
}

export function BookingButton({ pkg }: BookingButtonProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const { fetchWithAuth } = useAuthFetch();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            checkStatus();
        }
    }, [pkg.id]);

    const checkStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const result = await fetchWithAuth(`${API_BASE_URL}/bookings/check-status/${pkg.id}`);
            if (result.isSessionExpired) return;
            if (!result.error && result.data) {
                setIsBooked(result.data.isBooked);
            }
        } catch (err) {
            console.error("Status check error:", err);
        }
    };

    const handleBooking = () => {
        if (!user) {
            router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
            return;
        }
        if (isBooked) {
            router.push("/profile");
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col">
            <button
                onClick={handleBooking}
                className={`inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl w-full sm:w-fit ${isBooked
                    ? "bg-[var(--background-alt)] text-gray-500 dark:text-gray-400 border border-[var(--border)] shadow-none hover:bg-gray-100 dark:hover:bg-zinc-700"
                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20 hover:shadow-2xl hover:-translate-y-1"
                    }`}
            >
                {!user ? (
                    <>Sign In to Book <LogIn className="ml-3 h-6 w-6" /></>
                ) : isBooked ? (
                    <>View Booking <ArrowRight className="ml-3 h-5 w-5" /></>
                ) : (
                    <>Book Now <ShoppingBag className="ml-3 h-6 w-6" /></>
                )}
            </button>


            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pkg={pkg}
                user={user}
                onBookingSuccess={() => setIsBooked(true)}
            />
        </div>
    );
}
