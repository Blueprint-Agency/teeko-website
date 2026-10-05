import type { DictionaryArea } from "../types";

// Approved by the client without a separate language review (2026-10-03).
const sim: DictionaryArea<"sim"> = {
    meta: {
        title: "Pakej SIM Pelancong di Malaysia",
        description: "Tempah SIM pelancong secara dalam talian dan ambil di KLIA2 sebaik mendarat, atau di Lalaport BBCC, Bukit Bintang. Bandingkan pakej mengikut penyedia dan tempoh.",
    },
    breadcrumb: "SIM Pelancong Malaysia",
    duration: {
        format: "{n} {unit}",
        days: "hari",
        hours: "jam",
    },
    freeBadge: "(PERCUMA)",
    list: {
        title: "Pakej SIM Pelancong di Malaysia",
        features: {
            noId: {
                title: "Tiada ID Diperlukan",
                body: "Pendaftaran cepat dan mudah. Daftar dengan alamat e-mel anda dan terus bermula.",
            },
            collection: {
                title: "Ambil di KLIA2 atau Lalaport",
                body: "Tempah bila-bila masa, kemudian ambil SIM anda di pusat pelancongan di KLIA2 atau di Lalaport BBCC, Bukit Bintang.",
            },
            data: {
                title: "Data 5G Tanpa Had",
                body: "Nikmati liputan berkelajuan tinggi di seluruh negara untuk setiap perjalanan di Malaysia.",
            },
        },
        pickTitle: "Pilih pakej yang sesuai dengan keperluan perjalanan anda!",
        pickBody: "Bandingkan pelan data mengikut penyedia dan tempoh perjalanan, kemudian tempah yang sesuai.",
        provider: "Penyedia",
        allProviders: "Semua Penyedia",
        duration: "Tempoh",
        allDurations: "Semua Tempoh",
        viewDetails: "Lihat Butiran",
        noMatch: "Tiada pakej SIM Pelancong yang sepadan dengan penapis anda.",
        clearFilters: "Kosongkan semua penapis",
        faq: {
            title: "Soalan Lazim",
            where: {
                q: "Di mana SIM pelancong ini boleh digunakan?",
                a: "Teeko Travel SIM buat masa ini hanya boleh digunakan di Malaysia.",
            },
            signUp: {
                q: "Bagaimana saya mendaftar untuk SIM pelancong?",
                a: "Tiada ID diperlukan. Anda boleh menempah bila-bila masa dan hanya perlu mendaftar dengan alamat e-mel anda.",
            },
            packages: {
                q: "Apakah pakej SIM pelancong yang ada?",
                a: "Kami menawarkan pelbagai pakej dari 12 jam hingga 7 hari mengikut keperluan perjalanan anda.",
            },
            eligible: {
                q: "Siapa yang layak menempah SIM pelancong secara dalam talian?",
                a: "Pengguna mesti berumur sekurang-kurangnya 18 tahun untuk mendaftar. Mereka yang berumur antara 16 dan 18 tahun boleh menggunakan perkhidmatan ini dengan pengawasan ibu bapa atau penjaga yang sah.",
            },
            redeem: {
                q: "Bagaimana saya menuntut SIM Pelancong saya?",
                a: "Selepas tempahan disahkan, anda akan menerima e-mel dengan kod pengesahan dan kod QR. Tunjukkan kod itu di pusat pelancongan di KLIA2 atau di Lalaport BBCC untuk mengambil SIM anda.",
            },
            cancel: {
                q: "Bolehkah saya membatalkan tempahan SIM pelancong saya?",
                a: "Ya, tempahan boleh dibatalkan melalui bahagian \"Tempahan SIM Pelancong Saya\" di halaman profil anda.",
            },
        },
    },
    detail: {
        notFoundTitle: "Pakej Tidak Dijumpai",
        metaFallbackDescription: "Ketahui lebih lanjut tentang {name}",
        badge: "SIM Pelancong",
        coreFeatures: "Ciri-ciri Utama Produk",
        paymentMethods: "Menyokong Pelbagai Kaedah Pembayaran",
        fallbackPayments: {
            local: {
                title: "Kaedah pembayaran digital tempatan",
                alt: "Pembayaran tempatan",
                body: "Menyokong e-dompet utama di Malaysia seperti DuitNow, ShopeePay, Touch 'n Go eWallet, Grabpay dan Boost.",
            },
            international: {
                title: "Kaedah pembayaran antarabangsa",
                alt: "Pembayaran antarabangsa",
                body: "Boleh digunakan dengan kad kredit/debit (Visa/MasterCard), perbankan dalam talian FPX dan saluran pembayaran antarabangsa yang biasa digunakan seperti Alipay dan WeChat Pay.",
            },
            automated: {
                title: "Proses automatik",
                alt: "Automasi",
                body: "Dana diterima dalam masa nyata, dan sistem melengkapkan pengaktifan kad SIM serta penyelesaian komisen secara automatik, menjadikannya lebih cekap dan telus.",
            },
        },
        otherPackages: "Pakej Lain",
        moreFromProvider: "Lihat lebih banyak pilihan daripada {provider}",
        viewAll: "Lihat Semua SIM →",
    },
};

export default sim;
