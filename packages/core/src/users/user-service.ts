import type { Logger, User } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { UserRepository } from "../_shared/repository";

export class UserService extends BaseService {
  constructor(
    private readonly repository: UserRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async find(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }
}
