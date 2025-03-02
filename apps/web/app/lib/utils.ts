import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateShort(date: string): string {
  const dateParts = date.split("T")[0].split("-");
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    return `${Number.parseInt(month)}/${Number.parseInt(day)}/${year}`;
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
