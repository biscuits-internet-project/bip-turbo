import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ClientSideEnv } from "~/root";

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    __ENV__?: ClientSideEnv;
  }
}

type SupabaseContextType = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseStorageUrl: string;
  isLoaded: boolean;
  client: SupabaseClient | null;
};

const SupabaseContext = createContext<SupabaseContextType | null>(null);

interface SupabaseProviderProps {
  children: React.ReactNode;
  env: ClientSideEnv;
}

export function SupabaseProvider({ children, env }: SupabaseProviderProps) {
  const [state, setState] = useState<SupabaseContextType>({
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseStorageUrl: "",
    isLoaded: false,
    client: null,
  });

  useEffect(() => {
    const client = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        storageKey: "sb-storage",
        storage: window.localStorage,
      },
      global: {
        headers: {
          "x-storage-url": env.SUPABASE_STORAGE_URL,
        },
      },
    });

    setState({
      supabaseUrl: env.SUPABASE_URL,
      supabaseAnonKey: env.SUPABASE_ANON_KEY,
      supabaseStorageUrl: env.SUPABASE_STORAGE_URL,
      isLoaded: true,
      client,
    });
  }, [env]);

  return <SupabaseContext.Provider value={state}>{children}</SupabaseContext.Provider>;
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabaseContext must be used within a SupabaseProvider");
  }
  return context;
}
