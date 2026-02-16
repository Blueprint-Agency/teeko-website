export interface NavItem {
    label: string;
    href: string;
    external?: boolean;
    special?: boolean;
}

export interface FooterSection {
    title: string;
    links: NavItem[];
}

export const MAIN_MENU: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "Travel SIM", href: "/sim" },
    { label: "Blog", href: "/blog" },
];

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: "Navigation",
        links: [
            { label: "Home", href: "/" },
            { label: "Travel SIM", href: "/sim" },
            { label: "Restaurants", href: "/restaurants" },
            { label: "Blog", href: "/blog" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ]
    }
];

export const LEGAL_LINKS: NavItem[] = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
];
