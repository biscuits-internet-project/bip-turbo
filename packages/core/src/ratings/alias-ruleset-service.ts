import type { DbClient } from "../_shared/database/models";
import type { AliasRuleset } from "./rater-aliases";

/**
 * Loads the same-person merge rules from `rater_alias_groups`.
 *
 * The rules are data rather than code so the prod-only duplicate-account job can merge
 * an inbox it proved without a deploy, and so local mirrors prod's decisions through the
 * normal sync.
 *
 * Read fresh every time, deliberately. The callers are rating writes, the on-demand
 * per-rateable histogram, and the batch rebuild — not per-page-load work — and the
 * heaviest of them (`buildCanonicalUserMap`) already scans every user and groups every
 * rating on each call, so caching a handful of rows beside that would buy nothing and
 * could only serve a stale merge.
 */
export class AliasRulesetService {
  constructor(private readonly db: DbClient) {}

  /** The current merge rules, split into merge targets and hold-outs. */
  async get(): Promise<AliasRuleset> {
    const rows = await this.db.raterAliasGroup.findMany({
      select: { normalizedUsername: true, groupKey: true, merged: true },
    });

    const mergeRemap = new Map<string, string>();
    const heldOut = new Set<string>();
    for (const row of rows) {
      if (row.merged) mergeRemap.set(row.normalizedUsername, row.groupKey);
      else heldOut.add(row.normalizedUsername);
    }
    return { mergeRemap, heldOut };
  }

  /**
   * One page of merge rules for the local sync, newest-updated last. Every column is
   * safe to export: a rule names normalized usernames (already public), a reason code,
   * and at most a salted namespace fingerprint — never an email address. Syncing them
   * is what lets local dedupe ratings exactly as prod does, including the merges only
   * prod could discover.
   *
   * Same stable (updatedAt, id) cursor as the other `listForSync` exports, so rows
   * landing on identical timestamps are neither skipped nor re-fetched.
   */
  async listForSync(opts: { since: Date; cursorId?: string; cursorUpdatedAt?: Date; limit: number }): Promise<
    Array<{
      id: string;
      normalizedUsername: string;
      groupKey: string;
      merged: boolean;
      source: string;
      reasonCodes: string[];
      namespaceSignal: string | null;
      namespaceFingerprint: string | null;
      note: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const { since, cursorId, cursorUpdatedAt, limit } = opts;
    const where = cursorUpdatedAt
      ? {
          OR: [
            { updatedAt: { gt: cursorUpdatedAt } },
            { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: cursorId ?? "" } }] },
          ],
        }
      : { updatedAt: { gt: since } };
    return this.db.raterAliasGroup.findMany({
      where,
      orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
      take: limit,
      select: {
        id: true,
        normalizedUsername: true,
        groupKey: true,
        merged: true,
        source: true,
        reasonCodes: true,
        namespaceSignal: true,
        namespaceFingerprint: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
