import { displayedRatingComparator, drummerEraForDate, shrinkToward } from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";
import { aliasKey, mostRecentPerKey } from "./rater-aliases";
import {
  bucketRatingValues,
  COLD_START_ENTROPY_K,
  COLD_START_RATER_K,
  computeCleanedScopeStats,
  discriminatingRaterWeight,
  ENTROPY_FULL_WEIGHT,
  entropyPowerWeightedAverage,
  entropyWeightedCenteredAverage,
  meanOf,
  POPULATION_SHOW_MEAN,
  type PopulationStats,
  RATEABLE_KINDS,
  type RateableKind,
  type RaterEra,
  rateableKindFromType,
  type ScopedRating,
  SHRINK_K,
  selectContributingRatings,
  TRACK_DISCRIMINATING_GAMMA,
} from "./rater-weighting";
import type { RatingValueBucket } from "./rating-service";

interface RateableRef {
  rateableType: string;
  rateableId: string;
}

interface RateableMeta {
  /** YYYY-MM-DD of the rateable's show; "" when unknown (then era can't be derived). */
  date: string;
}

/** A built rater_stats row ready to persist (only the columns the algorithm reads). */
interface RaterStatRecord {
  userId: string;
  era: RaterEra;
  kind: RateableKind;
  ratingsCount: number;
  entropy: number;
  mean: number;
  isExcluded: boolean;
  computedAt: Date;
}

function rateableKey(rateableType: string, rateableId: string): string {
  return `${rateableType}:${rateableId}`;
}

/**
 * Minimum ratings for a show to count toward the "real" top list (Top Rated + the
 * top-list rank). Thin shows are excluded there so a lone 5-star vote can't top the
 * list; they're still ranked over the full field so their movement stays visible.
 */
export const RANKED_SHOW_MIN_RATINGS = 10;

interface RankableShow {
  id: string;
  /** The canonical community average. */
  canonical: number;
  /** The raw (un-shrunk) weighted rating. */
  weighted: number;
  /** Deduped community count — the count shown beside the canonical (simple) score. */
  ratingsCount: number;
  /** Post-exclusion contributing count — the count shown beside the calibrated score. */
  weightedRatingsCount: number;
  /** YYYY-MM-DD, for the show-ordering final tiebreak. */
  date: string;
  dayOrder: number | null;
}

/** A show's position by canonical average vs calibrated score within one field. */
export interface RankInField {
  canonicalRank: number;
  calibratedRank: number;
  total: number;
}

export interface ShowRankComparison {
  /** The calibrated (count-shrunk) score. */
  calibrated: number;
  /** Rank over every rated show — raw average inflates thin shows here. */
  all: RankInField;
  /** Rank over the real top list (>= {@link RANKED_SHOW_MIN_RATINGS}); null when this show isn't in it. */
  top: RankInField | null;
}

/**
 * Rank the requested shows over two fields: `all` rated shows (where a thin show's
 * raw average can top the list) and the `top` list (>= {@link RANKED_SHOW_MIN_RATINGS}
 * ratings, matching Top Rated). A show below the rating floor gets a real `all`
 * rank but a null `top`. Pure (takes the full candidate set) so it stays testable.
 */
export function rankShowComparisons(
  shows: ReadonlyArray<RankableShow>,
  targetIds: ReadonlyArray<string>,
  anchor: number,
  k: number,
): Map<string, ShowRankComparison> {
  const scored = shows.map((show) => ({
    id: show.id,
    canonical: show.canonical,
    calibrated: shrinkToward(show.weighted, anchor, show.ratingsCount, k),
    ratingsCount: show.ratingsCount,
    weightedRatingsCount: show.weightedRatingsCount,
    show: { id: show.id, date: show.date, dayOrder: show.dayOrder },
    qualified: show.ratingsCount >= RANKED_SHOW_MIN_RATINGS,
  }));
  const topField = scored.filter((show) => show.qualified);

  // Competition rank within a field: 1 + the number ranked strictly better under the
  // displayed-order comparator (rounded score → count → date), so the rank matches the
  // Top Rated list and a difference no user can see never separates two tied shows.
  // Canonical ranks by the deduped count, calibrated by the post-exclusion count; both
  // round at the fixed default precision, since the ranking is one global artifact and
  // can't depend on any one viewer's per-user decimal setting.
  const compare = displayedRatingComparator();
  const rankIn = (field: typeof scored, target: (typeof scored)[number]): RankInField => ({
    canonicalRank:
      1 +
      field.filter(
        (show) =>
          compare(
            { rating: show.canonical, count: show.ratingsCount, show: show.show },
            { rating: target.canonical, count: target.ratingsCount, show: target.show },
          ) < 0,
      ).length,
    calibratedRank:
      1 +
      field.filter(
        (show) =>
          compare(
            { rating: show.calibrated, count: show.weightedRatingsCount, show: show.show },
            { rating: target.calibrated, count: target.weightedRatingsCount, show: target.show },
          ) < 0,
      ).length,
    total: field.length,
  });

  const result = new Map<string, ShowRankComparison>();
  for (const id of targetIds) {
    const target = scored.find((show) => show.id === id);
    if (!target) continue;
    result.set(id, {
      calibrated: target.calibrated,
      all: rankIn(scored, target),
      top: target.qualified ? rankIn(topField, target) : null,
    });
  }
  return result;
}

