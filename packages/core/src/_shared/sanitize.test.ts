import { describe, expect, test } from "vitest";
import { sanitizeFeedHtml } from "./sanitize";

/**
 * This is the only thing standing between a third party's HTML and
 * `dangerouslySetInnerHTML` on a server-rendered page. The app ships no CSP, so a script
 * that survives here executes.
 */

describe("sanitizeFeedHtml — third-party podcast descriptions", () => {
  test("drops scripts and handlers", () => {
    const out = sanitizeFeedHtml('<p>Ep 1</p><script>alert(1)</script><img src=x onerror="alert(2)">');

    expect(out).toContain("Ep 1");
    expect(out).not.toContain("script");
    expect(out).not.toContain("onerror");
  });

  // Deliberately narrow: a third party gets prose and links, not images, tables or
  // anything that can load a remote resource.
  test("drops embedded media and layout tags", () => {
    const rich =
      '<p>text</p><img src="https://example.com/x.png"><table><tr><td>x</td></tr></table><iframe src="https://e.test"></iframe>';
    const out = sanitizeFeedHtml(rich);

    expect(out).toContain("text");
    expect(out).not.toContain("<img");
    expect(out).not.toContain("<table");
    expect(out).not.toContain("<iframe");
  });

  test("empty input is an empty string, never null", () => {
    expect(sanitizeFeedHtml(null)).toBe("");
    expect(sanitizeFeedHtml(undefined)).toBe("");
    expect(sanitizeFeedHtml("")).toBe("");
  });

  test("marks outbound links noopener and nofollow", () => {
    const out = sanitizeFeedHtml('<a href="https://example.com">listen</a>');

    expect(out).toContain('rel="noopener noreferrer nofollow"');
  });
});
