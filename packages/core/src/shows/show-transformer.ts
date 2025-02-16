import type { Show } from "@bip/domain";
import type { ShowRow } from "../_shared/drizzle/types";

export function transformShow(show: ShowRow): Show {
  return {
    ...show,
    date: new Date(show.date),
    createdAt: new Date(show.createdAt),
    updatedAt: new Date(show.updatedAt),
  };
}
