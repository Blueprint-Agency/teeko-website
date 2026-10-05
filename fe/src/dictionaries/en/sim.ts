// Travel SIM pages: /travel-sim-malaysia and /travel-sim-malaysia/[slug].
// Package names, descriptions and features come from the database, not from here.
const sim = {
    meta: {
        title: "Travel SIM Packages in Malaysia",
        description: "Book a travel SIM online and collect it at KLIA2 when you land, or at Lalaport BBCC in Bukit Bintang. Compare packages by provider and duration.",
    },
    breadcrumb: "Travel SIM Malaysia",
    duration: {
        format: "{n} {unit}",
        days: "days",
        hours: "hours",
    },
    freeBadge: "(FREE)",
    list: {
        title: "Travel SIM Packages in Malaysia",
        features: {
            noId: {
                title: "No ID Required",
                body: "Fast and easy signup. Just register with your email address to get started instantly.",
            },
            collection: {
                title: "Collect at KLIA2 or Lalaport",
                body: "Book anytime, then collect your SIM at the tour centre at KLIA2 or at Lalaport BBCC in Bukit Bintang.",
            },
            data: {
                title: "Unlimited 5G Data",
                body: "Enjoy high-speed nationwide coverage for every journey across Malaysia.",
            },
        },
        pickTitle: "Pick a travel package that suits your travel needs!",
        pickBody: "Compare data plans by provider and length of stay, then book the one that fits your trip.",
        provider: "Provider",
        allProviders: "All Providers",
        duration: "Duration",
        allDurations: "All Durations",
        viewDetails: "View Details",
        noMatch: "No Travel SIM packages match your filters.",
        clearFilters: "Clear all filters",
        faq: {
            title: "Frequently Asked Questions",
            where: {
                q: "Where is this travel SIM card available?",
                a: "Teeko Travel SIM is currently only available for use in Malaysia.",
            },
            signUp: {
                q: "How do I sign up for a travel SIM card?",
                a: "No ID is required. You can book anytime and simply sign up with your email address to get started.",
            },
            packages: {
                q: "What travel SIM card packages are available?",
                a: "We offer various packages ranging from 12 hours up to 7 days to suit your travel needs.",
            },
            eligible: {
                q: "Who is eligible to book online for a travel SIM card?",
                a: "Users must be at least 18 years old to register. Those between 16 and 18 may use the service with parental or legal guardian supervision.",
            },
            redeem: {
                q: "How do I redeem my Travel SIM card?",
                a: "After you book, you receive an email with a verification code and QR code. Show it at the tour centre at KLIA2 or at Lalaport BBCC to collect your SIM.",
            },
            cancel: {
                q: "Can I cancel my travel SIM booking?",
                a: "Yes, bookings can be cancelled via the \"My Travel SIM Bookings\" section of your profile page.",
            },
        },
    },
    detail: {
        notFoundTitle: "Package Not Found",
        metaFallbackDescription: "Learn more about {name}",
        badge: "Travel SIM",
        coreFeatures: "Core Product Features",
        paymentMethods: "Supports Multiple Payment Methods",
        fallbackPayments: {
            local: {
                title: "Local digital payment methods",
                alt: "Local payments",
                body: "It supports major e-wallets in Malaysia, such as DuitNow, ShopeePay, Touch 'n Go eWallet, Grabpay, and Boost.",
            },
            international: {
                title: "International payment methods",
                alt: "International payments",
                body: "It is compatible with credit/debit cards (Visa/MasterCard), FPX online banking, and commonly used international payment channels such as Alipay and WeChat Pay.",
            },
            automated: {
                title: "Automated processing flow",
                alt: "Automation",
                body: "Funds arrive in real time, and the system automatically completes SIM card activation and commission settlement, improving efficiency and transparency.",
            },
        },
        otherPackages: "Other Packages",
        moreFromProvider: "Discover more options from {provider}",
        viewAll: "View All SIMs →",
    },
};

export default sim;
