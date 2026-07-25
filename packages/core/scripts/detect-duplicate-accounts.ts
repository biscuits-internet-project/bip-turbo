import prisma from "../src/_shared/prisma/client";
import { createTestLogger } from "../src/_shared/test-logger";
import {
  runDuplicateAccountDetection,
  summarizeDuplicateAccountDetection,
} from "../src/ratings/detect-duplicate-accounts";

/**
 * Shared-inbox detection for duplicate rater accounts, runnable via
 * `make detect-duplicate-accounts`. The same routine the cron endpoint
 * (/api/cron/detect-duplicate-accounts) runs, so a local run against a prod restore
 * exercises exactly what production will do.
 *
 * Locally it only sees the addresses the last dump carried — accounts newer than that
 * are stubbed as `stub-<id>@local.invalid` and deliberately group with nothing — so a
 * local run is a lower bound on what prod finds, never a different answer.
 *
 * Prints counts only. Never print a group's members: the same summary goes to a GitHub
 * Actions log on a public repository.
 */
async function main(): Promise<void> {
  const logger = createTestLogger();

  try {
    const result = await runDuplicateAccountDetection({
      db: prisma,
      namespaceSalt: process.env.DUPLICATE_ACCOUNT_HASH_SALT,
      logger,
    });
    console.log(summarizeDuplicateAccountDetection(result));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("detect-duplicate-accounts failed:", error);
  process.exit(1);
});
