// An "image" content block stores either a plain URL (how every block was
// stored before alt text existed) or JSON {url, alt, caption?}. Parsing both
// keeps posts published before this change working untouched.
//
// `caption` is a short HTML string shown under the image. It carries the photo
// credit a Creative Commons licence requires (author, licence, source), so it is
// written in the content file and must survive an alt-text edit in the admin
// editor: callers update one field and pass the rest through.
export interface ImageContent {
    url: string;
    alt: string;
    caption?: string;
}

export function parseImageContent(content: string | null | undefined): ImageContent {
    if (!content) return { url: "", alt: "" };
    const trimmed = content.trim();
    if (trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed) as Partial<ImageContent>;
            const out: ImageContent = { url: parsed.url ?? "", alt: parsed.alt ?? "" };
            if (parsed.caption) out.caption = parsed.caption;
            return out;
        } catch {
            // fall through: a URL that merely looks like JSON is still a URL
        }
    }
    return { url: trimmed, alt: "" };
}

// Plain URL while there is no alt text or caption, so blocks stay readable in
// the database and identical to what older posts hold.
export function serializeImageContent({ url, alt, caption }: ImageContent): string {
    const a = alt.trim();
    const c = caption?.trim();
    if (!a && !c) return url;
    return JSON.stringify(c ? { url, alt: a, caption: c } : { url, alt: a });
}
