import { timingSafeEqual } from "node:crypto";
import { env } from "~/server/env";

/**
 * Shared-secret auth for machine callers — the GitHub Actions cron workflow and ops
 * scripts. Distinct from `base-loaders.ts`, which authenticates humans through a
 * Supabase session: a headless caller has no session and no browser to get one with.
 *
 * Fails closed when `ADMIN_API_KEY` is unset. The env entry is optional so a missing
 * value can't crash boot in dev or CI, which means the only safe reading of "no key
 * configured" is that nobody is authorized rather than that everybody is.
 */
export function isAuthorizedAdminRequest(request: Request): boolean {
  const configured = env.ADMIN_API_KEY;
  if (!configured) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  return constantTimeEquals(authHeader.slice("Bearer ".length), configured);
}

/**
 * Compare without leaking the key's content through timing.
 *
 * `timingSafeEqual` throws on a length mismatch, so that case returns early — which does
 * reveal whether the supplied key matched the configured length. That is not a useful
 * oracle here: the length being compared is the attacker's own input, and the dummy
 * compare keeps the rejection cost in the same ballpark either way. Content comparison,
 * the part that would actually leak the secret byte by byte, stays constant-time.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");

  if (bufA.length !== bufB.length) {
    // Still do a comparison so the failure costs the same as a same-length mismatch.
    timingSafeEqual(bufA, bufA);
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

/** 401 for an unauthorized machine caller, shaped like the rest of our JSON errors. */
export function adminApiKeyUnauthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
