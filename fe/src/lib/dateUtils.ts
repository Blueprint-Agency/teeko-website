export const formatDateGMT8 = (date: string | Date) => {
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Singapore',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(d);
    } catch (e) {
        return "-";
    }
};

export const formatTimeGMT8 = (date: string | Date) => {
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Singapore',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(d);
    } catch (e) {
        return "-";
    }
};

export const formatDateTimeGMT8 = (date: string | Date) => {
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Singapore',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(d).replace(',', '');
    } catch (e) {
        return "-";
    }
};

import { INTL_LOCALE, type Locale } from "@/lib/i18n";

/** Long date ("3 October 2026", "3 Oktober 2026", "2026年10月3日") in the reader's language. */
export const formatBlogDateGMT8 = (date: string | Date | null | undefined, locale: Locale = "en") => {
    if (!date) return "-";
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(d);
    } catch (e) {
        return "-";
    }
};
