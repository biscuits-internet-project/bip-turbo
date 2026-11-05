import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { normalizeEscapedAmpersands } from "~/lib/escaped-ampersand";
import { logger } from "~/lib/logger";
import { apiCallerIdentity, authenticateApiCaller, hasApiKey, rateLimitOverride } from "~/server/api-caller";
import {
  enforceCallerRateLimit,
  enforceRateLimit,
  enforceSiteWideRateLimit,
  isFilteredListingRequest,
} from "~/server/rate-limit";
import { getRequestUser } from "~/server/request-user";
import { hasCredential } from "~/server/response-headers";
import { services } from "~/server/services";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  /** Set when the request authenticated with one of the user's personal API keys. */
  apiKeyId?: string;
}

export interface PublicContext {
  currentUser?: User;
  requestId?: string;
}

export interface ProtectedContext {
  currentUser: User;
  requestId?: string;
}

export interface AdminContext {
  currentUser: User;
  requestId?: string;
  isAdmin: boolean;
}

export type Context = PublicContext | AdminContext;

export function createLoader<T, TContext extends PublicContext = PublicContext>(
  fn: (args: LoaderFunctionArgs & { context: TContext }) => Promise<T>,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
): LoaderFunction {
  return async (args) => {
    const context = {} as TContext;
    const startTime = performance.now();

    // Before anything else, including the user lookup: a request whose `&`
    // separators arrived as the literal `&amp;` should cost a redirect, not a
    // render. These were ~74% of /shows/stats traffic in production, each one
    // rendering the whole catalog under a spelling no purge can reach. The 301
    // also tells the crawler which URL to ask for next time. Loaders only —
    // `createAction` serves POSTs, where a 301 may change the method.
    const repaired = normalizeEscapedAmpersands(new URL(args.request.url));
    if (repaired) throw redirect(repaired, 301);

    try {
      await limitAnonymousRequest(args.request);

      const user = await getUser(args.request, {
        requireAuth: options?.requireAuth ?? false,
        requireAdmin: options?.requireAdmin ?? false,
      });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      await limitSignedInRequest(args.request, user);

      const result = await fn({ ...args, context });

      logRequestCompleted(args.request, startTime);

      return result;
    } catch (error) {
      logRequestFailure(args.request, error);
      throw error;
    }
  };
}

/**
 * Requests carrying no credential are counted by IP before the Supabase lookup,
 * so a flood never reaches auth (and a protected route's 401 path is counted
 * too). Signed-in callers are counted after it, by user id. Admins are exempt:
 * their bulk edits (reordering a setlist, a lineup pass) legitimately burst.
 */
async function limitAnonymousRequest(request: Request) {
  if (!hasCredential(request)) await limitRequest(request, null);
}

async function limitSignedInRequest(request: Request, user: User | null) {
  if (!hasCredential(request) || user?.isAdmin) return;
  if (user?.apiKeyId) await limitApiKeyRequest(request, user, user.apiKeyId);
  else await limitRequest(request, user);
}

/** Scripts using a personal key get a budget per key, which can be raised for that key or its owner. */
async function limitApiKeyRequest(request: Request, user: User, keyId: string) {
  const { pathname } = new URL(request.url);
  const caller = { kind: "apiKey" as const, userId: user.id, keyId };
  if (pathname === "/api/search") {
    await enforceCallerRateLimit(request, "search", apiCallerIdentity(caller));
  } else if (pathname.startsWith("/api/")) {
    await enforceCallerRateLimit(request, "api", apiCallerIdentity(caller), rateLimitOverride(caller, "api"));
  } else {
    await limitRequest(request, user);
  }
}

/** Every `/api/*` route shares one budget (search has its own); filtered catalog listings have theirs. */
async function limitRequest(request: Request, user: User | null) {
  const url = new URL(request.url);
  if (url.pathname === "/api/search") {
    await enforceRateLimit(request, "search", user?.id);
  } else if (url.pathname.startsWith("/api/")) {
    await enforceRateLimit(request, "api", user?.id);
  } else if (isFilteredListingRequest(url)) {
    await enforceRateLimit(request, "filteredListing", user?.id);
    await enforceSiteWideRateLimit(request, "filteredListingSiteWide");
  }
}

/**
 * Request log lines carry the path only, never the query string: the ops
 * workflow prints any prod line matching "error" or "warn" into world-readable
 * run logs, and query strings can carry auth codes (a callback's
 * `?error=access_denied&code=…` matches that grep).
 */
function requestPath(request: Request) {
  return new URL(request.url).pathname;
}

function logRequestCompleted(request: Request, startTime: number) {
  const duration = performance.now() - startTime;
  logger.info(`✅ ${request.method} ${requestPath(request)} | completed in ${duration}ms`);
}

/**
 * Logs a loader or action failure with the page it happened on, so a failure
 * line can be matched to a user's report. Redirects and not-found pages are
 * thrown Responses, i.e. routine control flow, so only a 5xx Response or a
 * real exception is logged as an error.
 */
