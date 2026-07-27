import { z } from "zod";

export const envSchema = z.object({
  REDIS_URL: z.string().url(),
  /** Public origin of the site. Cloudflare purge-by-URL needs absolute URLs. */
  BASE_URL: z.string().url(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_IMAGES_API_TOKEN: z.string(),
  CLOUDFLARE_ZONE_ID: z.string(),
  CLOUDFLARE_CACHE_PURGE_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
