/**
 * Locale support shared by the controllers.
 *
 * English lives in the normal columns. Bahasa Malaysia and Chinese live in a
 * `translations` jsonb column shaped `{ ms?: {...}, zh?: {...} }`. Everything
 * the admin sends is filtered through `sanitizeTranslations` so a stray key or
 * an empty string never reaches the database: an empty field means "not
 * translated yet", which the frontend uses to keep the page out of the
 * sitemap and hreflang.
 */

export const LOCALES = ["en", "ms", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const TRANSLATED_LOCALES = ["ms", "zh"] as const;

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

type FieldKind = "string" | "features";

/**
 * Returns `undefined` when the request did not mention translations at all,
 * so an update that omits the field leaves the stored value untouched.
 */
export function sanitizeTranslations(
    input: unknown,
    fields: Record<string, FieldKind>,
): Record<string, Record<string, unknown>> | undefined {
    if (input === undefined) return undefined;
    if (input === null || typeof input !== "object") return {};

    const out: Record<string, Record<string, unknown>> = {};
    for (const locale of TRANSLATED_LOCALES) {
        const raw = (input as Record<string, unknown>)[locale];
        if (!raw || typeof raw !== "object") continue;

        const clean: Record<string, unknown> = {};
        for (const [key, kind] of Object.entries(fields)) {
            const value = (raw as Record<string, unknown>)[key];
            if (kind === "string" && typeof value === "string" && value.trim()) {
                clean[key] = value.trim();
            }
            if (kind === "features" && Array.isArray(value)) {
                const items = value
                    .filter((f) => f && typeof f === "object")
                    .map((f) => ({
                        title: String((f as Record<string, unknown>).title ?? "").trim(),
                        description: String((f as Record<string, unknown>).description ?? "").trim(),
                    }))
                    .filter((f) => f.title || f.description);
                if (items.length) clean[key] = items;
            }
        }
        if (Object.keys(clean).length) out[locale] = clean;
    }
    return out;
}

/** Postgres unique_violation, for turning a duplicate slug into a 409. */
export function isUniqueViolation(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        ((error as { code?: string }).code === "23505" ||
            (error as { cause?: { code?: string } }).cause?.code === "23505")
    );
}
