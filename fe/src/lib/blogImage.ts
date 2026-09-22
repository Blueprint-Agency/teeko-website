// An "image" content block stores either a plain URL (how every block was
// stored before alt text existed) or JSON {url, alt}. Parsing both keeps
// posts published before this change working untouched.
export interface ImageContent {
    url: string;
    alt: string;
}

export function parseImageContent(content: string | null | undefined): ImageContent {
    if (!content) return { url: "", alt: "" };
    const trimmed = content.trim();
    if (trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed) as Partial<ImageContent>;
            return { url: parsed.url ?? "", alt: parsed.alt ?? "" };
        } catch {
            // fall through: a URL that merely looks like JSON is still a URL
        }
    }
    return { url: trimmed, alt: "" };
}

// Plain URL while there is no alt text, so blocks stay readable in the
// database and identical to what older posts hold.
export function serializeImageContent({ url, alt }: ImageContent): string {
    return alt.trim() ? JSON.stringify({ url, alt: alt.trim() }) : url;
}
