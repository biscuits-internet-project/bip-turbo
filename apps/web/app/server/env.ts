import { z } from "zod";

// Define environment schema
export const envSchema = z.object({
  BASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_STORAGE_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  CONTACT_EMAIL: z.string().email(),
  HONEYBADGER_API_KEY: z.string(),
  APP_ENV: z.enum(["development", "staging", "production"]),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_IMAGES_API_TOKEN: z.string(),
  CLOUDFLARE_ZONE_ID: z.string(),
  CLOUDFLARE_CACHE_PURGE_TOKEN: z.string(),
  // Shared secret for machine callers (the cron workflow, ops scripts). Optional so a
  // missing value can't crash boot in dev or CI — the check site fails closed instead,
  // rejecting every request when it is unset rather than taking the app down.
  ADMIN_API_KEY: z.string().optional(),
  // "true" keeps /mcp open to callers without a credential (rate-limited by IP)
  // while MCP sign-in rolls out. Unset or "false" requires sign-in.
  MCP_ALLOW_ANONYMOUS: z.enum(["true", "false"]).optional(),
  // Salts the published fingerprint of a shared email-alias namespace, so two
  // duplicate-account groups under different subdomains stay distinguishable without
  // either subdomain ever leaving the database. Optional on purpose: absent, the
  // duplicate-account job records the signal label with no fingerprint, so no secret
  // setup gates it.
  DUPLICATE_ACCOUNT_HASH_SALT: z.string().optional(),
});

export const env = envSchema.parse(process.env);
