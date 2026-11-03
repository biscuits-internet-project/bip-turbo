import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/**
 * The public MCP surface, pinned.
 *
 * An outside developer building on this server read `/mcp-info`, called `tools/list`, and
 * found 28 tools against 16 documented — reasonably concluding the extra 12 were leaked
 * internals. They were replication tooling that had accumulated on the public endpoint.
 *
 * Two invariants keep that from recurring:
 *   1. Replication tools live behind auth at /api/sync/*, never on /mcp.
 *   2. What the server advertises matches what /mcp-info documents.
 *
 * Read as source text rather than imported: the route pulls in ~/server/services, which
 * validates server env at import time, and this assertion is about the declared surface.
 */

const ROUTE_SOURCE = readFileSync(join(__dirname, "index.tsx"), "utf8");
const INFO_SOURCE = readFileSync(join(__dirname, "..", "mcp-info.tsx"), "utf8");

function declaredToolNames(source: string): string[] {
  return [...source.matchAll(/^ {4}name: "([a-z_]+)",$/gm)].map((m) => m[1]);
}

function documentedToolNames(source: string): string[] {
  return [...source.matchAll(/font-mono text-brand-secondary font-semibold text-sm">([a-z_]+)</g)].map((m) => m[1]);
}

describe("public MCP tool surface", () => {
  test("advertises exactly the documented tools", () => {
    expect(declaredToolNames(ROUTE_SOURCE).sort()).toEqual(documentedToolNames(INFO_SOURCE).sort());
  });

  // The endpoint is unauthenticated by design — it serves public setlist data. That is
  // exactly why nothing touching user rows may be reachable from it.
  test("exposes no replication tooling", () => {
    const names = declaredToolNames(ROUTE_SOURCE);

    expect(names.filter((name) => name.startsWith("list_"))).toEqual([]);
    expect(ROUTE_SOURCE).not.toContain("listForSync");
    expect(ROUTE_SOURCE).not.toContain("listAllIdsForSync");
  });

  // Every batch getter takes an array of slugs and spends at least one query per entry, so
  // an uncapped array turns one anonymous request into unbounded sequential queries.
  test("batch getters cap their slug arrays", () => {
    const batchSites = [...ROUTE_SOURCE.matchAll(/const (?:showSlugs|slugs) = ([^;]+);/g)].map((m) => m[1]);

    expect(batchSites.length).toBeGreaterThan(0);
    for (const site of batchSites) {
      expect(site).toContain("clampSlugs");
    }
  });
});
