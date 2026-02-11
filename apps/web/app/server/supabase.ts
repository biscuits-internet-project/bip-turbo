import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { serialize } from "cookie";
import { env } from "./env";

export const getServiceRoleClient = () => {
  // Service role client for admin operations
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const getServerClient = (request: Request) => {
  const headers = new Headers();

  // Check for Bearer token (OAuth/MCP clients)
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => {
        // If Bearer token is present, create a fake cookie for Supabase auth
        if (bearerToken) {
          return [
            { name: "sb-access-token", value: bearerToken },
          ];
        }

        const cookie = request.headers.get("Cookie") ?? "";
        return cookie.split(";").reduce(
          (acc, part) => {
            const [key, ...value] = part.split("=");
            if (key) {
              acc.push({
                name: key.trim(),
                value: value.join("=").trim(),
              });
            }
            return acc;
          },
          [] as { name: string; value: string }[],
        );
      },
      setAll: (cookies) => {
        // Don't set cookies for Bearer token requests
        if (bearerToken) return;

        for (const cookie of cookies) {
          headers.append(
            "Set-Cookie",
            serialize(cookie.name, cookie.value, {
              ...cookie.options,
              path: "/",
            }),
          );
        }
      },
    },
    global: {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
    },
  });

  return { supabase, headers };
};
