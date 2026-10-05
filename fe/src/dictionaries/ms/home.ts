import type { DictionaryArea } from "../types";

// Approved by the client without a separate language review (2026-10-03).
const home: DictionaryArea<"home"> = {
    hero: {
        titleBefore: "Melancong di Malaysia ",
        titleHighlight: "Mudah",
        titleAfter: " bersama Teeko",
        subtitle: "Tempat makan, SIM pelancongan untuk diambil di KLIA2 atau Lalaport BBCC, dan panduan untuk perjalanan anda",
        cta: "Tempah SIM pelancongan anda",
        goToSlide: "Pergi ke slaid {n}",
        stats: {
            Places: "Tempat",
            Reviews: "Ulasan",
            "Avg Rating": "Purata Penilaian",
            Cities: "Bandar",
        },
    },
    featured: {
        title: "Tempat Pilihan",
        description: "Restoran dengan penarafan Google dan TripAdvisor",
    },
    esim: {
        title: "Penyedia SIM Pelancongan",
        description: "Pelan data yang anda tempah dalam talian dan ambil di KLIA2 atau Lalaport BBCC",
        bookNow: "Tempah Sekarang",
        viewAll: "Lihat Semua Pakej SIM Pelancongan",
        units: {
            day: "hari",
            days: "hari",
            week: "minggu",
            weeks: "minggu",
            month: "bulan",
            months: "bulan",
        },
    },
    blog: {
        title: "Terokai Blog",
        description: "Panduan untuk bergerak dan menikmati makanan di Malaysia",
        readMore: "Baca Lagi",
        visitBlog: "Lawati Blog Kami",
    },
};

export default home;
