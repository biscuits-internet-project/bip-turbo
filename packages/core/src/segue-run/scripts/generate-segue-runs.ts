#!/usr/bin/env bun

import { PrismaClient } from "@prisma/client";
import { SegueRunGeneratorService } from "../segue-run-generator-service";
import { testLogger as logger } from "../../_shared/test-logger";

async function main() {
  const db = new PrismaClient();
  const generatorService = new SegueRunGeneratorService(db, logger);

  try {
    logger.info("Starting SegueRun generation");
    
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    if (args.includes("--date-range")) {
      const startIndex = args.indexOf("--date-range");
      const startDate = args[startIndex + 1];
      const endDate = args[startIndex + 2];
      
      if (!startDate || !endDate) {
        throw new Error("Please provide start and end dates for --date-range");
      }
      
      await generatorService.generateSegueRunsForDateRange(startDate, endDate);
    } else {
      // Generate for all shows
      await generatorService.generateAllSegueRuns();
    }

    // Update search vectors
    await generatorService.updateSearchVectors();
    
    logger.info("SegueRun generation complete");
  } catch (error) {
    logger.error("Error generating SegueRuns", { error });
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();