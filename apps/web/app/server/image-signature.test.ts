import { describe, expect, test } from "vitest";
import { matchesImageSignature } from "./image-signature";

const bytes = (...parts: Array<string | number[]>) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));

describe("matchesImageSignature", () => {
  test.each([
    ["image/jpeg", bytes([0xff, 0xd8, 0xff, 0xe0])],
    ["image/png", bytes("\x89PNG\r\n\x1a\n")],
    ["image/gif", bytes("GIF89a")],
    ["image/webp", bytes("RIFF", [0, 0, 0, 0], "WEBP")],
    ["image/heic", bytes([0, 0, 0, 24], "ftypheic")],
    ["image/svg+xml", bytes('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"/>')],
  ] as const)("accepts a real %s", (type, data) => {
    expect(matchesImageSignature(data, type)).toBe(true);
  });

  // The declared type is client-controlled; a script or zip relabelled as an image must
  // not pass the allowlist on the header alone.
  test("rejects bytes that don't match the declared type", () => {
    expect(matchesImageSignature(bytes("<html><script>"), "image/png")).toBe(false);
    expect(matchesImageSignature(bytes("PK\x03\x04"), "image/jpeg")).toBe(false);
    expect(matchesImageSignature(bytes("\x89PNG\r\n\x1a\n"), "image/jpeg")).toBe(false);
    expect(matchesImageSignature(bytes("<html><svg>"), "image/svg+xml")).toBe(false);
  });
});
