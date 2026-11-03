import type { User } from "@supabase/supabase-js";
import { getServerClient } from "~/server/supabase";

/**
 * Per-request memo for `supabase.auth.getUser()`. React Router v7 passes
 * a freshly-constructed `Request` object to each loader (verified via
 * tagging — the root loader's request and a child route loader's request
 * are different identities even for one HTTP hit), so we can't key the
 * cache on `Request` itself. The credential headers are identical across
 * sibling loaders for one HTTP request, so they form the dedupe key.
 *
 * The key must cover every header that determines identity. `getServerClient` also
 * accepts `Authorization: Bearer`, and a bearer request carries no cookie — so keying
 * on Cookie alone filed every cookieless caller under one shared slot, where a
 * concurrent request could be handed another user's in-flight result.
 *
 * The entry is evicted as soon as the underlying auth call settles, so
 * a follow-up HTTP request from the same browser creates a fresh entry
 * (no stale-session risk between requests). All sibling loaders are
 * synchronous-near-simultaneous on the same request, so they see the
 * inflight Promise before it settles and share its result.
 */
const inflight = new Map<string, Promise<User | null>>();

export function getRequestUser(request: Request): Promise<User | null> {
  const cookie = request.headers.get("Cookie") ?? "";
  const authorization = request.headers.get("Authorization") ?? "";
  // Credential-less requests all resolve to null, so they can share one slot; anything
  // carrying a credential gets a slot of its own.
  const key = cookie || authorization ? `${cookie}\u0000${authorization}` : "_anon";
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
