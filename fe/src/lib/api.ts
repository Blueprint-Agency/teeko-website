/**
 * List endpoints return either a bare array or a paginated envelope
 * `{ data, pagination }`. `/restaurants` changed from the first shape to the
 * second when pagination was added, which silently emptied the homepage's
 * featured section and dropped every restaurant page from the sitemap,
 * because both sites read `.length` on what had become an object.
 *
 * Read every list response through this, so a future shape change is a
 * visible failure rather than a silent empty list.
 */
export function asList<T = any>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
        return (payload as any).data as T[];
    }
    return [];
}

/** Ask a paginated endpoint for everything, rather than its default page size. */
export const ALL_ITEMS_LIMIT = 500;
