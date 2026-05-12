import { CacheKeys } from "@bip/domain";
import type { CacheService } from "../_shared/cache/cache-service";
import type { DbClient } from "../_shared/database/models";

const ONE_DAY_SECONDS = 86400;

/** A single user attendance, used by both the show-dates list and the per-song lists. */
export interface PersonalAttendance {
  date: string;
  slug: string | null;
}

export interface PersonalSongHistory {
  /**
   * Sorted ASC by date — every show this user has attended, with slug so
   * the client can link Last Seen / Last Before cells back to the show.
   * Backs the "Your Gap" denominator (count of attended shows strictly
   * between Last Before and the current show's date).
   */
  attendedShows: PersonalAttendance[];
  /**
   * For each song the user has ever seen at an attended show, the sorted
   * ASC attendances. Within-show repeats produce multiple entries with
   * the same date+slug — that matches how Total Times Seen counts each
   * performance.
   */
  songAttendances: Record<string, PersonalAttendance[]>;
}

/**
 * Per-user attendance/setlist aggregate that backs the SetlistCard
 * "personal" view. The shape is a deliberately compact map of sorted
 * ISO dates so the React Query payload is small (a few hundred KB for
 * heavy users) and per-row column computation is just binary search.
 */
export class PersonalSongHistoryService {
  constructor(
    private readonly db: DbClient,
    private readonly cache?: CacheService,
  ) {}

  async getSongHistory(userId: string): Promise<PersonalSongHistory> {
    if (this.cache) {
      return this.cache.getOrSet(CacheKeys.users.songHistory(userId), () => this.compute(userId), {
        ttl: ONE_DAY_SECONDS,
      });
    }
    return this.compute(userId);
  }

  private async compute(userId: string): Promise<PersonalSongHistory> {
    const attendances = await this.db.attendance.findMany({
      where: { userId },
      select: { show: { select: { id: true, date: true, slug: true } } },
      orderBy: { show: { date: "asc" } },
    });

    if (attendances.length === 0) {
      return { attendedShows: [], songAttendances: {} };
    }

    const attendedShows: PersonalAttendance[] = [];
    const attendanceByShowId = new Map<string, PersonalAttendance>();
    for (const row of attendances) {
      const show = row.show;
      if (!show) continue;
      const attendance: PersonalAttendance = { date: toIsoDate(show.date), slug: show.slug ?? null };
      attendedShows.push(attendance);
      attendanceByShowId.set(show.id, attendance);
    }

    const showIds = Array.from(attendanceByShowId.keys());
    const tracks = await this.db.track.findMany({
      where: { showId: { in: showIds } },
      select: { showId: true, songId: true },
    });

    const songAttendances: Record<string, PersonalAttendance[]> = {};
    for (const track of tracks) {
      const attendance = attendanceByShowId.get(track.showId);
      if (!attendance) continue;
      const arr = songAttendances[track.songId];
      if (arr) arr.push(attendance);
      else songAttendances[track.songId] = [attendance];
    }

    // Tracks were returned in undefined order; sort each song's
    // attendances by date so the client can binary-search directly.
    for (const songId of Object.keys(songAttendances)) {
      songAttendances[songId].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    }

    return { attendedShows, songAttendances };
  }
}

function toIsoDate(d: Date | string): string {
  if (typeof d === "string") return d.length > 10 ? d.slice(0, 10) : d;
  return d.toISOString().slice(0, 10);
}
