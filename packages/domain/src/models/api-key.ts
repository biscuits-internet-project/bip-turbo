import { z } from "zod";

/** Every key starts with this, so a leaked key is recognizable (and greppable) as ours. */
export const API_KEY_PREFIX = "bip_";

/** A user may hold this many unrevoked keys at once. */
export const MAX_ACTIVE_API_KEYS = 10;

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  /** The key's first characters, for telling keys apart in a list. */
  prefix: z.string(),
  createdAt: z.date(),
  lastUsedAt: z.date().nullable(),
  /** Raised per-minute limits an admin granted; null means the default. */
  mcpLimitPerMinute: z.number().int().positive().nullable(),
  apiLimitPerMinute: z.number().int().positive().nullable(),
});

export const apiKeyLimitsSchema = z.object({
  mcpLimitPerMinute: z.number().int().positive().max(100_000).nullable(),
  apiLimitPerMinute: z.number().int().positive().max(100_000).nullable(),
});

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "Give the key a name").max(100, "Keep the name under 100 characters"),
});

export type ApiKey = z.infer<typeof apiKeySchema>;
export type CreateApiKey = z.infer<typeof createApiKeySchema>;
export type ApiKeyLimits = z.infer<typeof apiKeyLimitsSchema>;

/** A key as an admin sees it: with its owner, for granting raised limits. */
export type AdminApiKey = ApiKey & { ownerUsername: string | null };

/** The owner of a key presented on a request, and any raised limits it carries. */
export interface ApiKeyOwner extends ApiKeyLimits {
  keyId: string;
  userId: string;
}
