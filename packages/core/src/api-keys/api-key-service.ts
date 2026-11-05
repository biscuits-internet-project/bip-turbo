import { createHash, randomBytes } from "node:crypto";
import {
  type AdminApiKey,
  API_KEY_PREFIX,
  type ApiKey,
  type ApiKeyLimits,
  type ApiKeyOwner,
  MAX_ACTIVE_API_KEYS,
} from "@bip/domain";
import type { DbApiKey, DbClient } from "../_shared/database/models";

/** How stale `last_used_at` may get before a request refreshes it, so busy keys don't write on every call. */
const LAST_USED_RESOLUTION_MS = 5 * 60 * 1000;

/** Shown in the list so its owner can tell keys apart; long enough to be distinct, short of a usable secret. */
const DISPLAYED_PREFIX_LENGTH = API_KEY_PREFIX.length + 8;

export class ApiKeyLimitError extends Error {
  constructor() {
    super(`You can have at most ${MAX_ACTIVE_API_KEYS} API keys. Revoke one to create another.`);
    this.name = "ApiKeyLimitError";
  }
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function toApiKey(row: DbApiKey): ApiKey {
  return {
    id: row.id,
    name: row.name,
    prefix: row.prefix,
    createdAt: row.createdAt,
    lastUsedAt: row.lastUsedAt,
    mcpLimitPerMinute: row.mcpLimitPerMinute,
    apiLimitPerMinute: row.apiLimitPerMinute,
  };
}

export class ApiKeyService {
  constructor(private readonly db: DbClient) {}

  /**
   * Creates a key and returns it with its secret, which is never stored and can't be
   * shown again. The secret is 32 random bytes, so a plain SHA-256 is enough to store
   * it safely: there is no low-entropy password to brute-force.
   */
  async create(userId: string, name: string): Promise<{ apiKey: ApiKey; secret: string }> {
    const active = await this.db.apiKey.count({ where: { userId, revokedAt: null } });
    if (active >= MAX_ACTIVE_API_KEYS) throw new ApiKeyLimitError();

    const secret = `${API_KEY_PREFIX}${randomBytes(32).toString("base64url")}`;
    const row = await this.db.apiKey.create({
      data: { userId, name, prefix: secret.slice(0, DISPLAYED_PREFIX_LENGTH), keyHash: hashKey(secret) },
    });
    return { apiKey: toApiKey(row), secret };
  }

  async listActive(userId: string): Promise<ApiKey[]> {
    const rows = await this.db.apiKey.findMany({
      where: { userId, revokedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toApiKey);
  }

  /** Every active key with its owner's username, most recently used first, for the admin page. */
  async listAllActive(): Promise<AdminApiKey[]> {
    const rows = await this.db.apiKey.findMany({
      where: { revokedAt: null },
      include: { user: { select: { username: true } } },
      orderBy: [{ lastUsedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    });
    return rows.map((row) => ({ ...toApiKey(row), ownerUsername: row.user.username }));
  }

  /** Sets a key's raised limits (null restores the default). Returns false when there is no such active key. */
  async setLimits(id: string, limits: ApiKeyLimits): Promise<boolean> {
    const { count } = await this.db.apiKey.updateMany({ where: { id, revokedAt: null }, data: limits });
    return count > 0;
  }

  /** Revokes one of the user's own keys. Returns false when there was no such active key. */
  async revoke(userId: string, id: string): Promise<boolean> {
    const { count } = await this.db.apiKey.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return count > 0;
  }

  /** Resolves a presented key to its owner, or null when it isn't an active key. */
  async authenticate(secret: string): Promise<ApiKeyOwner | null> {
    if (!secret.startsWith(API_KEY_PREFIX)) return null;

    const row = await this.db.apiKey.findUnique({ where: { keyHash: hashKey(secret) } });
    if (!row || row.revokedAt) return null;

    const now = new Date();
    if (!row.lastUsedAt || now.getTime() - row.lastUsedAt.getTime() > LAST_USED_RESOLUTION_MS) {
      await this.db.apiKey.update({ where: { id: row.id }, data: { lastUsedAt: now } });
    }
    return {
      keyId: row.id,
      userId: row.userId,
      mcpLimitPerMinute: row.mcpLimitPerMinute,
      apiLimitPerMinute: row.apiLimitPerMinute,
    };
  }
}
