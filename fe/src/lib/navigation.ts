/**
 * Menu structure. Labels are keys into the `common` dictionary area so the
 * same menu serves every language; `href` is the unprefixed path, turned
 * into `/ms/...` or `/zh/...` with `pathFor` at render time. The guard test
 * checks every href resolves to a real route.
 */

export type NavLabelKey = "home" | "restaurants" | "travelSim" | "blog";
export type FooterLabelKey = NavLabelKey | "privacyPolicy" | "termsOfService" | "privacy" | "terms";
export type FooterTitleKey = "navigation" | "resources";

export interface NavItem<K extends string = FooterLabelKey> {
    labelKey: K;
    href: string;
    external?: boolean;
    special?: boolean;
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
];

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        titleKey: "navigation",
        links: [
            { labelKey: "home", href: "/" },
            { labelKey: "travelSim", href: "/travel-sim-malaysia" },
            { labelKey: "restaurants", href: "/restaurants" },
            { labelKey: "blog", href: "/blog" },
        ],
    },
    {
        titleKey: "resources",
        links: [
            { labelKey: "privacyPolicy", href: "/privacy" },
            { labelKey: "termsOfService", href: "/terms" },
        ],
    },
];

export const LEGAL_LINKS: NavItem[] = [
    { labelKey: "privacy", href: "/privacy" },
    { labelKey: "terms", href: "/terms" },
];
