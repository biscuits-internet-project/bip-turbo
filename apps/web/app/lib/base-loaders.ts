import type { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { logger } from "~/lib/logger";
import { getServerClient } from "~/server/supabase";

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
  const { supabase } = getServerClient(request);

  if (options?.requireAuth) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    // Check for admin flag in app_metadata (server-controlled, secure)
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

  // Use getUser() instead of getSession() to properly verify the JWT
  // getSession() just reads from cookies without verification
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
