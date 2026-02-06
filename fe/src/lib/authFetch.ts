"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

// Types for the fetch wrapper
interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

interface ApiResponse<T = any> {
    data: T | null;
    error: string | null;
    status: number;
    isSessionExpired: boolean;
}

// Utility function to get token
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
};

// Utility function to clear session
export const clearSession = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Check if response indicates session expiration
export const isSessionExpiredResponse = (status: number): boolean => {
    return status === 401 || status === 403;
};

// Redirect to login with session expired message
export const redirectToLogin = (router: ReturnType<typeof useRouter>, message?: string) => {
    clearSession();
    const loginUrl = `/login?expired=true${message ? `&message=${encodeURIComponent(message)}` : ''}`;
    router.push(loginUrl);
};

/**
 * Authenticated fetch wrapper that handles session expiration
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise with data, error, and session status
 */
export async function authFetch<T = any>(
    url: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> {
    const { skipAuth = false, headers = {}, ...restOptions } = options;

    try {
        const token = getAuthToken();

        // Build headers
        const fetchHeaders: HeadersInit = {
            ...headers,
        };

        // Add auth header if not skipped and token exists
        if (!skipAuth && token) {
            (fetchHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }

        // Add content-type for JSON if body exists and not already set
        if (restOptions.body && !(headers as Record<string, string>)["Content-Type"]) {
            (fetchHeaders as Record<string, string>)["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
            ...restOptions,
            headers: fetchHeaders,
        });

        const status = response.status;
        const isSessionExpired = isSessionExpiredResponse(status);

        // Try to parse JSON response
        let data: T | null = null;
        let error: string | null = null;

        try {
            const jsonData = await response.json();
            if (response.ok) {
                data = jsonData;
            } else {
                error = jsonData.message || jsonData.error || "Request failed";
            }
        } catch {
            // Response might not be JSON
            if (!response.ok) {
                error = "Request failed";
            }
        }

        return {
            data,
            error,
            status,
            isSessionExpired,
        };
    } catch (err: any) {
        return {
            data: null,
            error: err.message || "Network error",
            status: 0,
            isSessionExpired: false,
        };
    }
}

/**
 * React hook for authenticated API calls with automatic session handling
 */
export function useAuthFetch() {
    const router = useRouter();

    const fetchWithAuth = useCallback(async <T = any>(
        url: string,
        options: FetchOptions = {}
    ): Promise<ApiResponse<T>> => {
        const result = await authFetch<T>(url, options);

        // Automatically redirect on session expiration
        if (result.isSessionExpired) {
            redirectToLogin(router, "Your session has expired. Please log in again.");
        }

        return result;
    }, [router]);

    return { fetchWithAuth, redirectToLogin: (message?: string) => redirectToLogin(router, message) };
}

/**
 * Standalone function to handle session expiration check
 * Use this in components that don't use the hook
 */
export function handleSessionExpired(
    status: number,
    router: ReturnType<typeof useRouter>
): boolean {
    if (isSessionExpiredResponse(status)) {
        redirectToLogin(router, "Your session has expired. Please log in again.");
        return true;
    }
    return false;
}
