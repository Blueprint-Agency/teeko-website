// Home page: hero, featured places, travel SIM strip, latest blog posts.
const home = {
    hero: {
        titleBefore: "Travel Malaysia ",
        titleHighlight: "Easy",
        titleAfter: " with Teeko",
        subtitle: "Places to eat, a travel SIM to collect at KLIA2, and guides for your trip",
        cta: "Book your travel SIM",
        goToSlide: "Go to slide {n}",
        // Keyed by the English label in HERO_STATS (lib/business.ts); the figures stay there.
        stats: {
            Places: "Places",
            Reviews: "Reviews",
            "Avg Rating": "Avg Rating",
            Cities: "Cities",
        },
    },
    featured: {
        title: "Featured Places",
        description: "Restaurants with their Google and TripAdvisor ratings",
    },
    esim: {
        title: "Our Travel SIM Providers",
        description: "Data plans you book online and collect at KLIA2 when you land",
        bookNow: "Book Now",
        viewAll: "View All Travel SIM Packages",
        // Duration units as stored on a package; an unknown unit is shown as stored.
        units: {
            day: "day",
            days: "days",
            week: "week",
            weeks: "weeks",
            month: "month",
            months: "months",
        },
    },
    blog: {
        title: "Explore Blogs",
        description: "Guides to getting around and eating well in Malaysia",
        readMore: "Read More",
        visitBlog: "Visit Our Blog",
    },
};

export default home;
