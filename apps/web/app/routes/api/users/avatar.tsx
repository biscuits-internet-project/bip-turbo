import { ALLOWED_IMAGE_MIME_TYPES, type AllowedImageMimeType, MAX_IMAGE_FILE_SIZE } from "@bip/domain";
import type { ActionFunctionArgs } from "react-router-dom";
import honeybadger from "~/lib/honeybadger";
import { logger } from "~/lib/logger";
import { matchesImageSignature } from "~/server/image-signature";
import { enforceRateLimit } from "~/server/rate-limit";
import { services } from "~/server/services";
import { getServerClient, getServiceRoleClient } from "~/server/supabase";

const AVATAR_MIME_TYPES: readonly string[] = ALLOWED_IMAGE_MIME_TYPES.filter((type) => type !== "image/svg+xml");

export async function action({ request }: ActionFunctionArgs) {
  // Not wrapped in base-loaders, so it applies the shared /api budget itself (by IP).
  await enforceRateLimit(request, "api");

  try {
    const { supabase } = getServerClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const localUser = await services.users.findByEmail(user.email || "");
    if (!localUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only process the first file for avatar
    const file = files[0];

    // Reject before copying the upload into a Buffer for Cloudflare. `formData()` above has
    // already parsed the body, so the memory bound on the request itself is the proxy's
    // max_request_body (config/deploy.yml), not this check.
    //
    // SVG is excluded: an avatar is shown to every visitor, and an SVG can carry script.
    // Raster formats only.
    if (!AVATAR_MIME_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: `File type must be one of: ${AVATAR_MIME_TYPES.join(", ")}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: `File size must be less than ${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // file.type is client-declared; confirm the bytes agree before anything is stored.
    if (!matchesImageSignature(buffer, file.type as AllowedImageMimeType)) {
      return new Response(JSON.stringify({ error: "File contents don't match its image type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upload to Cloudflare Images
    const uploadResult = await services.files.uploadImage({
      file: buffer,
      filename: file.name,
      type: file.type,
      size: file.size,
      userId: localUser.id,
      metadata: {
        purpose: "avatar",
      },
    });

    // Get the avatar variant URL
    const avatarUrl = uploadResult.variants.avatar || uploadResult.variants.public;

    // Update the user's avatar in local database
    const updatedUser = await services.users.setAvatar(localUser.id, uploadResult.file.id, avatarUrl);

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "Failed to update user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sync avatar URL to Supabase user metadata
    try {
      const adminClient = getServiceRoleClient();
      await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          avatar_url: avatarUrl,
        },
      });
    } catch (error) {
      logger.error("Failed to sync avatar to Supabase metadata", { error });
      // Don't fail the request if Supabase sync fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        uploaded: [
          {
            id: uploadResult.file.id,
            filename: file.name,
            variants: uploadResult.variants,
          },
        ],
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    honeybadger.notify(error as Error);
    logger.error("Error uploading avatar", { error });
    return new Response(
      JSON.stringify({
        success: false,
        uploaded: [],
        errors: [{ filename: "avatar", error: "Upload failed" }],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
