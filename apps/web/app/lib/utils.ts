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

export const ATTENDED_ROW_CLASS = "border-l-2 border-l-green-500 bg-green-500/5";

export function formatDateShort(date: string): string {
  const dateParts = date.split("T")[0].split("-");
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    return `${Number.parseInt(month, 10)}/${Number.parseInt(day, 10)}/${year}`;
  }
  return date;
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
