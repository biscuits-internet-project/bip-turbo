import type { Logger, Show } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewShow } from "../_shared/drizzle/types";
import type { ShowRepository } from "./show-repository";

export interface ShowFilter {
  year: number;
}

export class ShowService extends BaseService {
  constructor(
    private readonly repository: ShowRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async find(id: string): Promise<Show | null> {
    return this.repository.findById(id);
  }

  async findMany(filter: ShowFilter): Promise<Show[]> {
    return this.repository.findMany(filter);
  }

  async create(data: NewShow): Promise<Show> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<NewShow>): Promise<Show> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
