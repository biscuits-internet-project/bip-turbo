import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { normalizeEscapedAmpersands } from "~/lib/escaped-ampersand";
import { logger } from "~/lib/logger";
import { getRequestUser } from "~/server/request-user";
import { services } from "~/server/services";

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
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
      const user = await getUser(args.request, {
        requireAuth: options?.requireAuth ?? false,
        requireAdmin: options?.requireAdmin ?? false,
      });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      const result = await fn({ ...args, context });

      const duration = performance.now() - startTime;
      logger.info(`✅ ${args.request.method} ${args.request.url} | completed in ${duration}ms`);

      return result;
    } catch (error) {
      logger.error("❌ Request failed", { error });
      throw error;
    }
  };
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
      const user = await getUser(args.request, {
        requireAuth: options?.requireAuth ?? false,
        requireAdmin: options?.requireAdmin ?? false,
      });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      const result = await fn({ ...args, context });

      const duration = performance.now() - startTime;
      logger.info(`✅ ${args.request.method} ${args.request.url} | completed in ${duration}ms`);

      return result;
    } catch (error) {
      logger.error("❌ Request failed", { error });
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
    logger.error("Failed to ensure local user record", { error, authUserId: authUser.id, email: authUser.email });
    throw error;
  }
}
