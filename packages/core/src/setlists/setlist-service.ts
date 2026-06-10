import {
  type Annotation,
  average,
  type FlagRecurrence,
  type Instrument,
  type MusicianRef,
  median,
  narrowSongKind,
  RECURRENCE_THRESHOLDS,
  type RecurrenceKind,
  type RecurrenceThreshold,
  type SegueRecurrence,
  type SegueRecurrenceKind,
  type Setlist,
  type SetlistLight,
  type Show,
  type ShowLineupMember,
  type Track,
  type TrackFlag,
  type TrackLight,
  type TrackMusicianDelta,
  type Venue,
} from "@bip/domain";
import type {
  DbAnnotation,
  DbClient,
  DbInstrument,
  DbMusician,
  DbShow,
  DbSong,
  DbTrack,
  DbVenue,
} from "../_shared/database/models";
import type { PaginationOptions, SortOptions } from "../_shared/database/types";
import {
  NON_STUB_SHOWS_WHERE,
  resolveShowOrderBy,
  SHOW_ORDER_ASC,
  SHOW_ORDER_DESC,
  STATS_SHOWS_WHERE,
} from "../_shared/show-ordering";
import type { RockOperaService } from "../rock-operas/rock-opera-service";

/**
 * Filter options for setlist queries. The `hasPhotos` / `hasYoutube` flags
 * are tri-state: `true` requires the media, `false` requires its absence,
 * and `undefined` skips the filter. Drives the year-page tri-state media
 * toggles where users can include OR exclude shows by media presence.
 */
export type SetlistFilter = {
  year?: number;
  monthDay?: string;
  venueId?: string;
  hasPhotos?: boolean;
  hasYoutube?: boolean;
};

/**
 * Translate a tri-state media filter into a Prisma numeric where-clause for
 * a denormalized count column (showPhotosCount, showYoutubesCount).
 */
function countFilter(flag: boolean | undefined) {
  if (flag === undefined) return undefined;
  return flag ? { gt: 0 } : { equals: 0 };
}

type DbTrackLight = {
  id: string;
  showId: string;
  songId: string;
  set: string;
  position: number;
  segue: string | null;
  likesCount: number;
  note: string | null;
  allTimer: boolean | null;
  averageRating: number | null;
  ratingsCount: number;
  gap: number | null;
  previousPerformanceShowId: string | null;
  duration: number | null;
  durationSource: string | null;
  previousPerformanceShow: { date: string; slug: string | null } | null;
  trackFlags?: {
    flag: TrackFlag;
    flagVersionGap?: number | null;
    flagGap?: number | null;
    flagPreviousShow?: { date: string; slug: string | null } | null;
  }[];
  segueRecurrences?: {
    kind: SegueRecurrenceKind;
    versionGap: number | null;
    gap: number | null;
    previousShow: { date: string; slug: string | null } | null;
  }[];
  completionsAsLater?: {
    earlierTrack: { show: { date: string; slug: string | null }; song: { title: string } | null };
  }[];
  completionAsEarlier?: {
    laterTrack: { show: { date: string; slug: string | null }; song: { title: string } | null };
  } | null;
  trackMusicians?: DbTrackMusicianWithRelations[];
  song: {
    id: string;
    title: string;
    slug: string;
    kind: string | null;
    author: { name: string | null } | null;
  } | null;
  annotations: DbAnnotation[];
};

/**
 * Eligible gap values for setlist-level aggregations. Excludes debuts (gap
 * is null — no prior performance to compare against) and within-show
 * repeats (a song's second appearance in the same show carries the same
 * gap as its first; counting it would double-weight that song's recency).
 * Shared by the average and median computations so both apply identical
 * exclusion rules.
 */
export function eligibleGapsForAggregation(
  tracks: ReadonlyArray<{ songId: string; position: number; gap: number | null }>,
): number[] {
  const seenSongIds = new Set<string>();
  const eligible: number[] = [];
  const ordered = [...tracks].sort((a, b) => a.position - b.position);
  for (const t of ordered) {
    if (t.gap === null) continue;
    if (seenSongIds.has(t.songId)) continue;
    seenSongIds.add(t.songId);
    eligible.push(t.gap);
  }
  return eligible;
}

