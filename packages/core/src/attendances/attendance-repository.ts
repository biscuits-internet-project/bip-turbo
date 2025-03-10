import type { Attendance, AttendanceWithUser } from "@bip/domain";
import type { DbAttendance, DbClient, DbUser } from "../_shared/database/models";
import { buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { mapToUserMinimal } from "../users/user-repository";

export function mapAttendanceToDomainEntity(dbAttendance: DbAttendance): Attendance {
  const { createdAt, updatedAt, ...rest } = dbAttendance;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

export function mapAttendanceWithUser(dbAttendance: DbAttendance & { user: DbUser }): AttendanceWithUser {
  const { user, ...attendance } = dbAttendance;
  return {
    ...mapAttendanceToDomainEntity(attendance),
    user: mapToUserMinimal(user),
  };
}

export class AttendanceRepository {
  constructor(protected readonly db: DbClient) {}

  async findById(id: string): Promise<Attendance | null> {
    const result = await this.db.attendance.findUnique({
      where: { id },
    });
    return result ? mapAttendanceToDomainEntity(result) : null;
  }

  async findByShowId(showId: string): Promise<AttendanceWithUser[]> {
    const results = await this.db.attendance.findMany({
      where: { showId },
      include: {
        user: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return results.map((result) => mapAttendanceWithUser(result));
  }

  async findByUserId(userId: string, options?: QueryOptions<Attendance>): Promise<Attendance[]> {
    const orderBy = options?.sort ? buildOrderByClause(options.sort) : [{ createdAt: "desc" }];
    const skip =
      options?.pagination?.page && options?.pagination?.limit
        ? (options.pagination.page - 1) * options.pagination.limit
        : undefined;
    const take = options?.pagination?.limit;

    const results = await this.db.attendance.findMany({
      where: { userId },
      orderBy,
      skip,
      take,
    });

    return results.map((result) => mapAttendanceToDomainEntity(result));
  }

  async findByUserIdAndShowId(userId: string, showId: string): Promise<Attendance | null> {
    const result = await this.db.attendance.findFirst({
      where: { userId, showId },
    });
    return result ? mapAttendanceToDomainEntity(result) : null;
  }

  async findManyByUserIdAndShowIds(userId: string, showIds: string[]): Promise<Attendance[]> {
    const results = await this.db.attendance.findMany({
      where: { userId, showId: { in: showIds } },
    });
    return results.map((result) => mapAttendanceToDomainEntity(result));
  }

  async create(data: { userId: string; showId: string }): Promise<Attendance> {
    const result = await this.db.attendance.create({
      data: {
        userId: data.userId,
        showId: data.showId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return mapAttendanceToDomainEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.attendance.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
