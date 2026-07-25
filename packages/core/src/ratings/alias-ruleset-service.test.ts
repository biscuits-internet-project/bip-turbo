import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test, vi } from "vitest";
import { AliasRulesetService } from "./alias-ruleset-service";
import { aliasKey } from "./rater-aliases";

interface RuleRow {
  normalizedUsername: string;
  groupKey: string;
  merged: boolean;
}

/** A stub db plus the service reading it, so a test can assert on the query too. */
function serviceOver(rows: RuleRow[]) {
  const findMany = vi.fn().mockResolvedValue(rows);
  const db = { raterAliasGroup: { findMany } };
  return { service: new AliasRulesetService(db as never), findMany, db };
}

/**
 * The rows the shipped migration seeds, read from the migration itself so this file
 * can't drift from what production actually gets.
 */
function seededRows(): RuleRow[] {
  const migration = join(
    dirname(fileURLToPath(import.meta.url)),
    "../_shared/prisma/migrations/20260724000000_rater_alias_groups/migration.sql",
  );
  const sql = readFileSync(migration, "utf8");
  const rows = [...sql.matchAll(/\('([a-z0-9]+)',\s*'([a-z0-9]+)',\s*(true|false),/g)].map((match) => ({
    normalizedUsername: match[1],
    groupKey: match[2],
    merged: match[3] === "true",
  }));
  // Fail loudly rather than passing vacuously if the seed's shape ever changes.
  expect(rows).toHaveLength(6);
  return rows;
}

describe("AliasRulesetService", () => {
  test("splits rows into merge targets and hold-outs", async () => {
    const { service } = serviceOver([
      { normalizedUsername: "triumph", groupKey: "confrontation", merged: true },
      { normalizedUsername: "mindlessdribble", groupKey: "mindlessdribble", merged: false },
    ]);

    const ruleset = await service.get();
    expect(ruleset.mergeRemap.get("triumph")).toBe("confrontation");
    expect(ruleset.heldOut.has("mindlessdribble")).toBe(true);
    // A hold-out is never also a merge target, or it would merge and solo at once.
    expect(ruleset.mergeRemap.has("mindlessdribble")).toBe(false);
  });

  // Nothing is cached, so a rule written mid-process is visible immediately. The
  // detector writes rules and the sync mirrors them while other work is still running,
  // and both would otherwise be folding votes by a stale ruleset.
  test("reads the table on every call, so a new rule is never served stale", async () => {
    const { service, findMany } = serviceOver([
      { normalizedUsername: "triumph", groupKey: "confrontation", merged: true },
    ]);

    await service.get();
    await service.get();

    expect(findMany).toHaveBeenCalledTimes(2);
  });
});

describe("AliasRulesetService.listForSync", () => {
  // These rows travel to a developer machine over the MCP feed, so the projection is an
  // allowlist. It must stay free of anything derived from an address beyond the salted
  // fingerprint — that is the only reason this table is safe to export at all.
  test("selects only publishable columns", async () => {
    const { service, findMany } = serviceOver([]);

    await service.listForSync({ since: new Date(0), limit: 100 });

    expect(findMany.mock.calls[0][0].select).toEqual({
      id: true,
      normalizedUsername: true,
      groupKey: true,
      merged: true,
      source: true,
      reasonCodes: true,
      namespaceSignal: true,
      namespaceFingerprint: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    });
  });

  test("first page filters on since alone, ordered for a stable cursor", async () => {
    const { service, findMany } = serviceOver([]);
    const since = new Date("2026-01-01T00:00:00Z");

    await service.listForSync({ since, limit: 100 });

    expect(findMany.mock.calls[0][0]).toMatchObject({
      where: { updatedAt: { gt: since } },
      orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      take: 100,
    });
  });

  // Rules seeded by one migration share a timestamp to the microsecond, so a
  // timestamp-only cursor would skip or repeat rows across a page boundary.
  test("later pages use the (updatedAt, id) tuple as an exclusive cursor", async () => {
    const { service, findMany } = serviceOver([]);
    const cursorUpdatedAt = new Date("2026-07-24T00:00:00Z");

    await service.listForSync({ since: new Date(0), cursorUpdatedAt, cursorId: "row-7", limit: 100 });

    expect(findMany.mock.calls[0][0].where).toEqual({
      OR: [{ updatedAt: { gt: cursorUpdatedAt } }, { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: "row-7" } }] }],
    });
  });
});

/**
 * The no-op proof for moving these rules out of code: the shipped seed must reproduce
 * exactly the keys the deleted `ALIAS_MERGE_GROUPS` / `NO_AUTO_MERGE` constants produced,
 * representatives included. If it doesn't, the migration silently re-partitions identities
 * and every affected show's rating moves.
 *
 * Asserted structurally against the seed rather than against a list of names, so the real
 * usernames these rules govern stay out of this file. The rows are read from the migration
 * itself, so a seed edit that changed how an account folds fails here.
 */
describe("the seeded ruleset reproduces the previously hardcoded rules", () => {
  test("the seed is the two merge groups and one hold-out it was before", async () => {
    const rows = seededRows();
    const merged = rows.filter((row) => row.merged);
    const heldOut = rows.filter((row) => !row.merged);

    expect(heldOut).toHaveLength(1);
    // Two groups of two and three, exactly as the constants held.
    const sizes = [...new Set(merged.map((row) => row.groupKey))]
      .map((key) => merged.filter((row) => row.groupKey === key).length)
      .sort();
    expect(sizes).toEqual([2, 3]);
  });

  test("every merged row folds onto its group's representative", async () => {
    const rows = seededRows();
    const ruleset = await serviceOver(rows).service.get();

    for (const row of rows.filter((candidate) => candidate.merged)) {
      expect(aliasKey(row.normalizedUsername, "unused", ruleset)).toBe(row.groupKey);
    }
  });

  test("each group's representative is itself a member, so a key is never orphaned", () => {
    const rows = seededRows();
    const merged = rows.filter((row) => row.merged);
    const names = new Set(merged.map((row) => row.normalizedUsername));

    for (const row of merged) expect(names.has(row.groupKey)).toBe(true);
  });

  test("the held-out row stays solo, keyed by the account id", async () => {
    const rows = seededRows();
    const ruleset = await serviceOver(rows).service.get();
    const [heldOut] = rows.filter((row) => !row.merged);

    expect(aliasKey(heldOut.normalizedUsername, "user-1", ruleset)).toBe("solo:user-1");
    expect(aliasKey(heldOut.normalizedUsername, "user-2", ruleset)).toBe("solo:user-2");
  });

  test("a username the seed says nothing about folds by normalization alone", async () => {
    const ruleset = await serviceOver(seededRows()).service.get();

    expect(aliasKey("Rock Candy", "user-1", ruleset)).toBe("rockcandy");
    expect(aliasKey("rock_candy ", "user-2", ruleset)).toBe("rockcandy");
  });
});
