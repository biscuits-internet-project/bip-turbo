import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * The user-activity resources the sync pulls incrementally. Each keeps its own
 * saved cursor because their prod watermarks advance independently.
 */
export type SyncCursorResource = "users" | "ratings" | "attendances" | "reviews" | "blogPosts";

/** ISO timestamps of the newest prod `updatedAt` pulled so far, per resource. */
export type SavedCursors = Partial<Record<SyncCursorResource, string>>;

/**
 * Where the sync reads and writes its saved cursors. An interface so tests can
 * inject an in-memory or temp-dir store instead of touching the real file.
 */
export interface SyncCursorStore {
  read(): SavedCursors;
  /** Persists `value` for `resource` unless a newer value is already saved. */
  saveIfNewer(resource: SyncCursorResource, value: Date): void;
}

const UNKNOWN_DATABASE_KEY = "unknown-database";

/**
 * The main checkout's `.git` directory, as an absolute path. Every worktree
 * reports the same one, which is what lets all of them share a cursor file.
 */
function gitCommonDirectory(): string {
  return execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
    encoding: "utf8",
  }).trim();
}

/**
 * The saved cursors live at the main checkout root (gitignored) because every
 * git worktree shares one local database; the file has to be shared the same
 * way, so a worktree resolves up to the main checkout instead of its own root.
 */
export function defaultCursorFilePath(gitCommonDirectoryPath: string = gitCommonDirectory()): string {
  return join(dirname(gitCommonDirectoryPath), ".sync-cursors.json");
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const DEFAULT_POSTGRES_PORT = "5432";

/**
 * Identifies which local database a saved cursor describes, so pointing the
 * sync at a different database never reuses another database's cursor. Only
 * the normalized host, port and database name count: the same database
 * reached with other credentials, a loopback spelling or a query string keeps
 * one key, and no credential ever reaches the file.
 */
export function databaseKeyFor(databaseUrl: string | undefined): string {
  if (!databaseUrl) return UNKNOWN_DATABASE_KEY;
  try {
    const parsed = new URL(databaseUrl);
    const rawHost = parsed.hostname.toLowerCase();
    if (!rawHost) return UNKNOWN_DATABASE_KEY;
    const host = LOOPBACK_HOSTS.has(rawHost) ? "localhost" : rawHost;
    const port = parsed.port || DEFAULT_POSTGRES_PORT;
    const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    return `${host}:${port}/${databaseName}`;
  } catch {
    return UNKNOWN_DATABASE_KEY;
  }
}

/**
 * Picks where an incremental pull starts: the older of the saved cursor and the
 * local max `updatedAt`. A local data migration that stamps `updated_at = now()`
 * pushes the local max past rows prod has not delivered yet; the saved cursor
 * holds the start back. After a db-restore the local max is older than the
 * saved cursor, so the local max wins. With nothing saved there is no evidence
 * of what prod delivered (the local max may itself be a migration's
 * timestamp), so the pull starts from epoch: a one-time full upsert for that
 * resource. A tie reports "saved" so the log shows the saved cursor is in
 * effect.
 */
export function resolveStartingCursor(
  saved: Date | undefined,
  localMax: Date,
): { cursor: Date; source: "saved" | "local max" | "no saved cursor, full pull" } {
  if (!saved || Number.isNaN(saved.getTime())) {
    return { cursor: new Date(0), source: "no saved cursor, full pull" };
  }
  if (saved.getTime() <= localMax.getTime()) return { cursor: saved, source: "saved" };
  return { cursor: localMax, source: "local max" };
}

type CursorFileContents = Record<string, SavedCursors>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A missing, unreadable or malformed file is empty: a lost cursor only costs a wider pull. */
function readCursorFile(filePath: string): CursorFileContents {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
  if (!isPlainObject(parsed)) return {};
  const contents: CursorFileContents = {};
  for (const [databaseKey, cursors] of Object.entries(parsed)) {
    if (isPlainObject(cursors)) contents[databaseKey] = cursors as SavedCursors;
  }
  return contents;
}

/**
 * File-backed store scoped to one database key. Saves merge into the existing
 * file so other databases and other resources keep their cursors. A save is
 * best-effort: the cursor only narrows later pulls, so a filesystem failure
 * warns and the sync carries on. The file is replaced by renaming a sibling
 * temporary file, so a concurrent reader never sees a truncated file.
 */
export function createFileCursorStore(options: {
  filePath: string;
  databaseKey: string;
  warn?: (message: string) => void;
}): SyncCursorStore {
  const { filePath, databaseKey } = options;
  const warn = options.warn ?? console.warn;
  return {
    read() {
      return readCursorFile(filePath)[databaseKey] ?? {};
    },
    saveIfNewer(resource, value) {
      try {
        const contents = readCursorFile(filePath);
        const cursors = contents[databaseKey] ?? {};
        const existing = cursors[resource] ? new Date(cursors[resource]) : undefined;
        if (existing && !Number.isNaN(existing.getTime()) && existing.getTime() >= value.getTime()) return;
        contents[databaseKey] = { ...cursors, [resource]: value.toISOString() };
        mkdirSync(dirname(filePath), { recursive: true });
        const temporaryPath = `${filePath}.${process.pid}.tmp`;
        writeFileSync(temporaryPath, `${JSON.stringify(contents, null, 2)}\n`);
        renameSync(temporaryPath, filePath);
      } catch (error) {
        warn(`⚠️  sync cursor for ${resource} not saved: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  };
}

/** A store that remembers nothing, for callers that opt out of persistence. */
export const NO_OP_CURSOR_STORE: SyncCursorStore = {
  read: () => ({}),
  saveIfNewer: () => {},
};

/**
 * The store the sync uses in production: a file at the main checkout root,
 * keyed by database. Resolving that path runs git, which can fail (no git, not
 * a checkout); that must cost the cursor, not the user-activity sync, so any
 * failure warns once and returns the no-op store.
 */
export function createDefaultCursorStore(options: {
  databaseUrl: string | undefined;
  resolveGitCommonDirectory?: () => string;
  warn?: (message: string) => void;
}): SyncCursorStore {
  const warn = options.warn ?? console.warn;
  try {
    return createFileCursorStore({
      filePath: defaultCursorFilePath((options.resolveGitCommonDirectory ?? gitCommonDirectory)()),
      databaseKey: databaseKeyFor(options.databaseUrl),
      warn,
    });
  } catch (error) {
    warn(`⚠️  sync cursors disabled: ${error instanceof Error ? error.message : String(error)}`);
    return NO_OP_CURSOR_STORE;
  }
}
