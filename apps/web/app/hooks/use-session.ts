import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { useCallback, useMemo, useState } from "react";

export function useSession(supabaseUrl: string, supabaseAnonKey: string) {
  const [user, setUser] = useState<User | null>(null);

  // Create the Supabase client only once
  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

    // Set up initial session synchronously
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Set up auth listener synchronously
    client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return client;
  }, [supabaseUrl, supabaseAnonKey]);

  return { user, supabase };
}
