import { SYNC_RESOURCES } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { adminApiKeyUnauthorized, isAuthorizedAdminRequest } from "~/server/admin-api-key";
import { services } from "~/server/services";

/**
 * Prod → local replication feed for `packages/core/scripts/sync-missing-shows.ts`.
 *
 * This is internal tooling, not product API. It used to live on `/mcp` as eleven
 * `list_*` tools, which put dev plumbing on the public tool surface: an MCP client saw
 * 28 tools with no way to tell the 12 internal ones from the real ones, and the id
 * endpoints were uncapped full-table scans anyone could call. Moving it here separates
 * the two concerns — `/mcp` is the public product API, this is ops behind a credential.
 *
 * Two shapes per resource:
 *   GET /api/sync/:resource?since=<iso>&cursor=<opaque>&limit=<n>  → incremental page
 *   GET /api/sync/:resource?ids=1                                  → every id
 *
 * The id form exists because a `since` feed cannot express deletion: the sync diffs
 * prod's full id set against local and removes the leftovers. That is inherently a whole-
 * table read, which is precisely why it belongs behind auth.
 */

const DEFAULT_SYNC_LIMIT = 2000;
const MAX_SYNC_LIMIT = 5000;

interface SyncPage {
  updatedAt: Date;
  id: string;
}

type ListForSync<T extends SyncPage> = (opts: {
  since: Date;
  cursorId?: string;
  cursorUpdatedAt?: Date;
  limit: number;
}) => Promise<T[]>;

interface SyncResource {
  /** Key the rows are returned under, matching what the sync script destructures. */
  rowsKey: string;
  list: ListForSync<SyncPage>;
  listAllIds: () => Promise<string[]>;
}

/**
 * URL segment → service. Segment names and payload keys both come from SYNC_RESOURCES so
 * this route and the sync script cannot drift apart; the payload keys match the old MCP
 * tools, leaving the script's response handling unchanged.
 */
function resourceMap(): Record<string, SyncResource> {
  return {
    [SYNC_RESOURCES.users]: {
      rowsKey: "users",
      list: services.users.listForSync.bind(services.users) as ListForSync<SyncPage>,
      listAllIds: () => services.users.listAllIdsForSync(),
    },
    [SYNC_RESOURCES.ratings]: {
      rowsKey: "ratings",
      list: services.ratings.listForSync.bind(services.ratings) as ListForSync<SyncPage>,
      listAllIds: () => services.ratings.listAllIdsForSync(),
    },
    [SYNC_RESOURCES.attendances]: {
      rowsKey: "attendances",
      list: services.attendances.listForSync.bind(services.attendances) as ListForSync<SyncPage>,
      listAllIds: () => services.attendances.listAllIdsForSync(),
    },
    [SYNC_RESOURCES.reviews]: {
      rowsKey: "reviews",
      list: services.reviews.listForSync.bind(services.reviews) as ListForSync<SyncPage>,
      listAllIds: () => services.reviews.listAllIdsForSync(),
    },
    [SYNC_RESOURCES.blogPosts]: {
      rowsKey: "blogPosts",
      list: services.blogPosts.listForSync.bind(services.blogPosts) as ListForSync<SyncPage>,
      listAllIds: () => services.blogPosts.listAllIdsForSync(),
    },
    [SYNC_RESOURCES.raterAliasGroups]: {
      rowsKey: "raterAliasGroups",
      list: services.aliasRules.listForSync.bind(services.aliasRules) as ListForSync<SyncPage>,
      // Merge rules are rebuilt wholesale by the detector rather than diffed, so there is
      // no id-set endpoint for them.
      listAllIds: async () => {
        throw new Error("rater-alias-groups does not support the id listing");
      },
    },
  };
}

// Opaque cursor: encodes the last-seen (updatedAt, id) so the next page resumes after
// that exact boundary even when many rows share a timestamp.
function encodeSyncCursor(updatedAt: Date, id: string): string {
  return Buffer.from(`${updatedAt.toISOString()}|${id}`, "utf8").toString("base64");
}

function decodeSyncCursor(cursor: string | null): { updatedAt: Date; id: string } | null {
  if (!cursor) return null;
  try {
    const [iso, id] = Buffer.from(cursor, "base64").toString("utf8").split("|");
    if (!iso || !id) return null;
    const updatedAt = new Date(iso);
    return Number.isNaN(updatedAt.getTime()) ? null : { updatedAt, id };
  } catch {
    return null;
  }
}

function clampSyncLimit(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_SYNC_LIMIT;
  return Math.min(Math.floor(parsed), MAX_SYNC_LIMIT);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      // These are GETs behind Cloudflare carrying every user, rating, attendance and
      // review row. The old MCP surface was POST and so uncacheable by default; moving to
      // GET means an edge rule matching /api/* could retain an authenticated response.
      // Say so explicitly rather than relying on no such rule existing.
      "Cache-Control": "private, no-store",
      Vary: "Authorization",
    },
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!isAuthorizedAdminRequest(request)) {
    return adminApiKeyUnauthorized();
  }

  const resource = resourceMap()[params.resource ?? ""];
  if (!resource) {
    return json({ error: `Unknown sync resource: ${params.resource}` }, 404);
  }

  const url = new URL(request.url);

  if (url.searchParams.get("ids") === "1") {
    try {
      return json({ ids: await resource.listAllIds() });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unsupported" }, 400);
    }
  }

  const sinceRaw = url.searchParams.get("since");
  const since = new Date(sinceRaw ?? "");
  if (!sinceRaw || Number.isNaN(since.getTime())) {
    return json({ error: "`since` is required and must be an ISO-8601 timestamp" }, 400);
  }

  const cursor = decodeSyncCursor(url.searchParams.get("cursor"));
  const limit = clampSyncLimit(url.searchParams.get("limit"));

  const rows = await resource.list({
    since,
    cursorId: cursor?.id,
    cursorUpdatedAt: cursor?.updatedAt,
    limit,
  });

  const last = rows[rows.length - 1];

  return json({
    [resource.rowsKey]: rows,
    nextCursor: rows.length === limit && last ? encodeSyncCursor(last.updatedAt, last.id) : null,
  });
}
