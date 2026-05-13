import type { User } from "@supabase/supabase-js";
import { getServerClient } from "~/server/supabase";

/**
 * Per-request memo for `supabase.auth.getUser()`. React Router v7 passes
 * a freshly-constructed `Request` object to each loader (verified via
 * tagging — the root loader's request and a child route loader's request
 * are different identities even for one HTTP hit), so we can't key the
 * cache on `Request` itself. The Cookie header is identical across
 * sibling loaders for one HTTP request, so it's the dedupe key.
 *
 * The entry is evicted as soon as the underlying auth call settles, so
 * a follow-up HTTP request from the same browser creates a fresh entry
 * (no stale-session risk between requests). All sibling loaders are
 * synchronous-near-simultaneous on the same request, so they see the
 * inflight Promise before it settles and share its result.
 */
const inflight = new Map<string, Promise<User | null>>();

export function getRequestUser(request: Request): Promise<User | null> {
  const key = request.headers.get("Cookie") ?? "_anon";
  const cached = inflight.get(key);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const { supabase } = getServerClient(request);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user ?? null;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
}
