export interface SongFilterConfig {
	label: string;
	startDate?: Date;
	endDate?: Date;
}

export const SONG_FILTERS: Record<string, SongFilterConfig> = {
	sammy: { label: "Sammy Era", endDate: new Date("2005-08-27") },
	allen: { label: "Allen Era", startDate: new Date("2005-12-28"), endDate: new Date("2025-09-07") },
	marlon: { label: "Marlon Era", startDate: new Date("2025-10-31") },
	triscuits: { label: "Triscuits", startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

export const ERA_OPTIONS = Object.entries(SONG_FILTERS).map(([value, config]) => ({
	value,
	label: config.label,
}));
