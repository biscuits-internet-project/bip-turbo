import { z } from "zod";

export const rockOperaSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RockOpera = z.infer<typeof rockOperaSchema>;

/**
 * Pointer to the chronologically adjacent performance of the same rock
 * opera. `gap` is the count of `count_for_stats=true` shows strictly
 * between the two performance dates (matches Track.gap semantics).
 */
export type AdjacentRockOperaPerformance = {
  date: string;
  slug: string | null;
  gap: number;
};

/**
 * One rock opera annotation on a show, including the show's 1-based rank
 * among all full performances of that rock opera (chronological order).
 * `previousPerformance` is absent on the 1st full performance ever;
 * `nextPerformance` is absent on the most recent one. Surfaced by
 * setlist composers for show-page rendering.
 */
export type RockOperaPerformanceAnnotation = {
  rockOpera: Pick<RockOpera, "slug" | "name" | "shortName">;
  performanceNumber: number;
  previousPerformance: AdjacentRockOperaPerformance | null;
  nextPerformance: AdjacentRockOperaPerformance | null;
};
