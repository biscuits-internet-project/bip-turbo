import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { RootData } from "~/root";

const syncedUsers = new Set<string>();
type SyncResult = { refreshedUser: User | null; internalUserId?: string };
const inflightSyncs = new Map<string, Promise<SyncResult>>();

function normalizeUser(user: User | null): User | null {
  if (!user) {
    return user;
  }

  const rawUsername = user.user_metadata?.username;
  if (typeof rawUsername !== "string") {
    return user;
  }

  const trimmedUsername = rawUsername.trim();
  const shouldRemoveUsername = trimmedUsername.length === 0;
  const shouldUpdateUsername = trimmedUsername !== rawUsername;

  if (!shouldUpdateUsername && !shouldRemoveUsername) {
    return user;
  }

  const { username: _ignored, ...restMetadata } = user.user_metadata ?? {};
  const normalizedMetadata = shouldRemoveUsername ? restMetadata : { ...restMetadata, username: trimmedUsername };

  return {
    ...user,
    user_metadata: normalizedMetadata,
  };
}

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
      console.error("Failed to refresh Supabase session after sync:", error);
      return { refreshedUser: null, internalUserId };
    }

    return { refreshedUser: data?.session?.user ?? null, internalUserId };
  } catch (refreshError) {
    console.error("Unexpected error refreshing Supabase session:", refreshError);
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
      .catch((error) => {
        console.error("Error syncing user to PostgreSQL:", error);
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

export function useSession() {
  const rootData = useRouteLoaderData("root") as RootData | undefined;
  const SUPABASE_URL = rootData?.env?.SUPABASE_URL;
  const SUPABASE_ANON_KEY = rootData?.env?.SUPABASE_ANON_KEY;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Set up session and auth listener in useEffect
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null;
      setUser(normalizeUser(sessionUser));
      setLoading(false);

      // Fallback: ensure user is synced to PostgreSQL
      if (sessionUser) {
        ensureUserSynced(sessionUser, supabase).then((syncedUser) => {
          if (!isCancelled && syncedUser && syncedUser.id === sessionUser.id) {
            setUser(normalizeUser(syncedUser));
          }
        });
      }
    });

    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(normalizeUser(sessionUser));
      setLoading(false);

      // Fallback: ensure user is synced to PostgreSQL on auth state change
      if (sessionUser) {
        ensureUserSynced(sessionUser, supabase).then((syncedUser) => {
          if (!isCancelled && syncedUser && syncedUser.id === sessionUser.id) {
            setUser(normalizeUser(syncedUser));
          }
        });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, supabase, loading };
}
