import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const supabase = getServerClient(request);
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
        for (const cookie of document.cookie.split(";")) {
          const [name] = cookie.split("=");
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }

        // Clear any session storage
        sessionStorage.clear();

        // Force a hard reload to clear any cached state
        window.location.replace("/auth/login");
      } catch (error) {
        console.error("Error during logout:", error);
        window.location.replace("/auth/login");
      }
    }

    handleLogout();
  }, [SUPABASE_URL, SUPABASE_ANON_KEY]);

  return null;
}
