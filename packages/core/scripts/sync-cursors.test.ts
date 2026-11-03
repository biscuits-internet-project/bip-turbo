import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  createDefaultCursorStore,
  createFileCursorStore,
  databaseKeyFor,
  defaultCursorFilePath,
  NO_OP_CURSOR_STORE,
  resolveStartingCursor,
} from "./sync-cursors";

function makeTemporaryFilePath(): string {
  return join(mkdtempSync(join(tmpdir(), "sync-cursors-")), "nested", "sync-cursors.json");
}

describe("resolveStartingCursor", () => {
  // The migration-bump case: a local data migration set updated_at = now(), so
  // the local max is far ahead of what was actually pulled from prod.
  test("starts from the saved cursor when the local max was bumped past it", () => {
    const result = resolveStartingCursor(new Date("2026-07-10T00:00:00Z"), new Date("2026-11-03T00:00:00Z"));
    expect(result).toEqual({ cursor: new Date("2026-07-10T00:00:00Z"), source: "saved" });
  });

  // Nothing saved means no evidence of what prod delivered; the local max may
  // itself be a migration's timestamp, so the pull starts from epoch.
  test("starts from epoch when nothing is saved", () => {
    const result = resolveStartingCursor(undefined, new Date("2026-11-03T00:00:00Z"));
    expect(result).toEqual({ cursor: new Date(0), source: "no saved cursor, full pull" });
  });

  // A db-restore leaves the local data older than the saved cursor; trusting
  // the saved value would skip every row between the two.
  test("starts from the local max when it is older than the saved cursor", () => {
    const result = resolveStartingCursor(new Date("2026-11-01T00:00:00Z"), new Date("2026-06-01T00:00:00Z"));
    expect(result).toEqual({ cursor: new Date("2026-06-01T00:00:00Z"), source: "local max" });
  });

  // The steady state after a normal run: both values are prod's watermark.
  test("reports the saved cursor when it equals the local max", () => {
    const result = resolveStartingCursor(new Date("2026-11-03T00:00:00Z"), new Date("2026-11-03T00:00:00Z"));
    expect(result).toEqual({ cursor: new Date("2026-11-03T00:00:00Z"), source: "saved" });
  });

  test("treats a saved value that is not a valid date as nothing saved", () => {
    const result = resolveStartingCursor(new Date("not a date"), new Date("2026-06-01T00:00:00Z"));
    expect(result).toEqual({ cursor: new Date(0), source: "no saved cursor, full pull" });
  });
});

describe("databaseKeyFor", () => {
  test("keys on host, port and database name only", () => {
    expect(databaseKeyFor("postgresql://postgres:hunter2@localhost:54322/postgres")).toBe("localhost:54322/postgres");
  });

  // The same local database is reachable under several spellings.
  test("gives one key to loopback spellings, credentials and query strings", () => {
    const keys = [
      "postgresql://postgres:hunter2@127.0.0.1:54322/postgres",
      "postgresql://postgres@localhost:54322/postgres?schema=public",
      "postgresql://postgres@LOCALHOST:54322/postgres",
      "postgresql://postgres@[::1]:54322/postgres",
    ].map(databaseKeyFor);
    expect(new Set(keys)).toEqual(new Set(["localhost:54322/postgres"]));
  });

  test("never contains the password", () => {
    expect(databaseKeyFor("postgresql://postgres:hunter2@localhost:5432/bip")).not.toContain("hunter2");
  });

  test("defaults the port to 5432 and lowercases other hosts", () => {
    expect(databaseKeyFor("postgresql://db.Example.test/bip")).toBe("db.example.test:5432/bip");
  });

  test("falls back to a fixed key for a missing or unparseable url", () => {
    expect(databaseKeyFor(undefined)).toBe("unknown-database");
    expect(databaseKeyFor("hunter2 not a url")).toBe("unknown-database");
  });
});

describe("defaultCursorFilePath", () => {
  // Every worktree reports the main checkout's .git directory as its common
  // directory, so the file lands in the main checkout whichever worktree runs.
  test("lives at the root of the checkout that owns the shared .git directory", () => {
    expect(defaultCursorFilePath("/workspace/bip-turbo/.git")).toBe("/workspace/bip-turbo/.sync-cursors.json");
  });
});

