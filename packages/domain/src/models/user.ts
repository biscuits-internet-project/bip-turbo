import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
  resetPasswordToken: z.string().nullable(),
  resetPasswordSentAt: z.date().nullable(),
  confirmationToken: z.string().nullable(),
  confirmedAt: z.date().nullable(),
  confirmationSentAt: z.date().nullable(),
  passwordDigest: z.string(),
  username: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>; 