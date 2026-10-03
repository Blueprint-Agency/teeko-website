import type { DictionaryArea } from "../types";

// Unreviewed first draft (2026-10-03): awaiting the client's BM reviewer.
const common: DictionaryArea<"common"> = {
    nav: {
        home: "Utama",
        restaurants: "Restoran",
        travelSim: "SIM Pelancong",
        blog: "Blog",
        signIn: "Log Masuk",
        myProfile: "Profil Saya",
        toggleMenu: "Buka atau tutup menu",
    },
    footer: {
        tagline: "Panduan anda untuk menemui tempat menarik di Malaysia.",
        navigation: "Navigasi",
        resources: "Sumber",
        privacyPolicy: "Dasar Privasi",
        termsOfService: "Terma Perkhidmatan",
        privacy: "Privasi",
        terms: "Terma",
        rights: "© {year} Teeko. Hak cipta terpelihara.",
    },
    switcher: {
        label: "Bahasa",
    },
    notFound: {
        title: "Halaman tidak ditemui",
        body: "Halaman yang anda cari tidak wujud atau telah dipindahkan.",
        backHome: "Kembali ke laman utama",
    },
    meta: {
        siteTitle: "Teeko - Terokai Malaysia",
        siteDescription: "Cari tempat makan dan destinasi menarik di Malaysia.",
    },
    shared: {
        breadcrumb: "Jejak halaman",
        home: "Utama",
        previousPage: "Halaman sebelumnya",
        nextPage: "Halaman seterusnya",
        close: "Tutup",
        selectOption: "Pilih pilihan",
    },
    maintenance: {
        loading: "Memuatkan...",
        titleLine1: "Sedang Dalam",
        titleLine2: "Penyelenggaraan",
        body: "Kami sedang menambah baik platform kami. Kami akan kembali sebentar lagi.",
    },
    untranslated: {
        notice: "Halaman ini belum diterjemahkan sepenuhnya, jadi sebahagian teks dipaparkan dalam bahasa Inggeris.",
    },
};

export default common;
