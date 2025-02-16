import type { Show } from "@bip/domain";
import type { NewShow } from "../_shared/drizzle/types";
import type { ShowRepository } from "./show-repository";

export interface ShowFilter {
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export class ShowService {
  constructor(private readonly repository: ShowRepository) {}

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
