const startYear = 1996;
const currentYear = new Date().getFullYear();

const yearFilters = Object.fromEntries(
  Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return [
      String(year),
      {
        startDate: new Date(`${year}-01-01`),
        endDate: new Date(`${year}-12-31`),
      },
    ];
  }),
);

export const SONG_FILTERS = {
  ...yearFilters,
  "Sammy Era": { endDate: new Date("2005-08-27") },
  "Allen Era": { startDate: new Date("2005-12-28"), endDate: new Date("2025-09-07") },
  "Marlon Era": { startDate: new Date("2025-10-31") },
  Triscuits: { startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

export const NOT_PLAYED_SONG_FILTER_PARAM = "Not Played";
export const SONGS_FILTER_PARAM = "filter";
