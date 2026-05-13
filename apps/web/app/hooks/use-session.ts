import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { SessionUser } from "~/lib/session-user";
import { toSessionUser } from "~/lib/session-user";
import type { RootData } from "~/root";

const syncedUsers = new Set<string>();
type SyncResult = { refreshedUser: User | null; internalUserId?: string };
const inflightSyncs = new Map<string, Promise<SyncResult>>();

async function requestSync(supabase: SupabaseClient): Promise<SyncResult> {
  const response = await fetch("/api/auth/sync", { method: "POST", credentials: "include" });
  if (!response.ok) {
    throw new Error(await response.text());
  }

  let internalUserId: string | undefined;
  try {
    const payload = (await response.json()) as { user?: { id?: string } } | null;
    internalUserId = payload?.user?.id;
  } catch {
    // Response body wasn't JSON - that's fine, we'll rely on refreshed session
  }

  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      return { refreshedUser: null, internalUserId };
    }

    return { refreshedUser: data?.session?.user ?? null, internalUserId };
  } catch (_refreshError) {
    return { refreshedUser: null, internalUserId };
  }
}

/**
 * Ensures the authenticated user has a corresponding PostgreSQL record and refreshed metadata.
 * Dedupe sync attempts across the app by tracking inflight sync operations per user ID.
 */
async function ensureUserSynced(user: User, supabase: SupabaseClient | null): Promise<User> {
  if (!supabase || !user.email) {
    return user;
  }

  if (user.user_metadata?.internal_user_id) {
    syncedUsers.add(user.id);
    return user;
  }

  if (syncedUsers.has(user.id)) {
    return user;
  }

  let inflightSync = inflightSyncs.get(user.id);
  if (!inflightSync) {
    inflightSync = requestSync(supabase)
      .catch((_error) => {
        return { refreshedUser: null, internalUserId: undefined };
      })
      .finally(() => {
        inflightSyncs.delete(user.id);
      });

    inflightSyncs.set(user.id, inflightSync);
  }

  const syncResult = await inflightSync;
  const refreshedUser = syncResult?.refreshedUser;
  if (refreshedUser?.user_metadata?.internal_user_id) {
    syncedUsers.add(user.id);
    return refreshedUser;
  }

  if (syncResult?.internalUserId) {
    const patchedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        internal_user_id: syncResult.internalUserId,
      },
    };
    syncedUsers.add(user.id);
    return patchedUser;
  }

  return user;
}

/**
 * Returns the current authenticated user (projected to the client-safe
 * `SessionUser` shape) and the browser Supabase client.
 *
 * Initial state is seeded from the root loader's `sessionUser` field so the
 * first client render already knows who the user is — no flicker on
 * user-specific UI. The `onAuthStateChange` listener stays mounted to
 * handle in-tab login / logout transitions.
 */
export function useSession(): { user: SessionUser | null; supabase: SupabaseClient | null } {
  const rootData = useRouteLoaderData("root") as RootData | undefined;
  const SUPABASE_URL = rootData?.env?.SUPABASE_URL;
  const SUPABASE_ANON_KEY = rootData?.env?.SUPABASE_ANON_KEY;
  const seededUser = rootData?.sessionUser ?? null;

  const [user, setUser] = useState<SessionUser | null>(seededUser);

  // Create the Supabase client only once
  const supabase = useMemo(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return null;
    }
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookieOptions: {
        path: "/",
      },
    });
  }, [SUPABASE_URL, SUPABASE_ANON_KEY]);

  // Keep `user` in sync with in-tab login / logout. The SSR seed handles
  // the initial paint; this listener picks up subsequent transitions.
  useEffect(() => {
    if (!supabase) return;

    let isCancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser ? toSessionUser(sessionUser) : null);

      if (sessionUser) {
        ensureUserSynced(sessionUser, supabase).then((syncedUser) => {
          if (!isCancelled && syncedUser && syncedUser.id === sessionUser.id) {
            setUser(toSessionUser(syncedUser));
          }
        });
      }
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, supabase };
}
