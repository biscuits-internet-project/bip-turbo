import type { Band } from "@bip/domain";
import type { BandRow } from "../_shared/drizzle/types";

export function transformBand(band: BandRow): Band {
  return {
    ...band,
    createdAt: new Date(band.createdAt),
    updatedAt: new Date(band.updatedAt),
  };
}
