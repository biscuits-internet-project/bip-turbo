import type { User } from "@bip/domain";
import { eq } from "drizzle-orm";
import { transformUser } from "..";
import { users } from "../_shared/drizzle";
import type { NewUser } from "../_shared/drizzle/types";
import { BaseRepository } from "../_shared/repository/base";

export class UserRepository extends BaseRepository<User, NewUser> {
  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0] ? transformUser(result[0]) : null;
  }

  async findBySlug(username: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0] ? transformUser(result[0]) : null;
  }

  async findMany(where = undefined): Promise<User[]> {
    const result = await this.db
      .select()
      .from(users)
      .where(where || undefined);
    return result.map(transformUser);
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(data).returning();
    return transformUser(result[0]);
  }

  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const result = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return transformUser(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
