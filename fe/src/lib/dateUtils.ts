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

export const formatBlogDateGMT8 = (date: string | Date | null | undefined) => {
    if (!date) return "-";
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(d);
    } catch (e) {
        return "-";
    }
};