/** One rater's GLOBAL-scope centering stats + their per-era bad-faith flag. */
export interface RaterScopeStat {
  mean: number;
  entropy: number;
  count: number;
  isExcluded: boolean;
}

/** Look up a rater's stats for a given scope era (`"GLOBAL"` for centering, the show's
 * drummer era for exclusion); undefined for a statless (brand-new) rater. */
export type StatByUserEra = (userId: string, era: RaterEra) => RaterScopeStat | undefined;

/**
 * Pure: a show's calibrated score from its deduped ratings, the raters' GLOBAL-scope
 * stats, and per-era bad-faith exclusion. The single source of the scoring rule, shared
 * by the incremental ({@link RaterWeightService.recomputeRateable}) and batch
 * ({@link RaterWeightService.recomputeAll}) paths so they can never diverge.
 *
 * Bad-faith raters flagged in THIS show's era are dropped (falling back to all ratings
 * if that empties the show, so a score always exists). Each remaining rater's centering
 * mean + entropy are cold-start-shrunk by their rating count so a new/low-volume rater
 * still moves the score (a statless rater = pop-centered + full weight).
 */
export function computeShowWeighted(
  ratings: ReadonlyArray<{ userId: string; value: number }>,
  showEra: RaterEra | null,
  statByUserEra: StatByUserEra,
  pop: PopulationStats,
): { weightedRating: number | null; weightedRatingsCount: number } {
  const used = selectContributingRatings(
    ratings,
    showEra,
    (userId, era) => statByUserEra(userId, era)?.isExcluded ?? false,
  );

  const result = entropyWeightedCenteredAverage(
    used.map((rating) => {
      const stats = statByUserEra(rating.userId, "GLOBAL") ?? { mean: pop.mean, entropy: 0, count: 0 };
      return {
        value: rating.value,
        userMean: shrinkToward(stats.mean, pop.mean, stats.count, COLD_START_RATER_K),
        entropy: shrinkToward(stats.entropy, ENTROPY_FULL_WEIGHT, stats.count, COLD_START_ENTROPY_K),
      };
    }),
    pop,
    ENTROPY_FULL_WEIGHT,
  );
  return {
    weightedRating: result.contributingCount > 0 ? result.weightedAverage : null,
    weightedRatingsCount: result.contributingCount,
  };
}

/** Look up a rater's GLOBAL-scope TRACK stats (entropy/mean/count) — the discriminating weight input. */
type TrackStatByUser = (userId: string) => { mean: number; entropy: number; ratingsCount: number } | undefined;

/**
 * Pure: a track's Calibrated Track Rating from its deduped ratings and each rater's GLOBAL
 * TRACK stats. Entropy^gamma weighted over RAW star values — no centering, no anchor-shrink
 * (see {@link entropyPowerWeightedAverage}); one-note fluffers drop to weight 0. A statless
 * rater (no track stats yet) also drops out. The single track-scoring rule, shared by the
 * batch recompute and the incremental path so they can't diverge.
 */
export function computeTrackDiscriminating(
  ratings: ReadonlyArray<{ userId: string; value: number }>,
  statByUser: TrackStatByUser,
  gamma: number,
): { discriminatingRating: number | null; discriminatingRatingsCount: number } {
  const result = entropyPowerWeightedAverage(
    ratings.map((rating) => {
      const stats = statByUser(rating.userId);
      return { value: rating.value, weight: stats ? discriminatingRaterWeight(stats, gamma) : 0 };
    }),
  );
  return {
    discriminatingRating: result.contributingCount > 0 ? result.weightedAverage : null,
    discriminatingRatingsCount: result.contributingCount,
  };
}

/**
 * Maintains the calibrated-rating tables: per-(user, kind, era) `rater_stats` and
 * the denormalized `shows.weighted_rating`. Reads ratings + the canonical
 * denormalized means; never writes the canonical average. One scheme:
 * entropy-weighted, mean-centered, GLOBAL scope, with bad-faith raters excluded
 * and duplicate accounts collapsed. Only shows get a denormalized calibrated score;
 * track `rater_stats` are computed as a byproduct but not displayed.
 *
 * `recomputeUser`/`recomputeRateable` are the incremental paths; `recomputeAll`
 * is the batch the cron/script runs.
 */
