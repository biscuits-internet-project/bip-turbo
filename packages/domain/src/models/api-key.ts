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
});

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1, "Give the key a name").max(100, "Keep the name under 100 characters"),
});

export type ApiKey = z.infer<typeof apiKeySchema>;
export type CreateApiKey = z.infer<typeof createApiKeySchema>;

/** The owner of a key presented on a request. */
export interface ApiKeyOwner {
  keyId: string;
  userId: string;
}
