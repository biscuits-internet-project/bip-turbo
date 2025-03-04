import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useMemo, useState } from "react";

export function useSession(supabaseUrl: string, supabaseAnonKey: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create the Supabase client only once
  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return null;
    }
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

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
  }, [supabaseUrl, supabaseAnonKey]);

  return { user, supabase, loading };
}
