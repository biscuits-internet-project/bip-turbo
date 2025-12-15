import { z } from "zod";

// Supported image types for Cloudflare Images
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const IMAGE_MIME_TYPE_NAMES: Record<AllowedImageMimeType, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WebP",
  "image/svg+xml": "SVG",
  "image/heic": "HEIC",
};

// Cloudflare Images limits
export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const cloudflareUploadResultSchema = z.object({
  id: z.string(),
  filename: z.string(),
  uploaded: z.string(),
  requireSignedURLs: z.boolean(),
  variants: z.array(z.string()),
});

export type CloudflareUploadResult = z.infer<typeof cloudflareUploadResultSchema>;

export const cloudflareApiErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const cloudflareApiResponseSchema = z.object({
  result: cloudflareUploadResultSchema,
  success: z.boolean(),
  errors: z.array(cloudflareApiErrorSchema),
  messages: z.array(cloudflareApiErrorSchema),
});

export type CloudflareApiResponse = z.infer<typeof cloudflareApiResponseSchema>;

export interface CloudflareImagesConfig {
  accountId: string;
  apiToken: string;
}

export interface UploadImageOptions {
  file: Buffer | Blob;
  filename: string;
  metadata?: Record<string, string>;
  requireSignedURLs?: boolean;
}
