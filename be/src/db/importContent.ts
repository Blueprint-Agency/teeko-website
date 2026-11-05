/**
 * Imports blog posts from content files in `be/content/blog/` on every start.
 *
 * Posts are written in the repo as JSON (one file per post per language) and
 * pushed like code. This runs after the migrations and before the server
 * starts (see the Dockerfile). It CREATES missing posts. A post whose
 * (locale, slug) already exists is never overwritten, with one exception that
 * only ever adds photos (see addPhotos): it gets the file's featureImage when it
 * has none, and the file's image blocks when it has no images yet and its other
 * blocks are still exactly what the file holds (nobody has edited it in the
 * admin panel). Any other change to a live post is made in the admin panel.
 *
 * A file that fails validation is skipped with a log line. Nothing here may
 * stop the server from starting, so the process always exits 0.
 *
 * File shape (see be/content/blog/README.md):
 *   { title, slug, locale, metaDescription?, featureImage?, status?,
 *     translationOf?: { locale, slug }, contentBlocks: [{ blockType, content, ... }] }
 * A `cta` block's content is an object { heading, subheading?, buttonText, url };
 * it is stored as the JSON string the frontend's CtaCard expects.
 * An `image` block's content is a URL string or an object { url, alt?, caption? }
 * (caption is HTML, for photo credits); it is stored as fe/src/lib/blogImage.ts reads it.
 * A `restaurant` block is { blockType: "restaurant", restaurantId } with no
 * content; it renders the restaurant card, as the admin editor's widget does.
 * A card whose restaurant is not in this database (staging has different rows
 * from production) is left out with a log line; the rest of the post imports.
 */
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { blogPosts, blogContentBlocks, restaurants, users } from "./schema";
import { isLocale, type Locale } from "../utils/translations";

export const CONTENT_DIR = path.resolve(__dirname, "../../content/blog");

const BLOCK_TYPES = new Set(["h2", "h3", "h4", "paragraph", "image", "cta", "restaurant"]);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// What the admin editor stores in a restaurant card's content column.
const RESTAURANT_WIDGET = "[RESTAURANT WIDGET]";

