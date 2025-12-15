import {
  ALLOWED_IMAGE_MIME_TYPES,
  type AllowedImageMimeType,
  IMAGE_MIME_TYPE_NAMES,
  MAX_IMAGE_FILE_SIZE,
} from "@bip/domain";
import { useCallback, useState } from "react";

export interface UploadedImage {
  id: string;
  filename: string;
  variants: Record<string, string>;
}

export interface UploadError {
  filename: string;
  error: string;
}

export interface UploadResult {
  success: boolean;
  uploaded: UploadedImage[];
  errors?: UploadError[];
}

interface UseImageUploadOptions {
  endpoint?: string;
  maxFileSize?: number;
  allowedTypes?: readonly AllowedImageMimeType[];
  maxFiles?: number;
  onUploadComplete?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

interface FileValidationError {
  file: File;
  error: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    endpoint = "/api/images/upload",
    maxFileSize = MAX_IMAGE_FILE_SIZE,
    allowedTypes = ALLOWED_IMAGE_MIME_TYPES,
    maxFiles,
    onUploadComplete,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; errors: FileValidationError[] } => {
      const valid: File[] = [];
      const errors: FileValidationError[] = [];

      if (maxFiles && files.length > maxFiles) {
        return {
          valid: [],
          errors: [{ file: files[0], error: `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed` }],
        };
      }

      for (const file of files) {
        if (file.size > maxFileSize) {
          errors.push({
            file,
            error: `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          });
          continue;
        }

        if (!allowedTypes.includes(file.type as AllowedImageMimeType)) {
          const allowedNames = allowedTypes.map((t) => IMAGE_MIME_TYPE_NAMES[t]).join(", ");
          errors.push({
            file,
            error: `Only ${allowedNames} images are allowed`,
          });
          continue;
        }

        valid.push(file);
      }

      return { valid, errors };
    },
    [maxFileSize, allowedTypes, maxFiles],
  );

  const upload = useCallback(
    async (files: File[]): Promise<UploadResult | null> => {
      setError(null);

      const { valid, errors: validationErrors } = validateFiles(files);

      if (validationErrors.length > 0 && valid.length === 0) {
        const errorMessage = validationErrors.map((e) => `${e.file.name}: ${e.error}`).join(", ");
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      }

      if (valid.length === 0) {
        setError("No valid files to upload");
        onError?.("No valid files to upload");
        return null;
      }

      setIsUploading(true);

      // Initialize progress for each file
      const initialProgress: Record<string, number> = {};
      for (const file of valid) {
        initialProgress[file.name] = 0;
      }
      setProgress(initialProgress);

      try {
        const formData = new FormData();
        for (const file of valid) {
          formData.append("files", file);
        }

        // Set progress to "uploading" state
        const uploadingProgress: Record<string, number> = {};
        for (const file of valid) {
          uploadingProgress[file.name] = 50;
        }
        setProgress(uploadingProgress);

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const result: UploadResult = await response.json();

        // Set progress to complete
        const completeProgress: Record<string, number> = {};
        for (const file of valid) {
          completeProgress[file.name] = 100;
        }
        setProgress(completeProgress);

        // Add validation errors to result
        if (validationErrors.length > 0) {
          result.errors = [
            ...(result.errors || []),
            ...validationErrors.map((e) => ({ filename: e.file.name, error: e.error })),
          ];
        }

        if (!response.ok && !result.uploaded?.length) {
          const errorMessage = result.errors?.map((e) => `${e.filename}: ${e.error}`).join(", ") || "Upload failed";
          setError(errorMessage);
          onError?.(errorMessage);
          return result;
        }

        onUploadComplete?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFiles, onUploadComplete, onError, endpoint],
  );

  const reset = useCallback(() => {
    setError(null);
    setProgress({});
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    reset,
    maxFileSize,
    allowedTypes,
    mimeTypeNames: IMAGE_MIME_TYPE_NAMES,
  };
}
