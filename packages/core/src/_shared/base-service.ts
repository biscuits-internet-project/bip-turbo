import type { Logger } from "@bip/domain";
import type { BaseRepository } from "./repository/base";

export class BaseService<T, TNew, TFilter> {
  constructor(
    protected repository: BaseRepository<T, TNew, TFilter>,
    protected logger: Logger,
  ) {}
}
