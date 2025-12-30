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
});

export const env = envSchema.parse(process.env);
