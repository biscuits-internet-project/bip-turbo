import type { Logger, Show } from "@bip/domain";
import { BaseService } from "../_shared/base-service";
import type { NewShow } from "../_shared/drizzle/types";
import type { ShowRepository } from "./show-repository";

export interface ShowFilter {
  year?: number;
  songId?: string;
}

export class ShowService extends BaseService<Show, NewShow, ShowFilter> {}