export class RaterWeightService {
  constructor(protected readonly db: DbClient) {}

  /** The shrink anchor: the cron-derived cleaned global mean (falls back to the seed). */
  private async shrinkAnchor(): Promise<number> {
    const settings = await this.db.ratingSettings.findFirst({ select: { showShrinkAnchor: true } });
    return settings?.showShrinkAnchor ?? POPULATION_SHOW_MEAN;
  }

  /**
   * Whether ratings have changed since the last recompute (set by rating writes,
   * cleared by {@link markRecomputed}). Absent settings row ⇒ treat as dirty so the
   * first run computes. Lets the cron/deploy recompute no-op when nothing changed.
   */
  async isDirty(): Promise<boolean> {
    const settings = await this.db.ratingSettings.findFirst({ select: { ratingsDirty: true } });
    return settings?.ratingsDirty ?? true;
  }

  /** Every distinct rated (rateableId, rateableType) — the set the canonical-average rebuild covers. */
  async allRatedPairs(): Promise<Array<{ rateableId: string; rateableType: string }>> {
    const groups = await this.db.rating.groupBy({ by: ["rateableId", "rateableType"] });
    return groups.map((g) => ({ rateableId: g.rateableId, rateableType: g.rateableType }));
  }

  /**
   * The recomputed shrink anchor: the mean of the cleaned (post-exclusion + dedup)
   * calibrated show-score distribution. Tracking the cleaned mean keeps shrinkage from
   * re-leaking bomber influence into thin shows. Falls back to the seed when empty.
   */
  async computeShrinkAnchor(): Promise<number> {
    const { _avg } = await this.db.show.aggregate({
      _avg: { weightedRating: true },
      where: { weightedRating: { not: null } },
    });
    return _avg.weightedRating ?? POPULATION_SHOW_MEAN;
  }

  /**
   * Stamp a completed recompute on the singleton settings row: store the new anchor,
   * bump `lastRecomputeAt` (the rating-cache version key), and clear `ratingsDirty`.
   */
  async markRecomputed(anchor: number): Promise<void> {
    const existing = await this.db.ratingSettings.findFirst({ select: { id: true } });
    const data = { showShrinkAnchor: anchor, ratingsDirty: false, lastRecomputeAt: new Date() };
    if (existing) await this.db.ratingSettings.update({ where: { id: existing.id }, data });
    else await this.db.ratingSettings.create({ data });
  }

  /**
   * Batch rank comparison for a set of shows. Ranks each over every rated show
   * (`all`) and over the real top list (`top`, >= {@link RANKED_SHOW_MIN_RATINGS}),
   * so thin shows stay visible in the full field without displacing the top list.
   */
  async getShowRankComparisons(showIds: string[]): Promise<Record<string, ShowRankComparison>> {
    if (showIds.length === 0) return {};
    const [shows, anchor] = await Promise.all([
      this.db.show.findMany({
        where: { weightedRating: { not: null } },
        select: {
          id: true,
          averageRating: true,
          weightedRating: true,
          ratingsCount: true,
          weightedRatingsCount: true,
          date: true,
          dayOrder: true,
        },
      }),
      this.shrinkAnchor(),
    ]);
    const rankable = shows.flatMap((show) =>
      show.weightedRating != null && show.averageRating != null
        ? [
            {
              id: show.id,
              canonical: show.averageRating,
              weighted: show.weightedRating,
              ratingsCount: show.ratingsCount,
              weightedRatingsCount: show.weightedRatingsCount,
              date: show.date,
              dayOrder: show.dayOrder,
            },
          ]
        : [],
    );
    const ranks = rankShowComparisons(rankable, showIds, anchor, SHRINK_K);
    const byId: Record<string, ShowRankComparison> = {};
    for (const [id, rank] of ranks) byId[id] = rank;
    return byId;
  }

  /**
   * The displayed calibrated score + count per show, keyed by show id. The score is
   * `shows.weighted_rating` count-shrunk toward the global anchor; the count is
   * `weighted_ratings_count` — the contributing raters after dedup AND bad-faith
   * exclusion, so the number shown beside a calibrated score reflects the cleaned
   * population it was built from (smaller than the canonical deduped count when a
   * show has excluded bombers). Absent ⇒ caller falls back to the canonical average
   * + count.
   */
  async getDisplayedForShows(showIds: string[]): Promise<Record<string, { rating: number; count: number }>> {
    if (showIds.length === 0) return {};
    const [shows, anchor] = await Promise.all([
      this.db.show.findMany({
        where: { id: { in: showIds }, weightedRating: { not: null } },
        select: { id: true, weightedRating: true, ratingsCount: true, weightedRatingsCount: true },
      }),
      this.shrinkAnchor(),
    ]);
    const byId: Record<string, { rating: number; count: number }> = {};
    for (const show of shows) {
      if (show.weightedRating == null) continue;
      byId[show.id] = {
        rating: shrinkToward(show.weightedRating, anchor, show.ratingsCount, SHRINK_K),
        count: show.weightedRatingsCount,
      };
    }
    return byId;
  }

