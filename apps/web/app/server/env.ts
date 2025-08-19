import { z } from "zod";

// Define environment schema
export const envSchema = z.object({
  BASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_STORAGE_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  CONTACT_EMAIL: z.string().email(),
  HONEYBADGER_API_KEY: z.string(),
  APP_ENV: z.enum(["development", "staging", "production"]),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
