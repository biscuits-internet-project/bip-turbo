import { API_KEY_PREFIX, type ApiKeyOwner } from "@bip/domain";
import { createClient } from "@supabase/supabase-js";
import { isAuthorizedAdminRequest } from "~/server/admin-api-key";
import { env } from "~/server/env";
import { hasTooManyFailedSignIns, recordFailedSignIn } from "~/server/rate-limit";
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
  | ({ kind: "apiKey" } & ApiKeyOwner)
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

/**
 * Resolves the request's bearer credential, or null when it has none or it doesn't
 * check out. An IP that keeps presenting bad ones stops being looked up at all (it
 * just gets null), so a flood of guessed keys or forged tokens can't make every
 * request cost a database or Supabase round trip.
 */
export async function authenticateApiCaller(request: Request): Promise<ApiCaller | null> {
  if (isAuthorizedAdminRequest(request)) return { kind: "admin" };

  const token = bearerToken(request);
  if (!token) return null;
  if (await hasTooManyFailedSignIns(request)) return null;

  const caller = await verifyBearerToken(token);
  if (!caller) await recordFailedSignIn(request);
  return caller;
}

async function verifyBearerToken(token: string): Promise<ApiCaller | null> {
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

/**
 * Rate-limit identity: one budget per user, shared by all their keys and apps, so
 * creating more keys doesn't buy more requests.
 */
export function apiCallerIdentity(caller: Exclude<ApiCaller, { kind: "admin" }>): string {
  return `user:${caller.userId}`;
}

/**
 * A raised limit an admin granted the caller's key, if any. Signed-in OAuth apps
 * always get the default; anyone who needs more uses an API key and asks.
 */
export function raisedLimit(caller: Exclude<ApiCaller, { kind: "admin" }>, bucket: "api" | "mcp"): number | undefined {
  if (caller.kind !== "apiKey") return undefined;
  return (bucket === "mcp" ? caller.mcpLimitPerMinute : caller.apiLimitPerMinute) ?? undefined;
}
