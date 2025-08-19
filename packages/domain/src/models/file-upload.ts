import { z } from "zod";

export const fileCategorySchema = z.enum(["avatar", "show-photo", "blog-image", "general"]);
export type FileCategory = z.infer<typeof fileCategorySchema>;

export const allowedImageTypesSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);
export type AllowedImageType = z.infer<typeof allowedImageTypesSchema>;

// File size constants (in bytes)
export const FILE_SIZE_LIMITS = {
  // Input file size limits (before processing)
  INPUT: {
    avatar: 5 * 1024 * 1024, // 5MB input (will be resized to ~100KB)
    "show-photo": 20 * 1024 * 1024, // 20MB input
    "blog-image": 10 * 1024 * 1024, // 10MB input
    general: 1024 * 1024, // 1MB
  },
  // Expected output file sizes (after processing)
  OUTPUT: {
    avatar: 100 * 1024, // 100KB target
    "show-photo": 2 * 1024 * 1024, // 2MB target
    "blog-image": 500 * 1024, // 500KB target
    general: 1024 * 1024, // 1MB
  },
} as const;

export const ALLOWED_IMAGE_TYPES: AllowedImageType[] = ["image/jpeg", "image/png", "image/webp"];

export const FILE_TYPE_NAMES: Record<AllowedImageType, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

// Image processing settings for each category
export const IMAGE_PROCESSING_SETTINGS = {
  avatar: {
    maxWidth: 200,
    maxHeight: 200,
    quality: 80,
    fit: "inside" as const,
  },
  "show-photo": {
    maxWidth: 1200,
    maxHeight: null,
    quality: 85,
    fit: "inside" as const,
  },
  "blog-image": {
    maxWidth: 800,
    maxHeight: null,
    quality: 85,
    fit: "inside" as const,
  },
  general: {
    maxWidth: null,
    maxHeight: null,
    quality: 90,
    fit: "inside" as const,
  },
} as const;

export interface FileUploadValidationError {
  code: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE";
  message: string;
}

export function validateFileUpload(
  file: File,
  category: FileCategory
): FileUploadValidationError | null {
  const maxSize = FILE_SIZE_LIMITS.INPUT[category];
  
  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      code: "FILE_TOO_LARGE",
      message: `File size must be less than ${sizeMB}MB for ${category}`,
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    const friendlyTypes = ALLOWED_IMAGE_TYPES.map((type) => FILE_TYPE_NAMES[type]).join(", ");
    return {
      code: "INVALID_FILE_TYPE",
      message: `Only ${friendlyTypes} images are allowed`,
    };
  }

  return null;
}