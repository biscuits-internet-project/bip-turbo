import type { Logger } from "@bip/domain";
import type { DbClient } from "../_shared/database/models";
import { groupByInbox, type IdentityReasonCode } from "./email-identity-signals";

/** Marks the rows this job owns, so a curated decision is never pruned or overwritten. */
const DETECTOR_SOURCE = "email_detector";

export interface DetectDuplicateAccountsDeps {
  db: DbClient;
  /** Salts the published namespace fingerprint. Absent ⇒ no fingerprint. */
  namespaceSalt?: string;
  logger?: Pick<Logger, "info">;
}

/**
 * Counts only. This is the HTTP response body AND the line that lands in a GitHub
 * Actions run log on a public repository, so it deliberately carries no username, user
 * id, or anything derived from an email address.
 */
export interface DetectDuplicateAccountsResult {
  accountsScanned: number;
  groupsDetected: number;
  rowsWritten: number;
  rowsPruned: number;
  /** Groups left alone because a member is deliberately held out of merging. */
  groupsSkippedHeldOut: number;
  /** Groups left alone because their known members fold to different identities. */
  groupsSkippedConflict: number;
  reasonCodeCounts: Partial<Record<IdentityReasonCode, number>>;
  ratingsDirtied: boolean;
}

/**
 * The prod-only half of duplicate-account detection: group rater accounts that
 * demonstrably share one email inbox and record the merge in `rater_alias_groups`.
 *
 * This has to run in production because the MCP sync feed is deliberately non-PII —
 * `email` and the entered name exist nowhere else — and it merges immediately rather
 * than queueing for review, because a reviewer who can never see the address has no way
 * to confirm it. The evidence bar is the safeguard: see `email-identity-signals` for
 * what is allowed to form a group.
 *
 * The job only ever ADDS rules. It never edits or deletes a `curated` row, never
 * overturns a hold-out, and skips any group whose known members already fold to
 * different identities — those need a human, and are surfaced as counts.
 */
export async function runDuplicateAccountDetection({
  db,
  namespaceSalt,
  logger,
}: DetectDuplicateAccountsDeps): Promise<DetectDuplicateAccountsResult> {
  const accounts = await db.user.findMany({
    select: { id: true, username: true, email: true, firstName: true, lastName: true, confirmedAt: true },
  });

  const groups = groupByInbox({
    accounts: accounts.map((account) => ({
      userId: account.id,
      username: account.username,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      emailConfirmed: account.confirmedAt !== null,
    })),
    namespaceSalt,
  });

  const existingRows = await db.raterAliasGroup.findMany({
    select: { normalizedUsername: true, groupKey: true, merged: true, source: true },
  });
  const existingByUsername = new Map(existingRows.map((row) => [row.normalizedUsername, row]));

  const reasonCodeCounts: Partial<Record<IdentityReasonCode, number>> = {};
  for (const group of groups) {
    for (const code of group.reasonCodes) reasonCodeCounts[code] = (reasonCodeCounts[code] ?? 0) + 1;
  }

  const newRows: Array<{
    normalizedUsername: string;
    groupKey: string;
    merged: boolean;
    source: string;
    reasonCodes: string[];
    namespaceSignal: string | null;
    namespaceFingerprint: string | null;
  }> = [];
  let groupsSkippedHeldOut = 0;
  let groupsSkippedConflict = 0;

  for (const group of groups) {
    const known = group.normalizedUsernames
      .map((normalizedUsername) => existingByUsername.get(normalizedUsername))
      .filter((row): row is (typeof existingRows)[number] => row !== undefined);

    // A hold-out records a human's judgement that these accounts may be different
    // people; email evidence touching one of them doesn't get to overturn that.
    if (known.some((row) => !row.merged)) {
      groupsSkippedHeldOut++;
      continue;
    }
    // Folding two established identities together would mean rewriting an existing
    // row, which this job never does.
    const knownKeys = new Set(known.map((row) => row.groupKey));
    if (knownKeys.size > 1) {
      groupsSkippedConflict++;
      continue;
    }

    // New members join the identity a known member already folds to, so a partially
    // recorded group can't end up split across two keys.
    const groupKey = knownKeys.size === 1 ? [...knownKeys][0] : group.groupKey;
    for (const normalizedUsername of group.normalizedUsernames) {
      if (existingByUsername.has(normalizedUsername)) continue;
      newRows.push({
        normalizedUsername,
        groupKey,
        merged: true,
        source: DETECTOR_SOURCE,
        reasonCodes: [...group.reasonCodes],
        namespaceSignal: group.namespaceSignal,
        namespaceFingerprint: group.namespaceFingerprint,
      });
    }
  }

  let rowsWritten = 0;
  if (newRows.length > 0) {
    // skipDuplicates so a concurrent run (or a curated row added between the read and
    // the write) can't fail the whole job on the unique key.
    const { count } = await db.raterAliasGroup.createMany({ data: newRows, skipDuplicates: true });
    rowsWritten = count;
  }

  // Prune only rows this job owns, and only when the evidence behind them is gone (a
  // member changed their address, so the shared inbox no longer exists).
  const detectedUsernames = new Set(groups.flatMap((group) => group.normalizedUsernames));
  const staleUsernames = existingRows
    .filter((row) => row.source === DETECTOR_SOURCE && !detectedUsernames.has(row.normalizedUsername))
    .map((row) => row.normalizedUsername);
  let rowsPruned = 0;
  if (staleUsernames.length > 0) {
    const { count } = await db.raterAliasGroup.deleteMany({
      where: { source: DETECTOR_SOURCE, normalizedUsername: { in: staleUsernames } },
    });
    rowsPruned = count;
  }

  // A changed rule regroups votes, but only `runRatingsRecompute` rewrites the
  // denormalized averages and calibrated scores, and it is dirty-gated. Skipping this
  // leaves every affected page serving pre-merge numbers indefinitely.
  const ratingsDirtied = rowsWritten > 0 || rowsPruned > 0;
  if (ratingsDirtied) {
    await db.ratingSettings.updateMany({ data: { ratingsDirty: true } });
  }

  const result: DetectDuplicateAccountsResult = {
    accountsScanned: accounts.length,
    groupsDetected: groups.length,
    rowsWritten,
    rowsPruned,
    groupsSkippedHeldOut,
    groupsSkippedConflict,
    reasonCodeCounts,
    ratingsDirtied,
  };
  logger?.info(summarizeDuplicateAccountDetection(result));
  return result;
}

/** The one published sentence: counts and reason codes, never who. */
export function summarizeDuplicateAccountDetection(result: DetectDuplicateAccountsResult): string {
  const reasons = Object.entries(result.reasonCodeCounts)
    .map(([code, count]) => `${code} ${count}`)
    .join(", ");
  return [
    `Scanned ${result.accountsScanned} accounts`,
    `detected ${result.groupsDetected} shared-inbox groups`,
    `wrote ${result.rowsWritten} rules`,
    `pruned ${result.rowsPruned}`,
    `skipped ${result.groupsSkippedHeldOut} held-out and ${result.groupsSkippedConflict} conflicting`,
    reasons ? `reasons: ${reasons}` : "no reasons",
    result.ratingsDirtied ? "ratings flagged for recompute" : "ratings unchanged",
  ].join("; ");
}
