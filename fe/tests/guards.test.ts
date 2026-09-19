/**
 * Guard tests: the rules in AGENTS.md, enforced.
 *
 * Runs on plain `node --test` (Node >= 23.6, type stripping built in), so it
 * needs no test framework and no extra dependency. It is part of `npm test`,
 * which the Dockerfile runs before `next build`; a failure here stops the
 * deploy.
 *
 * Every whitelist entry below carries the reason it is legitimate. An entry
 * without a reason is a loophole, not an exception.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

import * as biz from "../src/lib/business.ts";
import { MAIN_MENU, FOOTER_SECTIONS, LEGAL_LINKS } from "../src/lib/navigation.ts";
import nextConfig from "../next.config.ts";

const FE_ROOT = join(import.meta.dirname, "..");
const SRC = join(FE_ROOT, "src");
const APP = join(SRC, "app");
const BE_EMAIL = join(FE_ROOT, "..", "be", "src", "utils", "email.ts");

// ---------------------------------------------------------------------------
// File collection
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
    }
    return out;
}

function rel(file: string): string {
    return relative(FE_ROOT, file).split("\\").join("/");
}

/**
 * Published scope: every source file whose strings can reach a visitor,
 * plus the backend email templates. Admin-only UI is excluded because it is
 * behind login and never indexed, so its strings are not client claims.
 */
const ADMIN_ONLY = [
    "src/app/admin/",
    "src/components/admin/",
    "src/components/layout/AdminSidebar.tsx",
    "src/components/layout/AdminRedirect.tsx",
];

const PUBLISHED_FILES: string[] = [
    ...walk(SRC).filter((f) => !ADMIN_ONLY.some((p) => rel(f).startsWith(p))),
    ...(existsSync(BE_EMAIL) ? [BE_EMAIL] : []),
];

interface SourceFile {
    path: string;
    text: string;
    lines: string[];
}

function load(file: string): SourceFile {
    const text = readFileSync(file, "utf8");
    return { path: rel(file), text, lines: text.split(/\r?\n/) };
}

const PUBLISHED: SourceFile[] = PUBLISHED_FILES.map(load);

// ---------------------------------------------------------------------------
// 1. Business facts are byte-identical everywhere they appear
// ---------------------------------------------------------------------------

