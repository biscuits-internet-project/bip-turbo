export interface SongFilterConfig {
	label: string;
	startDate?: Date;
	endDate?: Date;
}

const START_YEAR = 1995;

const yearFilters: Record<string, SongFilterConfig> = Object.fromEntries(
	Array.from({ length: new Date().getFullYear() - START_YEAR + 1 }, (_, i) => {
		const year = START_YEAR + i;
		return [
			String(year),
			{
				label: String(year),
				startDate: new Date(`${year}-01-01`),
				endDate: new Date(`${year}-12-31`),
			},
		];
	}),
);

const eraFilters: Record<string, SongFilterConfig> = {
	sammy: { label: "Sammy Era", endDate: new Date("2005-08-27") },
	allen: { label: "Allen Era", startDate: new Date("2005-12-28"), endDate: new Date("2025-09-07") },
	marlon: { label: "Marlon Era", startDate: new Date("2025-10-31") },
	triscuits: { label: "Triscuits", startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

export const SONG_FILTERS: Record<string, SongFilterConfig> = {
	...yearFilters,
	...eraFilters,
};

export const YEAR_OPTIONS = Object.entries(yearFilters)
	.map(([value, config]) => ({ value, label: config.label }))
	.reverse(); // Most recent first

export const ERA_OPTIONS = Object.entries(eraFilters).map(([value, config]) => ({
	value,
	label: config.label,
}));
