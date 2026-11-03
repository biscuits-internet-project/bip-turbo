/**
 * The prod → local replication feed's resource contract, defined once.
 *
 * Two things have to agree across the repo boundary: the URL segment the sync script
 * requests (`GET /api/sync/<segment>`) and the key the route returns rows under, which the
 * script destructures. They live in different packages — the route in `apps/web`, the
 * consumer in `packages/core/scripts` — so a rename on one side would otherwise surface as
 * a silent 404 or a quietly empty page during someone's sync run, not as a build error.
 *
 * Keyed by payload key, valued by URL segment.
 */
export const SYNC_RESOURCES = {
  users: "users",
  ratings: "ratings",
  attendances: "attendances",
  reviews: "reviews",
  blogPosts: "blog-posts",
  raterAliasGroups: "rater-alias-groups",
} as const;

/** Payload key a sync response returns its rows under, e.g. `blogPosts`. */
export type SyncPayloadKey = keyof typeof SYNC_RESOURCES;

/** URL segment for a sync resource, e.g. `blog-posts`. */
export type SyncResourceSegment = (typeof SYNC_RESOURCES)[SyncPayloadKey];