  /**
   * The Calibrated Track Rating + contributing count per track, keyed by track id. Read
   * straight from the denormalized `tracks.discriminating_rating` — unlike shows there's no
   * count-shrink or anchor (the track score deliberately keeps its raw spread). The count is
   * the raters left after fluffer exclusion. Absent (unrated / all-excluded) ⇒ caller falls
   * back to the canonical average + count.
   */
  async getCalibratedForTracks(trackIds: string[]): Promise<Record<string, { rating: number; count: number }>> {
    if (trackIds.length === 0) return {};
    const tracks = await this.db.track.findMany({
      where: { id: { in: trackIds }, discriminatingRating: { not: null } },
      select: { id: true, discriminatingRating: true, discriminatingRatingsCount: true },
    });
    const byId: Record<string, { rating: number; count: number }> = {};
    for (const track of tracks) {
      if (track.discriminatingRating == null) continue;
      byId[track.id] = { rating: track.discriminatingRating, count: track.discriminatingRatingsCount };
    }
    return byId;
  }

  /**
   * The calibrated histogram for one track: raw-star-value buckets of exactly the raters
   * who feed the Calibrated Track Rating — those with a positive discriminating weight
   * (fluffers and one-note zero-entropy raters dropped), by the track-global `rater_stats`
   * bucket (tracks have no era scope). Bars stay raw star values; membership matches the
   * score, so the bar total equals the displayed `discriminating_ratings_count`. Falls
   * back to the full deduped set when no `rater_stats` exist or every rater drops out,
   * matching the plain distribution the headline falls back to. Empty when unrated.
   * Mirrors {@link getCalibratedDistribution} for shows.
   */
  async getCalibratedTrackDistribution(trackId: string): Promise<RatingValueBucket[]> {
    const ratings = await this.loadCanonicalShowRatings("Track", trackId);
    if (ratings.length === 0) return [];
    const statRows = await this.db.raterStats.findMany({
      where: { userId: { in: ratings.map((rating) => rating.userId) }, kind: "TRACK", era: "GLOBAL" },
      select: { userId: true, mean: true, entropy: true, ratingsCount: true },
    });
    const contributing = new Set<string>();
    for (const row of statRows) {
      const weight = discriminatingRaterWeight(
        { mean: row.mean, entropy: row.entropy, ratingsCount: row.ratingsCount },
        TRACK_DISCRIMINATING_GAMMA,
      );
      if (weight > 0) contributing.add(row.userId);
    }
    const used = ratings.filter((rating) => contributing.has(rating.userId));
    const active = used.length > 0 ? used : ratings;
    return bucketRatingValues(active.map((rating) => rating.value));
  }

  /**
   * The calibrated histogram for one show: raw-star-value buckets of the exact
   * contributing set the calibrated score is built from (deduped, era bombers/
   * fluffers dropped). Bars stay raw star values; only membership differs from the
   * community distribution, so the bar total equals the displayed
   * `weighted_ratings_count` — both derive from the same
   * {@link loadCanonicalShowRatings} + {@link selectContributingRatings}. With no
   * `rater_stats` yet (or no exclusions) it degrades to the full deduped set, matching
   * the canonical distribution the headline falls back to. Empty when unrated.
   */
  async getCalibratedDistribution(showId: string): Promise<RatingValueBucket[]> {
    const ratings = await this.loadCanonicalShowRatings("Show", showId);
    if (ratings.length === 0) return [];
    const { era, statByUserEra } = await this.loadShowExclusionContext(
      showId,
      ratings.map((rating) => rating.userId),
    );
    const used = selectContributingRatings(
      ratings,
      era,
      (userId, scopeEra) => statByUserEra(userId, scopeEra)?.isExcluded ?? false,
    );
    return bucketRatingValues(used.map((rating) => rating.value));
  }

