import { z } from "zod";
import { publicAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";

const MAX_BODY_BYTES = 8192;

const reportSchema = z.object({
  kind: z.enum(["missing-file", "script-error", "unhandled-rejection"]),
  detail: z.string().max(300),
  path: z.string().max(500),
  source: z.string().max(200).optional(),
  line: z.number().int().optional(),
  stack: z.string().max(2000).optional(),
  count: z.number().int().optional(),
  hydrated: z.boolean().optional(),
});

/**
 * Receives reports from `installBrowserErrorReporter`. Anyone can post here, so these
 * are logged as warnings: a warning can't trigger the `level: error` alerts.
 */
export const action = publicAction(async ({ request }) => {
  if (request.method !== "POST") return methodNotAllowed();

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return badRequest("Report is too large");

  let report: z.infer<typeof reportSchema>;
  try {
    report = reportSchema.parse(JSON.parse(body));
  } catch {
    return badRequest("Invalid report");
  }

  logger.warn(`Browser error: ${report.kind}`, {
    ...report,
    userAgent: request.headers.get("user-agent")?.slice(0, 200),
  });
  return new Response(null, { status: 204 });
});
