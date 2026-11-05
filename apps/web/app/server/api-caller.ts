import { API_KEY_PREFIX } from "@bip/domain";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { logger } from "~/lib/logger";
import { isAuthorizedAdminRequest } from "~/server/admin-api-key";
import { env } from "~/server/env";
import { services } from "~/server/services";

/**
 * Who a non-browser request says it is, from its `Authorization: Bearer` header:
 * - `admin`: the shared ops key (cron, the setlist sync).
 * - `apiKey`: a personal key a user created in their settings.
 * - `oauth`: a Supabase access token, minted for an MCP client through
 *   /oauth/consent (or a first-party session token).
 */
export type ApiCaller =
  | { kind: "admin" }
  | { kind: "apiKey"; userId: string; keyId: string }
  | { kind: "oauth"; userId: string; clientId: string | null };

function bearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() || null : null;
}

export function hasApiKey(request: Request): boolean {
  return bearerToken(request)?.startsWith(API_KEY_PREFIX) ?? false;
}

// One client for the process, so the JWKS it fetches to verify tokens stays cached.
let verifier: ReturnType<typeof createClient> | null = null;
function tokenVerifier() {
  verifier ??= createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return verifier;
}

/** Resolves the request's bearer credential, or null when it has none or it doesn't check out. */
export async function authenticateApiCaller(request: Request): Promise<ApiCaller | null> {
  if (isAuthorizedAdminRequest(request)) return { kind: "admin" };

  const token = bearerToken(request);
  if (!token) return null;

  if (token.startsWith(API_KEY_PREFIX)) {
    const owner = await services.apiKeys.authenticate(token);
    return owner ? { kind: "apiKey", ...owner } : null;
  }

  // Verified against the project's signing keys, so a forged or expired token fails here.
  const { data, error } = await tokenVerifier().auth.getClaims(token);
  if (error || !data?.claims?.sub || data.claims.role !== "authenticated") return null;
  const clientId = typeof data.claims.client_id === "string" ? data.claims.client_id : null;
  return { kind: "oauth", userId: data.claims.sub, clientId };
}

/** Rate-limit identity: one budget per key, and one per user for OAuth apps. */
export function apiCallerIdentity(caller: Exclude<ApiCaller, { kind: "admin" }>): string {
  return caller.kind === "apiKey" ? `key:${caller.keyId}` : `user:${caller.userId}`;
}

const overridesSchema = z.record(
  z.string(),
  z.object({ api: z.number().int().positive(), mcp: z.number().int().positive() }).partial(),
);
type Overrides = z.infer<typeof overridesSchema>;

let overrides: Overrides | null = null;

/**
 * Raised limits agreed with a user or an organization, from `RATE_LIMIT_OVERRIDES`:
 * JSON keyed by API key id, OAuth client id (one per app or org), or user id, e.g.
 * `{"<id>": {"mcp": 600, "api": 3000}}`. Kept in Doppler rather than the database
 * or the repo, so ids stay out of a public repo and no migration is needed to
 * grant one. Changes apply on the next deploy or app restart.
 */
function rateLimitOverrides(): Overrides {
  if (overrides) return overrides;
  try {
    overrides = env.RATE_LIMIT_OVERRIDES ? overridesSchema.parse(JSON.parse(env.RATE_LIMIT_OVERRIDES)) : {};
  } catch (error) {
    logger.error("RATE_LIMIT_OVERRIDES is not valid; using default limits", { error });
    overrides = {};
  }
  return overrides;
}

/** The caller's raised limit for a bucket, if one was granted. Most specific id wins. */
export function rateLimitOverride(
  caller: Exclude<ApiCaller, { kind: "admin" }>,
  bucket: "api" | "mcp",
): number | undefined {
  const table = rateLimitOverrides();
  const ids = caller.kind === "apiKey" ? [caller.keyId, caller.userId] : [caller.clientId, caller.userId];
  for (const id of ids) {
    const limit = id ? table[id]?.[bucket] : undefined;
    if (limit) return limit;
  }
  return undefined;
}

/** For tests: forget the parsed overrides so a changed env is read again. */
export function resetRateLimitOverrides() {
  overrides = null;
}
