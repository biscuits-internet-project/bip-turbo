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

export function formatDateShort(date: string): string {
  const dateParts = date.split("T")[0].split("-");
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    return `${Number.parseInt(month, 10)}/${Number.parseInt(day, 10)}/${year}`;
  }
  return date;
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

// this input will be in the format "2025-01-01"
// this should output as "January 1, 2025"
export function formatDateLong(date: string): string {
  const dateParts = date.split("T")[0].split("-");
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    const monthName = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleString("default", {
      month: "long",
    });
    return `${monthName} ${day}, ${year}`;
  }
  return date;
}