interface FileBlock {
    blockType: string;
    content?: string | Record<string, string>;
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
        if (b.blockType === "restaurant") {
            if (typeof b.restaurantId !== "string" || !UUID.test(b.restaurantId)) {
                errors.push(`block ${i}: restaurant needs a restaurantId (uuid)`);
            }
        } else if (b.blockType === "cta") {
            const c = b.content;
            if (!c || typeof c !== "object" || !c.heading || !c.buttonText || !c.url) {
                errors.push(`block ${i}: cta content needs heading, buttonText and url`);
            }
        } else if (b.blockType === "image" && typeof b.content === "object" && b.content !== null) {
            if (typeof b.content.url !== "string" || !b.content.url.trim()) errors.push(`block ${i}: image content needs a url`);
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

/** What a file block becomes in the blog_content_blocks content column. */
function storedContent(b: FileBlock): string {
    if (b.blockType === "restaurant") return RESTAURANT_WIDGET;
    if (typeof b.content === "string") return b.content;
    return JSON.stringify(b.content);
}

/** The file's blocks minus restaurant cards whose restaurant this database does not have. */
async function keptBlocks(name: string, data: ContentFile): Promise<FileBlock[]> {
    const cardIds = data.contentBlocks.filter((b) => b.blockType === "restaurant").map((b) => b.restaurantId!);
    const known = new Set(
        cardIds.length
            ? (await db.select({ id: restaurants.id }).from(restaurants).where(inArray(restaurants.id, cardIds))).map((r) => r.id)
            : [],
    );
    return data.contentBlocks.filter((b) => {
        if (b.blockType !== "restaurant" || known.has(b.restaurantId!)) return true;
        console.warn(`[content] ${name}: restaurant ${b.restaurantId} not in this database, card left out`);
        return false;
    });
}

function blockRows(postId: string, blocks: FileBlock[]) {
    return blocks.map((b, index) => ({
        blogPostId: postId,
        blockType: b.blockType,
        content: storedContent(b),
        orderIndex: String(index),
        locationId: b.locationId,
        restaurantId: b.restaurantId,
        imageSize: b.imageSize,
    }));
}

/**
 * Photos usually arrive after a post is live, so an existing post may take them
 * from its file. This never changes text and never touches a post edited in the
 * admin panel: the cover is set only when the post has none, and image blocks
 * are added only when the post has no image block yet and every other block is
 * still identical, in order, to the file's.
 */
async function addPhotos(name: string, postId: string, currentCover: string | null, data: ContentFile): Promise<boolean> {
    let changed = false;
    if (!currentCover && data.featureImage) {
        await db.update(blogPosts).set({ featureImage: data.featureImage, updatedAt: new Date() }).where(eq(blogPosts.id, postId));
        console.log(`[content] ${data.locale}/${data.slug}: cover image added`);
        changed = true;
    }

    const fileBlocks = await keptBlocks(name, data);
    if (!fileBlocks.some((b) => b.blockType === "image")) return changed;
    const current = (await db.select().from(blogContentBlocks).where(eq(blogContentBlocks.blogPostId, postId)))
        .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
    if (current.some((b) => b.blockType === "image")) return changed;

    const key = (type: string, content: string | null, restaurantId: string | null | undefined) =>
        JSON.stringify([type, content, restaurantId ?? null]);
    const now = current.map((b) => key(b.blockType, b.content, b.restaurantId));
    const want = fileBlocks.filter((b) => b.blockType !== "image").map((b) => key(b.blockType, storedContent(b), b.restaurantId));
    if (now.length !== want.length || now.some((k, i) => k !== want[i])) {
        console.warn(`[content] ${name}: edited since import, image blocks not added (add them in the admin panel)`);
        return changed;
    }
    await db.transaction(async (tx) => {
        await tx.delete(blogContentBlocks).where(eq(blogContentBlocks.blogPostId, postId));
        await tx.insert(blogContentBlocks).values(blockRows(postId, fileBlocks));
        await tx.update(blogPosts).set({ updatedAt: new Date() }).where(eq(blogPosts.id, postId));
    });
    console.log(`[content] ${data.locale}/${data.slug}: image blocks added`);
    return true;
}

async function importOne(name: string, data: ContentFile, authorId: string | undefined): Promise<"created" | "exists" | "updated" | "skipped"> {
    const [existing] = await db
        .select({ id: blogPosts.id, featureImage: blogPosts.featureImage })
        .from(blogPosts)
        .where(and(eq(blogPosts.locale, data.locale), eq(blogPosts.slug, data.slug)))
        .limit(1);
    if (existing) return (await addPhotos(name, existing.id, existing.featureImage, data)) ? "updated" : "exists";

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

    const blocks = await keptBlocks(name, data);

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
        await tx.insert(blogContentBlocks).values(blockRows(post.id, blocks));
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

    const tally = { created: 0, updated: 0, exists: 0, skipped: 0 };
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
    console.log(`[content] done: ${tally.created} created, ${tally.updated} given photos, ${tally.exists} already there, ${tally.skipped} skipped`);
    await applyCorrections();
}

/**
 * Text corrections to live posts, listed in be/content/corrections.json:
 *   [{ locale, slug, block, becomes, reason, date }]
 * `block` is the exact current content of one block; `becomes` is its new
 * content, or null to remove the block. A correction applies only while a block
 * still holds exactly `block`, so it runs once, never touches a block edited in
 * admin since, and can stay in the file as a record. Update the post's content
 * file the same way so the repo matches what is live.
 */
export const CORRECTIONS_FILE = path.resolve(__dirname, "../../content/corrections.json");

interface Correction {
    locale: Locale;
    slug: string;
    block: string;
    becomes: string | null;
    reason?: string;
}

async function applyCorrections(): Promise<void> {
    if (!existsSync(CORRECTIONS_FILE)) return;
    let list: Correction[];
    try {
        list = JSON.parse(readFileSync(CORRECTIONS_FILE, "utf8"));
        if (!Array.isArray(list)) throw new Error("not an array");
    } catch (e) {
        console.error("[content] corrections.json unreadable, skipped", e);
        return;
    }
    let applied = 0;
    for (const c of list) {
        if (!c || !isLocale(c.locale) || typeof c.slug !== "string" || typeof c.block !== "string" || !(typeof c.becomes === "string" || c.becomes === null)) {
            console.error("[content] correction skipped, needs { locale, slug, block, becomes }", c?.slug);
            continue;
        }
        try {
            const [post] = await db
                .select({ id: blogPosts.id })
                .from(blogPosts)
                .where(and(eq(blogPosts.locale, c.locale), eq(blogPosts.slug, c.slug)))
                .limit(1);
            if (!post) continue;
            const blocks = await db.select().from(blogContentBlocks).where(eq(blogContentBlocks.blogPostId, post.id));
            const target = blocks.find((b) => b.content === c.block);
            if (!target) {
                const done = c.becomes === null || blocks.some((b) => b.content === c.becomes);
                if (!done) console.warn(`[content] correction for ${c.locale}/${c.slug} not applied: the block was edited since (${c.reason ?? ""})`);
                continue;
            }
            await db.transaction(async (tx) => {
                if (c.becomes === null) await tx.delete(blogContentBlocks).where(eq(blogContentBlocks.id, target.id));
                else await tx.update(blogContentBlocks).set({ content: c.becomes }).where(eq(blogContentBlocks.id, target.id));
                await tx.update(blogPosts).set({ updatedAt: new Date() }).where(eq(blogPosts.id, post.id));
            });
            applied++;
            console.log(`[content] corrected ${c.locale}/${c.slug}: ${c.reason ?? ""}`);
        } catch (e) {
            console.error(`[content] correction for ${c.locale}/${c.slug} failed`, e);
        }
    }
    console.log(`[content] corrections: ${applied} applied`);
}

if (require.main === module) {
    importContent()
        .catch((e) => console.error("[content] import aborted", e))
        .finally(() => process.exit(0));
}
