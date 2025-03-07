import { createBrowserClient } from "@supabase/ssr";
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
  isLoaded: boolean;
};

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SupabaseContextType>({
    supabaseUrl: "",
    supabaseAnonKey: "",
    isLoaded: false,
  });

  useEffect(() => {
    // Get the environment variables from the window object
    // These are injected by the root loader
    const env = window.__ENV__;

    if (env) {
      setState({
        supabaseUrl: env.SUPABASE_URL,
        supabaseAnonKey: env.SUPABASE_ANON_KEY,
        isLoaded: true,
      });
    }
  }, []);

  return <SupabaseContext.Provider value={state}>{children}</SupabaseContext.Provider>;
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabaseContext must be used within a SupabaseProvider");
  }
  return context;
}