function logRequestFailure(request: Request, error: unknown) {
  const fields = { error, method: request.method, path: requestPath(request) };
  if (error instanceof Response && error.status < 500) {
    logger.info("Request ended with a thrown response", fields);
  } else {
    logger.error("❌ Request failed", fields);
  }
}

export function createAction<T, TContext extends PublicContext = PublicContext>(
  fn: (args: ActionFunctionArgs & { context: TContext }) => Promise<T>,
  options?: {
    requireAuth?: boolean;
    requireAdmin?: boolean;
  },
): LoaderFunction {
  return async (args) => {
    const context = {} as TContext;
    const startTime = performance.now();

    try {
      await limitAnonymousRequest(args.request);

      const user = await getUser(args.request, {
        requireAuth: options?.requireAuth ?? false,
        requireAdmin: options?.requireAdmin ?? false,
      });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      await limitSignedInRequest(args.request, user);

      const result = await fn({ ...args, context });

      logRequestCompleted(args.request, startTime);

      return result;
    } catch (error) {
      logRequestFailure(args.request, error);
      throw error;
    }
  };
}

// Protected versions with stricter typing
export const protectedLoader = <T>(fn: (args: LoaderFunctionArgs & { context: ProtectedContext }) => Promise<T>) =>
  createLoader<T, ProtectedContext>(fn, { requireAuth: true });

export const protectedAction = <T>(fn: (args: ActionFunctionArgs & { context: ProtectedContext }) => Promise<T>) =>
  createAction<T, ProtectedContext>(fn, { requireAuth: true });

export const adminLoader = <T>(fn: (args: LoaderFunctionArgs & { context: AdminContext }) => Promise<T>) =>
  createLoader<T, AdminContext>(fn, { requireAuth: true, requireAdmin: true });

export const adminAction = <T>(fn: (args: ActionFunctionArgs & { context: AdminContext }) => Promise<T>) =>
  createAction<T, AdminContext>(fn, { requireAuth: true, requireAdmin: true });

export const publicLoader = <T>(fn: (args: LoaderFunctionArgs & { context: PublicContext }) => Promise<T>) =>
  createLoader<T, PublicContext>(fn, { requireAuth: false });

export const publicAction = <T>(fn: (args: ActionFunctionArgs & { context: PublicContext }) => Promise<T>) =>
  createAction<T, PublicContext>(fn, { requireAuth: false });

async function getUser(
  request: Request,
  options: { requireAuth: boolean; requireAdmin?: boolean },
): Promise<User | null> {
  if (hasApiKey(request)) return getApiKeyUser(request, options);

  const user = await getRequestUser(request);

  if (options?.requireAuth) {
    if (!user) {
      const isJsonRequest = request.headers.get("Accept")?.includes("application/json");
      if (isJsonRequest) {
        throw new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw redirect("/auth/login");
    }

    // Ensure the PostgreSQL user exists for any authenticated request
    await ensureLocalUserRecord(user);

    const isAdmin = user.app_metadata?.isAdmin === true;

    // Check admin access if required
    if (options?.requireAdmin && !isAdmin) {
      const isJsonRequest = request.headers.get("Accept")?.includes("application/json");
      if (isJsonRequest) {
        throw new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw redirect("/");
    }

    return {
      id: user.id,
      email: user.email || "",
      isAdmin,
    };
  }

  if (user) {
    const isAdmin = user.app_metadata?.isAdmin === true;
    return {
      id: user.id,
      email: user.email || "",
      isAdmin,
    };
  }

  return null;
}

function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });
}

/**
 * A personal API key acts as its owner, but never with admin rights: a key pasted
 * into a script is far easier to leak than a browser session, so admin routes
 * stay session-only.
 */
async function getApiKeyUser(request: Request, options: { requireAdmin?: boolean }): Promise<User> {
  const caller = await authenticateApiCaller(request);
  const owner = caller?.kind === "apiKey" ? await services.users.find(caller.userId) : null;
  if (!caller || caller.kind !== "apiKey" || !owner) throw jsonError(401, "Invalid or revoked API key");
  if (options.requireAdmin) throw jsonError(403, "API keys can't be used for admin actions");
  return { id: owner.id, email: owner.email, isAdmin: false, apiKeyId: caller.keyId };
}

async function ensureLocalUserRecord(authUser: SupabaseUser) {
  if (!authUser.email) {
    logger.error("Authenticated user missing email; cannot ensure local record", { authUserId: authUser.id });
    return;
  }

  try {
    await services.users.findOrCreate({
      id: authUser.id,
      email: authUser.email,
      username: authUser.user_metadata?.username || authUser.email.split("@")[0],
    });
  } catch (error) {
    logger.error("Failed to ensure local user record", { error, authUserId: authUser.id });
    throw error;
  }
}
