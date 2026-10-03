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
    // Bahasa Malaysia equivalents (dictionaries/ms, translated database text).
    { re: /\b(dijamin|jaminan)\b/i, why: "BM: outcome promise the business cannot back" },
    { re: /\b(termurah|paling murah|harga terendah)\b/i, why: "BM: price superlative across third-party providers" },
    { re: /\bnombor (satu|1)\b/i, why: "BM: ranking claim with no source" },
    { re: /\bterbaik di (malaysia|kl|kuala lumpur|asia|dunia)\b/i, why: "BM: superlative with no evidence" },
    { re: /\b(rakan kongsi|ejen|hab) rasmi\b/i, why: "BM: partnership claim needs a signed agreement on file" },
    // Simplified Chinese equivalents (dictionaries/zh).
    { re: /保证|担保/, why: "ZH: outcome promise the business cannot back" },
    { re: /最便宜|最低价/, why: "ZH: price superlative across third-party providers" },
    { re: /排名第一|第一名|全马第一/, why: "ZH: ranking claim with no source" },
    { re: /马来西亚最好|全马最好|最佳选择/, why: "ZH: superlative with no evidence" },
    { re: /官方(合作伙伴|代理|伙伴)/, why: "ZH: partnership claim needs a signed agreement on file" },
];

/**
 * Files excused from the claims sweep, each with the reason.
 */
