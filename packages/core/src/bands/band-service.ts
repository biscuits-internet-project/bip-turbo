import type { Logger } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewBand } from "../_shared/drizzle/types";
import type { BandRepository } from "./band-repository";
export interface BandFilter {
  name?: string;
}

export class BandService extends BaseService {
  constructor(
    private readonly repository: BandRepository,
    logger: Logger,
  ) {
    super(logger);
  }

  async find(id: string) {
    return this.repository.findById(id);
  }

  async findMany(filter: BandFilter) {
    return this.repository.findMany(filter);
  }

  async create(data: NewBand) {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<NewBand>) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