  /**
   * Every show eligible for the top-rated list in the viewer's mode, best-first,
   * each with its date: `calibrated` ranks by the count-shrunk weighted score over
   * all rated shows, `simple` by the (deduped) canonical average over shows past
   * the ratings floor. The loader slices this to a year and the row limit AND
   * derives the year-picker counts from it, so the counts always match the list.
   */
  async rankedShows(mode: "simple" | "calibrated", minRatings: number): Promise<Array<{ id: string; date: string }>> {
    // Rank by the rounded display score (at the fixed default precision — this
    // ordering is one global list, not per-viewer): two shows printing the same
    // rounded number tie on the primary key and resolve through the shared
    // display-order comparator (rounded rating DESC → displayed count DESC →
    // newest-date-first), so the order never flips on precision no one can see and
    // stays stable across environments (the anchor is per-environment). The
    // displayed count differs by mode: simple shows the deduped `ratings_count`,
    // calibrated the post-exclusion `weighted_ratings_count`.
    const anchor = mode === "calibrated" ? await this.shrinkAnchor() : 0;
    const scoreNotNull =
      mode === "calibrated" ? Prisma.sql`s.weighted_rating IS NOT NULL` : Prisma.sql`s.average_rating IS NOT NULL`;
    const rows = await this.db.$queryRaw<
      Array<{
        id: string;
        date: string;
        dayOrder: number | null;
        average: number;
        weighted: number;
        ratingsCount: number;
        weightedRatingsCount: number;
      }>
    >`
      SELECT s.id, s.date, s.day_order AS "dayOrder",
             s.average_rating AS average, s.weighted_rating AS weighted,
             s.ratings_count AS "ratingsCount", s.weighted_ratings_count AS "weightedRatingsCount"
      FROM shows s
      WHERE ${scoreNotNull} AND s.ratings_count >= ${minRatings}
    `;
    return rows
      .map((r) => ({
        id: r.id,
        date: r.date,
        rating: mode === "calibrated" ? shrinkToward(r.weighted, anchor, r.ratingsCount, SHRINK_K) : r.average,
        count: mode === "calibrated" ? r.weightedRatingsCount : r.ratingsCount,
        show: { id: r.id, date: r.date, dayOrder: r.dayOrder },
      }))
      .sort(displayedRatingComparator())
      .map(({ id, date }) => ({ id, date }));
  }

  /** Resolve each rateable's show date, for deriving the drummer era. */
  private async loadRateableMeta(refs: ReadonlyArray<RateableRef>): Promise<Map<string, RateableMeta>> {
    const showIds = new Set<string>();
    const trackIds = new Set<string>();
    for (const { rateableType, rateableId } of refs) {
      if (rateableType === "Show") showIds.add(rateableId);
      else if (rateableType === "Track") trackIds.add(rateableId);
    }

    const meta = new Map<string, RateableMeta>();
    if (showIds.size > 0) {
      const shows = await this.db.show.findMany({
        where: { id: { in: Array.from(showIds) } },
        select: { id: true, date: true },
      });
      for (const show of shows) {
        meta.set(rateableKey("Show", show.id), { date: show.date });
      }
    }
    if (trackIds.size > 0) {
      const tracks = await this.db.track.findMany({
        where: { id: { in: Array.from(trackIds) } },
        select: { id: true, show: { select: { date: true } } },
      });
      for (const track of tracks) {
        meta.set(rateableKey("Track", track.id), { date: track.show?.date ?? "" });
      }
    }
    return meta;
  }

  /**
   * Population rating mean for one kind — the centering reference. Deliberately
   * computed over the RAW ratings table, not deduped: deduping shifts it ~0.017
   * with no effect on rankings (jam-chart Spearman was flat in the validity eval),
   * so it stays a single cheap aggregate. If this is ever deduped (e.g.
   * SUM(average_rating * ratings_count) / SUM(ratings_count) over the deduped
   * columns), re-run the validity eval — it moves every calibrated score slightly.
   */
  private async populationStats(kind: RateableKind): Promise<PopulationStats> {
    const rateableType = kind === "TRACK" ? "Track" : "Show";
    const [row] = await this.db.$queryRaw<Array<{ mean: number | null }>>`
      SELECT AVG("value") AS mean
      FROM "ratings" WHERE "rateable_type" = ${rateableType}
    `;
    return { mean: row?.mean ?? 0 };
  }

  /** Tag a user's ratings with each rateable's mean, drummer era, and kind. */
  private async scopedRatingsForUser(
    ratings: ReadonlyArray<{ rateableId: string; rateableType: string; value: number }>,
  ): Promise<ScopedRating[]> {
    const meta = await this.loadRateableMeta(ratings);
    const scoped: ScopedRating[] = [];
    for (const rating of ratings) {
      const found = meta.get(rateableKey(rating.rateableType, rating.rateableId));
      if (!found || !found.date) continue;
      scoped.push({
        value: rating.value,
        era: drummerEraForDate(found.date),
        kind: rateableKindFromType(rating.rateableType),
      });
    }
    return scoped;
  }

