import type { Logger } from "@bip/domain";
import type { BaseRepository } from "./database/base-repository";
import type { DbModel } from "./database/models";
import type { BaseEntity } from "./database/types";

export class BaseService<T extends BaseEntity, M extends DbModel> {
  constructor(
    protected repository: BaseRepository<T, M>,
    protected logger: Logger,
  ) {}
}
