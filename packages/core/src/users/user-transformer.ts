import type { User } from "@bip/domain";
import type { UserRow } from "../_shared/drizzle/types";

export function transformUser(user: UserRow): User {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    resetPasswordSentAt: user.resetPasswordSentAt ? new Date(user.resetPasswordSentAt) : null,
    confirmedAt: user.confirmedAt ? new Date(user.confirmedAt) : null,
    confirmationSentAt: user.confirmationSentAt ? new Date(user.confirmationSentAt) : null,
  };
}