  /** Build a person's rater_stats rows — one per (kind, era), with the per-era bad-faith flag. */
  private buildUserStatRecords(userId: string, scoped: ScopedRating[]): RaterStatRecord[] {
    const now = new Date();
    const records: RaterStatRecord[] = [];
    for (const kind of RATEABLE_KINDS) {
      const subset = scoped.filter((rating) => rating.kind === kind);
      if (subset.length === 0) continue;
      for (const [era, stats] of computeCleanedScopeStats(subset)) {
        records.push({
          userId,
          era,
          kind,
          ratingsCount: stats.ratingsCount,
          entropy: stats.entropy,
          mean: stats.mean,
          isExcluded: stats.isExcluded,
          computedAt: now,
        });
      }
    }
    return records;
  }

  /**
   * Recompute one person's rater_stats (per kind × era). Operates on the canonical
   * identity: all of the person's duplicate accounts are pulled in, collapsed to
   * one (most-recent) vote per rateable, and stored under the canonical user id.
   */
  async recomputeUser(userId: string): Promise<void> {
    const canonicalUsers = await this.buildCanonicalUserMap();
    const canonicalId = canonicalUsers.get(userId) ?? userId;
    const memberIds = [...canonicalUsers.entries()].filter(([, c]) => c === canonicalId).map(([id]) => id);
    const ids = memberIds.length > 0 ? memberIds : [userId];

    const rawRatings = await this.db.rating.findMany({
      where: { userId: { in: ids } },
      select: { rateableId: true, rateableType: true, value: true, createdAt: true },
    });
    await this.db.raterStats.deleteMany({ where: { userId: { in: ids } } });
    if (rawRatings.length === 0) return;

    // One (most recent) vote per rateable across the person's accounts.
    const best = new Map<string, (typeof rawRatings)[number]>();
    for (const rating of rawRatings) {
      const key = `${rating.rateableType}:${rating.rateableId}`;
      const current = best.get(key);
      if (!current || rating.createdAt > current.createdAt) best.set(key, rating);
    }

    const scoped = await this.scopedRatingsForUser([...best.values()]);
    const records = this.buildUserStatRecords(canonicalId, scoped);
    if (records.length > 0) await this.db.raterStats.createMany({ data: records });
  }

  /**
   * The show's deduped ratings under the one-human-one-vote rule: pull every raw
   * vote, remap each to its canonical account FIRST so a multi-account rater is one
   * person (and their stats, stored under the canonical id, are found regardless of
   * which account cast the latest vote), then keep one most-recent vote per person.
   * The single deduped source for both the calibrated score and the calibrated
   * histogram, so they can never disagree on the population. Empty when unrated.
   */
  private async loadCanonicalShowRatings(
    rateableType: string,
    rateableId: string,
    canonicalUsers?: Map<string, string>,
  ): Promise<Array<{ userId: string; value: number; createdAt: Date }>> {
    const rawRatings = await this.db.rating.findMany({
      where: { rateableType, rateableId },
      select: { userId: true, value: true, createdAt: true },
    });
    if (rawRatings.length === 0) return [];
    const canonical = canonicalUsers ?? (await this.buildCanonicalUserMap());
    return mostRecentPerKey(
      rawRatings.map((rating) => ({ ...rating, userId: canonical.get(rating.userId) ?? rating.userId })),
      (rating) => rating.userId,
    );
  }

  /**
   * The bad-faith-exclusion context for scoring/bucketing one show: its drummer era
   * (null when the date is unknown) plus a `(userId, era) → stats` lookup over the
   * show-kind `rater_stats`. Shared by the calibrated score and histogram so both read
   * the same exclusion flags. The histogram only needs `isExcluded`; the score also
   * reads the mean/entropy off the same rows, so one query serves both.
   */
  private async loadShowExclusionContext(
    showId: string,
    userIds: string[],
  ): Promise<{ era: RaterEra | null; statByUserEra: StatByUserEra }> {
    const meta = await this.loadRateableMeta([{ rateableType: "Show", rateableId: showId }]);
    const date = meta.get(rateableKey("Show", showId))?.date;
    const era = date ? drummerEraForDate(date) : null;

    const statRows = await this.db.raterStats.findMany({
      where: { userId: { in: userIds }, kind: "SHOW" },
      select: { userId: true, era: true, mean: true, entropy: true, ratingsCount: true, isExcluded: true },
    });
    const byUserEra = new Map<string, RaterScopeStat>();
    for (const row of statRows) {
      byUserEra.set(`${row.userId}:${row.era}`, {
        mean: row.mean,
        entropy: row.entropy,
        count: row.ratingsCount,
        isExcluded: row.isExcluded,
      });
    }
    const statByUserEra: StatByUserEra = (userId, scopeEra) => byUserEra.get(`${userId}:${scopeEra}`);
    return { era, statByUserEra };
  }

