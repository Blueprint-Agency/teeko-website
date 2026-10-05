import type { Dictionary } from "@/dictionaries/types";
import { fmt } from "@/lib/i18n";

/**
 * "3 days" / "3 hari" / "3 天". The number is the stored fact; the unit word is
 * UI text. A unit the dictionary does not know is shown as stored.
 */
export function formatDuration(dict: Dictionary, duration: number, unit: string | null | undefined): string {
    const key = unit || "days";
    const units: Record<string, string> = { days: dict.sim.duration.days, hours: dict.sim.duration.hours };
    return fmt(dict.sim.duration.format, { n: duration, unit: units[key] ?? key });
}
