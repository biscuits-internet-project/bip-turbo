import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useMemo, useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router";
import type { RootData } from "~/root";

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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, supabase, loading };
}