  /**
   * Recompute one show's calibrated score (`shows.weighted_rating`) from current
   * rater_stats. Show-only — tracks have no denormalized calibrated column. The
   * batch passes `population` + the prebuilt canonical map to skip per-call work.
   */
  async recomputeRateable(
    rateableType: string,
    rateableId: string,
    population?: PopulationStats,
    canonicalUsers?: Map<string, string>,
  ): Promise<void> {
    if (rateableType !== "Show") return;

    const ratings = await this.loadCanonicalShowRatings(rateableType, rateableId, canonicalUsers);
    if (ratings.length === 0) {
      await this.db.show.update({
        where: { id: rateableId },
        data: { weightedRating: null, weightedRatingsCount: 0 },
      });
      return;
    }

    const { era, statByUserEra } = await this.loadShowExclusionContext(
      rateableId,
      ratings.map((rating) => rating.userId),
    );
    const pop = population ?? (await this.populationStats(rateableKindFromType(rateableType)));

    const { weightedRating, weightedRatingsCount } = computeShowWeighted(ratings, era, statByUserEra, pop);
    await this.db.show.update({
      where: { id: rateableId },
      data: { weightedRating, weightedRatingsCount },
    });
  }

  /**
   * userId → canonical userId, collapsing duplicate accounts (one human rating
   * under several usernames) so a person counts once. Canonical = the account
   * with the most ratings in the alias group. See {@link aliasKey}.
   */
  private async buildCanonicalUserMap(): Promise<Map<string, string>> {
    const users = await this.db.user.findMany({
      where: { username: { not: null } },
      select: { id: true, username: true },
    });
    const counts = await this.db.rating.groupBy({ by: ["userId"], _count: { id: true } });
    const ratingCount = new Map(counts.map((c) => [c.userId, c._count.id]));
    const groups = new Map<string, Array<{ id: string; n: number }>>();
    for (const user of users) {
      if (!user.username) continue;
      const key = aliasKey(user.username, user.id);
      const group = groups.get(key) ?? [];
      group.push({ id: user.id, n: ratingCount.get(user.id) ?? 0 });
      groups.set(key, group);
    }
    const canonical = new Map<string, string>();
    for (const group of groups.values()) {
      const primary = group.reduce((best, member) => (member.n > best.n ? member : best)).id;
      for (const member of group) canonical.set(member.id, primary);
    }
    return canonical;
  }

  /**
   * Chunked bulk write of computed scores into a denormalized (score, count) column pair,
   * joining the values in as a VALUES table — one UPDATE per chunk instead of a per-row
   * round-trip. Table and column names are hardcoded literals (via `Prisma.raw`), never
   * user input. Shared by the show (`weighted_rating`) and track (`discriminating_rating`)
   * recompute writes. Chunked to stay well under the bind-parameter limit.
   */
  private async writeDenormalizedScores(
    table: "shows" | "tracks",
    scoreColumn: string,
    countColumn: string,
    updates: ReadonlyArray<{ id: string; score: number | null; count: number }>,
  ): Promise<void> {
    const WRITE_CHUNK = 1000;
    for (let i = 0; i < updates.length; i += WRITE_CHUNK) {
      const rows = updates
        .slice(i, i + WRITE_CHUNK)
        .map((update) => Prisma.sql`(${update.id}::uuid, ${update.score}::double precision, ${update.count}::int)`);
      await this.db.$executeRaw(Prisma.sql`
        UPDATE ${Prisma.raw(table)} AS t
        SET ${Prisma.raw(scoreColumn)} = v.score, ${Prisma.raw(countColumn)} = v.count
        FROM (VALUES ${Prisma.join(rows)}) AS v(id, score, count)
        WHERE t.id = v.id
      `);
    }
  }

