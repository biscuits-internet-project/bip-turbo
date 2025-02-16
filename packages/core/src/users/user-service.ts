import type { User } from "@bip/domain";
import type { UserRepository } from "../_shared/repository";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async find(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }
}
