/**
 * Build a favicon URL for any domain via Google's s2/favicons service. Used
 * over the domain's own favicon.ico because those come in inconsistent sizes
 * and formats (16×16 ICO, 32×32 PNG, Apple-touch square, etc.) — Google
 * normalizes to a single 64px PNG for every domain, which lets the UI render
 * each service's icon at a matching size without per-domain tweaks.
 *
 * @param domain Bare host (e.g. "nugs.net"). Subdomains are allowed but rarely
 *   useful since Google resolves up the chain.
 */
export function faviconSrc(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Canonical bare-host strings for the external sources shown in listing
 * badges, filter toggles, and show-page link cards. Centralized so every UI
 * surface resolves to the same favicon and so adding a source is a one-line
 * change instead of a grep-and-edit.
 */
export const EXTERNAL_SOURCE_DOMAINS = {
  nugs: "nugs.net",
  youtube: "youtube.com",
  archive: "archive.org",
} as const;
