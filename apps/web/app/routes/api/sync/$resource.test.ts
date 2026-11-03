import { beforeEach, describe, expect, test, vi } from "vitest";

const ADMIN_API_KEY = "test-admin-key";

const listForSync = vi.fn();
const listAllIdsForSync = vi.fn();

vi.mock("~/server/env", () => ({ env: { ADMIN_API_KEY } }));
vi.mock("~/server/services", () => ({
  services: {
    users: { listForSync, listAllIdsForSync },
    ratings: { listForSync, listAllIdsForSync },
    attendances: { listForSync, listAllIdsForSync },
    reviews: { listForSync, listAllIdsForSync },
    blogPosts: { listForSync, listAllIdsForSync },
    aliasRules: { listForSync },
  },
}));

const { loader } = await import("./$resource");

function call(resource: string, query = "", apiKey: string | null = ADMIN_API_KEY) {
  return loader({
    request: new Request(`http://localhost/api/sync/${resource}${query}`, {
      headers: apiKey === null ? {} : { authorization: `Bearer ${apiKey}` },
    }),
    params: { resource },
    context: {} as never,
  } as never) as Promise<Response>;
}

const row = (id: string, updatedAt: string) => ({ id, updatedAt: new Date(updatedAt) });

describe("sync feed auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listForSync.mockResolvedValue([]);
    listAllIdsForSync.mockResolvedValue([]);
  });

  // This feed carries every user id, rating, attendance and review in the database. It
  // lived on the unauthenticated /mcp endpoint; the entire point of moving it was that it
  // now requires a credential.
  test("rejects a request with no credential", async () => {
    expect((await call("users", "?since=2020-01-01T00:00:00Z", null)).status).toBe(401);
    expect(listForSync).not.toHaveBeenCalled();
  });

  test("rejects a wrong credential", async () => {
    expect((await call("users", "?since=2020-01-01T00:00:00Z", "nope")).status).toBe(401);
    expect(listForSync).not.toHaveBeenCalled();
  });

  // Auth must be checked before anything else, so an unauthorized caller can't use error
  // shapes to probe which resources exist.
  test("an unknown resource is still 401 without a credential", async () => {
    expect((await call("not-a-resource", "", null)).status).toBe(401);
  });

  test("an unknown resource is 404 with a valid credential", async () => {
    expect((await call("not-a-resource")).status).toBe(404);
  });
});

describe("sync feed pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listForSync.mockResolvedValue([]);
    listAllIdsForSync.mockResolvedValue([]);
  });

  test("requires a parseable `since`", async () => {
    expect((await call("users")).status).toBe(400);
    expect((await call("users", "?since=yesterday")).status).toBe(400);
    expect(listForSync).not.toHaveBeenCalled();
  });

  test("returns rows under the key the sync script expects", async () => {
    listForSync.mockResolvedValue([row("u1", "2024-01-01T00:00:00Z")]);

    const body = await (await call("users", "?since=2020-01-01T00:00:00Z")).json();

    expect(body.users).toHaveLength(1);
    expect(body.nextCursor).toBeNull();
  });

  test("maps each resource to its own payload key", async () => {
    listForSync.mockResolvedValue([row("x", "2024-01-01T00:00:00Z")]);

    const q = "?since=2020-01-01T00:00:00Z";
    expect(await (await call("ratings", q)).json()).toHaveProperty("ratings");
    expect(await (await call("attendances", q)).json()).toHaveProperty("attendances");
    expect(await (await call("blog-posts", q)).json()).toHaveProperty("blogPosts");
    expect(await (await call("rater-alias-groups", q)).json()).toHaveProperty("raterAliasGroups");
  });

  // A cursor is only issued on a FULL page. Emitting one on a short page would make the
  // sync loop forever on the tail.
  test("issues a cursor only when the page is full", async () => {
    listForSync.mockResolvedValue([row("u1", "2024-01-01T00:00:00Z")]);
    const short = await (await call("users", "?since=2020-01-01T00:00:00Z&limit=2")).json();
    expect(short.nextCursor).toBeNull();

    listForSync.mockResolvedValue([row("u1", "2024-01-01T00:00:00Z"), row("u2", "2024-01-02T00:00:00Z")]);
    const full = await (await call("users", "?since=2020-01-01T00:00:00Z&limit=2")).json();
    expect(full.nextCursor).toEqual(expect.any(String));
  });

  test("a round-tripped cursor resumes after the exact boundary row", async () => {
    listForSync.mockResolvedValue([row("u1", "2024-01-01T00:00:00Z"), row("u2", "2024-01-02T00:00:00Z")]);
    const { nextCursor } = await (await call("users", "?since=2020-01-01T00:00:00Z&limit=2")).json();

    vi.clearAllMocks();
    listForSync.mockResolvedValue([]);
    await call("users", `?since=2020-01-01T00:00:00Z&limit=2&cursor=${encodeURIComponent(nextCursor)}`);

    expect(listForSync).toHaveBeenCalledWith(
      expect.objectContaining({ cursorId: "u2", cursorUpdatedAt: new Date("2024-01-02T00:00:00Z") }),
    );
  });

  test("a corrupt cursor is ignored rather than throwing", async () => {
    await call("users", "?since=2020-01-01T00:00:00Z&cursor=not-base64!!");

    expect(listForSync).toHaveBeenCalledWith(
      expect.objectContaining({ cursorId: undefined, cursorUpdatedAt: undefined }),
    );
  });

  // The limit reaches a SQL `take`; unbounded or garbage values must not pass through.
  test("clamps the limit", async () => {
    const q = "?since=2020-01-01T00:00:00Z";
    await call("users", `${q}&limit=999999`);
    expect(listForSync).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 5000 }));

    await call("users", `${q}&limit=-5`);
    expect(listForSync).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 2000 }));

    await call("users", `${q}&limit=abc`);
    expect(listForSync).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 2000 }));

    await call("users", `${q}&limit=10`);
    expect(listForSync).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 10 }));
  });
});

describe("sync id listings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listAllIdsForSync.mockResolvedValue(["a", "b"]);
  });

  test("returns the full id set for deletion reconcile", async () => {
    const body = await (await call("users", "?ids=1")).json();

    expect(body).toEqual({ ids: ["a", "b"] });
    expect(listForSync).not.toHaveBeenCalled();
  });

  // Only the documented `?ids=1` selects the full-table id read. `ids=0` or `ids=` reads
  // as "not the id form" to a human, so it must not quietly trigger the expensive one.
  test("only ids=1 selects the id dump", async () => {
    for (const value of ["0", "", "false"]) {
      await call("users", `?ids=${value}&since=2026-01-01T00:00:00Z`);
    }
    expect(listAllIdsForSync).not.toHaveBeenCalled();
  });

  test("the id form does not require `since`", async () => {
    expect((await call("reviews", "?ids=1")).status).toBe(200);
  });

  // Merge rules are rebuilt wholesale rather than diffed, so there is no id endpoint —
  // it must fail cleanly instead of throwing a 500.
  test("rater-alias-groups has no id listing", async () => {
    expect((await call("rater-alias-groups", "?ids=1")).status).toBe(400);
  });
});
