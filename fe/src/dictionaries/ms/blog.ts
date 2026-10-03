import type { DictionaryArea } from "../types";

// Unreviewed first draft (2026-10-03): awaiting the client's BM reviewer.
const blog: DictionaryArea<"blog"> = {
    meta: {
        title: "Blog | Teeko",
        description: "Tip perjalanan, panduan destinasi dan maklumat daripada orang tempatan",
        postNotFound: "Artikel Tidak Ditemui",
        postFallbackDescription: "Baca {title} di blog kami",
    },
    list: {
        breadcrumb: "Blog",
        title: "Blog Kami",
        subtitle: "Tip perjalanan, panduan destinasi dan maklumat daripada orang tempatan",
        readMore: "Baca Lagi",
        empty: "Belum ada artikel diterbitkan. Sila datang semula nanti.",
        emptyTranslated: "Belum ada artikel dalam Bahasa Malaysia. Panduan kami dalam bahasa Inggeris sudah tersedia.",
        readEnglish: "Baca blog bahasa Inggeris",
        loading: "Memuatkan artikel terkini...",
    },
    post: {
        travelGuide: "Panduan Perjalanan",
        noContent: "Tiada kandungan.",
        editorsPick: "Pilihan Editor",
        viewDetails: "Lihat Butiran & Tempah",
        enjoyedTitle: "Suka panduan ini?",
        enjoyedBody: "Temui lebih banyak tempat menarik dan tempat kegemaran orang tempatan dalam panduan perjalanan kami.",
        exploreMore: "Baca Panduan Lain",
    },
    carousel: {
        explore: "Terokai {name}",
        thisArea: "kawasan ini",
        international: "Antarabangsa",
        priceRange: "Julat {range}",
        scrollLeft: "Tatal ke kiri",
        scrollRight: "Tatal ke kanan",
    },
};

export default blog;
