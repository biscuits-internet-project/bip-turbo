import type { User } from "@supabase/supabase-js";

/**
 * Client-safe projection of the Supabase auth user. Shipped from the root
 * loader so `useSession`'s initial render already knows who the user is
 * (no flicker on user-specific UI). Excludes anything sensitive — never
 * include tokens or full app_metadata; only the named fields below.
 *
 * Lives in `~/lib` (not `~/server`) so `use-session.ts` (client) can
 * value-import `toSessionUser` without dragging server-only deps (env,
 * supabase server client) into the client bundle.
 */
export interface SessionUser {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  internalUserId: string | null;
  isAdmin: boolean;
}

function normalizeUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Pure projection from a full Supabase `User` to the client-safe shape.
 * Used by both the server-side loader helper and the client-side
 * `onAuthStateChange` listener so SSR seed and client-derived values stay
 * structurally identical (no spurious re-render on auth replay).
 */
export function toSessionUser(user: User): SessionUser {
  const internalUserIdRaw = user.user_metadata?.internal_user_id;
  const avatarUrlRaw = user.user_metadata?.avatar_url;
  return {
    id: user.id,
    email: user.email ?? "",
    username: normalizeUsername(user.user_metadata?.username),
    avatarUrl: typeof avatarUrlRaw === "string" && avatarUrlRaw.length > 0 ? avatarUrlRaw : null,
    internalUserId: typeof internalUserIdRaw === "string" ? internalUserIdRaw : null,
    isAdmin: user.app_metadata?.isAdmin === true,
  };
}
