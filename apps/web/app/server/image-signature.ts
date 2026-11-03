import type { AllowedImageMimeType } from "@bip/domain";

/**
 * Whether the bytes actually are the image type the browser declared.
 *
 * `file.type` is whatever the client sends, so on its own it lets any file through as long
 * as the header claims `image/png`. Checking the leading bytes (the format's signature)
 * makes the allowlist mean something. SVG is text, so it is matched on its opening tag.
 */
export function matchesImageSignature(bytes: Uint8Array, declared: AllowedImageMimeType): boolean {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  switch (declared) {
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return ascii(0, 8) === "\x89PNG\r\n\x1a\n";
    case "image/gif":
      return ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a";
    case "image/webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "image/heic":
      // ISO-BMFF: a box size, then "ftyp", then a HEIF brand.
      return ascii(4, 8) === "ftyp" && ["heic", "heix", "heim", "heis", "mif1", "msf1"].includes(ascii(8, 12));
    case "image/svg+xml": {
      const head = new TextDecoder().decode(bytes.subarray(0, 512)).replace(/^﻿/, "").trimStart();
      return head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
    }
    default:
      return false;
  }
}
