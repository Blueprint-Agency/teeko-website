"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

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
            {activeSnippets.map((snippet) => (
                <div
                    key={snippet.id}
                    dangerouslySetInnerHTML={{ __html: snippet.content }}
                    style={{ display: "none" }}
                />
            ))}
        </>
    );
}
