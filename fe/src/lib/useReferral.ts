"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuthFetch } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";

export interface Referee {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface ReferralData {
    referralCode: string;
    referredById: string | null;
    referees: Referee[];
}

export function useReferral() {
    const { fetchWithAuth } = useAuthFetch();
    const [referralData, setReferralData] = useState<ReferralData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReferralData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real app, these might be separate endpoints or one combined endpoint
            const response = await fetchWithAuth(`${API_BASE_URL}/referrals/status`);
            if (response.error) throw new Error(response.error);

            const refereesResponse = await fetchWithAuth(`${API_BASE_URL}/referrals/referees`);
            if (refereesResponse.error) throw new Error(refereesResponse.error);

            setReferralData({
                referralCode: response.data.referralCode,
                referredById: response.data.referredBy,
                referees: refereesResponse.data || [],
            });
        } catch (err: any) {
            setError(err.message || "Failed to fetch referral data");
        } finally {
            setIsLoading(false);
        }
    }, [fetchWithAuth]);

    const applyReferralCode = async (code: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/referrals/apply`, {
                method: "POST",
                body: JSON.stringify({ referralCode: code }),
            });

            if (response.error) throw new Error(response.error);

            // Refresh data after applying
            await fetchReferralData();
            return { success: true };
        } catch (err: any) {
            setError(err.message || "Failed to apply referral code");
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReferralData();
    }, [fetchReferralData]);

    return {
        referralData,
        isLoading,
        error,
        applyReferralCode,
        refreshReferralData: fetchReferralData,
    };
}
