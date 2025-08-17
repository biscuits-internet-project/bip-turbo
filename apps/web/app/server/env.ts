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
});

export const env = envSchema.parse(process.env);
