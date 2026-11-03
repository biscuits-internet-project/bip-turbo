import { ALLOWED_IMAGE_MIME_TYPES, type AllowedImageMimeType, MAX_IMAGE_FILE_SIZE } from "@bip/domain";
import { z } from "zod";
import { adminAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { matchesImageSignature } from "~/server/image-signature";
import { services } from "~/server/services";

/** Each file is a billed Cloudflare Images upload; bound one request's fan-out. */
const MAX_FILES_PER_REQUEST = 10;

const uploadSchema = z.object({
  filename: z.string().min(1),
  type: z.string().refine((type) => ALLOWED_IMAGE_MIME_TYPES.includes(type as AllowedImageMimeType), {
    message: `File type must be one of: ${ALLOWED_IMAGE_MIME_TYPES.join(", ")}`,
  }),
  size: z.number().max(MAX_IMAGE_FILE_SIZE, `File size must be less than ${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB`),
});

// Admin-only. Every image stored here is billed by Cloudflare Images and nothing ties it to
// a record, so as a plain signed-in route any free account could fill storage. No user-facing
// UI posts here (avatars go through /api/users/avatar), so restricting it costs nothing.
export const action = adminAction(async ({ request, context }) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  const { currentUser } = context;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return badRequest("No files provided");
    }
    if (files.length > MAX_FILES_PER_REQUEST) {
      return badRequest(`At most ${MAX_FILES_PER_REQUEST} files per upload`);
    }

    // Get the actual user from the database
    const user = await services.users.findByEmail(currentUser.email);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const validation = uploadSchema.safeParse({
          filename: file.name,
          type: file.type,
          size: file.size,
        });

        if (!validation.success) {
          errors.push({
            filename: file.name,
            error: validation.error.issues[0].message,
          });
          continue;
        }

        // Convert File to Buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // file.type is client-declared; confirm the bytes agree before anything is stored.
        if (!matchesImageSignature(buffer, file.type as AllowedImageMimeType)) {
          errors.push({ filename: file.name, error: "File contents don't match its image type" });
          continue;
        }

        // Upload to Cloudflare Images
        const result = await services.files.uploadImage({
          file: buffer,
          filename: file.name,
          type: file.type,
          size: file.size,
          userId: user.id,
        });

        results.push({
          id: result.file.id,
          filename: result.file.filename,
          variants: result.variants,
        });
      } catch (error) {
        logger.error("Failed to upload file", { filename: file.name, error });
        errors.push({
          filename: file.name,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: results.length > 0,
        uploaded: results,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: errors.length === files.length ? 400 : 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    logger.error("Image upload error", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid request data");
    }

    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
