const isServer = typeof window === 'undefined';

// Use absolute URL on server, relative path on client (proxied via next.config.ts)
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (isServer
        ? (process.env.BACKEND_URL || "http://localhost:3011")
        : "/api");

