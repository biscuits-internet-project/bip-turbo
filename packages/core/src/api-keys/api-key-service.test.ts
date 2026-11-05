import { MAX_ACTIVE_API_KEYS } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { ApiKeyLimitError, ApiKeyService } from "./api-key-service";

type Row = {
  id: string;
  userId: string;
  name: string;
  prefix: string;
  keyHash: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

/** Just enough of `db.apiKey` for the service, backed by an array. */
function fakeDb() {
  const rows: Row[] = [];
  const matches = (row: Row, where: Partial<Row>) =>
    Object.entries(where).every(([key, value]) => row[key as keyof Row] === value);
  const apiKey = {
    count: async ({ where }: { where: Partial<Row> }) => rows.filter((r) => matches(r, where)).length,
    create: async ({ data }: { data: Pick<Row, "userId" | "name" | "prefix" | "keyHash"> }) => {
      const row: Row = {
        ...data,
        id: `key-${rows.length + 1}`,
        createdAt: new Date(Date.now() + rows.length),
        lastUsedAt: null,
        revokedAt: null,
      };
      rows.push(row);
      return row;
    },
    findMany: async ({ where }: { where: Partial<Row> }) =>
      rows.filter((r) => matches(r, where)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    findUnique: async ({ where }: { where: { keyHash: string } }) => rows.find((r) => r.keyHash === where.keyHash),
    update: async ({ where, data }: { where: { id: string }; data: Partial<Row> }) => {
      const row = rows.find((r) => r.id === where.id);
      Object.assign(row ?? {}, data);
      return row;
    },
    updateMany: async ({ where, data }: { where: Partial<Row>; data: Partial<Row> }) => {
      const hit = rows.filter((r) => matches(r, where));
      for (const row of hit) Object.assign(row, data);
      return { count: hit.length };
    },
  };
  return { rows, db: { apiKey } as never };
}

describe("ApiKeyService", () => {
  test("returns the secret once and stores only its hash", async () => {
    const { rows, db } = fakeDb();
    const { apiKey, secret } = await new ApiKeyService(db).create("u1", "my script");

    expect(secret).toMatch(/^bip_[A-Za-z0-9_-]{43}$/);
    expect(apiKey.prefix).toBe(secret.slice(0, 12));
    expect(JSON.stringify(rows)).not.toContain(secret);
  });

  test("authenticates an active key as its owner", async () => {
    const { db } = fakeDb();
    const service = new ApiKeyService(db);
    const { apiKey, secret } = await service.create("u1", "my script");

    expect(await service.authenticate(secret)).toEqual({ keyId: apiKey.id, userId: "u1" });
  });

  test("records when a key was last used", async () => {
    const { rows, db } = fakeDb();
    const service = new ApiKeyService(db);
    const { secret } = await service.create("u1", "my script");
    await service.authenticate(secret);

    expect(rows[0].lastUsedAt).toBeInstanceOf(Date);
  });

  test("rejects a revoked key, an unknown key, and anything without the prefix", async () => {
    const { db } = fakeDb();
    const service = new ApiKeyService(db);
    const { apiKey, secret } = await service.create("u1", "my script");
    await service.revoke("u1", apiKey.id);

    expect(await service.authenticate(secret)).toBeNull();
    expect(await service.authenticate(`bip_${"x".repeat(43)}`)).toBeNull();
    expect(await service.authenticate("eyJhbGciOi.a.b")).toBeNull();
  });

  test("only revokes the caller's own keys", async () => {
    const { db } = fakeDb();
    const service = new ApiKeyService(db);
    const { apiKey, secret } = await service.create("u1", "my script");

    expect(await service.revoke("someone-else", apiKey.id)).toBe(false);
    expect(await service.authenticate(secret)).not.toBeNull();
  });

  test("lists active keys newest first, without revoked ones", async () => {
    const { db } = fakeDb();
    const service = new ApiKeyService(db);
    const first = await service.create("u1", "first");
    await service.create("u1", "second");
    await service.create("u2", "not mine");
    await service.revoke("u1", first.apiKey.id);

    expect((await service.listActive("u1")).map((key) => key.name)).toEqual(["second"]);
  });

  test(`caps a user at ${MAX_ACTIVE_API_KEYS} active keys`, async () => {
    const { db } = fakeDb();
    const service = new ApiKeyService(db);
    for (let i = 0; i < MAX_ACTIVE_API_KEYS; i++) await service.create("u1", `key ${i}`);

    await expect(service.create("u1", "one too many")).rejects.toBeInstanceOf(ApiKeyLimitError);
  });
});
