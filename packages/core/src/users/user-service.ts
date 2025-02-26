import type { Logger, User } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { DbUser } from "../_shared/database/models";
import type { UserRepository } from "./user-repository";

export class UserService extends BaseService<User, DbUser> {
  constructor(
    protected readonly repository: UserRepository,
    logger: Logger,
  ) {
    super(repository, logger);
  }

  async find(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }
}
