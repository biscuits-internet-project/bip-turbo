import { describe, expect, test, vi } from "vitest";
import { runDuplicateAccountDetection } from "./detect-duplicate-accounts";

interface ExistingRow {
  normalizedUsername: string;
  groupKey: string;
  merged: boolean;
  source: string;
}

interface UserRow {
  id: string;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  confirmedAt: Date | null;
}

function user(overrides: Partial<UserRow> & Pick<UserRow, "id" | "username" | "email">): UserRow {
  return { firstName: null, lastName: null, confirmedAt: new Date("2022-01-01"), ...overrides };
}

function makeDb(users: UserRow[], existing: ExistingRow[] = []) {
  return {
    user: { findMany: vi.fn().mockResolvedValue(users) },
    raterAliasGroup: {
      findMany: vi.fn().mockResolvedValue(existing),
      createMany: vi.fn().mockImplementation(({ data }) => Promise.resolve({ count: data.length })),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    ratingSettings: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
  };
}

/** The rows a run handed to createMany, flattened across calls. */
function writtenRows(db: ReturnType<typeof makeDb>) {
  return db.raterAliasGroup.createMany.mock.calls.flatMap((call) => call[0].data);
}

const sharedInboxTrio = [
  user({ id: "u1", username: "Munchkin ", email: "basis@spaga.33mail.com" }),
  user({ id: "u2", username: "Confrontation", email: "Helicopters@spaga.33mail.com" }),
  user({ id: "u3", username: "Triumph", email: "Svenghali@spaga.33mail.com" }),
];

describe("runDuplicateAccountDetection", () => {
  test("writes a row per member of a newly detected shared inbox", async () => {
    const db = makeDb(sharedInboxTrio);

    const result = await runDuplicateAccountDetection({
      db: db as never,
      namespaceSalt: "pepper",
    });

    expect(result.accountsScanned).toBe(3);
    expect(result.groupsDetected).toBe(1);
    expect(result.rowsWritten).toBe(3);
    const rows = writtenRows(db);
    expect(rows.map((row) => row.normalizedUsername).sort()).toEqual(["confrontation", "munchkin", "triumph"]);
    for (const row of rows) {
      // The alphabetically-first normalized name is the group's representative.
      expect(row.groupKey).toBe("confrontation");
      expect(row.merged).toBe(true);
      expect(row.source).toBe("email_detector");
      expect(row.reasonCodes).toEqual(["shared-alias-namespace"]);
      expect(row.namespaceSignal).toBe("shared-33mail-subdomain");
      expect(row.namespaceFingerprint).toMatch(/^[0-9a-f]{12}$/);
    }
  });

  // A merge only matters once the denormalized aggregates are rebuilt, and that
  // recompute is dirty-gated. Without this the columns keep serving pre-merge numbers
  // until some unrelated rating write happens to dirty the flag.
  test("dirties the rating recompute after writing", async () => {
    const db = makeDb(sharedInboxTrio);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.ratingsDirtied).toBe(true);
    expect(db.ratingSettings.updateMany).toHaveBeenCalledWith({ data: { ratingsDirty: true } });
  });

  // The curated rules already cover this trio, so a re-run must be inert — no
  // duplicate rows, and above all no needless full rating recompute every week.
  test("a group already covered by existing rules writes nothing and leaves ratings clean", async () => {
    const db = makeDb(sharedInboxTrio, [
      { normalizedUsername: "munchkin", groupKey: "confrontation", merged: true, source: "curated" },
      { normalizedUsername: "confrontation", groupKey: "confrontation", merged: true, source: "curated" },
      { normalizedUsername: "triumph", groupKey: "confrontation", merged: true, source: "curated" },
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.groupsDetected).toBe(1);
    expect(result.rowsWritten).toBe(0);
    expect(result.ratingsDirtied).toBe(false);
    expect(db.raterAliasGroup.createMany).not.toHaveBeenCalled();
    expect(db.ratingSettings.updateMany).not.toHaveBeenCalled();
  });

  // Splitting one person across two identity keys would defeat the whole point, so a
  // partially-known group joins the key its known member already folds to.
  test("new members adopt the group key of a member that already has a rule", async () => {
    const db = makeDb(sharedInboxTrio, [
      { normalizedUsername: "confrontation", groupKey: "confrontation", merged: true, source: "curated" },
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.rowsWritten).toBe(2);
    const rows = writtenRows(db);
    expect(rows.map((row) => row.normalizedUsername).sort()).toEqual(["munchkin", "triumph"]);
    expect(rows.every((row) => row.groupKey === "confrontation")).toBe(true);
  });

  // A hold-out is a human decision that the accounts may be different people. Email
  // evidence that touches one must not quietly overturn it.
  test("a group containing a held-out name is skipped entirely", async () => {
    const db = makeDb(sharedInboxTrio, [
      { normalizedUsername: "confrontation", groupKey: "confrontation", merged: false, source: "curated" },
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.rowsWritten).toBe(0);
    expect(result.groupsSkippedHeldOut).toBe(1);
    expect(db.raterAliasGroup.createMany).not.toHaveBeenCalled();
  });

  // Joining two established identities means editing an existing row, which this job
  // never does — it only adds. Surface it as a count for a human instead.
  test("a group whose known members disagree on identity is skipped as a conflict", async () => {
    const db = makeDb(sharedInboxTrio, [
      { normalizedUsername: "confrontation", groupKey: "confrontation", merged: true, source: "curated" },
      { normalizedUsername: "triumph", groupKey: "somebodyelse", merged: true, source: "curated" },
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.rowsWritten).toBe(0);
    expect(result.groupsSkippedConflict).toBe(1);
  });

  test("a detector row whose evidence is gone is pruned and dirties ratings", async () => {
    const db = makeDb(
      [user({ id: "u1", username: "Solo", email: "solo@gmail.com" })],
      [{ normalizedUsername: "stalename", groupKey: "stalename", merged: true, source: "email_detector" }],
    );
    db.raterAliasGroup.deleteMany.mockResolvedValue({ count: 1 });

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.rowsPruned).toBe(1);
    expect(result.ratingsDirtied).toBe(true);
    expect(db.raterAliasGroup.deleteMany).toHaveBeenCalledWith({
      where: { source: "email_detector", normalizedUsername: { in: ["stalename"] } },
    });
  });

  test("curated rows are never pruned, however stale they look", async () => {
    const db = makeDb(
      [user({ id: "u1", username: "Solo", email: "solo@gmail.com" })],
      [{ normalizedUsername: "highwire", groupKey: "highwire", merged: true, source: "curated" }],
    );

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.rowsPruned).toBe(0);
    expect(db.raterAliasGroup.deleteMany).not.toHaveBeenCalled();
  });

  test("tallies reason codes across groups", async () => {
    const db = makeDb([
      ...sharedInboxTrio,
      user({ id: "u4", username: "Robots", email: "nug.huffer@gmail.com", confirmedAt: null }),
      user({ id: "u5", username: "Morph", email: "nughuffer+db@gmail.com" }),
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result.groupsDetected).toBe(2);
    expect(result.reasonCodeCounts).toEqual({
      "shared-alias-namespace": 1,
      "shared-normalized-mailbox": 1,
      "unconfirmed-member": 1,
    });
  });

  test("nothing detected is a clean no-op", async () => {
    const db = makeDb([
      user({ id: "u1", username: "Overture", email: "crickets@yahoo.com" }),
      user({ id: "u2", username: "Voices", email: "reactor@protonmail.com" }),
    ]);

    const result = await runDuplicateAccountDetection({ db: db as never });

    expect(result).toMatchObject({ groupsDetected: 0, rowsWritten: 0, rowsPruned: 0, ratingsDirtied: false });
  });

  // This result is what reaches a world-readable Actions log and the HTTP response,
  // so it must be counts only — no address, no username, no user id.
  test("the result carries no identifying detail at all", async () => {
    const db = makeDb(sharedInboxTrio);

    const result = await runDuplicateAccountDetection({
      db: db as never,
      namespaceSalt: "pepper",
    });

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("@");
    for (const fragment of ["basis", "spaga", "Munchkin", "munchkin", "Confrontation", "u1", "u2", "u3"]) {
      expect(serialized).not.toContain(fragment);
    }
  });

  // The log line is the other thing published to a public run log.
  test("the logged summary carries no identifying detail either", async () => {
    const db = makeDb(sharedInboxTrio);
    const logger = { info: vi.fn() };

    await runDuplicateAccountDetection({ db: db as never, logger });

    expect(logger.info).toHaveBeenCalled();
    for (const [message] of logger.info.mock.calls) {
      expect(message).not.toContain("@");
      expect(message.toLowerCase()).not.toContain("munchkin");
      expect(message.toLowerCase()).not.toContain("confrontation");
    }
  });

  // Only the fields the detection actually needs may be read off `users`; widening the
  // projection is how an address or a real name leaks somewhere it shouldn't.
  test("reads only the account fields the detection needs", async () => {
    const db = makeDb(sharedInboxTrio);

    await runDuplicateAccountDetection({ db: db as never });

    expect(db.user.findMany).toHaveBeenCalledWith({
      select: { id: true, username: true, email: true, firstName: true, lastName: true, confirmedAt: true },
    });
  });
});
