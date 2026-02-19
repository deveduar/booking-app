/**
 * Robustly parses a time string into total minutes from start of day.
 * Supports "h:mm AM/PM" and "HH:mm" (24h) formats.
 */
export function parseTimeMin(t: string | null): number {
    if (!t) return 0;
    // Try AM/PM
    const matchAmpm = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (matchAmpm) {
        let h = parseInt(matchAmpm[1]);
        const m = parseInt(matchAmpm[2]);
        const ampm = matchAmpm[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    }
    // Try 24h
    const match24 = t.match(/(\d+):(\d+)/);
    if (match24) {
        return parseInt(match24[1]) * 60 + parseInt(match24[2]);
    }
    return 0;
}

/**
 * Formats total minutes into "h:mm AM/PM" string (display-only).
 * Use for UI labels, chips, and text display — NOT for v-time-picker v-model.
 */
export function formatTimeMin(mTotal: number): string {
    let h = Math.floor(mTotal / 60);
    const m = mTotal % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Formats total minutes into "HH:mm" 24-hour string.
 * This is the format Vuetify's v-time-picker expects for its v-model,
 * and the canonical storage format for timeRange.start / timeRange.end.
 */
export function formatTimeHHmm(mTotal: number): string {
    const h = Math.floor(mTotal / 60);
    const m = mTotal % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Returns the current date in YYYY-MM-DD format based on local time.
 */
export function getTodayStr(): string {
    const now = new Date();
    return dateToYMD(now);
}

/**
 * Converts a Date object to YYYY-MM-DD string, avoiding timezone shifts.
 */
export function dateToYMD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Validates that the end time is after the start time.
 */
export function isTimeRangeValid(start: string | null, end: string | null): boolean {
    if (!start || !end) return true;
    return parseTimeMin(end) > parseTimeMin(start);
}
