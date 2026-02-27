import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/admin/settings`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000) // Don't wait forever during build
    });

    if (res.ok) {
      const settings = await res.json();
      const faviconUrl = settings.faviconUrl || "/favicon.ico";
      // Add cache busting query param if updatedAt exists
      const cacheBust = settings.updatedAt ? `?v=${new Date(settings.updatedAt).getTime()}` : "";

      return {
        title: settings.siteTitle || "Teeko Advisor",
        description: settings.siteDescription || "Discover amazing restaurants near you.",
        icons: {
          icon: `${faviconUrl}${cacheBust}`,
          shortcut: `${faviconUrl}${cacheBust}`,
          apple: `${faviconUrl}${cacheBust}`, // Optional but good for iOS
        },
        robots: {
          index: settings.googleIndexing,
          follow: settings.googleIndexing,
        }
      };

    }
  } catch (error) {
    console.warn("Skipping dynamic metadata during build (API unreachable). Using fallbacks.");
  }
  return {
    title: "Teeko Advisor - Discover Malaysia",
    description: "Find the best places and destinations in Malaysia.",
  };
}

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
`;

import { MaintenanceProvider } from "@/components/providers/MaintenanceProvider";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";
import { AdminRedirect } from "@/components/layout/AdminRedirect";
import GTMTracking from "@/components/layout/GTMTracking";
import { Suspense } from "react";
import { StreakRoadmapModal } from "@/components/shared/StreakRoadmapModal";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}
      >
        <AdminRedirect />
        <GoogleAuthProvider>
          <MaintenanceProvider>
            <Suspense fallback={null}>
              <GTMTracking />
            </Suspense>
            {children}
            <StreakRoadmapModal />
          </MaintenanceProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}



