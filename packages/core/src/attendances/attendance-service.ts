import type { Attendance, AttendanceWithUser, Logger } from "@bip/domain";
import type { QueryOptions } from "../_shared/database/types";
import type { AttendanceRepository } from "./attendance-repository";

export class AttendanceService {
  constructor(
    protected readonly repository: AttendanceRepository,
    protected readonly logger: Logger,
  ) {}

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findByShowId(showId: string): Promise<AttendanceWithUser[]> {
    return this.repository.findByShowId(showId);
  }

  async findByUserId(userId: string, options?: QueryOptions<Attendance>) {
    return this.repository.findByUserId(userId, options);
  }

  async findByUserIdAndShowId(userId: string, showId: string) {
    return this.repository.findByUserIdAndShowId(userId, showId);
  }

  async findManyByUserIdAndShowIds(userId: string, showIds: string[]) {
    return this.repository.findManyByUserIdAndShowIds(userId, showIds);
  }

  async create(data: { userId: string; showId: string }): Promise<Attendance> {
    return this.repository.create(data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