test("legal name is never retyped differently from lib/business.ts", () => {
    // Search the shortest distinctive stems (registration numbers), not the
    // whole string, so a truncated or re-punctuated copy is still caught.
    const stems = ["201601011927", "1182858"];
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        f.lines.forEach((line, i) => {
            if (stems.some((s) => line.includes(s)) && !line.includes(biz.LEGAL_NAME)) {
                bad.push(`${f.path}:${i + 1}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Lines mention the company but not as LEGAL_NAME verbatim:\n${bad.join("\n")}`);
});

test("registered address is never retyped differently from lib/business.ts", () => {
    const stems = ["Sunsuria", "47810", "Persiaran Mahogany"];
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        f.lines.forEach((line, i) => {
            if (stems.some((s) => line.includes(s)) && !line.includes(biz.ADDRESS)) {
                bad.push(`${f.path}:${i + 1}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Lines mention the address but not as ADDRESS verbatim:\n${bad.join("\n")}`);
});

test("only approved @teeko.ai addresses are published", () => {
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        for (const m of f.text.matchAll(/[\w.+-]+@teeko\.ai/g)) {
            if (!biz.ALLOWED_EMAILS.includes(m[0])) bad.push(`${f.path}: ${m[0]}`);
        }
    }
    assert.deepEqual(bad, [], `Email addresses not in ALLOWED_EMAILS:\n${bad.join("\n")}`);
});

test("every ttklia.com reference is the canonical https URL", () => {
    // The primary conversion target. A bare "ttklia.com", an http:// form or
    // a www. variant is a different link in analytics and a possible
    // redirect hop for the visitor. UTM params after the canonical URL are fine.
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        let idx = f.text.indexOf("ttklia.com");
        while (idx !== -1) {
            const start = idx - (biz.TTKLIA_URL.length - "ttklia.com".length);
            const candidate = f.text.slice(Math.max(0, start), idx + "ttklia.com".length);
            const next = f.text[idx + "ttklia.com".length] ?? "";
            if (candidate !== biz.TTKLIA_URL || (next !== "" && !/[/?"'`\s<)]/.test(next))) {
                const line = f.text.slice(0, idx).split("\n").length;
                bad.push(`${f.path}:${line}`);
            }
            idx = f.text.indexOf("ttklia.com", idx + 1);
        }
    }
    assert.deepEqual(bad, [], `ttklia.com references that are not TTKLIA_URL:\n${bad.join("\n")}`);
});

// ---------------------------------------------------------------------------
// 2. Client-supplied figures carry a dated source
// ---------------------------------------------------------------------------

test("every hero stat records who supplied it and when", () => {
    for (const stat of biz.HERO_STATS) {
        assert.match(
            stat.source,
            /\d{4}-\d{2}-\d{2}/,
            `HERO_STATS "${stat.label}" has no dated source; a figure without one is a guess`,
        );
        assert.ok(stat.source.trim().length > 12, `HERO_STATS "${stat.label}" source is too short to be a real reason`);
    }
});

test("hero stats are rendered from HERO_STATS, not typed into the component", () => {
    const hero = load(join(SRC, "components", "sections", "HeroSection.tsx"));
    assert.ok(hero.text.includes("HERO_STATS"), "HeroSection.tsx must import HERO_STATS");
    for (const stat of biz.HERO_STATS) {
        assert.ok(
            !hero.text.includes(`>${stat.value}<`),
            `HeroSection.tsx has "${stat.value}" typed inline; render it from HERO_STATS`,
        );
    }
});

// ---------------------------------------------------------------------------
// 3. Promissory and unverifiable claims
// ---------------------------------------------------------------------------

interface BannedPattern {
    re: RegExp;
    why: string;
}

const BANNED_CLAIMS: BannedPattern[] = [
    { re: /\bguarantee[sd]?\b/i, why: "outcome promise the business cannot back" },
    { re: /(^|[^\w&])#\s?1\b/, why: "ranking claim with no source" },
    { re: /\bno\.?\s?1\b/i, why: "ranking claim with no source" },
    { re: /\bnumber one\b/i, why: "ranking claim with no source" },
    { re: /\bcheapest\b/i, why: "price superlative across third-party providers we do not control" },
    { re: /\blowest price/i, why: "price superlative across third-party providers we do not control" },
    { re: /\b100\s?%\s?(satisf|guarantee|safe|secure|free|refund)/i, why: "absolute promise" },
    { re: /\brisk[- ]free\b/i, why: "absolute promise" },
    { re: /\bbest in (malaysia|kl|kuala lumpur|asia|the world)\b/i, why: "superlative with no evidence" },
    { re: /\bofficial(ly)? (partner|agent|hub|distributor)\b/i, why: "partnership claim needs a signed agreement on file" },
];

/**
 * Files excused from the claims sweep, each with the reason.
 */
const CLAIMS_WHITELIST: Record<string, string> = {
    // Legal documents adapted from a transport-booking product; they use
    // "guarantee" in the negative (limitation of liability) and describe an
    // "official agent" role that belongs to the source document. Replacing
    // them is OPEN-ITEMS #3; until then they are legal text, not marketing.
    "src/app/terms/page.tsx": "legal document pending replacement, OPEN-ITEMS #3",
    "src/app/privacy/page.tsx": "legal document pending replacement, OPEN-ITEMS #3",
};

test("published copy contains no promissory or unverifiable claims", () => {
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        if (CLAIMS_WHITELIST[f.path]) continue;
        f.lines.forEach((line, i) => {
            for (const { re, why } of BANNED_CLAIMS) {
                if (re.test(line)) bad.push(`${f.path}:${i + 1}  [${why}]  ${line.trim().slice(0, 100)}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Banned claims found:\n${bad.join("\n")}`);
});

// ---------------------------------------------------------------------------
// 4. Fabricated sample data must not reach a route
// ---------------------------------------------------------------------------

test("sampleRestaurants is not reachable from any page", () => {
    // src/data/sampleRestaurants.ts is invented placeholder content with
    // made-up ratings and review counts. It may stay in the repo as a dev
    // fixture but nothing a visitor can load may import it, directly or
    // through another component.
    const files = walk(SRC);
    const byPath = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

    function resolveImport(from: string, spec: string): string | null {
        let base: string;
        if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
        else if (spec.startsWith(".")) base = join(from, "..", spec);
        else return null;
        for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
            const candidate = base + ext;
            if (byPath.has(candidate)) return candidate;
        }
        return null;
    }

    function importsOf(file: string): string[] {
        const text = byPath.get(file) ?? "";
        const out: string[] = [];
        for (const m of text.matchAll(/from\s+["']([^"']+)["']/g)) {
            const r = resolveImport(file, m[1]);
            if (r) out.push(r);
        }
        return out;
    }

    const target = join(SRC, "data", "sampleRestaurants.ts");
    const pages = files.filter((f) => f.startsWith(APP) && /(page|layout)\.tsx$/.test(f));
    const offenders: string[] = [];
    for (const page of pages) {
        const seen = new Set<string>();
        const stack = [page];
        while (stack.length) {
            const cur = stack.pop()!;
            if (seen.has(cur)) continue;
            seen.add(cur);
            if (cur === target) {
                offenders.push(rel(page));
                break;
            }
            stack.push(...importsOf(cur));
        }
    }
    assert.deepEqual(offenders, [], `Routes that can render fabricated sample data:\n${offenders.join("\n")}`);
});

// ---------------------------------------------------------------------------
// 5. Internal links, redirects and the sitemap resolve to real routes
// ---------------------------------------------------------------------------

function collectRoutes(): string[] {
    const routes: string[] = [];
    for (const file of walk(APP)) {
        if (!/[/\\]page\.tsx?$/.test(file)) continue;
        const dir = relative(APP, join(file, "..")).split("\\").join("/");
        const segments = dir
            .split("/")
            .filter((s) => s.length > 0 && !/^\(.*\)$/.test(s)); // drop route groups
        routes.push("/" + segments.join("/"));
    }
    // Metadata routes generated by src/app/sitemap.ts and robots.ts
    if (existsSync(join(APP, "sitemap.ts"))) routes.push("/sitemap.xml");
    if (existsSync(join(APP, "robots.ts"))) routes.push("/robots.txt");
    return routes;
}

const ROUTES = collectRoutes();

function routeMatches(href: string, route: string): boolean {
    const a = href.split("/").filter(Boolean);
    const b = route.split("/").filter(Boolean);
    if (a.length !== b.length) return false;
    return b.every((seg, i) => /^\[.*\]$/.test(seg) || seg === a[i]);
}

function resolves(href: string, rewritePrefixes: string[]): boolean {
    const path = href.split(/[?#]/)[0];
    if (rewritePrefixes.some((p) => path.startsWith(p))) return true;
    return ROUTES.some((r) => routeMatches(path, r));
}

async function rewritePrefixes(): Promise<string[]> {
    const rewrites = typeof nextConfig.rewrites === "function" ? await nextConfig.rewrites() : [];
    const list = Array.isArray(rewrites) ? rewrites : [...rewrites.beforeFiles, ...rewrites.afterFiles, ...rewrites.fallback];
    return list.map((r) => r.source.replace(/:\w+\*?$/, ""));
}

test("navigation and footer links resolve to existing routes", async () => {
    const prefixes = await rewritePrefixes();
    const links = [...MAIN_MENU, ...FOOTER_SECTIONS.flatMap((s) => s.links), ...LEGAL_LINKS].filter((l) => !l.external);
    const bad = links.filter((l) => l.href.startsWith("/") && !resolves(l.href, prefixes)).map((l) => `${l.label} -> ${l.href}`);
    assert.deepEqual(bad, [], `Nav links to routes that do not exist:\n${bad.join("\n")}`);
});

test("next.config redirects land on existing routes", async () => {
    const prefixes = await rewritePrefixes();
    const redirects = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];
    const bad = redirects
        .filter((r) => r.destination.startsWith("/") && !resolves(r.destination, prefixes))
        .map((r) => `${r.source} -> ${r.destination}`);
    assert.deepEqual(bad, [], `Redirects to routes that do not exist (the printed QR codes depend on these):\n${bad.join("\n")}`);
});

test("sitemap static pages exist", async () => {
    const prefixes = await rewritePrefixes();
    const sitemap = readFileSync(join(APP, "sitemap.ts"), "utf8");
    const block = sitemap.match(/const staticPages = \[([\s\S]*?)\]\.map/);
    assert.ok(block, "could not find staticPages array in sitemap.ts");
    const entries = [...block[1].matchAll(/["'`]([^"'`]*)["'`]/g)].map((m) => m[1] || "/");
    const bad = entries.filter((e) => !resolves(e, prefixes));
    assert.deepEqual(bad, [], `Sitemap lists routes that do not exist:\n${bad.join("\n")}`);
});

test("literal internal hrefs across the frontend resolve to existing routes", async () => {
    const prefixes = await rewritePrefixes();
    const bad: string[] = [];
    // Includes admin files on purpose: a dead link in the admin panel wastes
    // the client's time just the same.
    for (const file of walk(SRC)) {
        const f = load(file);
        f.lines.forEach((line, i) => {
            for (const m of line.matchAll(/(?:href=|\.push\(|\.replace\(|redirect\()["'`](\/[^"'`$]*)["'`]/g)) {
                if (!resolves(m[1], prefixes)) bad.push(`${f.path}:${i + 1}  ${m[1]}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Links to routes that do not exist:\n${bad.join("\n")}`);
});
