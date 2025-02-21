import { z } from "zod";

export const envSchema = z.object({
  REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
