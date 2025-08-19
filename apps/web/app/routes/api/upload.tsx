import { protectedAction } from "~/lib/base-loaders";
import { badRequest, unauthorized } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";
import { 
  FILE_SIZE_LIMITS, 
  ALLOWED_IMAGE_TYPES, 
  fileCategorySchema,
  validateFileUpload 
} from "@bip/domain";

export const action = protectedAction(async ({ request, context }) => {
  const { currentUser } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the actual user from the database
    const user = await services.users.findByEmail(currentUser.email);
    if (!user) {
      return unauthorized();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const categoryInput = formData.get("category") as string;

    if (!file || !categoryInput) {
      return badRequest();
    }

    // Validate category
    const categoryResult = fileCategorySchema.safeParse(categoryInput);
    if (!categoryResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid upload category" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const category = categoryResult.data;

    // Validate file using domain validation
    const validationError = validateFileUpload(file, category);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError.message }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file
    const uploadResult = await services.files.uploadFile({
      buffer,
      filename: file.name,
      contentType: file.type,
      category,
      userId: user.id,
    });

    logger.info("File uploaded successfully", {
      fileId: uploadResult.id,
      category,
      userId: user.id,
    });

    return new Response(
      JSON.stringify({
        file: {
          id: uploadResult.id,
          filename: uploadResult.filename,
          url: uploadResult.url,
          size: uploadResult.size,
          type: uploadResult.type,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    logger.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to upload file" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});