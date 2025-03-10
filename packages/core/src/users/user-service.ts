import type { Logger, User } from "@bip/domain";
import type { UserRepository } from "./user-repository";

export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly logger: Logger,
  ) {}

  async find(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }
}
