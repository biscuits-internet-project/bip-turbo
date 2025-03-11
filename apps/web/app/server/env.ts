import { z } from "zod";

// Define environment schema
export const envSchema = z.object({
  BASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_STORAGE_URL: z.string().url().default("http://127.0.0.1:54321/storage/v1"),
});

export const env = envSchema.parse(process.env);
