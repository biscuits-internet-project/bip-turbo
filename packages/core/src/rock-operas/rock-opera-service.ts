import type { AdjacentRockOperaPerformance, Logger, RockOpera, RockOperaPerformanceAnnotation } from "@bip/domain";
import type { DbClient } from "../_shared/database/models";
import { SHOW_ORDER_ASC } from "../_shared/show-ordering";
import { countShowsBetween, type StatsService } from "../stats/stats-service";

type DbRockOpera = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  createdAt: Date;
  updatedAt: Date;
};

function mapRockOperaToDomain(row: DbRockOpera): RockOpera {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class RockOperaService {
  constructor(
    private readonly db: DbClient,
    private readonly logger: Logger,
    private readonly stats: StatsService,
  ) {}

  async findAll(): Promise<RockOpera[]> {
    const rows = await this.db.rockOpera.findMany({ orderBy: { name: "asc" } });
    return rows.map(mapRockOperaToDomain);
  }

  async findBySlug(slug: string): Promise<RockOpera | null> {
    const row = await this.db.rockOpera.findUnique({ where: { slug } });
    return row ? mapRockOperaToDomain(row) : null;
  }

  async findPerformanceShowIds(rockOperaSlug: string): Promise<string[]> {
    const shows = await this.db.show.findMany({
      where: { rockOperaPerformances: { some: { rockOpera: { slug: rockOperaSlug } } } },
      orderBy: SHOW_ORDER_ASC,
      select: { id: true },
    });
    return shows.map((s) => s.id);
  }

  async findPerformancesForShow(showId: string): Promise<RockOperaPerformanceAnnotation[]> {
    const map = await this.findPerformancesForShows([showId]);
    return map.get(showId) ?? [];
  }

  /**
   * Cost is bounded regardless of input size: 1 query for tagged rows
   * across all input shows, 1 query per unique opera referenced, and 1
   * cached read for the stats show-date array. Lets list-page callers
   * pass every show id on the page in a single call without paying a
   * round-trip per row.
   */
  async findPerformancesForShows(showIds: string[]): Promise<Map<string, RockOperaPerformanceAnnotation[]>> {
    const result = new Map<string, RockOperaPerformanceAnnotation[]>();
    if (showIds.length === 0) return result;

    const tagged = await this.db.rockOperaPerformance.findMany({
      where: { showId: { in: showIds } },
      include: { rockOpera: true },
    });
    if (tagged.length === 0) return result;

    const uniqueRockOperaIds = Array.from(new Set(tagged.map((t) => t.rockOperaId)));
    const operaShowLists = new Map<string, Array<{ id: string; date: string; slug: string | null }>>();
    await Promise.all(
      uniqueRockOperaIds.map(async (rockOperaId) => {
        const shows = await this.db.show.findMany({
          where: { rockOperaPerformances: { some: { rockOperaId } } },
          orderBy: SHOW_ORDER_ASC,
          select: { id: true, date: true, slug: true },
        });
        operaShowLists.set(rockOperaId, shows);
      }),
    );

    const statsShowDates = await this.stats.getStatsShowDates();

    for (const row of tagged) {
      const operaShows = operaShowLists.get(row.rockOperaId);
      if (!operaShows) continue;
      const index = operaShows.findIndex((s) => s.id === row.showId);
      if (index === -1) {
        this.logger.warn(
          `findPerformancesForShows: show ${row.showId} tagged with ${row.rockOpera.slug} but not present in opera's chronological list`,
        );
        continue;
      }
      const current = operaShows[index];
      const prev = index > 0 ? operaShows[index - 1] : null;
      const next = index < operaShows.length - 1 ? operaShows[index + 1] : null;

      const previousPerformance: AdjacentRockOperaPerformance | null = prev
        ? { date: prev.date, slug: prev.slug, gap: countShowsBetween(statsShowDates, prev.date, current.date) }
        : null;
      const nextPerformance: AdjacentRockOperaPerformance | null = next
        ? { date: next.date, slug: next.slug, gap: countShowsBetween(statsShowDates, current.date, next.date) }
        : null;

      const annotation: RockOperaPerformanceAnnotation = {
        rockOpera: {
          slug: row.rockOpera.slug,
          name: row.rockOpera.name,
          shortName: row.rockOpera.shortName,
        },
        performanceNumber: index + 1,
        previousPerformance,
        nextPerformance,
      };

      const existing = result.get(row.showId);
      if (existing) existing.push(annotation);
      else result.set(row.showId, [annotation]);
    }

    return result;
  }
}
