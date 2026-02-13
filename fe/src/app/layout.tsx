import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      return {
        title: settings.siteTitle || "Teeko Advisor",
        description: settings.siteDescription || "Discover amazing restaurants near you.",
        icons: {
          icon: settings.faviconUrl || "/favicon.ico",
        },
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
import { SnippetInjector } from "@/components/layout/SnippetInjector";
import { AdminRedirect } from "@/components/layout/AdminRedirect";

async function getSnippets() {
  const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/admin/public/snippets`, {
      next: { revalidate: 60 }
    });
    if (res.ok) return res.json();
  } catch (error) {
    console.warn("Failed to fetch snippets during SSR");
  }
  return [];
}

interface Snippet {
  id: string;
  content: string;
  position: "HEAD" | "BODY";
  target: "EVERY_PAGE" | "SPECIFIC_PAGE";
  pagePath: string | null;
  isActive: boolean;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snippets: Snippet[] = await getSnippets();

  // Note: Filtering SPECIFIC_PAGE snippets on the server requires knowing the path.
  // In Next.js App Router, we usually do this in the layout or page.
  // However, layout.tsx doesn't receive the current path easily except via parallel routes or headers (hacky).
  // For simplicity, we'll inject EVERY_PAGE snippets here and let client-side handle specific pages if needed,
  // OR we just inject all active snippets and let them manage their own logic if they are scripts.
  // Actually, standard practice for many analytics is "every page".

  const headSnippets = snippets.filter(s => s.isActive && s.position === "HEAD" && s.target === "EVERY_PAGE");
  const bodySnippets = snippets.filter(s => s.isActive && s.position === "BODY" && s.target === "EVERY_PAGE");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900`}
      >
        {/* Render EVERY_PAGE Head snippets at the top of body to avoid invalid head nesting */}
        {headSnippets.map(s => (
          <div key={s.id} dangerouslySetInnerHTML={{ __html: s.content }} style={{ display: 'none' }} />
        ))}
        {/* Render EVERY_PAGE Body snippets */}
        {bodySnippets.map(s => (
          <div key={s.id} dangerouslySetInnerHTML={{ __html: s.content }} style={{ display: 'none' }} />
        ))}
        <SnippetInjector snippets={snippets} position="HEAD" />
        <SnippetInjector snippets={snippets} position="BODY" />
        <AdminRedirect />
        <GoogleAuthProvider>
          <MaintenanceProvider>
            {children}
          </MaintenanceProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}

