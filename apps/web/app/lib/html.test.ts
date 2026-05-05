import { describe, expect, test } from "vitest";
import { decodeHtmlEntities } from "./html";

describe("decodeHtmlEntities", () => {
  // Common entities stored in the history field of the song database.
  test("decodes apostrophe entities (&#x27;, &apos;, &#39;)", () => {
    expect(decodeHtmlEntities("Otomo&#x27;s")).toBe("Otomo's");
    expect(decodeHtmlEntities("Otomo&apos;s")).toBe("Otomo's");
    expect(decodeHtmlEntities("Otomo&#39;s")).toBe("Otomo's");
  });

  test("decodes quote entity (&quot;)", () => {
    expect(decodeHtmlEntities("&quot;hello&quot;")).toBe('"hello"');
  });

  test("decodes angle bracket entities (&lt;, &gt;)", () => {
    expect(decodeHtmlEntities("&lt;p&gt;")).toBe("<p>");
  });

  test("decodes non-breaking space (&nbsp;)", () => {
    expect(decodeHtmlEntities("a&nbsp;b")).toBe("a b");
  });

  test("decodes ampersand entity (&amp;)", () => {
    expect(decodeHtmlEntities("rock &amp; roll")).toBe("rock & roll");
  });

  test("leaves unknown entities unchanged", () => {
    expect(decodeHtmlEntities("&fakeentity;")).toBe("&fakeentity;");
  });

  test("handles strings with no entities", () => {
    expect(decodeHtmlEntities("plain text")).toBe("plain text");
  });
});
