import { z } from "zod";
import { userMinimalSchema } from "./user";

export const attendanceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  showId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const attendanceWithUserSchema = attendanceSchema.extend({
  user: userMinimalSchema,
});

export type Attendance = z.infer<typeof attendanceSchema>;
export type AttendanceWithUser = z.infer<typeof attendanceWithUserSchema>;
