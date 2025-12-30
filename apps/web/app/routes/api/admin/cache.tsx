import { adminAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const action = adminAction(async ({ request }) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "purge") {
      logger.info("Admin initiated CDN cache purge");

      // Purge all year listings from Cloudflare
      await services.cloudflareCache.purgeAll();

      return new Response(JSON.stringify({ success: true, message: "CDN cache purged successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return badRequest();
  } catch (error) {
    logger.error("Error purging cache", { error });
    return new Response(JSON.stringify({ error: "Failed to purge cache" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
