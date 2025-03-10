import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { RootData } from "~/root";

export function useSession() {
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create the Supabase client only once
  const supabase = useMemo(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setLoading(false);
      return null;
    }
    const client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookieOptions: {
        path: "/",
      },
    });

    // Set up initial session synchronously
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up auth listener synchronously
    client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return client;
  }, [SUPABASE_URL, SUPABASE_ANON_KEY]);

  return { user, supabase, loading };
}
