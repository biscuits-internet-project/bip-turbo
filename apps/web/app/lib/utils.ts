import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and sanitizes a redirect URL to prevent open redirect attacks.
 * Only allows relative paths starting with "/".
 * Returns "/" as fallback for invalid URLs.
 */
export function getSafeRedirectUrl(url: string | null): string {
  if (!url) return "/";

  // Only allow relative paths starting with /
  // Reject absolute URLs, protocol-relative URLs (//), and other schemes
  if (!url.startsWith("/") || url.startsWith("//")) {
    return "/";
  }

  return url;
}

export const ATTENDED_ROW_CLASS = "!border-l-2 !border-l-green-500 bg-green-500/5";

/**
 * Slugify a display name into an in-page anchor fragment: lowercase,
 * non-alphanumeric runs become single hyphens, leading/trailing hyphens
 * trimmed. Used by static pages (rock opera resources, anywhere we
 * generate `id="..."` and matching `<a href="#...">` from prose-style
 * names). Not a URL slug — for that, use core's `slugify`.
 */
export function slugifyAnchor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Canonical desktop short date for show-related dates across the app
 * (year listings, top-rated, songs/all-timers performance tables, song-detail
 * stat cards). Output is `M/D/YYYY` with no leading zeros.
 *
 * Accepts either an ISO-like string ("2024-06-15", "2024-06-15T...") or a
 * Date object. When a Date is passed, UTC fields drive the output so
 * dates render the same regardless of the viewer's timezone — historical
 * shows shouldn't shift to the previous day for users west of UTC.
 */
export function formatDateShort(date: string | Date): string {
  const parts = extractDateParts(date);
  if (!parts) return typeof date === "string" ? date : "";
  return `${parts.month}/${parts.day}/${parts.year}`;
}

/**
 * Medium date with an abbreviated month (`Jan 1, 2025`), UTC-anchored. Used by
 * admin index tables for "Created" columns. Accepts an ISO-like string or a
 * Date.
 */
export function formatDateMedium(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Compact mobile-only short date (`M/D/YY`). Used by `<ShowDate>` to render
 * the same date in less horizontal space on phone-width tables.
 */
export function formatDateShortMobile(date: string | Date): string {
  const parts = extractDateParts(date);
  if (!parts) return typeof date === "string" ? date : "";
  const yy = String(parts.year).slice(-2).padStart(2, "0");
  return `${parts.month}/${parts.day}/${yy}`;
}

function extractDateParts(date: string | Date): { year: number; month: number; day: number } | null {
  if (date instanceof Date) {
    return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
  }
  const dateParts = date.split("T")[0].split("-");
  if (dateParts.length !== 3) return null;
  const [year, month, day] = dateParts;
  return { year: Number.parseInt(year, 10), month: Number.parseInt(month, 10), day: Number.parseInt(day, 10) };
}

const MAX_DAYS_PER_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Validates a zero-padded "MM-DD" string.
 * Allows Feb 29 since shows can exist on leap days across years.
 */
export function isValidMonthDay(value: string): boolean {
  if (!/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
    return false;
  }
  const [mm, dd] = value.split("-").map(Number);
  return dd <= MAX_DAYS_PER_MONTH[mm - 1];
}

/**
 * Formats "MM-DD" as "Month Day" (e.g., "04-04" → "April 4").
 */
export function formatMonthDay(monthDay: string): string {
  const [mm, dd] = monthDay.split("-").map(Number);
  const monthName = new Date(2000, mm - 1, dd).toLocaleString("default", { month: "long" });
  return `${monthName} ${dd}`;
}

/**
 * Formats "MM-DD" as "Mon Day" (e.g., "04-04" → "Apr 4"). Used in tight
 * layouts (mobile prev/next month links) where the full month name doesn't
 * fit alongside the chevron and sibling links.
 */
export function formatMonthDayShort(monthDay: string): string {
  const [mm, dd] = monthDay.split("-").map(Number);
  const monthName = new Date(2000, mm - 1, dd).toLocaleString("default", { month: "short" });
  return `${monthName} ${dd}`;
}

/**
 * Steps a year-agnostic "MM-DD" string forward or backward by `delta` days.
 * Uses year 2000 (a leap year) so Feb 29 is always traversable.
 */
export function addDaysYearAgnostic(monthDay: string, delta: number): string {
  const [mm, dd] = monthDay.split("-").map(Number);
  const date = new Date(Date.UTC(2000, mm - 1, dd));
  date.setUTCDate(date.getUTCDate() + delta);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${m}-${d}`;
}

export function getOrdinalSuffix(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

export function getAnniversaryYears(showDate: string): number | null {
  const showYear = Number.parseInt(showDate.split("-")[0], 10);
  const currentYear = new Date().getFullYear();
  const years = currentYear - showYear;

  if (years <= 0 || years % 5 !== 0) return null;

  return years;
}

/**
 * Long, spelled-out date for prose contexts — "January 1, 2025". The
 * project's one opinionated "content date" format (blog posts, podcast
 * episodes, reviews, show-page titles). Accepts an ISO-like string or a Date
 * and is UTC-anchored (via `extractDateParts`) so a date never shifts a day
 * for viewers east of UTC. Unparseable strings pass through unchanged.
 */
export function formatDateLong(date: string | Date): string {
  const parts = extractDateParts(date);
  if (!parts) return typeof date === "string" ? date : "";
  const monthName = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).toLocaleString("default", {
    month: "long",
    timeZone: "UTC",
  });
  return `${monthName} ${parts.day}, ${parts.year}`;
}
