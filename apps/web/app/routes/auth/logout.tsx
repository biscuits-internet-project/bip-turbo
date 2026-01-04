import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";
import { clearAllCookies } from "~/lib/cookies";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getServerClient(request);
  await supabase.auth.signOut();

  return;
};

export default function Logout() {
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;

  useEffect(() => {
    async function handleLogout() {
      try {
        const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Sign out on the client side
        await supabase.auth.signOut();

        // Clear all Supabase-related items from localStorage
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith("supabase.") || key.startsWith("sb-")) {
            localStorage.removeItem(key);
          }
        }

        // Clear any cookies
        await clearAllCookies();

        // Clear any session storage
        sessionStorage.clear();

        // Force a hard reload to clear any cached state
        window.location.replace("/auth/login");
      } catch (_error) {
        window.location.replace("/auth/login");
      }
    }

    handleLogout();
  }, [SUPABASE_URL, SUPABASE_ANON_KEY]);

  return null;
}
