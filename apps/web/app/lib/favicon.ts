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
  relisten: "relisten.net",
  youtube: "youtube.com",
  archive: "archive.org",
  spotify: "spotify.com",
  appleMusic: "music.apple.com",
  // Odesli (song.link / album.link) — the "any other service" chooser
  // we link to when we want listeners on Tidal / Deezer / Amazon / etc.
  songLink: "song.link",
} as const;

/**
 * Shared chrome for a favicon-as-link: the lift-and-glow hover used wherever
 * an external source renders as a clickable icon (setlist badge strip,
 * resource-page performance rows). Centralized so the hover treatment stays
 * identical across surfaces.
 *
 * Icons render desaturated and dimmed at rest, and return to full brand color
 * on hover. Each row already carries the show date, the rating, and up to five
 * of these; letting nugs purple, YouTube red and Relisten blue all shout at
 * rest left no colors free to mean anything. Muted, they read as one group of
 * "where to hear this" links, and the row's remaining color belongs to the
 * rating.
 *
 * The dimming sits on the link rather than on the icon so it reaches every
 * badge shape alike: the favicon `img`s, the photos badge's Lucide `svg` and
 * its count. Only the desaturation is image-scoped, since the icons drawn as
 * SVG take their color from `currentColor` and have none to lose.
 *
 * Each image reads its own correction from `--favicon-boost` (see
 * `faviconBoost`), and `group-hover` drops the whole filter so the brand color
 * returns intact.
 *
 * Hover grows and lights the icon but does not move it: these sit inline with
 * the rating and attendance buttons, which lift in place, and an icon that also
 * slid upward read as a different kind of control. The glow is the brand purple
 * rather than a hardcoded one, so it tracks the palette.
 */
export const EXTERNAL_FAVICON_LINK_CLASS =
  "group inline-flex items-center opacity-75 transition-[transform,opacity,filter] hover:opacity-100 hover:scale-110 hover:drop-shadow-[0_0_6px_hsl(var(--brand-primary)/0.55)]";

/**
 * Applied to each favicon `img`. Desaturates, then multiplies by that domain's
 * `--favicon-boost` so every logo lands at a comparable weight.
 */
export const EXTERNAL_FAVICON_IMG_CLASS =
  "[filter:grayscale(1)_brightness(var(--favicon-boost,1))] transition-[filter] group-hover:[filter:none]";

/**
 * Per-domain brightness correction, applied after desaturation.
 *
 * `grayscale()` collapses a pixel to its luminance, which is weighted heavily
 * toward green (0.72G vs 0.21R and 0.07B). Brands built on red or purple carry
 * almost no green, so they crush far darker than a blue or cyan logo does at
 * the same apparent vividness — nugs and YouTube came out visibly duller than
 * Relisten from the identical filter. These multipliers put them back on terms.
 *
 * Relisten is the baseline at 1. Values are tuned against each icon's p90
 * luminance — the brightness of its *ink* rather than its mean, which for a
 * logo drawn as light-on-dark (archive.org) is dragged down by a background the
 * eye doesn't read. Ceilings matter as much as floors: YouTube stays well under
 * full correction because its play triangle is white against the button, and
 * over-brightening merges the two and dissolves the logo.
 *
 * archive.org is deliberately absent. Its field is near-black and its ink is
 * already clipped white, so multiplying moves neither — brightness cannot make
 * it louder, and opacity is the only lever that would.
 */
const FAVICON_BOOST: Record<string, number> = {
  [EXTERNAL_SOURCE_DOMAINS.nugs]: 1.95,
  [EXTERNAL_SOURCE_DOMAINS.youtube]: 1.6,
};

/**
 * Inline style carrying a domain's correction to `EXTERNAL_FAVICON_IMG_CLASS`.
 * A custom property rather than a plain `filter` because the hover state has to
 * stay in CSS, and an inline filter would win over it.
 */
export function faviconBoost(domain: string): React.CSSProperties {
  const boost = FAVICON_BOOST[domain];
  return boost ? ({ "--favicon-boost": boost } as React.CSSProperties) : {};
}
