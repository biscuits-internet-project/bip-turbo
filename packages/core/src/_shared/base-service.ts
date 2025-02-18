import type { Logger } from "@bip/domain";

export abstract class BaseService {
  protected logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger.child({ service: this.constructor.name });
  }
}