/**
 * Count of distinct catalog debuts in a setlist — tracks with `gap === null`,
 * deduped by songId so a song played twice in the show counts as one debut.
 * Surfaced alongside the avg/median gap because debuts are excluded from those
 * numbers but are themselves a strong rarity signal users want to see.
 */
export function computeDebutCount(tracks: ReadonlyArray<{ songId: string; gap: number | null }>): number {
  const debutSongIds = new Set<string>();
  for (const t of tracks) {
    if (t.gap === null) debutSongIds.add(t.songId);
  }
  return debutSongIds.size;
}

function previousPerformanceShowFromDb(
  prev: { date: string; slug: string | null } | null,
): { date: string; slug: string } | null {
  if (!prev || !prev.slug) return null;
  return { date: String(prev.date), slug: prev.slug };
}

// Mapper functions
function mapShowToDomainEntity(dbShow: DbShow): Show {
  const { createdAt, updatedAt, slug, venueId, bandId, ...rest } = dbShow;
  return {
    ...rest,
    slug: slug ?? "",
    venueId: venueId ?? "",
    bandId: bandId ?? "",
    date: String(dbShow.date),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapVenueToDomainEntity(dbVenue: DbVenue): Venue {
  const { createdAt, updatedAt, name, slug, city, country, ...rest } = dbVenue;
  return {
    ...rest,
    name: name ?? "",
    slug: slug ?? "",
    city: city ?? "",
    country: country ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;
  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

// Collect the linkable shows from a set of completion rows, dropping any whose
// show lacks a slug (can't be linked). Ordered by show date so multi-version
// footnotes read chronologically. `otherSongTitle` is set only when the linked
// version is a differently-named song than `currentSongTitle`, so the footnote
// reads "… version of <name>".
function completionShowsFromDb(
  currentSongTitle: string | null | undefined,
  rows: Array<{ show: { date: string; slug: string | null }; songTitle: string | null }> | null | undefined,
): Array<{ date: string; slug: string; otherSongTitle?: string }> {
  return (rows ?? [])
    .filter((row): row is { show: { date: string; slug: string }; songTitle: string | null } => Boolean(row.show.slug))
    .map((row) => {
      const differs = Boolean(row.songTitle) && row.songTitle !== currentSongTitle;
      return {
        date: String(row.show.date),
        slug: row.show.slug,
        ...(differs ? { otherSongTitle: row.songTitle as string } : {}),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Whether a recurrence of `kind` should ship to the client. A kind absent from
 * the threshold map is display-disabled and never shows. A first-ever recurrence
 * (null gaps) shows EXCEPT on the song's debut (where "1st <anything>" is noise —
 * the debut footnote covers it). Otherwise the per-kind compound rule applies:
 * fire when `versionGap >= version` OR `(versionGap > minVersions AND showGap >
 * minShows)` — a big version gap always notes; a moderate one only if it's also
 * a long calendar absence. A versionGap of 0 (prior version was already the same
 * shape — no shape change) never shows. The lean-payload gate.
 */
function recurrenceQualifies(
  kind: RecurrenceKind,
  versionGap: number | null,
  showGap: number | null,
  isFirstTime: boolean,
  isDebut: boolean,
  thresholds: Partial<Record<RecurrenceKind, RecurrenceThreshold>>,
): boolean {
  const threshold = thresholds[kind];
  if (threshold === undefined) return false;
  if (isFirstTime) return !isDebut;
  if (versionGap === null) return false;
  if (versionGap >= threshold.version) return true;
  return versionGap > threshold.minVersions && showGap !== null && showGap > threshold.minShows;
}

/**
 * The versionGap to PROJECT for a first-ever recurrence: the count of versions
 * before it (so the footnote can read "1st <…> (after X versions)") — but only
 * when that count clears the kind's `version` threshold, marking a notably late
 * first appearance. Below threshold (or kind disabled) → null, so the footnote
 * stays a plain "1st time" / "1st <noun>".
 */
function firstEverVersionsBefore(
  kind: RecurrenceKind,
  versionsBefore: number | null,
  thresholds: Partial<Record<RecurrenceKind, RecurrenceThreshold>>,
): number | null {
  const threshold = thresholds[kind];
  if (threshold === undefined || versionsBefore === null) return null;
  return versionsBefore >= threshold.version ? versionsBefore : null;
}

/** Project the displayable flag recurrences from a track's raw track_flags rows.
 *  `isDebut` is true when the track is the song's first-ever performance. */
export function gateFlagRecurrences(
  rows: Array<{
    flag: TrackFlag;
    flagVersionGap: number | null;
    flagGap: number | null;
    flagPreviousShow: { date: string; slug: string | null } | null;
  }>,
  isDebut: boolean,
  thresholds: Partial<Record<RecurrenceKind, RecurrenceThreshold>> = RECURRENCE_THRESHOLDS,
): FlagRecurrence[] {
  const out: FlagRecurrence[] = [];
  for (const row of rows) {
    const lastPlayed = previousPerformanceShowFromDb(row.flagPreviousShow);
    if (!recurrenceQualifies(row.flag, row.flagVersionGap, row.flagGap, lastPlayed === null, isDebut, thresholds))
      continue;
    const versionGap =
      lastPlayed === null ? firstEverVersionsBefore(row.flag, row.flagVersionGap, thresholds) : row.flagVersionGap;
    out.push({ flag: row.flag, versionGap, gap: row.flagGap, lastPlayed });
  }
  return out;
}

/** Project the displayable segue recurrences from a track's raw rows. */
export function gateSegueRecurrences(
  rows: Array<{
    kind: SegueRecurrenceKind;
    versionGap: number | null;
    gap: number | null;
    previousShow: { date: string; slug: string | null } | null;
  }>,
  isDebut: boolean,
  thresholds: Partial<Record<RecurrenceKind, RecurrenceThreshold>> = RECURRENCE_THRESHOLDS,
): SegueRecurrence[] {
  const out: SegueRecurrence[] = [];
  for (const row of rows) {
    const lastPlayed = previousPerformanceShowFromDb(row.previousShow);
    if (!recurrenceQualifies(row.kind, row.versionGap, row.gap, lastPlayed === null, isDebut, thresholds)) continue;
    const versionGap =
      lastPlayed === null ? firstEverVersionsBefore(row.kind, row.versionGap, thresholds) : row.versionGap;
    out.push({ kind: row.kind, versionGap, gap: row.gap, lastPlayed });
  }
  // "1st standalone version" already implies not-segued-in AND not-segued-out,
  // so when standalone is shown its narrower siblings are redundant — drop them.
  if (out.some((r) => r.kind === "STANDALONE")) {
    return out.filter((r) => r.kind === "STANDALONE");
  }
  return out;
}

function mapTrackToDomainEntity(
  dbTrack: DbTrack & {
    song: (DbSong & { author?: { name: string | null } | null }) | null;
    previousPerformanceShow?: { date: string; slug: string | null } | null;
    trackFlags?: {
      flag: TrackFlag;
      flagVersionGap?: number | null;
      flagGap?: number | null;
      flagPreviousShow?: { date: string; slug: string | null } | null;
    }[];
    segueRecurrences?: {
      kind: SegueRecurrenceKind;
      versionGap: number | null;
      gap: number | null;
      previousShow: { date: string; slug: string | null } | null;
    }[];
    completionsAsLater?: {
      earlierTrack: { show: { date: string; slug: string | null }; song: { title: string } | null };
    }[];
    completionAsEarlier?: {
      laterTrack: { show: { date: string; slug: string | null }; song: { title: string } | null };
    } | null;
  },
): Track {
  const {
    createdAt,
    updatedAt,
    slug,
    previousPerformanceShow,
    trackFlags,
    segueRecurrences,
    completionsAsLater,
    completionAsEarlier,
    ...rest
  } = dbTrack;
  return {
    ...rest,
    slug: slug ?? "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    previousPerformanceShow: previousPerformanceShowFromDb(previousPerformanceShow ?? null),
    flags: (trackFlags ?? []).map((row) => row.flag),
    // A null song-level gap marks the song's debut — recurrence "1st" notes are
    // noise there, so the gate suppresses them.
    flagRecurrences: gateFlagRecurrences(
      (trackFlags ?? []).map((row) => ({
        flag: row.flag,
        flagVersionGap: row.flagVersionGap ?? null,
        flagGap: row.flagGap ?? null,
        flagPreviousShow: row.flagPreviousShow ?? null,
      })),
      dbTrack.gap === null,
    ),
    segueRecurrences: gateSegueRecurrences(segueRecurrences ?? [], dbTrack.gap === null),
    completes: completionShowsFromDb(
      dbTrack.song?.title,
      completionsAsLater?.map((row) => ({
        show: row.earlierTrack.show,
        songTitle: row.earlierTrack.song?.title ?? null,
      })),
    ),
    completedBy: completionShowsFromDb(
      dbTrack.song?.title,
      completionAsEarlier
        ? [{ show: completionAsEarlier.laterTrack.show, songTitle: completionAsEarlier.laterTrack.song?.title ?? null }]
        : [],
    ),
    song: dbTrack.song
      ? {
          id: dbTrack.song.id,
          title: dbTrack.song.title,
          slug: dbTrack.song.slug ?? "",
          lyrics: dbTrack.song.lyrics,
          tabs: dbTrack.song.tabs,
          notes: dbTrack.song.notes,
          cover: dbTrack.song.cover ?? false,
          kind: narrowSongKind(dbTrack.song.kind),
          history: dbTrack.song.history,
          featuredLyric: dbTrack.song.featuredLyric,
          timesPlayed: dbTrack.song.timesPlayed,
          guitarTabsUrl: dbTrack.song.guitarTabsUrl,
          dateLastPlayed: dbTrack.song.dateLastPlayed ? new Date(dbTrack.song.dateLastPlayed) : null,
          dateFirstPlayed: dbTrack.song.dateFirstPlayed ? new Date(dbTrack.song.dateFirstPlayed) : null,
          actualLastPlayedDate: null,
          showsSinceLastPlayed: null,
          lastVenue: null,
          firstVenue: null,
          firstShowSlug: null,
          lastShowSlug: null,
          yearlyPlayData: dbTrack.song.yearlyPlayData as Record<string, unknown>,
          longestGapsData: dbTrack.song.longestGapsData as Record<string, unknown>,
          mostCommonYear: null,
          leastCommonYear: null,
          showsBeforeDebut: null,
          showsSinceDebut: null,
          totalShows: 0,
          percentOfAllShows: null,
          percentSinceDebut: null,
          averageGapShows: null,
          medianGapShows: null,
          longestGapShows: null,
          createdAt: new Date(dbTrack.song.createdAt),
          updatedAt: new Date(dbTrack.song.updatedAt),
          authorId: dbTrack.song.authorId,
          authorName: dbTrack.song.author?.name ?? null,
        }
      : undefined,
  };
}

function mapInstrumentRowToDomainEntity(db: DbInstrument): Instrument {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    createdAt: new Date(db.createdAt),
    updatedAt: new Date(db.updatedAt),
  };
}

function mapMusicianRefToDomainEntity(db: DbMusician & { defaultInstrument: DbInstrument | null }): MusicianRef {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    knownFrom: db.knownFrom ?? null,
    defaultInstrument: db.defaultInstrument ? mapInstrumentRowToDomainEntity(db.defaultInstrument) : null,
  };
}

// Performer relations carry the musician (with its default instrument) plus the
// many-to-many instruments the musician played on that show or track.
type DbShowMusicianWithRelations = {
  musician: DbMusician & { defaultInstrument: DbInstrument | null };
  instruments: { instrument: DbInstrument }[];
};

type DbTrackMusicianWithRelations = {
  present: boolean;
  musician: DbMusician & { defaultInstrument: DbInstrument | null };
  instruments: { instrument: DbInstrument }[];
};

export function mapShowMusicianToLineupMember(db: DbShowMusicianWithRelations): ShowLineupMember {
  return {
    musician: mapMusicianRefToDomainEntity(db.musician),
    instruments: db.instruments.map((row) => mapInstrumentRowToDomainEntity(row.instrument)),
  };
}

export function mapTrackMusicianToDelta(db: DbTrackMusicianWithRelations, trackId: string): TrackMusicianDelta {
  return {
    trackId,
    musician: mapMusicianRefToDomainEntity(db.musician),
    present: db.present,
    instruments: db.instruments.map((row) => mapInstrumentRowToDomainEntity(row.instrument)),
  };
}

function getSetSortOrder(setLabel: string): number {
  // Handle common set labels
  if (setLabel.toLowerCase() === "soundcheck") return 0;

  const upperLabel = setLabel.toUpperCase();

  // S sets come first (10-40)
  if (upperLabel === "S1") return 10;
  if (upperLabel === "S2") return 20;
  if (upperLabel === "S3") return 30;
  if (upperLabel === "S4") return 40;

  // E sets come after (50-60)
  if (upperLabel === "E1") return 50;
  if (upperLabel === "E2") return 60;

  // Default sort order for unknown set types
  return 999;
}

function mapSetlistToDomainEntity(
  show: DbShow & {
    tracks: (DbTrack & {
      song: DbSong | null;
      annotations: DbAnnotation[];
      previousPerformanceShow?: { date: string; slug: string | null } | null;
      trackMusicians?: DbTrackMusicianWithRelations[];
    })[];
    venue: DbVenue;
    showMusicians?: DbShowMusicianWithRelations[];
  },
): Setlist {
  const tracks = show.tracks ?? [];
  const setGroups = new Map<string, (DbTrack & { song: DbSong | null; annotations: DbAnnotation[] })[]>();

  // Group tracks by set label
  for (const track of tracks) {
    const setTracks = setGroups.get(track.set) ?? [];
    setTracks.push(track);
    setGroups.set(track.set, setTracks);
  }

  // Convert the grouped tracks into sets
  const sets = Array.from(setGroups.entries()).map(([label, setTracks]) => {
    // Sort tracks by position within each set
    const sortedTracks = [...setTracks].sort((a, b) => {
      // Ensure we're sorting numerically by position
      const posA = Number(a.position);
      const posB = Number(b.position);
      return posA - posB;
    });

    return {
      label,
      sort: getSetSortOrder(label),
      tracks: sortedTracks.map((t) => mapTrackToDomainEntity(t)),
    };
  });

  // Sort sets by their sort order
  sets.sort((a, b) => a.sort - b.sort);

  const eligible = eligibleGapsForAggregation(tracks);
  return {
    show: mapShowToDomainEntity(show),
    venue: mapVenueToDomainEntity(show.venue),
    sets,
    annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => mapAnnotationToDomainEntity(a)),
    averageSongGap: average(eligible),
    medianSongGap: median(eligible),
    debutCount: computeDebutCount(tracks),
    rockOperaPerformances: [],
    lineup: (show.showMusicians ?? []).map(mapShowMusicianToLineupMember),
    trackMusicianDeltas: tracks.flatMap((track) =>
      (track.trackMusicians ?? []).map((tm) => mapTrackMusicianToDelta(tm, track.id)),
    ),
  };
}

function mapTrackLightToDomainEntity(track: DbTrackLight): TrackLight {
  return {
    id: track.id,
    showId: track.showId,
    songId: track.songId,
    set: track.set,
    position: track.position,
    segue: track.segue,
    likesCount: track.likesCount,
    note: track.note,
    allTimer: track.allTimer,
    averageRating: track.averageRating,
    ratingsCount: track.ratingsCount,
    gap: track.gap,
    previousPerformanceShowId: track.previousPerformanceShowId,
    duration: track.duration,
    durationSource: track.durationSource,
    previousPerformanceShow: previousPerformanceShowFromDb(track.previousPerformanceShow),
    flags: (track.trackFlags ?? []).map((row) => row.flag),
    // A null song-level gap marks the song's debut — recurrence "1st" notes are
    // noise there, so the gate suppresses them (mirrors the heavy mapper).
    flagRecurrences: gateFlagRecurrences(
      (track.trackFlags ?? []).map((row) => ({
        flag: row.flag,
        flagVersionGap: row.flagVersionGap ?? null,
        flagGap: row.flagGap ?? null,
        flagPreviousShow: row.flagPreviousShow ?? null,
      })),
      track.gap === null,
    ),
    segueRecurrences: gateSegueRecurrences(track.segueRecurrences ?? [], track.gap === null),
    completes: completionShowsFromDb(
      track.song?.title,
      track.completionsAsLater?.map((row) => ({
        show: row.earlierTrack.show,
        songTitle: row.earlierTrack.song?.title ?? null,
      })),
    ),
    completedBy: completionShowsFromDb(
      track.song?.title,
      track.completionAsEarlier
        ? [
            {
              show: track.completionAsEarlier.laterTrack.show,
              songTitle: track.completionAsEarlier.laterTrack.song?.title ?? null,
            },
          ]
        : [],
    ),
    song: track.song
      ? {
          id: track.song.id,
          title: track.song.title,
          slug: track.song.slug,
          kind: narrowSongKind(track.song.kind),
          authorName: track.song.author?.name ?? null,
        }
      : undefined,
  };
}

function mapSetlistLightToDomainEntity(
  show: DbShow & {
    tracks: DbTrackLight[];
    venue: DbVenue;
    showMusicians?: DbShowMusicianWithRelations[];
  },
): SetlistLight {
  const tracks = show.tracks ?? [];
  const setGroups = new Map<string, DbTrackLight[]>();

  for (const track of tracks) {
    const setTracks = setGroups.get(track.set) ?? [];
    setTracks.push(track);
    setGroups.set(track.set, setTracks);
  }

  const sets = Array.from(setGroups.entries()).map(([label, setTracks]) => {
    const sortedTracks = [...setTracks].sort((a, b) => {
      const posA = Number(a.position);
      const posB = Number(b.position);
      return posA - posB;
    });

    return {
      label,
      sort: getSetSortOrder(label),
      tracks: sortedTracks.map((t) => mapTrackLightToDomainEntity(t)),
    };
  });

  sets.sort((a, b) => a.sort - b.sort);

  const eligible = eligibleGapsForAggregation(tracks);
  return {
    show: mapShowToDomainEntity(show),
    venue: mapVenueToDomainEntity(show.venue),
    sets,
    annotations: tracks.flatMap((t) => t.annotations ?? []).map((a) => mapAnnotationToDomainEntity(a)),
    averageSongGap: average(eligible),
    medianSongGap: median(eligible),
    debutCount: computeDebutCount(tracks),
    rockOperaPerformances: [],
    lineup: (show.showMusicians ?? []).map(mapShowMusicianToLineupMember),
    trackMusicianDeltas: tracks.flatMap((track) =>
      (track.trackMusicians ?? []).map((tm) => mapTrackMusicianToDelta(tm, track.id)),
    ),
  };
}

// Performer relations: the show's lineup and each track's sit-in / sat-out
// deltas, both resolving the musician's default instrument and the many-to-many
// instruments played. Loaded on list queries too (not just single-show fetches)
// so the synthesized "with <guest> on <instrument>" footnotes render in setlist
// listings, matching the free-text annotations they replaced.
// The musician (with default instrument) + played instruments for one lineup
// row. Shared so ShowService.getLineup loads exactly what
// mapShowMusicianToLineupMember reads, keeping the edit page's read-only
// lineup identical to the show page's.
export const LINEUP_MEMBER_INCLUDE = {
  musician: { include: { defaultInstrument: true } },
  instruments: { include: { instrument: true } },
} as const;

const SINGLE_SHOW_PERFORMER_INCLUDE = {
  showMusicians: {
    include: LINEUP_MEMBER_INCLUDE,
  },
} as const;

export const TRACK_PERFORMER_INCLUDE = {
  trackMusicians: {
    include: {
      musician: { include: { defaultInstrument: true } },
      instruments: { include: { instrument: true } },
    },
  },
} as const;

// Structured flags plus both ends of the cross-show completion link. A track
// that is the *later* one completing an earlier version owns a `completionsAsLater`
// row; the *earlier* (unfinished) track owns the `completionAsEarlier` row.
const TRACK_FLAGS_AND_COMPLETIONS_INCLUDE = {
  trackFlags: {
    select: {
      flag: true,
      flagVersionGap: true,
      flagGap: true,
      flagPreviousShow: { select: { date: true, slug: true } },
    },
  },
  segueRecurrences: {
    select: { kind: true, versionGap: true, gap: true, previousShow: { select: { date: true, slug: true } } },
  },
  completionsAsLater: {
    select: {
      earlierTrack: { select: { show: { select: { date: true, slug: true } }, song: { select: { title: true } } } },
    },
  },
  completionAsEarlier: {
    select: {
      laterTrack: { select: { show: { select: { date: true, slug: true } }, song: { select: { title: true } } } },
    },
  },
} as const;

// Every show + track relation the heavy mapper (mapSetlistToDomainEntity) reads:
// the song author for debut-footnote text, the structured flags / segue
// recurrences / completion links, and the per-track plus whole-show performer
// lineups. Shared by every query that returns a heavy Setlist so the joins stay
// in lockstep — a query missing one silently blanks that footnote category,
// since the mapper defaults each absent relation to an empty array.
const HEAVY_SETLIST_INCLUDE = {
  tracks: {
    include: {
      song: { include: { author: { select: { name: true } } } },
      annotations: true,
      previousPerformanceShow: { select: { date: true, slug: true } },
      ...TRACK_PERFORMER_INCLUDE,
      ...TRACK_FLAGS_AND_COMPLETIONS_INCLUDE,
    },
  },
  venue: true,
  ...SINGLE_SHOW_PERFORMER_INCLUDE,
} as const;

export class SetlistService {
  constructor(
    private readonly db: DbClient,
    /**
     * Used by `overlayRockOperaAnnotations` so every Setlist this
     * service returns carries its rock opera annotations. Centralizing
     * the lookup here means SetlistCard renders the
     * "Nth full performance of <name>" line wherever a Setlist is read,
     * without each caller having to know to ask for annotations.
     */
    private readonly rockOperas: RockOperaService,
  ) {}

  private async overlayRockOperaAnnotations<T extends Setlist | SetlistLight>(setlists: T[]): Promise<T[]> {
    if (setlists.length === 0) return setlists;
    const annotations = await this.rockOperas.findPerformancesForShows(setlists.map((s) => s.show.id));
    if (annotations.size === 0) return setlists;
    for (const setlist of setlists) {
      const forShow = annotations.get(setlist.show.id);
      if (forShow) setlist.rockOperaPerformances = forShow;
    }
    return setlists;
  }

  async findByShowId(id: string): Promise<Setlist | null> {
    const show = await this.db.show.findUnique({
      where: { id },
      relationLoadStrategy: "join",
      include: HEAVY_SETLIST_INCLUDE,
    });

    if (!show || !show.venue) return null;

    const setlist = mapSetlistToDomainEntity({
      ...show,
      venue: show.venue,
    });
    await this.overlayRockOperaAnnotations([setlist]);
    return setlist;
  }

  async findByShowSlug(slug: string): Promise<Setlist | null> {
    const result = await this.db.show.findUnique({
      where: { slug },
      relationLoadStrategy: "join",
      include: HEAVY_SETLIST_INCLUDE,
    });

    if (!result || !result.venue) return null;

    const setlist = mapSetlistToDomainEntity({
      ...result,
      venue: result.venue,
    });
    await this.overlayRockOperaAnnotations([setlist]);
    return setlist;
  }

  /**
   * Find setlists by an array of show IDs
   * @param showIds Array of show IDs to find setlists for
   * @param options Optional query options for pagination, sorting, etc.
   * @returns An array of setlists for the specified show IDs
   */
  async findManyByShowIds(
    showIds: string[],
    options?: {
      pagination?: PaginationOptions;
      sort?: SortOptions<Show>[];
    },
  ): Promise<Setlist[]> {
    if (!showIds.length) return [];

    const orderBy = resolveShowOrderBy(options?.sort, SHOW_ORDER_DESC);
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where: {
        id: {
          in: showIds,
        },
        // Drop orphan placeholder shows with no venue so they never reach a
        // listing (and so pagination counts stay exact).
        venueId: NON_STUB_SHOWS_WHERE.venueId,
      },
      orderBy,
      skip,
      take,
      // Single LATERAL-joined query instead of 5 batched roundtrips. With
      // 100 shows × ~25 tracks each + relations, the per-roundtrip latency
      // dominates the page load on un-cached routes (top-rated etc).
      relationLoadStrategy: "join",
      include: HEAVY_SETLIST_INCLUDE,
    });

    const setlists = results
      .filter((show) => show.venue !== null)
      .map((show) =>
        mapSetlistToDomainEntity({
          ...show,
          venue: show.venue as DbVenue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
    return this.overlayRockOperaAnnotations(setlists);
  }

  async findMany(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: SetlistFilter;
  }): Promise<Setlist[]> {
    const year = options?.filters?.year;
    const monthDay = options?.filters?.monthDay;
    const venueId = options?.filters?.venueId;
    const hasPhotos = options?.filters?.hasPhotos;
    const hasYoutube = options?.filters?.hasYoutube;

    const orderBy = resolveShowOrderBy(options?.sort, SHOW_ORDER_ASC);
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where: {
        // Explicit caller venueId (the venue-detail page) wins; otherwise apply
        // the stub filter to drop orphan placeholder shows that have no venue.
        venueId: venueId !== undefined ? venueId : NON_STUB_SHOWS_WHERE.venueId,
        date: monthDay
          ? { endsWith: `-${monthDay}` }
          : year
            ? {
                gte: `${year}-01-01`,
                lt: `${year + 1}-01-01`,
              }
            : undefined,
        showPhotosCount: countFilter(hasPhotos),
        showYoutubesCount: countFilter(hasYoutube),
      },
      orderBy,
      skip,
      take,
      relationLoadStrategy: "join",
      include: HEAVY_SETLIST_INCLUDE,
    });

    const setlists = results
      .filter((result): result is typeof result & { venue: NonNullable<typeof result.venue> } => result.venue !== null)
      .map((show) =>
        mapSetlistToDomainEntity({
          ...show,
          venue: show.venue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
    return this.overlayRockOperaAnnotations(setlists);
  }

  /**
   * Find setlists with minimal song data (id, title, slug only).
   * Use this for list views where full song objects (lyrics, history) aren't needed.
   */
  async findManyLight(options?: {
    pagination?: PaginationOptions;
    sort?: SortOptions<Show>[];
    filters?: SetlistFilter;
  }): Promise<SetlistLight[]> {
    const year = options?.filters?.year;
    const monthDay = options?.filters?.monthDay;
    const venueId = options?.filters?.venueId;
    const hasPhotos = options?.filters?.hasPhotos;
    const hasYoutube = options?.filters?.hasYoutube;

    const orderBy = resolveShowOrderBy(options?.sort, SHOW_ORDER_ASC);
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.show.findMany({
      where: {
        // venueId: explicit caller value when given (the venue-detail page
        // looks shows up by venueId), otherwise apply the stub filter to drop
        // orphan placeholder shows that have no venue assigned.
        venueId: venueId !== undefined ? venueId : NON_STUB_SHOWS_WHERE.venueId,
        date: monthDay
          ? { endsWith: `-${monthDay}` }
          : year
            ? {
                gte: `${year}-01-01`,
                lt: `${year + 1}-01-01`,
              }
            : undefined,
        showPhotosCount: countFilter(hasPhotos),
        showYoutubesCount: countFilter(hasYoutube),
      },
      orderBy,
      skip,
      take,
      relationLoadStrategy: "join",
      include: {
        tracks: {
          select: {
            id: true,
            showId: true,
            songId: true,
            set: true,
            position: true,
            segue: true,
            likesCount: true,
            note: true,
            allTimer: true,
            averageRating: true,
            ratingsCount: true,
            gap: true,
            previousPerformanceShowId: true,
            duration: true,
            durationSource: true,
            previousPerformanceShow: { select: { date: true, slug: true } },
            ...TRACK_FLAGS_AND_COMPLETIONS_INCLUDE,
            ...TRACK_PERFORMER_INCLUDE,
            song: {
              select: {
                id: true,
                title: true,
                slug: true,
                kind: true,
                author: { select: { name: true } },
              },
            },
            annotations: true,
          },
        },
        venue: true,
        ...SINGLE_SHOW_PERFORMER_INCLUDE,
      },
    });

    const setlists = results
      .filter((result): result is typeof result & { venue: NonNullable<typeof result.venue> } => result.venue !== null)
      .map((show) =>
        mapSetlistLightToDomainEntity({
          ...show,
          venue: show.venue,
          tracks: show.tracks.map((track) => ({
            ...track,
            annotations: track.annotations || [],
          })),
        }),
      );
    return this.overlayRockOperaAnnotations(setlists);
  }

  async countByMonthDay(monthDay: string): Promise<number> {
    return this.db.show.count({
      where: { ...STATS_SHOWS_WHERE, date: { endsWith: `-${monthDay}` } },
    });
  }
}
