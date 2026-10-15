/**
 * Menu structure. Labels are keys into the `common` dictionary area so the
 * same menu serves every language; `href` is the unprefixed path, turned
 * into `/ms/...` or `/zh/...` with `pathFor` at render time. The guard test
 * checks every href resolves to a real route.
 */

import { TTKLIA_URL } from "./business.ts";

/**
 * The ttklia site, the primary conversion (AGENTS.md "Conversion"). External, so it
 * opens in a new tab; the UTMs tell ttklia's analytics which link was used.
 */
const ttklia = (placement: string) => `${TTKLIA_URL}/?utm_source=teeko&utm_medium=nav&utm_campaign=${placement}`;

export type NavLabelKey = "home" | "restaurants" | "travelSim" | "blog" | "airportTransfer";
export type FooterLabelKey = NavLabelKey | "privacyPolicy" | "termsOfService" | "privacy" | "terms";
export type FooterTitleKey = "navigation" | "resources";

export interface NavItem<K extends string = FooterLabelKey> {
    labelKey: K;
    href: string;
    external?: boolean;
    special?: boolean;
    /** Exists in English only (legal pages): link the English URL from every language. */
    englishOnly?: boolean;
}

export interface FooterSection {
    titleKey: FooterTitleKey;
    links: NavItem[];
}

export const MAIN_MENU: NavItem<NavLabelKey>[] = [
    { labelKey: "home", href: "/" },
    { labelKey: "restaurants", href: "/restaurants" },
    { labelKey: "travelSim", href: "/travel-sim-malaysia" },
    { labelKey: "blog", href: "/blog" },
    { labelKey: "airportTransfer", href: ttklia("main_menu"), external: true, special: true },
];

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        titleKey: "navigation",
        links: [
            { labelKey: "home", href: "/" },
            { labelKey: "travelSim", href: "/travel-sim-malaysia" },
            { labelKey: "restaurants", href: "/restaurants" },
            { labelKey: "blog", href: "/blog" },
            { labelKey: "airportTransfer", href: ttklia("footer"), external: true },
        ],
    },
    {
        titleKey: "resources",
        links: [
            { labelKey: "privacyPolicy", href: "/privacy", englishOnly: true },
            { labelKey: "termsOfService", href: "/terms", englishOnly: true },
        ],
    },
];

export const LEGAL_LINKS: NavItem[] = [
    { labelKey: "privacy", href: "/privacy", englishOnly: true },
    { labelKey: "terms", href: "/terms", englishOnly: true },
];
