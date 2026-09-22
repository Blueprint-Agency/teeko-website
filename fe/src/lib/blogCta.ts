// A "cta" content block stores its fields as JSON in `content`, the same way
// image blocks store a URL there. Shared by the blog renderer and the editor.
export interface CtaContent {
    heading: string;
    subheading: string;
    buttonText: string;
    url: string;
}

export const EMPTY_CTA: CtaContent = { heading: "", subheading: "", buttonText: "", url: "" };

export function parseCtaContent(content: string | null | undefined): CtaContent {
    if (!content) return { ...EMPTY_CTA };
    try {
        const parsed = JSON.parse(content) as Partial<CtaContent>;
        return {
            heading: parsed.heading ?? "",
            subheading: parsed.subheading ?? "",
            buttonText: parsed.buttonText ?? "",
            url: parsed.url ?? "",
        };
    } catch {
        return { ...EMPTY_CTA };
    }
}

export function serializeCtaContent(cta: CtaContent): string {
    return JSON.stringify(cta);
}
