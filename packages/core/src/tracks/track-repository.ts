import type { Annotation, Track } from "@bip/domain";
import type { DbAnnotation, DbClient, DbTrack } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";

export function mapTrackToDomainEntity(dbTrack: DbTrack): Track {
  const { slug, createdAt, updatedAt, ...rest } = dbTrack;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapTrackToDbModel(entity: Partial<Track>): Partial<DbTrack> {
  return entity as Partial<DbTrack>;
}

export class TrackRepository {
  constructor(private readonly db: DbClient) {}

  protected mapToDomainEntity(dbTrack: DbTrack): Track {
    return mapTrackToDomainEntity(dbTrack);
  }

  protected mapToDbModel(entity: Partial<Track>): Partial<DbTrack> {
    return mapTrackToDbModel(entity);
  }

  async findById(id: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { id },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { slug },
    });
    return result ? this.mapToDomainEntity(result) : null;
  }

  async findMany(options?: QueryOptions<Track>): Promise<Track[]> {
    const where = options?.filters ? buildWhereClause(options.filters) : {};
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.track.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return results.map((result: DbTrack) => this.mapToDomainEntity(result));
  }

  async create(data: Partial<Track>): Promise<Track> {
    const dbData = this.mapToDbModel(data);
    const result = await this.db.track.create({
      data: dbData as any,
    });
    return this.mapToDomainEntity(result);
  }

  async update(id: string, data: Partial<Track>): Promise<Track> {
    const dbData = this.mapToDbModel(data);
    const result = await this.db.track.update({
      where: { id },
      data: dbData as any,
    });
    return this.mapToDomainEntity(result);
  }

  async findByShowId(showId: string): Promise<Track[]> {
    const results = await this.db.track.findMany({
      where: { showId },
      orderBy: [{ position: "asc" }],
      include: {
        song: true,
      },
    });
    
    // Sort by set properly (S1, S2, S3, E1, E2, E3) then by position
    const sortedResults = results.sort((a, b) => {
      if (a.set !== b.set) {
        const setOrder = { S: 0, E: 1 };
        const aType = a.set.charAt(0) as 'S' | 'E';
        const bType = b.set.charAt(0) as 'S' | 'E';
        const aNum = parseInt(a.set.slice(1));
        const bNum = parseInt(b.set.slice(1));
        
        if (aType !== bType) {
          return setOrder[aType] - setOrder[bType];
        }
        return aNum - bNum;
      }
      return a.position - b.position;
    });
    
    return sortedResults.map((result: any) => this.mapToDomainEntity(result));
  }

  async delete(id: string): Promise<boolean> {
    await this.db.track.delete({
      where: { id },
    });
    return true;
  }
}
