import type { Song } from "@bip/domain";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { addVenueInfoToSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const SONG_FILTERS = {
	sammy: { endDate: new Date("2005-08-27") },
	allen: { startDate: new Date("2005-12-28"), endDate: new Date("2025-09-07") },
	marlon: { startDate: new Date("2025-10-31") },
	triscuits: { startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

/**
 * For "not played" songs in an era, sort by their overall times played (most popular first).
 * For "played" songs, just filter to those with timesPlayed > 0.
 */
async function filterByPlayStatus(songs: Song[], showNotPlayed: boolean): Promise<Song[]> {
	if (!showNotPlayed) {
		return songs.filter((song) => song.timesPlayed > 0);
	}

	const notPlayedInEra = songs.filter((song) => song.timesPlayed === 0);
	const notPlayedIds = new Set(notPlayedInEra.map((song) => song.id));
	const allSongs = await services.songs.findMany({});
	const overallTimesPlayedMap = new Map<string, number>(
		allSongs.filter((song) => notPlayedIds.has(song.id)).map((song) => [song.id, song.timesPlayed]),
	);

	return notPlayedInEra.sort((a, b) => {
		return (overallTimesPlayedMap.get(b.id) || 0) - (overallTimesPlayedMap.get(a.id) || 0);
	});
}

export const loader = publicLoader(async ({ request }) => {
	const url = new URL(request.url);
	const query = url.searchParams.get("q");
	const era = url.searchParams.get("era");
	const playedParam = url.searchParams.get("played");
	const authorParam = url.searchParams.get("author");
	const coverParam = url.searchParams.get("cover");
	const showNotPlayed = playedParam === "notPlayed";

	const coverFilter = coverParam === "cover" ? true : coverParam === "original" ? false : undefined;

	const authorId = authorParam ? (UUID_REGEX.test(authorParam) ? authorParam : null) : null;
	if (authorParam && !authorId) {
		logger.warn("Ignoring invalid author filter", { authorParam });
	}

	// Handle filtering by author, cover, era, or any combination
	if (authorId || coverFilter !== undefined || (era && era in SONG_FILTERS)) {
		try {
			const filter: { authorId?: string; cover?: boolean; startDate?: Date; endDate?: Date } = {};
			if (authorId) filter.authorId = authorId;
			if (coverFilter !== undefined) filter.cover = coverFilter;

			let songs: Song[];
			if (era && era in SONG_FILTERS) {
				const eraFilter = SONG_FILTERS[era as keyof typeof SONG_FILTERS];
				songs = await services.songs.findManyInDateRange({ ...eraFilter, ...filter });
			} else {
				songs = await services.songs.findMany(filter);
			}

			const filtered = await filterByPlayStatus(songs, showNotPlayed);
			return addVenueInfoToSongs(filtered);
		} catch (error) {
			logger.error("Error fetching filtered songs", { error });
			return [];
		}
	}

	// Handle search query
	if (!query || query.length < 2) {
		return [];
	}

	logger.info(`Song search for '${query}'`);

	try {
		const songs = await services.songs.search(query, 20);
		logger.info(`Song search for '${query}' returned ${songs.length} results`);
		return songs;
	} catch (error) {
		logger.error("Song search error", { error });
		return [];
	}
});
