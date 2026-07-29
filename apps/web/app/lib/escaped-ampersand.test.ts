import { describe, expect, test } from "vitest";
import { normalizeEscapedAmpersands } from "~/lib/escaped-ampersand";

const normalize = (url: string) => normalizeEscapedAmpersands(new URL(`https://discobiscuits.net${url}`));

describe("normalizeEscapedAmpersands", () => {
  // React correctly escapes `&` to `&amp;` when it renders an href, and a
  // crawler that fetches the raw attribute without decoding the entity asks for
  // the literal string. The separator is then part of the next param's *name*.
  // In production these were 100% of the short-TTL traffic on /shows/stats and
  // roughly three quarters of that route's requests, each one an uncached
  // whole-catalog render.
  test("strips the entity prefix a literal &amp; leaves on a param name", () => {
    expect(normalize("/shows/stats?timeRange=2001&amp;nugs=yes")).toBe("/shows/stats?timeRange=2001&nugs=yes");
  });

  test("repairs every affected param, not just the first", () => {
    expect(normalize("/shows/stats?a=1&amp;b=2&amp;c=3")).toBe("/shows/stats?a=1&b=2&c=3");
  });

  // Nothing to repair must mean nothing to redirect to, or every request in the
  // app would bounce once through a 301.
  test("returns null for a well-formed URL", () => {
    expect(normalize("/shows/stats?timeRange=2001&nugs=yes")).toBeNull();
    expect(normalize("/shows/stats")).toBeNull();
  });

  // The repaired URL must itself be clean, or the redirect target redirects
  // again and the crawler loops.
  test("produces a target that needs no further repair", () => {
    const once = normalize("/shows/stats?a=1&amp;b=2");
    expect(once).not.toBeNull();
    expect(normalize(once as string)).toBeNull();
  });

  test("preserves values and the path, including a single-fetch .data suffix", () => {
    expect(normalize("/shows/year/2001.data?photos=yes&amp;nugs=no")).toBe("/shows/year/2001.data?photos=yes&nugs=no");
  });

  // A value that merely contains the text is not a malformed separator, and
  // rewriting it would corrupt a legitimate request.
  test("leaves a value alone when it happens to contain the text", () => {
    expect(normalize("/shows/stats?q=amp%3Bfoo")).toBeNull();
  });
});
