const isServer = typeof window === 'undefined';

// Use BACKEND_URL (internal Docker) on server, NEXT_PUBLIC_API_URL (public) on client
export const API_BASE_URL = isServer
    ? (process.env.BACKEND_URL || "http://localhost:3011")
    : (process.env.NEXT_PUBLIC_API_URL || "/api");
