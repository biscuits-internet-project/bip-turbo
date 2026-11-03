import sanitizeHtml from "sanitize-html";

/**
 * Sanitize HTML that came from outside this application before it is handed to
 * `dangerouslySetInnerHTML`.
 *
 * The one current source is the acast podcast feed, rendered on the homepage card and the
 * Touchdowns resource page. Both are server-rendered, so the fragment lands in the initial
 * HTML document — a `<script>` in it executes rather than sitting inert — and the app ships
 * no Content-Security-Policy, so nothing catches it downstream. The trust boundary is
 * whatever the podcast publisher types into a third party's CMS.
 *
 * Deliberately narrow: prose formatting and links, nothing else. This is not the profile
 * to reach for if admin-authored columns ever need sanitizing — those carry two decades of
 * hand-written markup, and stripping to an allowlist on a read path silently destroys it
 * on the next admin save (the edit forms round-trip whatever they load).
 */

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "code",
  "pre",
  "span",
];

const FEED_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  // `target=_blank` without `noopener` hands the opened page a handle on `window.opener`.
  allowedAttributes: { a: ["href", "title", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
  },
};

/** Sanitize an HTML fragment from an external feed. Strict: prose and links only. */
export function sanitizeFeedHtml(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, FEED_OPTIONS);
}

/**
 * Escape untrusted text for interpolation into an HTML string (e.g. an email body).
 * For text, not markup: everything comes out inert, including tags the caller wanted.
 * Without it on the contact form, the operator received a DKIM-signed message from our own
 * domain whose markup the sender controlled end to end.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
