import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import { MaintenanceProvider } from "@/components/providers/MaintenanceProvider";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";
import { AdminRedirect } from "@/components/layout/AdminRedirect";
import GTMTracking from "@/components/layout/GTMTracking";
import { StreakRoadmapModal } from "@/components/shared/StreakRoadmapModal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Prevents a flash of the wrong theme before hydration.
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

/**
 * The <html> document shared by the two root layouts: `app/[locale]` (the
 * public site, in three languages) and `app/admin` (English only). There are
 * two roots because the public root needs the locale segment to set
 * `<html lang>` without reading request headers.
 *
 * `children` is wrapped by the same providers in both, so auth, maintenance
 * mode, GTM page views and the streak modal behave as before.
 */
export function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
    return (
        <html lang={lang} suppressHydrationWarning>
            {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
            {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}>
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
