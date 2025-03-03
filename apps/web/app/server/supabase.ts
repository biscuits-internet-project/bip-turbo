import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { env } from "./env";

export const getServerClient = (request: Request) => {
  const headers = new Headers();
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
        }
      },
    },
  });

  return supabase;
};
