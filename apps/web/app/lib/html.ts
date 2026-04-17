const HTML_ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
  "&amp;": "&",
};

/**
 * Decode common HTML entities in a string. Intended for rendering stored
 * HTML as plain text (e.g. table cell previews). For full HTML rendering,
 * use dangerouslySetInnerHTML instead — the browser handles entities there.
 */
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(?:quot|#x27|#39|apos|lt|gt|nbsp|amp);/g, (entity) => HTML_ENTITIES[entity] ?? entity);
}
