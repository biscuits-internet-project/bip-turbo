import { type LoaderFunctionArgs, redirect } from "react-router";
import { logger } from "~/server/logger";
import { getServerClient } from "~/server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const { supabase, headers } = getServerClient(request);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error({ error });
      return redirect("/auth/login", { headers });
    }

    return redirect(next, { headers });
  }

  logger.error("missing code from supabase auth callback");
  return redirect("/auth/login");
}
