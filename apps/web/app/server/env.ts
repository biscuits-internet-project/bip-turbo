import { z } from "zod";

// Define environment schema
export const envSchema = z.object({
  BASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
