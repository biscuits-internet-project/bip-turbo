import { z } from "zod";

export const envSchema = z.object({
  REDIS_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;
