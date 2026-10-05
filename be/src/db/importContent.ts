/**
 * Imports blog posts from content files in `be/content/blog/` on every start.
 *
 * Posts are written in the repo as JSON (one file per post per language) and
 * pushed like code. This runs after the migrations and before the server
 * starts (see the Dockerfile). It only ever CREATES: a post whose
 * (locale, slug) already exists is left alone, so anything edited later in the
 * admin panel is never overwritten. To change a live post, edit it in the
 * admin panel.
 *
 * A file that fails validation is skipped with a log line. Nothing here may
 * stop the server from starting, so the process always exits 0.
 *
 * File shape (see be/content/blog/README.md):
 *   { title, slug, locale, metaDescription?, featureImage?, status?,
 *     translationOf?: { locale, slug }, contentBlocks: [{ blockType, content, ... }] }
 * A `cta` block's content is an object { heading, subheading?, buttonText, url };
 * it is stored as the JSON string the frontend's CtaCard expects.
 */
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { blogPosts, blogContentBlocks, users } from "./schema";
import { isLocale, type Locale } from "../utils/translations";

export const CONTENT_DIR = path.resolve(__dirname, "../../content/blog");

const BLOCK_TYPES = new Set(["h2", "h3", "h4", "paragraph", "image", "cta"]);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface FileBlock {
    blockType: string;
    content: string | Record<string, string>;
    imageSize?: "small" | "medium" | "large";
    locationId?: string;
    restaurantId?: string;
}

export interface ContentFile {
    title: string;
    slug: string;
    locale: Locale;
    metaDescription?: string;
    featureImage?: string | null;
    status?: "DRAFT" | "PUBLISHED";
    translationOf?: { locale: Locale; slug: string };
    contentBlocks: FileBlock[];
}

/** Returns the problems with a parsed file; an empty list means it can be imported. */
export function validate(data: any): string[] {
    const errors: string[] = [];
    if (typeof data !== "object" || data === null) return ["not a JSON object"];
    if (typeof data.title !== "string" || !data.title.trim()) errors.push("title is required");
    if (typeof data.slug !== "string" || !SLUG.test(data.slug)) errors.push("slug must be lowercase Latin letters, digits and hyphens");
    if (!isLocale(data.locale)) errors.push("locale must be en, ms or zh");
    if (data.status !== undefined && data.status !== "DRAFT" && data.status !== "PUBLISHED") errors.push("status must be DRAFT or PUBLISHED");
    if (data.translationOf !== undefined) {
        const t = data.translationOf;
        if (!t || !isLocale(t.locale) || typeof t.slug !== "string") errors.push("translationOf must be { locale, slug }");
        else if (t.locale === data.locale) errors.push("translationOf must point at another language");
    }
    if (!Array.isArray(data.contentBlocks) || data.contentBlocks.length === 0) {
        errors.push("contentBlocks must be a non-empty array");
        return errors;
    }
    data.contentBlocks.forEach((b: any, i: number) => {
        if (!b || !BLOCK_TYPES.has(b.blockType)) {
            errors.push(`block ${i}: blockType must be one of ${[...BLOCK_TYPES].join(", ")}`);
            return;
        }
        if (b.blockType === "cta") {
            const c = b.content;
            if (!c || typeof c !== "object" || !c.heading || !c.buttonText || !c.url) {
                errors.push(`block ${i}: cta content needs heading, buttonText and url`);
            }
        } else if (typeof b.content !== "string" || !b.content.trim()) {
            errors.push(`block ${i}: content must be a non-empty string`);
        }
    });
    return errors;
}

function readFiles(): { name: string; data: ContentFile }[] {
    if (!existsSync(CONTENT_DIR)) return [];
    const out: { name: string; data: ContentFile }[] = [];
    for (const name of readdirSync(CONTENT_DIR).filter((n) => n.endsWith(".json")).sort()) {
        let data: any;
        try {
            data = JSON.parse(readFileSync(path.join(CONTENT_DIR, name), "utf8"));
        } catch (e) {
            console.error(`[content] ${name}: not valid JSON, skipped`);
            continue;
        }
        const errors = validate(data);
        if (errors.length) {
            console.error(`[content] ${name}: skipped\n  ${errors.join("\n  ")}`);
            continue;
        }
        out.push({ name, data });
    }
    // Originals before translations, so a translation can find its group.
    return out.sort((a, b) => Number(!!a.data.translationOf) - Number(!!b.data.translationOf));
}

async function importOne(name: string, data: ContentFile, authorId: string | undefined): Promise<"created" | "exists" | "skipped"> {
    const [existing] = await db
        .select({ id: blogPosts.id })
        .from(blogPosts)
        .where(and(eq(blogPosts.locale, data.locale), eq(blogPosts.slug, data.slug)))
        .limit(1);
    if (existing) return "exists";

    let translationGroupId: string | undefined;
    if (data.translationOf) {
        const [original] = await db
            .select({ id: blogPosts.id, group: blogPosts.translationGroupId })
            .from(blogPosts)
            .where(and(eq(blogPosts.locale, data.translationOf.locale), eq(blogPosts.slug, data.translationOf.slug)))
            .limit(1);
        if (!original) {
            console.error(`[content] ${name}: translationOf ${data.translationOf.locale}/${data.translationOf.slug} not found, skipped`);
            return "skipped";
        }
        translationGroupId = original.group ?? original.id;
    }

    const status = data.status ?? "PUBLISHED";
    await db.transaction(async (tx) => {
        const [post] = await tx
            .insert(blogPosts)
            .values({
                title: data.title,
                slug: data.slug,
                locale: data.locale,
                metaDescription: data.metaDescription,
                featureImage: data.featureImage ?? null,
                status,
                authorId,
                publishedAt: status === "PUBLISHED" ? new Date() : null,
            })
            .returning({ id: blogPosts.id });
        // A new piece starts its own translation group, as the admin editor does.
        await tx
            .update(blogPosts)
            .set({ translationGroupId: translationGroupId ?? post.id })
            .where(eq(blogPosts.id, post.id));
        await tx.insert(blogContentBlocks).values(
            data.contentBlocks.map((b, index) => ({
                blogPostId: post.id,
                blockType: b.blockType,
                content: typeof b.content === "string" ? b.content : JSON.stringify(b.content),
                orderIndex: String(index),
                locationId: b.locationId,
                restaurantId: b.restaurantId,
                imageSize: b.imageSize,
            })),
        );
    });
    return "created";
}

export async function importContent(): Promise<void> {
    const files = readFiles();
    if (files.length === 0) {
        console.log("[content] no content files");
        return;
    }
    const [admin] = await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.role, ["ADMIN", "SUPERADMIN"]))
        .limit(1);

    const tally = { created: 0, exists: 0, skipped: 0 };
    for (const { name, data } of files) {
        try {
            const result = await importOne(name, data, admin?.id);
            tally[result]++;
            if (result === "created") console.log(`[content] created ${data.locale}/${data.slug}`);
        } catch (e) {
            tally.skipped++;
            console.error(`[content] ${name}: failed`, e);
        }
    }
    console.log(`[content] done: ${tally.created} created, ${tally.exists} already there, ${tally.skipped} skipped`);
}

if (require.main === module) {
    importContent()
        .catch((e) => console.error("[content] import aborted", e))
        .finally(() => process.exit(0));
}
