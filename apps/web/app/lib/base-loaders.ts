import type { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { logger } from "~/lib/logger";
import { getServerClient } from "~/server/supabase";

interface User {
  id: string;
  role: string;
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
      const user = await getUser(args.request, { requireAuth: options?.requireAuth ?? false });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      const result = await fn({ ...args, context });

      const duration = performance.now() - startTime;
      logger.info(`✅ ${args.request.method} ${args.request.url} | completed in ${duration}ms`);

      return result;
    } catch (error) {
      logger.error("❌ Request failed:", error);
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
      const user = await getUser(args.request, { requireAuth: options?.requireAuth ?? false });

      if (user) {
        context.currentUser = user as TContext["currentUser"];
      }

      const result = await fn({ ...args, context });

      const duration = performance.now() - startTime;
      logger.info(`✅ ${args.request.method} ${args.request.url} | completed in ${duration}ms`);

      return result;
    } catch (error) {
      logger.error("❌ Request failed:", error);
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

async function getUser(request: Request, options: { requireAuth: boolean }): Promise<User | null> {
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
    return {
      id: user.id,
      role: user.user_metadata.role,
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      id: session.user.id,
      role: session.user.user_metadata.role,
    };
  }

  return null;
}