  /**
   * Full rebuild: every person's per-kind scope stats (deduped), then every rated show's
   * calibrated score and every rated track's discriminating score. Run by the cron/script.
   * Returns coverage counts.
   */
  async recomputeAll(): Promise<{ users: number; rateables: number }> {
    const rawRatings = await this.db.rating.findMany({
      select: { userId: true, rateableId: true, rateableType: true, value: true, createdAt: true },
    });
    // Collapse duplicate accounts: remap to canonical user, keep one (most recent)
    // vote per (person, rateable) so a multi-account rater isn't double-counted.
    const canonicalUsers = await this.buildCanonicalUserMap();
    const dedupedByKey = new Map<string, (typeof rawRatings)[number]>();
    for (const rating of rawRatings) {
      const userId = canonicalUsers.get(rating.userId) ?? rating.userId;
      const key = `${userId}:${rating.rateableType}:${rating.rateableId}`;
      const current = dedupedByKey.get(key);
      if (!current || rating.createdAt > current.createdAt) dedupedByKey.set(key, { ...rating, userId });
    }
    const ratings = [...dedupedByKey.values()];
    const meta = await this.loadRateableMeta(ratings);

    const scopedByUser = new Map<string, ScopedRating[]>();
    for (const rating of ratings) {
      const found = meta.get(rateableKey(rating.rateableType, rating.rateableId));
      if (!found || !found.date) continue;
      const scoped = scopedByUser.get(rating.userId) ?? [];
      scoped.push({
        value: rating.value,
        era: drummerEraForDate(found.date),
        kind: rateableKindFromType(rating.rateableType),
      });
      scopedByUser.set(rating.userId, scoped);
    }

    const allRecords: RaterStatRecord[] = [];
    for (const [userId, scoped] of scopedByUser) {
      allRecords.push(...this.buildUserStatRecords(userId, scoped));
    }
    await this.db.raterStats.deleteMany({});
    if (allRecords.length > 0) await this.db.raterStats.createMany({ data: allRecords });

    const populationByKind: Record<RateableKind, PopulationStats> = {
      SHOW: { mean: meanOf(ratings.filter((r) => r.rateableType === "Show").map((r) => r.value)) },
      TRACK: { mean: meanOf(ratings.filter((r) => r.rateableType === "Track").map((r) => r.value)) },
    };
    // Index the just-built SHOW-kind stats in memory so each show scores without
    // re-fetching its raters' stats (the per-show DB read the old loop hit).
    const showStatByUserEra = new Map<string, RaterScopeStat>();
    for (const record of allRecords) {
      if (record.kind !== "SHOW") continue;
      showStatByUserEra.set(`${record.userId}:${record.era}`, {
        mean: record.mean,
        entropy: record.entropy,
        count: record.ratingsCount,
        isExcluded: record.isExcluded,
      });
    }
    const statByUserEra: StatByUserEra = (userId, scopeEra) => showStatByUserEra.get(`${userId}:${scopeEra}`);

    // Group the already-deduped show ratings by show — no per-show ratings refetch.
    const ratingsByShow = new Map<string, Array<{ userId: string; value: number }>>();
    for (const rating of ratings) {
      if (rating.rateableType !== "Show") continue;
      const bucket = ratingsByShow.get(rating.rateableId) ?? [];
      bucket.push({ userId: rating.userId, value: rating.value });
      ratingsByShow.set(rating.rateableId, bucket);
    }

    // Score every show in memory (shared rule with recomputeRateable), then bulk-write.
    // This replaces the old N+1 loop that re-fetched each show's ratings/meta/stats.
    const updates: Array<{ id: string; weightedRating: number | null; weightedRatingsCount: number }> = [];
    for (const [showId, showRatings] of ratingsByShow) {
      const date = meta.get(rateableKey("Show", showId))?.date;
      const era = date ? drummerEraForDate(date) : null;
      updates.push({ id: showId, ...computeShowWeighted(showRatings, era, statByUserEra, populationByKind.SHOW) });
    }

    // One bulk UPDATE instead of ~1800 per-row round-trips (see writeDenormalizedScores).
    await this.writeDenormalizedScores(
      "shows",
      "weighted_rating",
      "weighted_ratings_count",
      updates.map((update) => ({ id: update.id, score: update.weightedRating, count: update.weightedRatingsCount })),
    );

    // Calibrated Track Rating: entropy^gamma weighted, un-centered, un-shrunk. Weights come
    // from each rater's GLOBAL-scope TRACK stats (just built above); excluded fluffers fall out.
    const trackStatByUser = new Map<string, { mean: number; entropy: number; ratingsCount: number }>();
    for (const record of allRecords) {
      if (record.kind !== "TRACK" || record.era !== "GLOBAL") continue;
      trackStatByUser.set(record.userId, {
        mean: record.mean,
        entropy: record.entropy,
        ratingsCount: record.ratingsCount,
      });
    }
    const ratingsByTrack = new Map<string, Array<{ userId: string; value: number }>>();
    for (const rating of ratings) {
      if (rating.rateableType !== "Track") continue;
      const bucket = ratingsByTrack.get(rating.rateableId) ?? [];
      bucket.push({ userId: rating.userId, value: rating.value });
      ratingsByTrack.set(rating.rateableId, bucket);
    }
    const trackUpdates: Array<{ id: string; discriminatingRating: number | null; discriminatingRatingsCount: number }> =
      [];
    for (const [trackId, trackRatings] of ratingsByTrack) {
      trackUpdates.push({
        id: trackId,
        ...computeTrackDiscriminating(
          trackRatings,
          (userId) => trackStatByUser.get(userId),
          TRACK_DISCRIMINATING_GAMMA,
        ),
      });
    }
    await this.writeDenormalizedScores(
      "tracks",
      "discriminating_rating",
      "discriminating_ratings_count",
      trackUpdates.map((update) => ({
        id: update.id,
        score: update.discriminatingRating,
        count: update.discriminatingRatingsCount,
      })),
    );

    return { users: scopedByUser.size, rateables: updates.length + trackUpdates.length };
  }
}
