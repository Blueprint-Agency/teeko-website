"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface Snippet {
    id: string;
    content: string;
    position: "HEAD" | "BODY";
    target: "EVERY_PAGE" | "SPECIFIC_PAGE";
    pagePath: string | null;
    isActive: boolean;
}

export function SnippetInjector({ snippets, position }: { snippets: Snippet[], position: "HEAD" | "BODY" }) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const activeSnippets = snippets.filter(snippet => {
        if (!snippet.isActive) return false;
        if (snippet.position !== position) return false;

        // Skip EVERY_PAGE snippets because they are already handled by SSR in layout.tsx
        if (snippet.target === "EVERY_PAGE") return false;

        if (snippet.target === "SPECIFIC_PAGE" && snippet.pagePath === pathname) return true;

        return false;
    });

    return (
        <>
            {activeSnippets.map((snippet) => {
                const isScript = snippet.content.includes("<script");
                if (isScript) {
                    const srcMatch = snippet.content.match(/src=["']([^"']+)["']/i);
                    const src = srcMatch ? srcMatch[1] : undefined;
                    const scriptContent = snippet.content.replace(/<script[^>]*>|<\/script>/gi, '').trim();

                    return (
                        <Script
                            key={snippet.id}
                            id={`snippet-${snippet.id}`}
                            src={src}
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={!src ? { __html: scriptContent } : undefined}
                        />
                    );
                }
                return (
                    <div
                        key={snippet.id}
                        dangerouslySetInnerHTML={{ __html: snippet.content }}
                        className="hidden"
                    />
                );
            })}
        </>
    );
}