const CLAIMS_WHITELIST: Record<string, string> = {
    // Legal documents adapted from a transport-booking product; they use
    // "guarantee" in the negative (limitation of liability) and describe an
    // "official agent" role that belongs to the source document. Replacing
    // them is OPEN-ITEMS #3; until then they are legal text, not marketing.
    "src/app/[locale]/terms/page.tsx": "legal document pending replacement, OPEN-ITEMS #3",
    "src/app/[locale]/privacy/page.tsx": "legal document pending replacement, OPEN-ITEMS #3",
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
// 5. List endpoints are read through asList()
// ---------------------------------------------------------------------------

test("every list endpoint fetch normalises the response with asList()", () => {
    // `/restaurants` changed from returning an array to `{data, pagination}`
    // when pagination was added (2026). Callers doing `Array.isArray(x) ? x : []`
    // or reading `.length` silently saw an empty list: the homepage lost its
    // featured section and the sitemap lost all 79 restaurant pages, with no
    // error anywhere. Reading list responses through asList() survives both
    // shapes, so this requires it.
    const LIST_ENDPOINTS = ["/restaurants", "/blog/posts", "/sim/packages", "/sim/providers"];
    const BACKTICK = String.fromCharCode(96);
    const bad: string[] = [];
    for (const file of walk(SRC)) {
        const f = load(file);
        // The admin panel drives pagination deliberately and reads the
        // envelope itself, as does the public restaurants listing page.
        if (f.path.startsWith("src/app/admin/") || f.path.startsWith("src/components/admin/")) continue;
        if (f.path === "src/app/[locale]/restaurants/RestaurantsPage.tsx") continue;
        // Its server component passes the whole {data, pagination} envelope to
        // that page as initial state, so it must not flatten it.
        if (f.path === "src/app/[locale]/restaurants/page.tsx") continue;

        f.lines.forEach((line, i) => {
            const hit = LIST_ENDPOINTS.find((e) => line.includes(e + "?") || line.includes(e + BACKTICK));
            if (!hit || !line.includes("fetch(")) return;
            // asList may be applied on this line or within the next few.
            const window = f.lines.slice(i, i + 12).join(" ");
            if (!window.includes("asList")) bad.push(`${f.path}:${i + 1}  ${hit}`);
        });
    }
    assert.deepEqual(bad, [], `List endpoint fetches that do not use asList(): ${bad.join(" | ")}`);
});

test("no sitemap entry claims it was modified now", () => {
    // `lastModified: new Date()` is today's date on every request, for every
    // visit, forever. Ten URLs did that, so a third of the sitemap was
    // permanently "just changed"; Google discounts a sitemap whose dates never
    // settle, and this one had not been re-read since March 2026. A date must
    // come from the database, or be omitted.
    const sitemap = load(join(APP, "sitemap.ts"));
    const bad: string[] = [];
    sitemap.lines.forEach((line, i) => {
        if (/lastModified:\s*new Date\(\s*\)/.test(line)) bad.push(`src/app/sitemap.ts:${i + 1}`);
    });
    assert.deepEqual(bad, [], `Sitemap entries hardcoding the current time as lastmod: ${bad.join(" | ")}`);
});

test("the sitemap asks paginated endpoints for every item", () => {
    // Without an explicit limit the restaurants endpoint returns its first
    // page of 10, so the sitemap would list 10 of 79 restaurants and look fine.
    const sitemap = load(join(APP, "sitemap.ts"));
    const line = sitemap.lines.find((l) => l.includes("/restaurants?") && l.includes("fetch("));
    assert.ok(line, "sitemap.ts must fetch /restaurants with query parameters");
    assert.match(line!, /limit=/, "the sitemap's /restaurants fetch must set an explicit limit");
    assert.match(line!, /status=ACTIVE/, "the sitemap must request only ACTIVE restaurants");
});

// ---------------------------------------------------------------------------
// 6. Internal links, redirects and the sitemap resolve to real routes
// ---------------------------------------------------------------------------

function collectRoutes(): string[] {
    const routes: string[] = [];
    for (const file of walk(APP)) {
        if (!/[/\\]page\.tsx?$/.test(file)) continue;
        const dir = relative(APP, join(file, "..")).split("\\").join("/");
        const segments = dir
            .split("/")
            .filter((s) => s.length > 0 && !/^\(.*\)$/.test(s)) // drop route groups
            // Public pages live under app/[locale]/ and are linked by their
            // unprefixed path (the language prefix is added by pathFor).
            .filter((s, i) => !(i === 0 && s === "[locale]"));
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
    const list = !rewrites ? [] : Array.isArray(rewrites) ? rewrites : [...(rewrites.beforeFiles ?? []), ...(rewrites.afterFiles ?? []), ...(rewrites.fallback ?? [])];
    return list.map((r) => r.source.replace(/:\w+\*?$/, ""));
}

test("navigation and footer links resolve to existing routes", async () => {
    const prefixes = await rewritePrefixes();
    const links = [...MAIN_MENU, ...FOOTER_SECTIONS.flatMap((s) => s.links), ...LEGAL_LINKS].filter((l) => !l.external);
    const bad = links.filter((l) => l.href.startsWith("/") && !resolves(l.href, prefixes)).map((l) => `${l.labelKey} -> ${l.href}`);
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
    const block = sitemap.match(/const staticPages = \[([\s\S]*?)\]\.(?:flat)?[mM]ap/);
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
            // Locale-aware links: pathFor(locale, "/x") and localePath("/x").
            for (const m of line.matchAll(/(?:pathFor\([^,()]+,\s*|localePath\()["'`](\/[^"'`$]*)["'`]/g)) {
                if (!resolves(m[1], prefixes)) bad.push(`${f.path}:${i + 1}  ${m[1]}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Links to routes that do not exist:\n${bad.join("\n")}`);
});

// ---------------------------------------------------------------------------
// 7. Three languages: English (unprefixed), Bahasa Malaysia (/ms), 中文 (/zh)
// ---------------------------------------------------------------------------

test("every public page lives under app/[locale]", () => {
    // A page outside [locale] has no language, no <html lang> and no hreflang,
    // and the proxy would rewrite its URL to /en/... where it does not exist.
    const bad = walk(APP)
        .map(rel)
        .filter((f) => /\/page\.tsx?$/.test(f))
        .filter((f) => !f.startsWith("src/app/[locale]/") && !f.startsWith("src/app/admin/"));
    assert.deepEqual(bad, [], `Pages outside app/[locale] (move them, or add them to the proxy matcher exclusions with a reason):\n${bad.join("\n")}`);
});

test("the locale root and the chrome every page renders never read request headers", () => {
    // headers()/cookies() in the root layout or in Navigation/Footer opts the
    // entire site out of static rendering. Persistence Chiro shipped exactly
    // this once (a header-based language switcher) and had to revert it.
    const files = [
        "src/app/[locale]/layout.tsx",
        "src/components/layout/RootDocument.tsx",
        "src/components/layout/Navigation.tsx",
        "src/components/layout/Footer.tsx",
        "src/components/layout/LanguageSwitcher.tsx",
        "src/components/providers/LocaleProvider.tsx",
    ];
    const bad = files.filter((f) => existsSync(join(FE_ROOT, f)) && /from\s+["']next\/headers["']/.test(readFileSync(join(FE_ROOT, f), "utf8")));
    assert.deepEqual(bad, [], `Dynamic request APIs in always-rendered files:\n${bad.join("\n")}`);
});

test("public internal links carry the language prefix", () => {
    // A bare href="/restaurants" in public code sends a BM or 中文 visitor to
    // the English site. Links must go through pathFor(locale, ...) on the
    // server or localePath(...) in client components. Admin is English-only.
    const ALLOWED: Record<string, string> = {
        // Rendered outside every layout for unmatched URLs; links all three homes.
        "src/app/global-not-found.tsx": "language-neutral 404",
        // Dead code: imported by no route (OPEN-ITEMS #12, decide whether to delete).
        "src/components/sections/HomeSearch.tsx": "unreachable, OPEN-ITEMS #12",
        "src/components/sections/ListingSection.tsx": "unreachable, OPEN-ITEMS #12",
    };
    const bad: string[] = [];
    for (const f of PUBLISHED) {
        if (ALLOWED[f.path] || f.path.startsWith("../")) continue;
        f.lines.forEach((line, i) => {
            for (const m of line.matchAll(/(?:href=|\.push\(|\.replace\(|redirect\()["'`](\/(?!\/)[^"'`$]*)["'`]/g)) {
                // Static assets (images, icons) are not pages, and the admin
                // panel is English-only with its own root layout.
                if (/\.[a-z0-9]{2,4}$/i.test(m[1].split(/[?#]/)[0])) continue;
                if (m[1] === "/admin" || m[1].startsWith("/admin/")) continue;
                bad.push(`${f.path}:${i + 1}  ${m[1]}`);
            }
        });
    }
    assert.deepEqual(bad, [], `Internal links without the language prefix (use pathFor/localePath):\n${bad.join("\n")}`);
});

test("page metadata goes through pageMetadata()", () => {
    // pageMetadata() is the one place canonical and hreflang are computed,
    // from the same map the language switcher uses. A page that hand-writes
    // its metadata can point hreflang at a URL that 404s.
    const bad: string[] = [];
    for (const file of walk(join(APP, "[locale]"))) {
        if (!/[/\\]page\.tsx?$/.test(file)) continue;
        const text = readFileSync(file, "utf8");
        const declares = /export\s+(const\s+metadata|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(text);
        if (declares && !text.includes("pageMetadata(")) bad.push(rel(file));
    }
    assert.deepEqual(bad, [], `Pages declaring metadata without pageMetadata():\n${bad.join("\n")}`);
});

test("BM and 中文 dictionaries have no empty strings", () => {
    // Types already force every key to exist; an empty string would still
    // compile and render a blank button.
    const bad: string[] = [];
    for (const locale of ["ms", "zh"]) {
        const dir = join(SRC, "dictionaries", locale);
        for (const file of walk(dir)) {
            const f = load(file);
            f.lines.forEach((line, i) => {
                if (/:\s*(""|'')\s*,?\s*$/.test(line)) bad.push(`${f.path}:${i + 1}`);
            });
        }
    }
    assert.deepEqual(bad, [], `Empty dictionary values:\n${bad.join("\n")}`);
});
