import type { FilterCondition } from "@bip/core/_shared/database/types";
import type { Show } from "@bip/domain";
import { services } from "~/server/services";

export const MIN_SHOW_RATINGS = 10;

export interface TopRatedShowsLoaderData {
  shows: Show[];
  year: number | null;
}
export interface ShowWithRank extends Show {
  rank: number;
}

export async function getTopRatedShows(year: number | null): Promise<TopRatedShowsLoaderData> {
  const yearFilters: FilterCondition<Show>[] = year
    ? [
        {
          field: "date",
          operator: "gte",
          value: `${year}-01-01`,
        },
        {
          field: "date",
          operator: "lte",
          value: `${year}-12-31`,
        },
      ]
    : [];
  const shows = await services.shows.search("", {
    pagination: { page: 1, limit: 100 },
    sort: [{ field: "averageRating", direction: "desc" }],
    filters: [
      {
        field: "averageRating",
        operator: "gt",
        value: 0,
      },
      {
        field: "ratingsCount",
        operator: "gt",
        value: MIN_SHOW_RATINGS,
      },
      ...yearFilters,
    ],
    includes: ["venue"],
  });
  return { shows, year };
}
