import { z } from "zod";
import { adminLoader } from "~/lib/base-loaders";
import { badRequest } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const getFlagsSchema = z.object({
  status: z.enum(["pending", "reviewed", "dismissed", "actioned"]).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const loader = adminLoader(async ({ request }) => {
  try {
    const url = new URL(request.url);
    const params = {
      status: url.searchParams.get("status") || undefined,
      limit: url.searchParams.get("limit") || "20",
      offset: url.searchParams.get("offset") || "0",
    };

    const validated = getFlagsSchema.parse(params);

    // For now, only return pending flags
    // You can extend this to filter by status
    const flags = await services.moderation.getPendingFlags(validated.limit, validated.offset);

    return new Response(JSON.stringify({ flags }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error fetching flags", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid query parameters");
    }

    return new Response(JSON.stringify({ error: "Failed to fetch flags" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