describe("createFileCursorStore", () => {
  test("treats a missing file as empty", () => {
    const store = createFileCursorStore({ filePath: makeTemporaryFilePath(), databaseKey: "db-a" });
    expect(store.read()).toEqual({});
  });

  test("treats malformed json and wrong shapes as empty", () => {
    const filePath = makeTemporaryFilePath();
    mkdirSync(join(filePath, ".."), { recursive: true });
    const store = createFileCursorStore({ filePath, databaseKey: "db-a" });
    for (const contents of ["{not json", "[1,2]", "null", '{"db-a": "oops"}']) {
      writeFileSync(filePath, contents);
      expect(store.read()).toEqual({});
    }
  });

  test("saves the value, creating the directory, and reads it back", () => {
    const filePath = makeTemporaryFilePath();
    const store = createFileCursorStore({ filePath, databaseKey: "db-a" });
    store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"));
    expect(store.read()).toEqual({ users: "2026-07-10T00:00:00.000Z" });
  });

  // Several worktrees and several resources share one file.
  test("preserves other resources and other database keys when saving", () => {
    const filePath = makeTemporaryFilePath();
    const other = createFileCursorStore({ filePath, databaseKey: "db-b" });
    other.saveIfNewer("users", new Date("2026-01-01T00:00:00Z"));
    const store = createFileCursorStore({ filePath, databaseKey: "db-a" });
    store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"));
    store.saveIfNewer("ratings", new Date("2026-07-11T00:00:00Z"));
    expect(JSON.parse(readFileSync(filePath, "utf8"))).toEqual({
      "db-a": { users: "2026-07-10T00:00:00.000Z", ratings: "2026-07-11T00:00:00.000Z" },
      "db-b": { users: "2026-01-01T00:00:00.000Z" },
    });
  });

  test("only moves a saved value forward", () => {
    const store = createFileCursorStore({ filePath: makeTemporaryFilePath(), databaseKey: "db-a" });
    store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"));
    store.saveIfNewer("users", new Date("2026-05-01T00:00:00Z"));
    expect(store.read().users).toBe("2026-07-10T00:00:00.000Z");
    store.saveIfNewer("users", new Date("2026-08-01T00:00:00Z"));
    expect(store.read().users).toBe("2026-08-01T00:00:00.000Z");
  });

  test("overwrites a malformed file on save", () => {
    const filePath = makeTemporaryFilePath();
    mkdirSync(join(filePath, ".."), { recursive: true });
    writeFileSync(filePath, "{not json");
    const store = createFileCursorStore({ filePath, databaseKey: "db-a" });
    store.saveIfNewer("blogPosts", new Date("2026-07-10T00:00:00Z"));
    expect(store.read()).toEqual({ blogPosts: "2026-07-10T00:00:00.000Z" });
  });
});

describe("createFileCursorStore write behavior", () => {
  // A concurrent reader must see the old file or the new one, never a partial write.
  test("leaves no temporary file behind and writes complete content", () => {
    const filePath = makeTemporaryFilePath();
    const store = createFileCursorStore({ filePath, databaseKey: "db-a" });
    store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"));
    store.saveIfNewer("ratings", new Date("2026-07-11T00:00:00Z"));
    expect(readdirSync(join(filePath, "..")).filter((name) => name.endsWith(".tmp"))).toEqual([]);
    expect(JSON.parse(readFileSync(filePath, "utf8"))).toEqual({
      "db-a": { users: "2026-07-10T00:00:00.000Z", ratings: "2026-07-11T00:00:00.000Z" },
    });
  });

  // The cursor is an optimization; a read-only checkout must not fail the sync.
  test("warns instead of throwing when the file cannot be written", () => {
    const directory = mkdtempSync(join(tmpdir(), "sync-cursors-"));
    const blocker = join(directory, "blocker");
    writeFileSync(blocker, "a regular file, not a directory");
    const warnings: string[] = [];
    const store = createFileCursorStore({
      filePath: join(blocker, "sync-cursors.json"),
      databaseKey: "db-a",
      warn: (message) => warnings.push(message),
    });
    expect(() => store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"))).not.toThrow();
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("sync cursor");
  });
});

describe("createDefaultCursorStore", () => {
  test("falls back to the no-op store and warns once when git cannot be resolved", () => {
    const warnings: string[] = [];
    const store = createDefaultCursorStore({
      databaseUrl: "postgresql://postgres@localhost:54322/postgres",
      resolveGitCommonDirectory: () => {
        throw new Error("not a git repository");
      },
      warn: (message) => warnings.push(message),
    });
    expect(store).toBe(NO_OP_CURSOR_STORE);
    expect(warnings).toEqual(["⚠️  sync cursors disabled: not a git repository"]);
  });

  test("writes at the parent of the git common directory when git resolves", () => {
    const checkoutRoot = mkdtempSync(join(tmpdir(), "sync-cursors-checkout-"));
    const store = createDefaultCursorStore({
      databaseUrl: "postgresql://postgres@localhost:54322/postgres",
      resolveGitCommonDirectory: () => join(checkoutRoot, ".git"),
      warn: () => {
        throw new Error("unexpected warning");
      },
    });
    store.saveIfNewer("users", new Date("2026-07-10T00:00:00Z"));
    const filePath = join(checkoutRoot, ".sync-cursors.json");
    expect(existsSync(filePath)).toBe(true);
    expect(JSON.parse(readFileSync(filePath, "utf8"))).toEqual({
      "localhost:54322/postgres": { users: "2026-07-10T00:00:00.000Z" },
    });
  });
});
